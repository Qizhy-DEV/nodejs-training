import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import dotenv from 'dotenv';

dotenv.config();

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    login = async (req: Request, res: Response) => {
        try {
            const username = req.body.username as string;

            const password = req.body.password as string;

            const result = await this.authService.login(username, password);

            res.status(200).json({
                message: 'Login successfully',
                data: result,
            });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };

    refreshNewTokens = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.body.refreshToken as string;

            const result = await this.authService.refreshNewTokens(refreshToken);
            res.status(200).json({ data: result });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };
}
