class Color {
  #hex = "#000000";
  #rgb = [1, 1, 1];
  #hsl = [1, 1, 1];
  constructor(hex = "#000000") {
    this.setHex(hex);
  }

  setHex(hex = "#000000") {
    hex = hex.replace(/#/g, '');
    if (hex.length === 3) hex = hex.repeat(2);
    this.#hex = "#" + hex;
    this.#rgb = HEXtoRGB(hex);
    this.#hsl = HEXtoHSL(hex);
    return this;
  }

  getHex(asString) {
    if (asString) {
      return this.#hex;
    } else {
      return parseInt(this.#hex, 16);
    }
  }

  getRGB(asString = false) {
    if (asString) {
      return `rgb(${this.#rgb[0]}, ${this.#rgb[1]}, ${this.#rgb[2]})`;
    } else {
      return this.#rgb;
    }
  }

  getHSL(asString) {
    if (asString) {
      return `hsl(${this.#hsl[0]}, ${this.#hsl[1]}%, ${this.#hsl[2]}%)`;
    } else {
      return this.#hsl;
    }
  }

  getInverted(blackAndWhite = false) {
    return new Color(invertHex(this.#hex.replace(/#/g, ''), blackAndWhite));
  }
}

function HEXtoRGB(hex) {
  hex = hex.replace(/#/g, '');
  if (hex.length === 3) {
    hex = hex.split('').map(function (hex) {
      return hex + hex;
    }).join('');
  }
  var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
  if (result) {
    var red = parseInt(result[1], 16);
    var green = parseInt(result[2], 16);
    var blue = parseInt(result[3], 16);

    return [red, green, blue];
  } else {
    return null;
  }
}

function HEXtoHSL(hex) {
  hex = hex.replace(/#/g, '');
  if (hex.length === 3) {
    hex = hex.split('').map(function (hex) {
      return hex + hex;
    }).join('');
  }
  var result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})[\da-z]{0,0}$/i.exec(hex);
  if (!result) {
    return null;
  }
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return [h, s, l];
}

// https://stackoverflow.com/a/35970186/11949394
function padZero(str, len = 2) {
  return (new Array(len).join('0') + str).slice(-len);
}
function invertHex(hex, bw) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // http://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '000000'
      : 'FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return padZero(r) + padZero(g) + padZero(b);
}
// ----