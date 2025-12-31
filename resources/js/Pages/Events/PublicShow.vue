<script setup>
import VisakhaLayout from '@/Layouts/VisakhaLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

const props = defineProps({
    mainEvent: Object,
    futureEvents: Array,
    pastEvents: Array,
    pageTitle: {
        type: String,
        default: 'Events Dashboard'
    }
});

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

// Gallery Logic
const hasGallery = computed(() => props.mainEvent?.images && props.mainEvent.images.length > 0);
const navImageIndex = ref(0);
const showLightbox = ref(false);

const openLightbox = (index) => {
    navImageIndex.value = index;
    showLightbox.value = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
};

const closeLightbox = () => {
    showLightbox.value = false;
    document.body.style.overflow = '';
};

const nextImage = () => {
    if (props.mainEvent?.images) {
        navImageIndex.value = (navImageIndex.value + 1) % props.mainEvent.images.length;
    }
};

const prevImage = () => {
    if (props.mainEvent?.images) {
        navImageIndex.value = (navImageIndex.value - 1 + props.mainEvent.images.length) % props.mainEvent.images.length;
    }
};
</script>

<template>
    <Head :title="pageTitle + ' - Visakha Vidyalaya'" />

    <VisakhaLayout>
        <!-- Compact Hero Section -->
        <div class="relative bg-gradient-to-r from-visakha-navy to-slate-800 text-white py-10 overflow-hidden">
            <!-- Subtle Background Accent -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 right-0 w-64 h-64 rounded-full bg-visakha-gold blur-3xl"></div>
            </div>
            
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-visakha-gold text-xs font-bold tracking-widest uppercase mb-1">Visakha Vidyalaya</p>
                        <h1 class="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
                            {{ pageTitle || "Events" }}
                        </h1>
                    </div>
                    <div class="hidden md:block text-right">
                        <p class="text-gray-400 text-sm italic">"Pannaya Parisujjhati"</p>
                        <p class="text-gray-500 text-xs">Wisdom Purifies</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <!-- Main Content (Left Column) -->
                <div class="lg:col-span-2">
                    <div v-if="mainEvent" class="bg-white rounded-xl shadow-2xl overflow-hidden border-t-8 border-visakha-gold transition-all hover:shadow-3xl duration-500">
                        <div class="p-8 md:p-12">
                            <div class="flex items-center justify-between mb-6">
                                <span class="bg-visakha-blue/10 text-visakha-blue text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider border border-visakha-blue/20">
                                    Official Event
                                </span>
                                <span class="text-gray-400 text-sm font-mono">ID: #{{ mainEvent.id }}</span>
                            </div>

                            <h2 class="text-3xl md:text-4xl font-bold text-visakha-navy mb-6 leading-tight">
                                {{ mainEvent.title }}
                            </h2>
                            
                            <!-- Info Bar -->
                            <div class="flex flex-col sm:flex-row flex-wrap gap-y-4 gap-x-8 text-gray-700 mb-8 py-6 border-y border-gray-100 bg-gray-50/50 rounded-lg px-6">
                                <div class="flex items-center group">
                                    <div class="w-10 h-10 rounded-full bg-visakha-gold/20 flex items-center justify-center mr-3 group-hover:bg-visakha-gold transition">
                                        <svg class="w-5 h-5 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-xs uppercase text-gray-500 font-bold">Date</span>
                                        <span class="font-medium">{{ mainEvent.formatted_date }}</span>
                                    </div>
                                </div>
                                <div v-if="mainEvent.formatted_time" class="flex items-center group">
                                    <div class="w-10 h-10 rounded-full bg-visakha-gold/20 flex items-center justify-center mr-3 group-hover:bg-visakha-gold transition">
                                        <svg class="w-5 h-5 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-xs uppercase text-gray-500 font-bold">Time</span>
                                        <span class="font-medium">{{ mainEvent.formatted_time }}</span>
                                    </div>
                                </div>
                                <div v-if="mainEvent.venue" class="flex items-center group">
                                     <div class="w-10 h-10 rounded-full bg-visakha-gold/20 flex items-center justify-center mr-3 group-hover:bg-visakha-gold transition">
                                        <svg class="w-5 h-5 text-visakha-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-xs uppercase text-gray-500 font-bold">Venue</span>
                                        <span class="font-medium">{{ mainEvent.venue }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="prose prose-xl max-w-none text-gray-700 leading-relaxed mb-10 whitespace-pre-wrap font-serif">
                                {{ mainEvent.description }}
                            </div>

                            <!-- Event Agenda Section -->
                            <div v-if="mainEvent.has_agenda && mainEvent.agenda && mainEvent.agenda.length > 0" class="mb-10 animate-fade-in">
                                <h3 class="text-xl font-bold text-visakha-navy mb-6 flex items-center">
                                    <span class="w-1 h-6 bg-blue-500 mr-3 rounded"></span>
                                    Agenda
                                </h3>
                                <div class="relative pl-8 space-y-4">
                                    <!-- Timeline line -->
                                    <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-blue-300 to-blue-100"></div>
                                    
                                    <div 
                                        v-for="(item, idx) in mainEvent.agenda" 
                                        :key="idx"
                                        class="relative flex items-start group"
                                    >
                                        <!-- Timeline dot -->
                                        <div class="absolute left-[-22px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm group-hover:scale-110 transition-transform"></div>
                                        
                                        <!-- Content -->
                                        <div class="flex-1 bg-gradient-to-r from-blue-50 to-transparent rounded-lg p-4 hover:from-blue-100 transition-colors">
                                            <div class="flex items-center gap-4">
                                                <span class="text-sm font-bold text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                                    {{ item.time }}
                                                </span>
                                                <span class="text-gray-700 font-medium">{{ item.description }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Interactive Image Gallery -->
                            <div v-if="hasGallery" class="animate-fade-in delay-200">
                                <h3 class="text-xl font-bold text-visakha-navy mb-6 flex items-center">
                                    <span class="w-1 h-6 bg-visakha-gold mr-3 rounded"></span>
                                    Event Gallery
                                </h3>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div 
                                        v-for="(img, idx) in mainEvent.images" 
                                        :key="idx" 
                                        @click="openLightbox(idx)"
                                        class="aspect-square rounded-lg overflow-hidden shadow-sm cursor-zoom-in relative group"
                                    >
                                        <img 
                                            :src="img" 
                                            :alt="`Gallery image ${idx+1}`" 
                                            class="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
                                        >
                                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div v-else class="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-100">
                        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <p class="text-gray-500 text-lg">No events scheduled for today.</p>
                    </div>
                </div>

                <!-- Sidebar (Right Column) -->
                <div class="space-y-8 lg:mt-0 mt-8">
                    
                    <!-- Future Events -->
                    <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-visakha-navy hover:shadow-xl transition duration-300">
                        <h3 class="text-lg font-bold text-visakha-navy mb-6 uppercase tracking-wide flex items-center justify-between border-b pb-2">
                            Upcoming
                            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </h3>
                        <div v-if="futureEvents.length > 0" class="space-y-4">
                            <Link 
                                v-for="event in futureEvents" 
                                :key="event.id" 
                                :href="route('events.show.public', event.id)"
                                class="group flex items-start space-x-4 p-3 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                            >
                                <div class="flex-shrink-0 w-12 text-center bg-gray-100 rounded p-1 group-hover:bg-white group-hover:shadow-sm transition">
                                    <span class="block text-xs uppercase text-gray-500 font-bold">{{ new Date(event.event_date).toLocaleString('default', { month: 'short' }) }}</span>
                                    <span class="block text-lg font-bold text-visakha-navy">{{ new Date(event.event_date).getDate() }}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800 text-sm group-hover:text-visakha-blue transition">{{ event.title }}</h4>
                                    <span v-if="event.formatted_time" class="text-xs text-gray-500 mt-1 block">{{ event.formatted_time }}</span>
                                </div>
                            </Link>
                        </div>
                        <div v-else class="text-sm text-gray-500 italic py-4 text-center">No upcoming events found.</div>
                    </div>

                    <!-- Past Events -->
                    <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
                        <h3 class="text-lg font-bold text-gray-600 mb-6 uppercase tracking-wide border-b pb-2">Past Events</h3>
                        <div v-if="pastEvents.length > 0" class="relative pl-4 space-y-6">
                            <!-- Timeline line -->
                            <div class="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                            
                            <Link 
                                v-for="event in pastEvents" 
                                :key="event.id" 
                                :href="route('events.show.public', event.id)"
                                class="relative pl-4 block group hover:bg-gray-50 rounded py-1 -ml-4 pr-2 transition"
                            >
                                <div class="absolute left-[-5px] top-2.5 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white group-hover:bg-visakha-gold transition"></div>
                                <h4 class="font-medium text-gray-700 text-sm group-hover:text-visakha-navy transition">{{ event.title }}</h4>
                                <div class="text-xs text-gray-400 mt-0.5">
                                    {{ event.formatted_date }}
                                </div>
                            </Link>
                        </div>
                        <div v-else class="text-sm text-gray-500 italic py-4 text-center">No past events history.</div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Gallery Lightbox Modal -->
        <div v-if="showLightbox" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300">
            <!-- Close Button -->
            <button @click="closeLightbox" class="absolute top-4 right-4 text-white/70 hover:text-white transition z-50 p-2">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <!-- Navigation Buttons -->
            <button @click="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition p-4 rounded-full hover:bg-white/10">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button @click="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition p-4 rounded-full hover:bg-white/10">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            <!-- Image -->
            <div class="max-w-5xl max-h-[90vh] p-2">
                <img :src="props.mainEvent.images[navImageIndex]" class="max-h-[85vh] max-w-full object-contain rounded shadow-2xl" alt="Full size gallery image">
                <div class="text-center text-white/60 mt-4 text-sm font-mono">
                    Image {{ navImageIndex + 1 }} of {{ props.mainEvent.images.length }}
                </div>
            </div>
        </div>

    </VisakhaLayout>
</template>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}
.animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
}
.delay-200 {
    animation-delay: 0.2s;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
