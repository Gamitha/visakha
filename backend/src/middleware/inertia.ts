import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ziggy route definitions for the frontend
const ziggyRoutes = {
    url: 'http://localhost:3000',
    port: 3000,
    defaults: {},
    routes: {
        'login': { uri: 'login', methods: ['POST'] },
        'logout': { uri: 'logout', methods: ['POST'] },
        'password.request': { uri: 'forgot-password', methods: ['GET'] },
        'password.email': { uri: 'forgot-password', methods: ['POST'] },
        'password.reset': { uri: 'reset-password/{token}', methods: ['GET'] },
        'password.store': { uri: 'reset-password', methods: ['POST'] },
        'profile.edit': { uri: 'profile', methods: ['GET'] },
        'profile.update': { uri: 'profile', methods: ['PATCH'] },
        'profile.destroy': { uri: 'profile', methods: ['DELETE'] },
        'change-password': { uri: 'change-password', methods: ['GET', 'POST'] },
        'events.index': { uri: 'admin/events', methods: ['GET'] },
        'events.create': { uri: 'admin/events/create', methods: ['GET'] },
        'events.store': { uri: 'admin/events', methods: ['POST'] },
        'events.edit': { uri: 'admin/events/{event}/edit', methods: ['GET'] },
        'events.update': { uri: 'admin/events/{event}', methods: ['PUT', 'POST'] },
        'events.destroy': { uri: 'admin/events/{event}', methods: ['DELETE'] },
        'events.toggle-active': { uri: 'admin/events/{event}/toggle-active', methods: ['POST'] },
        'events.set-todays-event': { uri: 'admin/events/{event}/set-todays-event', methods: ['POST'] },
        'events.unset-todays-event': { uri: 'admin/events/{event}/unset-todays-event', methods: ['POST'] },
        'events.delete-image': { uri: 'admin/events/{event}/delete-image', methods: ['POST'] },
        'events.today': { uri: 'today-event', methods: ['GET'] },
        'events.list': { uri: 'all-events', methods: ['GET'] },
        'events.show.public': { uri: 'event/{event}', methods: ['GET'] },
        'admin.users.index': { uri: 'admin/users', methods: ['GET'] },
        'admin.users.store': { uri: 'admin/users', methods: ['POST'] },
        'admin.users.toggle-active': { uri: 'admin/users/{user}/toggle-active', methods: ['POST'] },
        'admin.users.reset-password': { uri: 'admin/users/{user}/reset-password', methods: ['POST'] },
        'admin.users.destroy': { uri: 'admin/users/{user}', methods: ['DELETE'] },
        'visakha.home': { uri: 'visakha', methods: ['GET'] },
        'about.index': { uri: 'about', methods: ['GET'] },
    },
};

// Path to the built Vue.js manifest
const DIST_PATH = path.join(__dirname, '../../../public/build');

interface ViteManifest {
    [key: string]: {
        file: string;
        css?: string[];
        imports?: string[];
    };
}

let manifest: ViteManifest | null = null;

function loadManifest(): ViteManifest | null {
    try {
        const manifestPath = path.join(DIST_PATH, '.vite/manifest.json');
        if (fs.existsSync(manifestPath)) {
            const content = fs.readFileSync(manifestPath, 'utf-8');
            return JSON.parse(content);
        }
    } catch (error) {
        console.error('Failed to load Vite manifest:', error);
    }
    return null;
}

/**
 * Render an Inertia page response.
 * This function handles both full page loads and partial Inertia requests.
 */
export function inertia(
    req: Request,
    res: Response,
    component: string,
    props: Record<string, unknown> = {}
) {
    // Merge shared data with page props
    const pageProps = {
        ...res.locals.inertiaData,
        ...props,
    };

    const page = {
        component,
        props: pageProps,
        url: req.originalUrl,
        version: '1.0', // You can use a hash of your assets for cache busting
    };

    // Check if this is an Inertia request
    const isInertiaRequest = req.headers['x-inertia'] === 'true';

    if (isInertiaRequest) {
        // Return JSON for Inertia partial requests
        res.setHeader('X-Inertia', 'true');
        res.setHeader('Vary', 'X-Inertia');
        return res.json(page);
    }

    // Load manifest for production builds
    if (!manifest) {
        manifest = loadManifest();
    }

    // Determine asset paths
    const isDev = process.env.NODE_ENV !== 'production';
    let cssLinks = '';
    let jsScript = '';

    if (isDev) {
        // Development: use Vite dev server
        jsScript = `
      <script type="module" src="http://localhost:5173/@vite/client"></script>
      <script type="module" src="http://localhost:5173/resources/js/app.ts"></script>
    `;
    } else if (manifest) {
        // Production: use built assets
        const entry = manifest['resources/js/app.ts'];
        if (entry) {
            jsScript = `<script type="module" src="/build/${entry.file}"></script>`;
            if (entry.css) {
                cssLinks = entry.css.map(css => `<link rel="stylesheet" href="/build/${css}">`).join('\n');
            }
        }
    }

    // Render the full HTML page with Ziggy routes
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visakha Vidyalaya Events</title>
  ${cssLinks}
  <script>
    const Ziggy = ${JSON.stringify(ziggyRoutes)};
  </script>
</head>
<body class="antialiased">
  <div id="app" data-page='${JSON.stringify(page).replace(/'/g, '&#39;')}'></div>
  ${jsScript}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
}

/**
 * Redirect with Inertia support.
 * For Inertia requests, sets the appropriate headers.
 */
export function inertiaRedirect(req: Request, res: Response, url: string) {
    const isInertiaRequest = req.headers['x-inertia'] === 'true';

    if (isInertiaRequest) {
        res.setHeader('X-Inertia-Location', url);
        return res.status(409).send('');
    }

    return res.redirect(url);
}

/**
 * Set flash message in session.
 */
export function flash(req: Request, type: 'success' | 'error', message: string) {
    req.session.flash = req.session.flash || {};
    req.session.flash[type] = message;
}

/**
 * Set validation errors in session.
 */
export function flashErrors(req: Request, errors: Record<string, string[]>) {
    req.session.flash = req.session.flash || {};
    req.session.flash.errors = errors;
}
