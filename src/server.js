import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { initMongoConnection } from './db/initMongoConnection.js';
import { getContacts, getContactById } from './services/contact.js';

const app = express();
const PORT = process.env.PORT || 3000;



export const setupServer = async () => {
  try {
    await initMongoConnection();
    console.log('MongoDB connection established successfully!');

    app.use(cors());
    app.use(express.json());
    app.use(
        pino({
          transport: {
            target: 'pino-pretty',
          },
        }),
      );

    app.get('/contacts', async (req, res) => {
      try {
          const contacts = await getContacts();
          res.status(200).json({
              status: 200,
              message: "Successfully found contacts!",
              data: contacts
          });
      } catch (error) {
          res.status(500).json({
              status: 500,
              message: error.message
          });
      }
  });
  
  app.get('/contacts/:id', async (req, res) => {
      try {
          const { id } = req.params;
          const contact = await getContactById(id);
          if (!contact) {
              return res.status(404).json({ status: 404, message: "Contact not found" });
          }
          res.status(200).json({
              status: 200,
              message: `Successfully found contact with id ${id}!`,
              data: contact
          });
      } catch (error) {
          res.status(500).json({
              status: 500,
              message: error.message
          });
      }
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during server setup:', error);
  }
};
