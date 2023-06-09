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
let playerBet = 10;
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
const betButton = document.querySelector(".bet-button");
const allInBetButton = document.getElementById("all-in-bet-button");
const playAgainButton = document.getElementById("play-again-button");
const message = document.getElementById("message");
const dealerArea = document.getElementById("dealer-area");
const playerArea = document.getElementById("player-area");

// Define game Audio
const hitAudio = new Audio("sounds/hit.wav");
const winAudio = new Audio("sounds/win.wav");
const betAudio = new Audio("sounds/bet.wav");
const loseAudio = new Audio("sounds/lose.wav");
const tieAudio = new Audio("sounds/tie.wav");

// Event listeners for buttons
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
playAgainButton.addEventListener("click", playAgain);
betButton.addEventListener("click", function(){
    bet(playerBet);
});

/*----- functions -----*/

init();
function init() { 
    //styles//
    playerCash.style.animation = "none";
    playAgainButton.style.animation ="none";
    dealerArea.style.animation = "none";
    playerArea.style.animation = "none";
    playerArea.style.borderColor = "black";
    dealerArea.style.borderColor = "black";
    hitButton.disabled = true;
    standButton.disabled = true;
    // -------- //
    playerHand = [];
    dealerHand = [];
    gameOver = "";
    playerScore = 0;
    dealerScore = 0;
    dealerBalance = 0;
    message.innerText = "PLACE BET TO START GAME";
    // rest the deck
    deck.splice(0, deck.length, "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A");
    render();
}

function render() {
    isGameOver()
    dealerScore = calculateHand(dealerHand);
    playerScore = calculateHand(playerHand);
    playerCards.innerText = playerHand;
    dealerCards.innerText = dealerHand;
    playerCash.innerText = `PLAYER BALANCE: $${playerBalance}`
    dealerCash.innerText = `POT BALANCE: $${dealerBalance}`
    playerScoreDisplay.textContent = `Score: ${playerScore}`;
	dealerScoreDisplay.textContent = `Score: ${dealerScore}`;
}

function hit() {
    //draw card
    drawCard(playerHand);
    //check for bust
    if (isBust(playerHand)) {
        loseAudio.play();
        dealerWinColor();
        gameOver = true;
        message.innerText = "Bust! Dealer wins.";
    }
    hitAudio.play();
    render();
}

function stand(){
    // Dealer draws cards until their hand value is at least 17
	while (calculateHand(dealerHand) < 17) {
		drawCard(dealerHand);
    }

    gameOver = true;
    render();

    if (isBust(dealerHand)) {
        winColor();
        winAudio.play();
        playerBalance += playerBet*2;
        message.innerText = "Dealer busts! You win!";
        
    } else if (dealerScore > playerScore) {
        dealerWinColor();
        loseAudio.play();
        message.innerText = "Dealer wins!";
		
    } else if (dealerScore < playerScore) {
        winColor();
        winAudio.play();
        playerBalance += playerBet*2;
        message.innerText = "You win!";
    } else {
        tieAudio.play();
        playerBalance += playerBet;
        message.innerText = "Push! Its a tie.";
    }
    render();
}

function playAgain() {
    init();
}

function bet(bet) {
    //deal 2 cards to player and one to the dealer
    drawCard(playerHand);
    drawCard(playerHand);
    drawCard(dealerHand);
    hitButton.disabled = false;
    standButton.disabled = false;
    //check to see if player balance is enough for bet.
    if (bet > playerBalance) {
        betButton.disabled = true;
        hitButton.disabled = true;
        standButton.disabled = true;
        message.innerText = "Not enough cash to place this bet.";
        return;
    } else {
        betAudio.play();
        message.innerText = "Game in progress";
        dealerBalance += bet*2;
        playerBalance -= bet;
    }
    // check for blackjack
    if (isBlackjack(playerHand)) {
        winAudio.play();
        winColor();
        message.innerText = "Blackjack! You win!";
        gameOver = true;
        dealerBalance -= bet*2;
        playerBalance += playerBet*2;
	}
    render()
    betButton.disabled = true;
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

// Define function to check if hand is a Blackjack
function isBlackjack(hand) {
	return hand.length === 2 && calculateHand(hand) === 21;
}

// Define function to check if hand is bust
function isBust(hand) {
	return calculateHand(hand) > 21;
}

//check if game is over
function isGameOver() {
    if (gameOver === true) {
        hitButton.disabled = true;
        standButton.disabled = true;
        betButton.disabled = true;
    } else {
        betButton.disabled = false;
    }
}

function winColor() {
    rain()
    playerCash.style.animation = "cashFlash .1s linear 20";
    playerArea.style.animation = "flash .1s linear 20";
    playAgainButton.style.animation = "buttonFlash 1s linear infinite";
    
}

function dealerWinColor() {
    dealerArea.style.animation = "flash .2s linear infinite"; 
    playAgainButton.style.animation = "buttonFlash 1s linear infinite";
}
// this function rains dollar signs each time its played
function rain() {
    let int = setInterval(function () {
        // Create a new 'i' element 
        const dollar = document.createElement("i");
        dollar.classList.add("fa", "fa-dollar", "dollar");
        // Generate a random size for the dollar icon between 10px and 60px
        const size = Math.random() * 50 + 10;
        dollar.style.fontSize = size + "px";
         // Generate a random left position for the dollar icon between 0% and 100%
        const left = Math.random() * 100 + "%";
        dollar.style.left = left;
        // Append the dollar icon to an element with a class of 'container'
        document.querySelector(".container").appendChild(dollar);
        //set animation duration
        setTimeout(function () {
            clearInterval(int)
            dollar.style.animation = "none"
            dollar.style.display = "none"
        }, 5000);
    }, 400);
}
    
