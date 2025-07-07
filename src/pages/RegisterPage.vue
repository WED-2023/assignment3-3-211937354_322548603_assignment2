<template>
  <div class="register-page">
    <div class="register-overlay">
      <div class="register-box">
        <!-- Left: Registration form -->
        <div class="form-section">
          <h2>Create Account</h2>
          <form @submit.prevent="register">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" v-model="form.firstName" />
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" v-model="form.lastName" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model="form.username" />
              </div>
              <div class="form-group">
                <label for="country">Country</label>
                <select id="country" v-model="form.country">
                  <option disabled value="">Select your country</option>
                  <option v-for="country in countries" :key="country" :value="country">
                    {{ country }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" v-model="form.password" />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" v-model="form.confirmPassword" />
            </div>

            <button type="submit">Create Account</button>

            <div v-if="error" class="error-message">{{ error }}</div>
          </form>
        </div>

        <!-- Right: Feature content -->
        <div class="info-section">
          <h3>What you will get?</h3>
          <ul>
            <li>🍽 Manage your recipes the easy way</li>
            <li>📤 Share recipes with your friends and discover new ones</li>
            <li>🌍 15,000+ recipes from around the world</li>
            <li>🏽 Organize by tags and share</li>
            <li>👫 Invite your friends to join the fun</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import store from '@/store';

export default {
  name: 'RegisterPage',
  setup() {
    const form = reactive({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: '',
    });

    const countries = ref([]);
    const error = ref('');

    const loadCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
        const rawCountries = await response.json();
        countries.value = rawCountries.map(c => c.name.common).sort();
      } catch (err) {
        console.error('Failed to fetch countries:', err);
      }
    };

    onMounted(loadCountries);

    const register = async () => {
      error.value = '';
      if (form.password !== form.confirmPassword) {
        error.value = 'Passwords do not match';
        return;
      }

      try {
        await axios.post('/auth/register', form);
        store.login(form.username);
        window.location.href = '/login';
      } catch (e) {
        error.value = e.response?.data?.message || 'Registration failed';
      }
    };

    return { form, countries, error, register };
  },
};
</script>

<style scoped>
.register-page {
  background: url('@/assets/register_bg.jpg') center/cover no-repeat;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Quicksand', sans-serif;
}

.register-overlay {
  background-color: rgba(255, 255, 255, 0.92);
  padding: 40px;
  border-radius: 12px;
  display: flex;
  max-width: 1000px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.register-box {
  display: flex;
  width: 100%;
  gap: 40px;
}

.form-section {
  flex: 1;
}

.info-section {
  flex: 1;
  padding-left: 20px;
}

h2, h3 {
  margin-bottom: 20px;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  flex: 1;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
}

input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  padding: 12px;
  border: none;
  background-color: #d6844a;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
}

.error-message {
  color: #cc4444;
  margin-top: 12px;
  font-size: 0.95rem;
}

ul {
  padding-left: 18px;
  line-height: 1.6;
  font-size: 1rem;
}
</style>
