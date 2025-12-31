import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Roboto', 'Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['Roboto', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                visakha: {
                    navy: '#1B2C62',
                    gold: '#FFCA08',
                    blue: '#046BD2',
                },
            },
        },
    },

    plugins: [
        forms,
        require('@tailwindcss/typography'),
    ],
};
