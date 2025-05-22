import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { AuthService } from '../services/authService';

export interface TokenPayload {
    user_id: string;
    exp: number;
    iat: number;
}

export const authenticate: RequestHandler = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization as string;
        const refreshToken = req.cookies.refreshToken as string;
        const accessToken = authHeader.split(' ')[1];

        if (!authHeader || !refreshToken) {
            res.status(400).json({
                message: 'Thiếu thông tin xác thực',
                error: 'Thiếu Authorization hoặc refresh token',
            });
            return;
        }

        if (!accessToken) {
            res.status(401).json({
                message: 'Thiếu token truy cập',
                error: 'Authorization token không có trong header',
            });
            return;
        }

        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET as string,
            (err, decodedAccessToken) => {
                if (err) {
                    jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET as string,
                        async (error, decodedRefreshToken) => {
                            if (error) {
                                res.status(401).json({
                                    message: 'Refresh token hết hạn, vui lòng đăng nhập lại',
                                    error: 'Refresh token hết hạn hoặc không hợp lệ',
                                });
                                return;
                            }

                            const expR = (decodedRefreshToken as TokenPayload).exp * 1000;
                            const currentTimestamp = Date.now();
                            const remainTime = `${(expR - currentTimestamp) / 1000}s`;

                            try {
                                const newTokens = await AuthService.generateTokens({
                                    user_id: (decodedRefreshToken as TokenPayload).user_id,
                                    remainTime,
                                });

                                req.user = decodedRefreshToken as TokenPayload;
                                req.token = newTokens.accessToken;
                                return next();
                            } catch {
                                res.status(500).json({
                                    message: 'Không thể tạo mới token',
                                    error: 'Lỗi khi tạo mới token',
                                });
                                return;
                            }
                        }
                    );
                } else {
                    req.user = decodedAccessToken as TokenPayload;
                    req.token = accessToken;
                    next();
                }
            }
        );
    } catch (error) {
        console.error('Lỗi khi xác thực token:', error);
        res.status(500).json({
            message: 'Lỗi hệ thống',
            error: 'Đã xảy ra lỗi không mong muốn trong quá trình xác thực token',
        });
    }
};
