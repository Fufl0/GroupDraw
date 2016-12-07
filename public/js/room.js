// Enter your clientside JavaScript code for the single room page here

// You are allowed to use the code you produced during midterm 1 (app.js) instead
// of the following skeleton code

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const app = {
    strokeStyle: 'black',
    isDrawing: false,
    history: [],

    socket: io(),
    // get id fron url
    id: window.location.pathname.split('/')[2],

    // will be overwritten by brushes
    draw: function() {},

    clearCanvas: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /**
     * Takes an array of arrays of lineSegments
     * and draws them on canvas
     * @param history
     */
    replayHistory: function(history) {
        history.forEach(this.drawLine.bind(this));
    },

    /**
     * Takes an array of lineSegments that form a path
     * and draws them on canvas
     * @param lineSegs
     */
    drawLine: function(lineSegs) {
        if (lineSegs.length == 0) return;
        this.ctx.beginPath();
        this.selectBrush(lineSegs[0].brushName);
        lineSegs.forEach(seg => {
            this.draw(seg.strokeStyle, seg.x, seg.y);
        });
        this.ctx.closePath();
    },

    clearHandler: function(e, no) {
        this.clearCanvas();
        this.history = [];
        if (!no)
            this.socket.emit("clear", this.id);
    },

    paletteHandler: function(e) {
        if (!e.target.classList.contains('p-color')) return;
        this.strokeStyle = e.target.dataset.color;
        // console.log(e.target.dataset.color);
    },

    // TODO
    rgbPickerHandler: function(e) {
        // if (!e.target.classList.contains('p-color')) return;
        // this.strokeStyle = e.target.dataset.color;
        // console.log("hai premuto rgbpicker");
        let rgbInsertedColor = document.getElementById('rgb').value;
        this.strokeStyle = this.colorHexToRgb(rgbInsertedColor);


    },

    colorHexToRgb: function(color) {
        if (color.length = 6) {
            let red = color.substr(0, 2);
            red = parseInt(red, 16);
            // console.log("red: " + red);
            let green = color.substr(2, 2);
            // console.log("b4 green: ", green);
            green = parseInt(green, 16);
            // console.log("green: " + green);
            let blue = color.substr(4, 2);
            blue = parseInt(blue, 16);
            // console.log("blue: " + blue);
            return "rgb(" + red + ", " + green + ", " + blue + ")";

        }
    },

    setupBrushes: function() {
        const brushToolbar = document.getElementById('brush-toolbar');
        this.brushes = window.brushes;

        // extend disc brush
        const randomDiscBrush = Object.create(this.brushes[1]);
        randomDiscBrush.name = "Random Disc";
        randomDiscBrush.getRadius = function() {
                return getRandomInt(10, 30)
            },
            randomDiscBrush.getOpacity = function() {
                return Math.random()
            },

            this.brushes.push(randomDiscBrush);

        // extend star brush
        const randomStarBrush = Object.create(this.brushes[2]);
        randomStarBrush.name = "Random Star";
        randomStarBrush.getOptions = function() {
            return {
                length: 15,
                angle: getRandomInt(0, 180),
                width: getRandomInt(1, 10),
                opacity: Math.random(),
                scale: getRandomInt(1, 20) / 10,
                color: ('rgb(' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ')')
            }
        };

        this.brushes.push(randomStarBrush);

        //add brush buttons
        this.brushes.forEach(b => {
            const btn = document.createElement('BUTTON');
            btn.id = b.name;
            btn.textContent = b.name;
            btn.addEventListener('click', this.brushHandler.bind(this));
            brushToolbar.appendChild(btn)
        });
    },

    getBrushByName: function(brushName) {
        const brush = this.brushes.find(b => {
            return b.name === brushName;
        });

        return brush;
    },

    selectBrush: function(brushName) {
        const brush = this.getBrushByName(brushName);

        if (typeof brush === 'undefined') {
            console.log(`could not find brush ${brushName}`);
            this.draw = function(strokeStyle, x, y) {
                this.ctx.lineJoin = this.ctx.lineCap = 'round';
                this.ctx.strokeStyle = strokeStyle;
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            };
        } else {
            this.currentBrushName = brushName;
            this.draw = brush.draw.bind(brush, this.ctx);
        }
    },

    brushHandler: function(e) {
        this.selectBrush(e.currentTarget.id);
    },

    setStatus: function(status) {
        this.statusEl.innerHTML = status;
    },

    setupSocket: function() {

        let room = this;

        room.socket.on("connect", function() {
            room.socket.emit("join", room.id);
        });
        room.socket.on("clear", function() {
            room.clearHandler(null, true);
        });
        room.socket.on("draw", function(message) {
            room.history.push(message.stroke);

            room.ctx.beginPath();

            room.selectBrush(message.stroke[0].brushName);
            for (let p of message.stroke)
                room.draw(p.strokeStyle, p.x, p.y);

            room.ctx.closePath();
        });
        room.socket.on("load-history", function(message) {

            room.history = message.history;
            room.replayHistory(room.history);

        });
    },

    init: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');

        // add drawing listeners
        this.canvas.addEventListener('mousedown', e => {
            this.history.push([]);
            this.isDrawing = true;
            this.canvas.style.cursor = 'crosshair';
            this.ctx.beginPath();
            this.ctx.moveTo(e.offsetX, e.offsetY);
        });

        this.canvas.addEventListener('mousemove', e => {
            if (!this.isDrawing) return;
            const hisIdx = this.history.length - 1;
            this.history[hisIdx].push({
                brushName: this.currentBrushName,
                x: e.offsetX ,
                y: e.offsetY ,
                strokeStyle: this.strokeStyle,
            });
            this.draw(this.strokeStyle, e.offsetX, e.offsetY);
        });

        this.canvas.addEventListener('mouseup', e => {
            this.ctx.closePath();
            this.canvas.style.cursor = 'auto';
            this.isDrawing = false;
            this.socket.emit("draw", {

                stroke: this.history[this.history.length - 1]

            });
        });

        const btn = document.getElementById('clearButton');
        btn.addEventListener('click', this.clearHandler.bind(this));

        // no need to keep a reference after we add the listener
        const palette = document.getElementById('palette');
        palette.addEventListener('click', this.paletteHandler.bind(this));


        const rgbPickerButton = document.getElementById('rgbPickerButton');
        rgbPickerButton.addEventListener('click', this.rgbPickerHandler.bind(this));

        // const rgbPickerButton = document.getElementById("rgbPickerButton");
        // rgbPickerButton.addEventListener('click', function(e) {
        //    console.log("hai premuto rgbPickerButton");
        // });

        this.setupBrushes();
        this.selectBrush('Pen');

        this.setupSocket();
    }
}

app.init();
