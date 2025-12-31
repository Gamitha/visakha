<script setup>
import VisakhaLayout from '@/Layouts/VisakhaLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

const props = defineProps({
    events: Array
});

// Search functionality
const searchQuery = ref('');
const showSearch = ref(false);

const filteredEvents = computed(() => {
    if (searchQuery.value.length < 3) {
        return props.events;
    }
    const query = searchQuery.value.toLowerCase();
    return props.events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.venue && event.venue.toLowerCase().includes(query))
    );
});

const toggleSearch = () => {
    showSearch.value = !showSearch.value;
    if (!showSearch.value) {
        searchQuery.value = '';
    }
};

// Helper to get first image or placeholder
const getEventImage = (images) => {
    if (images && images.length > 0) {
        return images[0];
    }
    return '/images/placeholder-event.jpg'; 
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // Handle if timeStr is already formatted like "06:00 PM" (unlikely if raw from DB, but possible if controller sent it)
    if (timeStr.includes('M')) return timeStr;
    
    // Assume text like "18:00:00"
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};
</script>

<template>
    <Head title="All Events" />

    <VisakhaLayout>
        <!-- Compact Hero Section (Matching PublicShow) -->
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
                            School Events
                        </h1>
                    </div>
                    <div class="flex items-center gap-4">
                        <!-- Search Button -->
                        <button 
                            @click="toggleSearch"
                            class="p-2 rounded-full hover:bg-white/10 transition-colors"
                            :class="{ 'bg-white/20': showSearch }"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <div class="hidden md:block text-right">
                            <p class="text-gray-400 text-sm italic">"Pannaya Parisujjhati"</p>
                            <p class="text-gray-500 text-xs">Wisdom Purifies</p>
                        </div>
                    </div>
                </div>
                
                <!-- Search Bar (Expandable) -->
                <div 
                    v-if="showSearch"
                    class="mt-6 animate-fade-in"
                >
                    <div class="relative max-w-xl">
                        <input 
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search events by title, description, or venue... (min. 3 characters)"
                            class="w-full px-5 py-3 pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-visakha-gold focus:border-transparent transition-all"
                            autofocus
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <button 
                            v-if="searchQuery"
                            @click="searchQuery = ''"
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p v-if="searchQuery.length > 0 && searchQuery.length < 3" class="text-gray-400 text-sm mt-2 ml-4">
                        Type at least 3 characters to search...
                    </p>
                    <p v-else-if="searchQuery.length >= 3" class="text-visakha-gold text-sm mt-2 ml-4">
                        Found {{ filteredEvents.length }} event{{ filteredEvents.length !== 1 ? 's' : '' }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Events Grid -->
        <div class="py-12 bg-gray-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div v-if="filteredEvents.length === 0" class="text-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p v-if="searchQuery.length >= 3">No events match "{{ searchQuery }}"</p>
                    <p v-else>No events found.</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Link 
                        v-for="event in filteredEvents" 
                        :key="event.id" 
                        :href="route('events.show.public', event.id)"
                        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 block group"
                    >
                        <!-- Image -->
                        <div class="h-48 w-full bg-gray-200 relative overflow-hidden">
                            <img :src="getEventImage(event.images)" alt="Event Image" class="w-full h-full object-cover group-hover:scale-105 transition duration-700">
                            <!-- Status Badge -->
                            <div class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm" :class="event.status_color">
                                {{ event.status }}
                            </div>
                        </div>

                        <!-- Content -->
                        <div class="p-6 flex-1 flex flex-col">
                            <div class="flex items-center text-sm text-gray-500 mb-3 space-x-3">
                                <div class="flex items-center bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ formatDate(event.event_date) }}
                                </div>
                                <div v-if="event.event_time" class="flex items-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ formatTime(event.event_time) }}
                                </div>
                            </div>

                            <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-visakha-navy transition">
                                {{ event.title }}
                            </h3>

                            <div v-if="event.venue" class="flex items-center text-sm text-gray-600 mb-4 mt-auto pt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {{ event.venue }}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </VisakhaLayout>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
