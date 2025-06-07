import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { uploadImagesToCloudinary } from '../helper/upload/upload';

export class EventController {
    private eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }

    create = async (req: Request, res: Response) => {
        try {
            const event = req.body;
            if (!req.files || !Array.isArray(req.files)) {
                throw new Error('No files uploaded.');
            }
            const images = await uploadImagesToCloudinary(req.files);
            const result = await this.eventService.create({ ...event, image: images[0] });
            res.status(200).json({ message: 'Create event successfully', data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    getEventById = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const result = await this.eventService.getEventById(id);
            res.status(200).json({ data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    getEvents = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        try {
            const result = await this.eventService.getEvents({ page, limit });
            res.status(200).json({ data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    getByUser = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.user_id as string;

            const result = await this.eventService.getEventEditingByUser(userId);

            res.status(200).json({ data: result });
        } catch (error) {
            const err = error as Error;
            console.log(error);
            res.status(400).json({ message: err.message });
        }
    };

    requestEdit = async (req: Request, res: Response) => {
        try {
            const eventId = req.params.eventId as string;

            const userId = req.user?.user_id as string;

            const result = await this.eventService.requestEdit(userId, eventId);

            res.status(200).json({ message: 'Request edit event successfully', data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    releaseEdit = async (req: Request, res: Response) => {
        try {
            const eventId = req.params.eventId as string;

            const userId = req.user?.user_id as string;

            const result = await this.eventService.releaseEdit(userId, eventId);

            res.status(200).json({ message: 'Release edit event successfully', data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    maintainEdit = async (req: Request, res: Response) => {
        try {
            const eventId = req.params.eventId as string;

            const userId = req.user?.user_id as string;

            const result = await this.eventService.maintainEdit(userId, eventId);

            res.status(200).json({ message: 'Maintain edit event successfully', data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };
}
