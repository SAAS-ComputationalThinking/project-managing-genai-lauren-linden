//constants (canvas is like the page where you can add graphics and animations). ctx stands for context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

const birdy=new Image();
birdy.src='flappybird.png';
const flfloor=new Image();
flfloor.src='flappyfloor.png';
const bg = new Image();
bg.src = 'flappybg.png';
let bg1x=0;
let bgheight=8.5/10 * canvas.height;
let bgwidth= bgheight*5/3;
const pipe = new Image()
pipe.src='pipe.png';
const pipe2 = new Image()
pipe2.src='pipe2.png';

// Game variables
var x=0;
let birdX = 50;
let birdY = canvas.height / 3;
let gravity = 0.1;
let velocity = 0;
let gameOver = false; 
let pipes = [];
const birdHitWidth=10;
const birdHitHeight=10;
const birdWidth=21;
const floorHeight= Math.floor(8/10*canvas.height);
const birdHeight=12;
const pipeGap = 40; // Gap between upper and lower pipes
const pipeWidth = 30;
const pipetopwidth = 40;
const pipetopheight = 20
const pipeColor = 'green';
const pipeSpeed = 1.5;
const pipeInterval = 70; // Interval between pipes
var frameCount=0
var score=0

// main game loop
function gameLoop() {
    bgheight=Math.floor(8.1/10 * canvas.height);
    bgwidth= Math.floor(bgheight*5/3);
    if (!gameOver) { // Check if the game is not over
        velocity += gravity;
        birdY += velocity;

        // Check if bird hits the bottom of the canvas
        if (birdY+birdHeight >= floorHeight) { // Adjusted for the bird's height
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
        n=1+Math.ceil(canvas.width/bgwidth)
        for (let i=0; i<n; i++){
            ctx.drawImage(bg, Math.floor(bg1x+i*bgwidth-bgwidth), 0, bgwidth, bgheight);
        }
        if (!gameOver) bg1x=(bg1x-0.25+bgwidth)%(bgwidth);
        console.log(bg1x);

        ctx.save();
        ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2);
        ctx.rotate(velocity/4);
        ctx.drawImage(birdy, -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight);
        ctx.restore();

        //ctx.fillRect(birdX+birdWidth/2-birdHitWidth/2,birdY+birdHeight/2-birdHitHeight/2,birdHitWidth,birdHitHeight) hitbox
        // Draw pipes
        pipes.forEach(pipe => {
            if (!gameOver) pipe.update();
            pipe.draw();
            if (pipe.newPass(birdX)) score+=1;
        });

        ctx.drawImage(flfloor,Math.floor(x+canvas.width),Math.floor(floorHeight),canvas.width,canvas.width*1/5)
        ctx.drawImage(flfloor,Math.floor(x),Math.floor(floorHeight),canvas.width,canvas.width*1/5)
        x=(x-pipeSpeed)%canvas.width;

        // Create bird
        //ctx.fillStyle = 'yellow';
        //ctx.fillRect(birdX, birdY, 10, 8); // Adjusted for the bird's size
        


        // Spawn pipes
        if (frameCount % pipeInterval === 0) {
            pipes.push(new Pipe());
        }

        // Remove offscreen pipes
        pipes = pipes.filter(pipe => !pipe.offscreen());

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(score, canvas.width / 2 - 5, canvas.height / 2 - 40);

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
        //ctx.fillRect(this.x+4, 0, pipeWidth-8, this.gapY); // hitbox
        ctx.drawImage(pipe2, this.x-(pipetopwidth-pipeWidth)/2, this.gapY-100, pipetopwidth, 100);
        // Lower pipe
        //ctx.fillRect(this.x+4, this.gapY + pipeGap, pipeWidth-8, canvas.height - (this.gapY + pipeGap)); // hitbox
        ctx.drawImage(pipe, this.x-(pipetopwidth-pipeWidth)/2, this.gapY + pipeGap, pipetopwidth, 100);
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
            birdx + birdWidth/2+birdHitWidth/2 >= this.x+4 && // Adjusted for bird's size
            birdx + birdWidth/2-birdHitWidth/2<= this.x + pipeWidth-8 &&
            (birdy+birdHeight/2-birdHitHeight/2 < this.gapY || birdy + birdHeight/2 + birdHitHeight/2 > this.gapY + pipeGap) // Adjusted for bird's size
        );
    }
}

// Start the game loop
gameLoop();
