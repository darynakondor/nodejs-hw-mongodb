import pino from "pino";
import { pinoHttp } from "pino-http";
import express from 'express';
import cors from 'cors'
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import cookieParser from 'cookie-parser';
const logger = pino();
const pinoMiddleware = pinoHttp({ logger });

export function setupServer() {
    const app = express();
    app.use(cookieParser());
    app.use(cors());
    app.use(pinoMiddleware);
    app.use(express.json())

    app.use('/contacts', contactsRouter);
    app.use('/auth', authRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
  
    const PORT = process.env.PORT || 3000;
  
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  
    return app;
}
  