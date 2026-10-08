/* Pure game simulation. One fixed step is 1/120 s; the renderer is independent. */
(function(root){
  'use strict';
  const W=3900, H=650, SPEED=310, GRAVITY=1550, FUEL=1.3;
  const surfaces=[{x:0,y:530,w:780,h:160},{x:1020,y:530,w:780,h:160},{x:1980,y:530,w:770,h:160},{x:3010,y:530,w:890,h:160},{x:1270,y:365,w:230,h:28},{x:2230,y:365,w:250,h:28}];
  const starPositions=[[310,435],[465,435],[680,360],[855,340],[960,375],[1130,435],[1340,320],[1450,320],[1660,420],[1900,340],[2120,435],[2370,315],[2660,400],[2870,335],[3300,435]];
  const thornPositions=[{x:570,y:486,w:65,h:44},{x:1580,y:486,w:70,h:44},{x:2570,y:486,w:75,h:44},{x:3210,y:486,w:60,h:44}];
  const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  function createGame(){return {mode:'intro',p:{x:140,y:410,w:85,h:112,vx:0,vy:0,face:1,grounded:false,fuel:FUEL,health:3,invulnerable:0},stars:starPositions.map(([x,y])=>({x,y,taken:false})),thorns:thornPositions.map(t=>({...t,removed:false})),shots:[],particles:[],cooldown:0,collected:0,time:0,camera:0,checkpoint:{x:140,y:410},notice:'',noticeTime:0,jumpWas:false,magicWas:false};}
  function notice(g,text){g.notice=text;g.noticeTime=3;}
  function hurt(g,fall=false){const p=g.p;if(p.invulnerable>0&&!fall)return;p.health--;g.shots=[];if(p.health<=0){g.mode='lost';notice(g,'Ett nytt försök väntar!');return;}p.x=g.checkpoint.x;p.y=g.checkpoint.y;p.vx=0;p.vy=0;p.fuel=FUEL;p.invulnerable=1.8;notice(g,fall?'Hoppa över ravinen och håll inne för att flyga!':'Aj, törnen! Använd magi eller hoppa över dem.');}
  function step(g,input,dt){
    if(g.mode!=='playing')return; dt=Math.min(dt,1/60);const p=g.p;g.time+=dt;g.noticeTime=Math.max(0,g.noticeTime-dt);g.cooldown=Math.max(0,g.cooldown-dt);p.invulnerable=Math.max(0,p.invulnerable-dt);
    const direction=Number(!!input.right)-Number(!!input.left);p.vx=direction*SPEED;if(direction)p.face=direction;
    const jumpPressed=input.jump&&!g.jumpWas;
    if(jumpPressed&&p.grounded){p.vy=-650;p.grounded=false;}
    if(input.jump&&!p.grounded&&p.fuel>0&&p.vy>-280){p.vy-=2100*dt;p.vy=Math.max(-220,p.vy);p.fuel=Math.max(0,p.fuel-dt);}
    if(input.magic&&!g.magicWas&&g.cooldown===0){g.cooldown=.65;const x=p.x+p.w/2+p.face*45,y=p.y+30;const target=g.thorns.filter(t=>!t.removed&&(t.x+t.w/2-x)*p.face>0&&(t.x+t.w/2-x)*p.face<400).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0];const vy=target?(target.y+20-y)/Math.max(.08,Math.abs(target.x+target.w/2-x)/640):0;g.shots.push({x,y,vx:p.face*640,vy,life:.65});notice(g,'Stjärnmagi!');}
    g.jumpWas=!!input.jump;g.magicWas=!!input.magic;
    p.x+=p.vx*dt;p.x=Math.max(0,Math.min(W-p.w,p.x));
    for(const s of surfaces){if(overlap(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w;}}
    const oldY=p.y;p.vy+=GRAVITY*dt;p.y+=p.vy*dt;p.grounded=false;
    for(const s of surfaces){if(overlap(p,s)){if(p.vy>=0&&oldY+p.h<=s.y+2){p.y=s.y-p.h;p.vy=0;p.grounded=true;}else if(p.vy<0&&oldY>=s.y+s.h-2){p.y=s.y+s.h;p.vy=0;}}}
    if(p.grounded){p.fuel=Math.min(FUEL,p.fuel+dt*3);if(p.x>g.checkpoint.x+350){g.checkpoint={x:p.x,y:p.y};}}
    if(p.y<-35){p.y=-35;p.vy=Math.max(0,p.vy);}
    for(const shot of g.shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;for(const t of g.thorns){if(!t.removed&&shot.x>t.x-18&&shot.x<t.x+t.w+18&&shot.y>t.y-28&&shot.y<t.y+t.h+18){t.removed=true;shot.life=0;burst(g,t.x+t.w/2,t.y,'#d5b1ef',22);notice(g,'Törnena försvann!');}}}
    g.shots=g.shots.filter(s=>s.life>0);
    for(const s of g.stars){if(!s.taken&&overlap(p,{x:s.x-17,y:s.y-17,w:34,h:34})){s.taken=true;g.collected++;burst(g,s.x,s.y,'#ffe599',14);}}
    for(const t of g.thorns){if(!t.removed&&overlap(p,{x:t.x+10,y:t.y+10,w:t.w-20,h:t.h-10})){hurt(g);break;}}
    if(p.y>H+80)hurt(g,true);
    if(g.mode==='playing'&&p.x>3600&&p.grounded){g.mode='won';burst(g,p.x,p.y,'#ffe599',60);}
    for(const q of g.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=150*dt;q.life-=dt;}g.particles=g.particles.filter(q=>q.life>0);
    g.camera=Math.max(0,Math.min(W-1200,p.x-360));
  }
  function burst(g,x,y,color,n){for(let i=0;i<n;i++){const a=i/n*Math.PI*2;g.particles.push({x,y,vx:Math.cos(a)*90,vy:Math.sin(a)*90-35,life:.7,color});}}
  const api={createGame,step,surfaces,starPositions,overlap,FUEL,W,H,SPEED};root.MollyCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
