const {test}=require('node:test');const assert=require('node:assert/strict');const C=require('../core.js');
function game(){const g=C.createGame();g.mode='playing';return g;}
function run(g,input,n){for(let i=0;i<n;i++)C.step(g,input,1/120);}
test('Landning, rörelse och världens kanter',()=>{const g=game();run(g,{},60);assert.equal(g.p.y,418);assert.equal(g.p.grounded,true);run(g,{left:true},120);assert.equal(g.p.x,0);run(g,{right:true},100);assert(g.p.x>250);});
test('Hopp och flygkraft förbrukas, fylls på vid landning',()=>{const g=game();run(g,{},30);run(g,{jump:true},220);assert.equal(g.p.fuel,0);assert(g.p.y<418);run(g,{},180);assert(g.p.grounded);assert.equal(g.p.fuel,C.FUEL);});
test('Magi tar bort törnen och har återhämtning',()=>{const g=game();run(g,{},30);g.p.x=450;run(g,{magic:true},20);assert(g.thorns[0].removed);assert(g.cooldown>0);assert.equal(g.shots.length,0);});
test('Stjärnor räknas en gång',()=>{const g=game();g.p.x=280;g.p.y=418;run(g,{},60);assert.equal(g.collected,1);run(g,{},60);assert.equal(g.collected,1);});
test('Törnen, kort skydd, fall och förlust',()=>{const g=game();g.p.x=580;g.p.y=418;run(g,{},1);assert.equal(g.p.health,2);g.p.x=580;g.p.y=418;run(g,{},1);assert.equal(g.p.health,2);g.p.y=800;run(g,{},1);assert.equal(g.p.health,1);g.p.y=800;run(g,{},1);assert.equal(g.mode,'lost');});
test('Plattform stoppar från sidan och går att landa på',()=>{const g=game();g.p.x=1184;g.p.y=300;run(g,{right:true},1);assert(g.p.x<=1270-g.p.w);g.p.x=1340;g.p.y=180;g.p.vy=150;run(g,{},100);assert.equal(g.p.y,365-g.p.h);assert(g.p.grounded);});
test('Hela banan går att klara utan att flytta spelaren i testet',()=>{const g=game();for(let i=0;i<8000&&g.mode==='playing';i++){const p=g.p;const needJump=[780,1800,2750].some(x=>p.x>x-140&&p.x<x+260);C.step(g,{right:true,jump:needJump&&(!p.grounded||!g.jumpWas),magic:i%90===0},1/120);}assert.equal(g.mode,'won');assert.equal(g.p.health,3);assert(g.collected>=5);});
test('Pausen fryser simulationen och start ger nytt spel',()=>{const g=game();g.mode='paused';run(g,{right:true},100);assert.equal(g.p.x,140);assert.equal(C.createGame().collected,0);});
