<script setup>
import VisakhaLayout from '@/Layouts/VisakhaLayout.vue';
import HeroSection from '@/Components/Visakha/HeroSection.vue';
import QuickLinks from '@/Components/Visakha/QuickLinks.vue';
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Home - Visakha Vidyalaya" />

    <VisakhaLayout>
        <!-- Hero Section -->
        <HeroSection />

        <!-- Quick Links (Cards) -->
        <QuickLinks />

        <!-- Welcome Message Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                     <h2 class="text-visakha-navy text-3xl font-bold uppercase mb-4 relative inline-block">
                        Principal's Message
                        <span class="absolute bottom-0 left-0 w-1/2 h-1 bg-visakha-gold rounded"></span>
                    </h2>
                    <p class="text-gray-600 leading-relaxed mb-6 font-serif text-lg">
                        "Welcome to Visakha Vidyalaya, the premier Buddhist girls' school in Sri Lanka. 
                        We are dedicated to nurturing young minds with wisdom and character, guided by our motto 'Pannaya Parisujjhati'."
                    </p>
                    <p class="text-gray-600 leading-relaxed mb-8">
                        Our institution stands as a beacon of academic excellence and cultural heritage, 
                        empowering students to become global leaders while preserving our rich traditions.
                    </p>
                    <div class="flex items-center">
                        <div class="h-16 w-16 bg-gray-200 rounded-full mr-4 flex-shrink-0 overflow-hidden">
                             <!-- Placeholder for Principal Image -->
                             <div class="w-full h-full bg-visakha-navy flex items-center justify-center text-white text-xs">IMG</div>
                        </div>
                        <div>
                            <h4 class="text-visakha-navy font-bold text-lg">Mrs. Manomi Seneviratne</h4>
                            <span class="text-visakha-blue text-sm uppercase">Principal</span>
                        </div>
                    </div>
                </div>
                <!-- Promotional Video / Image Area -->
                <div class="relative rounded-xl overflow-hidden shadow-2xl h-80 bg-gray-100 group">
                    <div class="absolute inset-0 bg-visakha-navy/20 group-hover:bg-visakha-navy/10 transition"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition shadow-lg">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-visakha-navy ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- News Section -->
        <section class="bg-gray-50 py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                     <h2 class="text-visakha-navy text-3xl font-bold uppercase mb-2">Latest News</h2>
                     <div class="w-24 h-1 bg-visakha-gold mx-auto rounded"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                        <div class="h-48 bg-gray-200 relative">
                            <div class="absolute top-4 right-4 bg-visakha-gold text-visakha-navy text-xs font-bold px-2 py-1 rounded">
                                DEC 2{{ i }}
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-visakha-navy font-bold text-lg mb-2 hover:text-visakha-blue cursor-pointer">Annual Prize Giving Ceremony 2025</h3>
                            <p class="text-gray-500 text-sm mb-4 line-clamp-3">
                                The annual prize giving ceremony was held with great grandeur...
                            </p>
                            <a href="#" class="text-visakha-blue font-bold text-sm uppercase hover:underline">Read More &rarr;</a>
                        </div>
                    </div>
                </div>
                 <div class="text-center mt-12">
                    <button class="px-8 py-3 border-2 border-visakha-navy text-visakha-navy font-bold uppercase tracking-wider hover:bg-visakha-navy hover:text-white transition rounded-sm">
                        View All News
                    </button>
                </div>
            </div>
        </section>

    </VisakhaLayout>
</template>
