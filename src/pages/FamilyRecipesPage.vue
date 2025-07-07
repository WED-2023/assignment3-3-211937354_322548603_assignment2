<template>
  <div class="family-page">
    <div class="container">
      <div class="header-section">
        <h1 class="page-title">Family Recipes</h1>
        <p class="subtitle">Cherished dishes passed down through generations 🍊</p>
      </div>

      <!-- Not Logged In -->
      <div v-if="!store.username" class="static-empty-state">
        <div class="empty-title">You're not logged in</div>
        <div class="empty-description">Please log in to view your cozy family recipes.</div>
        <router-link to="/login" class="cta-button">
          <span class="button-text">Go to Login</span>
          <span class="button-arrow">→</span>
        </router-link>
      </div>

      <!-- No Recipes Yet -->
      <div v-else-if="familyRecipes.length === 0" class="static-empty-state">
        <div class="empty-title">No Family Recipes Yet</div>
        <div class="empty-description">
          You haven’t added any family treasures yet.<br />
          <span class="hint">How about starting with Aunt Lucy’s orange marmalade?</span>
        </div>
        <router-link to="/add-family-recipe" class="cta-button">
          <span class="button-text">Add Recipe</span>
          <span class="button-arrow">+</span>
        </router-link>
      </div>

      <!-- Recipes List -->
      <div v-else>
        <RecipePreviewList :recipes="familyRecipes" />
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
  name: 'FamilyRecipesPage',
  components: {
    RecipePreviewList
  },
  setup() {
    const familyRecipes = ref([]);

    const loadFamilyRecipes = async () => {
      try {
        const res = await axios.get(`${store.server_domain}/recipes/user/my-family-recipes`, { withCredentials: true });
        familyRecipes.value = res.data || [];
      } catch (err) {
        console.error("Failed to load family recipes:", err);
        familyRecipes.value = [];
      }
    };

    onMounted(() => {
      if (store.username) loadFamilyRecipes();
    });

    return { store, familyRecipes };
  }
};
</script>

<style scoped>
.family-page {
  font-family: 'Quicksand', sans-serif;
  background: linear-gradient(135deg, #fef7f0 0%, #fff8f2 100%);
  min-height: 100vh;
  padding-bottom: 50px;
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
  animation: fadeIn 0.8s ease-in-out;
}

.subtitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: #4a4a4a;
  opacity: 0.8;
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

.hint {
  display: block;
  font-style: italic;
  color: #b0753c;
  margin-top: 12px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f4a261 0%, #e76f51 100%);
  color: white;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(244, 162, 97, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
