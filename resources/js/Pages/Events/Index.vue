<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Modal from '@/Components/Modal.vue';
import EventForm from './Form.vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    events: Array,
});

const form = useForm({});
const showModal = ref(false);
const editingEvent = ref(null);

const openCreateModal = () => {
    editingEvent.value = null;
    showModal.value = true;
};

const openEditModal = (event) => {
    editingEvent.value = event;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    editingEvent.value = null;
};

const deleteEvent = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
        form.delete(route('events.destroy', id));
    }
};

const toggleActive = (eventId) => {
    router.post(route('events.toggle-active', eventId));
};

const setTodaysEvent = (eventId) => {
    router.post(route('events.set-todays-event', eventId));
};

const unsetTodaysEvent = (eventId) => {
    router.post(route('events.unset-todays-event', eventId));
};
</script>

<template>
    <Head title="Events" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">Manage Events</h2>
                <button @click="openCreateModal" class="px-4 py-2 bg-visakha-navy text-white rounded-lg hover:bg-visakha-navy/90 transition font-medium shadow">
                    + New Event
                </button>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <!-- Flash Messages -->
                <div v-if="$page.props.flash?.success" class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {{ $page.props.flash.success }}
                </div>

                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Today's Event</th>
                                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div>{{ event.formatted_date }}</div>
                                    <div v-if="event.formatted_time" class="text-xs text-gray-400">{{ event.formatted_time }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                                    <div v-if="event.images?.length" class="text-xs text-gray-400">{{ event.images.length }} images</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ event.venue || 'N/A' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <button @click="toggleActive(event.id)" class="inline-flex items-center">
                                        <span v-if="event.is_active" class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 cursor-pointer hover:bg-green-200">
                                            Active
                                        </span>
                                        <span v-else class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 cursor-pointer hover:bg-red-200">
                                            Inactive
                                        </span>
                                    </button>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <button 
                                        v-if="event.is_todays_event" 
                                        @click="unsetTodaysEvent(event.id)"
                                        class="px-2 py-1 text-xs font-semibold rounded-full bg-visakha-gold text-visakha-navy cursor-pointer hover:bg-yellow-400"
                                    >
                                        ⭐ Today's Event
                                    </button>
                                    <button 
                                        v-else
                                        @click="setTodaysEvent(event.id)"
                                        class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 cursor-pointer hover:bg-visakha-gold hover:text-visakha-navy"
                                    >
                                        Set as Today
                                    </button>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button @click="openEditModal(event)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button @click="deleteEvent(event.id)" class="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                            <tr v-if="events.length === 0">
                                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                    No events found. Create one to get started.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Modal :show="showModal" @close="closeModal" max-width="4xl">
            <div class="p-0">
                <EventForm :event="editingEvent" @close="closeModal" @success="closeModal" />
            </div>
        </Modal>
    </AuthenticatedLayout>
</template>
