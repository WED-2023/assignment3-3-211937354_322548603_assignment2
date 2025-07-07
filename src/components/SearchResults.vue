<template>
  <div class="search-results mt-4">
    <h4 v-if="recipes.length">Search Results</h4>
    <p v-else class="text-muted">No recipes found matching your search. Try something else?</p>

    <div class="row mt-3" v-if="recipes.length">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="col-sm-12 col-md-6 col-lg-4 mb-4"
      >
        <RecipePreview :recipe="recipe" class="recipe-preview" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "SearchResults",
  components: {
    RecipePreview,
  },
  props: {
    recipes: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.search-results {
  background-color: #fffefc;
  padding: 20px;
  border-radius: 12px;
}
h4 {
  color: #d6844a;
}
.text-muted {
  font-style: italic;
}
</style>
