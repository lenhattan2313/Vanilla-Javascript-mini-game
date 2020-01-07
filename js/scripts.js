// Challenge 1
const challengOneClick = document.querySelector("#challengOneClick");
const challengOneReset = document.querySelector("#challengOneReset");
challengOneClick.addEventListener("click", clickYearInDay);
challengOneReset.addEventListener("click", resetYearInDay);

function clickYearInDay() {
  const dayBorn = prompt("What year are you born?");
  const currentYear = new Date().getFullYear();
  const totalDays = (currentYear - dayBorn) * 365;
  const resultBox = document.querySelector(".flex-box-result");
  const text = document.createTextNode(totalDays);
  const h1 = document.createElement("h1");
  h1.setAttribute("id", "ageInDays");
  h1.appendChild(text);
  resultBox.appendChild(h1);
}
function resetYearInDay() {
  document.querySelector("#ageInDays").remove();
}

// Challenge 2:
let images = document.querySelectorAll(".image");
Object.entries(images).map(object => {
  object[1].addEventListener("click", rpsGame);
});
function rpsGame() {
  //your choice
  let humanChoice = this.id;
  console.log(typeof humanChoice);
  // robot choice
  let robotChoice = numberToChoice(randomChoice());
  // point of your choice
  let result = getPoint(humanChoice, robotChoice);
  // message
  let message = messageGame(result);
  rpsFrontEnd(humanChoice, robotChoice, message);
}

function randomChoice() {
  return Math.round(2 * Math.random());
}
function numberToChoice(number) {
  return ["rock", "paper", "scissor"][number];
}
function getPoint(humanChoice, robotChoice) {
  const pointed = {
    rock: { scissor: 1, paper: 0, rock: 0.5 },
    paper: { rock: 1, scissor: 0, paper: 0.5 },
    scissor: { paper: 1, rock: 0, scissor: 0.5 }
  };
  const humanPoint = pointed[humanChoice][robotChoice];
  const robotPoint = pointed[robotChoice][humanChoice];
  return [humanPoint, robotPoint];
}
function messageGame([humanPoint, robotPoint]) {
  if (humanPoint > robotPoint) {
    return { message: "You win!", color: "green" };
  } else if (humanPoint < robotPoint) {
    return { message: "You lose!", color: "red" };
  } else {
    return { message: "You tie!", color: "yellow" };
  }
}
function rpsFrontEnd(humanChoice, robotChoice, message) {
  const imgDataBase = {
    rock: document.querySelector("#rock").src,
    paper: document.querySelector("#paper").src,
    scissor: document.querySelector("#scissor").src
  };
  console.log(imgDataBase[humanChoice]);
  document.querySelector("#rock").remove();
  document.querySelector("#paper").remove();
  document.querySelector("#scissor").remove();
  let humanDiv = document.createElement("div");
  let robotDiv = document.createElement("div");
  let messDiv = document.createElement("div");
  humanDiv.innerHTML = `<img src="${imgDataBase[humanChoice]}" style="width: 150px;
  height: 150px; box-shadow: 0 10px 50px slateblue"/>`;
  robotDiv.innerHTML = `<img src="${imgDataBase[robotChoice]}" style="width: 150px;
  height: 150px;  box-shadow: 0 10px 50px red"/>`;
  messDiv.innerHTML = `<h1 style="${message.color}"> ${message.message} </h1>`;
  document.querySelector(".flex-box-container-2").appendChild(humanDiv);
  document.querySelector(".flex-box-container-2").appendChild(messDiv);
  document.querySelector(".flex-box-container-2").appendChild(robotDiv);
}

// Challenge 3: change color

let allButton = document.getElementsByTagName("button");
const copyAllButton = [];
for (let i = 0; i < allButton.length; i++) {
  copyAllButton.push(allButton[i].classList[1]);
}
const choiceColor = ["btn-warning", "btn-danger", "btn-primary", "btn-success"];
function changeColor(yourChoice) {
  switch (yourChoice.value) {
    case "red":
      return redColor();
    case "yellow":
      return yellowColor();
    case "reset":
      return resetColor();
    default:
      return randomColor();
  }
}
function redColor() {
  for (let i = 0; i < allButton.length; i++) {
    allButton[i].classList.remove(allButton[i].classList[1]);
    allButton[i].classList.add(choiceColor[1]);
  }
}
function yellowColor() {
  for (let i = 0; i < allButton.length; i++) {
    allButton[i].classList.remove(allButton[i].classList[1]);
    allButton[i].classList.add(choiceColor[0]);
  }
}
function randomColor() {
  for (let i = 0; i < allButton.length; i++) {
    let number = Math.floor(Math.random() * 4);
    console.log(number);
    allButton[i].classList.remove(allButton[i].classList[1]);
    allButton[i].classList.add(choiceColor[number]);
  }
}
function resetColor() {
  for (let i = 0; i < allButton.length; i++) {
    allButton[i].classList.remove(allButton[i].classList[1]);
    allButton[i].classList.add(copyAllButton[i]);
  }
}

// Challenge 4: Blackjack
let hitButton = document.querySelector("#hit-btn");
let standButton = document.querySelector("#stand-btn");
let dealButton = document.querySelector("#deal-btn");
let hitAction = hitButton.addEventListener("click", blackjackHit);
let standAction = standButton.addEventListener("click", blackjackStand);
let dealAction = dealButton.addEventListener("click", blackjackDeal);

