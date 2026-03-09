const c=document.getElementById('game');const ctx=c.getContext('2d');const scoreEl=document.getElementById('score');const startBtn=document.getElementById('start');
let w,h,runnerY,vel=0,score=0,running=false,last=0,gates=[];
let coins=0,dailyBonusClaimed=false,lastLogin=null,highScore=0;
const SAVE_KEY='glideMaze_save';
function loadSave(){try{const s=localStorage.getItem(SAVE_KEY);if(s){const d=JSON.parse(s);coins=d.coins||0;dailyBonusClaimed=d.dailyBonusClaimed||false;lastLogin=d.lastLogin||null;highScore=d.highScore||0;}}catch(e){}}
function saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({coins,dailyBonusClaimed,lastLogin,highScore}));}catch(e){}}
function checkDaily(){const today=new Date().toDateString();if(lastLogin!==today){dailyBonusClaimed=false;}if(!dailyBonusClaimed){coins+=50;dailyBonusClaimed=true;lastLogin=today;saveGame();alert('Daily Bonus: +50 coins!');}}
function onGameOver(){running=false;startBtn.style.display='inline-block';if(score>highScore){highScore=score;}coins+=Math.floor(score/10);saveGame();setTimeout(()=>{console.log('Interstitial ad');},500);}
function resize(){w=c.width=innerWidth;h=c.height=innerHeight;runnerY=h/2;}addEventListener('resize',resize);resize();
function spawnGate(){const gap=120;const center=Math.random()*(h-200)+100;gates.push({x:w+50,top:center-gap/2,bottom:center+gap/2});}
function update(dt){if(Math.random()<0.02)spawnGate();vel+=0.6;runnerY+=vel;gates.forEach(g=>g.x-=220*dt);gates=gates.filter(g=>g.x>-50);
if(runnerY<0||runnerY>h){onGameOver();}
for(const g of gates){if(g.x<80 && g.x>30){if(runnerY<g.top||runnerY>g.bottom){onGameOver();}}}
score+=dt*10;}
function draw(){ctx.clearRect(0,0,w,h);ctx.fillStyle='#1e2636';ctx.fillRect(0,0,w,h);ctx.fillStyle='#7cff7c';ctx.beginPath();ctx.arc(50,runnerY,14,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#4ef0ff';for(const g of gates){ctx.fillRect(g.x,0,20,g.top);ctx.fillRect(g.x,g.bottom,20,h-g.bottom);}}
function loop(ts){if(!running)return;const dt=(ts-last)/1000;last=ts;update(dt);draw();scoreEl.textContent=Math.floor(score);requestAnimationFrame(loop);}
function lift(){vel=-6;}
startBtn.onclick=()=>{running=true;score=0;gates=[];runnerY=h/2;vel=0;last=performance.now();loadSave();checkDaily();startBtn.style.display='none';requestAnimationFrame(loop);}
addEventListener('touchstart',(e)=>{e.preventDefault();lift();},{passive:false});addEventListener('mousedown',lift);
