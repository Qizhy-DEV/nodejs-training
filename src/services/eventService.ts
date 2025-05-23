import Event, { IEvent } from '../models/event';
import { changeIdAttribute } from '../utils/global';

interface Filter {
    limit: number;
    page: number;
}

interface PaginationResult<T> {
    pagination: {
        limit: number;
        page: number;
        total: number;
        totalPage: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    data: T;
}

export class EventService {
    create = async (event: Omit<IEvent, 'id'>): Promise<IEvent> => {
        const newEvent = await Event.create(event);
        return changeIdAttribute<IEvent>(newEvent.toObject());
    };

    getEventById = async (id: string): Promise<IEvent | null> => {
        const eventFound = await Event.findById(id);
        return changeIdAttribute<IEvent>(eventFound?.toObject());
    };

    getEvents = async (filter: Filter): Promise<PaginationResult<IEvent[]>> => {
        const { limit, page } = filter;
        const total = await Event.countDocuments();
        const events = await Event.find()
            .skip(limit * (page - 1))
            .limit(limit)
            .lean();

        const transformedEvents = events.map(event => ({
            ...event,
            id: event._id.toString(),
            _id: undefined,
        }));

        return {
            pagination: {
                limit,
                page,
                total,
                totalPage: Math.floor(total / limit) + (total % limit > 0 ? 1 : 0),
                hasNext: total > limit * page,
                hasPrev: page > 1,
            },
            data: transformedEvents,
        };
    };

    getEventEditingByUser = async (userId: string): Promise<IEvent> => {
        const result = await Event.findOne({
            'editing.userId': userId,
            'editing.expire': { $gt: Date.now() },
        }).lean();
        if (!result) throw new Error('User is not currently editing any event.');
        return changeIdAttribute(result);
    };

    requestEdit = async (userId: string, eventId: string): Promise<IEvent> => {
        const event = await Event.findOne({ _id: eventId });

        if (!event) throw new Error('Edit lock not found');

        if (event.editing.expire > Date.now()) {
            throw new Error("You can't edit this event because someone else is editing it.");
        }

        const expireTime = Date.now() + 5 * 60 * 1000;

        event.editing.userId = userId;
        event.editing.expire = expireTime;

        await event.save();

        return changeIdAttribute(event.toObject());
    };

    releaseEdit = async (userId: string, eventId: string): Promise<IEvent> => {
        const event = await Event.findOne({ _id: eventId, 'editing.userId': userId });

        if (!event) throw new Error('Edit lock not found');

        event.editing.userId = null;
        event.editing.expire = 0;

        await event.save();

        return changeIdAttribute(event.toObject());
    };

    maintainEdit = async (userId: string, eventId: string): Promise<IEvent> => {
        const event = await Event.findOne({ _id: eventId, 'editing.userId': userId });

        if (!event) throw new Error('Edit lock not found');

        const expireTime = Date.now() + 5 * 30 * 1000;

        event.editing.expire = expireTime;

        event.editing.userId = userId;

        await event.save();

        return changeIdAttribute(event.toObject());
    };
}
