'use strict';
const fs = require('fs');
const Canvas = require('canvas');


class EnhancedCanvas extends Canvas {
  constructor(width, height) {
    super(width, height);
    this.context = this.getContext('2d');
    this.context.lineWidth = 1;
  }

  clear(color) {
    if (color) {
      this.fill(color);
    } else {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }

  fill(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  fillBehind(color) {
    this.context.globalCompositeOperation = "destination-over";
    this.fill(color);
    this.context.globalCompositeOperation = "source-over";
  }

  strokeLine(points, strokeColor) {
    strokeColor = strokeColor || "white";
    this.context.strokeStyle = strokeColor;
    this.connectPoints(...points);
    this.context.stroke();
  }

  createFile(path) {
    if (!fs.existsSync(path)) {
      fs.closeSync(fs.openSync(path, 'w'));
    }
  }

  connectPoints(...points) {
    this.context.beginPath();
    points.forEach((point, i) => {
      if (i === 0) {
        this.context.moveTo(...point);
      } else {
        this.context.lineTo(...point);
      }
    });
    this.context.closePath();
  }

  fillCircle(context, x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, 360);
    context.closePath();
    context.fill();
  }

  getContext() {
    let ctx = super.getContext('2d');
    this._attachFillCircle(ctx);
    this._attachWriteTo(ctx);
    return ctx;
  }

  writePng(path) {
    this.createFile(path);
    let buff = this.toBuffer();
    let fd = fs.openSync(path, 'w');
    fs.writeSync(fd, buff);
    fs.closeSync(fd);
    console.log(`Saved png: ${path}`);
  }

  _attachFillCircle(context) {
    let _self = this;
    context.fillCircle = function(x, y, r) {
      _self.fillCircle(context, x, y, r);
    };
  }

  _attachWriteTo(context) {
    let _self = this;
    context.writePng = function(path) {
      _self.writePng(path);
    };
  }
}

module.exports = EnhancedCanvas;
