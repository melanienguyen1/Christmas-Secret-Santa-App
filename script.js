// Nicknames mapping (keys are lowercase for normalization)
const PARTICIPANTS = {
  "nickel":"Nicol",
  "ash cash":"Ashley",
  "alfren":"Allison",
  "meth":"Melanie",
  "keem":"Jacquelyn",
  "ren":"Karen"
};

// Elements
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

// Save local state
function saveState(){
  localStorage.setItem("ss_draws", JSON.stringify(draws));
  localStorage.setItem("ss_visitorName", visitorName);
  localStorage.setItem("ss_musicAllowed", musicAllowed);
}

// Show screen
function showScreen(name){
  welcomeScreen.classList.add("d-none");
  drawScreen.classList.add("d-none");

  if(name==="welcome") welcomeScreen.classList.remove("d-none");
  if(name==="draw"){
    drawScreen.classList.remove("d-none");
    if(visitorName) playerNameDisplay.textContent = visitorName;

    // If already drew, show recipient and hide draw button
    if(draws[visitorName]){
      recipientNameEl.textContent = draws[visitorName];
      resultArea.classList.remove("d-none");
      drawBtn.style.display = "none";
      document.body.classList.add("drawn");
    }
  }
}

// Normalize nickname input (trim + lowercase)
function normalizeName(name){
  return name.trim().toLowerCase();
}

// Welcome screen
continueBtn.addEventListener("click", async ()=>{
  const val = normalizeName(visitorNameInput.value);
  if(!PARTICIPANTS[val]){
    alert("Enter a valid nickname.");
    return;
  }

  visitorName = val;
  saveState();

  showScreen("draw");

  // Play music automatically
  try { await bgMusic.play(); } catch(e){ console.log("Music blocked until interaction", e); }
});

// Draw logic
drawBtn.addEventListener("click", ()=>{
  if(draws[visitorName]){
    alert("You already drew: " + draws[visitorName]);
    drawBtn.style.display = "none";
    recipientNameEl.textContent = draws[visitorName];
    resultArea.classList.remove("d-none");
    document.body.classList.add("drawn");
    return;
  }

  let pool = Object.keys(PARTICIPANTS)
    .filter(nick => nick !== visitorName && !Object.values(draws).includes(nick));

  if(pool.length === 0){
    alert("No eligible recipients left!");
    return;
  }

  animationArea.classList.remove("d-none");
  resultArea.classList.add("d-none");

  setTimeout(()=>{
    const choice = pool[Math.floor(Math.random()*pool.length)];
    draws[visitorName] = choice;
    saveState();

    animationArea.classList.add("d-none");
    resultArea.classList.remove("d-none");
    recipientNameEl.textContent = choice;

    drawBtn.style.display = "none"; // hide draw button
    document.body.classList.add("drawn"); // background red -> green

    confetti();
  }, 1500);
});

// Hide result
hideResultBtn.addEventListener("click", ()=>{ resultArea.classList.add("d-none"); });

// Reset all draws
resetAllBtn.addEventListener("click", ()=>{
  if(confirm("Reset all draws?")){
    draws={};
    saveState();
    location.reload();
  }
});

// Confetti animation
function confetti(){
  const duration=2000;
  const end=Date.now()+duration;
  (function frame(){
    const colors=["#FF6B6B","#FFD93D","#6BCB77","#4D96FF"];
    for(let i=0;i<20;i++){
      const div=document.createElement("div");
      div.style.position="fixed";
      div.style.width="8px"; div.style.height="8px";
      div.style.background=colors[Math.floor(Math.random()*colors.length)];
      div.style.top=Math.random()*window.innerHeight+"px";
      div.style.left=Math.random()*window.innerWidth+"px";
      div.style.borderRadius="50%";
      div.style.zIndex=9999;
      document.body.appendChild(div);
      setTimeout(()=>div.remove(),1000);
    }
    if(Date.now()<end) requestAnimationFrame(frame);
  })();
}

// Snowflakes
function createSnowflakes(num = 200) {
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

// Auto music if allowed
if(musicAllowed && bgMusic.paused) bgMusic.play().catch(()=>{});
