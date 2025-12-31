import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to ensure user is authenticated.
 * Redirects to login page if not authenticated.
 */
export function auth(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        // For API requests, return 401
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }
        // For regular requests, redirect to login
        return res.redirect('/admin');
    }

    // Check if user is active
    if (!req.user.isActive) {
        req.session.destroy(() => { });
        return res.redirect('/admin');
    }

    next();
}

/**
 * Middleware to ensure user is a guest (not authenticated).
 * Redirects to appropriate page if already authenticated.
 */
export function guest(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        // Redirect authenticated users
        if (req.user.isSuperAdmin) {
            return res.redirect('/admin/users');
        }
        return res.redirect('/admin/events');
    }
    next();
}
