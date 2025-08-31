const query = (sel) => document.querySelector(sel);
const queryAll = (sel) => document.querySelectorAll(sel);

const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: query("#score_points"),
  },
  cardSprites: {
    avatar: query("#card-image"),
    name: query("#card-name"),
    type: query("#card-type"),
  },
  fieldCards: {
    player: query("#player-field-card"),
    computer: query("#computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    player1BOX: query("#player-cards"),
    computer: "computer-cards",
    computerBOX: query("#computer-cards"),
  },
  actions: {
    button: query("#next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissor",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", String(idCard));
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }
  return cardImage;
}

function setCardsField(cardId) {
  removeAllCardsImages();

  const playerCardId = Number(cardId);
  const computerCardId = getRandomCardId();

  ShowHiddenCardFieldsImages(true);
  hiddenCardDetails();
  drawCardsInField(playerCardId, computerCardId);

  const duelResults = checkDuelResults(playerCardId, computerCardId);
  updateScore();
  drawButton(duelResults);
}

function drawCardsInField(cardId, computerCardId) {
  const playerCard = cardData[cardId];
  const compCard = cardData[computerCardId];
  if (!playerCard || !compCard) return;

  if (state.fieldCards.player) state.fieldCards.player.src = playerCard.img;
  if (state.fieldCards.computer) state.fieldCards.computer.src = compCard.img;
}

function ShowHiddenCardFieldsImages(value) {
  const display = value ? "block" : "none";
  if (state.fieldCards.player) state.fieldCards.player.style.display = display;
  if (state.fieldCards.computer) state.fieldCards.computer.style.display = display;
}

function hiddenCardDetails() {
  if (state.cardSprites.avatar) state.cardSprites.avatar.src = "";
  if (state.cardSprites.name) state.cardSprites.name.innerText = "";
  if (state.cardSprites.type) state.cardSprites.type.innerText = "";
}

function drawButton(text) {
  if (!state.actions.button) return;
  state.actions.button.innerText = String(text).toUpperCase();
  state.actions.button.style.display = "block";
}

function updateScore() {
  if (!state.score.scoreBox) return;
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "draw";
  const playerCard = cardData[playerCardId];
  if (!playerCard) return duelResults;

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win";
    state.score.playerScore++;
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "lose";
    state.score.computerScore++;
  }

  playAudio(duelResults);
  return duelResults;
}

function removeAllCardsImages() {
  const { player1BOX, computerBOX } = state.playerSides;

  if (computerBOX) {
    queryAll("#computer-cards img").forEach((img) => img.remove());
  }
  if (player1BOX) {
    queryAll("#player-cards img").forEach((img) => img.remove());
  }
}

function drawSelectCard(index) {
  const card = cardData[index];
  if (!card) return;
  if (state.cardSprites.avatar) state.cardSprites.avatar.src = card.img;
  if (state.cardSprites.name) state.cardSprites.name.innerText = card.name;
  if (state.cardSprites.type) state.cardSprites.type.innerText = "Attribute : " + card.type;
}

function drawCards(cardNumbers, fieldSide) {
  const box = document.getElementById(fieldSide);
  if (!box) return;

  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = getRandomCardId();
    const cardImage = createCardImage(randomIdCard, fieldSide);
    box.appendChild(cardImage);
  }
}

function resetDuel() {
  if (state.cardSprites.avatar) state.cardSprites.avatar.src = "";
  if (state.actions.button) state.actions.button.style.display = "none";
  ShowHiddenCardFieldsImages(false);
  init();
}

function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play().catch(() => {});
}

function init() {
  ShowHiddenCardFieldsImages(false);
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

  const bgm = query("#bgm");
  if (bgm && typeof bgm.play === "function") {
    bgm.play().catch(() => {});
  }
}

window.resetDuel = resetDuel;

init();
