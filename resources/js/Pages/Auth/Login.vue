<script setup lang="ts">
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps<{
    canResetPassword?: boolean;
    status?: string;
}>();

const page = usePage();

// Get errors from page props (set by Inertia middleware)
const pageErrors = computed(() => page.props.errors as Record<string, string> || {});
const flashSuccess = computed(() => (page.props.flash as any)?.success);
const flashError = computed(() => (page.props.flash as any)?.error);

// Check if there are any errors to show a general alert
const hasErrors = computed(() => Object.keys(pageErrors.value).length > 0);

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

// Merge page errors with form errors
const emailError = computed(() => form.errors.email || pageErrors.value.email);
const passwordError = computed(() => form.errors.password || pageErrors.value.password);
const generalError = computed(() => pageErrors.value.general || flashError.value);

const submit = () => {
    form.post('/login', {
        onFinish: () => {
            form.reset('password');
        },
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Admin Login" />

        <!-- Success Message -->
        <div v-if="status || flashSuccess" class="mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-sm font-medium text-green-400">{{ status || flashSuccess }}</p>
            </div>
        </div>

        <!-- General Error Alert -->
        <div v-if="generalError" class="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30">
            <div class="flex items-start">
                <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm font-medium text-red-400">{{ generalError }}</p>
            </div>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                    id="email"
                    type="email"
                    v-model="form.email"
                    required
                    autofocus
                    autocomplete="username"
                    :class="[
                        'w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition',
                        emailError ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-visakha-gold'
                    ]"
                    placeholder="Enter your email"
                />
                <InputError class="mt-2" :message="emailError" />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                    id="password"
                    type="password"
                    v-model="form.password"
                    required
                    autocomplete="current-password"
                    :class="[
                        'w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition',
                        passwordError ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-visakha-gold'
                    ]"
                    placeholder="Enter your password"
                />
                <InputError class="mt-2" :message="passwordError" />
            </div>

            <div class="flex items-center justify-between">
                <label class="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        v-model="form.remember"
                        class="w-4 h-4 rounded border-white/20 bg-white/10 text-visakha-gold focus:ring-visakha-gold"
                    />
                    <span class="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
            </div>

            <button
                type="submit"
                :disabled="form.processing"
                class="w-full py-3 px-4 bg-visakha-gold hover:bg-yellow-500 text-visakha-navy font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <svg v-if="form.processing" class="animate-spin -ml-1 mr-2 h-5 w-5 text-visakha-navy" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="form.processing">Signing in...</span>
                <span v-else>Sign In</span>
            </button>
        </form>
    </GuestLayout>
</template>
