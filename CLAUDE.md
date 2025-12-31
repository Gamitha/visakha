# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Visakha Vidyalaya Event Management System - a Vue 3 + Express + Inertia.js full-stack web application for managing school events.

**Stack:** Node.js 22, Express 4, Vue 3 with TypeScript, Inertia.js, Prisma 6, Tailwind CSS, MySQL (Docker), Vite 6

## Common Commands

```bash
# Full Docker Development (recommended)
docker-compose up              # Start all services (backend, frontend, db, mailhog)
docker-compose up --build      # Rebuild and start

# Frontend Only (root directory)
npm run dev                    # Vite dev server (port 5173)
npm run build                  # Production build (vue-tsc + vite)
npm run lint                   # ESLint with auto-fix

# Backend Only (/backend directory)
npm run dev                    # Express dev server with hot reload (port 3000)
npm run build                  # Compile TypeScript
npm start                      # Run compiled JS

# Database (from /backend)
npx prisma db push             # Apply schema changes to database
npx prisma generate            # Regenerate Prisma client after schema changes
npm run db:seed                # Seed database with initial data

# Cleanup
npm run clean                  # Remove build artifacts and node_modules
```

## Architecture

```
Frontend (Vue 3 + Inertia, port 5173)
    |
    v (Vite proxy → /api requests)
Backend (Express, port 3000)
    |
    +-- Prisma ORM → MySQL (port 3306)
    +-- ImageService (Sharp compression)
    +-- EmailService (Nodemailer → MailHog:1025)
```

### Backend Structure (`/backend/src`)
- `controllers/EventController.ts` - Event CRUD, toggle active, set today's event
- `controllers/UserManagementController.ts` - Super admin user CRUD
- `controllers/AuthController.ts` - Login, logout, password reset flows
- `controllers/PasswordChangeController.ts` - First-login password change
- `services/ImageService.ts` - Image compression (Sharp), thumbnails, UUID filenames
- `services/EmailService.ts` - Nodemailer with HTML templates
- `middleware/auth.ts` - Session-based authentication
- `middleware/ensureSuperAdmin.ts` - Restricts to super admin users
- `middleware/ensurePasswordChanged.ts` - Forces password change on first login
- `middleware/inertia.ts` - Inertia.js page rendering and shared data
- `routes/web.ts` - Main application routes
- `routes/auth.ts` - Authentication routes

### Frontend Structure (`/resources/js`)
- `Pages/Events/` - Index (admin list), Form (multi-step create/edit), PublicList, PublicShow
- `Pages/Admin/Users/Index.vue` - Super admin user management
- `Pages/Auth/` - Login, ChangePassword, ForgotPassword, ResetPassword
- `Layouts/` - AuthenticatedLayout (admin), VisakhaLayout (public), GuestLayout (auth)
- `Components/Visakha/` - School-branded components (NavBar, HeroSection, QuickLinks)

### Key Routes
- `/visakha` - Public school homepage
- `/admin/events` - Admin event management (auth required)
- `/admin/users` - Super admin user management
- `/today-event` - Public: today's event or next upcoming
- `/all-events` - Public: all events with status
- `/admin` - Login page

## Database (Prisma Schema)

**User:** id, name, email, phone, password, isSuperAdmin, isActive, mustChangePassword
**Event:** id, title, description, eventDate, eventTime, venue, images (JSON), agenda (JSON), isActive, isTodaysEvent, hasAgenda
**Session:** sid, sess (JSON), expire
**PasswordResetToken:** email, token, createdAt

Images stored in `/storage/app/public/events/` and served via `/storage/` route.

## Docker Services

| Service | Port | Purpose |
|---------|------|---------|
| backend | 3000 | Express API server |
| frontend | 5173 | Vite dev server with HMR |
| db | 3306 | MySQL 8.0 |
| mailhog | 8025 | Email testing UI (SMTP on 1025) |

## Custom Theming

Tailwind configured with Visakha school colors in `tailwind.config.js`:
- `visakha-navy: #1B2C62`
- `visakha-gold: #FFCA08`
- `visakha-blue: #046BD2`

## Notes

- Inertia.js bridges Vue frontend and Express backend - no separate REST API
- Forms use Inertia's `useForm()` hook for submissions
- Vite proxies `/api` requests to the Express backend in development
- Sessions stored in MySQL via express-session
- Path alias: `@/` maps to `resources/js/` in TypeScript
