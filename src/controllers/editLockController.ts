import { Request, Response } from 'express';
import { responseAPI } from '../utils/response';
import { EditLockService } from '../services/editLockService';

export class EditLockController {
    private editLockService: EditLockService;

    constructor() {
        this.editLockService = new EditLockService();
    }

    getByUser = async (req: Request, res: Response) => {
        try {
            const token = req.token as string;

            const userId = req.user?.user_id;

            // const result = await this.editLockService.getByUser(userId);

            res.status(200).json(
                responseAPI({
                    data: userId,
                    token,
                })
            );
        } catch (error) {
            const err = error as Error;
            res.status(400).json({ message: err.message });
        }
    };

    requestEdit = async (req: Request, res: Response) => {
        try {
            const token = req.token as string;

            const eventId = req.params.eventId as string;

            const userId = req.user?.user_id as string;

            const result = await this.editLockService.requestEdit(userId, eventId);

            res.status(200).json(
                responseAPI({
                    message: 'Request edit event successfully',
                    data: result,
                    token,
                })
            );
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    releaseEdit = async (req: Request, res: Response) => {
        try {
            const token = req.token as string;

            const eventId = req.params.eventId as string;

            const userId = req.user?.user_id as string;

            const result = await this.editLockService.releaseEdit(userId, eventId);

            res.status(200).json(
                responseAPI({
                    message: 'Release edit event successfully',
                    data: result,
                    token,
                })
            );
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    maintainEdit = async (req: Request, res: Response) => {
        try {
            const token = req.token as string;

            const eventId = req.params.eventId as string;

            const userId = req.user?.user_id as string;

            const result = await this.editLockService.maintainEdit(userId, eventId);

            res.status(200).json(
                responseAPI({
                    message: 'Maintain edit event successfully',
                    data: result,
                    token,
                })
            );
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };
}
