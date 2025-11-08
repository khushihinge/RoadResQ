import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (req, _res, next) => {
  if (!req.file) return next();
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMime.includes(req.file.mimetype)) {
    const err = new Error('Unsupported image format');
    err.status = 400;
    return next(err);
  }

  const uploadStream = cloudinary.uploader.upload_stream({ folder: 'roadresq' }, (error, result) => {
    if (error) return next(error);
    req.uploadedImageUrl = result.secure_url;
    next();
  });

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};






