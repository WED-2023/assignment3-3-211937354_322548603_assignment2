<template>
  <div class="login-form-wrapper">
    <h3>Login to Your Account</h3>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          v-model="form.username" 
          type="text" 
          id="username" 
          placeholder="Enter your username"
          :class="{ 'error': v$.form.username.$error }"
        />
        <small v-if="v$.form.username.$error" class="error-text">
          Username is required.
        </small>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Enter your password"
            :class="{ 'error': v$.form.password.$error }"
          />
          <i 
            :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'" 
            @click="togglePasswordVisibility"
          ></i>
        </div>
        <small v-if="v$.form.password.$error" class="error-text">
          Password must be 5–10 characters, with a number and special character.
        </small>
      </div>

      <button 
        class="btn-login" 
        type="submit" 
        :disabled="isLoading"
      >
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>

      <div v-if="loginError" class="error-message">
        {{ loginError }}
      </div>

      <p class="signup-text">
        Don't have an account?
        <router-link to="/register">Create one</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, helpers } from '@vuelidate/validators';
import axios from 'axios';
import store from '@/store';

const router = useRouter();
const loginError = ref('');
const showPassword = ref(false);
const isLoading = ref(false);

const form = reactive({
  username: '',
  password: '',
});

const hasNumber = helpers.withMessage(
  'Password must contain a number.',
  value => /\d/.test(value || '')
);

const hasSpecialChar = helpers.withMessage(
  'Password must contain a special character.',
  value => /[!@#$%^&*(),.?":{}|<>]/.test(value || '')
);

const rules = {
  form: {
    username: { 
      required: helpers.withMessage('Username is required', required)
    },
    password: { 
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage('Password must be at least 5 characters', minLength(5)),
      maxLength: helpers.withMessage('Password must not exceed 10 characters', maxLength(10)),
      hasNumber,
      hasSpecialChar 
    },
  },
};

const v$ = useVuelidate(rules, { form });
const isFormValid = computed(() => !v$.value.form.$invalid);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const clearError = () => {
  loginError.value = '';
};

const handleLogin = async () => {
  clearError();
  v$.value.form.$touch();

  if (!isFormValid.value) {
    return;
  }

  isLoading.value = true;

  try {
    await axios.post(
      `${store.server_domain}/auth/login`,
      {
        username: form.username.trim(),
        password: form.password.trim(),
      },
      { 
        withCredentials: true,
        timeout: 10000
      }
    );

    store.login(form.username);
    await router.push('/');
  } catch (error) {
    if (error.response?.status === 401) {
      loginError.value = 'Invalid username or password.';
    } else if (error.response?.status === 429) {
      loginError.value = 'Too many login attempts. Please try again later.';
    } else if (error.code === 'ECONNABORTED') {
      loginError.value = 'Login request timed out. Please try again.';
    } else {
      loginError.value = 'Login failed. Please check your connection and try again.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-form-wrapper {
  flex: 1;
  background-color: #fffaf4;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);
  max-width: 500px;
}

.login-form-wrapper h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
}

input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

input[type='text']:focus,
input[type='password']:focus {
  outline: none;
  border-color: #d6844a;
  box-shadow: 0 0 0 3px rgba(214, 132, 74, 0.1);
}

input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input i {
  position: absolute;
  right: 16px;
  cursor: pointer;
  color: #999;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.password-input i:hover {
  color: #d6844a;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 6px;
  display: block;
  font-weight: 500;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 15px;
  text-align: center;
  padding: 12px;
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-weight: 500;
}

.btn-login {
  background-color: #d6844a;
  border: none;
  padding: 14px 20px;
  width: 100%;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-login:hover:not(:disabled) {
  background-color: #c57843;
  transform: translateY(-1px);
}

.btn-login:disabled {
  background-color: #bbb;
  cursor: not-allowed;
  transform: none;
}

.signup-text {
  margin-top: 25px;
  text-align: center;
  font-size: 0.95rem;
  color: #666;
}

.signup-text a {
  color: #d6844a;
  font-weight: 600;
  text-decoration: none;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.signup-text a:hover {
  color: #c57843;
  text-decoration: underline;
}
</style>