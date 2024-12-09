import express from "express";
import path from "path";
import { router } from "./router";
import dotenv from "dotenv";
import fs from "fs";

// Cargar variables de entorno desde .env
dotenv.config({ path: '.env' });

const app = express();

// Validar variables de entorno críticas
function validateEnvironment() {
  const criticalVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missingVars = criticalVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing critical environment variables:', missingVars);
    process.exit(1);
  }
}

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Iniciar el servidor
function startServer() {
  try {
    // Middleware
    app.use(express.json());
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });

    // Servir archivos estáticos desde la carpeta src/public/images
    app.use('/images', express.static(uploadDir));

    // Router
    app.use(router);

    // Template Engine
    app.set("view engine", "ejs");
    app.set("views", path.resolve(__dirname, "views/"));

    // Global error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled Error:', err);
      res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
      });
    });

    const port: number = parseInt(process.env.PORT || '3333', 10);

    app.listen(port, () => {
      console.log(`Server running on port ${port} - http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Validar variables de entorno y iniciar el servidor
validateEnvironment();
startServer();

// Manejar promesas no manejadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Manejar excepciones no capturadas
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});