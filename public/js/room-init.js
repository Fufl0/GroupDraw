$(document).ready(function(){
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementById('canvas'),
      x =  g.clientWidth,
      y = g.clientHeight;
  // alert($(window).width() + ' × ' + $(window).height());

  // g.width = x;
  // g.height = y;

  var size = document.getElementById('size').value.split("x");
  var canvas = document.getElementById('canvas');
  canvas.width = size[0]
  canvas.height = size[1]

  $('.modal').modal();
 });

document.getElementById('sizeSetterButton').onclick=function(){
  var size = document.getElementById('size').value.split("x");
  var canvas = document.getElementById('canvas');
  canvas.width = size[0]
  canvas.height = size[1]
};
