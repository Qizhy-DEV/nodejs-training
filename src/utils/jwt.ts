import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_TOKEN_EXPIRES = (process.env.REFRESH_TOKEN_EXPIRES as string) || '10y';
const ACCESS_TOKEN_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES as string) || '1y';

export const generateAccessToken = (user_id: string): string => {
    return jwt.sign({ user_id }, ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES,
    } as jwt.SignOptions);
};

export const generateRefreshToken = ({
    user_id,
    remainTime,
}: {
    user_id: string;
    remainTime?: string;
}): string => {
    return jwt.sign({ user_id }, REFRESH_SECRET, {
        expiresIn: remainTime ? remainTime : REFRESH_TOKEN_EXPIRES,
    } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET);
};
