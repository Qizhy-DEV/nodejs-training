import { TokenPayload } from '../middlewares/auth';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { UserService } from './userService';
import jwt from 'jsonwebtoken';

interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public static generateTokens = ({
        user_id,
        remainTime,
    }: {
        user_id: string;
        remainTime?: string;
    }): Tokens => {
        const accessToken = generateAccessToken(user_id);

        const refreshToken = generateRefreshToken({ user_id, remainTime });

        return {
            accessToken,
            refreshToken,
        };
    };

    refreshNewTokens = (refreshToken: string): Promise<Tokens> => {
        return new Promise((resolve, reject) => {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string,
                (err, decodedRefreshToken) => {
                    if (err) {
                        return reject(new Error('RefreshToken expired'));
                    }

                    const expR = (decodedRefreshToken as TokenPayload).exp * 1000;
                    const currentTimestamp = Date.now();
                    const remainTime = `${(expR - currentTimestamp) / 1000}s`;

                    const tokens = AuthService.generateTokens({
                        user_id: (decodedRefreshToken as TokenPayload).user_id,
                        remainTime,
                    });

                    resolve(tokens);
                }
            );
        });
    };

    login = async (username: string, password: string) => {
        const user = await this.userService.getByUserNameAndPassword(username, password);

        const tokens = AuthService.generateTokens({ user_id: user.id });

        return {
            data: user,
            tokens,
        };
    };
}
