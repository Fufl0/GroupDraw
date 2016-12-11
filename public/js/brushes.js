// DON'T MODIFY THIS FILE

// this is an immediately-invoked function expression (IIFE)
(function(){

    //makes sure that val is within min and max
    function within(val, min, max){
        if (val < min) return min;
        if (val > max) return max;
        return val;
    }

    function sanityCheckOptionsStarBrush(options){
        options.length = within(options.length, 15, 15);
        options.angle = within(options.angle, 0, 180);
        options.width = within(options.width, 1, 10);
        options.opacity = within(options.opacity, 0, 1);
        options.scale = within(options.scale, 0.1, 2);
        return options;
    }


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

        draw : function (ctx, strokeStyle, x, y, radius){
            let r = radius/4;

            //do the actual drawing
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'butt';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.scale(r, r);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = Math.ceil(r/10);
            ctx.lineTo(0, (r/2));
            ctx.lineTo(0, -(r/2));
            ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.lineTo((r/2), 0);
            ctx.lineTo(-(r/2), 0);
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
            ctx.lineTo(-l/2, l/2);
            ctx.lineTo(l/2, l/2);
            ctx.lineTo(l/2, -l/2);
            ctx.lineTo(-l/2, -l/2);
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
            let l = r * Math.PI;

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
        getOptions: function (r){
            return {
                length: 5,
                angle: 0,
                scale: r/25,
                width: 1,
            }
        },
        draw : function (ctx, strokeStyle, x, y, r){

            //check values
            let options = this.getOptions(r);
            options = sanityCheckOptionsStarBrush(options);

            //do the actual drawing
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'butt';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.rotate(Math.PI / 180 * options.angle);
            ctx.scale(options.scale, options.scale);
            ctx.strokeStyle = options.color || strokeStyle;
            ctx.lineWidth = options.width;
            for (let i = 5; i--;) {
                ctx.lineTo(0, options.length);
                ctx.translate(0, options.length);
                ctx.rotate((Math.PI * 2 / 10));
                ctx.lineTo(0, -options.length);
                ctx.translate(0, -options.length);
                ctx.rotate(-(Math.PI * 6 / 10));
            }
            ctx.lineTo(0, options.length);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    };

    window.brushes = [penBrush, circleBrush, triangularBrush, squareBrush, starBrush, crossBrush];
})();
