/* Pure game simulation. One fixed step is 1/120 s; the renderer is independent. */
(function(root){
  'use strict';
  const W=8600, H=650, FINISH=8200, PORTAL_X=8280, SPEED=310, GRAVITY=1550, FUEL=1.3;
  const gaps=[{x:780,w:120},{x:1800,w:120},{x:3050,w:130},{x:4900,w:120},{x:6100,w:120}];
  const surfaces=[{x:0,y:530,w:780,h:160},{x:900,y:530,w:900,h:160},{x:1920,y:530,w:1130,h:160},{x:3180,y:530,w:1720,h:160},{x:5020,y:530,w:1080,h:160},{x:6220,y:530,w:2380,h:160},{x:1270,y:365,w:230,h:28},{x:2230,y:365,w:250,h:28},{x:5210,y:390,w:230,h:28},{x:5600,y:365,w:250,h:28},{x:6730,y:365,w:230,h:28}];
  const hurdles=[{x:6530,y:484,w:85,h:46},{x:7140,y:480,w:85,h:50},{x:7870,y:484,w:85,h:46}];
  const flowers=[5130,5500];
  const zones=[{x:0,name:'Regnbågsängen',hint:'Små hopp och stjärnmagi'},{x:1500,name:'Godisstigen',hint:'Magi öppnar godispresenterna!'},{x:3100,name:'Glassgläntan',hint:'En glasspaus och tre morötter till hästvännen'},{x:4600,name:'Blomsterhoppen',hint:'Hoppa på blommorna för ett extra högt hopp!'},{x:6200,name:'Hästarnas picknick',hint:'Hoppa över de låga ridhindren'},{x:7400,name:'Regnbågsfesten',hint:'En sista present och en regnbågsfest!'}];
  const starPositions=[[310,435],[465,435],[680,360],[855,340],[960,375],[1130,435],[1340,320],[1450,320],[1660,420],[1900,340],[2120,435],[2370,315],[2660,400],[2870,335],[3300,435],[3640,430],[3880,375],[4230,430],[4490,435],[4730,370],[4960,330],[5160,420],[5310,340],[5420,300],[5660,310],[5790,310],[5990,380],[6170,340],[6380,430],[6610,360],[6780,425],[6790,315],[6880,315],[7350,430],[7600,360],[7780,400],[8000,385],[8140,435]];
  const candyPositions=[[1720,425],[1980,435],[2100,390],[2250,315],[2510,425],[2700,390],[3270,410],[3730,410],[4630,435],[4790,380],[5100,435],[5270,345],[5440,300],[5670,315],[5950,415],[6350,435],[6710,410],[6860,315],[7300,435],[7740,425],[8060,435]];
  const thornPositions=[{x:570,y:486,w:65,h:44},{x:1580,y:486,w:70,h:44},{x:2860,y:486,w:65,h:44},{x:5780,y:486,w:65,h:44},{x:7480,y:486,w:65,h:44}];
  const activityPositions=[{kind:'gift',x:2400},{kind:'icecream',x:3450},{kind:'pony',x:4300},{kind:'gift',x:7660}];
  const colliders=[...surfaces,...hurdles];
  const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  function createGame(){return {mode:'intro',p:{x:140,y:410,w:85,h:112,vx:0,vy:0,face:1,grounded:false,fuel:FUEL,health:3,invulnerable:0},stars:starPositions.map(([x,y])=>({x,y,taken:false})),candies:candyPositions.map(([x,y],i)=>({x,y,type:i%3,taken:false})),carrots:[3830,3990,4150].map(x=>({x,y:450,taken:false})),activities:activityPositions.map(a=>({...a,done:false})),thorns:thornPositions.map(t=>({...t,removed:false})),shots:[],particles:[],cooldown:0,collected:0,candyCount:0,carrotCount:0,icecreamTime:0,zone:0,time:0,camera:0,checkpoint:{x:140,y:410},notice:'',noticeTime:0,jumpWas:false,magicWas:false};}
  function notice(g,text){g.notice=text;g.noticeTime=3;}
  function nearbyActivity(g){const p=g.p;return g.activities.find(a=>!a.done&&Math.abs(a.x-(p.x+p.w/2))<190&&Math.abs(p.y+p.h-530)<100);}
  function activityHint(g){const a=nearbyActivity(g);if(!a)return '';if(a.kind==='gift')return 'Magi öppnar presenten!';if(a.kind==='icecream')return 'Magi ger en glass och fyller hjärtan!';return g.carrotCount<3?'Hitta 3 morötter till hästvännen · '+g.carrotCount+' / 3':'Magi ger hästvännen morötterna!';}
  function doActivity(g){
    const a=nearbyActivity(g);if(!a)return false;
    if(a.kind==='pony'&&g.carrotCount<3){notice(g,activityHint(g));return true;}
    a.done=true;
    if(a.kind==='icecream'){g.p.health=3;g.p.fuel=FUEL;g.icecreamTime=10;g.checkpoint={x:a.x-100,y:418};notice(g,'Glasspaus! Tre hjärtan och full flygkraft.');}
    else if(a.kind==='pony'){g.candyCount+=3;notice(g,'Hästvännen tackar! Ni fick 3 godisbitar.');}
    else{g.candyCount+=4;notice(g,'Hurra! 4 godisbitar i present!');}
    burst(g,a.x,380,a.kind==='pony'?'#f1a8c5':'#ffe3b2',32);return true;
  }
  function safeCheckpoint(p){return surfaces.some(s=>s.y===530&&p.x>s.x+80&&p.x+p.w<s.x+s.w-100)&&!thornPositions.some(t=>p.x+p.w>t.x-100&&p.x<t.x+t.w+100)&&Math.abs(p.y+p.h-530)<2;}
  function hurt(g,fall=false){const p=g.p;if(p.invulnerable>0&&!fall)return;p.health--;g.shots=[];if(p.health<=0){g.mode='lost';notice(g,'Ett nytt försök väntar!');return;}p.x=g.checkpoint.x;p.y=g.checkpoint.y;p.vx=0;p.vy=0;p.fuel=FUEL;p.invulnerable=1.8;notice(g,fall?'Hoppa över ravinen och håll inne för att flyga!':'Aj, törnen! Använd magi eller hoppa över dem.');}
  function step(g,input,dt){
    if(g.mode!=='playing')return; dt=Math.min(dt,1/60);const p=g.p;g.time+=dt;g.noticeTime=Math.max(0,g.noticeTime-dt);g.icecreamTime=Math.max(0,g.icecreamTime-dt);g.cooldown=Math.max(0,g.cooldown-dt);p.invulnerable=Math.max(0,p.invulnerable-dt);
    const direction=Number(!!input.right)-Number(!!input.left);p.vx=direction*SPEED;if(direction)p.face=direction;
    const jumpPressed=input.jump&&!g.jumpWas;
    if(jumpPressed&&p.grounded){const flower=flowers.some(x=>Math.abs(x-(p.x+p.w/2))<105&&Math.abs(p.y+p.h-530)<2);p.vy=flower?-820:-650;p.grounded=false;if(flower){p.fuel=FUEL;notice(g,'Blomsterhopp! Upp bland stjärnorna!');burst(g,p.x+p.w/2,510,'#efb4dd',16);}}
    if(input.jump&&!p.grounded&&p.fuel>0&&p.vy>-280){p.vy-=2100*dt;p.vy=Math.max(-220,p.vy);p.fuel=Math.max(0,p.fuel-dt);}
    if(input.magic&&!g.magicWas&&g.cooldown===0){g.cooldown=.65;if(!doActivity(g)){const x=p.x+p.w/2+p.face*45,y=p.y+30;const target=g.thorns.filter(t=>!t.removed&&(t.x+t.w/2-x)*p.face>0&&(t.x+t.w/2-x)*p.face<400).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0];const vy=target?(target.y+20-y)/Math.max(.08,Math.abs(target.x+target.w/2-x)/640):0;g.shots.push({x,y,vx:p.face*640,vy,life:.65});notice(g,'Stjärnmagi!');}}
    g.jumpWas=!!input.jump;g.magicWas=!!input.magic;
    p.x+=p.vx*dt;p.x=Math.max(0,Math.min(W-p.w,p.x));
    for(const s of colliders){if(overlap(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w;}}
    const oldY=p.y;p.vy+=GRAVITY*dt;p.y+=p.vy*dt;p.grounded=false;
    for(const s of colliders){if(overlap(p,s)){if(p.vy>=0&&oldY+p.h<=s.y+2){p.y=s.y-p.h;p.vy=0;p.grounded=true;}else if(p.vy<0&&oldY>=s.y+s.h-2){p.y=s.y+s.h;p.vy=0;}}}
    if(p.grounded){p.fuel=Math.min(FUEL,p.fuel+dt*3);if(p.x>g.checkpoint.x+350&&safeCheckpoint(p)){g.checkpoint={x:p.x,y:p.y};}}
    if(p.y<-35){p.y=-35;p.vy=Math.max(0,p.vy);}
    for(const shot of g.shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;for(const t of g.thorns){if(!t.removed&&shot.x>t.x-18&&shot.x<t.x+t.w+18&&shot.y>t.y-28&&shot.y<t.y+t.h+18){t.removed=true;shot.life=0;burst(g,t.x+t.w/2,t.y,'#d5b1ef',22);notice(g,'Törnena försvann!');}}}
    g.shots=g.shots.filter(s=>s.life>0);
    for(const s of g.stars){if(!s.taken&&overlap(p,{x:s.x-17,y:s.y-17,w:34,h:34})){s.taken=true;g.collected++;burst(g,s.x,s.y,'#ffe599',14);}}
    for(const s of g.candies){if(!s.taken&&overlap(p,{x:s.x-19,y:s.y-19,w:38,h:38})){s.taken=true;g.candyCount++;burst(g,s.x,s.y,'#f3b8d0',12);}}
    for(const s of g.carrots){if(!s.taken&&overlap(p,{x:s.x-18,y:s.y-24,w:36,h:48})){s.taken=true;g.carrotCount++;burst(g,s.x,s.y,'#f8c37c',12);notice(g,g.carrotCount===3?'Tre morötter! Hästvännen väntar längre fram.':'En morot till hästvännen! '+g.carrotCount+' / 3');}}
    for(const t of g.thorns){if(!t.removed&&overlap(p,{x:t.x+10,y:t.y+10,w:t.w-20,h:t.h-10})){hurt(g);break;}}
    if(p.y>H+80)hurt(g,true);
    const zone=zones.reduce((n,z,i)=>p.x>=z.x?i:n,0);if(zone!==g.zone){g.zone=zone;notice(g,zones[zone].name+' · '+zones[zone].hint);}
    if(g.mode==='playing'&&p.x>FINISH&&p.grounded){g.mode='won';burst(g,p.x,p.y,'#ffe599',60);}
    for(const q of g.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=150*dt;q.life-=dt;}g.particles=g.particles.filter(q=>q.life>0);
    g.camera=Math.max(0,Math.min(W-1200,p.x-360));
  }
  function burst(g,x,y,color,n){for(let i=0;i<n;i++){const a=i/n*Math.PI*2;g.particles.push({x,y,vx:Math.cos(a)*90,vy:Math.sin(a)*90-35,life:.7,color});}}
  const api={createGame,step,surfaces,gaps,hurdles,flowers,zones,starPositions,activityHint,nearbyActivity,overlap,FUEL,W,H,FINISH,PORTAL_X,SPEED};root.MollyCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
