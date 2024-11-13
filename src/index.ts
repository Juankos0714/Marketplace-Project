import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes';
import videogameRoutes from './routes/videogame.routes';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videogames', videogameRoutes);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log('TypeORM connection error: ', error));