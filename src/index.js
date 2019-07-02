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
const plotFunction = (context, originPos, start, end, f, spacing, square_step, sampling_freq, f_color) => {
  const points = [];
  for(let x = start; x < end; x += sampling_freq) {
    const y = f(x);
    const color = f_color(y, 10);
    points.push({x, y, color});
  }

  points.forEach((point) => {
      const {color} = point;
    let {x, y} = mathToPixel(point, originPos, square_step, spacing);
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.strokeStyle = color || 'rgb(180, 0, 0)';
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

const temperatureFunc = (lastValues, constant) => {
    const resultArr = lastValues.map((el, index) => {
        if(index == 0) {
            const nextEl = lastValues[index + 1];
            const middlePoint = (nextEl.y - el.y) / 2;
            return {x: el.x, y: el.y + constant * (middlePoint)};
        }

        if(index == lastValues.length - 1) {
            const earlierEl = lastValues[index - 1];
            const middlePoint = (earlierEl.y - el.y) / 2;
            return {x: el.x, y: el.y + constant * (middlePoint)};
        }

        const earlierEl = lastValues[index - 1];
        const nextEl = lastValues[index + 1];

        const middlePointEarlier = (earlierEl.y - el.y) / 2;
        const middlePointNext = (nextEl.y - el.y) / 2;
        const totalMiddle = (middlePointEarlier + middlePointNext) / 2;
        return {x: el.x, y: el.y + constant * (totalMiddle)};
    });
    return ([(x) => {
        let closestDistance = WIDTH;
        let element = resultArr[0];
        resultArr.forEach((el) => {
            const distance = Math.abs(el.x - x);
            if(distance < closestDistance) {
                closestDistance = distance;
                element = el;
            }
        });
        if(!element) {
            return x.y;
        }

        return element.y;
    }, resultArr]);
};

// const twoPow = (x) => Math.sin(x);

const createAxis = (context, spacing, width, height) => {
  context.strokeStyle = 'rgb(255, 255, 255)';
  const middleWidth = SQUARE_SIZE;
  const middleHeight = height - SQUARE_SIZE;

  context.moveTo(0, middleHeight);
  context.lineTo(width, middleHeight);

  context.moveTo(middleWidth, 0);
  context.lineTo(middleWidth, height);
};

const initFunction = (size, start, end, maxY, minY) => {
    const elements = [];
    const spacing = (end - start) / size;
    for(let x = 0; x <= end; x += spacing) {
        const element = {
            x,
            y: Math.min(1 / (10 * x), maxY),
        };
        elements.push(element);
    }

    return elements;
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
};

const colorFunction = (y, maxY) => {
    const colorStep = 255 / maxY;
    const t = y * colorStep;
    return `rgb(${t}, 0, ${255 - t})`;
};

function updateCanvas(context, oldElems) {
    let elements = oldElems;
    if(!elements) {
        elements = initFunction(200, 0, 10, 10, 0);
    }
    const result = temperatureFunc(elements, 0.15);
    let tempFunction = result[0];
    elements = result[1];
  createGrid(context, WIDTH, SQUARE_SIZE);
  context.beginPath();
  context.lineWidth = 2;
  context.strokeStyle = 'rgb(255, 100, 0)';
  plotFunction(context, {x: 1, y: 1}, 0, 10, tempFunction, SQUARE_SIZE, 0.5, 0.1, colorFunction);
  context.stroke();
  requestAnimationFrame(() => {
    updateCanvas(context, elements);
  });
}

function init() {
  updateCanvas(canvasCtx);
}
init();
