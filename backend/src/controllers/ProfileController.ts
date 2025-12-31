import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../services/prisma.js';
import { inertia, inertiaRedirect, flash, flashErrors } from '../middleware/inertia.js';

export class ProfileController {
    /**
     * Display the user's profile form.
     */
    async edit(req: Request, res: Response) {
        if (!req.user) {
            return inertiaRedirect(req, res, '/admin');
        }

        return inertia(req, res, 'Profile/Edit', {
            mustVerifyEmail: false,
            status: res.locals.flash?.success || null,
        });
    }

    /**
     * Update the user's profile information.
     */
    async update(req: Request, res: Response) {
        const { name, email } = req.body;

        if (!req.user) {
            return inertiaRedirect(req, res, '/admin');
        }

        // Validate
        const errors: Record<string, string[]> = {};

        if (!name?.trim()) {
            errors.name = ['Name is required.'];
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = ['A valid email is required.'];
        } else if (email.toLowerCase() !== req.user.email) {
            // Check if email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });
            if (existingUser) {
                errors.email = ['This email is already in use.'];
            }
        }

        if (Object.keys(errors).length > 0) {
            flashErrors(req, errors);
            return inertiaRedirect(req, res, '/profile');
        }

        await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
            },
        });

        flash(req, 'success', 'Profile updated.');
        return inertiaRedirect(req, res, '/profile');
    }

    /**
     * Delete the user's account.
     */
    async destroy(req: Request, res: Response) {
        const { password } = req.body;

        if (!req.user) {
            return inertiaRedirect(req, res, '/admin');
        }

        // Verify password
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        if (!user) {
            return inertiaRedirect(req, res, '/admin');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            flashErrors(req, { password: ['The provided password is incorrect.'] });
            return inertiaRedirect(req, res, '/profile');
        }

        // Prevent super admin from deleting themselves
        if (user.isSuperAdmin) {
            flash(req, 'error', 'Super admin cannot delete their own account.');
            return inertiaRedirect(req, res, '/profile');
        }

        // Delete user
        await prisma.user.delete({
            where: { id: user.id },
        });

        // Destroy session
        req.session.destroy(() => { });
        return res.redirect('/');
    }
}

export const profileController = new ProfileController();
