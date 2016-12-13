// const Trianglify = require('trianglify');

// var pattern = Trianglify({
//     width: window.innerWidth,
//     height: window.innerHeight
// });
//
// document.body.appendChild(pattern.canvas())


function addTriangleTo(target) {
    var dimensions = target.getClientRects()[0];
    var pattern = Trianglify({
      width: window.innerWidth,
      height: window.innerHeight,
      x_colors: 'random'
    });
    target.style['background-image'] = 'url(' + pattern.png() + ')';
}

addTriangleTo(document.body)
