class PalateRenderer {

  /** @type {Array<>} */
  #colors = [];

  /** @type {CanvasRenderingContext2D}*/
  #ctx;

  /** @type {HTMLCanvasElement}*/
  #canvas;

  #rowSize = 6;

  #colorWidth = 256;
  #colorHeight = 256;

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

  setRowSize(rowSize = 6) {
    this.#rowSize = rowSize;
  }

  getRowSize() {
    return this.#rowSize;
  }

  setColorWidth(w) {
    this.#colorWidth = w;
  }

  getColorWidth() {
    return this.#colorWidth;
  }

  setColorHeight(h) {
    this.#colorHeight = h;
  }

  getColorHeight() {
    return this.#colorHeight;
  }

  getBlob(type = null, quality = null) {
    return new Promise((resolve) => {
      this.#canvas.toBlob((blob) => {
        resolve(blob);
      }, type, quality);
    })
  }

  async render() {
    if (this.#colors.length == 0) return this;
    const ctx = this.#ctx;
    const canvas = this.#canvas;

    let perColorWidth = this.#colorWidth;
    let perColorHeight = this.#colorHeight;

    let maxRowSize = this.#rowSize;
    let maxWidth = maxRowSize * perColorWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = this.#colors.length >= maxRowSize ? maxWidth : this.#colors.length * perColorWidth;
    canvas.height = (Math.ceil(this.#colors.length * perColorWidth / maxWidth)) * perColorHeight;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    ctx.font = `20px 'Trebuchet MS'`;
    await chillout.forEach(this.#colors, async (color, colorIndex) => {
      ctx.fillStyle = color.getHex(true);

      let colorXPos = ((colorIndex % maxRowSize) * perColorWidth);
      let colorYPos = Math.floor(colorIndex / maxRowSize) * perColorHeight;

      ctx.fillRect(colorXPos, colorYPos, perColorWidth, perColorHeight);

      ctx.fillStyle = color.getInverted(true).getHex(true);

      const hexText = color.getHex(true);
      const rgbText = color.getRGB(true);
      const hslText = color.getHSL(true);

      ctx.fillText(hexText, perColorWidth + colorXPos - (perColorWidth / 2) - (ctx.measureText(hexText).width / 2), colorYPos + perColorHeight - 60);
      ctx.fillText(hslText, perColorWidth + colorXPos - (perColorWidth / 2) - (ctx.measureText(hslText).width / 2), colorYPos + perColorHeight - 35);
      ctx.fillText(rgbText, perColorWidth + colorXPos - (perColorWidth / 2) - (ctx.measureText(rgbText).width / 2), colorYPos + perColorHeight - 10);
    })

    const watermarkPx = (((perColorWidth + perColorHeight) / 2) / 100) * 5;

    ctx.font = `${watermarkPx}px 'Trebuchet MS'`;
    ctx.fillStyle = `#${this.#colors[0].getInverted(true).getHex(true) || "#ffffff"}80`;
    ctx.fillText("thearmagan.github.io", watermarkPx / 4, watermarkPx + 2);

    return this;
  }

  async download(fileName = "canvas.png") {
    const blob = await this.getBlob();
    saveAs(blob, fileName);
  }

}