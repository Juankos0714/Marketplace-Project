import { Request, Response, NextFunction } from 'express';

export class ErrorMiddleware {
  public handle(error: Error, req: Request, res: Response, next: NextFunction) {
    console.error('Error:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}