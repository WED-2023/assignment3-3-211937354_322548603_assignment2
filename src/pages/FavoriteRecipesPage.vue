<template>
  <div class="favorite-page">
    <div class="container">
      <!-- Header -->
      <div class="header-section">
        <div class="title-container">
          <h1 class="page-title">Your Favorite Recipes</h1>
          <p class="subtitle">Discover your curated collection of beloved dishes</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="favoritesLoaded && favorites.length === 0" class="static-empty-state">
        <h3 class="empty-title">No Favorites Yet</h3>
        <p class="empty-description">Start building your collection by adding recipes you love</p>
        <router-link to="/search" class="cta-button secondary">
          <span class="button-text">Explore Recipes</span>
          <span class="button-arrow">→</span>
        </router-link>
      </div>

      <!-- Favorites -->
      <div v-else-if="favorites.length > 0" class="favorites-content">
        <div class="recipes-container">
          <RecipePreviewList :recipes="favorites" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import store from '../store';
import RecipePreviewList from '../components/RecipePreviewList.vue';
import axios from 'axios';

export default {
  name: 'FavoriteRecipesPage',
  components: { RecipePreviewList },
  setup() {
    const favorites = ref([]);
    const favoritesLoaded = ref(false);

    const loadFavorites = async () => {
      try {
        const res = await axios.get(`${store.server_domain}/users/favorites`, { withCredentials: true });
        favorites.value = res.data || [];
      } catch (err) {
        console.error("Failed to load favorites:", err);
        favorites.value = [];
      } finally {
        setTimeout(() => {
          favoritesLoaded.value = true;
        }, 1000);
      }
    };

    onMounted(loadFavorites);

    return { store, favorites, favoritesLoaded };
  }
};
</script>

<style scoped>
.favorite-page {
  font-family: 'Quicksand', sans-serif;
  background: linear-gradient(135deg, #fef7f0 0%, #fff8f2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-section {
  padding: 60px 0 40px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #d6844a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #8b5a3c;
  opacity: 0.8;
  font-weight: 500;
}

.static-empty-state {
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  max-width: 480px;
  margin: 40px auto 60px;
  text-align: center;
  border: 1px solid rgba(214, 132, 74, 0.1);
  box-shadow: none;
  pointer-events: none;
}

.static-empty-state * {
  pointer-events: auto;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d6844a;
  margin-bottom: 12px;
}

.empty-description {
  font-size: 1rem;
  color: #8b5a3c;
  font-weight: 500;
  margin-bottom: 30px;
  line-height: 1.6;
  opacity: 0.9;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff6b35 0%, #d6844a 100%);
  color: white;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.cta-button.secondary {
  background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%);
  box-shadow: 0 4px 15px rgba(244, 162, 97, 0.3);
}

.cta-button.secondary:hover {
  box-shadow: 0 8px 25px rgba(244, 162, 97, 0.4);
}

.button-text {
  font-weight: 600;
}

.button-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .button-arrow {
  transform: translateX(3px);
}
</style>
