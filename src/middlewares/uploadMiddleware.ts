import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/images/products');
    cb(null, uploadPath);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
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