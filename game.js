'use strict';
const C=MollyCore, canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);
let game=C.createGame(),last=0,accumulator=0,lastMode='',ready=false;
let touchMode=false,moveTarget=null,screenPointer=null,blockedTime=0;
const coarsePointer=matchMedia('(any-pointer: coarse)'),hoverNone=matchMedia('(hover: none)');
function setTouchMode(enabled){
  if(touchMode!==enabled){screenPointer=null;stopWalking();}
  touchMode=enabled;document.body.dataset.controls=enabled?'touch':'keyboard';
  $('touch-instructions').hidden=!enabled;$('keyboard-instructions').hidden=enabled;
  $('screen-controls').hidden=!enabled;
  canvas.setAttribute('aria-label',enabled?'Spelyta. Tryck dit ni vill gå. Använd knapparna Hoppa och Magi.':'Spelyta. Piltangenter styr, mellanslag hoppar och flyger, X använder magi.');
  $('tip').innerHTML=enabled?'Tryck dit ni vill gå<span>Hoppa och använd magi med knapparna</span>':'Följ stjärnorna till regnbågsportalen<span>Håll hopp för en liten flygtur</span>';
}
function detectControls(){setTouchMode(MollyControls.usesTouchControls({coarsePointer:coarsePointer.matches,touchPoints:navigator.maxTouchPoints,hoverNone:hoverNone.matches}));}
detectControls();coarsePointer.addEventListener('change',detectControls);hoverNone.addEventListener('change',detectControls);
document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen')setTouchMode(true);},true);
const held=new Set(),pointers=new Map(),queued=new Set(),actionKeys={ArrowLeft:'left',ArrowRight:'right',Space:'jump',KeyX:'magic'};
const input=()=>({left:moveTarget!==null&&moveTarget<game.p.x||held.has('left')||[...pointers.values()].includes('left'),right:moveTarget!==null&&moveTarget>game.p.x||held.has('right')||[...pointers.values()].includes('right'),jump:queued.has('jump')||held.has('jump')||[...pointers.values()].includes('jump'),magic:queued.has('magic')||held.has('magic')||[...pointers.values()].includes('magic')});
function stopWalking(){moveTarget=null;blockedTime=0;$('stop').disabled=true;}
function simulate(){
  if(moveTarget!==null&&Math.abs(moveTarget-game.p.x)<=C.SPEED/120)stopWalking();
  const oldX=game.p.x,health=game.p.health;C.step(game,input(),1/120);queued.clear();
  if(moveTarget!==null&&game.mode==='playing'){blockedTime=game.p.x===oldX?blockedTime+1/120:0;if(blockedTime>.35||game.p.health!==health)stopWalking();}
}
function clearInput(){held.clear();pointers.clear();queued.clear();screenPointer=null;stopWalking();document.querySelectorAll('[data-action]').forEach(b=>b.classList.remove('active'));game.jumpWas=false;game.magicWas=false;}
function start(){clearInput();game=C.createGame();game.mode='playing';canvas.focus({preventScroll:true});sync();}
function pause(){if(game.mode==='playing'){game.mode='paused';clearInput();}else if(game.mode==='paused'){game.mode='playing';canvas.focus({preventScroll:true});}sync();}
document.addEventListener('keydown',e=>{const a=actionKeys[e.code];if(a){e.preventDefault();if(game.mode==='playing'){if(a==='left'||a==='right')stopWalking();held.add(a);if(!e.repeat&&(a==='jump'||a==='magic'))queued.add(a);}}if(e.code==='Escape'&&!e.repeat)pause();});
document.addEventListener('keyup',e=>{const a=actionKeys[e.code];if(a){e.preventDefault();held.delete(a);}});
window.addEventListener('blur',()=>{clearInput();if(game.mode==='playing'){game.mode='paused';sync();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(game.mode==='playing'){game.mode='paused';sync();}}});
for(const b of document.querySelectorAll('[data-action]')){
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(game.mode!=='playing')return;const a=b.dataset.action;if(a==='left'||a==='right')stopWalking();pointers.set(e.pointerId,a);if(a==='jump'||a==='magic')queued.add(a);b.classList.add('active');if(e.isTrusted)b.setPointerCapture(e.pointerId);});
  const release=e=>{const wasActive=pointers.has(e.pointerId),a=b.dataset.action;pointers.delete(e.pointerId);if(![...pointers.values()].includes(a)){b.classList.remove('active');if((e.type==='pointercancel'||e.type==='lostpointercapture'&&wasActive)&&!held.has(a))queued.delete(a);}};
  b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);
}
function pointDestination(e){const r=canvas.getBoundingClientRect();moveTarget=Math.max(0,Math.min(C.W-game.p.w,(e.clientX-r.left)*1200/r.width+game.camera-game.p.w/2));blockedTime=0;$('stop').disabled=false;}
canvas.addEventListener('pointerdown',e=>{if(!touchMode||game.mode!=='playing'||screenPointer!==null)return;e.preventDefault();screenPointer=e.pointerId;pointDestination(e);if(e.isTrusted)canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(e.pointerId===screenPointer){e.preventDefault();pointDestination(e);}});
canvas.addEventListener('pointerup',e=>{if(e.pointerId===screenPointer)screenPointer=null;});
const cancelScreen=e=>{if(e.pointerId===screenPointer){screenPointer=null;stopWalking();}};
canvas.addEventListener('pointercancel',cancelScreen);canvas.addEventListener('lostpointercapture',cancelScreen);
$('stop').addEventListener('click',()=>{screenPointer=null;stopWalking();});
document.addEventListener('contextmenu',e=>{if(e.target.closest('.game-shell'))e.preventDefault();});
$('play').addEventListener('click',()=>game.mode==='paused'?pause():start());$('restart').addEventListener('click',start);$('pause').addEventListener('click',pause);
const sprite=new Image(),background=new Image();
sprite.src='assets/molly-sprites.webp';background.src='assets/meadow.webp';
Promise.all([sprite.decode(),background.decode()]).then(()=>{ready=true;sync();}).catch(()=>{ $('dialog-text').textContent='En spelbild kunde inte laddas. Ladda om sidan och försök igen.';$('play').disabled=true; });
function star(x,y,r,color){ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;const xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.closePath();ctx.fillStyle=color;ctx.fill();}
function label(x,y,text){ctx.font='14px Georgia';const w=ctx.measureText(text).width;ctx.fillStyle='#fff9efee';ctx.beginPath();ctx.roundRect(x-w/2-14,y-20,w+28,32,12);ctx.fill();ctx.fillStyle='#685175';ctx.textAlign='center';ctx.fillText(text,x,y);}
function platform(s){
  const grad=ctx.createLinearGradient(0,s.y,0,s.y+s.h);grad.addColorStop(0,'#77815b');grad.addColorStop(.12,'#777564');grad.addColorStop(1,'#464a53');ctx.fillStyle=grad;ctx.beginPath();ctx.roundRect(s.x,s.y,s.w,s.h,12);ctx.fill();
  ctx.save();ctx.beginPath();ctx.rect(s.x,s.y+10,s.w,s.h-10);ctx.clip();
  for(let i=0;i<s.w/29;i++){const x=s.x+i*29;ctx.strokeStyle=i%2?'#d1c2a433':'#252b3438';ctx.lineWidth=1+i%3;ctx.beginPath();ctx.moveTo(x+10,s.y+17);ctx.lineTo(x+(i%3)*9,s.y+44);ctx.lineTo(x+19,s.y+65);ctx.lineTo(x-10,s.y+s.h);ctx.stroke();}
  ctx.restore();ctx.fillStyle='#8baf69';ctx.beginPath();ctx.roundRect(s.x,s.y,s.w,13,6);ctx.fill();
  for(let i=0;i<s.w/7;i++){const x=s.x+i*7,seed=(i*47+s.x)%31;ctx.strokeStyle=['#74964d','#b1c777','#597a47'][i%3];ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,s.y+5);ctx.lineTo(x-3+seed%7,s.y-3-seed%9);ctx.stroke();if(i%9===0){ctx.fillStyle=['#f1d7ee','#fff7cc','#bba2db'][i%3];ctx.beginPath();ctx.arc(x,s.y-5-seed%9,2.8,0,Math.PI*2);ctx.fill();}}
}
function thorn(t){ctx.save();ctx.translate(t.x,t.y);ctx.strokeStyle='#68506e';ctx.lineWidth=6;for(let i=0;i<5;i++){const x=8+i*12;ctx.beginPath();ctx.moveTo(x,t.h);ctx.bezierCurveTo(x-20,10,x+25,26,x+5,2);ctx.stroke();ctx.fillStyle='#9775a7';ctx.beginPath();ctx.moveTo(x+2,12);ctx.lineTo(x-11,4);ctx.lineTo(x-2,22);ctx.fill();ctx.beginPath();ctx.moveTo(x,27);ctx.lineTo(x+17,17);ctx.lineTo(x+3,35);ctx.fill();}ctx.restore();}
function portal(){const x=3670,y=530;ctx.save();ctx.translate(x,y);ctx.shadowBlur=25;ctx.shadowColor='#ffdd9b';const colors=['#e0a0ac','#e9c489','#ece8ab','#afd4af','#9acdda','#b1a2d6'];for(let i=0;i<6;i++){ctx.strokeStyle=colors[i];ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(0,-90,78-i*7,126-i*7,0,Math.PI,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-78+i*7,-90);ctx.lineTo(-78+i*7,0);ctx.moveTo(78-i*7,-90);ctx.lineTo(78-i*7,0);ctx.stroke();}ctx.shadowBlur=0;ctx.fillStyle='#fff7c3';for(let i=0;i<9;i++)star(Math.sin(i*4)*45,-30-i*18+Math.sin(game.time*2+i)*9,3,'#fff9e6');ctx.restore();label(x,562,'Regnbågsportalen');}
function render(){
  ctx.clearRect(0,0,1200,650);
  if(background.complete&&background.naturalWidth){const x=-game.camera*.12;ctx.drawImage(background,x,0,1500,650);ctx.drawImage(background,x+1500,0,1500,650);}else{ctx.fillStyle='#c7e1e8';ctx.fillRect(0,0,1200,650);}
  const mist=ctx.createLinearGradient(0,360,0,650);mist.addColorStop(0,'#eef5e800');mist.addColorStop(1,'#e2dcec70');ctx.fillStyle=mist;ctx.fillRect(0,300,1200,350);
  ctx.save();ctx.translate(-game.camera,0);C.surfaces.forEach(platform);
  for(const s of game.stars){if(s.taken)continue;const y=s.y+Math.sin(game.time*2+s.x)*5;ctx.shadowBlur=18;ctx.shadowColor='#fff1ad';star(s.x,y,17,'#ffde79');ctx.shadowBlur=0;ctx.strokeStyle='#fff9db';ctx.lineWidth=2;ctx.stroke();}
  for(const t of game.thorns)if(!t.removed)thorn(t);
  portal();if(game.camera<400){label(325,565,touchMode?'Tryck dit ni vill gå':'← →  Av mot äventyret');label(605,460,touchMode?'Magi · Törnena försvinner':'X  ·  Stjärnmagi');label(860,590,'Håll hopp för att flyga');}
  if(moveTarget!==null){const x=moveTarget+game.p.w/2;ctx.strokeStyle='#fff4bd';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,525,18,6,0,0,Math.PI*2);ctx.stroke();star(x,501,7,'#fff4bd');}
  for(const s of game.shots){ctx.shadowBlur=20;ctx.shadowColor='#d6a6ff';star(s.x,s.y,18,'#f5dcff');ctx.shadowBlur=0;for(let i=1;i<5;i++){ctx.globalAlpha=1-i/5;star(s.x-Math.sign(s.vx)*i*12,s.y,7-i,'#e5b7ff');}ctx.globalAlpha=1;}
  const p=game.p;
  if(sprite.complete&&sprite.naturalWidth){const air=!p.grounded,frame=(air?3:0)+(p.vx||air?Math.floor(game.time*(air?6:9))%3:0),sw=sprite.naturalWidth/3,sy=air?480:0,sh=air?544:480;ctx.save();ctx.translate(p.x+p.w/2,p.y+p.h);if(p.face<0)ctx.scale(-1,1);if(p.invulnerable>0)ctx.globalAlpha=.55+.25*Math.sin(game.time*22);ctx.drawImage(sprite,(frame%3)*sw,sy,sw,sh,-112,air?-238:-206,224,sh*224/sw);ctx.restore();}
  for(const q of game.particles){ctx.globalAlpha=Math.max(0,q.life/.7);star(q.x,q.y,4,q.color);}ctx.globalAlpha=1;ctx.restore();
  if(game.mode==='intro'){ctx.fillStyle='#ffffff10';ctx.fillRect(0,0,1200,650);}
}
function sync(){
  if(window.MollyTest){canvas.dataset.x=game.p.x;canvas.dataset.y=game.p.y;canvas.dataset.mode=game.mode;canvas.dataset.fuel=game.p.fuel;canvas.dataset.shots=game.shots.length;}
  $('health').textContent='♥ '.repeat(game.p.health)+'♡ '.repeat(3-game.p.health);$('health').setAttribute('aria-label',game.p.health+' av 3 hjärtan');$('stars').textContent=game.collected+' / '+game.stars.length;$('fuel').style.width=game.p.fuel/C.FUEL*100+'%';$('progress').style.width=Math.max(0,(game.p.x-140)/3460*100)+'%';$('toast').textContent=game.notice;$('toast').style.opacity=game.noticeTime>0?1:0;
  $('pause').textContent=game.mode==='paused'?'▷':'Ⅱ';$('pause').setAttribute('aria-label',game.mode==='paused'?'Fortsätt spela':'Pausa spelet');
  if(game.mode===lastMode)return;lastMode=game.mode;const overlay=$('overlay');overlay.hidden=game.mode==='playing';$('instructions').hidden=game.mode!=='intro';
  if(game.mode==='won'){clearInput();$('eyebrow').textContent='NI HITTADE HEM!';$('dialog-title').innerHTML='Vilken magisk resa!';$('dialog-text').textContent='Molly och enhörningen nådde regnbågsportalen. Ni samlade '+game.collected+' av '+game.stars.length+' stjärnor. Vill ni hitta fler?';$('play').textContent='Spela igen →';$('dialog-note').textContent='Varje äventyr börjar med ett litet hopp.';}
  if(game.mode==='lost'){clearInput();$('eyebrow').textContent='ÄVENTYRET VÄNTAR PÅ ER';$('dialog-title').textContent='Prova en gång till!';$('dialog-text').textContent='Hoppa över ravinerna och använd stjärnmagi på törnena. Ni klarar det!';$('play').textContent='Försök igen →';$('dialog-note').textContent='Tre nya hjärtan och full flygkraft.';}
  if(game.mode==='paused'){$('eyebrow').textContent='EN LITEN VILOPAUS';$('dialog-title').textContent='Äventyret är pausat';$('dialog-text').textContent='Molly och enhörningen väntar här. Fortsätt när du är redo.';$('play').textContent='Fortsätt spela →';$('dialog-note').textContent=touchMode?'Tryck Fortsätt spela när du är redo.':'Tryck Esc eller på pausknappen för att fortsätta.';}
}
function frame(now){const dt=Math.min((now-last)/1000||0, .05);last=now;if(ready){accumulator+=dt;while(accumulator>=1/120){simulate();accumulator-=1/120;}sync();render();}requestAnimationFrame(frame);}sync();requestAnimationFrame(frame);
// Only the dedicated browser test page enables deterministic simulation access.
if(new URLSearchParams(location.search).has('test'))window.MollyTest={get game(){return game;},input,start,pause,clearInput,step(n=1){for(let i=0;i<n;i++)simulate();sync();render();},get ready(){return ready;}};
