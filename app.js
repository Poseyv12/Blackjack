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
    console.log("player hand is: ", playerHand)
    console.log("player total is: ", calculateHand(playerHand))
}

function hit() {
    console.log("hit");
    render();
    drawCard(playerHand)
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
    drawCard(playerHand)
    drawCard(playerHand)
    render()

}


function drawCard(hand) {
    // generate a random index between 0 and the length of the deck array
    let randomIndex = Math.floor(Math.random() * deck.length);
    // select a random card from the deck based on random index generated
    let card = deck[randomIndex];
      // add card to hand
      hand.push(card);
      // take card out of the deck
    deck.splice(randomIndex, 1);
    console.log("card dealt ", card );
}

function calculateHand(hand) {
    let sum = 0;
    let aces = 0;
  
// Retrieve the card value from the values array using the current card as the index, 
// and store it in a variable called cardValue.
// If the cardValue is equal to 11, increment the variable aces.
// Add the cardValue to a running total called sum.
    for (let i = 0; i < hand.length; i++) {
     const cardValue = values[hand[i]];
        if (cardValue === 11) {
            aces++;
        }
        sum += cardValue;
    }
  
// While there are still aces in the hand and the current sum of the hand is greater than 21:
// Subtract 10 from the current sum.
// Decrement the number of aces by 1.
    while (aces > 0 && sum > 21) {
        sum -= 10;
        aces--;
    }
  return sum;
}

