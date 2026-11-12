import express from 'express';
import { getFavorites, toggleFavorite, checkFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/',                     protect, getFavorites);
router.post('/toggle',              protect, toggleFavorite);
router.get('/check/:property_id',   protect, checkFavorite);

export default router;
