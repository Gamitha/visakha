<script setup lang="ts">
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';

const page = usePage();

// Get errors from page props (set by Inertia middleware)
const pageErrors = computed(() => page.props.errors as Record<string, string> || {});
const flashSuccess = computed(() => (page.props.flash as any)?.success);
const flashError = computed(() => (page.props.flash as any)?.error);

const form = useForm({
    password: '',
    password_confirmation: '',
});

// Client-side validation
const clientErrors = ref<Record<string, string>>({});

// Password strength indicator
const passwordStrength = computed(() => {
    const pwd = form.password;
    if (!pwd) return { level: 0, text: '', color: '' };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, text: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { level: 3, text: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { level: 4, text: 'Strong', color: 'bg-green-500' };
    return { level: 5, text: 'Very Strong', color: 'bg-green-600' };
});

// Real-time validation
watch(() => form.password, (newVal) => {
    if (newVal && newVal.length < 8) {
        clientErrors.value.password = 'Password must be at least 8 characters long.';
    } else {
        delete clientErrors.value.password;
    }

    // Check confirmation match if it has a value
    if (form.password_confirmation && newVal !== form.password_confirmation) {
        clientErrors.value.password_confirmation = 'Passwords do not match.';
    } else if (form.password_confirmation) {
        delete clientErrors.value.password_confirmation;
    }
});

watch(() => form.password_confirmation, (newVal) => {
    if (newVal && newVal !== form.password) {
        clientErrors.value.password_confirmation = 'Passwords do not match.';
    } else {
        delete clientErrors.value.password_confirmation;
    }
});

// Merge all errors
const passwordError = computed(() => form.errors.password || pageErrors.value.password || clientErrors.value.password);
const confirmationError = computed(() => form.errors.password_confirmation || pageErrors.value.password_confirmation || clientErrors.value.password_confirmation);
const generalError = computed(() => pageErrors.value.general || flashError.value);

// Check if form is valid for submission
const canSubmit = computed(() => {
    return form.password.length >= 8 &&
           form.password === form.password_confirmation &&
           !form.processing;
});

const submit = () => {
    // Clear client errors on submit
    clientErrors.value = {};

    // Final validation before submit
    if (form.password.length < 8) {
        clientErrors.value.password = 'Password must be at least 8 characters long.';
        return;
    }

    if (form.password !== form.password_confirmation) {
        clientErrors.value.password_confirmation = 'Passwords do not match.';
        return;
    }

    form.post('/change-password', {
        onFinish: () => {
            form.reset();
        },
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Change Password" />

        <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-visakha-gold/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-visakha-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-medium text-white">Change Your Password</h3>
            <p class="text-sm text-gray-400 mt-2">Please set a new password for your account.</p>
        </div>

        <!-- Success Message -->
        <div v-if="flashSuccess" class="mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-sm font-medium text-green-400">{{ flashSuccess }}</p>
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
                <label for="password" class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input
                    id="password"
                    type="password"
                    v-model="form.password"
                    required
                    autocomplete="new-password"
                    :class="[
                        'w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition',
                        passwordError ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-visakha-gold'
                    ]"
                    placeholder="Enter new password (min. 8 characters)"
                />
                <InputError class="mt-2" :message="passwordError" />

                <!-- Password Strength Indicator -->
                <div v-if="form.password" class="mt-2">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-xs text-gray-400">Password strength:</span>
                        <span :class="['text-xs font-medium', passwordStrength.level >= 3 ? 'text-green-400' : passwordStrength.level >= 2 ? 'text-yellow-400' : 'text-red-400']">
                            {{ passwordStrength.text }}
                        </span>
                    </div>
                    <div class="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            :class="['h-full transition-all duration-300', passwordStrength.color]"
                            :style="{ width: `${(passwordStrength.level / 5) * 100}%` }"
                        ></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Use uppercase, lowercase, numbers, and symbols for a stronger password.</p>
                </div>
            </div>

            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    v-model="form.password_confirmation"
                    required
                    autocomplete="new-password"
                    :class="[
                        'w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition',
                        confirmationError ? 'border-red-500 focus:ring-red-500' : form.password_confirmation && form.password === form.password_confirmation ? 'border-green-500 focus:ring-green-500' : 'border-white/20 focus:ring-visakha-gold'
                    ]"
                    placeholder="Confirm new password"
                />
                <InputError class="mt-2" :message="confirmationError" />
                <!-- Password Match Indicator -->
                <div v-if="form.password_confirmation && !confirmationError && form.password === form.password_confirmation" class="mt-2 flex items-center text-green-400">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-xs">Passwords match</span>
                </div>
            </div>

            <button
                type="submit"
                :disabled="!canSubmit"
                class="w-full py-3 px-4 bg-visakha-gold hover:bg-yellow-500 text-visakha-navy font-bold rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
                <svg v-if="form.processing" class="animate-spin -ml-1 mr-2 h-5 w-5 text-visakha-navy" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="form.processing">Updating Password...</span>
                <span v-else>Update Password</span>
            </button>

            <!-- Password Requirements -->
            <div class="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <p class="text-xs font-medium text-gray-300 mb-2">Password Requirements:</p>
                <ul class="text-xs text-gray-400 space-y-1">
                    <li :class="form.password.length >= 8 ? 'text-green-400' : ''">
                        <span class="mr-1">{{ form.password.length >= 8 ? '✓' : '○' }}</span>
                        At least 8 characters
                    </li>
                    <li :class="/[A-Z]/.test(form.password) ? 'text-green-400' : ''">
                        <span class="mr-1">{{ /[A-Z]/.test(form.password) ? '✓' : '○' }}</span>
                        One uppercase letter
                    </li>
                    <li :class="/[a-z]/.test(form.password) ? 'text-green-400' : ''">
                        <span class="mr-1">{{ /[a-z]/.test(form.password) ? '✓' : '○' }}</span>
                        One lowercase letter
                    </li>
                    <li :class="/\d/.test(form.password) ? 'text-green-400' : ''">
                        <span class="mr-1">{{ /\d/.test(form.password) ? '✓' : '○' }}</span>
                        One number
                    </li>
                    <li :class="/[^a-zA-Z0-9]/.test(form.password) ? 'text-green-400' : ''">
                        <span class="mr-1">{{ /[^a-zA-Z0-9]/.test(form.password) ? '✓' : '○' }}</span>
                        One special character (recommended)
                    </li>
                </ul>
            </div>
        </form>
    </GuestLayout>
</template>
