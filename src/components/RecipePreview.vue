<template>
  <div class="card h-100 position-relative" :class="{ compact: compact }">
    <div class="image-wrapper" @click="handleImageClick">
      <img
        :src="currentImage"
        @error="onImageError"
        class="card-img-top recipe-image"
        alt="Recipe image"
      />
      <i
        v-if="wasViewed"
        class="fas fa-eye watched-icon"
        title="Already viewed"
      ></i>
    </div>

    <div class="card-body text-center" v-if="!compact">
      <h5 class="card-title">{{ recipe.title || "Untitled Recipe" }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes || recipe.ready_in_minutes || "?" }} minutes</p>
      <p class="card-text">👍 {{ recipe.popularity || recipe.popularity_score || 0 }} likes</p>

      <div
        class="favorite-icon"
        @click.stop="toggleFavorite"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <i :class="['fa-star', isFavorite ? 'fas' : 'far']"></i>
        <span v-if="showTooltip" class="tooltip">Add to favorites</span>
        <transition name="fade">
          <div v-if="showAddedText" class="added-text">Added to your favorites</div>
        </transition>
      </div>

      <div class="dietary-info">
        <span v-if="recipe.vegetarian || recipe.is_vegetarian" title="Vegetarian">🥬</span>
        <span v-if="recipe.vegan || recipe.is_vegan" title="Vegan">🌱</span>
        <span v-if="recipe.glutenFree || recipe.is_gluten_free" title="Gluten Free">❌🌾</span>
      </div>
    </div>

    <div class="card-body text-center compact-text" v-else>
      <h5 class="card-title">{{ recipe.title || "Untitled Recipe" }}</h5>
    </div>
  </div>
</template>

<script>
import defaultImage from "@/assets/default_logo.jpg";
import store from "../store";

export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showTooltip: false,
      isFavorite: false,
      showAddedText: false,
      viewedIds: [],
    };
  },
  computed: {
    currentImage() {
      return this.recipe.image || this.recipe.image_url || defaultImage;
    },
    wasViewed(){
      return this.viewedIds.includes(this.getRecipeId());
    },
    detectedSource() {
      if (this.recipe.family_notes) return "my-family-recipes";
      if (this.recipe.notes || this.recipe.user_id) return "my-recipes";
      return "spoonacular";
    }
  },
async mounted() {

  try {
    const res = await this.axios.get(
      `${store.server_domain}/users/viewed-ids`,
      { withCredentials: true }
    );
    this.viewedIds = res.data;
  } catch (err) {
    console.warn("Failed to load viewed recipe IDs:", err.message);
  }
  try {
    const favIdsRes = await this.axios.get(
      `${store.server_domain}/users/favorite-ids`,
      { withCredentials: true }
    );
    // const favoriteIds = favRes.data.map(fav => fav.spoonacular_recipe_id);
    this.isFavorite = favIdsRes.data.includes(Number(this.getRecipeId()));
    console.log("🔍 Favorite IDs from server:", favIdsRes.data);
    console.log("🆔 Current recipe ID (from getRecipeId):", this.getRecipeId());

  } catch (err) {
    console.warn("Failed to load favorites:", err.message);
  }
},

  methods: {
    getRecipeSource() {
      if (this.recipe.source) return this.recipe.source;
      if (this.recipe.when_to_prepare || this.recipe.owner_name) return "my-family-recipes";
      if (this.recipe.notes || this.recipe.user_id) return "my-recipes";
      return "spoonacular";
    },
    onImageError(event) {
      event.target.src = defaultImage;
    },
    async handleImageClick() {
      const recipeId = this.getRecipeId();
      if (!recipeId) return;
      const detectedType = this.getRecipeSource();
      // let detectedType = "spoonacular";
      // if (this.recipe.source) {
      //   detectedType = this.recipe.source;
      // } else if (this.recipe.whenToPrepare || this.recipe.owner_name) {
      //   detectedType = "my-family-recipes";
      // } else if (this.recipe.notes) {
      //   detectedType = "my-recipes";
      // }

      try {
        await this.axios.post(
          `${store.server_domain}/users/mark-as-viewed`,
          {
            recipe_id: recipeId,
            source: detectedType,
          },
          { withCredentials: true }
        );
      } catch (err) {
        console.warn("Failed to mark recipe as viewed:", err.message);
      }
      console.log("Navigating to recipe:", recipeId, "Source:", detectedType);
      // this.$router.push({ name: "recipe", params: { recipeId: this.getRecipeId(), source: this.detectedSource } });
      this.$router.push({ name: "recipe", params: { recipeId: this.getRecipeId(), source: detectedType } });

    },
    getRecipeId() {
      return (
        this.recipe.id ||
        this.recipe.recipe_id ||
        this.recipe.spoonacular_recipe_id ||
        this.recipe.user_recipe_id ||
        this.recipe.family_recipe_id ||
        null
      );
    },

    async toggleFavorite() {
        const recipeId = this.getRecipeId();
      // const recipeId = this.recipe.id;
        if (!recipeId) return;

        try {
          if (!this.isFavorite) {
            console.log("Adding to favorites:", recipeId);
            await this.axios.post(
              `${store.server_domain}/users/favorites`,
              {
                recipeId: recipeId,
              },
              { withCredentials: true }
            );
            this.isFavorite = true;
            this.showAddedText = true;
            setTimeout(() => {
              this.showAddedText = false;
            }, 2000);
          } else {
            await this.axios.delete(
              `${store.server_domain}/users/favorites/${recipeId}`,
              { withCredentials: true }
            );
            this.isFavorite = false;
          }
        } catch (err) {
          console.error("Failed to toggle favorite:", err.message);
        }
      },
  },
};
</script>

<style scoped>
.card {
  transition: box-shadow 0.3s;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.recipe-image {
  object-fit: cover;
  height: 250px;
  width: 100%;
  display: block;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-wrapper {
  position: relative;
  cursor: pointer;
}

.image-wrapper:hover .recipe-image {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dietary-info {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: goldenrod;
}

.favorite-icon .tooltip {
  position: absolute;
  top: -25px;
  right: 0;
  background: #fffbe7;
  border: 1px solid #d4af37;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.added-text {
  position: absolute;
  top: -45px;
  right: -10px;
  background: #fff0d5;
  border: 1px solid #e2a03f;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: #5b4400;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.watched-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #555;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px;
  border-radius: 50%;
}

.compact .card-body {
  padding: 10px 12px;
}

.compact-text .card-title {
  font-size: 1rem;
}
</style>
