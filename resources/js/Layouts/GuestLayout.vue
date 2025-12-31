<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-visakha-navy via-slate-900 to-visakha-navy px-4 py-12">
        <!-- Background Decoration -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-0 right-0 w-96 h-96 bg-visakha-gold/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <!-- Logo and Branding -->
        <div class="relative z-10 text-center mb-8">
            <Link href="/">
                <div class="flex items-center justify-center space-x-4">
                    <div class="w-16 h-16 rounded-lg bg-visakha-gold flex items-center justify-center text-visakha-navy font-bold text-xl shadow-lg">
                        VV
                    </div>
                    <div class="text-left">
                        <h1 class="text-2xl font-bold text-white tracking-wide">VISAKHA VIDYALAYA</h1>
                        <p class="text-visakha-gold text-sm italic">"Pannaya Parisujjhati"</p>
                    </div>
                </div>
            </Link>
        </div>

        <!-- Login Form Card -->
        <div class="relative z-10 w-full max-w-md">
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                <h2 class="text-xl font-semibold text-white text-center mb-6">Admin Portal</h2>
                <slot />
            </div>
        </div>

        <!-- Footer -->
        <div class="relative z-10 mt-8 text-center">
            <p class="text-gray-500 text-sm">
                &copy; {{ new Date().getFullYear() }} Visakha Vidyalaya. All rights reserved.
            </p>
        </div>
    </div>
</template>
