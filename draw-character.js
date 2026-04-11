// ═══════════════════════════════════════════════════════
//  CHARACTER & PROPS DRAWING SYSTEM
//  Separated from index.html for maintainability
//  Depends on: rand, randInt, clamp, liftColor, roundRect, PALETTES, drawHeart
//  (all defined in index.html, loaded before this script)
// ═══════════════════════════════════════════════════════

// ── PROPS ──
function drawProps(ctx,W,H,GY,S,props,chars,artStyle,t){
  if(!props||!props.length||!chars.length)return;
  const allArrived=chars.every(c=>c.arrived);
  if(!allArrived)return;
  const pal=PALETTES[artStyle]||PALETTES.anime;
  const color=pal.char1;
  const cx=chars[0].x;

  for(const prop of props){
    if(prop==='bag'){
      const bx=cx-S*2.8,by=GY-S*.95;
      ctx.save();
      ctx.fillStyle=color;ctx.strokeStyle=pal.outline||'rgba(120,80,50,0.32)';ctx.lineWidth=Math.max(1,S*.09);
      roundRect(ctx,bx-S*.38,by-S*.52,S*.76,S*.72,S*.1);ctx.fill();ctx.stroke();
      // Strap
      ctx.strokeStyle=liftColor(color,-.1)||color;ctx.lineWidth=Math.max(1,S*.07);
      ctx.beginPath();ctx.moveTo(bx-S*.3,by-S*.52);ctx.quadraticCurveTo(bx-S*.55,by-S*.8,bx,by-S*.88);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx+S*.3,by-S*.52);ctx.quadraticCurveTo(bx+S*.55,by-S*.8,bx,by-S*.88);ctx.stroke();
      // Pocket
      ctx.fillStyle='rgba(0,0,0,0.08)';roundRect(ctx,bx-S*.22,by-S*.02,S*.44,S*.3,S*.06);ctx.fill();ctx.stroke();
      ctx.restore();
    }
    else if(prop==='flower'){
      const fx=cx+S*2.6,fy=GY-S*.88;
      ctx.save();
      // Stem
      ctx.strokeStyle='rgba(100,180,100,0.75)';ctx.lineWidth=S*.06;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(fx,fy+S*.5);ctx.lineTo(fx,fy-S*.2);ctx.stroke();
      // Petals
      const petalCols=['#FF99BB','#FFB3CC','#FF88AA'];
      for(let p=0;p<5;p++){
        const a=(p/5)*Math.PI*2;
        ctx.fillStyle=petalCols[p%petalCols.length];ctx.globalAlpha=0.85;
        ctx.beginPath();ctx.ellipse(fx+Math.cos(a)*S*.22,fy-S*.18+Math.sin(a)*S*.22,S*.14,S*.1,a,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='#FFE566';ctx.globalAlpha=1;
      ctx.beginPath();ctx.arc(fx,fy-S*.18,S*.1,0,Math.PI*2);ctx.fill();
      // Second flower
      for(let p=0;p<5;p++){
        const a=(p/5)*Math.PI*2+.6;
        ctx.fillStyle='#FFB3CC';ctx.globalAlpha=0.75;
        ctx.beginPath();ctx.ellipse(fx+S*.35+Math.cos(a)*S*.18,fy-S*.1+Math.sin(a)*S*.18,S*.11,S*.08,a,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='#FFF566';ctx.globalAlpha=1;ctx.beginPath();ctx.arc(fx+S*.35,fy-S*.1,S*.08,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    else if(prop==='headphones'){
      const hx=cx,hy=GY-S*3.22;
      ctx.save();
      ctx.strokeStyle='rgba(50,50,80,0.7)';ctx.lineWidth=S*.12;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(hx,hy+S*.2,S*.38,Math.PI*.85,Math.PI*.15,false);ctx.stroke();
      ctx.fillStyle='rgba(50,50,80,0.75)';ctx.strokeStyle='rgba(80,80,120,0.5)';ctx.lineWidth=S*.08;
      [hx-S*.36,hx+S*.36].forEach(ex=>{
        ctx.beginPath();ctx.ellipse(ex,hy+S*.2,S*.14,S*.18,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      });
      ctx.restore();
    }
    else if(prop==='ball'){
      const bx=cx+S*2.8,by=GY-S*.22;
      ctx.save();
      ctx.fillStyle='rgba(255,255,255,0.85)';ctx.strokeStyle='rgba(60,60,60,0.45)';ctx.lineWidth=S*.07;
      ctx.beginPath();ctx.arc(bx,by,S*.32,0,Math.PI*2);ctx.fill();ctx.stroke();
      // Soccer pattern
      ctx.fillStyle='rgba(30,30,30,0.55)';
      ctx.beginPath();ctx.arc(bx+S*.08,by-S*.1,S*.1,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(bx-S*.14,by+S*.08,S*.08,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(bx+S*.12,by+S*.12,S*.07,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    else if(prop==='phone'){
      const px=cx+S*2.7,py=GY-S*.98;
      ctx.save();
      ctx.fillStyle='#0A0A20';ctx.strokeStyle=color;ctx.lineWidth=Math.max(1.5,S*.1);
      ctx.beginPath();roundRect(ctx,px-S*.22,py-S*.4,S*.44,S*.72,S*.07);ctx.fill();ctx.stroke();
      // Screen glow
      ctx.fillStyle='#2255CC';ctx.globalAlpha=.5+.25*Math.sin(t*2.8);
      ctx.beginPath();roundRect(ctx,px-S*.14,py-S*.3,S*.28,S*.48,S*.04);ctx.fill();
      // Camera dot
      ctx.fillStyle=color;ctx.globalAlpha=.6;
      ctx.beginPath();ctx.arc(px,py-S*.36,S*.03,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    else if(prop==='game'||prop==='computer'){
      const isGame=prop==='game';
      const px=cx+S*.35,py=GY-S*2.3;
      ctx.save();
      ctx.fillStyle='#06060F';ctx.strokeStyle=color;ctx.lineWidth=Math.max(2,S*.11);
      // Monitor frame
      ctx.beginPath();roundRect(ctx,px-S*.9,py-S*.72,S*1.8,S*1.28,S*.08);ctx.fill();ctx.stroke();
      // Screen
      ctx.fillStyle=isGame?'rgba(0,30,120,0.9)':'rgba(0,50,100,0.9)';
      ctx.beginPath();roundRect(ctx,px-S*.75,py-S*.58,S*1.5,S*1.0,S*.05);ctx.fill();
      // Screen glow
      ctx.fillStyle=isGame?`rgba(20,80,255,${.3+.2*Math.sin(t*3.5)})`:`rgba(0,150,200,${.25+.15*Math.sin(t*2)})`;
      ctx.beginPath();roundRect(ctx,px-S*.75,py-S*.58,S*1.5,S*1.0,S*.05);ctx.fill();
      // Game: crosshair or pixelated detail
      if(isGame){
        ctx.strokeStyle='rgba(80,180,255,0.5)';ctx.lineWidth=S*.04;
        ctx.beginPath();ctx.moveTo(px,py-S*.3);ctx.lineTo(px,py+S*.1);ctx.stroke();
        ctx.beginPath();ctx.moveTo(px-S*.25,py-S*.1);ctx.lineTo(px+S*.25,py-S*.1);ctx.stroke();
      }
      // Stand
      ctx.strokeStyle=color;ctx.lineWidth=S*.1;
      ctx.beginPath();ctx.moveTo(px,py+S*.56);ctx.lineTo(px,py+S*.82);
      ctx.moveTo(px-S*.35,py+S*.82);ctx.lineTo(px+S*.35,py+S*.82);ctx.stroke();
      // Desk surface
      ctx.strokeStyle=color;ctx.globalAlpha=.2;ctx.lineWidth=S*.08;
      ctx.beginPath();ctx.moveTo(cx-S*1.5,py+S*.82);ctx.lineTo(cx+S*1.5,py+S*.82);ctx.stroke();
      ctx.restore();
    }
    else if(prop==='book'){
      const px=cx,py=GY-S*.65;
      ctx.save();ctx.globalAlpha=.9;
      ctx.fillStyle='#F0E8D0';ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,S*.08);
      // Left page
      ctx.beginPath();
      ctx.moveTo(px-S*.07,py-S*.44);ctx.lineTo(px-S*.07,py+S*.08);
      ctx.lineTo(px-S*.78,py+S*.04);ctx.lineTo(px-S*.78,py-S*.42);ctx.closePath();
      ctx.fill();ctx.stroke();
      // Right page
      ctx.beginPath();
      ctx.moveTo(px+S*.07,py-S*.44);ctx.lineTo(px+S*.07,py+S*.08);
      ctx.lineTo(px+S*.78,py+S*.04);ctx.lineTo(px+S*.78,py-S*.42);ctx.closePath();
      ctx.fill();ctx.stroke();
      // Spine
      ctx.fillStyle='#C8A060';ctx.beginPath();
      ctx.moveTo(px-S*.07,py-S*.44);ctx.lineTo(px-S*.07,py+S*.08);
      ctx.lineTo(px+S*.07,py+S*.08);ctx.lineTo(px+S*.07,py-S*.44);ctx.closePath();ctx.fill();
      // Text lines
      ctx.strokeStyle='rgba(0,0,0,.16)';ctx.lineWidth=S*.022;
      for(let i=0;i<4;i++){
        const ly=py-S*.32+i*S*.1;
        ctx.beginPath();ctx.moveTo(px-S*.65,ly);ctx.lineTo(px-S*.12,ly);ctx.stroke();
        ctx.beginPath();ctx.moveTo(px+S*.12,ly);ctx.lineTo(px+S*.65,ly);ctx.stroke();
      }
      ctx.restore();
    }
    else if(prop==='coffee'){
      const px=cx+S*2.5,py=GY-S*.32;
      ctx.save();
      ctx.fillStyle='#1E0C04';ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,S*.08);
      // Cup body
      ctx.beginPath();
      ctx.moveTo(px-S*.24,py-S*.55);ctx.lineTo(px-S*.17,py+S*.02);
      ctx.lineTo(px+S*.17,py+S*.02);ctx.lineTo(px+S*.24,py-S*.55);ctx.closePath();
      ctx.fill();ctx.stroke();
      // Handle
      ctx.beginPath();ctx.arc(px+S*.3,py-S*.28,S*.18,-.55,Math.PI*.85,false);ctx.stroke();
      // Coffee surface
      ctx.fillStyle='#7A4420';ctx.globalAlpha=.9;
      ctx.beginPath();ctx.ellipse(px,py-S*.54,S*.23,S*.08,0,0,Math.PI*2);ctx.fill();
      // Steam wisps
      ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=S*.04;ctx.globalAlpha=1;
      for(let i=0;i<2;i++){
        const sx=px+(i-.5)*S*.15;
        ctx.beginPath();ctx.moveTo(sx,py-S*.55);
        ctx.quadraticCurveTo(sx+S*.12*Math.sin(t*2+i*1.4),py-S*.82,sx,py-S*1.08);ctx.stroke();
      }
      ctx.restore();
    }
    else if(prop==='food'){
      const px=cx+S*2.6,py=GY-S*.22;
      ctx.save();
      ctx.fillStyle='#EEE6D8';ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,S*.08);
      // Bowl
      ctx.beginPath();
      ctx.moveTo(px-S*.42,py-S*.32);
      ctx.quadraticCurveTo(px-S*.48,py+S*.05,px,py+S*.12);
      ctx.quadraticCurveTo(px+S*.48,py+S*.05,px+S*.42,py-S*.32);ctx.closePath();
      ctx.fill();ctx.stroke();
      // Rim
      ctx.beginPath();ctx.ellipse(px,py-S*.32,S*.42,S*.1,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      // Food surface
      ctx.fillStyle='#C89A50';ctx.globalAlpha=.9;
      ctx.beginPath();ctx.ellipse(px,py-S*.29,S*.32,S*.1,0,0,Math.PI*2);ctx.fill();
      // Chopsticks
      ctx.strokeStyle=color;ctx.lineWidth=S*.04;ctx.globalAlpha=.7;
      ctx.beginPath();ctx.moveTo(px+S*.1,py-S*.5);ctx.lineTo(px+S*.35,py-S*.12);ctx.stroke();
      ctx.beginPath();ctx.moveTo(px+S*.2,py-S*.52);ctx.lineTo(px+S*.44,py-S*.12);ctx.stroke();
      ctx.restore();
    }
    else if(prop==='music'){
      ctx.save();
      const notes=['♪','♫','♩'];
      ctx.font=`bold ${S*.72}px serif`;ctx.textAlign='center';
      for(let i=0;i<3;i++){
        const angle=t*.65+i*(Math.PI*2/3);
        const nx=cx+Math.cos(angle)*S*2.8;
        const ny=GY-S*4.5+Math.sin(t*1.2+i*1.4)*S*.7;
        ctx.globalAlpha=.38+.38*Math.abs(Math.sin(t*1.3+i*2.2));
        ctx.fillStyle=pal.accent;
        ctx.fillText(notes[i%notes.length],nx,ny);
      }
      ctx.restore();
    }
    else if(prop==='tv'){
      const px=W*.5,py=GY-S*3.9;
      ctx.save();
      ctx.fillStyle='#080810';ctx.strokeStyle=color;ctx.lineWidth=Math.max(2,S*.13);
      // TV frame
      ctx.beginPath();roundRect(ctx,px-S*2.1,py-S*1.35,S*4.2,S*2.55,S*.12);ctx.fill();ctx.stroke();
      // Screen
      ctx.fillStyle=`rgba(0,40,130,${.55+.15*Math.sin(t*1.4)})`;
      ctx.beginPath();roundRect(ctx,px-S*1.88,py-S*1.15,S*3.76,S*2.15,S*.07);ctx.fill();
      // Scanlines
      ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=S*.045;
      for(let i=0;i<9;i++){
        const ly=py-S*1.15+i*S*.24;
        ctx.beginPath();ctx.moveTo(px-S*1.88,ly);ctx.lineTo(px+S*1.88,ly);ctx.stroke();
      }
      // Stand neck
      ctx.strokeStyle=color;ctx.lineWidth=S*.1;
      ctx.beginPath();ctx.moveTo(px,py+S*1.2);ctx.lineTo(px,py+S*1.5);
      ctx.moveTo(px-S*.55,py+S*1.5);ctx.lineTo(px+S*.55,py+S*1.5);ctx.stroke();
      ctx.restore();
    }
  }
}

// ═══════════════════════════════════════════════════════
//  ILLUSTRATED HUMAN CHARACTER SYSTEM
// ═══════════════════════════════════════════════════════
// clothing palette per style and character index (A=0, B=1, C=2)
function getClothingColors(style, charIdx=0){
  const rows=[
    // Character A — beige sweatshirt, neat black hair, friendly smile
    {anime:{shirt:'#E8D5B7',pants:'#6B8CAE',shoe:'#3A2A1C',hair:'#131313'},
     comic:{shirt:'#EDCFA0',pants:'#527090',shoe:'#2C2010',hair:'#0A0A0A'},
     minimal:{shirt:'#E4D2B0',pants:'#7A8CA0',shoe:'#504030',hair:'#1A1A1A'},
     sketch:{shirt:'#D8C8A0',pants:'#5C7A8A',shoe:'#403428',hair:'#0E0E0E'}},
    // Character B — yellow cardigan, bobbed brown hair, expressive
    {anime:{shirt:'#FFD54F',pants:'#D4A88A',shoe:'#7A4A2A',hair:'#8B4513'},
     comic:{shirt:'#FFCA28',pants:'#C49070',shoe:'#6A3A1C',hair:'#6B3010'},
     minimal:{shirt:'#FFD880',pants:'#C8A080',shoe:'#7A5040',hair:'#7A4A20'},
     sketch:{shirt:'#F5C842',pants:'#B89070',shoe:'#5A3828',hair:'#5A3018'}},
    // Character C — blue hoodie, neat black hair, glasses (focused)
    {anime:{shirt:'#5B8DC8',pants:'#374B5E',shoe:'#1A2030',hair:'#0A0A14'},
     comic:{shirt:'#4A7AC0',pants:'#2E3A4E',shoe:'#101820',hair:'#080810'},
     minimal:{shirt:'#6890C0',pants:'#44546A',shoe:'#2A3040',hair:'#0E0E18'},
     sketch:{shirt:'#5078AA',pants:'#3A4858',shoe:'#202830',hair:'#080812'}},
  ];
  const row=rows[Math.min(charIdx,rows.length-1)];
  return row[style]||row.anime;
}

// filled tapered capsule limb
function drawFilledLimb(ctx,x1,y1,r1,x2,y2,r2,fillColor,outlineColor){
  const angle=Math.atan2(y2-y1,x2-x1);
  const perp=angle+Math.PI/2;
  const cp=Math.cos(perp),sp=Math.sin(perp);
  ctx.save();
  ctx.fillStyle=fillColor;
  ctx.beginPath();
  ctx.moveTo(x1+cp*r1,y1+sp*r1);
  ctx.lineTo(x2+cp*r2,y2+sp*r2);
  ctx.arc(x2,y2,r2,perp,perp+Math.PI,true);
  ctx.lineTo(x1-cp*r1,y1-sp*r1);
  ctx.arc(x1,y1,r1,perp+Math.PI,perp,true);
  ctx.closePath();
  ctx.fill();
  if(outlineColor){ctx.strokeStyle=outlineColor;ctx.lineWidth=1.2;ctx.stroke();}
  // inner highlight
  const mx=(x1+x2)/2,my=(y1+y2)/2,len=Math.hypot(x2-x1,y2-y1)||1;
  ctx.save();ctx.globalAlpha=0.16;ctx.fillStyle='rgba(255,255,255,0.9)';
  ctx.beginPath();ctx.ellipse(mx+cp*(r1+r2)*.22,my+sp*(r1+r2)*.22,(r1+r2)*.22,len*.26,angle,0,Math.PI*2);
  ctx.fill();ctx.restore();
  ctx.restore();
}

function drawCharacter(ctx,cx,cy,S,action,emotion,t,facing,_skin,_style,charIdx=0){
  drawPuppyChar(ctx,cx,cy,S,action,emotion,t,facing,charIdx);
}

function sl(ctx,a,b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}

function drawHumanLeg(ctx,hip,knee,foot,S,cl,skin,outline){
  drawFilledLimb(ctx,hip.x,hip.y,S*.19,knee.x,knee.y,S*.16,cl.pants,outline);
  drawFilledLimb(ctx,knee.x,knee.y,S*.16,foot.x,foot.y,S*.13,cl.pants,outline);
  drawHumanShoe(ctx,foot.x,foot.y,S,cl.shoe,outline);
  // knee highlight
  ctx.save();ctx.fillStyle='rgba(255,255,255,0.14)';
  ctx.beginPath();ctx.arc(knee.x,knee.y,S*.07,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawHumanArm(ctx,neck,elbow,hand,S,cl,skin,outline){
  drawFilledLimb(ctx,neck.x,neck.y,S*.13,elbow.x,elbow.y,S*.11,cl.shirt,outline);
  drawFilledLimb(ctx,elbow.x,elbow.y,S*.11,hand.x,hand.y,S*.085,skin,outline);
  // hand
  ctx.save();ctx.fillStyle=skin;ctx.strokeStyle=outline;ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(hand.x,hand.y,S*.1,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.restore();
}

function drawHumanShoe(ctx,fx,fy,S,shoeColor,outline){
  ctx.save();ctx.fillStyle=shoeColor;ctx.strokeStyle=outline;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.ellipse(fx+S*.12,fy,S*.24,S*.13,0.18,0,Math.PI*2);
  ctx.fill();ctx.stroke();ctx.restore();
}

function drawHumanTorso(ctx,neck,hip,S,cl,skin,outline){
  const tw=S*.28,bw=S*.24;
  const nx=neck.x,ny=neck.y,hx=hip.x,hy=hip.y;
  const len=Math.hypot(hx-nx,hy-ny)||1;
  const angle=Math.atan2(hy-ny,hx-nx);
  const perp=angle+Math.PI/2;
  const cp=Math.cos(perp),sp=Math.sin(perp);
  ctx.save();
  ctx.fillStyle=cl.shirt;ctx.strokeStyle=outline;ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(nx+cp*tw,ny+sp*tw);
  ctx.lineTo(hx+cp*bw,hy+sp*bw);
  ctx.arc(hx,hy,bw,perp,perp+Math.PI,true);
  ctx.lineTo(nx-cp*tw,ny-sp*tw);
  ctx.arc(nx,ny,tw,perp+Math.PI,perp,true);
  ctx.closePath();ctx.fill();ctx.stroke();
  // shirt highlight
  ctx.fillStyle='rgba(255,255,255,0.16)';
  ctx.beginPath();ctx.ellipse(nx+cp*tw*.38,ny+sp*tw*.38,tw*.32,len*.26,angle,0,Math.PI*2);ctx.fill();
  // neck
  ctx.fillStyle=skin;ctx.strokeStyle=outline;ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(nx,ny,S*.095,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.restore();
}

function drawHumanHead(ctx,hx,hy,S,skinColor,outline,emotion,action,t,style,cl,charIdx=0){
  const r=S*.36;
  ctx.save();
  drawHumanHair(ctx,hx,hy,r,cl.hair,outline,style,charIdx);
  // head sphere
  const hg=ctx.createRadialGradient(hx-r*.28,hy-r*.28,0,hx,hy,r*1.1);
  hg.addColorStop(0,liftColor(skinColor,.2));
  hg.addColorStop(.6,skinColor);
  hg.addColorStop(1,liftColor(skinColor,-.1));
  ctx.fillStyle=hg;ctx.strokeStyle=outline;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(hx,hy,r,0,Math.PI*2);ctx.fill();ctx.stroke();
  // specular
  ctx.fillStyle='rgba(255,255,255,0.22)';
  ctx.beginPath();ctx.ellipse(hx-r*.28,hy-r*.26,r*.17,r*.11,-Math.PI*.4,0,Math.PI*2);ctx.fill();
  drawHumanFace(ctx,hx,hy,r,emotion,action,t,style,charIdx);
  ctx.restore();
}

function drawHumanHair(ctx,hx,hy,r,hairColor,outline,style,charIdx=0){
  ctx.save();
  // back volume
  ctx.fillStyle=liftColor(hairColor,-.06);ctx.globalAlpha=0.9;
  ctx.beginPath();ctx.arc(hx,hy,r*1.04,0,Math.PI*2);ctx.fill();
  // top cap — character B gets wavy hair, C gets shorter neat hair
  ctx.fillStyle=hairColor;ctx.globalAlpha=1;
  if(charIdx===1){
    // Bob cut — rounded top cap
    ctx.beginPath();ctx.ellipse(hx,hy-r*.06,r*1.02,r*.9,0,Math.PI,Math.PI*2);ctx.fill();
    // Bob side panels extending straight to jaw level
    ctx.beginPath();
    ctx.moveTo(hx-r*.95,hy);
    ctx.lineTo(hx-r*.88,hy+r*.82);
    ctx.quadraticCurveTo(hx,hy+r*1.02,hx+r*.88,hy+r*.82);
    ctx.lineTo(hx+r*.95,hy);
    ctx.arc(hx,hy,r*.95,0,Math.PI,true);
    ctx.closePath();ctx.fill();
  } else if(charIdx===2){
    // neat short
    ctx.beginPath();ctx.ellipse(hx,hy-r*.22,r*.92,r*.75,0,Math.PI,Math.PI*2);ctx.fill();
  } else {
    ctx.beginPath();ctx.ellipse(hx,hy-r*.18,r*.96,r*.82,0,Math.PI,Math.PI*2);ctx.fill();
  }
  // side strands
  ctx.strokeStyle=liftColor(hairColor,-.12);ctx.lineWidth=r*.14;ctx.lineCap='round';ctx.globalAlpha=0.8;
  if(style==='anime'||style==='minimal'){
    if(charIdx===1){
      // Bob clean strands — straight down to jaw
      ctx.lineWidth=r*.16;
      ctx.beginPath();ctx.moveTo(hx-r*.84,hy+r*.06);ctx.lineTo(hx-r*.82,hy+r*.76);ctx.stroke();
      ctx.beginPath();ctx.moveTo(hx+r*.82,hy+r*.06);ctx.lineTo(hx+r*.80,hy+r*.73);ctx.stroke();
    } else {
      ctx.beginPath();ctx.moveTo(hx-r*.62,hy-r*.72);ctx.quadraticCurveTo(hx-r*.9,hy,hx-r*.75,hy+r*.38);ctx.stroke();
      ctx.beginPath();ctx.moveTo(hx+r*.58,hy-r*.68);ctx.quadraticCurveTo(hx+r*.88,hy,hx+r*.72,hy+r*.35);ctx.stroke();
    }
    // front fringe
    ctx.beginPath();ctx.moveTo(hx-r*.48,hy-r*.88);ctx.quadraticCurveTo(hx-r*.2,hy-r*1.06,hx,hy-r*1.02);ctx.stroke();
    ctx.beginPath();ctx.moveTo(hx+r*.4,hy-r*.86);ctx.quadraticCurveTo(hx+r*.15,hy-r*1.04,hx,hy-r*1.02);ctx.stroke();
  } else {
    ctx.beginPath();ctx.moveTo(hx-r*.6,hy-r*.7);ctx.lineTo(hx-r*.74,hy+r*.28);ctx.stroke();
    ctx.beginPath();ctx.moveTo(hx+r*.56,hy-r*.66);ctx.lineTo(hx+r*.7,hy+r*.25);ctx.stroke();
  }
  // Character C: draw glasses
  if(charIdx===2){
    ctx.globalAlpha=0.7;ctx.strokeStyle='rgba(60,60,90,0.65)';ctx.lineWidth=r*.07;ctx.fillStyle='rgba(180,220,255,0.15)';
    const ex1=hx-r*.3,ex2=hx+r*.3,ey=hy-r*.08,er=r*.16;
    ctx.beginPath();ctx.arc(ex1,ey,er,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.arc(ex2,ey,er,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(ex1+er,ey);ctx.lineTo(ex2-er,ey);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ex1-er,ey);ctx.lineTo(ex1-er-r*.12,ey-r*.04);ctx.moveTo(ex2+er,ey);ctx.lineTo(ex2+er+r*.12,ey-r*.04);ctx.stroke();
  }
  ctx.restore();
}

function drawHumanFace(ctx,hx,hy,r,emotion,action,t,style,charIdx=0){
  ctx.save();
  const eo=r*.3,er=r*.085;
  // eyebrows
  ctx.strokeStyle='rgba(80,50,28,0.68)';ctx.lineWidth=r*.065;ctx.lineCap='round';
  if(emotion==='angry'){
    ctx.beginPath();ctx.moveTo(hx-eo-er*.9,hy-r*.3);ctx.lineTo(hx-eo+er*.5,hy-r*.18);ctx.stroke();
    ctx.beginPath();ctx.moveTo(hx+eo+er*.9,hy-r*.3);ctx.lineTo(hx+eo-er*.5,hy-r*.18);ctx.stroke();
  } else if(['happy','love','excited'].includes(emotion)){
    ctx.beginPath();ctx.arc(hx-eo,hy-r*.26,er*.95,Math.PI+.35,-.35);ctx.stroke();
    ctx.beginPath();ctx.arc(hx+eo,hy-r*.26,er*.95,Math.PI+.35,-.35);ctx.stroke();
  } else if(charIdx===2){
    // Character C: slightly furrowed focused brows
    ctx.beginPath();ctx.moveTo(hx-eo-er*.75,hy-r*.22);ctx.lineTo(hx-eo+er*.75,hy-r*.26);ctx.stroke();
    ctx.beginPath();ctx.moveTo(hx+eo-er*.75,hy-r*.26);ctx.lineTo(hx+eo+er*.75,hy-r*.22);ctx.stroke();
  } else {
    ctx.beginPath();ctx.moveTo(hx-eo-er*.75,hy-r*.25);ctx.lineTo(hx-eo+er*.75,hy-r*.27);ctx.stroke();
    ctx.beginPath();ctx.moveTo(hx+eo-er*.75,hy-r*.27);ctx.lineTo(hx+eo+er*.75,hy-r*.25);ctx.stroke();
  }
  // eyes
  if(action==='sleep'){
    ctx.strokeStyle='rgba(80,50,30,0.55)';ctx.lineWidth=r*.085;
    [hx-eo,hx+eo].forEach(ex=>{ctx.beginPath();ctx.arc(ex,hy-r*.06,er*.92,Math.PI*.1,Math.PI*.9);ctx.stroke();});
  } else {
    const irisCol=['night','lonely','sad'].includes(emotion)?'#6888CC':['love','happy','excited'].includes(emotion)?'#7AACDD':'#6898AA';
    [hx-eo,hx+eo].forEach(ex=>{
      ctx.fillStyle='rgba(255,255,255,0.95)';ctx.beginPath();ctx.ellipse(ex,hy-r*.09,er*1.08,er*1.28,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=irisCol;ctx.beginPath();ctx.ellipse(ex,hy-r*.07,er*.76,er*.96,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#1A1830';ctx.beginPath();ctx.arc(ex,hy-r*.07,er*.46,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.88)';
      ctx.beginPath();ctx.arc(ex-er*.24,hy-r*.12,er*.27,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(ex+er*.16,hy-r*.02,er*.12,0,Math.PI*2);ctx.fill();
    });
  }
  // nose (subtle)
  ctx.strokeStyle='rgba(160,100,70,0.32)';ctx.lineWidth=r*.055;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(hx-er*.38,hy+r*.1);ctx.lineTo(hx,hy+r*.16);ctx.lineTo(hx+er*.38,hy+r*.1);ctx.stroke();
  // mouth
  ctx.strokeStyle='rgba(160,90,70,0.62)';ctx.lineWidth=r*.075;ctx.lineCap='round';
  ctx.beginPath();
  if(['happy','excited'].includes(emotion)||['laugh','dance','jump'].includes(action))
    ctx.arc(hx,hy+r*.24,r*.26,0.1,Math.PI-.1);
  else if(emotion==='love'||['hug','kiss'].includes(action))
    ctx.arc(hx,hy+r*.22,r*.22,.1,Math.PI-.1);
  else if(['sad','lonely'].includes(emotion)||action==='cry')
    ctx.arc(hx,hy+r*.42,r*.26,Math.PI+.15,-0.15);
  else if(emotion==='angry')
    {ctx.moveTo(hx-r*.22,hy+r*.28);ctx.lineTo(hx+r*.22,hy+r*.28);}
  else if(charIdx===0)
    ctx.arc(hx,hy+r*.25,r*.22,.1,Math.PI-.1); // Character A: friendly default smile
  else
    ctx.arc(hx,hy+r*.24,r*.18,.12,Math.PI-.12);
  ctx.stroke();
  // cheeks — Character B always has soft blush (expressive), others on happy emotions
  const showCheek=charIdx===1||['happy','love','excited'].includes(emotion)||['laugh','hug','kiss','dance'].includes(action);
  if(showCheek){
    const cheekA=charIdx===1&&!['angry','sad','lonely'].includes(emotion)?0.18:0.22;
    ctx.fillStyle=`rgba(255,140,140,${cheekA})`;
    ctx.beginPath();ctx.ellipse(hx-eo-r*.08,hy+r*.09,r*.17,r*.1,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(hx+eo+r*.08,hy+r*.09,r*.17,r*.1,0,0,Math.PI*2);ctx.fill();
  }
  // tears
  if(['sad','lonely'].includes(emotion)||action==='cry'){
    ctx.fillStyle='rgba(100,170,225,.82)';
    const ty=hy+r*.1+Math.abs(Math.sin(t*2.5))*r*.4;
    ctx.beginPath();ctx.arc(hx-eo,ty,r*.07,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(hx+eo,ty+r*.1,r*.06,0,Math.PI*2);ctx.fill();
  }
  // sleep z
  if(action==='sleep'){
    ctx.font=`${r*.58}px serif`;ctx.fillStyle='rgba(180,180,255,.65)';ctx.textAlign='center';
    ctx.fillText('z',hx+r*.52,hy-r*.68);ctx.fillText('z',hx+r*.82,hy-r*1.2);
  }
  ctx.restore();
}

function drawPastelUmbrella(ctx,hx,hy,S,color,outline){
  ctx.save();
  const ux=hx,uy=hy-S*1.5,r=S*1.0;
  ctx.strokeStyle=outline;ctx.lineWidth=S*.08;
  ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(ux,uy+r*.1);ctx.stroke();
  ctx.fillStyle=color;ctx.globalAlpha=0.55;ctx.beginPath();ctx.arc(ux,uy,r,Math.PI,0);ctx.fill();
  ctx.globalAlpha=0.75;ctx.strokeStyle=color;ctx.lineWidth=S*.08;ctx.beginPath();ctx.arc(ux,uy,r,Math.PI,0);ctx.stroke();
  for(let i=0;i<=2;i++){const a=Math.PI+i*(Math.PI/2);ctx.globalAlpha=0.3;ctx.beginPath();ctx.moveTo(ux,uy);ctx.lineTo(ux+Math.cos(a)*r,uy+Math.sin(a)*r*.5);ctx.stroke();}
  ctx.restore();
}

function drawUmbrella(ctx,hx,hy,S,color){
  ctx.save();
  const ux=hx,uy=hy-S*1.5,r=S*1.05;
  ctx.strokeStyle=color;ctx.lineWidth=S*.09;
  ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(ux,uy+r*.12);ctx.stroke();
  ctx.fillStyle=color;ctx.globalAlpha=.5;
  ctx.beginPath();ctx.arc(ux,uy,r,Math.PI,0);ctx.fill();
  ctx.globalAlpha=.75;ctx.strokeStyle=color;ctx.lineWidth=S*.1;
  ctx.beginPath();ctx.arc(ux,uy,r,Math.PI,0);ctx.stroke();
  ctx.lineWidth=S*.05;ctx.globalAlpha=.38;
  for(let i=0;i<=4;i++){const a=Math.PI+i*(Math.PI/4);ctx.beginPath();ctx.moveTo(ux,uy);ctx.lineTo(ux+Math.cos(a)*r,uy+Math.sin(a)*r);ctx.stroke();}
  ctx.restore();
}

// ═══ JOINT POSITIONS ═══
function getJoints(action,emotion,t,S){
  const b={
    head:{x:0,y:-S*2.9},neck:{x:0,y:-S*2.3},
    elbL:{x:-S*.9,y:-S*1.7},elbR:{x:S*.9,y:-S*1.7},
    hanL:{x:-S*.9,y:-S*.9},hanR:{x:S*.9,y:-S*.9},
    hip:{x:0,y:0},knL:{x:-S*.3,y:S*.9},knR:{x:S*.3,y:S*.9},
    ftL:{x:-S*.5,y:S*1.9},ftR:{x:S*.5,y:S*1.9},
  };

  if(action==='walk'||action==='run'){
    const spd=action==='run'?5:3.2;
    const sw=Math.sin(t*spd)*S*(action==='run'?.65:.52);
    return {head:{x:0,y:b.head.y+Math.sin(t*spd*2)*S*.04},neck:b.neck,
      elbL:{x:-S*.7,y:-S*1.7-sw*.25},elbR:{x:S*.7,y:-S*1.7+sw*.25},
      hanL:{x:-S*.65,y:-S*.8-sw*.4},hanR:{x:S*.65,y:-S*.8+sw*.4},
      hip:b.hip,knL:{x:-S*.3+sw*.3,y:S*.9-clamp(sw,0,S)*.5},knR:{x:S*.3-sw*.3,y:S*.9+clamp(sw,0,S)*.5},
      ftL:{x:-S*.5+sw*.52,y:S*1.88},ftR:{x:S*.5-sw*.52,y:S*1.88}};
  }
  if(action==='jump'||emotion==='happy'&&action==='idle'){
    const bounce=Math.abs(Math.sin(t*2.8))*S*.48;
    return {head:{x:0,y:b.head.y-bounce},neck:{x:0,y:b.neck.y-bounce},
      elbL:{x:-S*1.2,y:-S*2.2-bounce},elbR:{x:S*1.2,y:-S*2.2-bounce},
      hanL:{x:-S*1.65,y:-S*2.9-bounce},hanR:{x:S*1.65,y:-S*2.9-bounce},
      hip:{x:0,y:-bounce*.35},knL:{x:-S*.6,y:S*.7+Math.sin(t*2.8)*S*.18},knR:{x:S*.6,y:S*.7-Math.sin(t*2.8)*S*.18},
      ftL:{x:-S*.8,y:S*1.7},ftR:{x:S*.8,y:S*1.7}};
  }
  if(action==='write'){
    const jig=Math.sin(t*3.5)*S*.02;
    return {head:{x:S*.18,y:-S*1.62+Math.sin(t*.7)*S*.03},neck:{x:S*.09,y:-S*.98},
      elbL:{x:-S*.8,y:-S*.52},elbR:{x:S*.72,y:-S*.42+jig},
      hanL:{x:-S*.4,y:S*.2},hanR:{x:S*.58,y:S*.3+jig},
      hip:{x:0,y:S*.22},knL:{x:-S*1.05,y:S*1.2},knR:{x:S*1.05,y:S*1.2},
      ftL:{x:-S*1.5,y:S*.55},ftR:{x:S*1.5,y:S*.55}};
  }
  if(action==='read'){
    return {head:{x:S*.1,y:-S*1.66+Math.sin(t*.65)*S*.025},neck:{x:S*.05,y:-S*1.02},
      elbL:{x:-S*.62,y:-S*.82},elbR:{x:S*.7,y:-S*.85},
      hanL:{x:-S*.18,y:-S*.52},hanR:{x:S*.32,y:-S*.55},
      hip:{x:0,y:S*.22},knL:{x:-S*1.05,y:S*1.22},knR:{x:S*1.05,y:S*1.22},
      ftL:{x:-S*1.5,y:S*.55},ftR:{x:S*1.5,y:S*.55}};
  }
  if(action==='drink'){
    const sw=Math.sin(t*1.6)*S*.04;
    return {head:{x:0,y:-S*2.14+sw*.5},neck:b.neck,
      elbL:{x:-S*.82,y:-S*1.58},elbR:{x:S*.95,y:-S*2.05},
      hanL:{x:-S*.78,y:-S*.86},hanR:{x:S*.72,y:-S*2.88},
      hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='think'){
    const sw=Math.sin(t*1.1)*S*.018;
    return {head:{x:-S*.04+sw,y:b.head.y+Math.sin(t*.7)*S*.025},neck:b.neck,
      elbL:{x:-S*.82,y:-S*1.52},elbR:{x:S*.88,y:-S*1.98},
      hanL:{x:-S*.8,y:-S*.82},hanR:{x:S*.5,y:-S*2.48},
      hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='stretch'){
    const sw=Math.sin(t*2.2)*S*.18;
    return {head:{x:sw*.12,y:b.head.y-S*.06},neck:{x:sw*.06,y:b.neck.y},
      elbL:{x:-S*1.55,y:-S*2.65+sw},elbR:{x:S*1.55,y:-S*2.65-sw},
      hanL:{x:-S*2.05,y:-S*3.25+sw},hanR:{x:S*2.05,y:-S*3.25-sw},
      hip:{x:sw*.04,y:0},knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='game'){
    const jl=Math.sin(t*7.2)*S*.07,jr=-jl;
    return {head:{x:0,y:b.head.y+Math.sin(t*4.5)*S*.022},neck:b.neck,
      elbL:{x:-S*1.1,y:-S*1.74},elbR:{x:S*1.1,y:-S*1.74},
      hanL:{x:-S*.88,y:-S*1.12+jl},hanR:{x:S*.88,y:-S*1.12+jr},
      hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='sit'||action==='work'||action==='eat'){
    const lean=action==='work'?S*.25:0;
    return {head:{x:lean*.5,y:-S*1.7+Math.sin(t*.8)*S*.03},neck:{x:lean*.25,y:-S*1.05},
      elbL:{x:-S*.85,y:-S*.6},elbR:{x:S*.85,y:-S*.6+(action==='eat'?-S*.6:0)},
      hanL:{x:-S*.55,y:S*.3},hanR:{x:S*.55,y:action==='eat'?-S*.9:S*.3},
      hip:{x:0,y:S*.2},knL:{x:-S*1.05,y:S*1.2},knR:{x:S*1.05,y:S*1.2},
      ftL:{x:-S*1.5,y:S*.55},ftR:{x:S*1.5,y:S*.55}};
  }
  if(action==='cry'||(['sad','lonely'].includes(emotion)&&action==='idle')){
    return {head:{x:S*.28,y:-S*1.48+Math.sin(t*.8)*S*.03},neck:{x:S*.1,y:-S*.9},
      elbL:{x:-S*.82,y:-S*.5},elbR:{x:S*.82,y:-S*.5},
      hanL:{x:-S*.3,y:S*.22},hanR:{x:S*.35,y:S*.22},
      hip:{x:0,y:S*.2},knL:{x:-S*1.1,y:S*1.2},knR:{x:S*1.1,y:S*1.2},
      ftL:{x:-S*1.5,y:S*.55},ftR:{x:S*1.5,y:S*.55}};
  }
  if(action==='laugh'||action==='dance'){
    const sh=Math.sin(t*(action==='dance'?2:6))*S*.08;
    const sw=Math.sin(t*1.8)*S*.12;
    return {head:{x:sh,y:b.head.y+sh*.5},neck:{x:sh*.5,y:b.neck.y},
      elbL:{x:-S*1.3+sw,y:-S*2.1},elbR:{x:S*1.3-sw,y:-S*2.1},
      hanL:{x:-S*1.8+sw*1.5,y:-S*2.7},hanR:{x:S*1.8-sw*1.5,y:-S*2.7},
      hip:{x:sh,y:0},knL:{x:-S*.4+sh,y:S*.88},knR:{x:S*.4+sh,y:S*.88},
      ftL:{x:-S*.65,y:S*1.88},ftR:{x:S*.65,y:S*1.88}};
  }
  if(action==='angry'||(emotion==='angry'&&action==='idle')){
    const shk=Math.sin(t*12)*S*.09;
    return {head:{x:shk,y:b.head.y+shk*.5},neck:{x:shk,y:b.neck.y},
      elbL:{x:-S*1.25,y:-S*1.9},elbR:{x:S*1.25,y:-S*1.9},
      hanL:{x:-S*1.05,y:-S*2.6},hanR:{x:S*1.05,y:-S*2.6},
      hip:{x:shk,y:0},knL:{x:-S*.42,y:S*.88},knR:{x:S*.42,y:S*.88},
      ftL:{x:-S*.65,y:S*1.88},ftR:{x:S*.65,y:S*1.88}};
  }
  if(action==='hug'||action==='kiss'||(emotion==='love'&&action==='idle')){
    const sw=Math.sin(t*1.5)*S*.06;
    return {head:{x:sw,y:b.head.y+sw*.5},neck:{x:sw*.5,y:b.neck.y},
      elbL:{x:-S*1.1,y:-S*1.95},elbR:{x:S*1.1,y:-S*1.95},
      hanL:{x:-S*1.55,y:-S*2.55},hanR:{x:S*1.55,y:-S*2.55},
      hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='talk'||action==='wave'){
    const sw=Math.sin(t*3.5)*S*.2;
    return {head:{x:0,y:b.head.y},neck:b.neck,
      elbL:{x:-S*.85,y:-S*1.6},elbR:{x:S*1.1,y:-S*2.0+sw},
      hanL:{x:-S*.8,y:-S*.85},hanR:{x:S*.85,y:-S*2.8+sw},
      hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='sleep'){
    return {head:{x:S*1.5,y:S*.05},neck:{x:S*.8,y:S*.15},
      elbL:{x:0,y:-S*.4},elbR:{x:S*.5,y:S*.5},
      hanL:{x:-S*.5,y:-S*.6},hanR:{x:S*1.2,y:S*.5},
      hip:{x:-S*.5,y:S*.25},knL:{x:-S*1.1,y:S*.25},knR:{x:-S*.8,y:S*.5},
      ftL:{x:-S*1.9,y:S*.2},ftR:{x:-S*1.6,y:S*.55}};
  }
  if(action==='look'||(emotion==='night'&&action==='idle')){
    return {head:{x:-S*.08,y:-S*1.8+Math.sin(t*.6)*S*.02},neck:{x:-S*.04,y:-S*1.15},
      elbL:{x:-S*.88,y:-S*.62},elbR:{x:S*.88,y:-S*.62},
      hanL:{x:-S*1.32,y:S*.12},hanR:{x:S*1.32,y:S*.12},
      hip:{x:0,y:S*.25},knL:{x:-S*1.05,y:S*1.25},knR:{x:S*1.05,y:S*1.25},
      ftL:{x:-S*1.5,y:S*.55},ftR:{x:S*1.5,y:S*.55}};
  }
  if(action==='excited'||(emotion==='excited'&&action==='idle')){
    const sp=Math.sin(t*4.5),bounce=Math.abs(sp)*S*.52;
    return {head:{x:sp*S*.04,y:b.head.y-bounce},neck:{x:0,y:b.neck.y-bounce},
      elbL:{x:-S*1.3,y:-S*2.3-bounce+sp*S*.2},elbR:{x:S*1.3,y:-S*2.3-bounce-sp*S*.2},
      hanL:{x:-S*1.8,y:-S*3.0-bounce+sp*S*.3},hanR:{x:S*1.8,y:-S*3.0-bounce-sp*S*.3},
      hip:{x:0,y:-bounce*.3},knL:{x:-S*.65,y:S*.75+Math.max(0,sp)*S*.2},knR:{x:S*.65,y:S*.75-Math.max(0,sp)*S*.2},
      ftL:{x:-S*.9,y:S*1.75},ftR:{x:S*.9,y:S*1.75}};
  }
  if(emotion==='peaceful'&&action==='idle'){
    const sw=Math.sin(t*1.8)*S*.3;
    return {head:{x:0,y:b.head.y+Math.sin(t*3.6)*S*.03},neck:b.neck,
      elbL:{x:-S*.75,y:-S*1.65-sw*.2},elbR:{x:S*.75,y:-S*1.65+sw*.2},
      hanL:{x:-S*.7,y:-S*.85-sw*.35},hanR:{x:S*.7,y:-S*.85+sw*.35},
      hip:b.hip,knL:{x:-S*.28+sw*.25,y:S*.9},knR:{x:S*.28-sw*.25,y:S*.9},
      ftL:{x:-S*.48+sw*.45,y:S*1.88},ftR:{x:S*.48-sw*.45,y:S*1.88}};
  }

  // Default idle sway
  const sway=Math.sin(t*1.2)*S*.04;
  return {head:{x:sway,y:b.head.y+sway*.5},neck:{x:sway*.5,y:b.neck.y},
    elbL:b.elbL,elbR:b.elbR,hanL:b.hanL,hanR:b.hanR,
    hip:{x:sway*.3,y:0},knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
}

// ═══════════════════════════════════════════════════════
//  DONGGLI ROUND CHARACTER SYSTEM
// ═══════════════════════════════════════════════════════
function getDongliColors(charIdx){
  return[
    {body:'#FFFFFF',outline:'rgba(42,25,10,0.75)',blush:'rgba(255,138,138,0.30)'},
    {body:'#FFFAEE',outline:'rgba(42,25,10,0.75)',blush:'rgba(255,128,152,0.36)'},
    {body:'#EDF3FF',outline:'rgba(42,25,10,0.75)',blush:'rgba(135,168,230,0.26)'},
  ][Math.min(charIdx,2)];
}

function getDongliExpr(emotion,action){
  if(emotion==='happy'||action==='laugh')
    return {eye:'crescent',mouth:'u_smile',brow:'none',atmo:'joy'};
  if(emotion==='excited'||action==='dance')
    return {eye:'sparkle',mouth:'u_smile',brow:'none',atmo:'joy'};
  if(emotion==='love'||action==='hug'||action==='kiss')
    return {eye:'sparkle',mouth:'u_smile',brow:'none',atmo:'blush'};
  if(emotion==='sad'||emotion==='lonely'||action==='cry')
    return {eye:'droop',mouth:'inv_u',brow:'none',atmo:null};
  if(emotion==='angry')
    return {eye:'narrow',mouth:'jagged',brow:'furrowed',atmo:'fire'};
  if(emotion==='peaceful')
    return {eye:'crescent',mouth:'l_shape',brow:'none',atmo:null};
  if(emotion==='night')
    return {eye:'dot',mouth:'small_o',brow:'none',atmo:null};
  if(emotion==='rain')
    return {eye:'droop',mouth:'small_o',brow:'none',atmo:'cloud'};
  if(action==='think')
    return {eye:'dot',mouth:'small_o',brow:'raised',atmo:null};
  if(action==='sleep')
    return {eye:'sleep',mouth:'l_shape',brow:'none',atmo:'zzz'};
  if(action==='game'||action==='work'||action==='write')
    return {eye:'oval',mouth:'l_shape',brow:'furrowed',atmo:null};
  return {eye:'dot',mouth:'smile',brow:'none',atmo:null};
}

function drawDongliChar(ctx,cx,cy,S,action,emotion,t,facing,charIdx){
  ctx.save();
  ctx.translate(cx,cy);
  if(facing<0) ctx.scale(-1,1);
  const r=S*1.44, col=getDongliColors(charIdx), ol=col.outline;
  const bcy=-S*1.78; // body center Y relative to ground
  const expr=getDongliExpr(emotion,action);

  // Shadow
  ctx.save();ctx.globalAlpha=0.10;ctx.fillStyle='rgba(80,55,25,0.55)';
  ctx.beginPath();ctx.ellipse(0,0,S*0.84,S*0.14,0,0,Math.PI*2);ctx.fill();ctx.restore();

  // LEGS
  let lFx=-r*0.36,lFy=0,rFx=r*0.36,rFy=0;
  if(action==='walk'||action==='run'){
    const spd=action==='run'?5.5:3.2,sw=Math.sin(t*spd)*S*(action==='run'?0.18:0.12);
    lFy=sw;rFy=-sw;lFx=-r*0.36+sw*0.12;rFx=r*0.36-sw*0.12;
  }else if(['sit','work','write','eat','read','game'].includes(action)){
    lFx=-r*0.62;rFx=r*0.62;
  }else if(action==='dance'||action==='laugh'){
    const sp=Math.abs(Math.sin(t*3.5))*S*0.08;
    lFx=-r*0.5;rFx=r*0.5;lFy=-sp;rFy=-sp;
  }
  const footR=r*0.24;
  [[0,bcy+r*0.84,lFx,lFy,-1],[0,bcy+r*0.84,rFx,rFy,1]].forEach(([sx,sy,ex,ey,side])=>{
    drawTaperedLimb(ctx,sx,sy,r*0.26,ex,ey,r*0.17,col.body,ol,r*0.068);
    // Cute rounded foot, tilted outward
    const footAng=side*0.32;
    ctx.save();ctx.translate(ex,ey);ctx.rotate(footAng);
    ctx.fillStyle=col.body;ctx.strokeStyle=ol;ctx.lineWidth=r*0.068;
    ctx.beginPath();ctx.ellipse(side*footR*0.52,0,footR*1.18,footR*0.72,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.42)';
    ctx.beginPath();ctx.ellipse(side*footR*0.28,-footR*0.22,footR*0.44,footR*0.24,footAng,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });

  // ARMS
  let lA={sx:-r*0.9,sy:bcy+r*0.08,ex:-r*1.56,ey:bcy+r*0.44};
  let rA={sx:r*0.9,sy:bcy+r*0.08,ex:r*1.56,ey:bcy+r*0.44};
  if(action==='walk'){const sw=Math.sin(t*3.2)*r*0.16;lA.ey+=sw;rA.ey-=sw;}
  else if(action==='run'){const sw=Math.sin(t*5.5)*r*0.3;lA={sx:-r*0.86,sy:bcy-r*0.05,ex:-r*1.48,ey:bcy-r*0.3+sw};rA={sx:r*0.86,sy:bcy-r*0.05,ex:r*1.48,ey:bcy-r*0.3-sw};}
  else if(action==='dance'||action==='laugh'){const sw=Math.sin(t*3.8)*r*0.18;lA={sx:-r*0.9,sy:bcy-r*0.08,ex:-r*1.5,ey:bcy-r*0.72+sw};rA={sx:r*0.9,sy:bcy-r*0.08,ex:r*1.5,ey:bcy-r*0.72-sw};}
  else if(action==='wave'||action==='talk'){const sw=Math.sin(t*4.0)*r*0.22;rA={sx:r*0.88,sy:bcy-r*0.08,ex:r*1.38,ey:bcy-r*0.8-sw};}
  else if(action==='hug'||action==='kiss'){lA={sx:-r*0.9,sy:bcy-r*0.08,ex:-r*0.26,ey:bcy-r*0.68};rA={sx:r*0.9,sy:bcy-r*0.08,ex:r*0.26,ey:bcy-r*0.68};}
  else if(action==='think'){rA={sx:r*0.86,sy:bcy+r*0.18,ex:r*0.44,ey:bcy-r*0.6+Math.sin(t*1.5)*r*0.04};}
  else if(action==='stretch'){const sw=Math.sin(t*2.0)*r*0.11;lA={sx:-r*0.9,sy:bcy-r*0.18,ex:-r*1.58,ey:bcy-r*0.92-sw};rA={sx:r*0.9,sy:bcy-r*0.18,ex:r*1.58,ey:bcy-r*0.92+sw};}
  else if(['write','eat','drink','read','game','work'].includes(action)){lA={sx:-r*0.84,sy:bcy+r*0.24,ex:-r*0.38,ey:bcy+r*0.66};rA={sx:r*0.84,sy:bcy+r*0.24,ex:r*0.38,ey:bcy+r*0.66};}
  else if(action==='sleep'){lA={sx:-r*0.9,sy:bcy+r*0.28,ex:-r*1.5,ey:bcy+r*0.54};rA={sx:r*0.9,sy:bcy+r*0.28,ex:r*1.5,ey:bcy+r*0.54};}
  else if(['sad','lonely'].includes(emotion)&&action==='idle'){lA={sx:-r*0.9,sy:bcy+r*0.28,ex:-r*1.46,ey:bcy+r*0.56};rA={sx:r*0.9,sy:bcy+r*0.28,ex:r*1.46,ey:bcy+r*0.56};}
  else{const sw=Math.sin(t*1.2)*r*0.04;lA.ey+=sw;rA.ey-=sw;}
  [lA,rA].forEach(a=>{
    drawTaperedLimb(ctx,a.sx,a.sy,r*0.24,a.ex,a.ey,r*0.15,col.body,ol,r*0.068);
    // Cute chubby hand
    const handR=r*0.22;
    ctx.save();ctx.fillStyle=col.body;ctx.strokeStyle=ol;ctx.lineWidth=r*0.068;
    ctx.beginPath();ctx.arc(a.ex,a.ey,handR,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.44)';
    ctx.beginPath();ctx.ellipse(a.ex-handR*0.3,a.ey-handR*0.3,handR*0.42,handR*0.26,-0.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });

  // Umbrella for rain
  if((action==='walk'||action==='idle')&&emotion==='rain')
    drawPastelUmbrella(ctx,rA.ex,rA.ey,S,col.body,ol);

  // BODY CIRCLE
  const bounce=getDongliBounce(action,emotion,t,S);
  const bcyB=bcy+bounce;

  // Squash & stretch — deform from body bottom contact point
  const isBouncingAction=action==='walk'||action==='run'||action==='dance'||action==='laugh'||(action==='idle'&&(emotion==='happy'||emotion==='excited'));
  let bScaleX=1,bScaleY=1;
  if(isBouncingAction){
    const bFreq=action==='run'?5.5:action==='dance'||action==='laugh'?4.0:action==='walk'?3.2:2.8;
    const bPhase=Math.abs(Math.sin(t*bFreq)); // 0=landed, 1=peak
    bScaleX=1.08-bPhase*0.13; // squash wide at landing, stretch narrow at peak
    bScaleY=0.92+bPhase*0.14; // squash short at landing, stretch tall at peak
  }

  ctx.save();
  const bodyBottom=bcyB+r;
  ctx.translate(0,bodyBottom);ctx.scale(bScaleX,bScaleY);ctx.translate(0,-bodyBottom);

  const g=ctx.createRadialGradient(-r*0.27,bcyB-r*0.27,0,0,bcyB,r*1.06);
  g.addColorStop(0,'#FFFFFF');g.addColorStop(0.52,col.body);g.addColorStop(1,liftColor(col.body,-0.05));
  ctx.fillStyle=g;ctx.strokeStyle=ol;ctx.lineWidth=r*0.09;
  ctx.beginPath();ctx.arc(0,bcyB,r,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.52)';
  ctx.beginPath();ctx.ellipse(-r*0.24,bcyB-r*0.28,r*0.25,r*0.16,-0.4,0,Math.PI*2);ctx.fill();

  // Character mark
  if(charIdx===1){drawDongliBow(ctx,0,bcyB-r*0.99,r*0.26,ol);}
  else if(charIdx===0){
    ctx.fillStyle='rgba(35,22,8,0.62)';ctx.strokeStyle=ol;ctx.lineWidth=r*0.055;
    ctx.beginPath();ctx.arc(r*0.1,bcyB-r*0.96,r*0.096,0,Math.PI*2);ctx.fill();ctx.stroke();
  }

  // FACE
  drawDongliFace(ctx,0,bcyB,r,emotion,action,t,charIdx,col,expr);
  ctx.restore();
  // ATMOSPHERE
  drawDongliAtmo(ctx,0,bcyB,r,S,emotion,action,t);

  ctx.restore();
}

function getDongliBounce(action,emotion,t,S){
  if(action==='walk') return -Math.abs(Math.sin(t*3.2))*S*0.055;
  if(action==='run') return -Math.abs(Math.sin(t*5.5))*S*0.1;
  if(action==='dance'||action==='laugh') return -Math.abs(Math.sin(t*4.0))*S*0.13;
  if((emotion==='happy'||emotion==='excited')&&action==='idle') return -Math.abs(Math.sin(t*2.8))*S*0.1;
  return Math.sin(t*1.3)*S*0.018;
}

function drawDongliLimb(ctx,x1,y1,x2,y2,w,fill,stroke,sw){
  drawTaperedLimb(ctx,x1,y1,w/2,x2,y2,w/2,fill,stroke,sw);
}
function drawTaperedLimb(ctx,x1,y1,r1,x2,y2,r2,fill,stroke,sw){
  const ang=Math.atan2(y2-y1,x2-x1),perp=ang+Math.PI/2;
  const cp=Math.cos(perp),sp=Math.sin(perp);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1+cp*r1,y1+sp*r1);ctx.lineTo(x2+cp*r2,y2+sp*r2);
  ctx.arc(x2,y2,r2,perp,perp+Math.PI,false);
  ctx.lineTo(x1-cp*r1,y1-sp*r1);
  ctx.arc(x1,y1,r1,perp+Math.PI,perp,false);
  ctx.closePath();
  ctx.fillStyle=fill;ctx.fill();
  ctx.strokeStyle=stroke;ctx.lineWidth=sw||2;ctx.stroke();
  // Shoulder-end highlight for roundness
  ctx.fillStyle='rgba(255,255,255,0.30)';
  ctx.beginPath();ctx.ellipse(x1-cp*r1*0.25,y1-sp*r1*0.25,r1*0.38,r1*0.22,ang+Math.PI/4,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawDongliBow(ctx,cx,cy,r,ol){
  ctx.save();
  ctx.fillStyle='#FF8FAD';ctx.strokeStyle=ol;ctx.lineWidth=r*0.1;
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.bezierCurveTo(cx-r*1.15,cy-r*0.85,cx-r*1.35,cy+r*0.08,cx-r*0.18,cy+r*0.14);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.bezierCurveTo(cx+r*1.15,cy-r*0.85,cx+r*1.35,cy+r*0.08,cx+r*0.18,cy+r*0.14);ctx.fill();ctx.stroke();
  ctx.fillStyle='#FFB3C6';ctx.beginPath();ctx.arc(cx,cy,r*0.2,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.restore();
}

function drawDongliFace(ctx,cx,cy,r,emotion,action,t,charIdx,col,expr){
  ctx.save();
  const eo=r*0.32,ey=cy-r*0.1,er=r*0.13,my=cy+r*0.22;
  const ol='rgba(38,20,6,0.88)';

  // Eyebrows
  if(expr.brow==='furrowed'){
    ctx.strokeStyle=ol;ctx.lineWidth=r*0.078;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(cx-eo-er*0.8,ey-r*0.38);ctx.lineTo(cx-eo+er*0.5,ey-r*0.25);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+eo+er*0.8,ey-r*0.38);ctx.lineTo(cx+eo-er*0.5,ey-r*0.25);ctx.stroke();
  }else if(expr.brow==='raised'){
    ctx.strokeStyle=ol;ctx.lineWidth=r*0.065;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(cx-eo,ey-r*0.35,er*0.9,Math.PI+0.4,-0.4);ctx.stroke();
    ctx.beginPath();ctx.arc(cx+eo,ey-r*0.35,er*0.9,Math.PI+0.4,-0.4);ctx.stroke();
  }

  // Eyes
  ctx.strokeStyle=ol;ctx.lineWidth=r*0.09;ctx.lineCap='round';
  if(expr.eye==='crescent'){
    // Thick filled crescent — happy closed eye
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.save();
      ctx.strokeStyle='rgba(38,20,6,0.90)';ctx.lineWidth=er*0.82;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(ex,ey+er*0.32,er*0.82,Math.PI+0.28,-0.28,false);ctx.stroke();
      // Tiny specular
      ctx.fillStyle='rgba(255,255,255,0.72)';ctx.beginPath();ctx.arc(ex-er*0.44,ey-er*0.08,er*0.2,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
  }else if(expr.eye==='sparkle'){
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.save();ctx.translate(ex,ey);
      // Sclera
      ctx.fillStyle='rgba(255,255,255,0.96)';ctx.beginPath();ctx.arc(0,0,er*1.22,0,Math.PI*2);ctx.fill();
      // Star rays
      ctx.strokeStyle=ol;ctx.lineWidth=r*0.068;ctx.lineCap='round';
      for(let s=0;s<4;s++){const a=s/4*Math.PI*2+t*0.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*er*1.1,Math.sin(a)*er*1.1);ctx.stroke();}
      ctx.fillStyle=ol;ctx.beginPath();ctx.arc(0,0,er*0.42,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.92)';ctx.beginPath();ctx.arc(-er*0.24,-er*0.28,er*0.24,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.60)';ctx.beginPath();ctx.arc(er*0.22,er*0.18,er*0.14,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
  }else if(expr.eye==='droop'){
    // Upside-down thick arc
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.save();
      ctx.strokeStyle='rgba(38,20,6,0.88)';ctx.lineWidth=er*0.75;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(ex,ey-er*0.32,er*0.82,0.28,Math.PI-0.28,false);ctx.stroke();
      ctx.restore();
    });
  }else if(expr.eye==='sleep'){
    [cx-eo,cx+eo].forEach(ex=>{ctx.beginPath();ctx.moveTo(ex-er*0.9,ey);ctx.lineTo(ex+er*0.9,ey);ctx.stroke();});
  }else if(expr.eye==='narrow'){
    [cx-eo,cx+eo].forEach(ex=>{ctx.beginPath();ctx.moveTo(ex-er*0.92,ey+er*0.2);ctx.lineTo(ex+er*0.92,ey+er*0.2);ctx.stroke();});
  }else if(expr.eye==='oval'){
    [cx-eo,cx+eo].forEach(ex=>{
      // Sclera
      ctx.fillStyle='rgba(255,255,255,0.94)';ctx.beginPath();ctx.ellipse(ex,ey,er*1.05,er*0.74,0,0,Math.PI*2);ctx.fill();
      // Iris + pupil
      ctx.fillStyle='rgba(50,33,14,0.88)';ctx.beginPath();ctx.ellipse(ex,ey,er*0.82,er*0.62,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(18,10,4,0.95)';ctx.beginPath();ctx.ellipse(ex+er*0.08,ey+er*0.06,er*0.46,er*0.40,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.90)';ctx.beginPath();ctx.arc(ex-er*0.22,ey-er*0.18,er*0.26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.55)';ctx.beginPath();ctx.arc(ex+er*0.2,ey+er*0.16,er*0.12,0,Math.PI*2);ctx.fill();
    });
  }else{
    // Default dot eye — sclera + iris + pupil + double highlight
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.fillStyle='rgba(255,255,255,0.96)';ctx.beginPath();ctx.arc(ex,ey,er*1.20,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(72,46,22,0.92)';ctx.beginPath();ctx.arc(ex,ey,er,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(20,10,4,0.97)';ctx.beginPath();ctx.arc(ex+er*0.1,ey+er*0.08,er*0.58,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.96)';ctx.beginPath();ctx.arc(ex-er*0.22,ey-er*0.24,er*0.36,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.62)';ctx.beginPath();ctx.arc(ex+er*0.2,ey+er*0.22,er*0.16,0,Math.PI*2);ctx.fill();
    });
  }

  // Glasses for Character C
  if(charIdx===2){
    const gr=er*1.32;
    ctx.strokeStyle='rgba(50,52,80,0.7)';ctx.lineWidth=r*0.062;ctx.fillStyle='rgba(175,215,255,0.12)';
    [cx-eo,cx+eo].forEach(ex=>{ctx.beginPath();ctx.arc(ex,ey,gr,0,Math.PI*2);ctx.fill();ctx.stroke();});
    ctx.beginPath();ctx.moveTo(cx-eo+gr,ey);ctx.lineTo(cx+eo-gr,ey);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-eo-gr,ey);ctx.lineTo(cx-eo-gr-r*0.1,ey-r*0.04);
    ctx.moveTo(cx+eo+gr,ey);ctx.lineTo(cx+eo+gr+r*0.1,ey-r*0.04);ctx.stroke();
  }

  // Nose dot
  ctx.fillStyle='rgba(38,20,6,0.20)';ctx.beginPath();ctx.arc(cx,cy+r*0.06,r*0.052,0,Math.PI*2);ctx.fill();

  // Mouth
  ctx.strokeStyle=ol;ctx.lineWidth=r*0.082;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();
  if(expr.mouth==='u_smile') ctx.arc(cx,my-r*0.09,r*0.28,0.14,Math.PI-0.14);
  else if(expr.mouth==='inv_u') ctx.arc(cx,my+r*0.15,r*0.24,Math.PI+0.2,-0.2);
  else if(expr.mouth==='jagged'){ctx.moveTo(cx-r*0.25,my);ctx.lineTo(cx-r*0.1,my-r*0.1);ctx.lineTo(cx,my+r*0.02);ctx.lineTo(cx+r*0.1,my-r*0.08);ctx.lineTo(cx+r*0.25,my);}
  else if(expr.mouth==='small_o'){ctx.arc(cx,my,r*0.1,0,Math.PI*2);ctx.fillStyle='rgba(38,20,6,0.42)';ctx.fill();}
  else if(expr.mouth==='wavy'){ctx.moveTo(cx-r*0.25,my);ctx.bezierCurveTo(cx-r*0.12,my-r*0.1,cx,my+r*0.1,cx+r*0.12,my-r*0.07);ctx.lineTo(cx+r*0.25,my);}
  else if(expr.mouth==='l_shape'){ctx.moveTo(cx-r*0.12,my-r*0.06);ctx.lineTo(cx-r*0.12,my+r*0.08);ctx.lineTo(cx+r*0.15,my+r*0.08);}
  else ctx.arc(cx,my-r*0.05,r*0.2,0.2,Math.PI-0.2);
  ctx.stroke();

  // Blush cheeks — always visible, stronger for expressive states
  if(!['angry'].includes(emotion)){
    const blushStrong=charIdx===1||['love','happy','excited'].includes(emotion)||['hug','kiss','laugh','dance'].includes(action);
    ctx.save();ctx.globalAlpha=blushStrong?0.92:0.38;
    ctx.fillStyle=col.blush;
    ctx.beginPath();ctx.ellipse(cx-eo-r*0.1,ey+r*0.2,r*0.22,r*0.13,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(cx+eo+r*0.1,ey+r*0.2,r*0.22,r*0.13,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  // Tears
  if(['sad','lonely'].includes(emotion)||action==='cry'){
    ctx.fillStyle='rgba(65,148,230,0.82)';
    const drop=Math.abs(Math.sin(t*2.5))*r*0.48;
    [cx-eo,cx+eo].forEach(tx=>{
      ctx.beginPath();ctx.moveTo(tx,ey+r*0.14+drop);
      ctx.bezierCurveTo(tx-r*0.08,ey+r*0.14+drop-r*0.12,tx-r*0.08,ey+r*0.14,tx,ey+r*0.14);
      ctx.bezierCurveTo(tx+r*0.08,ey+r*0.14,tx+r*0.08,ey+r*0.14+drop-r*0.12,tx,ey+r*0.14+drop);
      ctx.fill();
    });
  }
  ctx.restore();
}

function drawDongliAtmo(ctx,cx,cy,r,S,emotion,action,t){
  if(['happy','excited'].includes(emotion)||action==='laugh'||action==='dance'){
    ctx.save();
    const cols=['#FF6B9D','#FFD166','#06D6A0','#4ECDC4','#FF99CC','#C77DFF'];
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+t*0.72,dist=r*(1.38+Math.sin(t*1.8+i)*0.22);
      const px=cx+Math.cos(a)*dist,py=cy+Math.sin(a)*dist*0.68-r*0.18;
      ctx.fillStyle=cols[i%cols.length];ctx.globalAlpha=0.74;
      ctx.save();ctx.translate(px,py);ctx.rotate(t*2.2+i);
      ctx.fillRect(-r*0.065,-r*0.04,r*0.13,r*0.07);ctx.restore();
    }
    ctx.globalAlpha=0.72;ctx.fillStyle='#FF6B9D';
    drawHeart(ctx,cx+r*1.28,cy-r*0.56,r*0.22);
    ctx.restore();
  }
  if(emotion==='angry'){
    ctx.save();
    const fx=cx+r*0.08,fy=cy-r*1.42;
    ctx.globalAlpha=0.82+Math.sin(t*5.5)*0.18;
    ctx.fillStyle='#FF3300';
    ctx.beginPath();ctx.moveTo(fx,fy+r*0.38);ctx.bezierCurveTo(fx-r*0.22,fy+r*0.1,fx-r*0.28,fy-r*0.1,fx,fy-r*0.36);ctx.bezierCurveTo(fx+r*0.1,fy-r*0.04,fx+r*0.28,fy-r*0.08,fx+r*0.24,fy+r*0.38);ctx.closePath();ctx.fill();
    ctx.fillStyle='#FF8800';
    ctx.beginPath();ctx.moveTo(fx,fy+r*0.32);ctx.bezierCurveTo(fx-r*0.12,fy+r*0.08,fx-r*0.14,fy-r*0.02,fx,fy-r*0.18);ctx.bezierCurveTo(fx+r*0.07,fy-r*0.01,fx+r*0.16,fy,fx+r*0.13,fy+r*0.32);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(215,45,15,0.36)';ctx.lineWidth=r*0.05;ctx.lineCap='round';
    for(let i=0;i<3;i++){const lx=cx-r*(0.8+i*0.34)+Math.sin(t*14+i)*r*0.07;ctx.beginPath();ctx.moveTo(lx,cy-r*(0.46+i*0.14));ctx.lineTo(lx-r*0.26,cy-r*(0.46+i*0.14));ctx.stroke();}
    ctx.restore();
  }
  if(emotion==='rain'||(emotion==='sad'&&action!=='cry')){
    ctx.save();
    const clx=cx,cly=cy-r*1.5;
    ctx.globalAlpha=0.56+Math.sin(t*1.4)*0.08;
    ctx.fillStyle='rgba(125,165,218,0.60)';
    [[clx,cly,r*0.35],[clx-r*0.3,cly+r*0.18,r*0.26],[clx+r*0.28,cly+r*0.16,r*0.24],[clx-r*0.12,cly+r*0.28,r*0.21],[clx+r*0.14,cly+r*0.3,r*0.19]].forEach(([x,y,cr])=>{ctx.beginPath();ctx.arc(x,y,cr,0,Math.PI*2);ctx.fill();});
    ctx.strokeStyle='rgba(85,142,215,0.5)';ctx.lineWidth=r*0.036;ctx.lineCap='round';
    for(let i=0;i<4;i++){const rx=clx-r*0.3+i*r*0.2,ry=cly+r*0.5+Math.sin(t*3+i)*r*0.04;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-r*0.04,ry+r*0.22);ctx.stroke();}
    ctx.restore();
  }
  if(action==='sleep'){
    ctx.save();
    [r*0.26,r*0.33,r*0.40].forEach((sz,i)=>{
      ctx.globalAlpha=clamp(0.66-i*0.12+Math.sin(t*1.4+i)*0.1,0,1);
      ctx.font=`bold ${sz}px sans-serif`;ctx.fillStyle='rgba(130,130,205,0.92)';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('z',cx+r*(0.82+i*0.38),cy-r*(1.02+i*0.36));
    });
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════
//  PUPPY CHARACTER SYSTEM
//  Cream-colored fluffy puppy with floppy ears & orange scarf
// ═══════════════════════════════════════════════════════
const PUPPY_COL={
  fur:'#F5EDDC',furDark:'#E2CBA8',earInner:'#EDBB96',
  outline:'rgba(115,72,32,0.78)',nose:'#D4849A',
  blush:'rgba(255,130,110,0.45)',
  scarf1:'#FF8C42',scarf2:'#C96420',
};

function getPuppyExpr(emotion,action){
  if(emotion==='happy'||action==='laugh')   return{eye:'crescent',mouth:'u_smile',brow:'none',tail:'fast'};
  if(emotion==='excited'||action==='dance') return{eye:'sparkle', mouth:'u_smile',brow:'none',tail:'fast'};
  if(emotion==='love'||action==='hug'||action==='kiss') return{eye:'heart',mouth:'u_smile',brow:'none',tail:'fast'};
  if(emotion==='sad'||emotion==='lonely'||action==='cry') return{eye:'droop',mouth:'inv_u',brow:'sad',tail:'down'};
  if(emotion==='angry')  return{eye:'narrow',mouth:'jagged',brow:'furrowed',tail:'stiff'};
  if(emotion==='peaceful') return{eye:'crescent',mouth:'smile',brow:'none',tail:'slow'};
  if(emotion==='rain')   return{eye:'droop',mouth:'small_o',brow:'sad',tail:'down'};
  if(action==='think')   return{eye:'dot',mouth:'small_o',brow:'raised',tail:'idle'};
  if(action==='sleep')   return{eye:'sleep',mouth:'smile',brow:'none',tail:'idle'};
  if(action==='game'||action==='work'||action==='write') return{eye:'oval',mouth:'l_shape',brow:'focus',tail:'idle'};
  return{eye:'dot',mouth:'smile',brow:'none',tail:'idle'};
}

function getPuppyBounce(action,emotion,t,S){
  if(action==='walk')  return -Math.abs(Math.sin(t*3.2))*S*0.055;
  if(action==='run')   return -Math.abs(Math.sin(t*5.5))*S*0.10;
  if(action==='dance'||action==='laugh') return -Math.abs(Math.sin(t*4.0))*S*0.12;
  if((emotion==='happy'||emotion==='excited')&&action==='idle') return -Math.abs(Math.sin(t*2.8))*S*0.08;
  return Math.sin(t*1.3)*S*0.016;
}

function drawPuppyChar(ctx,cx,cy,S,action,emotion,t,facing,charIdx){
  ctx.save();
  ctx.translate(cx,cy);
  if(facing<0) ctx.scale(-1,1);

  const c=PUPPY_COL, ol=c.outline;
  const r=S*0.88;          // head radius
  const rb=S*0.74, rby=S*0.94; // body radii
  const bcy=-S*1.20;       // body center
  const hcy=-S*2.58;       // head center
  const expr=getPuppyExpr(emotion,action);
  const bounce=getPuppyBounce(action,emotion,t,S);

  // Squash & stretch
  const isBouncingAction=action==='walk'||action==='run'||action==='dance'||action==='laugh'||(action==='idle'&&(emotion==='happy'||emotion==='excited'));
  let bSX=1,bSY=1;
  if(isBouncingAction){
    const bFreq=action==='run'?5.5:action==='dance'||action==='laugh'?4.0:action==='walk'?3.2:2.8;
    const bPhase=Math.abs(Math.sin(t*bFreq));
    bSX=1.08-bPhase*0.13; bSY=0.92+bPhase*0.14;
  }

  // Shadow
  ctx.save();ctx.globalAlpha=0.11;ctx.fillStyle='rgba(100,65,20,0.55)';
  ctx.beginPath();ctx.ellipse(0,-S*0.05,S*0.86,S*0.13,0,0,Math.PI*2);ctx.fill();ctx.restore();

  // TAIL (behind body, right side)
  const tailSpeed=expr.tail==='fast'?6.5:expr.tail==='slow'?2.5:3.0;
  const tailAmp=expr.tail==='fast'?0.62:expr.tail==='down'?0:expr.tail==='stiff'?0:0.28;
  const tw=Math.sin(t*tailSpeed)*tailAmp;
  const tBaseX=rb*0.82,tBaseY=bcy+bounce;
  ctx.save();
  ctx.strokeStyle=c.furDark;ctx.lineWidth=S*0.24;ctx.lineCap='round';ctx.globalAlpha=0.95;
  ctx.beginPath();
  ctx.moveTo(tBaseX,tBaseY+rby*0.05);
  ctx.quadraticCurveTo(tBaseX+S*0.52+tw*S*0.28,tBaseY-S*0.52,tBaseX+S*0.28+tw*S*0.50,tBaseY-S*0.98-tw*S*0.28);
  ctx.stroke();
  ctx.globalAlpha=1;
  ctx.fillStyle=c.fur;ctx.strokeStyle=ol;ctx.lineWidth=S*0.055;
  ctx.beginPath();ctx.arc(tBaseX+S*0.28+tw*S*0.50,tBaseY-S*0.98-tw*S*0.28,S*0.20,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.restore();

  // BACK LEGS — short chubby stubs
  const legW=S*0.27;
  let lFx=-rb*0.44,lFy=-S*0.06,rFx=rb*0.44,rFy=-S*0.06;
  if(action==='walk'||action==='run'){
    const spd=action==='run'?5.5:3.2,sw=Math.sin(t*spd)*S*(action==='run'?0.09:0.06);
    lFy+= sw;rFy+= -sw;
  }else if(['sit','work','write','eat','read','game'].includes(action)){
    lFx=-rb*0.64;rFx=rb*0.64;
  }else if(action==='dance'||action==='laugh'){
    const sp=Math.abs(Math.sin(t*3.5))*S*0.05;
    lFx=-rb*0.52;rFx=rb*0.52;lFy-=sp;rFy-=sp;
  }
  const legTopY=bcy+bounce+rby*0.82;
  const footR=S*0.19;
  [[lFx,lFy,-1],[rFx,rFy,1]].forEach(([ex,ey,side])=>{
    // Equal-width limb = round pill, not taper
    drawTaperedLimb(ctx,side*rb*0.30,legTopY,legW,ex,ey+bounce*0.35,legW,c.fur,ol,S*0.060);
    ctx.save();ctx.translate(ex,ey+bounce*0.35);
    ctx.fillStyle=c.fur;ctx.strokeStyle=ol;ctx.lineWidth=S*0.060;
    ctx.beginPath();ctx.ellipse(side*footR*0.28,0,footR*1.05,footR*0.64,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    // Subtle toe bumps
    ctx.fillStyle=c.earInner;ctx.globalAlpha=0.60;
    for(let td=-1;td<=1;td++){ctx.beginPath();ctx.arc(side*footR*0.28+td*footR*0.24,-footR*0.20,footR*0.17,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  });

  // BODY (with squash/stretch)
  ctx.save();
  const bodyBottom=bcy+bounce+rby;
  ctx.translate(0,bodyBottom);ctx.scale(bSX,bSY);ctx.translate(0,-bodyBottom);
  const bg=ctx.createRadialGradient(-rb*0.30,bcy+bounce-rby*0.28,0,0,bcy+bounce,rb*1.12);
  bg.addColorStop(0,'#FFFFFF');bg.addColorStop(0.42,c.fur);bg.addColorStop(1,c.furDark);
  ctx.fillStyle=bg;ctx.strokeStyle=ol;ctx.lineWidth=S*0.072;
  ctx.beginPath();ctx.ellipse(0,bcy+bounce,rb,rby,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.46)';
  ctx.beginPath();ctx.ellipse(-rb*0.26,bcy+bounce-rby*0.30,rb*0.28,rby*0.18,-0.36,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // ARMS — short chubby stubs, no long reaches
  const armW=S*0.26, pawR=S*0.22;
  let lA={sx:-rb*0.88,sy:bcy+bounce-rby*0.08,ex:-rb*1.20,ey:bcy+bounce+rby*0.16};
  let rA={sx:rb*0.88,sy:bcy+bounce-rby*0.08,ex:rb*1.20,ey:bcy+bounce+rby*0.16};
  if(action==='walk'){const sw=Math.sin(t*3.2)*rb*0.10;lA.ey+=sw;rA.ey-=sw;}
  else if(action==='run'){const sw=Math.sin(t*5.5)*rb*0.18;lA={sx:-rb*0.84,sy:bcy+bounce-rby*0.08,ex:-rb*1.14,ey:bcy+bounce-rby*0.04+sw};rA={sx:rb*0.84,sy:bcy+bounce-rby*0.08,ex:rb*1.14,ey:bcy+bounce-rby*0.04-sw};}
  else if(action==='dance'||action==='laugh'){const sw=Math.sin(t*3.8)*rb*0.14;lA={sx:-rb*0.88,sy:bcy+bounce-rby*0.10,ex:-rb*1.16,ey:bcy+bounce-rby*0.46+sw};rA={sx:rb*0.88,sy:bcy+bounce-rby*0.10,ex:rb*1.16,ey:bcy+bounce-rby*0.46-sw};}
  else if(action==='wave'||action==='talk'){const sw=Math.sin(t*4.0)*rb*0.16;rA={sx:rb*0.86,sy:bcy+bounce-rby*0.08,ex:rb*1.08,ey:bcy+bounce-rby*0.60-sw};}
  else if(action==='hug'||action==='kiss'){lA={sx:-rb*0.88,sy:bcy+bounce-rby*0.10,ex:-rb*0.30,ey:bcy+bounce-rby*0.54};rA={sx:rb*0.88,sy:bcy+bounce-rby*0.10,ex:rb*0.30,ey:bcy+bounce-rby*0.54};}
  else if(action==='think'){rA={sx:rb*0.84,sy:bcy+bounce+rby*0.12,ex:rb*0.36,ey:bcy+bounce-rby*0.38+Math.sin(t*1.5)*rb*0.03};}
  else if(['write','eat','drink','read','game','work'].includes(action)){lA={sx:-rb*0.82,sy:bcy+bounce+rby*0.20,ex:-rb*0.34,ey:bcy+bounce+rby*0.52};rA={sx:rb*0.82,sy:bcy+bounce+rby*0.20,ex:rb*0.34,ey:bcy+bounce+rby*0.52};}
  else if(action==='sleep'){lA={sx:-rb*0.88,sy:bcy+bounce+rby*0.26,ex:-rb*1.22,ey:bcy+bounce+rby*0.46};rA={sx:rb*0.88,sy:bcy+bounce+rby*0.26,ex:rb*1.22,ey:bcy+bounce+rby*0.46};}
  else if(['sad','lonely'].includes(emotion)&&action==='idle'){lA={sx:-rb*0.88,sy:bcy+bounce+rby*0.26,ex:-rb*1.18,ey:bcy+bounce+rby*0.48};rA={sx:rb*0.88,sy:bcy+bounce+rby*0.26,ex:rb*1.18,ey:bcy+bounce+rby*0.48};}
  else{const sw=Math.sin(t*1.2)*rb*0.03;lA.ey+=sw;rA.ey-=sw;}
  [lA,rA].forEach(a=>{
    // Equal width at both ends = round pill shape (not tapered wedge)
    drawTaperedLimb(ctx,a.sx,a.sy,armW,a.ex,a.ey,armW*0.90,c.fur,ol,S*0.060);
    ctx.save();ctx.fillStyle=c.fur;ctx.strokeStyle=ol;ctx.lineWidth=S*0.060;
    ctx.beginPath();ctx.arc(a.ex,a.ey,pawR,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.38)';
    ctx.beginPath();ctx.ellipse(a.ex-pawR*0.28,a.ey-pawR*0.26,pawR*0.36,pawR*0.22,-0.5,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
  if((action==='walk'||action==='idle')&&emotion==='rain') drawPastelUmbrella(ctx,rA.ex,rA.ey,S,c.fur,ol);

  // SCARF (between body top and head)
  const scarfY=hcy+bounce+r*0.82;
  ctx.save();
  ctx.fillStyle=c.scarf1;ctx.strokeStyle=ol;ctx.lineWidth=S*0.052;
  ctx.beginPath();ctx.ellipse(0,scarfY,rb*0.70,S*0.21,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  // Diagonal stripes via clipping
  ctx.beginPath();ctx.ellipse(0,scarfY,rb*0.70,S*0.21,0,0,Math.PI*2);ctx.clip();
  ctx.strokeStyle=c.scarf2;ctx.lineWidth=S*0.095;
  for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*S*0.28-S*0.14,scarfY-S*0.32);ctx.lineTo(i*S*0.28+S*0.14,scarfY+S*0.32);ctx.stroke();}
  ctx.restore();

  // FLOPPY EARS (behind head)
  const eSwayL=Math.sin(t*2.2+0.5)*S*0.04;
  const eSwayR=Math.sin(t*2.2)*S*0.04;
  [[- 1,eSwayL],[1,eSwayR]].forEach(([side,sway])=>{
    const ex=side*r*0.52, ey0=hcy+bounce-r*0.60;
    ctx.save();
    ctx.fillStyle=c.furDark;ctx.strokeStyle=ol;ctx.lineWidth=S*0.065;
    ctx.beginPath();
    ctx.moveTo(ex,ey0);
    ctx.bezierCurveTo(ex+side*r*0.55,ey0-r*0.22,ex+side*r*0.84,ey0+r*0.36+sway,ex+side*r*0.60,ey0+r*1.36+sway);
    ctx.bezierCurveTo(ex+side*r*0.38,ey0+r*1.56+sway,ex-side*r*0.04,ey0+r*1.30+sway,ex-side*r*0.04,ey0+r*0.42);
    ctx.closePath();ctx.fill();ctx.stroke();
    // Inner ear pinkish
    ctx.fillStyle=c.earInner;
    ctx.beginPath();
    ctx.moveTo(ex+side*r*0.04,ey0+r*0.04);
    ctx.bezierCurveTo(ex+side*r*0.44,ey0-r*0.10,ex+side*r*0.64,ey0+r*0.32+sway,ex+side*r*0.44,ey0+r*1.12+sway);
    ctx.bezierCurveTo(ex+side*r*0.28,ey0+r*1.30+sway,ex+side*r*0.04,ey0+r*1.06+sway,ex+side*r*0.06,ey0+r*0.38);
    ctx.closePath();ctx.fill();
    ctx.restore();
  });

  // HEAD
  ctx.save();
  const hg=ctx.createRadialGradient(-r*0.29,hcy+bounce-r*0.28,0,0,hcy+bounce,r*1.06);
  hg.addColorStop(0,'#FFFFFF');hg.addColorStop(0.44,c.fur);hg.addColorStop(1,c.furDark);
  ctx.fillStyle=hg;ctx.strokeStyle=ol;ctx.lineWidth=S*0.072;
  ctx.beginPath();ctx.arc(0,hcy+bounce,r,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.46)';
  ctx.beginPath();ctx.ellipse(-r*0.25,hcy+bounce-r*0.30,r*0.26,r*0.16,-0.36,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // FACE
  drawPuppyFace(ctx,0,hcy+bounce,r,emotion,action,t,expr,c);
  // ATMOSPHERE (reuse Donglli atmosphere for effects)
  drawDongliAtmo(ctx,0,hcy+bounce,r,S,emotion,action,t);

  ctx.restore();
}

function drawPuppyFace(ctx,cx,cy,r,emotion,action,t,expr,c){
  ctx.save();
  const eo=r*0.30,ey=cy-r*0.08,er=r*0.158,my=cy+r*0.26;
  const ol=c.outline;

  // Eyebrows
  ctx.strokeStyle=ol;ctx.lineCap='round';
  if(expr.brow==='furrowed'){
    ctx.lineWidth=r*0.072;
    ctx.beginPath();ctx.moveTo(cx-eo-er*0.72,ey-r*0.44);ctx.lineTo(cx-eo+er*0.38,ey-r*0.30);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+eo+er*0.72,ey-r*0.44);ctx.lineTo(cx+eo-er*0.38,ey-r*0.30);ctx.stroke();
  }else if(expr.brow==='raised'){
    ctx.lineWidth=r*0.062;
    ctx.beginPath();ctx.arc(cx-eo,ey-r*0.40,er*0.86,Math.PI+0.4,-0.4);ctx.stroke();
    ctx.beginPath();ctx.arc(cx+eo,ey-r*0.40,er*0.86,Math.PI+0.4,-0.4);ctx.stroke();
  }else if(expr.brow==='sad'){
    ctx.lineWidth=r*0.062;
    ctx.beginPath();ctx.moveTo(cx-eo-er*0.68,ey-r*0.32);ctx.lineTo(cx-eo+er*0.38,ey-r*0.44);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+eo+er*0.68,ey-r*0.32);ctx.lineTo(cx+eo-er*0.38,ey-r*0.44);ctx.stroke();
  }else if(expr.brow==='focus'){
    ctx.lineWidth=r*0.066;
    ctx.beginPath();ctx.moveTo(cx-eo-er*0.58,ey-r*0.38);ctx.lineTo(cx-eo+er*0.48,ey-r*0.36);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+eo+er*0.58,ey-r*0.38);ctx.lineTo(cx+eo-er*0.48,ey-r*0.36);ctx.stroke();
  }

  // Eyes
  if(expr.eye==='crescent'){
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.save();
      ctx.strokeStyle='rgba(40,20,6,0.90)';ctx.lineWidth=er*0.88;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(ex,ey+er*0.28,er*0.84,Math.PI+0.26,-0.26,false);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.72)';ctx.beginPath();ctx.arc(ex-er*0.44,ey-er*0.06,er*0.21,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
  }else if(expr.eye==='sparkle'){
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.save();ctx.translate(ex,ey);
      ctx.fillStyle='rgba(255,255,255,0.96)';ctx.beginPath();ctx.arc(0,0,er*1.24,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=ol;ctx.lineWidth=r*0.060;ctx.lineCap='round';
      for(let s=0;s<4;s++){const a=s/4*Math.PI*2+t*0.5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*er*1.1,Math.sin(a)*er*1.1);ctx.stroke();}
      ctx.fillStyle='rgba(38,20,6,0.92)';ctx.beginPath();ctx.arc(0,0,er*0.46,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.94)';ctx.beginPath();ctx.arc(-er*0.24,-er*0.28,er*0.26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.58)';ctx.beginPath();ctx.arc(er*0.22,er*0.18,er*0.14,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
  }else if(expr.eye==='heart'){
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.save();ctx.translate(ex,ey);
      const hs=er*0.072;ctx.fillStyle='#FF5577';
      ctx.beginPath();
      ctx.moveTo(0,hs*2.2);
      ctx.bezierCurveTo(-hs*12,-hs*2,-hs*16,-hs*11,-hs*7,-hs*13);
      ctx.bezierCurveTo(-hs*2,-hs*16,0,-hs*13,0,-hs*11);
      ctx.bezierCurveTo(0,-hs*13,hs*2,-hs*16,hs*7,-hs*13);
      ctx.bezierCurveTo(hs*16,-hs*11,hs*12,-hs*2,0,hs*2.2);
      ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.68)';ctx.beginPath();ctx.arc(-hs*4,-hs*9,hs*3,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
  }else if(expr.eye==='droop'){
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.save();
      ctx.strokeStyle='rgba(40,20,6,0.88)';ctx.lineWidth=er*0.80;ctx.lineCap='round';
      ctx.beginPath();ctx.arc(ex,ey-er*0.28,er*0.84,0.26,Math.PI-0.26,false);ctx.stroke();
      ctx.restore();
    });
  }else if(expr.eye==='sleep'){
    ctx.strokeStyle=ol;ctx.lineWidth=r*0.085;ctx.lineCap='round';
    [cx-eo,cx+eo].forEach(ex=>{ctx.beginPath();ctx.moveTo(ex-er*0.85,ey);ctx.lineTo(ex+er*0.85,ey);ctx.stroke();});
  }else if(expr.eye==='narrow'){
    ctx.strokeStyle=ol;ctx.lineWidth=r*0.085;ctx.lineCap='round';
    [cx-eo,cx+eo].forEach(ex=>{ctx.beginPath();ctx.moveTo(ex-er*0.88,ey+er*0.18);ctx.lineTo(ex+er*0.88,ey+er*0.18);ctx.stroke();});
  }else if(expr.eye==='oval'){
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.fillStyle='rgba(255,255,255,0.94)';ctx.beginPath();ctx.ellipse(ex,ey,er*1.06,er*0.74,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(50,33,14,0.88)';ctx.beginPath();ctx.ellipse(ex,ey,er*0.82,er*0.60,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(18,10,4,0.95)';ctx.beginPath();ctx.ellipse(ex+er*0.08,ey+er*0.06,er*0.46,er*0.38,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.90)';ctx.beginPath();ctx.arc(ex-er*0.22,ey-er*0.18,er*0.26,0,Math.PI*2);ctx.fill();
    });
  }else{
    // Large expressive dot eyes
    [cx-eo,cx+eo].forEach(ex=>{
      ctx.fillStyle='rgba(255,255,255,0.96)';ctx.beginPath();ctx.arc(ex,ey,er*1.24,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(72,46,22,0.92)';ctx.beginPath();ctx.arc(ex,ey,er,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(20,10,4,0.97)';ctx.beginPath();ctx.arc(ex+er*0.10,ey+er*0.08,er*0.58,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.96)';ctx.beginPath();ctx.arc(ex-er*0.22,ey-er*0.24,er*0.38,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.60)';ctx.beginPath();ctx.arc(ex+er*0.20,ey+er*0.22,er*0.16,0,Math.PI*2);ctx.fill();
    });
  }

  // Pink button nose
  ctx.fillStyle=c.nose;
  ctx.beginPath();ctx.ellipse(cx,cy+r*0.06,r*0.098,r*0.072,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.52)';
  ctx.beginPath();ctx.ellipse(cx-r*0.030,cy+r*0.042,r*0.038,r*0.025,0,0,Math.PI*2);ctx.fill();

  // Mouth
  ctx.strokeStyle=ol;ctx.lineWidth=r*0.068;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();
  if(expr.mouth==='u_smile') ctx.arc(cx,my-r*0.08,r*0.26,0.18,Math.PI-0.18);
  else if(expr.mouth==='inv_u') ctx.arc(cx,my+r*0.14,r*0.22,Math.PI+0.20,-0.20);
  else if(expr.mouth==='jagged'){ctx.moveTo(cx-r*0.22,my);ctx.lineTo(cx-r*0.08,my-r*0.10);ctx.lineTo(cx,my+r*0.02);ctx.lineTo(cx+r*0.08,my-r*0.08);ctx.lineTo(cx+r*0.22,my);}
  else if(expr.mouth==='small_o'){ctx.arc(cx,my,r*0.09,0,Math.PI*2);ctx.fillStyle='rgba(38,20,6,0.36)';ctx.fill();}
  else if(expr.mouth==='l_shape'){ctx.moveTo(cx-r*0.10,my-r*0.05);ctx.lineTo(cx-r*0.10,my+r*0.07);ctx.lineTo(cx+r*0.13,my+r*0.07);}
  else ctx.arc(cx,my-r*0.04,r*0.18,0.22,Math.PI-0.22);
  ctx.stroke();

  // Rosy cheeks — always visible
  const blushStrong=['love','happy','excited'].includes(emotion)||['hug','kiss','laugh','dance'].includes(action);
  ctx.save();ctx.globalAlpha=blushStrong?0.88:0.44;ctx.fillStyle=c.blush;
  ctx.beginPath();ctx.ellipse(cx-eo-r*0.08,ey+r*0.24,r*0.23,r*0.14,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(cx+eo+r*0.08,ey+r*0.24,r*0.23,r*0.14,0,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // Tears
  if(['sad','lonely'].includes(emotion)||action==='cry'){
    ctx.fillStyle='rgba(65,148,230,0.82)';
    const drop=Math.abs(Math.sin(t*2.5))*r*0.46;
    [cx-eo,cx+eo].forEach(tx=>{
      ctx.beginPath();ctx.moveTo(tx,ey+r*0.16+drop);
      ctx.bezierCurveTo(tx-r*0.08,ey+r*0.16+drop-r*0.12,tx-r*0.08,ey+r*0.16,tx,ey+r*0.16);
      ctx.bezierCurveTo(tx+r*0.08,ey+r*0.16,tx+r*0.08,ey+r*0.16+drop-r*0.12,tx,ey+r*0.16+drop);
      ctx.fill();
    });
  }
  ctx.restore();
}
