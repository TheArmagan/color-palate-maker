Vue.use(Vuesax);

const app = new Vue({
  el: "#app",
  data: {
    colors: new Set(),
    pr: new PalateRenderer()
  }
});