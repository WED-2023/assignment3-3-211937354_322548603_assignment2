<template>
  <div class="showcase">
    <transition name="fade" mode="out-in">
      <img
        :src="images[currentIndex]"
        :key="currentIndex"
        class="showcase-image"
        alt="Delicious recipe image"
      />
    </transition>
    <div class="overlay">
      <h1>Welcome Back</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginShowcase",
  data() {
    return {
      images: [
        require("@/assets/pic1.jpg"),
        require("@/assets/pic2.jpg"),
        require("@/assets/pic3.jpg"),
        require("@/assets/pic4.jpg"),
      ],
      currentIndex: 0,
      interval: null,
    };
  },
  mounted() {
    this.interval = setInterval(this.nextImage, 4000); // switch every 4 sec
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
  },
};
</script>

<style scoped>
.showcase {
  position: relative;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  background-color: #111;
}

.showcase-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 1s ease-in-out;
  z-index: 0;
}

.overlay {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  top: 35%;
  padding: 0 40px;
  font-family: 'Quicksand', sans-serif;
}

.overlay h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
}

.overlay p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #eee;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
