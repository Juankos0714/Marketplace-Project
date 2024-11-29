import express from 'express';
import cors from 'cors';
import { router } from './router';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use(router);

// Manejo de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export { app };