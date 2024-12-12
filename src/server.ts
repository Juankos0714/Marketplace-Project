import express from "express";
import path from "path";
import { router } from "./router";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { AddressInfo } from "net";
import { upload } from './middlewares/UploadMiddleware'; // Importa el middleware de subida

// Configuración de variables de entorno
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local' });

// Funciones auxiliares
function validateEnvironment() {
  const criticalVars = [
    { name: 'JWT_SECRET', required: true },
    { name: 'DATABASE_URL', required: true },
  ];

  const missingVars = criticalVars.filter(varObj => varObj.required && !process.env[varObj.name]);

  if (missingVars.length > 0) {
    console.error('Missing critical environment variables:', missingVars.map(v => v.name).join(', '));
    process.exit(1);
  }
}

function ensureDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

// Iniciar servidor
function startServer() {
  const app = express();

  try {
    app.use(helmet());
    const allowedOrigins = [
      'http://localhost:5432',
      'https://marketplace-project-eta.vercel.app'
    ];
    app.use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(allowedOrigin => origin.match(allowedOrigin))) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    ensureDirectoryExists(path.join(__dirname, '../public/images/products'));
    app.use(express.static("public"));
    app.use(express.json());
    app.use(morgan('combined'));

    app.use('/images/products', express.static(path.join(__dirname, '../public/images/products')));
    app.use(router);

    app.post('/upload-single', upload.single('image'), (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      res.json({ imageUrl: req.file.path });
    });

    app.post('/upload-multiple', upload.array('images', 5), (req, res) => {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      const files = req.files as Express.Multer.File[];
      res.json({ imageUrls: files.map(file => file.path) });
    });

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    interface Error {
      stack?: string;
      message?: string;
    }

    interface Request extends express.Request {}
    interface Response extends express.Response {}
    interface NextFunction extends express.NextFunction {}

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Unhandled Error:', err.stack);
      res.status(500).json({
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack, error: err.message })
      });
    });

    const port = parseInt(process.env.PORT || '3333', 10);
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port} - http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is in use. Trying another port...`);
        const newServer = app.listen(0, () => {
          const newPort = (newServer.address() as AddressInfo).port;
          console.log(`Server running on new port ${newPort} - http://localhost:${newPort}`);
        });
      } else {
        console.error('Failed to start server:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

validateEnvironment();
startServer();