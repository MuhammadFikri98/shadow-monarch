document.addEventListener("DOMContentLoaded", () => {
  const leaderboardList = document.getElementById("leaderboard");
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  console.log("Data leaderboard di localStorage:", leaderboard); // Debugging

  leaderboardList.innerHTML = "";

  if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
    leaderboardList.innerHTML =
      "<li class='empty-score'>There are no scores yet</li>";
    return;
  }

  leaderboard.forEach((entry, index) => {
    if (entry.name && typeof entry.score === "number") {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="name">${entry.name}</span>
      <span class="score">${entry.score} Points</span>
    `;

      leaderboardList.appendChild(listItem);
    } else {
      console.error("Data leaderboard rusak:", entry);
    }
  });
});
