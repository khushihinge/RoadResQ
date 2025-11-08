import { Router } from 'express';
import multer from 'multer';
import { createHazard, getHazards, updateHazardStatus } from '../controllers/hazardController.js';
import { requireAdmin, attachOptionalUser } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public: create a report (image optional)
router.post('/report', attachOptionalUser, upload.single('image'), uploadToCloudinary, createHazard);

// Public: list reports with optional filters
router.get('/reports', getHazards);

// Admin: update status
router.patch('/:id/status', requireAdmin, updateHazardStatus);

export default router;






