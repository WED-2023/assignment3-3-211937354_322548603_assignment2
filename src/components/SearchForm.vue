<template>
  <form @submit.prevent="handleSearch" class="search-form">
    <div class="row mb-3">
      <div class="col-md-6">
        <label for="query">Search:</label>
        <input
          id="query"
          v-model="form.query"
          type="text"
          class="form-control"
          placeholder="Type a recipe name..."
        />
      </div>

      <div class="col-md-2">
        <label for="cuisine">Cuisine:</label>
        <select id="cuisine" v-model="form.cuisine" class="form-control">
          <option value="">Any</option>
          <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="col-md-2">
        <label for="diet">Diet:</label>
        <select id="diet" v-model="form.diet" class="form-control">
          <option value="">Any</option>
          <option v-for="d in diets" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>

      <div class="col-md-2">
        <label for="intolerance">Intolerance:</label>
        <select id="intolerance" v-model="form.intolerance" class="form-control">
          <option value="">None</option>
          <option v-for="i in intolerances" :key="i" :value="i">{{ i }}</option>
        </select>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-md-3">
        <label for="limit">Results:</label>
        <select id="limit" v-model="form.limit" class="form-control">
          <option v-for="n in [5, 10, 15]" :key="n" :value="n">{{ n }} results</option>
        </select>
      </div>

      <div class="col-md-3">
        <label for="sortBy">Sort by:</label>
        <select id="sortBy" v-model="form.sortBy" class="form-control">
          <option value="popularity">Popularity</option>
          <option value="readyInMinutes">Ready in minutes</option>
        </select>
      </div>

      <div class="col-md-3">
        <label for="sortDirection">Direction:</label>
        <select id="sortDirection" v-model="form.sortDirection" class="form-control">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div class="col-md-3 d-flex align-items-end">
        <button type="submit" class="btn btn-primary w-100">Search</button>
      </div>
    </div>
  </form>
</template>

<script>
import store from '../store';
import { cuisines, diets, intolerances } from "@/components/constants.js";


export default {
  name: 'SearchForm',
  data() {
    return {
      form: {
        query: '',
        cuisine: '',
        diet: '',
        intolerance: '',
        limit: 5,
        sortBy: 'popularity',
        sortDirection: 'desc'
      },
      cuisines,
      diets,
      intolerances
      // cuisines: ['Italian', 'Mexican', 'Chinese', 'French', 'Indian'],
      // diets: ['Vegetarian', 'Vegan', 'Ketogenic', 'Gluten Free'],
      // intolerances: ['Dairy', 'Egg', 'Gluten', 'Peanut', 'Seafood']
    };
  },
  methods: {
    async handleSearch() {
    if (!this.form.query) {
      window.toast("Please type something first", "No query provided", "danger");
      return;
    }

    try {
      const { query, ...filters } = this.form;
      console.log("Search parameters:", { query, ...filters });

      const res = await this.axios.get(`${store.server_domain}/spoonacular/search/query`, {
        params: { query, ...filters }
      });

      let results = res.data || [];

      const { sortBy, sortDirection } = this.form;

      if (sortBy) {
        results.sort((a, b) => {
          const valA = a[sortBy] ?? 0;
          const valB = b[sortBy] ?? 0;

          return sortDirection === 'asc' ? valA - valB : valB - valA;
        });
      }

      results = results.slice(0, this.form.limit);

      await this.axios.post(`${store.server_domain}/users/search-history`,
      {
        query: this.form.query,
        cuisine: this.form.cuisine,
        diet: this.form.diet,
        intolerance: this.form.intolerance,
        limit: this.form.limit
      },
      { withCredentials: true }
    );

      this.$emit("search", results);

    } catch (err) {
      console.error("Search failed:", err);
      this.$emit("search", []); // emit empty list on error
    }
  }

  },
  watch: {
    'form.sortBy': 'handleSearch',
    'form.sortDirection': 'handleSearch',
    'form.limit': 'handleSearch'
  }
};
</script>

<style scoped>
.search-form {
  font-family: 'Quicksand', sans-serif;
  background-color: #fff9ef;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
}
label {
  font-weight: 600;
  color: #4a4a4a;
}
button {
  background-color: #d6844a;
  font-weight: bold;
  border: none;
}
button:hover {
  background-color: #bf6a30;
}
</style>