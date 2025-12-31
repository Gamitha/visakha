<script setup>
import { useForm, router } from '@inertiajs/vue3';
import { watch, ref, computed } from 'vue';

const props = defineProps({
    event: Object,
});

const emit = defineEmits(['close', 'success']);

const form = useForm({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    venue: '',
    images: [],
    existing_images: [],
    is_active: true,
    has_agenda: false,
    agenda: [],
});

// Image previews for new uploads
const newImagePreviews = ref([]);
const existingImages = ref([]);
const isDragging = ref(false);

// Agenda drag state
const draggedAgendaIndex = ref(null);

// Watch for changes in props.event to populate form
watch(() => props.event, (newEvent) => {
    form.title = newEvent?.title || '';
    form.description = newEvent?.description || '';
    // Extract YYYY-MM-DD from ISO timestamp (e.g. 2025-12-27T00:00:00.000000Z -> 2025-12-27)
    form.event_date = newEvent?.event_date ? newEvent.event_date.split('T')[0] : '';
    form.event_time = newEvent?.event_time || '';
    form.venue = newEvent?.venue || '';
    form.is_active = newEvent?.is_active ?? true;
    form.has_agenda = newEvent?.has_agenda ?? false;
    form.agenda = newEvent?.agenda ? [...newEvent.agenda] : [];
    form.images = [];
    form.existing_images = newEvent?.images || [];
    existingImages.value = newEvent?.images || [];
    newImagePreviews.value = [];
}, { immediate: true });

// Compute total image count
const totalImageCount = computed(() => {
    return existingImages.value.length + newImagePreviews.value.length;
});

const canUploadMore = computed(() => {
    return totalImageCount.value < 20;
});

const remainingSlots = computed(() => {
    return 20 - totalImageCount.value;
});

const submit = () => {
    if (props.event) {
        form.transform((data) => ({
            ...data,
            _method: 'PUT',
        })).post(route('events.update', props.event.id), {
            onSuccess: () => emit('success'),
            forceFormData: true,
        });
    } else {
        form.post(route('events.store'), {
            onSuccess: () => emit('success'),
            forceFormData: true,
        });
    }
};

const processFiles = (files) => {
    const fileArray = Array.from(files);
    
    if (existingImages.value.length + newImagePreviews.value.length + fileArray.length > 20) {
        alert(`Maximum 20 images allowed. You can add ${remainingSlots.value} more images.`);
        return;
    }

    const currentFiles = form.images ? Array.from(form.images) : [];
    const allFiles = [...currentFiles, ...fileArray];
    
    const dt = new DataTransfer();
    allFiles.forEach(file => dt.items.add(file));
    form.images = dt.files;

    fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            newImagePreviews.value.push({
                url: e.target.result,
                file: file,
                name: file.name
            });
        };
        reader.readAsDataURL(file);
    });
};

const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
};

const handleDrop = (e) => {
    e.preventDefault();
    isDragging.value = false;
    if (e.dataTransfer.files.length) {
        processFiles(e.dataTransfer.files);
    }
};

