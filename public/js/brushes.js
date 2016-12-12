// DON'T MODIFY THIS FILE

// this is an immediately-invoked function expression (IIFE)
(function(){

    const penBrush = {
        name: 'Pen',
        draw: function(ctx, strokeStyle, x, y, r){
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = r;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const crossBrush = {
        name : "Cross",

        draw : function (ctx, strokeStyle, x, y, r){
            let l = r / Math.PI;

            //do the actual drawing
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'butt';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.scale(l, l);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = Math.ceil(l/10);
            ctx.lineTo(0, l);
            ctx.lineTo(0, -l);
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.lineTo(l, 0);
            ctx.lineTo(-l, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    };


    const squareBrush = {
        name : "Square",
        draw : function (ctx, strokeStyle, x, y, r) {
            let l = r * Math.PI;
            ctx.lineJoin = 'mitter';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            // ctx.scale(r);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = r/4;
            ctx.lineTo(-l, l);
            ctx.lineTo(l, l);
            ctx.lineTo(l, -l);
            ctx.lineTo(-l, -l);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

        }
    };


    const circleBrush = {
        name : "Circle",
        draw : function (ctx, strokeStyle, x, y, r) {
            let l = r * Math.PI;
            ctx.lineJoin = 'mitter';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = r/4;
            ctx.arc(0, 0, l, 0, 360, false);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

        }
    };

    const triangularBrush = {
        name : "Triangle",
        draw : function (ctx, strokeStyle, x, y, r) {
            let l = r * 2 * Math.PI;

            ctx.lineJoin = 'mitter';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = r/4;
            ctx.lineTo(0, -l/2);
            ctx.lineTo(-l/2, (l/2)*(Math.sqrt(3)-1));
            ctx.lineTo(l/2, (l/2)*(Math.sqrt(3)-1));
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    };

    const starBrush = {
        name : 'Star',

        draw : function (ctx, strokeStyle, x, y, r){
            let l = r * Math.PI;
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'butt';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.rotate(Math.PI / 180);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = r/4;
            for (let i = 5; i--;) {
                ctx.lineTo(0, l);
                ctx.translate(0, l);
                ctx.rotate((Math.PI * 2 / 10));
                ctx.lineTo(0, -l);
                ctx.translate(0, -l);
                ctx.rotate(-(Math.PI * 6 / 10));
            }
            ctx.lineTo(0, l);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    };

    const FillCanvas = {
        name : 'FillCanvas',
        draw : function (ctx, strokeStyle, w, h) {
            ctx.lineJoin = ctx.lineCap = 'miter';
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 1;
            ctx.fillStyle = strokeStyle;
            ctx.rect(0, 0, w, h);
            ctx.fill ();
            ctx.stroke();
        }
    };

    window.brushes = [penBrush, circleBrush, triangularBrush, squareBrush, starBrush, crossBrush];
    window.fillCanvas = [FillCanvas];
})();
