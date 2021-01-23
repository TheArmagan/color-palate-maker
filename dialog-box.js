Vue.component("dialog-box", {
  props: [{
    blockerColor: {
      type: String,
      default: "#00000088"
    }
  }],
  data() {
    return {

    }
  },
  template: `
    <div class="vue-dialog">
      <div class="dialog-container" :style="\`background-color: \${this.blockerColor}\`">
        <div class="dialog-wrapper">
          <div class="dialog-content">
            <slot></slot>
          </div>
          <div class="dialog-buttons">

          </div>
        </div>
      </div>
    </div>
  `
})