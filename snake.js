// Set-up colours
const CANVAS_BORDER_COLOUR = "black";
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_OUTLINE_COLOUR = "darkgreen";
const SNAKE_FILL_COLOUR = "lightgreen";
const FOOD_OUTLINE_COLOUR = "darkred";
const FOOD_FILL_COLOUR = "red";

// Find canvas and context
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");


// Set up grid

function clearCanvas(){
  ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
  ctx.strokeStyle = CANVAS_BORDER_COLOUR;
  
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}


// Initialise snake

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
]

// Initialise game state
let score = 0;
let started = false;
let speed = 100;

// Initialise movement
let dx = 0; // Horizontal speed
let dy = 0; // Vertical speed
let changingDirection = false;

// Initialise food
let foodX = 0;
let foodY = 0;


// Snake rendering
function drawSnakePart(snakePart){
  ctx.fillStyle = SNAKE_FILL_COLOUR;
  ctx.strokeStyle = SNAKE_OUTLINE_COLOUR;

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event){
  const LEFT_KEY = 65;
  const UP_KEY = 87;
  const RIGHT_KEY = 68;
  const DOWN_KEY = 83;

  if (changingDirection) return;

  changingDirection = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingLeft = dx === -10;
  const goingRight = dx === 10;

  if (keyPressed === LEFT_KEY && !goingRight){
    dx = -10;
    dy = 0;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft){
    dx = 10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown){
    dx = 0;
    dy = -10;
  }

  if (keyPressed === DOWN_KEY && !goingUp){
    dx = 0;
    dy = 10;
  }
};

function drawSnake(){
  snake.forEach(drawSnakePart);
}

function advanceSnake(){
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;

  if (didEatFood){
    score += 1;
    document.getElementById("score").innerHTML = `Score: ${score}`;
    createFood();
  }
  else {
    snake.pop();
  }
}


// Food Generation

function randomTen(min, max){
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
};

function createFood(){
  foodX = randomTen(0, gameCanvas.width - 10);
  foodY = randomTen(0, gameCanvas.height - 10);

  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake){
      createFood()
    }
  });
};

function drawFood(){
  ctx.fillStyle = FOOD_FILL_COLOUR;
  ctx.strokeStyle = FOOD_OUTLINE_COLOUR;
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}


// Game logic

function didGameEnd(){
  for (let i = 4; i < snake.length; i++){
    const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y

    if (didCollide) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > gameCanvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameCanvas.height - 10;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}


function move(){
  if (didGameEnd()) {
    started = false;
    return;
  }
  setTimeout(function onTick(){
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    move();
  }, speed);
};

function start(){
  score = 0
  dx = 10;
  dy = 0;
  snake = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
  ];
  document.getElementById("score").innerHTML = `Score: ${score}`;
  createFood();
  if (!started){
    started = true;
    move();
  }
}

clearCanvas();
document.addEventListener("keydown", changeDirection);
document.getElementById("start-button").addEventListener("click", start);


