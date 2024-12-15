import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

interface StorageParams {
    folder: string;
    format: (req: Express.Request, file: Express.Multer.File) => Promise<string> | string;
    public_id: (req: Express.Request, file: Express.Multer.File) => string;
}

const storage: CloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products',
        format: async (req: Express.Request, file: Express.Multer.File): Promise<string> => 'png', 
        public_id: (req: Express.Request, file: Express.Multer.File): string => file.originalname,
    } as StorageParams,
});

const upload = multer({ storage });

export { upload };