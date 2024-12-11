import express from "express";
import path from "path";
import { router } from "./router";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { AddressInfo } from "net";

// Determinar el entorno y cargar las variables de entorno adecuadas
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });

// Validar variables de entorno críticas
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

interface CriticalVar {
  name: string;
  required: boolean;
}

function ensureDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

function startServer() {
  const app = express();

  try {
    // Seguridad adicional
    app.use(helmet());

    // Configuración de CORS
    const allowedOrigins = [
      'http://localhost:5432',
      'https://marketplace-project-eta.vercel.app'
    ];
    interface CorsOptions {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
      credentials: boolean;
      methods: string[];
      allowedHeaders: string[];
    }

    const corsOptions: CorsOptions = {
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
    };
    app.use(cors(corsOptions));

    // Configuración de carpetas estáticas
    // ensureDirectoryExists(path.join(__dirname, '../public/images/products'));
    app.use(express.static("public"));

    // Middleware
    app.use(express.json());
    app.use(morgan('combined')); // Logging con morgan

    // Servir archivos estáticos desde la carpeta public/images/products
    // app.use('/images/products', express.static(path.join(__dirname, '../public/images/products')));

    // Router
    app.use(router);

    router.post('/products', upload.single('image'), async (req, res) => {
      try {
          const { name, price, description, category } = req.body;
  
          if (!req.file) {
              return res.status(400).json({ error: 'La imagen es obligatoria' });
          }
  
          const newProduct = new Product({
              name,
              price,
              description,
              category,
              image: `/uploads/products/${req.file.filename}` // Ruta de la imagen
          });
  
          await newProduct.save();
          res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
      } catch (error) {
          console.error('Error al crear el producto:', error);
          res.status(500).json({ error: 'Error al crear el producto' });
      }
  });

    app.use()

    // Template Engine
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));

    // Global error handler
    interface ErrorRequestHandler {
      (err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void;
    }

    const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
      console.error('Unhandled Error:', err.stack); // Stack trace
      res.status(500).json({
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack, error: err.message })
      });
    };

    app.use(errorHandler);

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

// Event handlers for unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar el servidor
validateEnvironment();
startServer();
