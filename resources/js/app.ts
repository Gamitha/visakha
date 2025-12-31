import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/vue3';
import { createApp, DefineComponent, h } from 'vue';
import { ZiggyVue } from './ziggy.js';
import route from './ziggy-route.js';

// Make route global
window.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Visakha';

// Custom page resolver (replacing laravel-vite-plugin)
const pages = import.meta.glob<DefineComponent>('./Pages/**/*.vue');

async function resolvePageComponent(name: string) {
    const path = `./Pages/${name}.vue`;
    const page = pages[path];
    if (!page) {
        throw new Error(`Page not found: ${path}`);
    }
    return (await page()).default;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: resolvePageComponent,
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
