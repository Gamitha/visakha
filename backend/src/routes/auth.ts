import { Router } from 'express';
import { authController } from '../controllers/AuthController.js';
import { passwordChangeController } from '../controllers/PasswordChangeController.js';
import { guest, auth } from '../middleware/auth.js';

const router = Router();

// Guest routes (not authenticated)
router.get('/admin', guest, (req, res) => authController.showLogin(req, res));
router.post('/login', guest, (req, res) => authController.login(req, res));
router.get('/forgot-password', guest, (req, res) => authController.showForgotPassword(req, res));
router.post('/forgot-password', guest, (req, res) => authController.forgotPassword(req, res));
router.get('/reset-password/:token', guest, (req, res) => authController.showResetPassword(req, res));
router.post('/reset-password', guest, (req, res) => authController.resetPassword(req, res));

// Authenticated routes
router.post('/logout', auth, (req, res) => authController.logout(req, res));

// Password change routes (authenticated, but allowed even with must_change_password)
router.get('/change-password', auth, (req, res) => passwordChangeController.show(req, res));
router.post('/change-password', auth, (req, res) => passwordChangeController.update(req, res));

export default router;
