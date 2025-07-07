import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  
  // {
  //   path: "/recipe/:recipeId",
  //   name: "recipe",
  //   component: () => import("../pages/RecipeViewPage.vue"),
  // },
    {
    path: "/recipe/:recipeId/:source",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },

  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../pages/FavoriteRecipesPage.vue'), // Fixed: changed from @/views to ../pages
  },
  {
    path: '/my-recipes',
    name: 'MyRecipes',
    component: () => import('../pages/MyRecipesPage.vue'), // Fixed: changed from @/views to ../pages
  },
  {
    path: '/family-recipes',
    name: 'FamilyRecipes',
    component: () => import('../pages/FamilyRecipesPage.vue'), // Fixed: changed from @/views to ../pages
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  }
];

export default routes;