import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function validationMiddleware<T>(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors = await validate(plainToClass(type, req.body));
    
    if (errors.length > 0) {
      const messages = errors.map(error => ({
        property: error.property,
        constraints: error.constraints
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: messages
      });
    }
    
    next();
  };
}