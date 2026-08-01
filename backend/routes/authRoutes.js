import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateMe,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);

export default router;
