/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;

const app = new Vue({
    el: "#vue-app",
    data: {
        colors: [
            "#fac89e",
            "#e8e492",
            "#cdf894",
            "#b1ffa4",
            "#9bf8be",
            "#91e4da",
            "#96c8f2",
            "#a8adfe",
            "#c398fc",
            "#df91ec",
            "#f598d2",
            "#ffacb6"
          ]
    },
    methods: {
        updateCanvasColors: function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let perColorWidth = 256;
            let perColorHeight = 256;

            let maxColorPerRow = 6;
            let maxWidth = maxColorPerRow * perColorWidth;

            canvas.width = this.colors.length >= maxColorPerRow ? maxWidth : this.colors.length*perColorWidth;
            canvas.height = (Math.floor(this.colors.length*perColorWidth / maxWidth))*perColorHeight;
            if (canvas.height == 0) canvas.height = perColorHeight;

            ctx.font = `36px 'Trebuchet MS'`;

            this.colors.forEach((color, colorIndex) => {

                color = color.toUpperCase();

                ctx.fillStyle = color;

                let xPos = ((colorIndex % maxColorPerRow) * perColorWidth);
                let yPos = Math.floor(colorIndex/maxColorPerRow)*perColorHeight;

                ctx.fillRect(xPos, yPos, perColorWidth, perColorHeight);

                ctx.fillStyle = `#${invertHex(color.slice(1), true)}`;

                ctx.fillText(color,perColorWidth+xPos-(perColorWidth/2)-(ctx.measureText(color).width/2),yPos+perColorHeight-10);

                if (colorIndex != 0) {

                    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";

                    ctx.fillRect(xPos-2, yPos, 4, perColorHeight);

                }

                if (yPos != 0) {

                    ctx.fillStyle = `rgba(0, 0, 0, ${0.25 / maxColorPerRow}`;
    
                    ctx.fillRect(0, yPos-2, canvas.width, 4);
                    
                }
            })

            

            ctx.font = `11px 'Trebuchet MS'`;
            ctx.fillStyle = `#${invertHex(this.colors[0], true)}80`;
            ctx.fillText("thearmagan.github.io", 6, 13);
        },
        onColorInput: function (e) {
            this.colors[e.target.getAttribute("index")] = e.target.value;
            this.updateCanvasColors();
        }
    },
    watch: {
        colors: function (newVal, oldVal) {
            this.updateCanvasColors();
        }
    },
    mounted: function () {
        canvas = document.querySelector("canvas");
        canvas.width = window.innerWidth;
        canvas.height = 96;
        ctx = canvas.getContext("2d");

        this.updateCanvasColors();
    }
})

// https://stackoverflow.com/a/5092846/11949394
function randomHex() {
    return "000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
}
// ---

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