import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db';
import { TokenPayload } from './middlewares/auth';
import voucherRoutes from './routes/voucherRoutes';

declare module 'express-serve-static-core' {
    interface Request {
        tokens?: {
            accessToken: string;
            refreshToken: string;
        };
        user?: TokenPayload;
    }
    interface Response {
        status(code: number): this;
    }
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const baseURL = 'http://localhost:3000';

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan('dev'));
app.use(compression());

connectDB();

const corsOptions = {
    origin: [baseURL],
    allowedHeaders: ['Content-Type', 'x-refresh-token', 'authorization'],
};
app.use(cors(corsOptions));

app.use('/api/v1/vouchers', voucherRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
