let isPlaying = false;
let player;
let obstacle;
let score = 0;
let gameSound;
let gameInterval;
let obstacleInterval;
let obstacleSpeed = 10;
let obstacleCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    player = document.getElementById('player');
    obstacle = document.getElementById('obstacle');
    gameSound = document.getElementById('gameSound');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const scoreDisplay = document.getElementById('score');

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);

    document.addEventListener('mousemove', (e) => {
        const gameRect = document.getElementById('gameArea').getBoundingClientRect();
        let newLeft = e.clientX - gameRect.left;

        if (newLeft < 0) newLeft = 0;
        if (newLeft + player.clientWidth > gameRect.width) newLeft = gameRect.width - player.clientWidth;

        player.style.left = `${newLeft}px`;
    });

    function startGame() {
        if (isPlaying) return;
        console.log('Iniciando o jogo');
        const messageDisplay = document.getElementById('message');
        isPlaying = true;
        score = 0;
        obstacleSpeed = 10;
        obstacleCount = 0;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        gameSound.play();
        messageDisplay.style.display = 'none';

        obstacle.style.top = '0px';
        obstacle.style.left = `${Math.random() * 100}%`;

        gameInterval = setInterval(updateGame, 20);
        obstacleInterval = setInterval(moveObstacle, 100);

        startButton.style.display = 'none';
        restartButton.style.display = 'none';
    }

    function moveObstacle() {
        const rect = obstacle.getBoundingClientRect();
        const gameRect = document.getElementById('gameArea').getBoundingClientRect();
        let top = parseInt(obstacle.style.top);

        if (top > gameRect.height) {
            score++;
            scoreDisplay.textContent = `Pontuação: ${score}`;

            obstacle.style.top = '0px';
            obstacle.style.left = `${Math.random() * 100}%`;

            obstacleCount++;

            if (obstacleCount % 4 === 0) {
                obstacleSpeed += 2;
            }
        } else {
            obstacle.style.top = `${top + obstacleSpeed}px`;
        }
    }

    function updateGame() {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        if (isCollision(playerRect, obstacleRect)) {
            endGame();
        }
    }

    function isCollision(rect1, rect2) {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(obstacleInterval);
        isPlaying = false;
        gameSound.pause();
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('restartButton').style.display = 'block';

        const messageDisplay = document.getElementById('message');
        const highScore = localStorage.getItem('highScore') || 0;
        if (score > highScore) {
            localStorage.setItem('highScore', score);
            messageDisplay.textContent = `Novo Recorde: ${score}`;
        } else {
            messageDisplay.textContent = `Game Over! Sua Pontuação: ${score}`;
        }
        messageDisplay.style.display = 'block';
    }

    function restartGame() {
        startGame();
    }

    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
        scoreDisplay.textContent = `Pontuação: ${score} | Recorde: ${savedHighScore}`;
    }
});