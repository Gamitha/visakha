import { Router } from 'express';
import multer from 'multer';
import { eventController } from '../controllers/EventController.js';
import { userManagementController } from '../controllers/UserManagementController.js';
import { profileController } from '../controllers/ProfileController.js';
import { auth } from '../middleware/auth.js';
import { ensureSuperAdmin } from '../middleware/ensureSuperAdmin.js';
import { ensurePasswordChanged } from '../middleware/ensurePasswordChanged.js';
import { inertia } from '../middleware/inertia.js';

const router = Router();

// Configure multer for file uploads - support large images
// Use .any() because Inertia sends files as images[0], images[1], etc.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file (will be compressed)
        files: 20,
        fieldSize: 50 * 1024 * 1024, // 50MB field size
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, WebP, GIF`));
        }
    },
});

// Middleware to normalize file uploads from Inertia (images[0], images[1] -> images array)
const normalizeFiles = (req: any, res: any, next: any) => {
    if (req.files && Array.isArray(req.files)) {
        // Filter only image files (those with fieldname starting with 'images')
        req.files = req.files.filter((file: any) =>
            file.fieldname === 'images' || file.fieldname.startsWith('images[')
        );
    }
    next();
};

// ============================================
// Public Routes
// ============================================

// Welcome page
router.get('/', (req, res) => {
    return inertia(req, res, 'Welcome', {
        canLogin: true,
        canRegister: false,
        laravelVersion: 'N/A',
        phpVersion: 'Node.js 22',
    });
});

// Visakha home page
router.get('/visakha', (req, res) => {
    return inertia(req, res, 'VisakhaHome');
});

// About School page
router.get('/about', (req, res) => {
    return inertia(req, res, 'AboutSchool');
});

// Public event pages
router.get('/today-event', (req, res) => eventController.today(req, res));
router.get('/all-events', (req, res) => eventController.list(req, res));
router.get('/event/:id', (req, res) => eventController.showPublic(req, res));

// ============================================
// Authenticated Routes (with password change check)
// ============================================

// Profile routes
router.get('/profile', auth, ensurePasswordChanged, (req, res) => profileController.edit(req, res));
router.patch('/profile', auth, ensurePasswordChanged, (req, res) => profileController.update(req, res));
router.delete('/profile', auth, ensurePasswordChanged, (req, res) => profileController.destroy(req, res));

// ============================================
// Admin Event Routes
// ============================================

router.get('/admin/events', auth, ensurePasswordChanged, (req, res) => eventController.index(req, res));
router.get('/admin/events/create', auth, ensurePasswordChanged, (req, res) => eventController.create(req, res));
router.post('/admin/events', auth, ensurePasswordChanged, upload.any(), normalizeFiles, (req, res) => eventController.store(req, res));
router.get('/admin/events/:id/edit', auth, ensurePasswordChanged, (req, res) => eventController.edit(req, res));
router.put('/admin/events/:id', auth, ensurePasswordChanged, upload.any(), normalizeFiles, (req, res) => eventController.update(req, res));
router.post('/admin/events/:id', auth, ensurePasswordChanged, upload.any(), normalizeFiles, (req, res) => eventController.update(req, res)); // For form method override
router.delete('/admin/events/:id', auth, ensurePasswordChanged, (req, res) => eventController.destroy(req, res));
router.post('/admin/events/:id/toggle-active', auth, ensurePasswordChanged, (req, res) => eventController.toggleActive(req, res));
router.post('/admin/events/:id/set-todays-event', auth, ensurePasswordChanged, (req, res) => eventController.setTodaysEvent(req, res));
router.post('/admin/events/:id/unset-todays-event', auth, ensurePasswordChanged, (req, res) => eventController.unsetTodaysEvent(req, res));
router.post('/admin/events/:id/delete-image', auth, ensurePasswordChanged, (req, res) => eventController.deleteImage(req, res));

// ============================================
// Super Admin User Management Routes
// ============================================

// Redirect /admin to /admin/users for super admins
router.get('/admin', auth, ensurePasswordChanged, (req, res) => {
    if (req.user?.isSuperAdmin) {
        return res.redirect('/admin/users');
    }
    return res.redirect('/admin/events');
});

router.get('/admin/users', auth, ensureSuperAdmin, ensurePasswordChanged, (req, res) => userManagementController.index(req, res));
router.post('/admin/users', auth, ensureSuperAdmin, ensurePasswordChanged, (req, res) => userManagementController.store(req, res));
router.post('/admin/users/:id/toggle-active', auth, ensureSuperAdmin, ensurePasswordChanged, (req, res) => userManagementController.toggleActive(req, res));
router.post('/admin/users/:id/reset-password', auth, ensureSuperAdmin, ensurePasswordChanged, (req, res) => userManagementController.resetPassword(req, res));
router.delete('/admin/users/:id', auth, ensureSuperAdmin, ensurePasswordChanged, (req, res) => userManagementController.destroy(req, res));

export default router;
