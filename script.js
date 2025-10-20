/* 🎄 Secret Santa Draw Script – Fixed + Enhanced */

// Nickname mapping (for display)
const PARTICIPANTS = {
"nickel": "Nicol",
"ash cash": "Ashley",
"alfren": "Allison",
"meth": "Melanie",
"keem": "Jacquelyn",
"ren": "Karen"
};

// Get DOM elements
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
let visitorName = localStorage.getItem("ss_visitorName") || "";
let musicAllowed = localStorage.getItem("ss_musicAllowed") === "true";


// Save state
function saveState() {
localStorage.setItem("ss_draws", JSON.stringify(draws));
localStorage.setItem("ss_visitorName", visitorName);
localStorage.setItem("ss_musicAllowed", musicAllowed);
}

// Show the right screen
function showScreen(name) {
welcomeScreen.classList.add("d-none");
drawScreen.classList.add("d-none");
if (name === "welcome") welcomeScreen.classList.remove("d-none");
if (name === "draw") {
drawScreen.classList.remove("d-none");
if (visitorName) playerNameDisplay.textContent = visitorName;
}
}

// --- Continue button ---
continueBtn.addEventListener("click", async () => {
const val = visitorNameInput.value.trim().toLowerCase();

if (!PARTICIPANTS[val]) {
alert("Enter a valid nickname (check spelling).");
return;
}

visitorName = val;
saveState();
showScreen("draw");

// Start music
try {
await bgMusic.play();
musicAllowed = true;
saveState();
} catch {
console.log("Music blocked until user interaction.");
}

// If they already drew, show result immediately
if (draws[visitorName]) {
document.body.classList.add("drawn");
drawBtn.classList.add("d-none");
animationArea.classList.add("d-none");
resultArea.classList.remove("d-none");
recipientNameEl.textContent = draws[visitorName];
}
});

// --- Draw button logic ---
const drawInstruction = document.getElementById("draw-instruction");

drawBtn.addEventListener("click", () => {
  if (draws[visitorName]) return;

  let pool = Object.keys(PARTICIPANTS)
    .filter(nick => nick.toLowerCase() !== visitorName.toLowerCase() && !Object.values(draws).map(v => v.toLowerCase()).includes(nick.toLowerCase()));

  if (pool.length === 0) {
    alert("No eligible recipients left!");
    return;
  }

  animationArea.classList.remove("d-none");
  resultArea.classList.add("d-none");

  setTimeout(() => {
    const choice = pool[Math.floor(Math.random() * pool.length)];
    draws[visitorName] = choice;
    saveState();

    animationArea.classList.add("d-none");
    resultArea.classList.remove("d-none");

    recipientNameEl.textContent = choice;

    drawInstruction.style.display = "none"; // <-- hide the "click to draw" text
    drawBtn.style.display = "none";          // hide the draw button after drawing
    document.body.classList.add("drawn");

    confetti();
  }, 1500);
});

// --- Hide result ---
hideResultBtn.addEventListener("click", () => {
resultArea.classList.add("d-none");
});

// --- Reset all ---
resetAllBtn.addEventListener("click", () => {
if (confirm("Reset all draws?")) {
draws = {};
visitorName = "";
localStorage.clear();
location.reload();
}
});

// --- Confetti animation ---
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

// --- Snowflakes ---
function createSnowflakes(num = 200) {
const snowContainer = document.querySelector(".snow");
if (!snowContainer) return;

for (let i = 0; i < num; i++) {
const flake = document.createElement("div");
flake.classList.add("snowflake");
flake.textContent = "❄";

flake.style.left = Math.random() * window.innerWidth + "px";
flake.style.fontSize = 12 + Math.random() * 16 + "px";
flake.style.opacity = 0.5 + Math.random() * 0.5;
flake.style.top = Math.random() * -window.innerHeight + "px";

const fallDuration = 10 + Math.random() * 15;
const delay = Math.random() * 15;

flake.style.animation = `fallSway ${fallDuration}s linear ${delay}s infinite`;
snowContainer.appendChild(flake);

}
}

createSnowflakes();

// --- Auto music if allowed ---
if (musicAllowed && bgMusic.paused) {
bgMusic.play().catch(() => {});
}

function updateCountdown() {
  const now = new Date();
  const year = now.getFullYear();
  const xmas = new Date(`December 25, ${year} 00:00:00`);
  // If past this year's Christmas, use next year
  if (now > xmas) xmas.setFullYear(year + 1);

  const diff = xmas - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("countdown-timer").textContent =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown(); // initial call

// --- On page load, restore visitor if they already entered a name ---
window.addEventListener("DOMContentLoaded", () => {
  if (visitorName) {
    showScreen("draw");

    // Show previous draw if it exists
    if (draws[visitorName]) {
      document.body.classList.add("drawn");
      drawBtn.style.display = "none";
      drawInstruction.style.display = "none";
      animationArea.classList.add("d-none");
      resultArea.classList.remove("d-none");
      recipientNameEl.textContent = draws[visitorName];
    }

    playerNameDisplay.textContent = visitorName;

    // Play music if allowed
    if (musicAllowed && bgMusic.paused) bgMusic.play().catch(() => {});
  } else {
    showScreen("welcome");
  }
});
