const gameBoard = document.getElementById("game-board");
const timer = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
let timeLeft = 30;
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
    playFlipSound(); // Mainkan suara saat kartu dibalik
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

    // Tambahkan efek menyala pada kartu yang sudah cocok
    card1.classList.add("matched");
    card2.classList.add("matched");

    flippedCards = [];

    // Cek apakah semua kartu telah dicocokkan
    if (document.querySelectorAll(".card.matched").length === cards.length) {
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
  // Kosongkan papan permainan
  gameBoard.innerHTML = "";
  cards = [];
  flippedCards = [];

  // Acak ulang kartu
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
  document.getElementById("final-score").textContent = score;
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Cek apakah skor masuk top 5 leaderboard
  const isTop5 =
    leaderboard.length < 5 || score > leaderboard[leaderboard.length - 1].score;

  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = `
    <h2>${isTop5 ? "Well Done!" : "Game Over"}</h2>
    <p>Your Score: <span id="final-score">${score}</span></p>
    ${
      isTop5
        ? '<input type="text" id="player-name" placeholder="Input your name" />' +
          '<button onclick="saveScore()">Save</button>'
        : '<button id="try-again-btn">Try Again</button>'
    }
  `;

  document.getElementById("score-modal").style.display = "flex";

  // Tambahkan event listener ke tombol "Try Again" jika tidak masuk top 5
  if (!isTop5) {
    document
      .getElementById("try-again-btn")
      .addEventListener("click", restartGame);
  }
}

function restartGame() {
  // Sembunyikan modal skor
  document.getElementById("score-modal").style.display = "none";

  // Reset skor dan waktu
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timer.textContent = timeLeft;

  // Kosongkan papan permainan dan buat ulang
  gameBoard.innerHTML = "";
  cards = [];
  flippedCards = [];
  createBoard();

  // Mulai ulang timer
  startTimer();
}

// Simpan skor setelah input nama
function saveScore() {
  const playerName = document.getElementById("player-name").value.trim();
  if (!playerName) return alert("Name cannot be empty!");

  if (playerName.length > 15) {
    return alert("Name must not be more than 15 characters!");
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

const flipSound = new Audio("sound-transition.mp3"); //

function playFlipSound() {
  flipSound.currentTime = 0; // Restart suara jika sudah dimainkan sebelumnya
  flipSound.play();
}

createBoard();
startTimer();
