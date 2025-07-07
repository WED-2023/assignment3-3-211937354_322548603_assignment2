<template>
  <div class="about-page container">
    <div class="card-content">
      <h1 class="title">About the Project</h1>

      <p class="intro">
        Welcome to Grandma’s Kitchen – or at least to our cinnamon-scented corner of the web.
        This application was created as a final project for the Web Development Environments course at Ben-Gurion University by a team of third-year students.
        The idea? Combine a love for home-cooked meals with clean, modular code – and a touch of sass, just like Grandma would have liked.
      </p>

      <h2>Core Features</h2>
      <ul>
        <li>Smart recipe search with filters by cuisine, diet, and intolerance</li>
        <li>Interactive recipe view with ingredients, instructions, and preparation time</li>
        <li>Support for personal and family recipes with optional images and stories</li>
        <li>Favorites, recently viewed recipes, and personalized meal tracking</li>
        <li>Responsive user interface with soft, cohesive design language</li>
      </ul>

      <h2>Technical Overview</h2>
      <ul>
        <li><strong>Frontend:</strong> Vue.js</li>
        <li><strong>Backend:</strong> Node.js + Express</li>
        <li><strong>Database:</strong> MySQL</li>
        <li><strong>API Integration:</strong> Spoonacular</li>
        <li><strong>Form Validation:</strong> Vuelidate</li>
        <li><strong>Authentication:</strong> Express-session</li>
      </ul>

      <p class="closing">
        The system is designed to be fast, clean, and enjoyable to use. We followed modular development practices, kept the codebase tidy, and tested each component thoroughly.
        The result is a recipe platform that’s as functional as it is charming.
        Hungry for more? Dive in.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap');

.about-page {
  font-family: 'Quicksand', sans-serif;
  padding-top: 40px;
  max-width: 900px;
  margin: auto;
}

.card-content {
  background-color: #fff9ef;
  border-radius: 16px;
  padding: 40px 50px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.title {
  text-align: center;
  color: #d6844a;
  margin-bottom: 30px;
}

.intro, .closing {
  font-size: 17px;
  margin-bottom: 30px;
  color: #4a4a4a;
  line-height: 1.6;
}

h2 {
  color: #a85d2e;
  margin-top: 25px;
  margin-bottom: 15px;
  font-size: 20px;
}

ul {
  list-style-type: disc;
  margin-left: 25px;
  margin-bottom: 30px;
  color: #333;
}

ul li {
  margin-bottom: 10px;
}
</style>
