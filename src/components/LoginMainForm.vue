<template>
  <div class="register-form-wrapper">
    <h3>Register for an Account</h3>
    <form @submit.prevent="handleRegister">
      <div class="form-group" v-for="(field, key) in formFields" :key="key">
        <label :for="key">{{ field.label }}</label>
        <input
          :id="key"
          v-model="form[key]"
          :type="field.type || 'text'"
          :placeholder="field.placeholder"
          :class="{ error: v$.form[key].$error }"
        />
        <small v-if="v$.form[key].$error" class="error-text">
          {{ getErrorText(key) }}
        </small>
      </div>

      <button class="btn-register" type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>

      <div v-if="registerError" class="error-message">
        {{ registerError }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators';
import axios from 'axios';
import { useStore } from '@/store';

const store = useStore();
const isLoading = ref(false);
const registerError = ref('');

const form = reactive({
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  country: '',
  email: ''
});

const formFields = {
  username: { label: 'Username', placeholder: '3–8 letters, English only' },
  password: { label: 'Password', placeholder: '5–10 chars, incl. number + special', type: 'password' },
  firstName: { label: 'First Name', placeholder: 'Your first name' },
  lastName: { label: 'Last Name', placeholder: 'Your last name' },
  country: { label: 'Country', placeholder: 'Your country' },
  email: { label: 'Email', placeholder: 'your@email.com', type: 'email' }
};

const hasNumber = helpers.withMessage('Must include a number', val => /\d/.test(val || ''));
const hasSpecialChar = helpers.withMessage('Must include special character', val => /[!@#$%^&*(),.?":{}|<>]/.test(val || ''));
const onlyLetters = helpers.withMessage('English letters only', val => /^[A-Za-z]+$/.test(val || ''));

const rules = {
  form: {
    username: { required, minLength: minLength(3), maxLength: maxLength(8), onlyLetters },
    password: { required, minLength: minLength(5), maxLength: maxLength(10), hasNumber, hasSpecialChar },
    firstName: { required },
    lastName: { required },
    country: { required },
    email: { required, email }
  }
};

const v$ = useVuelidate(rules, { form });

function getErrorText(key) {
  const messages = {
    username: '3–8 letters, English only',
    password: '5–10 characters, incl. number + special char',
    firstName: 'First name is required',
    lastName: 'Last name is required',
    country: 'Country is required',
    email: 'Valid email is required'
  };
  return messages[key];
}

async function handleRegister() {
  registerError.value = '';
  v$.value.form.$touch();
  if (v$.value.form.$invalid) return;

  isLoading.value = true;
  try {
    await axios.post('/api/auth/register', form, { withCredentials: true });
    store.username = form.username;
  } catch (err) {
    if (err.response?.status === 409) {
      registerError.value = 'Username already exists.';
    } else {
      registerError.value = err.response?.data?.message || 'Registration failed.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.register-form-wrapper {
  background-color: #fffaf4;
  max-width: 500px;
  margin: 30px auto;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Quicksand', sans-serif;
}

h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  transition: 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #d6844a;
  box-shadow: 0 0 0 3px rgba(214, 132, 74, 0.1);
}

input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
}

.error-message {
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  color: #e74c3c;
  padding: 12px;
  text-align: center;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 20px;
}

.btn-register {
  width: 100%;
  padding: 14px;
  background-color: #d6844a;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-register:hover:not(:disabled) {
  background-color: #c57843;
  transform: translateY(-1px);
}

.btn-register:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}
</style>
