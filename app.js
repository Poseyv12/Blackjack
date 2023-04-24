/*----- constants -----*/

// Define card deck and values
const deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const values = {2: 2,3: 3,4: 4,5: 5,6: 6,7: 7,8: 8,9: 9,10: 10,J: 10,Q: 10,K: 10,A: 11,};

/*----- state variables -----*/

// Define player and dealer hands
let playerHand
let dealerHand

// Define game state variables
let gameOver
let playerScore
let dealerScore 
let betPlaced 

let playerBalance = 100; // starting balance for the player
let dealerBalance = 0; // starting balance for the dealer

/*----- cached elements  -----*/
const dealerCash = document.getElementById('dealer-cash');
const playerCash = document.getElementById("player-cash")
const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const playerScoreDisplay = document.getElementById("player-score");
const dealerScoreDisplay = document.getElementById("dealer-score");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const betButton = document.getElementById('bet-button');
const allInBetButton = document.getElementById("all-in-bet-button")
const playAgainButton = document.getElementById("play-again-button");
const message = document.getElementById("message")

// Define game Audio

// Event listeners for buttons
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
playAgainButton.addEventListener("click", playAgain);
betButton.addEventListener("click", bet);

/*----- functions -----*/

init();
function init() { 
    playerHand = []
    dealerHand = []
    gameOver = "";
    playerScore = 0;
    dealerScore = 0;
    betPlaced = false;
    dealerBalance = 0;
    message.innerText = "PLACE BET TO START GAME";
    render();
}

function render() {
    console.log("rendered");
}

function hit() {
    console.log("hit");
    render();
    drawCard()
}

function stand(){
    console.log("stand");
    render();
}

function playAgain() {
    init();
    console.log("play again");
    render();
}

function bet() {
    drawCard()
    drawCard()
    console.log("bet")
    render()

}

function drawCard() {
    console.log(`Draw card`);
}