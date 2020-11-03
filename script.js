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

            let perColorWidth = 192;
            let perColorHeight = 192;

            let maxColorPerRow = 6;
            let maxWidth = maxColorPerRow * perColorWidth;

            canvas.width = this.colors.length >= maxColorPerRow ? maxWidth : this.colors.length*perColorWidth;
            canvas.height = (Math.ceil(this.colors.length*perColorWidth / maxWidth))*perColorHeight;
            canvas.style.width = `${canvas.width}px`;
            canvas.style.height = `${canvas.height}px`;
            

            ctx.font = `24px 'Trebuchet MS'`;

            this.colors.forEach((color, colorIndex) => {

                color = color.toUpperCase();

                ctx.fillStyle = color;

                let xPos = ((colorIndex % maxColorPerRow) * perColorWidth);
                let yPos = Math.floor(colorIndex/maxColorPerRow)*perColorHeight;

                ctx.fillRect(xPos, yPos, perColorWidth, perColorHeight);

                ctx.fillStyle = `#${invertHex(color.slice(1), true)}`;

                ctx.fillText(color,perColorWidth+xPos-(perColorWidth/2)-(ctx.measureText(color).width/2),yPos+perColorHeight-10);
            })

            ctx.font = `11px 'Trebuchet MS'`;
            ctx.fillStyle = `#${invertHex(this.colors[0] || "#ffffff", true)}80`;
            ctx.fillText("thearmagan.github.io", 6, 13);
        },
        onColorInput: _.debounce(function(e){
            this.colors[e.target.getAttribute("index")] = e.target.value;
            updateColorHash();
        },100),
        onColorRemove: function (e) {
            this.colors[e.target.getAttribute("index")] = "";
            this.colors = this.colors.filter(i=>i);
            updateColorHash();
        },
        downloadCanvasImage: function() {
            this.updateCanvasColors();
            canvas.toBlob(function(blob) {
                saveAs(blob, `CPM${this.colors.length}.png`);
            });
        },
        exportPalateJSON: function() {
            prompt("The JSON palate:",`${JSON.stringify(app.colors)}`);
        },
        importPalateJSON: function() {
            let result = prompt("Put your own JSON color palate:",JSON.stringify(app.colors));
            if (result) {
                try {
                    let newJSON = JSON.parse(result);
                    app.colors = newJSON;
                    updateColorHash();
                    app.$forceUpdate();
                } catch {
                    alert("Invalid JSON.");
                }
            }
        },
        onColorBlockContextMenu: function (e) {
            let colorIndex = e.target.getAttribute("index");
            if (e.ctrlKey) {
                e.preventDefault();
                let newVal = prompt("Enter new HEX color:", app.colors[colorIndex]);
                if (isValidHex(newVal,true)) {
                    app.colors[colorIndex] = newVal;
                    app.$forceUpdate();
                }
            }
        }
    },
    watch: {
        colors: function (newVal, oldVal) {
            setTimeout(()=>{
                makeSureImageBlocksDraggable();
            },10);
        }
    },
    mounted: function () {
        canvas = document.querySelector("canvas");
        canvas.width = window.innerWidth;
        canvas.height = 96;
        ctx = canvas.getContext("2d");

        let hashParams = parseSearchParams(location.hash);

        if (hashParams.colors) {
            this.colors = hashParams.colors.split(",").map(i=>`#${i}`);
        } else {
            window.location.hash = `colors=${this.colors.map(i=>i.slice(1)).join(",")}`
        }

        this.updateCanvasColors();

        setTimeout(() => {
            requestAnimationFrame(() => {
                document.body.classList.remove("hidden");
            });
        }, 10);
    }
})

function updateColorHash() {
    window.location.hash = app.colors.length == 0 ? "" : `colors=${app.colors.map(i=>i.slice(1)).join(",")}`;
}

function parseSearchParams(params="") {
    if (params.startsWith("#") || params.startsWith("?")) params = params.slice(1);
    return Object.fromEntries(params.split("&").map(i=>i.split("=",2)))
}

function makeSureImageBlocksDraggable() {
    document.querySelectorAll(".color-block:not([draggable])").forEach(makeElementDraggable);
}

function makeElementDraggable(element) {
    if (element.getAttribute("draggable") == "true") return;

    element.setAttribute("draggable","true");

    element.addEventListener("dragstart",(e)=>{
        element.classList.add("dragging");
    });

    element.addEventListener("dragend",(e)=>{
        setTimeout(()=>{element.classList.remove("dragging")},10);
    });

    element.addEventListener("dragover", (e)=>{e.preventDefault();});
    element.addEventListener("dragenter", (e)=>{e.preventDefault();});
    element.addEventListener("drop",(e)=>{
        let draggingElement = document.querySelector(".dragging");
        let dragIndex = parseInt(draggingElement.getAttribute("index"));
        let targetIndex = parseInt(element.getAttribute("index"));
        
        let dragColor = `${app.colors[dragIndex]}`;
        let targetColor = `${app.colors[targetIndex]}`;

        app.colors[dragIndex] = targetColor;
        app.colors[targetIndex] = dragColor;

        app.$forceUpdate();
        updateColorHash();
    });
}

function isValidHex(hex,hashRequired){
    return RegExp(`^#${hashRequired ? "" : "?"}[0-9abcdef]{6}$`,"i").test(hex)
}

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