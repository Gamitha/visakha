import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { prisma } from './services/prisma.js';
import webRoutes from './routes/web.js';
import authRoutes from './routes/auth.js';
import './types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for session cookies behind reverse proxy
app.set('trust proxy', 1);

// Body parsing middleware - increased limits for large image uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// CORS for development
if (config.isDev) {
    app.use(cors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true,
    }));
}

// Session middleware
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: !config.isDev,
        httpOnly: true,
        maxAge: config.session.maxAge,
        sameSite: 'lax',
    },
}));

// Static files (for uploaded images)
app.use('/storage', express.static(path.join(__dirname, '../../storage/app/public')));

// Serve public images (About page, etc.) - /app/public in Docker, ../../public locally
const publicImagesPath = process.env.NODE_ENV === 'development'
    ? '/app/public/images'  // Docker volume path
    : path.join(__dirname, '../../public/images');
app.use('/images', express.static(publicImagesPath));

// Flash message helper
app.use((req: Request, res: Response, next: NextFunction) => {
    // Make flash messages available
    res.locals.flash = req.session.flash || {};
    // Clear flash after reading
    delete req.session.flash;
    next();
});

// Load user from session
app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.session.userId },
            });
            if (user) {
                req.user = user;
            }
        } catch (error) {
            console.error('Error loading user from session:', error);
        }
    }
    next();
});

// Inertia share data middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    // Extract errors from flash and format them for Inertia's useForm
    const flashData = res.locals.flash || {};
    const errors: Record<string, string> = {};

    // Convert array errors to single string for Inertia useForm compatibility
    if (flashData.errors) {
        for (const [key, messages] of Object.entries(flashData.errors)) {
            if (Array.isArray(messages) && messages.length > 0) {
                errors[key] = messages[0];
            } else if (typeof messages === 'string') {
                errors[key] = messages;
            }
        }
    }

    res.locals.inertiaData = {
        auth: {
            user: req.user ? {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                isSuperAdmin: req.user.isSuperAdmin,
                isActive: req.user.isActive,
                mustChangePassword: req.user.mustChangePassword,
            } : null,
        },
        errors, // Inertia expects errors at this level
        flash: {
            success: flashData.success,
            error: flashData.error,
        },
    };
    next();
});

// Routes - authRoutes must be first so /admin login page matches before protected /admin routes
app.use('/', authRoutes);
app.use('/', webRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    if (res.headersSent) {
        return next(err);
    }

    // Handle Multer errors (file upload errors)
    if (err.name === 'MulterError') {
        const multerErr = err as any;
        let message = 'File upload error';

        switch (multerErr.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'File too large. Maximum file size is 50MB per image.';
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Too many files. Maximum 20 images allowed.';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected file field.';
                break;
            default:
                message = multerErr.message || 'File upload error';
        }

        // For Inertia requests, redirect back with error
        if (req.headers['x-inertia']) {
            req.session.flash = { errors: { images: [message] } };
            res.setHeader('X-Inertia-Location', req.headers.referer || '/admin/events');
            return res.status(409).send('');
        }

        return res.status(400).json({ error: message });
    }

    // Handle custom file filter errors
    if (err.message && err.message.includes('Invalid file type')) {
        if (req.headers['x-inertia']) {
            req.session.flash = { errors: { images: [err.message] } };
            res.setHeader('X-Inertia-Location', req.headers.referer || '/admin/events');
            return res.status(409).send('');
        }
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
        error: config.isDev ? err.message : 'Internal Server Error',
    });
});

export { app };
