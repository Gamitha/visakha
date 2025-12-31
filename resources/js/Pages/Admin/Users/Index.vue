<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    users: Array
});

const showCreateModal = ref(false);
const createForm = useForm({
    name: '',
    email: '',
    phone: '',
});

const openCreateModal = () => {
    createForm.reset();
    showCreateModal.value = true;
};

const closeCreateModal = () => {
    showCreateModal.value = false;
    createForm.reset();
};

const submitCreate = () => {
    createForm.post(route('admin.users.store'), {
        onSuccess: () => {
            closeCreateModal();
        },
    });
};

const toggleActive = (userId) => {
    router.post(route('admin.users.toggle-active', userId));
};

const resetPassword = (userId) => {
    if (confirm('Are you sure you want to reset this user\'s password?')) {
        router.post(route('admin.users.reset-password', userId));
    }
};

const deleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        router.delete(route('admin.users.destroy', userId));
    }
};
</script>

<template>
    <Head title="User Management" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">User Management</h2>
                <button
                    @click="openCreateModal"
                    class="px-4 py-2 bg-visakha-navy text-white rounded-lg hover:bg-visakha-navy/90 transition font-medium shadow"
                >
                    + Add User
                </button>
            </div>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <!-- Flash Messages -->
                <div v-if="$page.props.flash?.success" class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    {{ $page.props.flash.success }}
                </div>
                <div v-if="$page.props.flash?.error" class="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {{ $page.props.flash.error }}
                </div>

                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-600">{{ user.email }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-600">{{ user.phone || '-' }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span v-if="user.is_super_admin" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                        Super Admin
                                    </span>
                                    <span v-else class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Admin
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span v-if="user.is_active" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                    <span v-else class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                        Inactive
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <template v-if="!user.is_super_admin">
                                        <button
                                            @click="toggleActive(user.id)"
                                            class="text-indigo-600 hover:text-indigo-900"
                                        >
                                            {{ user.is_active ? 'Deactivate' : 'Activate' }}
                                        </button>
                                        <button
                                            @click="resetPassword(user.id)"
                                            class="text-yellow-600 hover:text-yellow-900"
                                        >
                                            Reset Password
                                        </button>
                                        <button
                                            @click="deleteUser(user.id)"
                                            class="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </template>
                                    <span v-else class="text-gray-400 italic">Protected</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Create User Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-black opacity-50" @click="closeCreateModal"></div>
                
                <div class="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Create New User</h3>
                    
                    <form @submit.prevent="submitCreate" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                v-model="createForm.name"
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-visakha-navy focus:border-transparent"
                                placeholder="Enter full name"
                            />
                            <p v-if="createForm.errors.name" class="mt-1 text-sm text-red-600">{{ createForm.errors.name }}</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                v-model="createForm.email"
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-visakha-navy focus:border-transparent"
                                placeholder="Enter email address"
                            />
                            <p v-if="createForm.errors.email" class="mt-1 text-sm text-red-600">{{ createForm.errors.email }}</p>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                v-model="createForm.phone"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-visakha-navy focus:border-transparent"
                                placeholder="Enter phone number"
                            />
                            <p v-if="createForm.errors.phone" class="mt-1 text-sm text-red-600">{{ createForm.errors.phone }}</p>
                        </div>
                        
                        <p class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                            A temporary password will be generated and sent to the user's email.
                        </p>
                        
                        <div class="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                @click="closeCreateModal"
                                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                :disabled="createForm.processing"
                                class="px-4 py-2 bg-visakha-navy text-white rounded-lg hover:bg-visakha-navy/90 transition disabled:opacity-50"
                            >
                                {{ createForm.processing ? 'Creating...' : 'Create User' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
