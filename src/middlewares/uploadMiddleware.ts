import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images');
  },
  filename: (_req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file'));
  }
};

export const uploadSingle = multer({ 
  storage, 
  fileFilter 
}).single('image');

export const uploadMultiple = multer({ 
  storage, 
  fileFilter 
}).array('images', 5);