const canvas = document.getElementById('root');
const canvasCtx = canvas.getContext('2d');

const WIDTH = 20;
const SQUARE_SIZE = 30;

canvas.width = WIDTH * SQUARE_SIZE;
canvas.height = canvas.width;

const fixY = (y, height) => height - y;

// Maps locations from squarespace to pixel space
const squareToPixelSpace = (squarePos, square_size) => {
  const {x, y} = squarePos;
  return {
    x: x * square_size,
    y: fixY(y*square_size, WIDTH * SQUARE_SIZE),
  };
};

// Maps locations from math to square space.
const mathToSquareSpace = (mathPos, origin, square_step) => {
  const x = mathPos.x / square_step + origin.x;
  const y = mathPos.y / square_step + origin.y;
  return {x, y};
};

const mathToPixel = (mathPos, origin, square_step, square_size) => {
  return squareToPixelSpace(mathToSquareSpace(mathPos, origin, square_step), square_size);
};

// Plots a function.
const plotFunction = (context, originPos, start, end, f, spacing, square_step, sampling_freq) => {
  const points = [];
  for(let x = start; x < end; x += sampling_freq) {
    const y = f(x);
    points.push({x, y});
  }

  points.forEach((point) => {
    let {x, y} = mathToPixel(point, originPos, square_step, spacing);
    context.lineTo(x, y);
    context.moveTo(x, y);
  });
};

const createHorizontalLines = (context, start, end, spacing, width) => {
  for(let y = start; y <= end; y += spacing) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
};


const createVerticalLines = (context, start, end, spacing, height) => {
  for(let x = start; x <= end; x += spacing) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
};
const twoPow = (x) => Math.sin(x);

const createAxis = (context, spacing, width, height) => {
  context.strokeStyle = 'rgb(255, 255, 255)';
  const middleWidth = width / 2.0;
  const middleHeight = height / 2.0;

  context.moveTo(0, middleHeight);
  context.lineTo(width, middleHeight);

  context.moveTo(middleWidth, 0);
  context.lineTo(middleWidth, height);
};

const createGrid = (context, squares, squareSide) => {
  const width = squares * squareSide;
  const height = squares * squareSide;
  context.lineWidth = 1;
  context.fillStyle = 'rgb(0, 0, 0)';
  context.fillRect(0, 0, width, height);
  context.beginPath();
  context.strokeStyle = 'rgb(128, 128, 128)';
  createVerticalLines(context, 0, width, squareSide, height);
  createHorizontalLines(context, 0, height, squareSide, width);
  context.stroke();
  context.beginPath();
  createAxis(context, squareSide, width, height);
  context.stroke();
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = 'rgb(255, 100, 0)';
  plotFunction(context, {x: squares / 2, y: squares / 2}, -6*Math.PI, 6*Math.PI, twoPow, SQUARE_SIZE, 1, 0.05);
  context.stroke();
};

function updateCanvas(context) {
  createGrid(context, WIDTH, SQUARE_SIZE);
  requestAnimationFrame(() => {
    updateCanvas(context);
  });
}

function init() {
  updateCanvas(canvasCtx);
}
init();
