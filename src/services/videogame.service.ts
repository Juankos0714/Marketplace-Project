import 'reflect-metadata';
import express from 'express';
import { initializeDatabase } from './config/database';
import cartRoutes from './routes/cart.routes';
import videogameRoutes from './routes/videogame.routes';
import { errorHandler } from './middleware/error.middleware';
import { VideogameService } from './services/videogame.service';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api/videogames', videogameRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server function
const startServer = async () => {
    try {
        await initializeDatabase();
        
        // Seed the database with mock data
        const videogameService = new VideogameService();
        await videogameService.seedDatabase();
        
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting application:', error);
        process.exit(1);
    }
};

startServer();