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
    undohistory: [],

    socket: io(),

    id: window.location.pathname.split('/')[2],

    // will be overwritten by brushes
    draw: function() {},


    clearCanvas: function(clearButton) {
        if (clearButton) this.canvasColor = "rgb(255, 255, 255)";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.colorWholeCanvas();
    },

    replayHistory: function(history) {
        history.forEach(this.drawLine.bind(this));
    },

    drawLine: function(lineSegs) {
        if (lineSegs.length == 0) return;
        this.ctx.beginPath();
        this.selectBrush(lineSegs[0].brushName);

        lineSegs.forEach(seg => {
            this.draw(seg.strokeStyle, seg.x, seg.y, seg.brushSize);
        });

        this.ctx.closePath();
    },

    setCanvasSize : function (e, no, s) {
        if (s) {
            this.canvasSize = s;
        }
        else if (document.getElementById('size').value.split("x").length !== 0) {
            let h = document.getElementById('size').value.split("x")[0];
            let w = document.getElementById('size').value.split("x")[1];
            if ((parseInt(h) == "NaN") || (parseInt(h) < 0) || (parseInt(w) == "NaN") || (parseInt(w) < 0)){
                return;
            }
            this.canvasSize = parseInt(h) + "x" + parseInt(w);
        }
        else this.canvasSize =  "1024x680";


        this.canvas.setAttribute("width", this.canvasSize.split("x")[0]);
        this.canvas.setAttribute("height", this.canvasSize.split("x")[1]);
        document.getElementById('size').value = this.canvasSize;
        this.clearCanvas();
        this.colorWholeCanvas();
        this.replayHistory(this.history);

        if (!no) {
            this.socket.emit("size", {
                size : this.canvasSize,
            });
        }

    },

    clearHandler: function(e, no) {
        this.canvasColor = "rgb(255, 255, 255)";
        this.clearCanvas(true);
        this.history = [];
        this.undohistory = [];
        if (!no)
            this.socket.emit("clear", this.id);
    },

    undoHandler: function(e, no) {
        if (!this.history.length) return;
        this.undohistory.push(this.history.pop());
        this.clearCanvas();
        this.replayHistory(this.history);
        if (!no) {
            this.socket.emit("undo")
        }
    },

    redoHandler: function (e, no) {
        if (!this.undohistory.length) return;
        this.history.push(this.undohistory.pop());
        this.clearCanvas();
        this.replayHistory(this.history);
        if (!no) {
            this.socket.emit("redo");
        }
    },


    changeCanvasColor : function () {
        this.canvasColor = this.strokeStyle;
        this.fillCanvas();
    },


    fillCanvas : function (e, no) {
        this.colorWholeCanvas();
        this.replayHistory(this.history);
        if (!no) {
            this.socket.emit("fill", {
                canvasColor : this.canvasColor
            })
        }
    },


    colorWholeCanvas : function () {
        // console.log("colorWholeCanvas function: ", this.canvasColor);
        this.ctx.lineJoin = this.ctx.lineCap = 'miter';
        this.ctx.strokeStyle = this.canvasColor;
        this.ctx.lineWidth = 100;
        this.ctx.fillStyle = this.canvasColor;
        this.ctx.rect(0, 0, this.canvas.getAttribute("width"), this.canvas.getAttribute("height"));
        this.ctx.fill();
        this.ctx.stroke();
    },



    paletteHandler: function(e) {
        if (!e.target.classList.contains('p-color')) return;
        this.strokeStyle = e.target.dataset.color;
        let rgbcolor = e.target.dataset.color.substr(4, (e.target.dataset.color.length - 5));
        document.getElementById("color").value = this.colorRgbToHex(rgbcolor);
    },

    changeBrushSize: function () {
        this.brushSize = document.getElementById("sizeSlider").value;
        document.getElementById('Size-title').innerHTML = 'Size : ' + this.brushSize;
    },


    rgbPickerHandler: function() {
        let rgbInsertedColor = document.getElementById('color').value;
        // if (rgbInsertedColor.length = 7)
            this.strokeStyle = this.colorHexToRgb(rgbInsertedColor);
    },

    colorHexToRgb: function(color) {
        if (color.length != 7) {
            console.log("Invalid color");
            document.getElementById('color').value = "not valid";
            return;
        }


        let red = color.substr(1, 2);
        red = parseInt(red, 16);

        let green = color.substr(3, 2);
        green = parseInt(green, 16);

        let blue = color.substr(5, 2);
        blue = parseInt(blue, 16);

        return "rgb(" + red + ", " + green + ", " + blue + ")";
    },


    colorRgbToHex: function(color) {
        let rgbs = color.split(",");

        let red = rgbs[0];
        red = parseInt(red).toString(16).slice(-2);
        if (red.length < 2) red = "0" + red;

        let green = rgbs[1].substring(1);
        green = parseInt(green).toString(16).slice(-2);
        if (green.length < 2) green = "0" + green;

        let blue = rgbs[2].substring(1);
        blue = parseInt(blue).toString(16).slice(-2);
        if (blue.length < 2) blue = "0" + blue;

        return ("#" + red + green + blue);
    },


    setupBrushes: function() {
        const brushToolbar = document.getElementById('brush-toolbar');
        this.brushes = window.brushes;

        //add brush buttons
        this.brushes.forEach(b => {
            const btn = document.createElement('BUTTON');
            btn.id = b.name;
            btn.textContent = b.name;
            btn.className = "btn btn-small waves-effect waves-light light-blue";
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

    setupSocket: function() {

        let room = this;

        room.socket.on("connect", function() {
            room.socket.emit("join", room.id);
        });
        room.socket.on("clear", function() {
            room.canvasColor = "rgb(0, 0, 0)";
            room.clearHandler(null, true);
        });
        room.socket.on("draw", function(message) {
            let beforeDrawBrush = room.currentBrushName;
            room.history.push(message.stroke);
            room.ctx.beginPath();
            room.selectBrush(message.stroke[0].brushName);
            for (let p of message.stroke)
                room.draw(p.strokeStyle, p.x, p.y, p.brushSize);

            room.ctx.closePath();
            room.selectBrush(beforeDrawBrush);

        });

        room.socket.on("load", function(message) {
            room.canvasColor = message.canvasColor;
            room.history = message.history;
            room.undohistory = message.undohistory;
            room.setCanvasSize(null, true, message.size);


        });

        room.socket.on("undo", function() {
            room.undohistory.push(room.history.pop());
            room.clearCanvas();
            room.colorWholeCanvas();
            room.replayHistory(room.history);
        });

        room.socket.on("redo", function() {
            console.log("sono in redo dalla socket");
            room.redoHandler(null, true);
        });

        room.socket.on("fill", function (message) {
            room.canvasColor = message.canvasColor;
            room.clearCanvas();
            room.fillCanvas(null, true);
        });

        room.socket.on("size", function (message) {
            room.setCanvasSize(null, true, message.size);

        });
    },


    mouseDownFn : function (e) {
        this.history.push([]);
        this.isDrawing = true;
        this.canvas.style.cursor = 'crosshair';
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);

        if (!this.isDrawing) return;
        const hisIdx = this.history.length - 1;
        this.history[hisIdx].push({
            brushName: this.currentBrushName,
            x: e.offsetX ,
            y: e.offsetY ,
            strokeStyle: this.strokeStyle,
            brushSize: this.brushSize
        });
        this.draw(this.strokeStyle, e.offsetX, e.offsetY, this.brushSize);
    },


    mouseMoveFn : function (e) {
        if (!this.isDrawing) return;
        const hisIdx = this.history.length - 1;
        this.history[hisIdx].push({
            brushName: this.currentBrushName,
            x: e.offsetX ,
            y: e.offsetY ,
            strokeStyle: this.strokeStyle,
            brushSize: this.brushSize
        });
        this.draw(this.strokeStyle, e.offsetX, e.offsetY, this.brushSize);
    },


    mouseUpFn : function (e) {
        if (this.isDrawing) {
            this.ctx.closePath();
            this.canvas.style.cursor = 'auto';
            this.isDrawing = false;
            this.socket.emit("draw", {
                stroke: this.history[this.history.length - 1]
            });
        }
    },

    init: function() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.brushSize = document.getElementById("sizeSlider").value;
        // this.changeBrushSize();
        // this.setCanvasSize(null, true, undefined, this.canvasColor);


        // add drawing listeners
        this.canvas.addEventListener('mousedown', this.mouseDownFn.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMoveFn.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUpFn.bind(this));
        this.canvas.addEventListener('mouseout', this.mouseUpFn.bind(this));


        const sizeSetterButton = document.getElementById('sizeSetterButton');
        sizeSetterButton.addEventListener('click', this.setCanvasSize.bind(this));

        const palette = document.getElementById('palette');
        palette.addEventListener('click', this.paletteHandler.bind(this));

        const rgbTextField = document.getElementById("color");
        rgbTextField.addEventListener("click", function() {
            // console.log("hai clickato");
            if (!((rgbTextField.value.length == 7) && (rgbTextField.value[0] == "#")))
            rgbTextField.value = "#";
        });

        const rgbPickerButton = document.getElementById('rgbPickerButton');
        rgbPickerButton.addEventListener('click', this.rgbPickerHandler.bind(this));

        const sizeSlider = document.getElementById('sizeSlider');
        sizeSlider.addEventListener('mousedown', this.changeBrushSize.bind(this));
        sizeSlider.addEventListener('mousemove', this.changeBrushSize.bind(this));
        sizeSlider.addEventListener('mouseup', this.changeBrushSize.bind(this));

        // undo, redo and brush size
        const undoButton = document.getElementById('undoButton');
        undoButton.addEventListener('click', this.undoHandler.bind(this));

        const redoButton = document.getElementById('redoButton');
        redoButton.addEventListener('click', this.redoHandler.bind(this));

        const clearButton = document.getElementById('clearButton');
        clearButton.addEventListener('click', this.clearHandler.bind(this));

        const fillButton = document.getElementById('fillButton');
        fillButton.addEventListener('mouseup', this.changeCanvasColor.bind(this));

        this.setupBrushes();
        this.selectBrush('Pen');

        this.setupSocket();
    }
};

app.init();
