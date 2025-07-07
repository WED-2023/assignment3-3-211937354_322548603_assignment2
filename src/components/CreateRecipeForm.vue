<template>
  <form @submit.prevent="submitRecipe" class="create-recipe-form">
    <h2 class="form-title">Create a New Recipe</h2>

    <div class="form-grid">
      <!-- Title -->
      <div class="form-group">
        <label>Title*</label>
        <input v-model="form.title" type="text" placeholder="e.g. Grandma's Pasta" />
        <small v-if="v$.form.title.$error" class="error-text">Title is required.</small>
      </div>

      <!-- Image URL -->
      <div class="form-group">
        <label>Image URL</label>
        <input v-model="form.image" type="url" placeholder="https://example.com/image.jpg" />
        <small v-if="v$.form.image.$error" class="error-text">Valid image URL is required.</small>
      </div>

      <!-- Cook Time -->
      <div class="form-group">
        <label>Cook & Prep Time (in minutes)*</label>
        <input v-model.number="form.readyInMinutes" type="number" min="1" />
        <small v-if="v$.form.readyInMinutes.$error" class="error-text">Please enter a valid number of minutes.</small>
      </div>

      <!-- Servings -->
      <div class="form-group">
        <label>Servings*</label>
        <input v-model.number="form.servings" type="number" min="1" />
        <small v-if="v$.form.servings.$error" class="error-text">Please enter number of servings.</small>
      </div>

      <!-- Cuisine
      <div class="form-group">
        <label>Cuisine</label>
        <select v-model="form.cuisine">
            <option disabled value="">Select cuisine</option>
            <option>American</option>
            <option>Italian</option>
            <option>Asian</option>
            <option>Mexican</option>
            <option>Indian</option>
            <option>French</option>
            <option>Middle Eastern</option>
            <option>Other</option>
        </select>
      </div> -->

      <!-- Description -->
      <div class="form-group full-width">
        <label>Description</label>
        <textarea v-model="form.description" placeholder="Write a short description..."></textarea>
      </div>

      <!-- Ingredients -->
      <div class="form-group full-width">
        <label>Ingredients *</label>
        <div v-for="(ing, i) in form.ingredients" :key="i" class="inline-group ingredient-box">
          <input v-model="ing.name" placeholder="Name" />
          <input type="number" v-model.number="ing.amount" placeholder="Amount" step="any" />
          <input v-model="ing.unit" placeholder="Unit" />
          <button type="button" class="remove-btn" @click="removeIngredient(i)">✖</button>
        </div>
        <button type="button" class="add-btn" @click="addIngredient">+ Add Ingredient</button>
      </div>

    <!-- Instructions -->
    <div class="form-group full-width">
    <label>Instructions *</label>
    <div v-for="(step, i) in instructionsList" :key="i" class="form-group">
    <textarea
        v-model="instructionsList[i]"
        placeholder="Write your instruction here..."
        rows="3"
    ></textarea>
    <button type="button" class="remove-btn" @click="removeInstruction(i)">✖</button>
    </div>
    <button type="button" class="add-btn" @click="addInstruction">+ Add Step</button>
    </div>


    <!-- Tags -->
    <div class="form-group full-width">
    <label>Tags:</label>
    <div class="tags">
        <label><input type="checkbox" v-model="form.isvegetarian" /> 🥬 Vegetarian</label>
        <label><input type="checkbox" v-model="form.isvegan" /> 🌱 Vegan</label>
        <label><input type="checkbox" v-model="form.isglutenFree" /> 🌾 Gluten-Free</label>
    </div>
    </div>


      <!-- Is Family -->
      <div class="form-group full-width">
        <label>Family Recipe?</label>
        <input type="checkbox" v-model="form.isFamily" class="toggle-switch" />
      </div>

      <div v-if="form.isFamily" class="form-group full-width">
        <label>Family Member</label>
        <input v-model="form.familyMember" type="text" placeholder="e.g. Aunt Lucy" />
      </div>

      <div v-if="form.isFamily" class="form-group full-width">
        <label>Occasion</label>
        <input v-model="form.occasion" type="text" placeholder="e.g. Passover Dinner" />
      </div>
    </div>

    <button type="submit" class="btn-submit">Save The Recipe</button>
    <p v-if="submitError" class="error-text">{{ submitError }}</p>
  </form>
</template>

<script setup>
import { reactive, ref, nextTick, defineEmits } from 'vue';
// import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, url, minValue } from '@vuelidate/validators';
import axios from 'axios';
import store from '@/store';
import { useToast } from 'vue-toastification';

const toast = useToast();
const emit = defineEmits(['close']);
// const router = useRouter();
const submitError = ref('');

const form = reactive({
  title: '',
  image: '',
  readyInMinutes: 1,
  servings: 1,
  // cuisine: '',
  description: '',
  isvegan: false,
  isvegetarian: false,
  isglutenFree: false,
  isFamily: false,
  familyMember: '',
  occasion: '',
  ingredients: [{ name: '', amount: null, unit: '' }],
});

const instructionsList = ref(['']);

