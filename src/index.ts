import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db';
import { TokenPayload } from './middlewares/auth';
import router from './routes';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

declare module 'express-serve-static-core' {
    interface Request {
        token?: string;
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

// Swagger config
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API',
            version: '1.0.0',
            description: 'API Documentation',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());

connectDB();

const corsOptions = {
    origin: [baseURL],
    allowedHeaders: ['Content-Type', 'x-refresh-token', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
