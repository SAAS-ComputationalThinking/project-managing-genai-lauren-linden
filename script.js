//constants (canvas is like the page where you can add graphics and animations). ctx stands for context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let birdX = 50;
let birdY = canvas.height / 3;
let gravity = 0.1;
let velocity = 0;
let gameOver = false; 

// main game loop
function gameLoop() {
    if (!gameOver) { // Check if the game is not over
        velocity += gravity;
        birdY += velocity;

        // Check if bird hits the bottom of the canvas
        if (birdY >= canvas.height - 8) { // Adjusted for the bird's height
            gameOver = true;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create bird
        ctx.fillStyle = 'yellow';
        ctx.fillRect(birdX, birdY, 10, 8); // Adjusted for the bird's size

        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            // Display game over message and restart button
            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 60, canvas.height / 2 - 20);
            ctx.fillText('Click to Restart', canvas.width / 2 - 90, canvas.height / 2 + 20);
        }
    }
}


// start the game loop
gameLoop();

canvas.addEventListener('click', restart);

// Function to restart the game
function restart() {
    if (gameOver) {
        birdY = canvas.height / 3;
        velocity = 0;
        gameOver = false;
        gameLoop(); // Restart the game loop
    }
}


// event listeners
document.addEventListener('keydown', flap);

// function to make the bird move
function flap(event) {
    if (event.keyCode === 32) {
        event.preventDefault();
        velocity = -2; // adjusting this controls how much it jumps
    }
}