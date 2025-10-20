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
// let visitorName = localStorage.getItem("ss_visitorName") || "";
localStorage.removeItem("ss_visitorName");
visitorName = "";
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
drawBtn.addEventListener("click", () => {
if (draws[visitorName]) {
alert("You already drew: " + draws[visitorName]);
return;
}

// Random eligible pool
const pool = Object.keys(PARTICIPANTS).filter(
nick => nick !== visitorName && !Object.values(draws).includes(nick)
);

if (pool.length === 0) {
alert("No eligible recipients left!");
return;
}

// Start animation
animationArea.classList.remove("d-none");
resultArea.classList.add("d-none");

setTimeout(() => {
const choice = pool[Math.floor(Math.random() * pool.length)];
draws[visitorName] = choice;
saveState();

animationArea.classList.add("d-none");
resultArea.classList.remove("d-none");
recipientNameEl.textContent = PARTICIPANTS[choice] || choice;

document.body.classList.add("drawn");
drawBtn.classList.add("d-none"); // hide draw button after drawing

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
