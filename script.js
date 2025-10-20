// Nicknames mapping
const PARTICIPANTS = {
  "Nickel":"Nicol",
  "Ash Cash":"Ashley",
  "Alfren":"Allison",
  "Meth":"Allison",
  "Keem":"Jacquelyn",
  "Ren":"Karen"
};

// DOM elements
const welcomeScreen = document.getElementById("welcome-screen");
const drawScreen = document.getElementById("draw-screen");
const visitorNameInput = document.getElementById("visitor-name");
const continueBtn = document.getElementById("continue-btn");
const playerNameDisplay = document.getElementById("player-name-display");
const animationArea = document.getElementById("animation-area");
const resultArea = document.getElementById("result-area");
const recipientNameEl = document.getElementById("recipient-name");
const hideResultBtn = document.getElementById("hide-result");
const resetAllBtn = document.getElementById("reset-all");
const bgMusic = document.getElementById("bg-music");

// State
let draws = JSON.parse(localStorage.getItem("ss_draws")) || {};
let visitorName = localStorage.getItem("ss_visitorName") || "";

// Save state
function saveState(){
  localStorage.setItem("ss_draws", JSON.stringify(draws));
  localStorage.setItem("ss_visitorName", visitorName);
}

// Show/hide screens
function showScreen(name){
  welcomeScreen.classList.add("d-none");
  drawScreen.classList.add("d-none");
  if(name==="welcome") welcomeScreen.classList.remove("d-none");
  if(name==="draw") drawScreen.classList.remove("d-none");
}

// Welcome
continueBtn.addEventListener("click", async ()=>{
  const val = visitorNameInput.value.trim();
  if(!PARTICIPANTS[val]){
    alert("Enter a valid nickname.");
    return;
  }
  visitorName = val;
  playerNameDisplay.textContent = val;
  saveState();

  // Show draw screen directly
  showScreen("draw");

  // Start music automatically
  try { await bgMusic.play(); } catch(e){ console.log("Music blocked until interaction", e); }
});

// Draw
drawBtn.addEventListener("click", ()=>{
  if(draws[visitorName]){
    alert("You already drew: " + draws[visitorName]);
    return;
  }
  let pool = Object.keys(PARTICIPANTS)
    .filter(nick=>nick!==visitorName && !Object.values(draws).includes(nick));
  if(pool.length===0){ alert("No eligible recipients left!"); return; }

  animationArea.classList.remove("d-none");
  resultArea.classList.add("d-none");

  setTimeout(()=>{
    const choice = pool[Math.floor(Math.random()*pool.length)];
    draws[visitorName] = choice;
    saveState();

    animationArea.classList.add("d-none");
    resultArea.classList.remove("d-none");
    recipientNameEl.textContent = choice;

    document.body.classList.add("drawn"); // red->green

    confetti();
  },1500);
});

hideResultBtn.addEventListener("click", ()=>{ resultArea.classList.add("d-none"); });
resetAllBtn.addEventListener("click", ()=>{
  if(confirm("Reset all draws?")){
    draws={};
    saveState();
    location.reload();
  }
});

// Confetti
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

// Snowflakes (continuous, proper animation)
function createSnowflakes(num=200){
  const snowContainer = document.querySelector(".snow");
  for(let i=0; i<num; i++){
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    flake.textContent = "❄";

    // Random position & size
    flake.style.left = Math.random() * window.innerWidth + "px";
    flake.style.fontSize = (12 + Math.random() * 16) + "px";
    flake.style.opacity = 0.5 + Math.random() * 0.5;

    // Random animation timing
    const fallDuration = 10 + Math.random() * 15;
    const swayDuration = 3 + Math.random() * 5;
    const delay = Math.random() * 10;

    flake.style.animation = `
      fall ${fallDuration}s linear ${delay}s infinite,
      sway ${swayDuration}s ease-in-out ${delay}s infinite
    `;

    snowContainer.appendChild(flake);
  }
}

// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    createSnowflakes();
});

