import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../services/prisma.js';
import { inertia, inertiaRedirect, flash, flashErrors } from '../middleware/inertia.js';

export class AuthController {
    /**
     * Display the login view.
     */
    async showLogin(req: Request, res: Response) {
        return inertia(req, res, 'Auth/Login', {
            canResetPassword: true,
            status: res.locals.flash?.success || null,
        });
    }

    /**
     * Handle login attempt.
     */
    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const errors: Record<string, string[]> = {};

        // Validate email
        if (!email) {
            errors.email = ['Please enter your email address.'];
        } else if (!this.isValidEmail(email)) {
            errors.email = ['Please enter a valid email address (e.g., user@example.com).'];
        }

        // Validate password
        if (!password) {
            errors.password = ['Please enter your password.'];
        }

        // Return validation errors if any
        if (Object.keys(errors).length > 0) {
            flashErrors(req, errors);
            return inertiaRedirect(req, res, '/admin');
        }

        try {
            // Find user
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });

            if (!user) {
                flashErrors(req, { email: ['No account found with this email address. Please check and try again.'] });
                return inertiaRedirect(req, res, '/admin');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                flashErrors(req, { password: ['Incorrect password. Please try again or contact your administrator if you forgot your password.'] });
                return inertiaRedirect(req, res, '/admin');
            }

            // Check if user is active
            if (!user.isActive) {
                flashErrors(req, { email: ['Your account has been deactivated. Please contact your administrator to reactivate your account.'] });
                return inertiaRedirect(req, res, '/admin');
            }

            // Set session
            req.session.userId = user.id;
            req.session.save();

            // Redirect based on user type and password status
            if (user.mustChangePassword) {
                flash(req, 'success', 'Welcome! Please change your password to continue.');
                return inertiaRedirect(req, res, '/change-password');
            }

            if (user.isSuperAdmin) {
                return inertiaRedirect(req, res, '/admin/users');
            }

            return inertiaRedirect(req, res, '/admin/events');
        } catch (error) {
            console.error('Login error:', error);
            flashErrors(req, { general: ['An unexpected error occurred. Please try again later.'] });
            return inertiaRedirect(req, res, '/admin');
        }
    }

    /**
     * Validate email format.
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Handle logout.
     */
    async logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            return res.redirect('/');
        });
    }

    /**
     * Display forgot password form.
     */
    async showForgotPassword(req: Request, res: Response) {
        return inertia(req, res, 'Auth/ForgotPassword', {
            status: res.locals.flash?.success || null,
        });
    }

    /**
     * Handle forgot password request.
     */
    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            flashErrors(req, { email: ['Email is required.'] });
            return inertiaRedirect(req, res, '/forgot-password');
        }

        // For security, always show success message even if email doesn't exist
        flash(req, 'success', 'If an account with that email exists, we have sent a password reset link.');

        // TODO: Implement actual password reset email sending
        // This would involve creating a token, storing it, and sending an email

        return inertiaRedirect(req, res, '/forgot-password');
    }

    /**
     * Display reset password form.
     */
    async showResetPassword(req: Request, res: Response) {
        const { token } = req.params;
        const { email } = req.query;

        return inertia(req, res, 'Auth/ResetPassword', {
            token,
            email,
        });
    }

    /**
     * Handle password reset.
     */
    async resetPassword(req: Request, res: Response) {
        const { token, email, password, password_confirmation } = req.body;

        if (password !== password_confirmation) {
            flashErrors(req, { password: ['Passwords do not match.'] });
            return inertiaRedirect(req, res, `/reset-password/${token}?email=${encodeURIComponent(email)}`);
        }

        // TODO: Implement actual password reset with token validation
        flash(req, 'success', 'Your password has been reset.');
        return inertiaRedirect(req, res, '/admin');
    }
}

export const authController = new AuthController();
