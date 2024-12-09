import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const uploadPath = path.join(__dirname, '../../public/images/products/');
    cb(null, uploadPath);  
  },
  filename: (req, file, cb) => {

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

interface MulterFile extends Express.Multer.File {
  mimetype: string;
}

interface FileFilterCallback {
  (error: Error | null, acceptFile: boolean): void;
}

const fileFilter = (req: Express.Request, file: MulterFile, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
