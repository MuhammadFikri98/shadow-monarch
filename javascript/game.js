const gameBoard = document.getElementById("game-board");
const timer = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
let timeLeft = 15;
let score = 0;
let cards = [];
let flippedCards = [];

const images = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
  "image6.jpg",
];
const gameImages = [...images, ...images];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(gameImages);
  gameImages.forEach((imgSrc) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgSrc;

    const img = document.createElement("img");
    img.src = `images/${imgSrc}`;
    card.appendChild(img);

    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
    cards.push(card);
  });
}

function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
    this.classList.add("flipped");
    flippedCards.push(this);
  }

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.image === card2.dataset.image) {
    score += 10;
    scoreDisplay.textContent = score;
    flippedCards = [];

    if (document.querySelectorAll(".card.flipped").length === cards.length) {
      setTimeout(resetGame, 1000);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 250);
  }
}

function resetGame() {
  gameBoard.innerHTML = "";
  cards = [];
  flippedCards = [];
  createBoard();
}

function startTimer() {
  const interval = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(interval);
      endGame();
    }
  }, 1000);
}

function endGame() {
  // Tampilkan modal input nama
  document.getElementById("final-score").textContent = score;
  document.getElementById("score-modal").style.display = "flex";
}

// Simpan skor setelah input nama
function saveScore() {
  const playerName = document.getElementById("player-name").value.trim();
  if (!playerName) return alert("Nama tidak boleh kosong!");

  if (playerName.length > 15) {
    return alert("Nama tidak boleh lebih dari 15 karakter!");
  }

  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Jika leaderboard bukan array objek, reset ke array kosong
  if (
    !Array.isArray(leaderboard) ||
    !leaderboard.every((entry) => typeof entry === "object")
  ) {
    leaderboard = [];
  }

  // Pastikan format data benar sebelum disimpan
  const newEntry = { name: playerName, score: Number(score) };
  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5); // Simpan hanya 5 skor tertinggi

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  console.log(
    "Leaderboard setelah update:",
    JSON.parse(localStorage.getItem("leaderboard"))
  );

  window.location.href = "score.html";
}

createBoard();
startTimer();
