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
    bet(10);
});

/*----- functions -----*/

init();
function init() { 
    dealerArea.style.animation = "none"
    playerArea.style.animation = "none"
    playerArea.style.borderColor = "black";
    dealerArea.style.borderColor = "black";
    hitButton.disabled = true;
    standButton.disabled = true;
    playerHand = [];
    dealerHand = [];
    gameOver = "";
    playerScore = 0;
    dealerScore = 0;
    dealerBalance = 0;
    message.innerText = "PLACE BET TO START GAME";
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
    playerScoreDisplay.textContent = `Score: ${playerScore}`;
	dealerScoreDisplay.textContent = `Score: ${dealerScore}`;
    console.log("Dealer hand: ", dealerHand);
    console.log("player hand is: ", playerHand);
    console.log("player total is: ", calculateHand(playerHand))
    console.log("dealer total is: ", calculateHand(dealerHand))
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
        console.log("Bust! Dealer wins.");
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
        playerBalance += 20;
        console.log("Dealer busts! You win!");
        message.innerText = "Dealer busts! You win!";
        
    } else if (dealerScore > playerScore) {
        dealerWinColor();
        loseAudio.play();
        console.log("dealer wins!");
        message.innerText = "Dealer wins!";
		
    } else if (dealerScore < playerScore) {
        winColor();
        winAudio.play();
        playerBalance += 20;
        console.log("you win!");
        message.innerText = "You win!";
    } else {
        tieAudio.play();
        playerBalance += 10;
        console.log("Push! Its a tie.");
        message.innerText = "Push! Its a tie.";
    }
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
        console.log("Not enough cash to place this bet.")
        return;
    } else {
        betAudio.play();
        message.innerText = "Game in progress";
        playerBalance -= bet;
        console.log(`Bet of ${bet} placed successfully. Remaining balance: ${playerBalance}`);
    }

    if (isBlackjack(playerHand)) {
        winAudio.play();
        winColor();
        console.log("blackjack");
        message.innerText = "Blackjack! You win!";
        gameOver = true;
        playerBalance += bet*2;
	}
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
    playerArea.style.animation = "flash .2s linear infinite";
    
}

function dealerWinColor() {
    dealerArea.style.animation = "flash .2s linear infinite"; 
}