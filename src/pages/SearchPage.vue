<template>
  <div class="search-page container">
    <h1 class="page-title">Find Your Next Favorite Dish</h1>

    <!-- Search Form -->
    <SearchForm @search="handleSearch" />

    <!-- Current Search Results -->
    <div v-if="searched" class="mt-5">
      <h4 v-if="recipes.length" class="section-title">Search Results</h4>
      <p v-else class="text-muted">No recipes found. Try a different search.</p>
      <SearchResults :recipes="recipes" />
    </div>

    <!-- Last Search Results -->
    <div v-else class="mt-5">
      <h4 class="section-title">Your Last Search</h4>

      <!-- Search Metadata Display -->
      <div v-if="lastSearchQuery" class="search-meta-box">
        <span class="meta-item"><strong>Query:</strong> "{{ lastSearchQuery }}"</span>
        <span v-if="lastSearchFilters.cuisine" class="meta-item">
          <strong>Cuisine:</strong> {{ lastSearchFilters.cuisine }}
        </span>
        <span v-if="lastSearchFilters.diet" class="meta-item">
          <strong>Diet:</strong> {{ lastSearchFilters.diet }}
        </span>
        <span v-if="lastSearchFilters.intolerance" class="meta-item">
          <strong>Intolerance:</strong> {{ lastSearchFilters.intolerance }}
        </span>
        <!-- <span v-if="lastSearchFilters.limit" class="meta-item">
          <strong>Limit:</strong> {{ lastSearchFilters.limit }}
        </span> -->
      </div>

      <div v-if="lastSearchResults.length">
        <SearchResults :recipes="lastSearchResults" />
      </div>
      <p v-else class="text-muted">No recipes to display from your last search.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import store from '../store';
import SearchForm from '../components/SearchForm.vue';
import SearchResults from '../components/SearchResults.vue';

export default {
  name: 'SearchPage',
  components: {
    SearchForm,
    SearchResults
  },
  setup() {
    const recipes = ref([]);
    const searched = ref(false);
    const lastSearchQuery = ref(null);
    const lastSearchFilters = ref({});
    const lastSearchResults = ref([]);

    const handleSearch = (results) => {
      recipes.value = results;
      searched.value = true;
    };

    const runLastSearch = async () => {
      try {
        const res = await axios.get(`${store.server_domain}/users/last-search-results`, {
          withCredentials: true
        });
        console.log("🎯 Full response from server:", res.data);
        if (res.data?.recipes?.length) {
          const meta = res.data.searchMeta || {};

          lastSearchResults.value = res.data.recipes;
          lastSearchQuery.value = meta.query;

          // Normalize keys for display
        lastSearchFilters.value = {
          cuisine: meta.cuisine || meta.cuisine_filter || '',
          diet: meta.diet || meta.diet_filter || '',
          intolerance: meta.intolerances || meta.intolerance || meta.intolerance_filter || '',
          // limit: meta.limit || meta.results_limit || meta.number || ''
        };

        }
      } catch (err) {
        console.warn("Failed to load last search:", err.message);
      }
    };

    onMounted(() => {
      if (store.username) {
        runLastSearch();
      }
    });

    return {
      recipes,
      searched,
      lastSearchQuery,
      lastSearchFilters,
      lastSearchResults,
      handleSearch
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap');

.search-page {
  font-family: 'Quicksand', sans-serif;
  padding-top: 30px;
}

.page-title {
  text-align: center;
  color: #d6844a;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.4rem;
  color: #d6844a;
  font-weight: 600;
  margin-bottom: 20px;
}

.search-meta-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background-color: #fff9f2;
  border: 1px solid #f1e0d0;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.meta-item {
  background-color: #fdf1e6;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.95rem;
  color: #4a4a4a;
  border: 1px solid #e7d3be;
}

.text-muted {
  color: #6c757d;
  font-style: italic;
}
</style>
