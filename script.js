const bird = document.getElementById("bird");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");


let birdTop = 200;
let birdVelocity = 0;
let gravity = 0.2;
let score = 0;
let highScore = 0; // Highest score variable
let gameInterval;
let pipeInterval;
let pipes = [];
const gapHeight = 150; // Height of the gap between pipes
const minPipeHeight = 50; // Minimum height for pipes
const maxPipeHeight = 300; // Maximum height for pipes


function startGame() {
    highScore = parseInt(localStorage.getItem("highScore")) || 0; // Load high score from localStorage
    gameInterval = setInterval(gameLoop, 17);
    pipeInterval = setInterval(createPipe, 2000); // Spawn pipes every 2 seconds
    document.addEventListener("keydown", jump);
    updateScore();
}


function gameLoop() {
    birdVelocity += gravity;
    birdTop += birdVelocity;
    bird.style.top = birdTop + "px";


    // Collision with ground or ceiling
    if (birdTop <= 0 || birdTop + bird.offsetHeight >= gameArea.offsetHeight) {
        endGame();
    }


    // Move pipes
    pipes.forEach(pipe => movePipe(pipe));


    // Update score
    updateScore();
}


function jump() {
    birdVelocity = -6;
}


function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    const bottomPipeHeight = gameArea.offsetHeight - pipeHeight - gapHeight;


    // Check for overlapping pipes
    let overlap = false;
    for (let i = 0; i < pipes.length; i++) {
        const existingPipe = pipes[i];
        const existingTopHeight = parseInt(existingPipe.topPipe.style.height);
        const existingBottomHeight = parseInt(existingPipe.bottomPipe.style.height);


        // Check for vertical overlap
        if (
            (pipeHeight < existingTopHeight && existingTopHeight - pipeHeight < gapHeight) ||
            (bottomPipeHeight < existingBottomHeight && existingBottomHeight - bottomPipeHeight < gapHeight)
        ) {
            overlap = true;
            break; // Exit the loop if there's an overlap
        }
    }


    // If there's an overlap, try creating the pipe again
    if (overlap) {
        return; // Exit the function to prevent current pipe creation
    }


    // Create top pipe
    const topPipe = document.createElement("div");
    topPipe.classList.add("pipe");
    topPipe.style.height = pipeHeight + "px";
    topPipe.style.top = "0";
    topPipe.style.left = gameArea.offsetWidth + "px"; // Start at the right edge of the game area
    gameArea.appendChild(topPipe);


    // Create bottom pipe
    const bottomPipe = document.createElement("div");
    bottomPipe.classList.add("pipe");
    bottomPipe.style.height = bottomPipeHeight + "px";
    bottomPipe.style.top = pipeHeight + gapHeight + "px"; // Position below the gap
    bottomPipe.style.left = gameArea.offsetWidth + "px"; // Same position to align with top pipe
    gameArea.appendChild(bottomPipe);


    pipes.push({ topPipe, bottomPipe });
}


function movePipe(pipe) {
    const pipeSpeed = 2;
    pipe.topPipe.style.left = pipe.topPipe.offsetLeft - pipeSpeed + "px";
    pipe.bottomPipe.style.left = pipe.bottomPipe.offsetLeft - pipeSpeed + "px";


    // Remove pipes that have moved out of view
    if (pipe.topPipe.offsetLeft + pipe.topPipe.offsetWidth < 0) {
        pipe.topPipe.remove();
        pipe.bottomPipe.remove();
        pipes.shift();
        score++;
    }


    // Check collision with pipes
    if (isColliding(bird, pipe.topPipe) || isColliding(bird, pipe.bottomPipe)) {
        endGame();
    }
}


function isColliding(bird, pipe) {
    const birdRect = bird.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();
    return !(
        birdRect.top > pipeRect.bottom ||
        birdRect.bottom < pipeRect.top ||
        birdRect.left > pipeRect.right ||
        birdRect.right < pipeRect.left
    );
}


function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
    document.getElementById("highScore").textContent = "High Score: " + highScore; // Update highest score display
}


function endGame() {
    clearInterval(gameInterval);
    clearInterval(pipeInterval); // Stop spawning pipes
    document.removeEventListener("keydown", jump);


    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score; // Set new high score
        localStorage.setItem("highScore", highScore);
    }


    alert("Game Over! Your score is " + score + ". Your highest score is " + highScore);
    resetGame();
}


function resetGame() {
    birdTop = 200;
    birdVelocity = 0;
    score = 0;
    pipes.forEach(pipe => {
        pipe.topPipe.remove();
        pipe.bottomPipe.remove();
    });
    pipes = [];
    scoreDisplay.textContent = "Score: 0";
    startGame();
}


startGame();