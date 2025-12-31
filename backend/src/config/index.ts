import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',

    session: {
        secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },

    database: {
        url: process.env.DATABASE_URL || 'mysql://laravel:root@localhost:3306/laravel',
    },

    mail: {
        host: process.env.MAIL_HOST || 'localhost',
        port: parseInt(process.env.MAIL_PORT || '1025', 10),
        user: process.env.MAIL_USER || '',
        pass: process.env.MAIL_PASS || '',
        from: process.env.MAIL_FROM || 'Visakha Events <noreply@visakha.lk>',
    },

    app: {
        url: process.env.APP_URL || 'http://localhost:3000',
    },

    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 20,
        allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },
};
