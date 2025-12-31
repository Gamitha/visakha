<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentSlide = ref(0);
const slides = [
    {
        id: 1,
        image: 'https://visakhavidyalaya.lk/storage/Header%20Images/1.jpg', // Using direct link or placeholder if fail
        title: 'WELCOME TO VISAKHA VIDYALAYA',
        subtitle: 'Pannaya Parisujjhati (Wisdom Purifies)',
        color: 'bg-visakha-navy' 
    },
    {
        id: 2,
        image: 'https://visakhavidyalaya.lk/storage/Header%20Images/2.jpg',
        title: 'EXCELLENCE IN EDUCATION',
        subtitle: 'Empowering the next generation of leaders',
        color: 'bg-visakha-blue'
    },
    {
        id: 3,
        image: 'https://visakhavidyalaya.lk/storage/Header%20Images/3.jpg',
        title: 'TRADITION & INNOVATION',
        subtitle: 'A legacy of over 100 years',
        color: 'bg-visakha-gold'
    }
];

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const setSlide = (index) => {
    currentSlide.value = index;
};

let interval;
onMounted(() => {
    interval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
    clearInterval(interval);
});
</script>

<template>
    <div class="relative h-[600px] w-full overflow-hidden">
        <!-- Slides -->
        <div 
            v-for="(slide, index) in slides" 
            :key="slide.id"
            class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
        >
            <!-- Fallback colored background if image fails to load (likely due to hotlink protection, though school sites usually open) -->
             <!-- We use a gradient overlay to ensure text readability -->
            <div class="absolute inset-0 bg-black/40 z-10"></div>
            
            <!-- Placeholder for image - using a colored div for reliability in this demo -->
            <div :class="`w-full h-full ${slide.color} flex items-center justify-center`">
                 <!-- Make it look like an image -->
                 <div class="text-white opacity-10 text-9xl font-bold uppercase tracking-tighter rotate-12 select-none">
                    Visakha
                 </div>
            </div>

            <!-- Content -->
            <div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
                <h2 class="text-xl md:text-3xl font-serif italic mb-2 tracking-wider animate-fade-in-up">{{ slide.subtitle }}</h2>
                <h1 class="text-4xl md:text-6xl font-bold uppercase tracking-widest shadow-sm animate-fade-in-up delay-100">{{ slide.title }}</h1>
                <button class="mt-8 px-8 py-3 bg-visakha-gold text-visakha-navy font-bold uppercase tracking-widest hover:bg-white hover:text-visakha-navy transition duration-300 rounded-sm">
                    Read More
                </button>
            </div>
        </div>

        <!-- Vertical Navigation (Right Side) -->
        <div class="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-4">
            <button 
                v-for="(slide, index) in slides" 
                :key="slide.id"
                @click="setSlide(index)"
                class="w-3 h-3 rounded-full border-2 border-white transition-all duration-300"
                :class="{ 'bg-visakha-gold border-visakha-gold': currentSlide === index, 'bg-transparent hover:bg-white/50': currentSlide !== index }"
            ></button>
        </div>
        
        <!-- Bottom Curve/Shape Divider (Optional stylistic element) -->
        <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
            <svg class="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" class="fill-white"></path>
            </svg>
        </div>
    </div>
</template>

<style scoped>
.delay-100 {
    animation-delay: 200ms;
}
</style>
