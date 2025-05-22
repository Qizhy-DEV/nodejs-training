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
    create = async (event: IEvent): Promise<IEvent> => {
        const newEvent = await Event.create(event);
        return changeIdAttribute<IEvent>(newEvent);
    };

    getEventById = async (id: string): Promise<IEvent | null> => {
        const eventFound = await Event.findById(id);
        return changeIdAttribute<IEvent>(eventFound);
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
}
