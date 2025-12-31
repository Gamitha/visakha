<script setup>
</script>

<template>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 z-30 mb-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Card 1: Upcoming Events (Blue) -->
            <div class="group bg-visakha-blue rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 cursor-pointer">
                <div class="p-8 flex flex-col items-center text-center text-white h-full">
                    <div class="bg-white/20 p-4 rounded-full mb-4 group-hover:bg-visakha-gold group-hover:text-visakha-navy transition">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold uppercase mb-2">Upcoming Events</h3>
                    <p class="text-sm opacity-90 mb-6">Stay updated with the latest happenings at Visakha Vidyalaya.</p>
                    <span class="mt-auto px-4 py-2 border border-white rounded text-sm uppercase font-bold group-hover:bg-white group-hover:text-visakha-blue transition">
                        View Calendar
                    </span>
                </div>
            </div>

            <!-- Card 2: Featured Events (Gold) -->
            <div class="group bg-visakha-gold rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 cursor-pointer md:-mt-4 relative">
                <div class="absolute top-0 right-0 bg-visakha-navy text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                </div>
                <div class="p-8 flex flex-col items-center text-center text-visakha-navy h-full">
                    <div class="bg-white/30 p-4 rounded-full mb-4 group-hover:bg-visakha-navy group-hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold uppercase mb-2">Featured Events</h3>
                    <p class="text-sm opacity-90 mb-6 font-medium">Highlights of our most prestigious annual gatherings.</p>
                     <span class="mt-auto px-4 py-2 border border-visakha-navy rounded text-sm uppercase font-bold group-hover:bg-visakha-navy group-hover:text-white transition">
                        Explore
                    </span>
                </div>
            </div>

            <!-- Card 3: Gallery (Blue) -->
            <div class="group bg-visakha-blue rounded-lg shadow-xl overflow-hidden transform hover:-translate-y-2 transition duration-300 cursor-pointer">
                <div class="p-8 flex flex-col items-center text-center text-white h-full">
                    <div class="bg-white/20 p-4 rounded-full mb-4 group-hover:bg-visakha-gold group-hover:text-visakha-navy transition">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold uppercase mb-2">Photo Gallery</h3>
                    <p class="text-sm opacity-90 mb-6">Capturing the memorable moments of student life.</p>
                     <span class="mt-auto px-4 py-2 border border-white rounded text-sm uppercase font-bold group-hover:bg-white group-hover:text-visakha-blue transition">
                        View Photos
                    </span>
                </div>
            </div>

        </div>
    </div>
</template>
