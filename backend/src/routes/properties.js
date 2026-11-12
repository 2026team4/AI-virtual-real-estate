import express from 'express';
import {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  aiPriceEstimate,
  getPlatformStats,
  getMyListings,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/',          getProperties);
router.get('/featured',  getFeaturedProperties);
router.get('/stats',     getPlatformStats);
router.get('/:id',       getPropertyById);

// AI estimate — public (no auth required)
router.post('/ai-estimate', aiPriceEstimate);

// Protected routes
router.get('/user/my-listings', protect, getMyListings);
router.post('/', protect, authorize('seller', 'agent', 'admin'), createProperty);
router.put('/:id',    protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
