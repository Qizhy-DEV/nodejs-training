import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { UserService } from './userService';

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
    }) => {
        const accessToken = generateAccessToken(user_id);

        const refreshToken = generateRefreshToken({ user_id, remainTime });

        return {
            accessToken,
            refreshToken,
        };
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
