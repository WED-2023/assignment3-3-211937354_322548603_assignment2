<template>
  <div class="my-recipes-page">
    <div class="container">
      <!-- Header -->
      <div class="header-section">
        <div class="title-container">
          <h1 class="page-title">My Recipes</h1>
          <p class="subtitle">All the delicious dishes you've created so far</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="recipesLoaded && recipes.length === 0" class="static-empty-state">
        <h3 class="empty-title">No Recipes Yet</h3>
        <p class="empty-description">
          Looks like your cookbook is empty. Let’s get cooking!
        </p>
        <router-link to="/add-recipe" class="cta-button secondary">
          <span class="button-text">Create a Recipe</span>
          <span class="button-arrow">→</span>
        </router-link>
      </div>

      <!-- Recipes List -->
      <div v-else-if="recipes.length > 0" class="recipes-content">
        <div class="recipes-container">
          <RecipePreviewList :recipes="recipes" />
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
  name: 'MyRecipesPage',
  components: { RecipePreviewList },  
  setup() {
    const recipes = ref([]);
    const recipesLoaded = ref(false);

    const loadMyRecipes = async () => {
      try {
        const res = await axios.get(`${store.server_domain}/recipes/user/my-recipes`, { withCredentials: true });
        recipes.value = Array.isArray(res.data) ? res.data :  [];
      } catch (err) {
        console.error("Failed to load personal recipes:", err);
        recipes.value = [];
      } finally {
        setTimeout(() => {
          recipesLoaded.value = true;
        }, 1000);
      }
    };

    onMounted(() => {
      if (store.username) loadMyRecipes();
    });

    return {
      store,
      recipes,
      recipesLoaded
    };
  }
};
</script>

<style scoped>
.my-recipes-page {
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
</style>
