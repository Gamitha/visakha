import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../services/prisma.js';
import { emailService } from '../services/EmailService.js';
import { inertia, inertiaRedirect, flash, flashErrors } from '../middleware/inertia.js';

export class UserManagementController {
    /**
     * Display a listing of users.
     */
    async index(req: Request, res: Response) {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isSuperAdmin: true,
                isActive: true,
                mustChangePassword: true,
                createdAt: true,
            },
        });

        // Format dates for display
        const formattedUsers = users.map(user => ({
            ...user,
            created_at: user.createdAt.toISOString().slice(0, 16).replace('T', ' '),
            is_super_admin: user.isSuperAdmin,
            is_active: user.isActive,
            must_change_password: user.mustChangePassword,
        }));

        return inertia(req, res, 'Admin/Users/Index', {
            users: formattedUsers,
        });
    }

    /**
     * Store a newly created user.
     */
    async store(req: Request, res: Response) {
        const { name, email, phone } = req.body;

        // Validate
        const errors: Record<string, string[]> = {};

        if (!name || name.trim().length === 0) {
            errors.name = ['Name is required.'];
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = ['A valid email is required.'];
        } else {
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
            return inertiaRedirect(req, res, '/admin/users');
        }

        // Generate temporary password
        const tempPassword = crypto.randomBytes(8).toString('base64').slice(0, 12);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                phone: phone?.trim() || null,
                password: hashedPassword,
                isSuperAdmin: false,
                isActive: true,
                mustChangePassword: true,
            },
        });

        // Send email with temporary password
        await emailService.sendTempPasswordEmail(user.email, user.name, tempPassword, false);

        flash(req, 'success', 'User created successfully. Temporary password sent to their email.');
        return inertiaRedirect(req, res, '/admin/users');
    }

    /**
     * Toggle user active status.
     */
    async toggleActive(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            flash(req, 'error', 'User not found.');
            return inertiaRedirect(req, res, '/admin/users');
        }

        // Prevent deactivating super admin
        if (user.isSuperAdmin) {
            flash(req, 'error', 'Cannot deactivate super admin.');
            return inertiaRedirect(req, res, '/admin/users');
        }

        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
        });

        const status = !user.isActive ? 'activated' : 'deactivated';
        flash(req, 'success', `User ${status} successfully.`);
        return inertiaRedirect(req, res, '/admin/users');
    }

    /**
     * Reset user password.
     */
    async resetPassword(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            flash(req, 'error', 'User not found.');
            return inertiaRedirect(req, res, '/admin/users');
        }

        // Generate new temporary password
        const tempPassword = crypto.randomBytes(8).toString('base64').slice(0, 12);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                mustChangePassword: true,
            },
        });

        // Send email with new temporary password
        await emailService.sendTempPasswordEmail(user.email, user.name, tempPassword, true);

        flash(req, 'success', 'Password reset successfully. New temporary password sent to user email.');
        return inertiaRedirect(req, res, '/admin/users');
    }

    /**
     * Delete a user.
     */
    async destroy(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            flash(req, 'error', 'User not found.');
            return inertiaRedirect(req, res, '/admin/users');
        }

        // Prevent deleting super admin
        if (user.isSuperAdmin) {
            flash(req, 'error', 'Cannot delete super admin.');
            return inertiaRedirect(req, res, '/admin/users');
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        flash(req, 'success', 'User deleted successfully.');
        return inertiaRedirect(req, res, '/admin/users');
    }
}

export const userManagementController = new UserManagementController();
