const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls div")

let gameOver = false;
let foodX = 0, foodY = 0;
let snakeX= 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Cambios de Posición del alimento
const changeFoodPosition = () => {
    // Posibles valores aleatorios entre 0 y 30 para ubicar aleatoriamente la comida del gusano
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Funcion para controlar mediante el teclado el movimiento del gusano
const changeDirection = (e) => {
    if (e.key ==="ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key ==="ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key ==="ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key ==="ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    };
};

controls.forEach( key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}))
})

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over - Presiona OK para reinicializar");
    location.reload();
}

// Inicializar juego, posiciona el primer alimento
const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food
    " style="grid-area: ${foodY} / ${foodX};"></div>`;

    // Verificar si el gusano comio el alimento
    if(snakeX === foodX && snakeY === foodY ) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        console.log(snakeBody);
        score++;
        highScore = score > highScore ? score : highScore
        localStorage.setItem("high-score", highScore)
        scoreElement.innerText = `Score: ${score}`
        highScoreElement.innerText = `High Score: ${highScore}`
    }

    for (let index = snakeBody.length -1; index > 0; index--) {
        // Indicando los valores posteriors del cuerpo del gusano
        snakeBody[index] = snakeBody[index-1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    // Verificando que la cabeza del gusano este dentro de los limites
    if (snakeX < 0 || snakeX > 30 || snakeY < 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let index = 0; index < snakeBody.length; index++) {
        // Agregando un div por cada parte del gusano
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[index][1]} / ${snakeBody[index][0]};"></div>`;
        if( index !== 0 && snakeBody[0][1] === snakeBody[index][1] && snakeBody[0][0] === snakeBody[index][0]) {
            gameOver = true;
        }
    }

    


    playBoard.innerHTML = htmlMarkup;
};
//PROGRAMA PRINCIPAL
// Se llaman a las funciones del juego
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

//LECTOR DE VENTOS
// Se crea el lector de eventos de soltar la tecla para movel al gusano
document.addEventListener("keydown", changeDirection);