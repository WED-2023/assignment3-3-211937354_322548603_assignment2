<template>
  <div class="main-wrapper">
    <!-- Top Section -->
    <div :class="['top-section', { 'with-bg': !store.username }]">
      <div v-if="store.username" class="content-wrapper">
        <h3 class="section-title">Last Viewed Recipes</h3>
        <div v-if="lastThreeViewed.length > 0">
          <RecipePreviewList 
            :recipes="lastThreeViewed" 
            :viewedIds="recentlyViewedRecipes.map(r => r.id)" 
            class="RecipeList" 
          />
        </div>
        <p v-else class="text-center text-muted mt-3">
          You haven’t viewed any recipes yet.
        </p>
      </div>

      <div v-else class="hero">
        <div class="hero-overlay">
          <div class="login-container">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section (always visible) -->
    <div class="container bottom-section">
      <h3 class="section-title">Random Recipes</h3>
      <RecipePreviewList 
        ref="randomList" 
        class="RecipeList"
        :viewedIds="recentlyViewedRecipes.map(r => r.id)"
      />
      <div class="text-center">
        <button class="btn btn-outline-secondary mt-2" @click="refreshRandomRecipes">
          Show More Random Recipes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import LoginForm from "../components/LoginForm.vue";
import store from '@/store';
import axios from 'axios';

export default {
  name: "MainPage",
  components: {
    RecipePreviewList,
    LoginForm
  },
  setup() {
    const randomList = ref(null);
    const recentlyViewedRecipes = ref([]);
    // const lastThreeViewed = computed(() => recentlyViewedRecipes.value.slice(0, 3));
    const lastThreeViewed = computed(() =>
  [...recentlyViewedRecipes.value]
    .sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at))
    .slice(0, 3)
);


    const refreshRandomRecipes = () => {
      randomList.value?.updateRecipes?.();
    };

    const loadRecentlyViewed = async () => {
      try {
        const res = await axios.get(`${store.server_domain}/users/recently-viewed`, {
          withCredentials: true
        });
        recentlyViewedRecipes.value = res.data || [];
      } catch (error) {
        console.error("Error loading last viewed recipes:", error.message);
        recentlyViewedRecipes.value = [];
      }
    };

    onMounted(() => {
      refreshRandomRecipes();
      if (store.username) loadRecentlyViewed();
    });

    return {
      store,
      randomList,
      refreshRandomRecipes,
      recentlyViewedRecipes,
      lastThreeViewed
    };
  }
};
</script>

<style scoped>
.main-wrapper {
  font-family: 'Quicksand', sans-serif;
  background-color: #fffaf4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-section {
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.with-bg {
  background: url('@/assets/header_bg.jpg') no-repeat center center;
  background-size: cover;
  background-position: center;
  min-height: 50vh;
  background-attachment: scroll;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.88);
  padding: 40px;
  border-radius: 16px;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 360px;
}

.hero-overlay {
  background: rgba(255, 255, 255, 0.85);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-width: 420px;
  width: 90%;
  text-align: center;
}

.login-container {
  width: 100%;
}

.login-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.bottom-section {
  padding: 60px 20px 40px;
}

.section-title {
  font-size: 1.8rem;
  color: #d6844a;
  margin-bottom: 20px;
  text-align: center;
}

.recipe-list {
  margin-bottom: 20px;
}
</style>
