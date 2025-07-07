<template>
  <div v-if="recipe" class="recipe-page">
    <h1 class="recipe-title">{{ recipe.title }}</h1>

    <div class="recipe-layout">
      <!-- Left Column -->
      <div class="recipe-left">
        <p class="family-meta" v-if="recipe.owner_name || recipe.when_to_prepare">
          <span v-if="recipe.owner_name">From the kitchen of <strong>{{ recipe.owner_name }}</strong></span>
          <span v-if="recipe.when_to_prepare"> · Best served during <em>{{ recipe.when_to_prepare }}</em></span>
        </p>
        
        <div class="servings-control" v-if="recipe.servings">
          <label>Servings:</label>
          <input type="number" v-model.number="newServings" min="1" />
          <button @click="scaleIngredients">Update</button>
        </div>

        <section class="notes" v-if="recipe.notes">
          <h2>Notes:</h2>
          <p>{{ recipe.notes }}</p>
        </section>
        
        <section class="ingredients">
          <h2>Ingredients:</h2>
          <ul>
            <li v-for="(ing, i) in scaledIngredients" :key="i">
              {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
            </li>
          </ul>
        </section>

      </div>

      <!-- Right Column -->
      <div class="recipe-right">
        <div class="image-and-times">
          <!-- <img :src="recipe.image" alt="Recipe Image" class="recipe-img"  /> -->
           <img :src="recipe.image || defaultImage" alt="Recipe Image" class="recipe-img" @error="onImageError" />


          <div class="times">
            <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
            <p><strong>Likes:</strong> {{ recipe.popularity }}</p>

            <div class="dietary-labels">
              <span v-if="recipe.vegetarian">🥬 Vegetarian</span>
              <span v-if="recipe.vegan">🌱 Vegan</span>
              <span v-if="recipe.glutenFree">❌🌾 Gluten Free</span>
            </div>

            <!-- Favorite Icon -->
            <div class="favorite-toggle" @click="toggleFavorite">
              <i :class="['fa-star', isFavorite ? 'fas' : 'far']"></i>
              <span class="fav-text">{{ isFavorite ? 'Favorited' : 'Add to Favorites' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="directions" v-if="recipe.instructions?.length">
      <h2>Directions:</h2>
      <ol>
        <li v-for="(step, i) in recipe.instructions" :key="i">
          {{ step.step }}
        </li>
      </ol>
    </section>
  </div>

  <div v-else class="loading">Loading recipe...</div>
</template>

<script>

// function detectRecipeSource(recipePreview) {
//   if (recipePreview.family_notes) {
//     return "my-family-recipes";
//   } else if (recipePreview.notes) {
//     return "my-recipes";
//   } else {
//     return "spoonacular";
//   }
// }

export default {
  name: "RecipeViewPage",
  data() {
    return {
      recipe: null,
      isFavorite: false,
      newServings: 1,
      scaledIngredients: []
    };
  },
  async created() {
    const recipeId = this.$route.params.recipeId;
    const source = this.$route.params.source;
    // const endpoints = [
    //   { url: `/recipes/user/my-family-recipes/${recipeId}`, type: "my-family-recipes" },
    //   { url: `/recipes/user/my-recipes/${recipeId}`, type: "my-recipes" },
    //   { url: `/spoonacular/${recipeId}`, type: "spoonacular" },
    // ];
    let url = "";
    if (source === "my-family-recipes") {
      url = `/recipes/user/my-family-recipes/${recipeId}`;
    } else if (source === "my-recipes") {
      url = `/recipes/user/my-recipes/${recipeId}`;
    } else {
      url = `/spoonacular/${recipeId}`;
    }
    // const response = await axios.get(url);
    // this.recipe = response.data;
    let response = null;
    // let source = "spoonacular";

    // for (let { url, type } of endpoints) {
      try {
        response = await this.axios.get(this.$root.store.server_domain + url, {
          withCredentials: true
        });
      
        // if (res.status === 200) {
        //   response = res;
        //   source = type;
        //   break;
        // }
      } catch (e) {
          console.error("Failed to load recipe:", e.message);
          this.$router.replace("/NotFound");
          return;
        // continue;
      }
    

    // if (!response) {
    //   this.$router.replace("/NotFound");
    //   return;
    // }

    // try {
    //   await this.axios.post(
    //     this.$root.store.server_domain + "/users/mark-as-viewed",
    //     {
    //       recipe_id: recipeId,
    //       source: source,
    //     },
    //     { withCredentials: true }
    //   );
    // } catch (err) {
    //   console.warn("Failed to mark recipe as viewed:", err.message);
    // }

    const data = response.data;

    // const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    // this.isFavorite = favorites.includes(Number(recipeId));
    try {
      const favIdsRes = await this.axios.get(
        `${this.$root.store.server_domain}/users/favorite-ids`,
        { withCredentials: true }
      );
      this.isFavorite = favIdsRes.data.includes(Number(recipeId));
    } catch (err) {
      console.warn("Failed to load favorites:", err.message);
    }


    this.recipe = {
      title: data.title,
      image: data.image || data.image_url || require("../assets/default_logo.jpg"),
      readyInMinutes: data.readyInMinutes || data.ready_in_minutes || 0,
      popularity: data.popularity || data.aggregateLikes || data.popularity_score || 0,
      ingredients: data.ingredients || [],
      instructions: Array.isArray(data.instructions)
      ? data.instructions
      : (typeof data.instructions === "string"
          ? data.instructions.split("\n").map((s) => ({ step: s }))
          : []),
      notes: source === "my-family-recipes"
        ? (data.family_notes || "")
        :source === "my-recipes"
        ? (data.notes || data.summary || "")
        : (data.notes || ""),
      vegetarian: data.vegetarian || data.is_vegetarian || false,
      vegan: data.vegan || data.is_vegan || false,
      glutenFree: data.glutenFree || data.is_gluten_free || false,
      servings: data.servings || 1,
      owner_name: data.owner_name || "",
      when_to_prepare: data.when_to_prepare || ""
    };

    if (source === "my-recipes") {
      try {
        const ingRes = await this.axios.get(
          `${this.$root.store.server_domain}/recipes/user/my-recipes/${recipeId}/ingredients`,
          { withCredentials: true }
        );
        this.recipe.ingredients = ingRes.data.map((ing) => ({
          name: ing.ingredient_name,
          amount: parseFloat(ing.amount),
          unit: ing.unit
        }));
        this.scaleIngredients(); 
      } catch (e) {
        console.error("Failed to load ingredients for personal recipe:", e.message);
      }
    }

    if (source === "my-family-recipes") {
      try {
        const ingRes = await this.axios.get(
          `${this.$root.store.server_domain}/recipes/user/my-family-recipes/${recipeId}/ingredients`,
          { withCredentials: true }
        );
        this.recipe.ingredients = ingRes.data.map((ing) => ({
          name: ing.ingredient_name,
          amount: parseFloat(ing.amount),
          unit: ing.unit
        }));
        this.scaleIngredients(); 
      } catch (e) {
        console.error("Failed to load ingredients for family recipe:", e.message);
      }
    }



    this.newServings = this.recipe.servings;
    this.scaleIngredients();
  },

  methods: {
    async toggleFavorite() {
      const recipeId = Number(this.$route.params.recipeId);
      if (!recipeId) return;

      try {
        if (!this.isFavorite) {
          console.log("Adding to favorites:", recipeId);
          await this.axios.post(
            `${this.$root.store.server_domain}/users/favorites`,
            { recipeId },
            { withCredentials: true }
          );
          this.isFavorite = true;
        } else {
          await this.axios.delete(
            `${this.$root.store.server_domain}/users/favorites/${recipeId}`,
            { withCredentials: true }
          );
          this.isFavorite = false;
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err.message);
      }
    },

    scaleIngredients() {
      const factor = this.newServings / (this.recipe.servings || 1);
      this.scaledIngredients = this.recipe.ingredients.map(ing => ({
        ...ing,
        amount: (ing.amount * factor).toFixed(2)
      }));
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Open+Sans&display=swap');

.recipe-page {
  font-family: 'Open Sans', sans-serif;
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  color: #333;
  line-height: 1.6;
  border: 1px solid #eee;
}

.recipe-title {
  font-family: 'Libre Baskerville', serif;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 24px;
  letter-spacing: 1px;
}

.recipe-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.recipe-left,
.recipe-right {
  flex: 1;
  min-width: 300px;
}

.ingredients h2,
.notes h2,
.directions h2 {
  font-family: 'Libre Baskerville', serif;
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

ul,
ol {
  padding-left: 20px;
}

.recipe-img {
  width: 100%;
  max-width: 320px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.times p {
  font-size: 0.95rem;
  margin: 4px 0;
}

.favorite-toggle {
  margin-top: 8px;
  cursor: pointer;
  color: goldenrod;
  font-size: 1.1rem;
}

.favorite-toggle i {
  margin-right: 6px;
}

.fav-text {
  font-size: 0.95rem;
}

.notes {
  margin-top: 20px;
}

.directions {
  margin-top: 40px;
}

.dietary-labels {
  margin-top: 12px;
  font-size: 0.95rem;
  color: #444;
}

.dietary-labels span {
  margin-right: 12px;
}

.servings-control {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.servings-control input {
  width: 60px;
  padding: 4px;
  font-size: 0.95rem;
}

.servings-control button {
  padding: 6px 10px;
  font-size: 0.9rem;
  background-color: #fff7ec;
  border: 1px solid #d6844a;
  color: #d6844a;
  border-radius: 4px;
  cursor: pointer;
}

.servings-control button:hover {
  background-color: #ffe4c4;
}

.family-meta {
  text-align: center;
  font-size: 1rem;
  color: #9b643d;
  margin-bottom: 20px;
  font-style: italic;
}

.recipe-image {
  display: block;
  margin: 0 auto 30px;
  max-width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

</style>
