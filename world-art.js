/* Scenery and small collectibles drawn in world coordinates. */
(function(root){
  'use strict';
  function label(ctx,x,y,text){ctx.font='14px Georgia';const w=ctx.measureText(text).width;ctx.fillStyle='#fff9efef';ctx.beginPath();ctx.roundRect(x-w/2-12,y-20,w+24,31,10);ctx.fill();ctx.fillStyle='#685175';ctx.textAlign='center';ctx.fillText(text,x,y);}
  function candy(ctx,x,y,type=0,scale=1){
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.rotate(-.2);
    const colors=['#df88ac','#95bec6','#bc9ed9'],color=colors[type%3];
    ctx.fillStyle=color;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*13,-8);ctx.lineTo(side*28,-15);ctx.lineTo(side*25,0);ctx.lineTo(side*28,15);ctx.lineTo(side*13,8);ctx.fill();}
    const grad=ctx.createLinearGradient(0,-15,0,15);grad.addColorStop(0,'#fff4e8');grad.addColorStop(.3,color);grad.addColorStop(1,'#986582');ctx.fillStyle=grad;ctx.beginPath();ctx.ellipse(0,0,18,14,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#fff9efb0';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-7,-10);ctx.lineTo(-1,10);ctx.moveTo(5,-10);ctx.lineTo(11,7);ctx.stroke();ctx.restore();
  }
  function carrot(ctx,x,y){ctx.save();ctx.translate(x,y);ctx.rotate(.28);ctx.fillStyle='#eca451';ctx.beginPath();ctx.moveTo(-11,-10);ctx.quadraticCurveTo(-2,32,0,25);ctx.quadraticCurveTo(10,2,11,-10);ctx.closePath();ctx.fill();ctx.strokeStyle='#bc7b40';ctx.lineWidth=2;for(const n of [0,7,14]){ctx.beginPath();ctx.moveTo(-6+n/4,n);ctx.lineTo(3,n+2);ctx.stroke();}ctx.strokeStyle='#74a767';ctx.lineWidth=5;for(const dx of [-12,0,12]){ctx.beginPath();ctx.moveTo(0,-10);ctx.quadraticCurveTo(dx,-20,dx,-32);ctx.stroke();}ctx.restore();}
  function cone(ctx,x,y,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);const grad=ctx.createLinearGradient(-18,0,18,0);grad.addColorStop(0,'#b98954');grad.addColorStop(.6,'#e5be86');grad.addColorStop(1,'#bd8c58');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(-17,0);ctx.lineTo(0,44);ctx.lineTo(17,0);ctx.closePath();ctx.fill();ctx.strokeStyle='#b5875560';ctx.lineWidth=2;for(let i=8;i<35;i+=8){ctx.beginPath();ctx.moveTo(-15+i/3,i);ctx.lineTo(15-i/3,i);ctx.stroke();}for(const [dx,dy,color] of [[-8,-8,'#e4a2ba'],[9,-11,'#b8d5b8'],[0,-25,'#fff0ce']]){ctx.fillStyle=color;ctx.beginPath();ctx.arc(dx,dy,15,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffffff50';ctx.beginPath();ctx.arc(dx-5,dy-5,5,0,Math.PI*2);ctx.fill();}ctx.restore();}
  function flower(ctx,x,time){ctx.save();ctx.translate(x,508);ctx.strokeStyle='#86a363';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,22);ctx.lineTo(0,-6);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.fillStyle=i%2?'#d8b2d7':'#eed0e5';ctx.beginPath();ctx.ellipse(Math.cos(a)*19,Math.sin(a)*9,13,7,a,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#efcf76';ctx.beginPath();ctx.ellipse(0,-2+Math.sin(time*2)*2,12,7,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  function hurdle(ctx,h){ctx.save();ctx.fillStyle='#977957';ctx.fillRect(h.x+6,h.y,9,h.h);ctx.fillRect(h.x+h.w-15,h.y,9,h.h);for(const y of [h.y+7,h.y+29]){ctx.fillStyle='#f4dfc2';ctx.fillRect(h.x,y,h.w,9);for(let i=0;i<h.w;i+=22){ctx.fillStyle='#bc9cce';ctx.fillRect(h.x+i,y,11,9);}}ctx.restore();}
  function gift(ctx,a,time){ctx.save();ctx.translate(a.x,530);ctx.fillStyle=a.done?'#c3a5bf':'#b898c9';ctx.beginPath();ctx.roundRect(-30,-52,60,52,6);ctx.fill();ctx.fillStyle='#f2d58f';ctx.fillRect(-5,-52,10,52);ctx.fillRect(-30,-30,60,9);ctx.save();ctx.translate(0,a.done?-70:-52);ctx.rotate(a.done?-.25:Math.sin(time*2)*.025);ctx.fillStyle='#dbc5e5';ctx.beginPath();ctx.roundRect(-34,-9,68,13,4);ctx.fill();ctx.strokeStyle='#ebd088';ctx.lineWidth=4;for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*10,-14,11,5,side*.4,0,Math.PI*2);ctx.stroke();}ctx.restore();if(a.done){candy(ctx,-12,-48,0,.6);candy(ctx,15,-48,1,.6);}ctx.restore();label(ctx,a.x,580,a.done?'Presenten är öppnad!':'Magi: öppna presenten');}
  function draw(ctx,g,C,images){
    const visible=x=>x>g.camera-250&&x<g.camera+1450;
    for(const x of [1660,2040,2780])if(visible(x)){ctx.fillStyle='#f6e6cc';ctx.fillRect(x-3,338,6,190);ctx.fillStyle='#dfabbf';ctx.beginPath();ctx.arc(x,336,37,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff0de';ctx.lineWidth=7;ctx.beginPath();for(let i=0;i<90;i++){const a=i*.18,r=i*.34;const px=x+Math.cos(a)*r,py=336+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
    if(g.camera>6500){ctx.strokeStyle='#ab8c74';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(7490,290);ctx.quadraticCurveTo(7910,340,8390,280);ctx.stroke();for(let x=7520,i=0;x<8370;x+=70,i++){const y=290+Math.sin((x-7490)/900*Math.PI)*25;ctx.fillStyle=['#dfabc4','#c3b6df','#e8d397','#b9d2b3'][i%4];ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+35,y+3);ctx.lineTo(x+16,y+40);ctx.closePath();ctx.fill();}}
    for(const a of g.activities){if(!visible(a.x))continue;
      if(a.kind==='gift')gift(ctx,a,g.time);
      if(a.kind==='icecream'){ctx.drawImage(images.cart,a.x-123,306,246,225);label(ctx,a.x,580,a.done?'Mums! Glasspausen är klar':'Glasspaus · Magi');}
      if(a.kind==='pony'){ctx.drawImage(images.pony,a.x-75,355,270,180);label(ctx,a.x+50,580,a.done?'Hästvännen säger tack!':'3 morötter till hästvännen');if(a.done){ctx.font='30px Georgia';ctx.fillStyle='#d287aa';ctx.textAlign='center';ctx.fillText('♥',a.x+20,335+Math.sin(g.time*3)*6);}}
    }
    for(const h of C.hurdles)if(visible(h.x)){hurdle(ctx,h);label(ctx,h.x+h.w/2,580,'Litet ridhinder · Hoppa');}
    for(const x of C.flowers)if(visible(x)){flower(ctx,x,g.time);label(ctx,x,580,'Blomsterhopp');}
    for(const s of g.candies)if(!s.taken&&visible(s.x))candy(ctx,s.x,s.y+Math.sin(g.time*2+s.x)*4,s.type);
    for(const s of g.carrots)if(!s.taken&&visible(s.x))carrot(ctx,s.x,s.y);
    if(g.icecreamTime>0)cone(ctx,g.p.x+g.p.w/2,g.p.y-35+Math.sin(g.time*3)*4,.75);
  }
  root.MollyArt={draw};
})(window);