const handleDragOver = (e) => {
    e.preventDefault();
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const removeExistingImage = (imagePath) => {
    existingImages.value = existingImages.value.filter(img => img !== imagePath);
    form.existing_images = existingImages.value;
};

const removeNewImage = (index) => {
    newImagePreviews.value.splice(index, 1);
    
    const dt = new DataTransfer();
    newImagePreviews.value.forEach(preview => {
        if (preview.file) {
            dt.items.add(preview.file);
        }
    });
    form.images = dt.files;
};

// Agenda management functions
const addAgendaItem = () => {
    form.agenda.push({ time: '', description: '' });
};

const removeAgendaItem = (index) => {
    form.agenda.splice(index, 1);
};

const onAgendaDragStart = (index) => {
    draggedAgendaIndex.value = index;
};

const onAgendaDragOver = (e, index) => {
    e.preventDefault();
    if (draggedAgendaIndex.value === null || draggedAgendaIndex.value === index) return;
    
    const items = [...form.agenda];
    const draggedItem = items[draggedAgendaIndex.value];
    items.splice(draggedAgendaIndex.value, 1);
    items.splice(index, 0, draggedItem);
    form.agenda = items;
    draggedAgendaIndex.value = index;
};

const onAgendaDragEnd = () => {
    draggedAgendaIndex.value = null;
};
</script>



<template>
    <form @submit.prevent="submit" enctype="multipart/form-data" class="flex flex-col h-[85vh]">
        <!-- Sticky Header with Title and Actions -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg shrink-0">
            <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ props.event ? 'Edit Event' : 'Create New Event' }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ props.event ? 'Update event details and manage gallery.' : 'Fill in the details to create a new event.' }}
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button 
                    type="button" 
                    @click="$emit('close')" 
                    class="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    class="px-6 py-2.5 bg-visakha-navy hover:bg-visakha-navy/90 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow flex items-center text-sm" 
                    :disabled="form.processing"
                >
                    <svg v-if="form.processing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span v-if="form.processing">Saving...</span>
                    <span v-else>{{ props.event ? 'Update Changes' : 'Create Event' }}</span>
                </button>
            </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column - Basic Info -->
                <div class="space-y-6">
                    <!-- Title -->
                    <div>
                        <label class="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="title">
                            <svg class="w-4 h-4 mr-2 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Event Title <span class="text-red-500 ml-1">*</span>
                        </label>
                        <input 
                            v-model="form.title" 
                            id="title" 
                            type="text" 
                            placeholder="Enter event title..."
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-visakha-navy focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-500" 
                            required
                        >
                        <div v-if="form.errors.title" class="text-red-500 text-xs mt-1">{{ form.errors.title }}</div>
                    </div>

                    <!-- Date & Time Row -->
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="event_date">
                                <svg class="w-4 h-4 mr-2 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                Date <span class="text-red-500 ml-1">*</span>
                            </label>
                            <input 
                                v-model="form.event_date" 
                                id="event_date" 
                                type="date" 
                                class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-visakha-navy focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600" 
                                required
                            >
                        </div>
                        <div>
                            <label class="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="event_time">
                                <svg class="w-4 h-4 mr-2 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Time
                            </label>
                            <input 
                                v-model="form.event_time" 
                                id="event_time" 
                                type="time" 
                                class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-visakha-navy focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600"
                            >
                        </div>
                    </div>

                    <!-- Venue -->
                    <div>
                        <label class="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="venue">
                            <svg class="w-4 h-4 mr-2 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            Venue
                        </label>
                        <input 
                            v-model="form.venue" 
                            id="venue" 
                            type="text" 
                            placeholder="e.g., Main Hall, Sports Ground..."
                            class="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-visakha-navy focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
                        >
                    </div>

                    <!-- Active Status Toggle -->
                    <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200 dark:border-gray-500">
                        <label class="flex items-center justify-between cursor-pointer group">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-visakha-navy/10 dark:bg-white/10 flex items-center justify-center mr-3 group-hover:bg-visakha-navy/20 dark:group-hover:bg-white/20 transition-colors">
                                    <svg class="w-5 h-5 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                </div>
                                <div>
                                    <span class="font-semibold text-gray-800 dark:text-white">Public Visibility</span>
                                    <p class="text-xs text-gray-500 dark:text-gray-300">Toggle to show/hide on public pages</p>
                                </div>
                            </div>
                            <div class="relative">
                                <input type="checkbox" v-model="form.is_active" class="sr-only peer">
                                <div class="w-14 h-7 bg-gray-300 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-visakha-navy/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 transition-colors"></div>
                            </div>
                        </label>
                    </div>

                    <!-- Agenda Toggle -->
                    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-blue-200 dark:border-gray-500">
                        <label class="flex items-center justify-between cursor-pointer group">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-white/20 transition-colors">
                                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                                    </svg>
                                </div>
                                <div>
                                    <span class="font-semibold text-gray-800 dark:text-white">Event Agenda</span>
                                    <p class="text-xs text-gray-500 dark:text-gray-300">Add a schedule/timeline for the event</p>
                                </div>
                            </div>
                            <div class="relative">
                                <input type="checkbox" v-model="form.has_agenda" class="sr-only peer">
                                <div class="w-14 h-7 bg-gray-300 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500 transition-colors"></div>
                            </div>
                        </label>
                        
                        <!-- Agenda Items Editor -->
                        <div v-if="form.has_agenda" class="mt-4 space-y-3">
                            <div v-if="form.errors.agenda" class="text-red-500 text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">{{ form.errors.agenda }}</div>
                            
                            <!-- Agenda Items List -->
                            <div 
                                v-for="(item, index) in form.agenda" 
                                :key="index"
                                draggable="true"
                                @dragstart="onAgendaDragStart(index)"
                                @dragover="onAgendaDragOver($event, index)"
                                @dragend="onAgendaDragEnd"
                                class="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm cursor-move hover:shadow-md transition-shadow"
                                :class="{ 'ring-2 ring-blue-400': draggedAgendaIndex === index }"
                            >
                                <!-- Drag Handle -->
                                <div class="flex-shrink-0 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
                                    </svg>
                                </div>
                                
                                <!-- Time Input -->
                                <input 
                                    v-model="item.time" 
                                    type="time" 
                                    placeholder="Time"
                                    class="w-28 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-600 dark:text-white"
                                >
                                
                                <!-- Description Input -->
                                <input 
                                    v-model="item.description" 
                                    type="text" 
                                    placeholder="Activity description..."
                                    class="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-600 dark:text-white placeholder-gray-400"
                                >
                                
                                <!-- Delete Button -->
                                <button 
                                    type="button" 
                                    @click="removeAgendaItem(index)"
                                    class="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <!-- Add Item Button -->
                            <button 
                                type="button" 
                                @click="addAgendaItem"
                                class="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 transition-colors"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                                Add Agenda Item
                            </button>
                            
                            <p v-if="form.agenda.length === 0" class="text-xs text-amber-600 dark:text-amber-400">
                                ⚠️ At least one agenda item is required when agenda is enabled
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Description -->
                <div>
                    <label class="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="description">
                        <svg class="w-4 h-4 mr-2 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                        </svg>
                        Description <span class="text-red-500 ml-1">*</span>
                    </label>
                    <textarea 
                        v-model="form.description" 
                        id="description" 
                        rows="12" 
                        placeholder="Describe the event in detail..."
                        class="w-full h-[380px] px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-visakha-navy focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 resize-none placeholder-gray-400 dark:placeholder-gray-500" 
                        required
                    ></textarea>
                    <div v-if="form.errors.description" class="text-red-500 text-xs mt-1">{{ form.errors.description }}</div>
                </div>
            </div>

            <!-- Image Gallery Section -->
            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-visakha-gold/20 flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800 dark:text-white">Image Gallery</h3>
                            <p class="text-xs text-gray-500 dark:text-gray-400">{{ totalImageCount }} of 20 images uploaded</p>
                        </div>
                    </div>
                    
                    <!-- Upload Progress Bar -->
                    <div class="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            class="h-full bg-gradient-to-r from-visakha-navy to-visakha-gold transition-all duration-300"
                            :style="{ width: (totalImageCount / 20 * 100) + '%' }"
                        ></div>
                    </div>
                </div>

                <!-- Drag & Drop Zone -->
                <div 
                    v-if="canUploadMore"
                    @drop="handleDrop"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    :class="[
                        'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer',
                        isDragging 
                            ? 'border-visakha-navy bg-visakha-navy/5 scale-[1.02]' 
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-visakha-navy hover:bg-gray-100 dark:hover:bg-gray-600'
                    ]"
                >
                    <input 
                        @change="handleFileChange" 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    >
                    <div class="pointer-events-none">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-visakha-navy/10 dark:bg-white/10 flex items-center justify-center">
                            <svg class="w-8 h-8 text-visakha-navy dark:text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                        </div>
                        <p class="text-gray-700 dark:text-gray-200 font-medium mb-1">
                            <span class="text-visakha-navy dark:text-visakha-gold">Click to upload</span> or drag and drop
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB • {{ remainingSlots }} slots remaining</p>
                    </div>
                </div>
                
                <div v-else class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4 text-center">
                    <p class="text-yellow-700 dark:text-yellow-400 font-medium">Maximum 20 images reached</p>
                    <p class="text-xs text-yellow-600 dark:text-yellow-500">Delete some images to add more</p>
                </div>

                <div v-if="form.errors.images" class="text-red-500 text-xs mt-2">{{ form.errors.images }}</div>

                <!-- Image Previews Grid -->
                <div v-if="existingImages.length > 0 || newImagePreviews.length > 0" class="mt-6">
                    <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        <!-- Existing Images -->
                        <div 
                            v-for="(img, idx) in existingImages" 
                            :key="'existing-' + idx" 
                            class="relative group aspect-square"
                        >
                            <div class="w-full h-full rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                                <img :src="img" class="object-cover w-full h-full">
                            </div>
                            <button 
                                type="button"
                                @click="removeExistingImage(img)" 
                                class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-100 scale-75"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <!-- New Image Previews -->
                        <div 
                            v-for="(preview, idx) in newImagePreviews" 
                            :key="'new-' + idx" 
                            class="relative group aspect-square"
                        >
                            <div class="w-full h-full rounded-xl overflow-hidden border-2 border-visakha-navy border-dashed shadow-sm bg-visakha-navy/5">
                                <img :src="preview.url" class="object-cover w-full h-full">
                                <div class="absolute bottom-0 inset-x-0 bg-visakha-navy text-white text-[10px] py-0.5 text-center">
                                    New
                                </div>
                            </div>
                            <button 
                                type="button"
                                @click="removeNewImage(idx)" 
                                class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-100 scale-75"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
