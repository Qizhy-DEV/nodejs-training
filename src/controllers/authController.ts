import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import dotenv from 'dotenv';
import ms from 'ms';
import { responseAPI } from '../utils/response';

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

            const refreshTokenExpires = process.env.REFRESH_TOKEN_EXPIRES || '7d';

            const maxAge = ms(refreshTokenExpires as ms.StringValue);

            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: maxAge,
            });

            res.status(200).json(
                responseAPI({
                    message: 'Login successfully',
                    data: result.data,
                    token: result.tokens.accessToken,
                })
            );
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    };
}
