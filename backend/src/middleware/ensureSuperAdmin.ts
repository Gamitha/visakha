import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to ensure user is a super admin.
 * Returns 403 Forbidden if user is not a super admin.
 */
export function ensureSuperAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user || !req.user.isSuperAdmin) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(403).json({ error: 'Access denied. Super Admin privileges required.' });
        }
        return res.status(403).send('Access denied. Super Admin privileges required.');
    }
    next();
}
