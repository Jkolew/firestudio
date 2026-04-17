// ═══════════════════════════════════════════════════════
//  UNIVERSAL DRAWING ENGINE (SOMI & FRIENDS V3 - INFINITE)
// ═══════════════════════════════════════════════════════

// ═══ AUTHENTIC SHIN-CHAN STYLE: Potato head, caterpillar brows, simple bold features ═══
const CHAR_STYLES = [
  { skin:'#FFD5AA', hair:'#111', eye:'#000', shirt:'#FF4444', denim:'#FFEE55', acc:'daisy', accCol:'#FFFFFF', accCenter:'#FFE000', shoeCol:'#EEAA33' },
  { skin:'#FFD5AA', hair:'#111', eye:'#000', shirt:'#FF7799', denim:'#2255CC', acc:'heart', accCol:'#FF4477', accCenter:'#FFAACC', shoeCol:'#AA44CC' },
  { skin:'#FFD5AA', hair:'#111', eye:'#000', shirt:'#66DDAA', denim:'#334466', acc:'star', accCol:'#FFEE00', accCenter:'#FFF176', shoeCol:'#445566' }
];

// ── UNIVERSAL UTILS ──
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2; if (h < 2 * r) r = h / 2;
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath(); return ctx;
}

function liftColor(col,amt){
  let useP=false;if(col[0]=="#"){col=col.slice(1);useP=true;}
  let num=parseInt(col,16);let r=(num>>16)+amt*255;if(r>255)r=255;else if(r<0)r=0;
  let b=((num>>8)&0x00FF)+amt*255;if(b>255)b=255;else if(b<0)b=0;
  let g=(num&0x0000FF)+amt*255;if(g>255)g=255;else if(g<0)g=0;
  return(useP?"#":"")+(g|(b<<8)|(r<<16)).toString(16).padStart(6,"0");
}

function drawFilledLimb(ctx,x1,y1,r1,x2,y2,r2,fillColor,outlineColor){
  const angle=Math.atan2(y2-y1,x2-x1); const perp=angle+Math.PI/2;
  const cp=Math.cos(perp),sp=Math.sin(perp);
  ctx.save(); ctx.fillStyle=fillColor; ctx.beginPath();
  ctx.moveTo(x1+cp*r1,y1+sp*r1); ctx.lineTo(x2+cp*r2,y2+sp*r2); ctx.arc(x2,y2,r2,perp,perp+Math.PI,true);
  ctx.lineTo(x1-cp*r1,y1-sp*r1); ctx.arc(x1,y1,r1,perp+Math.PI,perp,true);
  ctx.closePath(); ctx.fill(); if(outlineColor){ctx.strokeStyle=outlineColor;ctx.lineWidth=1.5;ctx.stroke();}
  ctx.restore();
}

function drawHeart(ctx,x,y,s){
  ctx.save();ctx.translate(x,y);ctx.beginPath();
  ctx.moveTo(0,-s*.15);ctx.bezierCurveTo(0,-s*.5,s*.7,-s*.5,s*.7,0);
  ctx.bezierCurveTo(s*.7,s*.4,0,s*.9,0,s);ctx.bezierCurveTo(0,s*.9,-s*.7,s*.4,-s*.7,0);
  ctx.bezierCurveTo(-s*.7,-s*.5,0,-s*.5,0,-s*.15);ctx.fill();ctx.restore();
}

function drawCharacter(ctx,cx,cy,S,action,emotion,t,facing,_skin,_style,charIdx=0,intensity=0.5){
  drawShinStyle(ctx,cx,cy,S,action,emotion,t,facing,charIdx,intensity);
}

