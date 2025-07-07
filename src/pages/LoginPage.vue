<template>
  <div class="login-container">
    <!-- Left side: rotating image banner -->
    <LoginShowcase />

    <!-- Right side: Login form component -->
    <LoginForm />
  </div>
</template>

<script>
import LoginShowcase from '@/components/LoginShowcase.vue';
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    LoginShowcase,
    LoginForm
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  font-family: 'Quicksand', sans-serif;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
}
</style>
