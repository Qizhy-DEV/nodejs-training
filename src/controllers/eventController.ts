import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { uploadImagesToCloudinary } from '../helper/upload/upload';
import { responseAPI } from '../utils/response';
import { EditLockService } from '../services/editLockService';

export class EventController {
    private eventService: EventService;
    private editLockService: EditLockService;

    constructor() {
        this.eventService = new EventService();
        this.editLockService = new EditLockService();
    }

    create = async (req: Request, res: Response) => {
        try {
            const event = req.body;
            if (!req.files || !Array.isArray(req.files)) {
                throw new Error('No files uploaded.');
            }
            const images = await uploadImagesToCloudinary(req.files);
            const result = await this.eventService.create({ ...event, image: images[0] });
            await this.editLockService.create(result._id as string);
            res.status(200).json(
                responseAPI({ message: 'Create event successfully', data: result })
            );
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    getEventById = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const result = await this.eventService.getEventById(id);
            res.status(200).json(responseAPI({ data: result }));
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
            res.status(200).json(responseAPI({ data: result }));
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };
}
