"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: path_1.default.join(__dirname, "../uploads"),
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (req, uploadedFile, cb) => {
    const fileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    if (fileTypes.some(fileType => fileType === uploadedFile.mimetype)) {
        return cb(null, true);
    }
    return cb(null, false);
};
const maxSize = 5 * 1024 * 1024;
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
});
