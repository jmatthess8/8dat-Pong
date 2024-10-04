const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Audio setup (use .wav files)
const hitSound = new Audio('sounds/hit.wav');
const scoreSound = new Audio('sounds/score.wav');
const bgMusic = new Audio('sounds/bg-music.wav');

// Set music to loop
bgMusic.loop = true;
bgMusic.volume = 0.5;

// Game variables
let isGameRunning = false;
const paddleHeight = 80;
const paddleWidth = 10;
const ballRadius = 10;
let playerScore = 0;
let aiScore = 0;
const winningScore = 5;

// Paddle positions
let playerPaddleY = (canvas.height - paddleHeight) / 2;
let aiPaddleY = (canvas.height - paddleHeight) / 2;

// Ball position and speed
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
const initialBallSpeed = 5;
let ballSpeedX = initialBallSpeed;  // Constant speed
let ballSpeedY = initialBallSpeed;

// Player movement control
let upPressed = false;
let downPressed = false;

// Start button to initiate the game
document.getElementById('startBtn').addEventListener('click', function () {
  isGameRunning = true;
  playerScore = 0;
  aiScore = 0;
  bgMusic.play();  // Start background music
  resetBall();
  gameLoop();  // Start the game loop when the button is clicked
});

// Handle keydown events for player control
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowUp') {
    upPressed = true;
  }
  if (event.key === 'ArrowDown') {
    downPressed = true;
  }
});

// Handle keyup events to stop player movement
document.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowUp') {
    upPressed = false;
  }
  if (event.key === 'ArrowDown') {
    downPressed = false;
  }
});

// Draw paddles with rainbow gradient
function drawPaddle(x, y) {
  const gradient = context.createLinearGradient(0, y, 0, y + paddleHeight);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(0.2, 'orange');
  gradient.addColorStop(0.4, 'yellow');
  gradient.addColorStop(0.6, 'green');
  gradient.addColorStop(0.8, 'blue');
  gradient.addColorStop(1, 'violet');
  context.fillStyle = gradient;
  context.fillRect(x, y, paddleWidth, paddleHeight);
}

// Draw the ball (8-ball)
function drawBall() {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = 'black';
  context.fill();
  context.closePath();

  context.fillStyle = 'white';
  context.font = '16px Arial';
  context.fillText('8', ballX - 6, ballY + 5);
}

// Draw the score
function drawScore() {
  context.font = '24px Arial';
  context.fillStyle = 'white';
  context.fillText('Player: ' + playerScore, 50, 30);
  context.fillText('AI: ' + aiScore, canvas.width - 100, 30);
}

// Reset the ball to the center and keep speed constant
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -initialBallSpeed;  // Always spawn the ball toward the player
  ballSpeedY = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);  // Randomize Y direction
}

// Update game objects (ball, paddles)
function updateGame() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Collision detection with top and bottom walls
  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;  // Reverse ball direction on Y-axis
  }

  // Collision with player paddle
  if (ballX - ballRadius < paddleWidth) {
    if (ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
      ballSpeedX = -ballSpeedX;  // Bounce the ball back
      hitSound.play();  // Play hit sound
    } else if (ballX - ballRadius < 0) {
      aiScore++;  // AI scores
      scoreSound.play();  // Play score sound
      if (aiScore >= winningScore) {
        alert('AI Wins!');
        isGameRunning = false;
        return;
      }
      resetBall();  // Reset ball after a score
    }
  }

  // Collision with AI paddle
  if (ballX + ballRadius > canvas.width - paddleWidth) {
    if (ballY > aiPaddleY && ballY < aiPaddleY + paddleHeight) {
      ballSpeedX = -ballSpeedX;  // Bounce the ball back
      hitSound.play();  // Play hit sound
    } else if (ballX + ballRadius > canvas.width) {
      playerScore++;  // Player scores
      scoreSound.play();  // Play score sound
      if (playerScore >= winningScore) {
        alert('Player Wins!');
        isGameRunning = false;
        return;
      }
      resetBall();  // Reset ball after a score
    }
  }

  // AI paddle movement (react slower)
  const aiSpeed = 3;  // Slower AI speed
  if (ballX > canvas.width / 2) {  // Only move AI when ball is past halfway
    if (ballY > aiPaddleY + paddleHeight / 2) {
      aiPaddleY += aiSpeed;
    } else if (ballY < aiPaddleY + paddleHeight / 2) {
      aiPaddleY -= aiSpeed;
    }
  }

  // Player paddle movement
  if (upPressed && playerPaddleY > 0) {
    playerPaddleY -= 5;
  } else if (downPressed && playerPaddleY < canvas.height - paddleHeight) {
    playerPaddleY += 5;
  }
}

// Main game loop
function gameLoop() {
  if (isGameRunning) {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles, ball, and score
    drawPaddle(0, playerPaddleY);  // Player paddle
    drawPaddle(canvas.width - paddleWidth, aiPaddleY);  // AI paddle
    drawBall();  // Ball
    drawScore();  // Score

    // Update game objects
    updateGame();

    // Call the game loop again
    requestAnimationFrame(gameLoop);
  }
}
