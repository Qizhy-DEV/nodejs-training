import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    create = async (req: Request, res: Response) => {
        try {
            const username = req.body.username as string;

            const password = req.body.password as string;

            const fullName = req.body.fullName as string;

            const result = await this.userService.create({ username, password, fullName });

            res.status(200).json({ message: 'Create user successfully', data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    getByToken = async (req: Request, res: Response) => {
        try {
            const user_id = req.user?.user_id as string;

            const result = await this.userService.getById(user_id);

            res.status(200).json({ data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };
}
