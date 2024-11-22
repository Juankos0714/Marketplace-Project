import express from 'express';
import { initDatabase } from './config/sequelize.config';
import cors from 'cors';
import morgan from 'morgan';

export const createApp = async () => {
  try {
    // Inicializar base de datos
    await initDatabase();

    const app = express();

    // Middlewares
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rutas básicas
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date() });
    });

    return app;
  } catch (error) {
    console.error('Error al crear la aplicación:', error);
    throw error;
  }
};

// Para iniciar el servidor
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createApp().then(app => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  }).catch(error => {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  });
}