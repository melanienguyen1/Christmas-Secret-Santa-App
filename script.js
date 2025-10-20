// 🎅 Secret Santa Fair Draw System
const PARTICIPANTS = {
  "Nickel": "Nicol",
  "Ash Cash": "Ashley",
  "Alfren": "Allison",
  "Meth": "Melanie",
  "Keem": "Jacquelyn",
  "Ren": "Karen"
};

// DOM Elements
const welcomeScreen = document.getElementById("welcome-screen");
const drawScreen = document.getElementById("draw-screen");
const visitorNameInput = document.getElementById("visitor-name");
const continueBtn = document.getElementById("continue-btn");
const drawBtn = document.getElementById("draw-btn");
const playerNameDisplay = document.getElementById("player-name-display");
const animationArea = document.getElementById("animation-area");
const resultArea = document.getElementById("result-area");
const recipientNameEl = document.getElementById("recipient-name");
const hideResultBtn = document.getElementById("hide-result");
const resetAllBtn = document.getElementById("reset-all");
const bgMusic = document.getElementById("bg-music");

// Local storage state
let draws = JSON.parse(localStorage.getItem("ss_draws")) || {};
// let visitorName = localStorage.getItem("ss_visitorName") || "";
localStorage.removeItem("ss_visitorName");
visitorName = "";
let musicAllowed = localStorage.getItem("ss_musicAllowed") === "true";

function saveState() {
  localStorage.setItem("ss_draws", JSON.stringify(draws));
  localStorage.setItem("ss_visitorName", visitorName);
  localStorage.setItem("ss_musicAllowed", musicAllowed);
}

function showScreen(name) {
  welcomeScreen.classList.add("d-none");
  drawScreen.classList.add("d-none");

  if (name === "welcome") welcomeScreen.classList.remove("d-none");
  if (name === "draw") {
    drawScreen.classList.remove("d-none");
    if (visitorName) playerNameDisplay.textContent = visitorName;
  }
}

// Normalize nickname capitalization
function normalizeName(name) {
  return name.trim().toLowerCase();
}

// Generate a perfect derangement (no self-draws)
function generateDerangement(names) {
  let recipients;
  do {
    recipients = [...names].sort(() => Math.random() - 0.5);
  } while (recipients.some((r, i) => r === names[i]));
  const result = {};
  names.forEach((name, i) => result[name] = recipients[i]);
  return result;
}

// Welcome screen
continueBtn.addEventListener("click", async () => {
  const val = visitorNameInput.value.trim();
  const match = Object.keys(PARTICIPANTS).find(nick => normalizeName(nick) === normalizeName(val));

  if (!match) {
    alert("Enter a valid nickname.");
    return;
  }

  visitorName = match;
  saveState();

  showScreen("draw");

  try {
    await bgMusic.play();
  } catch (e) {
    console.log("Music autoplay blocked until user interacts", e);
  }
});

// Draw button logic
drawBtn.addEventListener("click", () => {
  // Create derangement once (on first draw)
  if (Object.keys(draws).length === 0) {
    const names = Object.keys(PARTICIPANTS);
    draws = generateDerangement(names);
    saveState();
  }

  // Show the assigned recipient
  const recipient = draws[visitorName];
  if (!recipient) {
    alert("No match found. Please reset and try again.");
    return;
  }

  animationArea.classList.remove("d-none");
  resultArea.classList.add("d-none");

  setTimeout(() => {
    animationArea.classList.add("d-none");
    resultArea.classList.remove("d-none");
    recipientNameEl.textContent = recipient;
    document.body.classList.add("drawn");
    confetti();
  }, 1500);
});

hideResultBtn.addEventListener("click", () => {
  resultArea.classList.add("d-none");
});

resetAllBtn.addEventListener("click", () => {
  if (confirm("Reset all draws?")) {
    draws = {};
    saveState();
    location.reload();
  }
});

// Confetti effect
function confetti() {
  const duration = 2000;
  const end = Date.now() + duration;
  (function frame() {
    const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"];
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.style.position = "fixed";
      div.style.width = "8px";
      div.style.height = "8px";
      div.style.background = colors[Math.floor(Math.random() * colors.length)];
      div.style.top = Math.random() * window.innerHeight + "px";
      div.style.left = Math.random() * window.innerWidth + "px";
      div.style.borderRadius = "50%";
      div.style.zIndex = 9999;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 1000);
    }
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Snowflake animation
function createSnowflakes(num = 150) {
  const snowContainer = document.querySelector(".snow");
  for (let i = 0; i < num; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.textContent = "❄";
    flake.style.left = Math.random() * window.innerWidth + "px";
    flake.style.fontSize = 12 + Math.random() * 16 + "px";
    flake.style.opacity = 0.5 + Math.random() * 0.5;
    flake.style.top = Math.random() * -window.innerHeight + "px";
    const fallDuration = 10 + Math.random() * 15;
    const swayDuration = 3 + Math.random() * 5;
    const delay = Math.random() * 15;
    flake.style.animation = `fallSway ${fallDuration}s linear ${delay}s infinite`;
    snowContainer.appendChild(flake);
  }
}
createSnowflakes();

// Auto music resume
if (musicAllowed && bgMusic.paused) bgMusic.play().catch(() => {});
