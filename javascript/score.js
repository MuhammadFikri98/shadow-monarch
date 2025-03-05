function restartGame() {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const leaderboardList = document.getElementById("leaderboard");
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Kosongkan leaderboard sebelum mengisi ulang
  leaderboardList.innerHTML = "";

  // Jika tidak ada skor tersimpan
  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>Belum ada skor</li>";
    return;
  }

  // Tampilkan leaderboard yang telah diperbarui
  leaderboard.forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `#${index + 1}: ${score} Poin`;
    leaderboardList.appendChild(listItem);
  });
});
