import pino from "pino";
import { pinoHttp } from "pino-http";
import express from 'express';
import cors from 'cors'
import contactsRouter from './routes/contacts.js';
const logger = pino();
const pinoMiddleware = pinoHttp({ logger });

export function setupServer() {
    const app = express();
    app.use(cors());
    app.use(pinoMiddleware);
    app.use('/contacts', contactsRouter);
  
    app.use((req, res, next) => {
      res.status(404).json({ message: 'Not found' });
    });
  
    const PORT = process.env.PORT || 3000;
  
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  
    return app;
}
  