import mongoose from 'mongoose';
import { connectTestDB, disconnectTestDB } from '../configs/setupTestDB';
import Event from '../models/event';
import { EventService } from '../services/eventService';

const eventService = new EventService();

describe('Event Model Test', () => {
    const testEvent = {
        name: 'Nocturne Live',
        maxQuantity: 10,
    };

    let eventId = '';

    beforeAll(async () => {
        await connectTestDB();
    });

    beforeEach(async () => {
        const eventCreated = await Event.create({
            name: testEvent.name,
            maxQuantity: testEvent.maxQuantity,
        });
        eventId = eventCreated._id.toString();
    });

    afterEach(async () => {
        // Clear DB after each test
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    it('should create & save a event successfully', async () => {
        const eventData = {
            name: testEvent.name,
            maxQuantity: testEvent.maxQuantity,
        };
        const savedEvent = await eventService.create(eventData);

        expect(savedEvent.name).toBe(savedEvent.name);
        expect(savedEvent.maxQuantity).toBe(savedEvent.maxQuantity);
        expect(savedEvent).toHaveProperty('image');
        expect(savedEvent.voucherCount).toBe(0);
    });

    it('should return event by id', async () => {
        const eventFound = await eventService.getEventById(eventId);

        expect(eventFound).toHaveProperty('image');
        expect(eventFound).toHaveProperty('name');
        expect(eventFound).toHaveProperty('maxQuantity');
        expect(eventFound).toHaveProperty('voucherCount');
    });
});
