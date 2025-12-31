<script setup>
import NavBar from '@/Components/Visakha/NavBar.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <div class="min-h-screen bg-white font-sans text-gray-800">
        <Head>
            <title>Visakha Vidyalaya</title>
             <!-- Fonts are loaded via main build, but ensures inter/roboto precedence -->
        </Head>

        <NavBar />

        <main>
            <slot />
        </main>

        <footer class="bg-visakha-navy text-white text-center py-8">
            <div class="max-w-7xl mx-auto px-4">
                 <p class="text-sm opacity-80">&copy; {{ new Date().getFullYear() }} Visakha Vidyalaya. All Rights Reserved.</p>
                 <div class="mt-4 flex justify-center space-x-4">
                    <a href="#" class="text-xs hover:text-visakha-gold">Privacy Policy</a>
                    <a href="#" class="text-xs hover:text-visakha-gold">Terms of Service</a>
                 </div>
            </div>
        </footer>
    </div>
</template>
