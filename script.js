// Nicknames mapping: nickname -> real name
const PARTICIPANTS = {
  "Nickel":"Nicol",
  "Ash Cash":"Ashley",
  "Alfren":"Allison",
  "Meth":"Allison",
  "Keem":"Jacquelyn",
  "Ren":"Karen"
};

const welcomeScreen = document.getElementById("welcome-screen");
const musicScreen = document.getElementById("music-screen");
const drawScreen = document.getElementById("draw-screen");
const visitorNameInput = document.getElementById("visitor-name");
const continueBtn = document.getElementById("continue-btn");
const greetNameSpan = document.getElementById("greet-name");
const drawBtn = document.getElementById("draw-btn");
const playerNameDisplay = document.getElementById("player-name-display");
const animationArea = document.getElementById("animation-area");
const shuffler = document.getElementById("shuffler");
const resultArea = document.getElementById("result-area");
const recipientNameEl = document.getElementById("recipient-name");
const hideResultBtn = document.getElementById("hide-result");
const resetAllBtn = document.getElementById("reset-all");
const musicYesBtn = document.getElementById("music-yes");
const musicNoBtn = document.getElementById("music-no");
const bgMusic = document.getElementById("bg-music");

let draws = JSON.parse(localStorage.getItem("ss_draws")) || {};
let visitorName = localStorage.getItem("ss_visitorName") || "";
let musicAllowed = localStorage.getItem("ss_musicAllowed") === "true";

function saveState(){
  localStorage.setItem("ss_draws", JSON.stringify(draws));
  localStorage.setItem("ss_visitorName", visitorName);
  localStorage.setItem("ss_musicAllowed", musicAllowed);
}

function showScreen(name){
  welcomeScreen.classList.add("d-none");
  musicScreen.classList.add("d-none");
  drawScreen.classList.add("d-none");
  if(name==="welcome") welcomeScreen.classList.remove("d-none");
  if(name==="music") musicScreen.classList.remove("d-none");
  if(name==="draw") drawScreen.classList.remove("d-none");
}

// Welcome
continueBtn.addEventListener("click", ()=>{
  const val = visitorNameInput.value.trim();
  if(!PARTICIPANTS[val]){
    alert("Enter a valid nickname.");
    return;
  }
  visitorName = val;
  greetNameSpan.textContent = val;
  playerNameDisplay.textContent = val;
  saveState();
  showScreen("music");
});

// Music
musicYesBtn.addEventListener("click", ()=>{
  musicAllowed = true;
  bgMusic.play().catch(()=>{});
  saveState();
  showScreen("draw");
});
musicNoBtn.addEventListener("click", ()=>{
  musicAllowed = false;
  saveState();
  showScreen("draw");
});
if(visitorName) playerNameDisplay.textContent = visitorName;

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

// Snowflakes
function createSnowflakes(num=800){
  const snowContainer=document.querySelector(".snow");
  for(let i=0;i<num;i++){
    const flake=document.createElement("div");
    flake.classList.add("snowflake");
    flake.textContent="❄";
    flake.style.left=Math.random()*window.innerWidth+"px";
    flake.style.fontSize=(12+Math.random()*16)+"px";
    flake.style.opacity=0.5+Math.random()*0.5;

    // Duration proportional to font size (smaller fall slower)
    const fallDuration = 10 + Math.random()*15;
    const swayDuration = 3 + Math.random()*5;
    flake.style.animation=`fall ${fallDuration}s linear infinite, sway ${swayDuration}s ease-in-out infinite`;
    flake.style.top = Math.random()*-window.innerHeight + "px"; // start above screen

    snowContainer.appendChild(flake);
  }
}
createSnowflakes();

// Auto music
if(musicAllowed && bgMusic.paused) bgMusic.play().catch(()=>{});
