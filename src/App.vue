<template>
  <div id="app">
    <header class="main-navbar">
      <div class="left-nav">
        <router-link to="/" class="brand">Let's Cook</router-link>
        <router-link to="/search" class="nav-link">Search</router-link>
        <router-link to="/about" class="nav-link">About</router-link>

        <template v-if="store.username">
          <div class="nav-item dropdown">
            <button class="nav-link dropdown-toggle pastel-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Personal Area
            </button>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/favorites">My Favorites</router-link></li>
              <li><router-link class="dropdown-item" to="/my-recipes">My Recipes</router-link></li>
              <li><router-link class="dropdown-item" to="/family-recipes">Family Recipes</router-link></li>
            </ul>
          </div>
          <button class="btn pastel-btn-outline ms-2" @click="showCreateModal = true">Create Recipe</button>
        </template>
      </div>

      <div class="right-nav">
        <template v-if="!store.username">
          <span class="guest-msg">Hello, guest</span>
          <router-link to="/register" class="nav-link">Register</router-link>
          <router-link to="/login" class="nav-link">Login</router-link>
        </template>

        <template v-else>
          <span class="user-msg">Hello, {{ store.username }}</span>
          <button @click="logout" class="btn-logout ms-2">Logout</button>
        </template>
      </div>
    </header>
    <b-modal
      id="createRecipeModal"
      title=""
      v-model="showCreateModal"
      size="lg"
      centered
      hide-footer
      @hidden="resetForm"
    >
      <CreateRecipeForm ref="createFormRef" @close="showCreateModal = false" />
    </b-modal>

    <router-view />
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import store from './store';
import CreateRecipeForm from './components/CreateRecipeForm.vue';

export default {
  name: "App",
  components: {
    CreateRecipeForm
  },
  setup() {
    const router = useRouter();
    const showCreateModal = ref(false);
    const createFormRef = ref(null);

    const resetForm = () => {
      createFormRef.value?.resetForm?.();
    };

    const logout = () => {
      store.logout();
      router.push("/").catch(() => {});
    };

    return {
      store,
      logout,
      showCreateModal,
      createFormRef,
      resetForm
    };
  }
};
</script>


<style scoped>
.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-family: 'Quicksand', sans-serif;
  position: sticky;
  top: 0;
  z-index: 999;
}

.left-nav,
.right-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand {
  font-weight: 800;
  font-size: 1.6rem;
  text-decoration: none;
  color: #d6844a;
}

.nav-link,
.router-link,
.router-link-active {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.router-link:hover {
  color: #d6844a;
}

.btn-logout {
  background: none;
  border: none;
  color: #d6844a;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-logout:hover {
  opacity: 0.7;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #d6844a;
  background: transparent;
  color: #d6844a;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #d6844a;
  color: white;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: none;
  min-width: 150px;
  z-index: 1000;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #d6844a;
}

.user-msg, .guest-msg {
  font-style: italic;
  color: #555;
  margin-right: 8px;
}

.about-link {
  margin-left: -10px;
}
</style>
