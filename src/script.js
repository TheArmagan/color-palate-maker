Vue.use(Verte, {
  recentColors: JSON.parse(localStorage.getItem('colors') || "{}") || ["#000000"],
  onRecentColorsChange(colors) {
    localStorage.setItem('colors', JSON.stringify(colors));
  }
});

const app = new Vue({
  el: "#app",
  data: {
    currentColor: null,
    currentColors: null,
    selectedColor: null,
    pr: new PalateRenderer(),
    suggestedColors: []
  },
  mounted() {
    this.$watch(function () {
      return this.$refs.colorPicker.value
    }, function (value) {
      this.currentColor = value;

      if (this.selectedColor != null) {
        this.currentColors.set(this.selectedColor, new Color(this.currentColor));
        this.$forceUpdate();
      }
    });

    this.currentColor = (JSON.parse(localStorage.getItem('colors') || "{}")[0] || "#000000");
    this.currentColors = new Map([["0", new Color(this.currentColor)]])
  },
  computed: {
    currentColorsArray: () => {
      return Array.from(this.currentColors);
    }
  },
  methods: {
    addColor(color = this.currentColor) {
      this.currentColors.set(Date.now(), new Color(color));
      this.$forceUpdate();
    },
    removeColor(key = 0) {
      this.currentColors.delete(key);
      this.$forceUpdate();
    }
  },
  watch: {
    "currentColor"(value) {
      this.suggestedColors = [
        ...tinycolor(value).monochromatic(results = 4),
        ...tinycolor(value).analogous(results = 4),
        ...tinycolor(value).triad(),
        ...tinycolor(value).tetrad(),
        tinycolor(invertHex(value))
      ].map(i => i.toHexString());
      this.$forceUpdate();
    }
  }
});