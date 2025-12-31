import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../services/prisma.js';
import { inertia, inertiaRedirect, flash, flashErrors } from '../middleware/inertia.js';

export class PasswordChangeController {
    /**
     * Display password change form.
     */
    async show(req: Request, res: Response) {
        return inertia(req, res, 'Auth/ChangePassword');
    }

    /**
     * Handle password change.
     */
    async update(req: Request, res: Response) {
        const { password, password_confirmation } = req.body;
        const errors: Record<string, string[]> = {};

        // Validate password presence
        if (!password) {
            errors.password = ['Please enter a new password.'];
        } else if (password.length < 8) {
            errors.password = ['Password must be at least 8 characters long. Please choose a stronger password.'];
        }

        // Validate password confirmation
        if (!password_confirmation) {
            errors.password_confirmation = ['Please confirm your new password.'];
        } else if (password && password !== password_confirmation) {
            errors.password_confirmation = ['The password confirmation does not match. Please make sure both passwords are identical.'];
        }

        // If there are any validation errors, return them all
        if (Object.keys(errors).length > 0) {
            flashErrors(req, errors);
            return inertiaRedirect(req, res, '/change-password');
        }

        // Check if user is authenticated
        if (!req.user) {
            flashErrors(req, { general: ['Your session has expired. Please log in again.'] });
            return inertiaRedirect(req, res, '/admin');
        }

        try {
            // Check if new password is different from current password
            const isSamePassword = await bcrypt.compare(password, req.user.password);
            if (isSamePassword) {
                flashErrors(req, { password: ['Your new password cannot be the same as your current password. Please choose a different password.'] });
                return inertiaRedirect(req, res, '/change-password');
            }

            // Hash and update password
            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.update({
                where: { id: req.user.id },
                data: {
                    password: hashedPassword,
                    mustChangePassword: false,
                },
            });

            flash(req, 'success', 'Your password has been changed successfully! You can now access all features.');

            // Redirect based on user type
            if (req.user.isSuperAdmin) {
                return inertiaRedirect(req, res, '/admin/users');
            }
            return inertiaRedirect(req, res, '/admin/events');
        } catch (error) {
            console.error('Password change error:', error);
            flashErrors(req, { general: ['An unexpected error occurred while changing your password. Please try again.'] });
            return inertiaRedirect(req, res, '/change-password');
        }
    }
}

export const passwordChangeController = new PasswordChangeController();
