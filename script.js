/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;

const app = new Vue({
    el: "#vue-app",
    data: {
        colors: ["#0078b9","#0097d2","#24acf2"]
    },
    methods: {
        updateCanvasColors: function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let perColorWidth = 256;

            canvas.width = this.colors.length*perColorWidth;

            ctx.font = `36px 'Trebuchet MS'`;

            this.colors.forEach((color, colorIndex) => {

                ctx.fillStyle = color;

                let xPos = (colorIndex * perColorWidth);

                ctx.fillRect(xPos, 0, perColorWidth, canvas.height);

                ctx.fillStyle = "#ffffff";

                ctx.fillText(color,perColorWidth+xPos-(perColorWidth/2)-(ctx.measureText(color).width/2),canvas.height-10);

                if (colorIndex != 0) {

                    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";

                    ctx.fillRect(xPos-2, 0, 4, canvas.height);

                }
                
            })
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

        window.addEventListener("resize", ()=>{
            canvas.width = window.innerWidth;
            this.updateCanvasColors();
        })
    }
})