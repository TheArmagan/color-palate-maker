Vue.component("progress-bar", {
  props: {
    value: {
      type: Number,
      default: 75
    },
    max: {
      type: Number,
      default: 100
    },
    "no-head": {
      type: Boolean,
      default: false
    },
    "show-value": {
      type: String,
      default: "popup"
    }
  },
  data() {
    return {
      width: -1,
      isMouseDown: false,
      value$: this.value
    }
  },
  mounted() {
    const { width, padding } = getComputedStyle(this.$el);
    this.width = parseFloat(width.replace("px", "")) - parseFloat(padding.replace("px", "")) * 2;
    if (this.noHead) {
      this.$el.classList.add("no-head")
    } else {
      this.$el.addEventListener("mousedown", this.mouseDown);
      document.body.addEventListener("mouseup", this.mouseUp);
      document.body.addEventListener("mousemove", this.mouseMove);
      document.body.addEventListener("mouseleave", this.mouseLeave);
    }
  },
  methods: {
    mouseDown(event) {
      if (event.button === 0) {
        this.isMouseDown = true;
        this.moveTo(event.pageX - this.$el.offsetLeft);
      }
    },
    mouseUp(event) {
      if (event.button === 0) {
        this.isMouseDown = false;
      }
    },
    mouseMove(event) {
      if (this.isMouseDown) {
        this.moveTo(event.pageX - this.$el.offsetLeft);
      }
    },
    mouseLeave() {
      this.isMouseDown = false;
    },
    moveTo(x = 0) {
      const percentage = (100 * x) / this.width;
      this.value$ = percentage;
    }
  },
  watch: {
    value(value) {
      this.value$ = value;
    },
    "value$"(value) {
      this.value$ = Math.max(Math.min(this.max, value), 0);
      this.$emit('input', this.value$);
    }
  },
  template: `
  <div class="progress-bar" :class="{'active': isMouseDown, 'popup': showValue == 'popup' || showValue == 'mixed'}">
    <div class="bar" :style="\`width:\${(100*value$)/max}%;\`">
      <div class="inline-value" :style="\`opacity:\${Math.min(value$,10)/10};\`" v-if="showValue == 'inline' || showValue == 'mixed'">{{value$.toFixed(2)}}</div>
      <div class="head" :value="value$.toFixed(2)"></div>
    </div>
  </div>
  `
})