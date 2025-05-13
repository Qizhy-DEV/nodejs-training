import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export class AuthService {
    static generateTokens = ({ user_id, remainTime }: { user_id: string; remainTime?: string }) => {
        const accessToken = generateAccessToken(user_id);

        const refreshToken = generateRefreshToken({ user_id, remainTime });

        return {
            accessToken,
            refreshToken,
        };
    };
}
