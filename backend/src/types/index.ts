import { User, Event } from '@prisma/client';
import { Request } from 'express';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// Session data type
declare module 'express-session' {
    interface SessionData {
        userId?: number;
        flash?: {
            success?: string;
            error?: string;
            errors?: Record<string, string[]>;
        };
    }
}

// Inertia page props
export interface InertiaPageProps {
    auth?: {
        user: SafeUser | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string[]>;
    [key: string]: unknown;
}

// Safe user (without password)
export interface SafeUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    isSuperAdmin: boolean;
    isActive: boolean;
    mustChangePassword: boolean;
}

// Event with formatted fields
export interface FormattedEvent extends Event {
    formatted_date?: string;
    formatted_time?: string;
    status?: string;
    status_color?: string;
}

// Agenda item type
export interface AgendaItem {
    time: string;
    description: string;
}

// Validation error format
export interface ValidationErrors {
    [field: string]: string[];
}