const box = {
  your: { div: "#your-box", scoreSpan: "#your-result-blackjack", score: 0 },
  dealer: {
    div: "#dealer-box",
    scoreSpan: "#dealer-result-blackjack",
    score: 0
  },
  card: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  cardScore: {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11]
  },
  wins: 0,
  loses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false
};
const YOU = box.your;
const DEALER = box.dealer;

let hitSound = new Audio("./sounds/swish.m4a");
let winerSound = new Audio("./sounds/cash.mp3");
let lostSound = new Audio("./sounds/aww.mp3");

function blackjackHit() {
  if (box.isStand === false) {
    let card = randomCard();
    //let scoreDealer = document.querySelector(DEALER.scoreSpan).innerHTML;
    showCard(YOU, card);
    //showScore(DEALER, parseInt(scoreDealer), card);
    updateScore(YOU, card);
    showScore(YOU);
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function blackjackStand() {
  box.isStand = true;
  while (DEALER.score < 16 && box.isStand === true) {
    const card = randomCard();
    showCard(DEALER, card);
    updateScore(DEALER, card);
    showScore(DEALER);
    await sleep(1000);
  }
  box.turnsOver = true;
  showWiner(computeWiner());
}
function blackjackDeal() {
  if (box.turnsOver === true) {
    box.turnsOver = false;
    box.isStand = false;
    let yourCard = document.querySelector(YOU.div).querySelectorAll("img");
    let dealCard = document.querySelector(DEALER.div).querySelectorAll("img");
    for (let i = 0; i < yourCard.length; i++) {
      yourCard[i].remove();
    }
    for (let i = 0; i < dealCard.length; i++) {
      dealCard[i].remove();
    }
    YOU["score"] = 0;
    DEALER["score"] = 0;
    document.querySelector(YOU.scoreSpan).innerHTML = 0;
    document.querySelector(DEALER.scoreSpan).innerHTML = 0;
    document.querySelector("#blackjack-result").innerHTML = "Let's play";

    document.querySelector(DEALER.scoreSpan).style.color = "white";
    document.querySelector(YOU.scoreSpan).style.color = "white";
    document.querySelector("#blackjack-result").style.color = "black";
    console.log(box.turnsOver);
  }
}

function randomCard() {
  return box.card[Math.floor(Math.random() * 13)];
}
function showCard(activePlayer, randomCard) {
  if (activePlayer.score <= 21) {
    let yourBox = document.querySelector(activePlayer.div);
    let img = document.createElement("img");
    img.src = `./images/${randomCard}.png`;
    yourBox.appendChild(img);
    hitSound.play();
  }
}
// function showScore(activePlayer, scorePlayer, card) {
//   let currentScore = document.querySelector(activePlayer.scoreSpan);
//   if (card == "J" || card == "Q" || card == "K" || card == "A") {
//     scorePlayer += 10;
//   } else {
//     scorePlayer += card - "";
//   }
//   currentScore.innerHTML = scorePlayer;
// }
function updateScore(activePlayer, card) {
  if (card === "A") {
    if (activePlayer.score + box.cardScore[card] <= 21) {
      activePlayer.score += 11;
    } else {
      activePlayer.score += 1;
    }
  } else {
    activePlayer.score += box.cardScore[card];
  }
}
function showScore(activePlayer) {
  let scoreSpan = document.querySelector(activePlayer.scoreSpan);
  if (activePlayer.score <= 21) {
    scoreSpan.innerHTML = activePlayer.score;
  } else {
    scoreSpan.innerHTML = "BUST!";
    scoreSpan.style.color = "red";
  }
}
function computeWiner() {
  let winer;
  if (YOU.score <= 21) {
    if (YOU.score <= 21 && YOU.score > DEALER.score) {
      winer = YOU;
      box.wins++;
      console.log("You won!");
    } else if (YOU.score <= 21 && DEALER.score > 21) {
      winer = YOU;
      box.wins++;
      console.log("You won!");
    } else if (YOU.score <= 21 && YOU.score < DEALER.score) {
      winer = DEALER;
      box.loses++;
      console.log("You lost!");
    } else {
      console.log("You drew!");
      box.draws++;
    }
  } else {
    if (DEALER.score <= 21) {
      box.loses++;
      winer = DEALER;
      console.log("You lost!");
    } else {
      console.log("You drew!");
      box.draws++;
    }
  }
  return winer;
}
function showWiner(winer) {
  if (box.turnsOver === true) {
    let message = {};
    if (winer === YOU) {
      document.querySelector("#wins-table").textContent = box.wins;
      message = { text: "You won, congrats!", color: "blue" };
      winerSound.play();
      console.log(message);
    } else if (winer === DEALER) {
      document.querySelector("#loses-table").textContent = box.loses;
      message = { text: "You lost, poor!", color: "red" };
      lostSound.play();
      console.log(message);
    } else {
      document.querySelector("#draws-table").textContent = box.draws;
      message = { text: "You drew!", color: "yellow" };
      console.log(message);
    }
    document.querySelector("#blackjack-result").textContent = message.text;
    document.querySelector("#blackjack-result").style.color = message.color;
  }
}
