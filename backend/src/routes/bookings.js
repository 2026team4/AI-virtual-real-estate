import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/',       protect, createBooking);
router.get('/my',      protect, getMyBookings);
router.patch('/:id/status', protect, updateBookingStatus);

export default router;
