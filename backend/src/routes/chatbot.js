import express from 'express';
import { sendMessage, getSuggestions } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/message',     sendMessage);
router.get('/suggestions',  getSuggestions);

export default router;
