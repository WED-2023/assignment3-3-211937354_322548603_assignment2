<template>
  <div class="recipe-list-container">
    <h3 class="section-title">{{ title }}</h3>

    <div v-if="internalRecipes.length" class="recipes-grid">
      <RecipePreview
        v-for="r in internalRecipes"
        :key="r.id"
        :recipe="r"
        :viewed="viewedIds.includes(r.id)"
        class="recipe-preview"
      />
    </div>

    <div v-else class="no-recipes">
      <p>No recipes to display.</p>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      // required: true,
      required: false,
      default: ""
    },
    mode: {
      type: String,
      default: "random", // "random" or "lastViewed"
    },
    recipes: {
      type: Array,
      default: () => [],
    },
    viewedIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      internalRecipes: [],
    };
  },
  mounted() {
    if (this.recipes.length > 0) {
      this.internalRecipes = this.recipes;
    } else {
      this.updateRecipes();
    }
  },
  methods: {
    async updateRecipes() {
      console.log("Updating recipes in RecipePreviewList...");
      // try {
      //   if (this.mode === "random") {
      //     const response = await this.axios.get(this.$root.store.server_domain + "/spoonacular/random");
      //     this.internalRecipes = response.data || [];
      //   } else if (this.mode === "lastViewed") {
      //     try {
      //       const response = await this.axios.get(this.$root.store.server_domain + "/users/lastViewed");
      //       const data = response.data;
      //       if (Array.isArray(data) && data.length > 0) {
      //         this.internalRecipes = data;
      //         return;
      //       }
      //     } catch (e) {
      //       console.warn("Server-side lastViewed failed, trying localStorage");
      //     }

      //     const watched = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      //     const promises = watched.map((id) =>
      //       this.axios
      //         .get(`${this.$root.store.server_domain}/spoonacular/${id}`)
      //         .then((res) => res.data)
      //         .catch(() => null)
      //     );
      //     const results = await Promise.all(promises);
      //     this.internalRecipes = results.filter((r) => r !== null);
      //   }
      // } catch (error) {
      //   console.error("Failed to fetch recipes:", error);
      //   this.internalRecipes = [];
      // }
    },
  },
};
</script>

<style scoped>
.recipe-list-container {
  padding: 20px 10px;
  background-color: #fffaf4;
  font-family: 'Quicksand', sans-serif;
}

.section-title {
  font-size: 1.8rem;
  color: #d6844a;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.no-recipes {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  padding: 30px 0;
}
</style>
