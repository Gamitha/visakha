<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';

const showingNavigationDropdown = ref(false);

// route() is available globally via window.route
</script>

<template>
    <nav class="bg-white border-b border-gray-100 shadow-md sticky top-0 z-50">
        <!-- Top Bar (Hidden on mobile) -->
        <div class="hidden md:block bg-visakha-navy text-white text-xs py-2 px-4">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex space-x-4">
                    <span>Contact: +94 11 258 1082</span>
                    <span>Email: info@visakhavidyalaya.lk</span>
                </div>
                <div class="flex space-x-3">
                    <a href="#" class="hover:text-visakha-gold transition">Facebook</a>
                    <a href="#" class="hover:text-visakha-gold transition">Instagram</a>
                    <a href="#" class="hover:text-visakha-gold transition">YouTube</a>
                </div>
            </div>
        </div>

        <!-- Main Navigation -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-24">
                <div class="flex items-center">
                    <!-- Logo / Crest -->
                    <Link :href="route('visakha.home')" class="flex shrink-0 items-center gap-3">
                         <!-- Placeholder Crest -->
                         <div class="w-12 h-16 bg-visakha-gold rounded-b-xl flex items-center justify-center text-visakha-navy font-bold text-xs shadow-lg border-2 border-visakha-navy">
                            Crest
                        </div>
                        <div class="flex flex-col">
                            <h1 class="text-visakha-navy font-bold text-xl uppercase tracking-wide">Visakha Vidyalaya</h1>
                            <span class="text-xs text-visakha-blue font-serif italic">Pannaya Parisujjhati (Wisdom Purifies)</span>
                        </div>
                    </Link>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex items-center">
                    <Link :href="route('events.list')" class="text-gray-600 font-medium hover:text-visakha-navy uppercase text-sm tracking-wider transition">Events</Link>
                    <Link :href="route('events.today')" class="text-gray-600 font-medium hover:text-visakha-navy uppercase text-sm tracking-wider transition">Today's event</Link>
                    <Link :href="route('about.index')" class="text-gray-600 font-medium hover:text-visakha-navy uppercase text-sm tracking-wider transition">About school</Link>
                    

                </div>

                <!-- Hamburger -->
                <div class="-me-2 flex items-center sm:hidden">
                    <button
                        @click="showingNavigationDropdown = !showingNavigationDropdown"
                        class="inline-flex items-center justify-center p-2 rounded-md text-visakha-navy hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path
                                :class="{
                                    hidden: showingNavigationDropdown,
                                    'inline-flex': !showingNavigationDropdown,
                                }"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                            <path
                                :class="{
                                    hidden: !showingNavigationDropdown,
                                    'inline-flex': showingNavigationDropdown,
                                }"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Responsive Navigation Menu -->
        <div
            :class="{ block: showingNavigationDropdown, hidden: !showingNavigationDropdown }"
            class="sm:hidden bg-white border-t"
        >
            <div class="pt-2 pb-3 space-y-1">
                <Link :href="route('events.list')" class="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out">
                    Events
                </Link>
                <Link :href="route('events.today')" class="block w-full ps-3 pe-4 py-2 border-l-4 border-visakha-navy text-start text-base font-medium text-visakha-navy bg-indigo-50 focus:outline-none transition duration-150 ease-in-out">
                    Today's event
                </Link>
                <Link :href="route('about.index')" class="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out">
                    About school
                </Link>
            </div>
        </div>
    </nav>
</template>
