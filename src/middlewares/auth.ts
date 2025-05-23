import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
export interface TokenPayload {
    user_id: string;
    exp: number;
    iat: number;
}

export const authenticate: RequestHandler = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization as string;
        const accessToken = authHeader.split(' ')[1];

        if (!accessToken) {
            res.status(401).json({ message: 'Not Found AccessToken' });
            return;
        }

        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET as string,
            (err, decodedAccessToken) => {
                if (err) {
                    res.status(401).json({
                        message: 'AccessToken expired',
                    });
                    return;
                } else {
                    req.user = decodedAccessToken as TokenPayload;
                    req.token = accessToken;
                    next();
                }
            }
        );
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};