// ── SHIN-CHAN STYLE ENGINE ──
function drawShinStyle(ctx, cx, cy, S, action, emotion, t, facing, charIdx, intensity=0.5) {
  const styleIdx = charIdx % CHAR_STYLES.length;
  const c = CHAR_STYLES[styleIdx];
  const ol = '#000'; // Pure black bold outlines

  ctx.save();
  ctx.translate(cx, cy);
  if (facing < 0) ctx.scale(-1, 1);

  // Short & Squat proportions (Somi is short!)
  const charScale = 0.85; 
  ctx.scale(charScale, charScale);

  const animScale = 0.6 + intensity * 0.8;
  const breath = Math.sin(t * 2.5 + charIdx) * S * 0.02 * animScale;
  const sway = Math.sin(t * 1.8 + charIdx) * S * 0.03 * animScale;
  const j = getJoints(action, emotion, t, S);

  // Shadow
  ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(0, 5, S * 0.95, S * 0.25, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

  drawSomiLowerBody(ctx, j.hip, j.knL, j.ftL, j.knR, j.ftR, S, c, ol);
  const neckPos = { x: j.neck.x + sway, y: j.neck.y + breath };
  drawSomiTorsoAndNeck(ctx, neckPos, j.hip, S, c, ol, styleIdx);
  drawSomiCurvedArm(ctx, neckPos, j.elbL, j.hanL, S, c, ol, -1, action, styleIdx);
  drawSomiCurvedArm(ctx, neckPos, j.elbR, j.hanR, S, c, ol, 1, action, styleIdx);
  const headPos = { x: j.head.x + sway * 1.3, y: j.head.y + breath };
  drawSomiHead(ctx, headPos.x, headPos.y, S, c, ol, emotion, action, t, styleIdx);

  ctx.restore();
}

function drawSomiTorsoAndNeck(ctx, neck, hip, S, c, ol, styleIdx) {
  const nx = neck.x, ny = neck.y, hx = hip.x, hy = hip.y;
  const sw = S * 0.58, ww = S * 0.52; // Wider torso
  const lw = S * 0.08;
  ctx.save(); ctx.strokeStyle = ol; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  // Neck
  ctx.fillStyle = c.skin;
  const nw = S * 0.18;
  ctx.beginPath(); ctx.moveTo(nx-nw*0.5, ny-S*0.05); ctx.lineTo(nx-nw*0.5, ny+S*0.15); ctx.lineTo(nx+nw*0.5, ny+S*0.15); ctx.lineTo(nx+nw*0.5, ny-S*0.05); ctx.fill(); ctx.stroke();

  // Shirt - Classic flat look
  ctx.fillStyle = c.shirt;
  ctx.beginPath(); ctx.moveTo(nx-nw*0.5, ny+S*0.05); ctx.quadraticCurveTo(nx-sw*0.4, ny+S*0.05, nx-sw*0.5, ny+S*0.25); ctx.bezierCurveTo(nx-sw*0.65, ny+S*0.6, hx-ww*0.65, hy-S*0.4, hx-ww*0.5, hy); ctx.lineTo(hx+ww*0.5, hy); ctx.bezierCurveTo(hx+ww*0.65, hy-S*0.4, nx+sw*0.65, ny+S*0.6, nx+sw*0.5, ny+S*0.25); ctx.quadraticCurveTo(nx+sw*0.4, ny+S*0.05, nx+nw*0.5, ny+S*0.05); ctx.fill(); ctx.stroke();

  // Shorts
  ctx.fillStyle = c.denim;
  const bw = S * 0.45;
  ctx.beginPath(); ctx.moveTo(hx-bw, hy-S*0.75); ctx.lineTo(hx+bw, hy-S*0.75); ctx.lineTo(hx+bw*1.1, hy); ctx.lineTo(hx-bw*1.1, hy); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawSomiLowerBody(ctx, hip, knL, ftL, knR, ftR, S, c, ol) {
  const hw = S * 0.5; const lw = S * 0.08;
  ctx.save(); ctx.strokeStyle = ol; ctx.lineWidth = lw; ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.fillStyle = c.denim;
  ctx.beginPath(); ctx.ellipse(hip.x, hip.y, hw, S*0.35, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  drawSomiCurvedLeg(ctx, {x: hip.x - hw*0.5, y: hip.y}, knL, ftL, S, c, ol);
  drawSomiCurvedLeg(ctx, {x: hip.x + hw*0.5, y: hip.y}, knR, ftR, S, c, ol);
  ctx.restore();
}

function drawSomiCurvedLeg(ctx, start, knee, foot, S, c, ol) {
  const lw2 = S * 0.32; const outLw = S * 0.08;
  ctx.save(); ctx.fillStyle = c.denim; ctx.strokeStyle = ol; ctx.lineWidth = outLw; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(start.x-lw2*0.5, start.y); ctx.quadraticCurveTo(knee.x-lw2*0.6, knee.y, foot.x-lw2*0.4, foot.y); ctx.lineTo(foot.x+lw2*0.4, foot.y); ctx.quadraticCurveTo(knee.x+lw2*0.6, knee.y, start.x+lw2*0.5, start.y); ctx.fill(); ctx.stroke();
  drawSomiShoe(ctx, foot.x, foot.y, S, c, ol); ctx.restore();
}

function drawSomiCurvedArm(ctx, neck, elbow, hand, S, c, ol, side, action, styleIdx) {
  const aw = S * 0.25; const startX = neck.x + side*S*0.3; const startY = neck.y + S*0.25;
  const lw = S * 0.08;
  ctx.save(); ctx.fillStyle = c.shirt; ctx.strokeStyle = ol; ctx.lineWidth = lw; ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(startX-aw*0.5, startY); ctx.quadraticCurveTo(elbow.x-aw*0.6, elbow.y, hand.x-aw*0.4, hand.y); ctx.lineTo(hand.x+aw*0.4, hand.y); ctx.quadraticCurveTo(elbow.x+aw*0.6, elbow.y, startX+aw*0.5, startY); ctx.fill(); ctx.stroke();
  // Hand - simple round ball
  ctx.fillStyle = c.skin;
  ctx.beginPath(); ctx.arc(hand.x, hand.y, S*0.13, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawSomiShoe(ctx, x, y, S, c, ol) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = ol; ctx.lineWidth = S*0.07; ctx.lineJoin='round';
  ctx.fillStyle = c.shoeCol;
  ctx.beginPath(); ctx.ellipse(S*0.1, 0, S*0.28, S*0.15, 0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawSomiHead(ctx, hx, hy, S, c, ol, emotion, action, t, styleIdx) {
  const r = S * 0.48; ctx.save();
  ctx.strokeStyle = ol; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';

  // 1. Potato Head Shape (Bulging Cheek)
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  // Main head curve
  ctx.arc(hx, hy, r, Math.PI * 0.8, Math.PI * 2.2); 
  // The iconic "cheek bulge"
  ctx.bezierCurveTo(hx + r * 1.5, hy + r * 0.2, hx + r * 1.2, hy + r * 1.2, hx, hy + r * 1.05);
  ctx.bezierCurveTo(hx - r * 0.8, hy + r * 1.1, hx - r * 1.2, hy + r * 0.5, hx - r * 0.8, hy - r * 0.2);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // 2. Hair (Graphic & Simplified)
  ctx.fillStyle = c.hair;
  if (styleIdx === 0) { // Somi Bob
    ctx.beginPath();
    ctx.arc(hx, hy - r*0.2, r * 1.25, Math.PI * 0.95, Math.PI * 2.05);
    ctx.quadraticCurveTo(hx + r * 0.8, hy + r * 0.5, hx + r * 1.1, hy + r * 0.8);
    ctx.lineTo(hx - r * 1.1, hy + r * 0.8);
    ctx.quadraticCurveTo(hx - r * 0.8, hy + r * 0.5, hx - r * 1.1, hy - r * 0.1);
    ctx.fill(); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.arc(hx, hy - r*0.3, r*1.2, Math.PI, 0); ctx.fill(); ctx.stroke();
  }

  // 3. Face
  drawSomiFace(ctx, hx, hy, r, emotion, action, t, c);

  // 4. Accessory
  const px = hx - r*0.65, py = hy - r*0.85; ctx.save(); ctx.translate(px, py); ctx.rotate(Math.sin(t*2)*0.1); ctx.fillStyle = c.accCol;
  if (c.acc === 'daisy') { for(let i=0; i<6; i++) { ctx.rotate(Math.PI/3); ctx.beginPath(); ctx.ellipse(r*0.15, 0, r*0.15, r*0.07, 0, 0, Math.PI*2); ctx.fill(); } ctx.fillStyle = c.accCenter; ctx.beginPath(); ctx.arc(0, 0, r*0.08, 0, Math.PI*2); ctx.fill(); }
  else if (c.acc === 'heart') { drawHeart(ctx, 0, 0, r*0.25); }
  else { ctx.beginPath(); for(let i=0; i<5; i++) { const a = i * Math.PI*0.8 - Math.PI/2; ctx.lineTo(Math.cos(a)*r*0.18, Math.sin(a)*r*0.18); } ctx.closePath(); ctx.fill(); }
  ctx.restore(); ctx.restore();
}

function drawSomiFace(ctx, hx, hy, r, emotion, action, t, c) {
  const eo = r*0.45, ey = hy + r*0.15, er = r*0.15;
  const isCrying = action==='cry' || emotion==='sad' || emotion==='lonely';
  const isHappy   = ['happy','excited','love','laugh'].includes(emotion) || action==='laugh' || action==='dance';
  const isAngry   = emotion==='angry';
  const isSleeping = action==='sleep';
  const isKissing  = action==='kiss';

  // --- CATERPILLAR EYEBROWS (Authentic Shin-chan) ---
  ctx.save(); ctx.fillStyle='#000';
  [hx-eo, hx+eo].forEach(bx => {
    ctx.save();
    ctx.translate(bx, ey - r * 0.75);
    if (isAngry) ctx.rotate(bx < hx ? 0.3 : -0.3);
    else if (isHappy) ctx.rotate(bx < hx ? -0.2 : 0.2);
    
    // The thick brow shape
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.35, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();

  // --- SIMPLE EYES ---
  [hx-eo+r*0.05, hx+eo+r*0.05].forEach(ex => {
    ctx.save();
    if(isSleeping || isKissing || isHappy) {
      ctx.strokeStyle='#000'; ctx.lineWidth=3; ctx.lineCap='round';
      ctx.beginPath(); ctx.arc(ex, ey, er, Math.PI, 0); ctx.stroke();
    } else {
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(ex, ey, er * 0.6, er * 1.1, 0, 0, Math.PI*2); ctx.fill();
      // Small white highlight
      ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(ex - er * 0.2, ey - er * 0.4, er * 0.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  });

  // Blush
  ctx.fillStyle = `rgba(255,100,100,0.25)`;
  ctx.beginPath(); ctx.ellipse(hx-eo-r*0.1, hy+r*0.5, r*0.25, r*0.15, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx+eo+r*0.2, hy+r*0.5, r*0.25, r*0.15, 0, 0, Math.PI*2); ctx.fill();

  // Mouth
  ctx.strokeStyle='#000'; ctx.lineWidth=2.5; ctx.lineCap='round';
  if(isCrying) {
    ctx.beginPath(); ctx.arc(hx+r*0.2, hy+r*0.75, r*0.25, Math.PI+0.2, -0.2); ctx.stroke();
  } else if(isAngry) {
    ctx.beginPath(); ctx.moveTo(hx+r*0.1, hy+r*0.65); ctx.lineTo(hx+r*0.4, hy+r*0.68); ctx.stroke();
  } else if(isHappy) {
    ctx.beginPath(); ctx.arc(hx+r*0.25, hy+r*0.55, r*0.35, 0.2, Math.PI-0.2); ctx.stroke();
    ctx.fillStyle='rgba(255,100,100,0.4)'; ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(hx+r*0.25, hy+r*0.6, r*0.18, 0, Math.PI*2); ctx.stroke();
  }
}

// ── UNIVERSAL ENVIRONMENT & PROPS ──
function drawProps(ctx,W,H,GY,S,props,chars,artStyle,t,location){
  if(!chars.length)return; if(!chars.every(c=>c.arrived))return;
  const cx=chars[0].x;

  // 1. UNIVERSAL LOCATION BACKGROUNDS
  ctx.save();
  if(location === 'pcroom') {
    ctx.fillStyle = 'rgba(0, 0, 20, 0.45)'; ctx.fillRect(0, 0, W, GY);
    for(let i=0; i<6; i++) { const lx=(i*W/5+t*50)%W; ctx.shadowBlur=15; ctx.shadowColor='cyan'; ctx.fillStyle='rgba(0,255,255,0.08)'; ctx.fillRect(lx,0,2,GY); }
    ctx.shadowBlur=0;
  } else if(location === 'snow') {
    ctx.fillStyle = 'rgba(220,235,255,0.25)'; ctx.fillRect(0,0,W,GY);
    for(let i=0;i<22;i++){const sx=(Math.sin(i*1.5+t*.5)*W+i*100)%W,sy=(t*80+i*55)%GY; ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(sx,sy,S*0.05,0,Math.PI*2); ctx.fill();}
  } else if(location === 'cafe') {
    ctx.fillStyle='rgba(100,50,0,0.1)'; ctx.fillRect(0,0,W,GY);
    // Menu board
    ctx.fillStyle='rgba(60,30,0,0.35)'; ctx.strokeStyle='rgba(80,50,20,0.6)'; ctx.lineWidth=2;
    roundRect(ctx,W*0.06,GY*0.1,W*0.14,GY*0.35,6).fill(); ctx.stroke();
    ctx.fillStyle='rgba(255,240,200,0.5)'; ctx.font=`${S*0.18}px serif`;
    ctx.fillText('☕',W*0.09,GY*0.28); ctx.fillText('🍰',W*0.09,GY*0.4);
  } else if(location === 'home') {
    ctx.fillStyle='rgba(240,220,200,0.12)'; ctx.fillRect(0,0,W,GY);
    // Window
    const wx=W*0.72,wy=GY*0.12,ww=W*0.19,wh=GY*0.38;
    ctx.fillStyle='rgba(180,220,255,0.38)'; ctx.strokeStyle='rgba(180,150,120,0.7)'; ctx.lineWidth=3;
    roundRect(ctx,wx,wy,ww,wh,6).fill(); ctx.stroke();
    ctx.lineWidth=1.5; ctx.strokeStyle='rgba(150,120,90,0.5)';
    ctx.beginPath(); ctx.moveTo(wx+ww/2,wy); ctx.lineTo(wx+ww/2,wy+wh); ctx.moveTo(wx,wy+wh/2); ctx.lineTo(wx+ww,wy+wh/2); ctx.stroke();
  } else if(location === 'outside') {
    // Trees left and right
    [[W*0.07,GY,1.0],[W*0.14,GY,0.72],[W*0.86,GY,0.88],[W*0.93,GY,0.65]].forEach(([tx,ty,sc])=>{
      ctx.fillStyle='rgba(55,90,45,0.65)';
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx-S*sc*0.65,ty-S*sc*1.6); ctx.lineTo(tx+S*sc*0.65,ty-S*sc*1.6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(tx,ty-S*sc*0.9); ctx.lineTo(tx-S*sc*0.48,ty-S*sc*2.4); ctx.lineTo(tx+S*sc*0.48,ty-S*sc*2.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(80,50,30,0.6)'; ctx.fillRect(tx-S*sc*0.1,ty-S*sc*0.6,S*sc*0.2,S*sc*0.6);
    });
  } else if(location === 'sea') {
    ctx.fillStyle='rgba(30,130,205,0.28)'; ctx.fillRect(0,0,W,GY);
    // Waves
    ctx.strokeStyle='rgba(140,215,255,0.65)'; ctx.lineWidth=2.5;
    for(let i=0;i<4;i++){
      const wy=GY*(0.55+i*0.1);
      ctx.beginPath();
      for(let x=-60;x<W+60;x+=80){const xo=(x+t*45+i*35)%(W+120)-60; ctx.arc(xo+40,wy,40,Math.PI,0);}
      ctx.stroke();
    }
  } else if(location === 'mountain') {
    // Mountain silhouettes in sky area
    ctx.fillStyle='rgba(75,105,85,0.42)';
    ctx.beginPath(); ctx.moveTo(0,GY); ctx.lineTo(W*0.22,GY*0.28); ctx.lineTo(W*0.42,GY); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(65,95,75,0.38)';
    ctx.beginPath(); ctx.moveTo(W*0.28,GY); ctx.lineTo(W*0.58,GY*0.22); ctx.lineTo(W*0.88,GY); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(50,80,60,0.32)';
    ctx.beginPath(); ctx.moveTo(W*0.6,GY); ctx.lineTo(W*0.84,GY*0.38); ctx.lineTo(W,GY*0.72); ctx.lineTo(W,GY); ctx.closePath(); ctx.fill();
  } else if(location === 'school') {
    ctx.fillStyle='rgba(220,200,175,0.18)'; ctx.fillRect(0,0,W,GY);
    ctx.fillStyle='rgba(150,130,110,0.22)'; ctx.fillRect(W*0.62,GY*0.18,W*0.34,GY*0.82);
    ctx.fillStyle='rgba(140,120,100,0.28)'; ctx.fillRect(W*0.67,GY*0.1,W*0.08,GY*0.1);
    for(let r=0;r<3;r++) for(let c=0;c<3;c++){
      ctx.fillStyle='rgba(180,220,255,0.4)';
      roundRect(ctx,W*(0.65+c*0.085),GY*(0.23+r*0.19),W*0.055,GY*0.12,3).fill();
    }
  } else if(location === 'store' || location === 'office') {
    ctx.fillStyle='rgba(200,210,220,0.12)'; ctx.fillRect(0,0,W,GY);
    // Counter/shelves
    ctx.fillStyle='rgba(140,120,100,0.3)'; ctx.strokeStyle='rgba(100,80,60,0.5)'; ctx.lineWidth=2;
    ctx.fillRect(0,GY*0.55,W*0.2,GY*0.45); ctx.strokeRect(0,GY*0.55,W*0.2,GY*0.45);
  }
  ctx.restore();

  // 2. UNIVERSAL PROP SYSTEM
  for(const prop of props){
    ctx.save();
    if(prop==='phone'){
      const px=cx+S*.9,py=GY-S; ctx.fillStyle='#0A0A20'; ctx.strokeStyle='rgba(50, 25, 10, 0.6)'; ctx.lineWidth=2;
      roundRect(ctx,px-S*.2,py-S*.4,S*.4,S*.7,S*.07).fill(); ctx.stroke();
      ctx.fillStyle='#4488FF'; ctx.globalAlpha=.4+Math.sin(t*3)*.2; roundRect(ctx,px-S*.14,py-S*.3,S*.28,S*.45,S*.04).fill();
    }
    else if(prop==='game' || prop==='computer'){
      const px=cx+S*.35,py=GY-S*2.3; ctx.fillStyle='#06060F'; ctx.strokeStyle='rgba(50, 25, 10, 0.6)'; ctx.lineWidth=2;
      roundRect(ctx,px-S*.9,py-S*.72,S*1.8,S*1.28,S*.08).fill(); ctx.stroke();
      ctx.fillStyle='#001E78'; ctx.globalAlpha=.8; roundRect(ctx,px-S*.75,py-S*.58,S*1.5,S*1.0,S*.05).fill();
    }
    else if(prop==='snowball' || prop==='ball'){
      const bx=cx+S*1.5,by=GY-S*0.5; ctx.fillStyle='white'; ctx.strokeStyle='rgba(0,0,0,0.1)';
      ctx.beginPath(); ctx.arc(bx, by, S*0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    }
    else if(prop==='coffee' || prop==='drink'){
      const px=cx+S*1.2,py=GY-S*0.8; ctx.fillStyle='#FFF'; ctx.strokeStyle='rgba(50,25,10,0.5)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(px-S*.15,py); ctx.lineTo(px+S*.15,py); ctx.lineTo(px+S*.1,py+S*.32); ctx.lineTo(px-S*.1,py+S*.32); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#7B4F2E'; ctx.beginPath(); ctx.ellipse(px,py+S*.04,S*.11,S*.06,0,0,Math.PI*2); ctx.fill();
      // Steam
      ctx.strokeStyle='rgba(180,180,180,0.5)'; ctx.lineWidth=1.5;
      for(let i=0;i<2;i++){const sx2=px+(-0.5+i)*S*0.18,sy=py-S*0.1+Math.sin(t*2+i)*S*0.04; ctx.beginPath(); ctx.moveTo(sx2,sy); ctx.quadraticCurveTo(sx2+S*0.05,sy-S*0.15,sx2,sy-S*0.3); ctx.stroke();}
    }
    else if(prop==='book'){
      const bx=cx+S*1.05,by=GY-S*0.85;
      ctx.save(); ctx.translate(bx,by); ctx.rotate(-0.15);
      ctx.fillStyle='#F5E8C0'; ctx.strokeStyle='rgba(50,25,10,0.55)'; ctx.lineWidth=1.5;
      roundRect(ctx,-S*.19,-S*.3,S*.38,S*.5,3).fill(); ctx.stroke();
      ctx.fillStyle='#CC8844'; ctx.fillRect(-S*.19,-S*.3,S*.045,S*.5);
      ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=1;
      for(let i=1;i<4;i++){ctx.beginPath(); ctx.moveTo(-S*.12,-S*.22+i*S*.11); ctx.lineTo(S*.14,-S*.22+i*S*.11); ctx.stroke();}
      ctx.restore();
    }
    else if(prop==='food'){
      const fx=cx+S*1.25,fy=GY-S*0.28;
      ctx.fillStyle='#FFFAF0'; ctx.strokeStyle='rgba(50,25,10,0.4)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.ellipse(fx,fy,S*.48,S*.16,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#F4A261'; ctx.beginPath(); ctx.ellipse(fx,fy-S*.06,S*.32,S*.13,0,Math.PI,0); ctx.fill();
      ctx.fillStyle='#E63946'; ctx.beginPath(); ctx.ellipse(fx-S*.1,fy-S*.12,S*.09,S*.09,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#2A9D8F'; ctx.beginPath(); ctx.ellipse(fx+S*.1,fy-S*.12,S*.07,S*.07,0,0,Math.PI*2); ctx.fill();
    }
    else if(prop==='umbrella'){
      const ux=cx+S*1.4,uy=GY-S*1.6;
      ctx.save();
      ctx.fillStyle='#E63946'; ctx.strokeStyle='rgba(50,25,10,0.55)'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(ux,uy,S*.52,Math.PI,0); ctx.fill(); ctx.stroke();
      ctx.lineWidth=1.2; ctx.strokeStyle='rgba(50,25,10,0.35)';
      for(let i=0;i<=4;i++){const a=Math.PI+(i/4)*Math.PI; ctx.beginPath(); ctx.moveTo(ux,uy); ctx.lineTo(ux+Math.cos(a)*S*.52,uy+Math.sin(a)*S*.52); ctx.stroke();}
      ctx.lineWidth=2; ctx.strokeStyle='rgba(50,25,10,0.55)';
      ctx.beginPath(); ctx.moveTo(ux,uy); ctx.lineTo(ux,uy+S*1.1); ctx.stroke();
      ctx.beginPath(); ctx.arc(ux+S*.1,uy+S*1.1,S*.1,0,Math.PI*1.5); ctx.stroke();
      ctx.restore();
    }
    else if(prop==='music'){
      ctx.save(); ctx.fillStyle='rgba(200,100,220,0.75)'; ctx.font=`${S*0.45}px serif`;
      ctx.fillText('♪',cx+S*1.2,GY-S*2.5+Math.sin(t*2)*S*0.12);
      ctx.globalAlpha=0.6; ctx.fillText('♫',cx+S*1.7,GY-S*2.15+Math.sin(t*2+1.2)*S*0.12);
      ctx.restore();
    }
    else if(prop==='bag'){
      const bx=cx+S*1.1,by=GY-S*0.9;
      ctx.fillStyle='#C084FC'; ctx.strokeStyle='rgba(50,25,10,0.5)'; ctx.lineWidth=1.5;
      roundRect(ctx,bx-S*.22,by-S*.35,S*.44,S*.5,S*.06).fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx,by-S*.35,S*.18,Math.PI,0); ctx.stroke();
    }
    ctx.restore();
  }
}

function getJoints(action,emotion,t,S){
  const b={ head:{x:0,y:-S*2.9},neck:{x:0,y:-S*2.3},elbL:{x:-S*.9,y:-S*1.7},elbR:{x:S*.9,y:-S*1.7},hanL:{x:-S*.9,y:-S*.9},hanR:{x:S*.9,y:-S*.9},hip:{x:0,y:0},knL:{x:-S*.3,y:S*.9},knR:{x:S*.3,y:S*.9},ftL:{x:-S*.5,y:S*1.9},ftR:{x:S*.5,y:S*1.9} };
  
  if(action==='walk'||action==='run'){
    const spd=action==='run'?5:3.2,sw=Math.sin(t*spd)*S*(action==='run'?.65:.52);
    return {head:{x:0,y:b.head.y+Math.sin(t*spd*2)*S*.04},neck:b.neck,elbL:{x:-S*.7,y:-S*1.7-sw*.25},elbR:{x:S*.7,y:-S*1.7+sw*.25},hanL:{x:-S*.65,y:-S*.8-sw*.4},hanR:{x:S*.65,y:-S*.8+sw*.4},hip:b.hip,knL:{x:-S*.3+sw*.3,y:S*.9-clamp(sw,0,S)*.5},knR:{x:S*.3-sw*.3,y:S*.9+clamp(sw,0,S)*.5},ftL:{x:-S*.5+sw*.52,y:S*1.88},ftR:{x:S*.5-sw*.52,y:S*1.88}};
  }
  if(action==='throw'||action==='snowball'){ // 던지는 동작 (눈싸움 등)
    const sw=Math.sin(t*8)*S*0.5;
    return {head:{x:S*.1,y:b.head.y},neck:b.neck,elbL:{x:-S,y:-S*2},elbR:{x:S+sw,y:-S*2.5+sw},hanL:{x:-S*1.2,y:-S*1.5},hanR:{x:S*1.5+sw,y:-S*2.8},hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='game'||action==='work'||action==='write'){
    const jig=Math.sin(t*10)*S*.02;
    return {head:{x:S*.1,y:b.head.y+S*.8},neck:{x:0,y:b.neck.y+S*.8},elbL:{x:-S*.8,y:-S*.6},elbR:{x:S*.8,y:-S*.6+jig},hanL:{x:-S*.4,y:S*.3},hanR:{x:S*.4,y:S*.3+jig},hip:b.hip,knL:{x:-S*.8,y:S*.8},knR:{x:S*.8,y:S*.8},ftL:{x:-S*1.2,y:S*1.5},ftR:{x:S*1.2,y:S*1.5}};
  }
  if(action==='sit'||action==='eat'||action==='read'){
    return {head:{x:0,y:b.head.y+S*.8},neck:{x:0,y:b.neck.y+S*.8},elbL:{x:-S*.7,y:-S*.8},elbR:{x:S*.7,y:-S*.8},hanL:{x:-S*.3,y:S*.2},hanR:{x:S*.3,y:S*.2},hip:b.hip,knL:{x:-S*.8,y:S*.8},knR:{x:S*.8,y:S*.8},ftL:{x:-S*1.2,y:S*1.5},ftR:{x:S*1.2,y:S*1.5}};
  }
  if(action==='cry') {
    const sob=Math.sin(t*6)*S*0.025;
    return {head:{x:S*.12+sob,y:b.head.y+S*.35},neck:{x:S*.06,y:b.neck.y+S*.25},elbL:{x:-S*.45,y:-S*2.1},elbR:{x:S*.45,y:-S*2.1},hanL:{x:-S*.15,y:-S*2.5+sob},hanR:{x:S*.15,y:-S*2.5+sob},hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='laugh') {
    const jl=Math.abs(Math.sin(t*4.5))*S*0.06;
    return {head:{x:0,y:b.head.y-jl},neck:b.neck,elbL:{x:-S*1.15,y:-S*1.85},elbR:{x:S*1.15,y:-S*1.85},hanL:{x:-S*1.35,y:-S*1.35},hanR:{x:S*1.35,y:-S*1.35},hip:{x:0,y:jl*.4},knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='wave') {
    const wv=Math.sin(t*5)*S*0.28;
    return {head:{x:0,y:b.head.y},neck:b.neck,elbL:b.elbL,hanL:b.hanL,elbR:{x:S*.65,y:-S*2.35},hanR:{x:S*1.15+wv,y:-S*3.05},hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='dance') {
    const ds=Math.sin(t*4)*S*0.3, dc=Math.cos(t*4)*S*0.28;
    return {head:{x:ds*.3,y:b.head.y-S*.08},neck:{x:ds*.15,y:b.neck.y},elbL:{x:-S*.8+ds,y:-S*2.2+dc},elbR:{x:S*.8-ds,y:-S*2.2-dc},hanL:{x:-S*1.25+ds,y:-S*2.85+dc},hanR:{x:S*1.25-ds,y:-S*2.85-dc},hip:{x:ds*.2,y:0},knL:{x:-S*.35+ds*.2,y:S*.85},knR:{x:S*.35-ds*.2,y:S*.85},ftL:{x:-S*.5+ds*.3,y:S*1.9},ftR:{x:S*.5-ds*.3,y:S*1.9}};
  }
  if(action==='jump') {
    const jt=Math.abs(Math.sin(t*2.5))*S*0.35;
    return {head:{x:0,y:b.head.y-jt},neck:{x:0,y:b.neck.y-jt},elbL:{x:-S*1.0,y:-S*2.0-jt},elbR:{x:S*1.0,y:-S*2.0-jt},hanL:{x:-S*1.3,y:-S*2.55-jt},hanR:{x:S*1.3,y:-S*2.55-jt},hip:{x:0,y:-jt},knL:{x:-S*.5,y:S*.45-jt*.4},knR:{x:S*.5,y:S*.45-jt*.4},ftL:{x:-S*.55,y:S*1.35-jt},ftR:{x:S*.55,y:S*1.35-jt}};
  }
  if(action==='drink') {
    const dl=Math.sin(t*1.5)*S*0.03;
    return {head:{x:S*.12,y:b.head.y+S*.1},neck:b.neck,elbL:b.elbL,hanL:b.hanL,elbR:{x:S*.55,y:-S*1.85},hanR:{x:S*.22,y:-S*2.45+dl},hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='cook') {
    const st=Math.sin(t*4)*S*0.14;
    return {head:{x:S*.1,y:b.head.y+S*.3},neck:{x:0,y:b.neck.y+S*.2},elbL:{x:-S*.85,y:-S*1.2},elbR:{x:S*.85,y:-S*1.2},hanL:{x:-S*.45+st,y:-S*.5+st*.5},hanR:{x:S*.45-st,y:-S*.5-st*.5},hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='talk') {
    const tb=Math.sin(t*3)*S*0.1;
    return {head:{x:tb*.15,y:b.head.y},neck:b.neck,elbL:b.elbL,hanL:b.hanL,elbR:{x:S*.65,y:-S*1.55},hanR:{x:S*1.05+tb,y:-S*1.05+tb},hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='sleep') {
    return {head:{x:S*.12,y:b.head.y+S*.8},neck:{x:0,y:b.neck.y+S*.8},elbL:{x:-S*.6,y:-S*.75},elbR:{x:S*.5,y:-S*.75},hanL:{x:-S*.2,y:-S*.25},hanR:{x:S*.2,y:-S*.25},hip:b.hip,knL:{x:-S*.8,y:S*.75},knR:{x:S*.8,y:S*.75},ftL:{x:-S*1.2,y:S*1.5},ftR:{x:S*1.2,y:S*1.5}};
  }
  if(action==='hug') {
    const hb=Math.sin(t*1.5)*S*0.02;
    return {head:{x:S*.1,y:b.head.y+hb},neck:b.neck,elbL:{x:-S*1.35,y:-S*2.0},elbR:{x:S*1.35,y:-S*2.0},hanL:{x:-S*1.65,y:-S*1.6},hanR:{x:S*1.65,y:-S*1.6},hip:{x:0,y:hb*.4},knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='shop') {
    const sw=Math.sin(t*1.8)*S*0.02;
    return {head:{x:0,y:b.head.y},neck:b.neck,elbL:{x:-S*.8,y:-S*1.5},hanL:{x:-S*.9,y:-S*.7+sw},elbR:b.elbR,hanR:b.hanR,hip:b.hip,knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
  }
  if(action==='swim') {
    const sw=Math.sin(t*3)*S*0.4;
    return {head:{x:sw*.2,y:b.head.y+S*.5},neck:{x:sw*.1,y:b.neck.y+S*.4},elbL:{x:-S*1.1+sw,y:-S*2.0},elbR:{x:S*1.1-sw,y:-S*2.0},hanL:{x:-S*1.6+sw,y:-S*2.45},hanR:{x:S*1.6-sw,y:-S*2.45},hip:b.hip,knL:{x:-S*.4+sw*.3,y:S*.8},knR:{x:S*.4-sw*.3,y:S*.8},ftL:{x:-S*.5+sw*.4,y:S*1.8},ftR:{x:S*.5-sw*.4,y:S*1.8}};
  }
  if(action==='climb') {
    const cl=Math.sin(t*3)*S*0.3;
    return {head:{x:0,y:b.head.y-S*.2},neck:{x:0,y:b.neck.y-S*.1},elbL:{x:-S*.6,y:-S*2.5+cl},elbR:{x:S*.6,y:-S*2.2-cl},hanL:{x:-S*.4,y:-S*3.0+cl},hanR:{x:S*.4,y:-S*2.8-cl},hip:b.hip,knL:{x:-S*.5,y:S*.7+cl*.5},knR:{x:S*.5,y:S*.7-cl*.5},ftL:{x:-S*.5,y:S*1.7+cl},ftR:{x:S*.5,y:S*1.7-cl}};
  }
  const sw=Math.sin(t*1.2)*S*.04;
  return {head:{x:sw,y:b.head.y+sw*.5},neck:{x:sw*.5,y:b.neck.y},elbL:b.elbL,elbR:b.elbR,hanL:b.hanL,hanR:b.hanR,hip:{x:sw*.3,y:0},knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
