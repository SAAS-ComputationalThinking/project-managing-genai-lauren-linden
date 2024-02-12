//constants (canvas is like the page where you can add graphics and animations). ctx stands for context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const birdy=new Image();
birdy.src='flappybird.png';
const bg = new Image();
bg.src = 'flappybg.png';
let bg1x=0;
let bg1y=0;
const pipe = new Image()
pipe.src='pipe.png';
const pipe2 = new Image()
pipe2.src='pipe2.png';

// Game variables
let birdX = 50;
let birdY = canvas.height / 3;
let gravity = 0.1;
let velocity = 0;
let gameOver = false; 
let pipes = [];
const pipeGap = 50; // Gap between upper and lower pipes
const pipeWidth = 30;
const pipetopwidth = 40;
const pipetopheight = 20
const pipeColor = 'green';
const pipeSpeed = 1;
const pipeInterval = 150; // Interval between pipes
var frameCount=0
var score=0

// main game loop
function gameLoop() {
    if (!gameOver) { // Check if the game is not over
        velocity += gravity;
        birdY += velocity;

        // Check if bird hits the bottom of the canvas
        if (birdY >= canvas.height - 8) { // Adjusted for the bird's height
            gameOver = true;
        }
        for (i=0;i<pipes.length;i++){
            if (pipes[i].hits(birdX,birdY)){
              gameOver=true;
            }
            if (gameOver)break;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.fillStyle = 'tan';
        //ctx.fillRect(0,2/3*canvas.height,canvas.width,1/3*canvas.height)

        // Draw the image on the canvas
        ctx.drawImage(bg, bg1x, bg1y, canvas.width, canvas.height);
        ctx.drawImage(bg, bg1x+canvas.width, bg1y, canvas.width, canvas.height);
        bg1x-=0.1;

        // Draw pipes
        pipes.forEach(pipe => {
            pipe.update();
            pipe.draw();
            if (pipe.newPass(birdX)) score+=1;
        });

        // Create bird
        //ctx.fillStyle = 'yellow';
        //ctx.fillRect(birdX, birdY, 10, 8); // Adjusted for the bird's size
        ctx.drawImage(birdy, birdX,birdY,30,30)


        // Spawn pipes
        if (frameCount % pipeInterval === 0) {
            pipes.push(new Pipe());
        }

        // Remove offscreen pipes
        pipes = pipes.filter(pipe => !pipe.offscreen());

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(score, canvas.width / 2 - 5, canvas.height / 2 - 50);

        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            // Display game over message and restart button
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 50, canvas.height / 2 - 10);
            ctx.font = '10px Arial';
            ctx.fillText('Click to Restart', canvas.width / 2 - 35, canvas.height / 2 + 10);
        }
        frameCount+=1
    }
}

// Function to restart the game
function restart() {
    if (gameOver) {
        score=0;
        birdY = canvas.height / 3;
        velocity = 0;
        gameOver = false;
        pipes = [];
        gameLoop(); // Restart the game loop
    }
}

// event listeners
canvas.addEventListener('click', restart);
document.addEventListener('keydown', flap);

// Function to make the bird move
function flap(event) {
    if (event.keyCode === 32) {
        event.preventDefault();
        velocity = -2; // Adjusting this controls how much it jumps
    }
}

// Pipe class
class Pipe {
    constructor() {
        this.x = canvas.width;
        this.gapY = Math.floor(Math.random() * (canvas.height - pipeGap - 130)) + 50; // Adjusted gap position
        this.passed= false;
    }

    update() {
        this.x -= pipeSpeed;
    }

    draw() {
  

        ctx.fillStyle = pipeColor;
        // Upper pipe
        ctx.drawImage(pipe2, this.x-(pipetopwidth-pipeWidth)/2, this.gapY-100, pipetopwidth, 100);
        
        //ctx.fillRect(this.x, 0, pipeWidth, this.gapY);
        //ctx.fillRect(this.x-(pipetopwidth-pipeWidth)/2, this.gapY-pipetopheight, pipetopwidth, pipetopheight);
        // Lower pipe
        ctx.drawImage(pipe, this.x-(pipetopwidth-pipeWidth)/2, this.gapY + pipeGap, pipetopwidth, 100);
        //ctx.fillRect(this.x, this.gapY + pipeGap, pipeWidth, canvas.height - (this.gapY + pipeGap));
        //ctx.fillRect(this.x-(pipetopwidth-pipeWidth)/2, this.gapY + pipeGap, pipetopwidth, pipetopheight);
    }

    offscreen() {
        return this.x < -pipeWidth;
    }

    newPass(birdx){
      if (!this.passed){
        if (this.x<birdx){
          this.passed=true;
          return true;
        }
      }
      return false;
    }

    hits(birdx,birdy) {
        return (
            birdx + 10 > this.x && // Adjusted for bird's size
            birdx < this.x + pipeWidth &&
            (birdy < this.gapY || birdy + 8 > this.gapY + pipeGap) // Adjusted for bird's size
        );
    }
}

// Start the game loop
gameLoop();
