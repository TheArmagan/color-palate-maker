class PalateRenderer {

  /** @type {Array<>} */
  #colors = [];

  /** @type {CanvasRenderingContext2D}*/
  #ctx;

  /** @type {HTMLCanvasElement}*/
  #canvas;

  constructor() {
    this.#canvas = document.createElement("canvas");;
    this.#ctx = this.#canvas.getContext("2d");
  }

  setColors(array) {
    this.#colors = array;
  }

  getColors() {
    return this.#colors;
  }

  getCanvas() {
    return this.#canvas;
  }

  getContext() {
    return this.#ctx;
  }

  getBlob(type = null, quality = null) {
    return new Promise((resolve) => {
      this.#canvas.toBlob((blob) => {
        resolve(blob);
      }, type, quality);
    })
  }

  async render() {
    const ctx = this.#ctx;
    const canvas = this.#canvas;

    let perColorWidth = 192;
    let perColorHeight = 192;

    let rowSize = 6;
    let maxWidth = rowSize * perColorWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = this.colors.length >= rowSize ? maxWidth : this.colors.length * perColorWidth;
    canvas.height = (Math.ceil(this.colors.length * perColorWidth / maxWidth)) * perColorHeight;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    ctx.font = `24px 'Trebuchet MS'`;

    await chillout.forEach(this.#colors, async (color, colorIndex) => {
      ctx.fillStyle = color.getHex(true);

      let xPos = ((colorIndex % rowSize) * perColorWidth);
      let yPos = Math.floor(colorIndex / rowSize) * perColorHeight;

      ctx.fillRect(xPos, yPos, perColorWidth, perColorHeight);

      ctx.fillStyle = `#${color.getInverted(true).getHex(true)}`;

      ctx.fillText(color, perColorWidth + xPos - (perColorWidth / 2) - (ctx.measureText(color).width / 2), yPos + perColorHeight - 10);
    })

    ctx.font = `11px 'Trebuchet MS'`;
    ctx.fillStyle = `#${this.colors[0].getHex(true) || "#ffffff"}80`;
    ctx.fillText("thearmagan.github.io", 6, 13);

    return this;
  }

  async download(fileName = "canvas.png") {
    const blob = await this.getBlob();
    saveAs(blob, fileName);
  }

}