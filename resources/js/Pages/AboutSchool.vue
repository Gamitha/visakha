<script setup>
import VisakhaLayout from '@/Layouts/VisakhaLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';

const currentImageIndex = ref(0);
const galleryImages = [
    { src: '/images/about/school_building.jpg', alt: 'Visakha Vidyalaya Main Building' },
    { src: '/images/about/school_band_1.jpg', alt: 'Visakha Band Performance' },
    { src: '/images/about/school_band_2.jpg', alt: 'Visakha Band Marching' },
];

const nextImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % galleryImages.length;
};

const prevImage = () => {
    currentImageIndex.value = (currentImageIndex.value - 1 + galleryImages.length) % galleryImages.length;
};

const selectImage = (index) => {
    currentImageIndex.value = index;
};
</script>

<template>
    <Head title="About - Visakha Vidyalaya" />

    <VisakhaLayout>
        <!-- Hero Section -->
        <section class="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-visakha-navy via-visakha-navy/95 to-visakha-blue overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
            </div>
            
            <!-- Content -->
            <div class="relative h-full flex flex-col items-center justify-center text-center px-4">
                <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                    About Our School
                </h1>
                <div class="w-32 h-1 bg-visakha-gold rounded mb-6"></div>
                <p class="text-xl text-white/80 max-w-2xl font-light">
                    Visakha Vidyalaya – The Premier Buddhist Girls' School in Sri Lanka
                </p>
            </div>

            <!-- Decorative Bottom Wave -->
            <div class="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
                </svg>
            </div>
        </section>

        <!-- History Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div class="order-2 lg:order-1">
                    <h2 class="text-visakha-navy text-3xl font-bold uppercase mb-2 relative inline-block">
                        Our History
                        <span class="absolute -bottom-1 left-0 w-1/2 h-1 bg-visakha-gold rounded"></span>
                    </h2>
                    <p class="text-gray-600 leading-relaxed mt-6 text-lg">
                        Our school began under the name of <strong>"Buddhist Girls' College"</strong> in a house called 
                        <em>"The Firs"</em> at Turret Road, Colombo, Sri Lanka.
                    </p>
                    <p class="text-gray-600 leading-relaxed mt-4 text-lg">
                        It was moved to its present premises at Vajira Road on the <strong>21st of November 1927</strong> 
                        and named <strong>"Visakha Vidyalaya"</strong> by Lady Herbert Stanley, the wife of the then Governor of Ceylon.
                    </p>
                    <p class="text-gray-600 leading-relaxed mt-4 text-lg">
                        From humble beginnings, Visakha Vidyalaya has risen to the position of the 
                        <strong class="text-visakha-navy">most sought after school for girls in Sri Lanka</strong>. 
                        Furthermore, it is the <strong class="text-visakha-gold">only girls' school identified amongst the National Schools</strong> in the island.
                    </p>
                </div>
                <div class="order-1 lg:order-2">
                    <div class="relative rounded-2xl overflow-hidden shadow-2xl group">
                        <img 
                            src="/images/about/school_building.jpg" 
                            alt="Visakha Vidyalaya Main Building" 
                            class="w-full h-80 lg:h-96 object-cover transform group-hover:scale-105 transition duration-700"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-visakha-navy/50 to-transparent"></div>
                        <div class="absolute bottom-4 left-4 right-4">
                            <span class="bg-visakha-gold text-visakha-navy text-sm font-bold px-3 py-1 rounded">
                                Est. 1927
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Statistics Section -->
        <section class="bg-gradient-to-r from-visakha-navy to-visakha-blue py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div class="text-white">
                        <div class="text-5xl font-bold text-visakha-gold mb-2">5000+</div>
                        <div class="text-white/80 uppercase tracking-wider text-sm">Students</div>
                    </div>
                    <div class="text-white">
                        <div class="text-5xl font-bold text-visakha-gold mb-2">200+</div>
                        <div class="text-white/80 uppercase tracking-wider text-sm">Educators</div>
                    </div>
                    <div class="text-white">
                        <div class="text-5xl font-bold text-visakha-gold mb-2">97</div>
                        <div class="text-white/80 uppercase tracking-wider text-sm">Years of Excellence</div>
                    </div>
                    <div class="text-white">
                        <div class="text-5xl font-bold text-visakha-gold mb-2">#1</div>
                        <div class="text-white/80 uppercase tracking-wider text-sm">National School</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Administration Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center mb-12">
                <h2 class="text-visakha-navy text-3xl font-bold uppercase mb-2">Administration</h2>
                <div class="w-24 h-1 bg-visakha-gold mx-auto rounded"></div>
            </div>

            <!-- Principal -->
            <div class="flex justify-center mb-12">
                <div class="bg-gradient-to-br from-visakha-navy to-visakha-blue rounded-2xl p-8 text-center shadow-xl max-w-sm">
                    <div class="w-24 h-24 bg-visakha-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg class="w-12 h-12 text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <h3 class="text-white text-xl font-bold">Mrs. Manomi Seneviratne</h3>
                    <span class="inline-block mt-2 bg-visakha-gold text-visakha-navy text-sm font-bold px-4 py-1 rounded-full">Principal</span>
                </div>
            </div>

            <!-- Deputy Principals -->
            <div class="mb-8">
                <h3 class="text-visakha-navy text-xl font-semibold text-center mb-6">Deputy Principals</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white border-2 border-visakha-navy/10 rounded-xl p-6 text-center hover:shadow-lg hover:border-visakha-gold transition-all">
                        <div class="w-16 h-16 bg-visakha-navy/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <svg class="w-8 h-8 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </div>
                        <h4 class="text-visakha-navy font-bold">Mrs. Dulani Priyadarshani</h4>
                        <span class="text-sm text-gray-500">Sports & Co-curricular</span>
                    </div>
                    <div class="bg-white border-2 border-visakha-navy/10 rounded-xl p-6 text-center hover:shadow-lg hover:border-visakha-gold transition-all">
                        <div class="w-16 h-16 bg-visakha-navy/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <svg class="w-8 h-8 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </div>
                        <h4 class="text-visakha-navy font-bold">Mrs. Prasadini Rathnasiri</h4>
                        <span class="text-sm text-gray-500">Administration</span>
                    </div>
                    <div class="bg-white border-2 border-visakha-navy/10 rounded-xl p-6 text-center hover:shadow-lg hover:border-visakha-gold transition-all">
                        <div class="w-16 h-16 bg-visakha-navy/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <svg class="w-8 h-8 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </div>
                        <h4 class="text-visakha-navy font-bold">Mrs. Nishanthika Wellappuli</h4>
                        <span class="text-sm text-gray-500">Education Development</span>
                    </div>
                </div>
            </div>

            <!-- Assistant Principals -->
            <div>
                <h3 class="text-visakha-navy text-xl font-semibold text-center mb-6">Assistant Principals</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gray-50 rounded-xl p-5 text-center hover:bg-white hover:shadow-md transition-all">
                        <h4 class="text-visakha-navy font-semibold">Mrs. Chandrika Rathnayaka</h4>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-5 text-center hover:bg-white hover:shadow-md transition-all">
                        <h4 class="text-visakha-navy font-semibold">Mrs. Chamari Gunasekara</h4>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-5 text-center hover:bg-white hover:shadow-md transition-all">
                        <h4 class="text-visakha-navy font-semibold">Mrs. Tolani Manawadu</h4>
                    </div>
                </div>
            </div>
        </section>

        <!-- Vision & Mission Section -->
        <section class="bg-gray-50 py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Vision -->
                    <div class="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-visakha-gold">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-visakha-gold/20 rounded-full flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                            </div>
                            <h3 class="text-visakha-navy text-2xl font-bold">Our Vision</h3>
                        </div>
                        <p class="text-gray-700 text-lg leading-relaxed italic">
                            "Virtuous, far sighted and stable leadership is the vision of a Visakhian."
                        </p>
                    </div>

                    <!-- Mission -->
                    <div class="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-visakha-navy">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-visakha-navy/10 rounded-full flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                                </svg>
                            </div>
                            <h3 class="text-visakha-navy text-2xl font-bold">Our Mission</h3>
                        </div>
                        <p class="text-gray-700 text-lg leading-relaxed">
                            To bequeath to the nation, Visakhians who will safeguard the Sri Lankan culture and national identity, 
                            while being <strong>competent</strong>, <strong>environment friendly</strong>, <strong>patriotic</strong> 
                            and well balanced in personality with humane qualities.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery Section -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center mb-12">
                <h2 class="text-visakha-navy text-3xl font-bold uppercase mb-2">Gallery</h2>
                <div class="w-24 h-1 bg-visakha-gold mx-auto rounded"></div>
            </div>

            <!-- Image Carousel -->
            <div class="relative">
                <div class="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                    <transition name="fade" mode="out-in">
                        <img 
                            :key="currentImageIndex"
                            :src="galleryImages[currentImageIndex].src" 
                            :alt="galleryImages[currentImageIndex].alt"
                            class="w-full h-full object-cover"
                        />
                    </transition>
                    
                    <!-- Navigation Arrows -->
                    <button 
                        @click="prevImage" 
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
                    >
                        <svg class="w-6 h-6 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <button 
                        @click="nextImage" 
                        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition"
                    >
                        <svg class="w-6 h-6 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>

                <!-- Thumbnails -->
                <div class="flex justify-center gap-4 mt-6">
                    <button 
                        v-for="(img, index) in galleryImages" 
                        :key="index"
                        @click="selectImage(index)"
                        :class="[
                            'w-24 h-16 rounded-lg overflow-hidden border-2 transition-all',
                            currentImageIndex === index ? 'border-visakha-gold shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        ]"
                    >
                        <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover"/>
                    </button>
                </div>
            </div>
        </section>
    </VisakhaLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
