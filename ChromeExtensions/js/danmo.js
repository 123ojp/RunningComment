'use strict';
var isActive
var css = `
#canvas_danmo{
    pointer-events: none;
    position: fixed;
    z-index: 1000;
    top: 0px;
    background-color: #fff0;
    left: 0px;
    width: 100vw;
    height: 100vh;
}
`;
let style = document.createElement("style");
style.textContent = css;
var canvas = document.createElement("canvas");
canvas.id = "canvas_danmo";
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
document.getElementsByTagName("head")[0].appendChild(style);
document.body.append(canvas);
var context = canvas.getContext("2d");
context.fillStyle = "#1e87ff";
context.font = "60px Arial";
context.strokeStyle = "#000000";
var text = [];

class Text{
  constructor(text, color){
      this.text = text;
      this.color = color;
      this.x = canvas.width;
      this.y = random(60, canvas.height - 12);
      this.width = context.measureText(this.text);
  }

  update(){
      this.x-=8;
      context.fillStyle = this.color;
      context.fillText(this.text, this.x, this.y);
      context.strokeText(this.text, this.x, this.y);
      if(this.x < -this.text.width){
          text.shift(1);
      }
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor(){
  let r = random(70, 255).toString(16).padStart(2, "0");
  let g = random(70, 255).toString(16).padStart(2, "0");
  let b = random(70, 255).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (text.length > 0) {
    text.forEach(t => {
      t.update();
    });
  }
  requestAnimationFrame(update);
}
requestAnimationFrame(update);
