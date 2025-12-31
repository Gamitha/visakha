import { Request, Response, NextFunction } from 'express';

// Routes that are allowed even when password change is required
const allowedRoutes = ['/change-password', '/logout'];

/**
 * Middleware to ensure user has changed their temporary password.
 * Redirects to password change page if user must change password.
 */
export function ensurePasswordChanged(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.mustChangePassword) {
        // Check if current route is allowed
        const currentPath = req.path;
        if (!allowedRoutes.some(route => currentPath === route || currentPath.startsWith(route))) {
            return res.redirect('/change-password');
        }
    }
    next();
}
