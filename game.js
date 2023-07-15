const cardList = [
    "image1.jpeg",
    "image2.jpeg",
    "image3.jpeg",
    "image4.jpeg",
    "image5.jpeg",
    "image6.jpeg",
    "image7.jpeg",
    "image8.jpeg",
    "image1.jpeg",
    "image2.jpeg",
    "image3.jpeg",
    "image4.jpeg",
    "image5.jpeg",
    "image6.jpeg",
    "image7.jpeg",
    "image8.jpeg",
    
];

const gameContainer = document.querySelector(".gameContainer");
const scoreElement = document.querySelector(".score");
const timerElement = document.querySelector(".timer");
const startBtnElement = document.querySelector(".startBtn");
const resetBtnElement = document.querySelector(".resetBtn");


const backgroundMusic = new Audio (src = "backgroundmusic.mp3");
const clickSound = new Audio (src = "click.mp3");
const winSound = new Audio (src = "winsound.mp3");
const matchSound = new Audio (src = "match.mp3");
 
document.addEventListener("DOMContentLoaded", () => {
    backgroundMusic.play();
})
resetBtnElement.style.display = "none";


let score = 0;
let timer = 60;
let isGameActive = false;
let isClickable = true;
let flippedCards = [];
let intervalId;

function shuffleCards (arr) {
    let currIndex = arr.length;
    let tempValue;
    let randomIndex;
    while (currIndex !==0) {
        randomIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;
        tempValue = arr[currIndex];
        arr[currIndex] = arr[randomIndex];
        arr[randomIndex] = tempValue;
    }
    return arr;
};

function createCards() {
    //const gameContainer = document.querySelector(".gameContainer");
    gameContainer.innerHTML = "";
    const shuffledCards = shuffleCards(cardList);

    for (let i =0; i < shuffledCards.length; i++) {
        const card = document.createElement("div");
        card.className = "cards";
        card.dataset.image = shuffledCards[i];
        card.addEventListener("click", cardClick);
        gameContainer.appendChild(card);
    }
};

function flipCard (card) {
    card.style.backgroundImage = `url(${card.dataset.image})`;
    card.style.backgroundColor = `#fff`;
    card.removeEventListener("click", cardClick);
};

function backFlipCard (card) {
    card.style.backgroundImage = "";
    card.style.backgroundColor = "rgba(127, 36, 3, 0.719)";
    card.addEventListener("click", cardClick);
};

function checkMath() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    if (card1.dataset.image === card2.dataset.image) {
        matchSound.play();
        score ++;

        card1.removeEventListener("click",cardClick);
        card2.removeEventListener("click",cardClick);
        flippedCards = [];

        if (score === 8) {
            endGame();
            winSound.play();
            displayMessage("You have Won..!!!");
            //alert("You won the game!!");
        }
        else{
            displayMessage("Match Found..!!");
        }
               
    }
    else {
        isClickable = false;
        displayMessage("Wrong Match..!!");
        setTimeout(() => {
            backFlipCard(card1);
            backFlipCard(card2);
            flippedCards = [];

            isClickable = true;

            //const gameContainer = document.querySelector(".gameContainer");
            const cards = Array.from(gameContainer.getElementsByClassName("cards"));
            const shuffledCards = shuffleCards(cards.map(card => card.dataset.image));
            cards.forEach((card,index) => {
                card.dataset.image = shuffledCards[index];
            });

        },1000);
    }
}

function cardClick() {
    if (!isClickable) return;
    if (flippedCards.length >= 2) return;

    flipCard(this);
    flippedCards.push(this);
    clickSound.play();
    

    if (flippedCards.length === 2) {
        checkMath();
    }
}

function displayMessage(message) {
    document.querySelector(".message").textContent = message;

}

function initGame() {
    displayMessage("Game has Started..!!");
    document.querySelector(".resetBtn").style.display = "block";
    if (isGameActive) return;

    score = 0;
    timer = 60;
    isClickable = true;
    flippedCards = [];

    scoreElement.textContent = score;
    timerElement.textContent = timer;

    createCards();

    intervalId = setInterval(() => {
        timer--;
        timerElement.textContent = timer;

        if (timer === 0) {
            endGame();
        }
    },1000);

    isGameActive = true;
}

function endGame() {
    clearInterval(intervalId);
    isGameActive = false;
    isClickable = false;
}

function restartGame() {
    endGame();
    //createCards();
    initGame();
    displayMessage("Game has Started..!!");
}

startBtnElement.addEventListener("click", initGame);
resetBtnElement.addEventListener("click", restartGame);

