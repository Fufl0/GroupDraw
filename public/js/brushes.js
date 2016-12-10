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

  // const discBrush = {
  //   name : 'Disc',
  //   getRadius: function(){ return 15; },
  //   getOpacity: function(){ return 1; },
  //   draw : function (ctx, strokeStyle, x, y, r){
  //     if (!r) r = 10;
  //     //check values
  //     let opacity = this.getOpacity();
  //     opacity = within(opacity, 0, 1);
  //     let radius = this.getRadius();
  //     radius = within (radius, 10, 30);
  //
  //     //do the actual drawing
  //     ctx.lineJoin = ctx.lineCap = 'round';
  //     ctx.fillStyle = strokeStyle;
  //     ctx.beginPath();
  //     ctx.globalAlpha = opacity;
  //     ctx.arc(x, y, radius, false, Math.PI * 2, false);
  //     ctx.fill();
  //
  //     // restore opacity.
  //     ctx.globalAlpha = 1;
  //   }
  // };

    const lineVerticalBrush = {
            name : "Vertical Line",

            draw : function (ctx, strokeStyle, x, y, radius){
              let r = radius/5;

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
                // ctx.rotate((Math.PI * 3 ));
                // ctx.rotate(180);
                ctx.lineTo(0, -(r/2));
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }

        };

    const lineHorizontalBrush = {
        name : "Horizonal Line",

        draw : function (ctx, strokeStyle, x, y, radius){
            let r = radius/5;

            //do the actual drawing
            ctx.lineJoin = 'miter';
            ctx.lineCap = 'butt';
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.scale(r, r);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = Math.ceil(r/10);
            ctx.lineTo((r/2), 0);
            // ctx.rotate((Math.PI * 3 ));
            // ctx.rotate(180);
            ctx.lineTo(-(r/2), 0);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

    };


    // const lineRightBrush = {
    //     name : "left turned Line",
    //     getOptions: function (r){
    //         return {
    //             length: r,
    //             scale: r,
    //             width: 1,
    //         }
    //     },
    //     draw : function (ctx, strokeStyle, x, y, r){
    //
    //         //check values
    //         let options = this.getOptions(r);
    //         options = sanityCheckOptionsStarBrush(options);
    //
    //         //do the actual drawing
    //         ctx.lineJoin = 'miter';
    //         ctx.lineCap = 'butt';
    //         ctx.save();
    //         ctx.translate(x, y);
    //         ctx.beginPath();
    //         ctx.scale(options.scale, options.scale);
    //         ctx.strokeStyle = options.color || strokeStyle;
    //         ctx.lineWidth = options.width;
    //         ctx.lineTo(0, -(options.length/2))
    //         // ctx.rotate((Math.PI * 3 ));
    //         ctx.rotate(180);
    //         ctx.lineTo(0, (options.length/2));
    //         ctx.closePath();
    //         ctx.stroke();
    //         ctx.restore();
    //     }
    //
    // };

    // const lineLeftBrush = {
    //     name : "left turned Line",
    //     getOptions: function (r){
    //         return {
    //             length: r,
    //             scale: r,
    //             width: 1,
    //         }
    //     },
    //     draw : function (ctx, strokeStyle, x, y, r){
    //
    //         //check values
    //         let options = this.getOptions(r);
    //         options = sanityCheckOptionsStarBrush(options);
    //
    //         //do the actual drawing
    //         ctx.lineJoin = 'miter';
    //         ctx.lineCap = 'butt';
    //         ctx.save();
    //         ctx.translate(x, y);
    //         ctx.beginPath();
    //         ctx.scale(options.scale, options.scale);
    //         ctx.strokeStyle = options.color || strokeStyle;
    //         ctx.lineWidth = options.width;
    //         ctx.lineTo(0, 0);
    //         // ctx.rotate((Math.PI * 3 ));
    //         ctx.rotate(-180);
    //         ctx.lineTo(0, options.length);
    //         ctx.closePath();
    //         ctx.stroke();
    //         ctx.restore();
    //     }
    //
    // };



    const squareBrush = {
        name : "Square",
        draw : function(ctx, strokeStyle, x, y, r) {

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
      for (var i = 5; i--;) {
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

  // window.brushes = [penBrush, discBrush, starBrush];
  window.brushes = [penBrush, lineVerticalBrush, lineHorizontalBrush, starBrush];
})();