const rules = {
  form: {
    title: { required },
    image: { url },
    readyInMinutes: { required, minValue: minValue(1) },
    servings: { required, minValue: minValue(1) },
    ingredients: {
      $each: {
        name: { required },
        amount: { required },
        unit: { required },
      }
    }
  }
};

const v$ = useVuelidate(rules, { form });

const addIngredient = () => {
  form.ingredients.push({ name: '', amount: null, unit: '' });
};

const removeIngredient = (i) => {
  form.ingredients.splice(i, 1);
};

const addInstruction = () => {
  instructionsList.value.push('');
};

const removeInstruction = (i) => {
  instructionsList.value.splice(i, 1);
};

const resetForm = () => {
  form.title = '';
  form.image = '';
  form.readyInMinutes = 1;
  form.servings = 1;
  // form.cuisine = '';
  form.description = '';
  form.isvegan = false;
  form.isvegetarian = false;
  form.isglutenFree = false;
  form.isFamily = false;
  form.familyMember = '';
  form.occasion = '';
  form.ingredients = [{ name: '', amount: null, unit: '' }];
  instructionsList.value = [''];
};

defineExpose({ resetForm });

const submitRecipe = async () => {
  console.log("submitRecipe called");
  submitError.value = '';
  await v$.value.$validate();

  if (v$.value.$invalid) {
    console.log("Validation failed", v$.value);
    return;
  }

  const body = {
    title: form.title,
    imageUrl: form.image,
    readyInMinutes: form.readyInMinutes,
    servings: form.servings,
    summary: form.description,
    isVegan: form.isvegan ? 1 : 0,
    isVegetarian: form.isvegetarian ? 1 : 0,
    isGlutenFree: form.isglutenFree ? 1 : 0,
    instructions: instructionsList.value.join('\n'),
    ingredients: form.ingredients
      .filter(i =>
        typeof i.name === 'string' && i.name.trim() !== '' &&
        typeof i.amount === 'number' && !isNaN(i.amount) &&
        typeof i.unit === 'string' && i.unit.trim() !== ''
      )
      .map(i => ({
        ingredientName: i.name,
        amount: i.amount,
        unit: i.unit
      })),
    preparationSteps: instructionsList.value
      .filter(desc => typeof desc === 'string' && desc.trim() !== '')
      .map((desc, index) => ({
        stepNumber: index + 1,
        stepDescription: desc
      }))
  };

  if (form.isFamily) {
    body.ownerName = form.familyMember;
    body.whenToPrepare = form.occasion;
  }
  console.log("Submitting recipe with body:", body);

  try {
    console.log("Submitting to:", `${store.server_domain}/recipes/user/new-recipe`);
    // await axios.post(`${store.server_domain}/recipes/user/new-recipe`, body, { withCredentials: true });
    const endpoint = form.isFamily
      ? "/recipes/user/family-recipes"
      : "/recipes/user/new-recipe";

    await axios.post(`${store.server_domain}${endpoint}`, body, { withCredentials: true });


    toast.success("Recipe added successfully, sweetie.", {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      position: "top-center",
      style: {
        background: "#fff3e6",
        color: "#a4552b",
        fontWeight: "bold",
        fontFamily: "'Quicksand', sans-serif",
        borderRadius: "12px",
        padding: "16px 24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }
    });

    resetForm();
    await nextTick();
    emit('close');

  } catch (err) {
    console.error("Error during submit:", err);
    submitError.value = "Oops! Something went wrong. Try again later.";
  }
};
</script>



<style scoped>
.create-recipe-form {
  background-color: #fffaf4;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  font-family: 'Quicksand', sans-serif;
  max-width: 900px;
  margin: 0 auto;
}

.form-title {
  text-align: center;
  margin-bottom: 24px;
  color: #d6844a;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.full-width {
  grid-column: 1 / -1;
}

input,
select,
textarea {
  padding: 12px;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  background-color: #fff;
  font-size: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #444;
  font-size: 0.95rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.inline-group {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  align-items: center;
}

.ingredient-box input[placeholder="Name"] {
  flex: 2;
  min-width: 0;
}

.ingredient-box input[placeholder="Amount"] {
  flex: 1;
  min-width: 0;
  max-width: 100px;
}

.ingredient-box input[placeholder="Unit"] {
  flex: 1;
  min-width: 0;
  max-width: 120px;
}

/* .ingredient-box, .instruction-box {
  background-color: #fff0e8;
  padding: 10px;
  border-radius: 10px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
} */

.remove-btn {
  background-color: #f8d7da;
  border: none;
  color: #721c24;
  font-weight: bold;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  cursor: pointer;
}

.add-btn {
  background-color: #ffe4cc;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 6px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.tags label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}


.btn-submit {
  margin-top: 24px;
  background-color: #e7996e;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  transition: background 0.3s ease;
}

.btn-submit:hover {
  background-color: #d6844a;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 4px;
}

.toggle-switch {
  width: 40px;
  height: 24px;
  appearance: none;
  background: #ccc;
  border-radius: 12px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-switch:checked {
  background: #1e90ff;
}

.toggle-switch:before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: 0.3s ease;
}

.toggle-switch:checked:before {
  transform: translateX(16px);
}
</style>