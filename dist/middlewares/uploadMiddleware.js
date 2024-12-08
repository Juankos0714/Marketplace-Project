"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: './uploads',
    filename: (_req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Not an image file'));
    }
};
exports.uploadSingle = (0, multer_1.default)({
    storage,
    fileFilter
}).single('image');
exports.uploadMultiple = (0, multer_1.default)({
    storage,
    fileFilter
}).array('images', 5);
