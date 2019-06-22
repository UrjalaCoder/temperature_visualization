const canvas = document.getElementById('root');
const canvasCtx = canvas.getContext('2d');

const WIDTH = 10;
const SQUARE_SIZE = 60;

canvas.width = WIDTH * SQUARE_SIZE;
canvas.height = canvas.width;

const fixY = (y, height) => height - y;

// Maps locations from squarespace to pixel space
const squareToPixelSpace = (squarePos, square_size) => {
  const {x, y} = squarePos;
  return {
    x: x * square_size,
    y: fixY(y*square_size, 600),
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

const squareRoot = (x) => Math.sqrt(x);
const derivative = (x) => 1 / (2 * squareRoot(x));
const TwoPow = (x) => x * x;

const createAxis = (context, spacing, width, height) => {
  context.strokeStyle = 'rgb(255, 0, 0)';
  const middleWidth = width / 2.0;
  const middleHeight = height / 2.0;

  context.moveTo(0, middleHeight);
  context.lineTo(width, middleHeight);

  context.moveTo(middleWidth, 0);
  context.lineTo(middleWidth, height);
};

const createGrid = (context, squares, squareSide) => {
  context.strokeStyle = 'rgb(0, 0, 255)';
  const width = squares * squareSide;
  const height = squares * squareSide;
  context.beginPath();
  createVerticalLines(context, 0, width, squareSide, height);
  createHorizontalLines(context, 0, height, squareSide, width);
  context.stroke();
  context.beginPath();
  createAxis(context, squareSide, width, height);
  context.stroke();
  context.beginPath();
  context.strokeStyle = 'rgb(0, 255, 0)';
  plotFunction(context, {x: 5, y: 5}, 0, 5, squareRoot, SQUARE_SIZE, 1, 0.005);
  context.stroke();
  context.beginPath();
  context.strokeStyle = 'rgb(0, 100, 255)';
  plotFunction(context, {x: 5, y: 5}, 0, 5, derivative, SQUARE_SIZE, 1, 0.005);
  context.stroke();
  context.beginPath();
  context.strokeStyle = 'rgb(255, 100, 0)';
  plotFunction(context, {x: 5, y: 5}, -5, 5, TwoPow, SQUARE_SIZE, 1, 0.005);
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
