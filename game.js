const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const scoreElement = document.getElementById("score")
const startButton = document.getElementById("startButton")
const restartButton = document.getElementById("restartButton")
const startOverlay = document.getElementById("startOverlay")
const gameOverOverlay = document.getElementById("gameOverOverlay")

const CANVAS_WIDTH = 480
const CANVAS_HEIGHT = 360
const PADDLE_WIDTH = 80
const PADDLE_HEIGHT = 10
const PADDLE_SPEED = 8
const BALL_SIZE = 20
const BALL_SPEED = 4
const BRICK_ROWS = 5
const BRICK_COLUMNS = 8
const BRICK_WIDTH = 50
const BRICK_HEIGHT = 20
const BRICK_PADDING = 10

const INSECT_EMOJIS = ["🐝", "🐞", "🦋", "🐛", "🐜", "🦗", "🕷️", "🦟"]

let paddle, ball, bricks, score, gameOver, gameStarted
const ballImage = new Image()
ballImage.src = "owl.jpg?height=20&width=20"

function initGame() {
  paddle = { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2, y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10 }
  ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
    width: BALL_SIZE,
    height: BALL_SIZE,
  }
  bricks = []
  score = 0
  gameOver = false
  gameStarted = false

  for (let c = 0; c < BRICK_COLUMNS; c++) {
    bricks[c] = []
    for (let r = 0; r < BRICK_ROWS; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 }
    }
  }

  updateScore()
}

function updateScore() {
  scoreElement.textContent = `Score: ${score}`
}

function drawBall() {
  ctx.drawImage(ballImage, ball.x - ball.width / 2, ball.y - ball.height / 2, ball.width, ball.height)
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT)
  ctx.fillStyle = "#0284c7"
  ctx.fill()
  ctx.closePath()
}

function drawBricks() {
  ctx.font = "20px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  for (let c = 0; c < BRICK_COLUMNS; c++) {
    for (let r = 0; r < BRICK_ROWS; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING + BRICK_WIDTH / 2
        const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + BRICK_HEIGHT / 2
        bricks[c][r].x = brickX - BRICK_WIDTH / 2
        bricks[c][r].y = brickY - BRICK_HEIGHT / 2
        ctx.fillText(INSECT_EMOJIS[(c + r) % INSECT_EMOJIS.length], brickX, brickY)
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < BRICK_COLUMNS; c++) {
    for (let r = 0; r < BRICK_ROWS; r++) {
      const b = bricks[c][r]
      if (b.status === 1) {
        if (
          ball.x + ball.width / 2 > b.x &&
          ball.x - ball.width / 2 < b.x + BRICK_WIDTH &&
          ball.y + ball.height / 2 > b.y &&
          ball.y - ball.height / 2 < b.y + BRICK_HEIGHT
        ) {
          ball.dy = -ball.dy
          b.status = 0
          score++
          updateScore()
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  drawBricks()
  drawBall()
  drawPaddle()

  if (ball.x + ball.dx > CANVAS_WIDTH - ball.width / 2 || ball.x + ball.dx < ball.width / 2) {
    ball.dx = -ball.dx
  }
  if (ball.y + ball.dy < ball.height / 2) {
    ball.dy = -ball.dy
  } else if (ball.y + ball.dy > CANVAS_HEIGHT - ball.height / 2) {
    gameOver = true
    gameOverOverlay.classList.remove("hidden")
    return
  }

  // Paddle collision
  if (ball.y + ball.dy > paddle.y - ball.height / 2 && ball.x > paddle.x && ball.x < paddle.x + PADDLE_WIDTH) {
    ball.dy = -ball.dy
    // Add some randomness to the ball direction
    ball.dx = 8 * ((ball.x - (paddle.x + PADDLE_WIDTH / 2)) / PADDLE_WIDTH)
  }

  collisionDetection()

  ball.x += ball.dx
  ball.y += ball.dy

  if (rightPressed && paddle.x < CANVAS_WIDTH - PADDLE_WIDTH) {
    paddle.x += PADDLE_SPEED
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= PADDLE_SPEED
  }

  if (!gameOver) {
    requestAnimationFrame(draw)
  }
}

let rightPressed = false
let leftPressed = false

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false
  }
}

function startGame() {
  initGame()
  gameStarted = true
  startOverlay.classList.add("hidden")

  if (!gameOverOverlay.classList.contains("hidden")) {
    gameOverOverlay.classList.add("hidden")
  }

  draw()
}

startButton.addEventListener("click", startGame)
restartButton.addEventListener("click", startGame)

ballImage.onload = initGame

