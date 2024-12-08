import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: Request, uploadedFile: Express.Multer.File, cb: FileFilterCallback) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

  if (fileTypes.some(fileType => fileType === uploadedFile.mimetype)) {
    return cb(null, true);
  }
  return cb(null, false);
};

const maxSize = 5 * 1024 * 1024;

export const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});