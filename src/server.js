import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { initMongoConnection } from './db/initMongoConnection.js';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOADS_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';


const app = express();
const PORT = Number(getEnvVar('PORT', '4000'));

export const setupServer = async () => {
  try {
    await initMongoConnection();
    console.log('MongoDB connection established successfully!');

    app.use(cors());
    app.use(express.json());
    app.use('/uploads', express.static(UPLOADS_DIR));
    app.use('/api-docs', swaggerDocs())
    app.use(cookieParser());
    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );

    
    app.use(router);

    app.use('*', notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during server setup:', error);
  }
};
