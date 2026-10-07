import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const uploadDir = path.resolve(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `complaint-${uniqueSuffix}${cleanExt}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, JPEG, PNG, and WEBP images are allowed.'));
  }
};

export const uploadComplaintImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});
