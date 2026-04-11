// ═══════════════════════════════════════════════════════
//  CHARACTER & PROPS DRAWING SYSTEM (SOMI & FRIENDS V2.1)
// ═══════════════════════════════════════════════════════

const CHAR_STYLES = [
  { skin: '#FFDDC1', skinHi: '#FFF5EE', hair: '#A67C52', eye: '#FFBF00', shirt: '#E0F2FF', stripe: '#FFFFFF', denim: '#4682B4', acc: 'daisy', accCol: '#FFFFFF', accCenter: '#FFD700' },
  { skin: '#FFE4C4', skinHi: '#FFF9F0', hair: '#2D1A0D', eye: '#5D4037', shirt: '#FFF9C4', stripe: '#FFD54F', denim: '#64B5F6', acc: 'heart', accCol: '#FF8FAB', accCenter: '#FFB3C6' },
  { skin: '#FFDDC1', skinHi: '#FFF9F5', hair: '#D2B48C', eye: '#4FC3F7', shirt: '#C8E6C9', stripe: '#A5D6A7', denim: '#546E7A', acc: 'star', accCol: '#FFD93D', accCenter: '#FFF176' }
];

// ── UTILITIES ──
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
  ctx.closePath(); ctx.fill(); if(outlineColor){ctx.strokeStyle=outlineColor;ctx.lineWidth=1.2;ctx.stroke();}
  ctx.restore();
}

function drawHeart(ctx,x,y,s){
  ctx.save();ctx.translate(x,y);ctx.beginPath();
  ctx.moveTo(0,-s*.15);ctx.bezierCurveTo(0,-s*.5,s*.7,-s*.5,s*.7,0);
  ctx.bezierCurveTo(s*.7,s*.4,0,s*.9,0,s);ctx.bezierCurveTo(0,s*.9,-s*.7,s*.4,-s*.7,0);
  ctx.bezierCurveTo(-s*.7,-s*.5,0,-s*.5,0,-s*.15);ctx.fill();ctx.restore();
}

function drawCharacter(ctx,cx,cy,S,action,emotion,t,facing,_skin,_style,charIdx=0){
  drawWarmChiChar(ctx,cx,cy,S,action,emotion,t,facing,charIdx);
}

// ── SOMI SYSTEM ──
function drawWarmChiChar(ctx, cx, cy, S, action, emotion, t, facing, charIdx) {
  const styleIdx = charIdx % CHAR_STYLES.length;
  const c = CHAR_STYLES[styleIdx];
  const ol = 'rgba(50, 25, 10, 0.6)';
  
  ctx.save();
  ctx.translate(cx, cy);
  if (facing < 0) ctx.scale(-1, 1);

  const breath = Math.sin(t * 2.5 + charIdx) * S * 0.03;
  const sway = Math.sin(t * 1.8 + charIdx) * S * 0.04;
  const j = getJoints(action, emotion, t, S);

  ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(0, 5, S * 0.9, S * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

  drawSomiLowerBody(ctx, j.hip, j.knL, j.ftL, j.knR, j.ftR, S, c, ol);
  const neckPos = { x: j.neck.x + sway, y: j.neck.y + breath };
  drawSomiTorsoAndNeck(ctx, neckPos, j.hip, S, c, ol, styleIdx);
  drawSomiCurvedArm(ctx, neckPos, j.elbL, j.hanL, S, c, ol, -1, action, styleIdx);
  drawSomiCurvedArm(ctx, neckPos, j.elbR, j.hanR, S, c, ol, 1, action, styleIdx);
  const headPos = { x: j.head.x + sway * 1.2, y: j.head.y + breath };
  drawSomiHead(ctx, headPos.x, headPos.y, S, c, ol, emotion, action, t, styleIdx);

  ctx.restore();
}

function drawSomiTorsoAndNeck(ctx, neck, hip, S, c, ol, styleIdx) {
  const nx = neck.x, ny = neck.y, hx = hip.x, hy = hip.y;
  const sw = S * 0.55, ww = S * 0.48;
  ctx.save();
  ctx.fillStyle = c.skin; ctx.strokeStyle = ol; ctx.lineWidth = 1.2;
  const nw = S * 0.18;
  ctx.beginPath(); ctx.moveTo(nx - nw*0.5, ny - S*0.1); ctx.lineTo(nx - nw*0.5, ny + S*0.2); ctx.lineTo(nx + nw*0.5, ny + S*0.2); ctx.lineTo(nx + nw*0.5, ny - S*0.1); ctx.fill(); ctx.stroke();

  ctx.fillStyle = c.shirt; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(nx - nw*0.5, ny + S*0.1); ctx.quadraticCurveTo(nx - sw*0.4, ny + S*0.1, nx - sw*0.5, ny + S*0.3); ctx.bezierCurveTo(nx - sw*0.65, ny + S*0.7, hx - ww*0.65, hy - S*0.5, hx - ww*0.5, hy); ctx.lineTo(hx + ww*0.5, hy); ctx.bezierCurveTo(hx + ww*0.65, hy - S*0.5, nx + sw*0.65, ny + S*0.7, nx + sw*0.5, ny + S*0.3); ctx.quadraticCurveTo(nx + sw*0.4, ny + S*0.1, nx + nw*0.5, ny + S*0.1); ctx.fill(); ctx.stroke();
  
  ctx.save(); ctx.clip();
  if (styleIdx === 0) {
    ctx.strokeStyle = c.stripe; ctx.lineWidth = S * 0.07;
    for(let i=0; i<12; i++) { const ly = ny + i * S * 0.12; ctx.beginPath(); ctx.moveTo(nx - S, ly); ctx.lineTo(nx + S, ly); ctx.stroke(); }
  } else if (styleIdx === 1) {
    ctx.fillStyle = c.stripe; for(let i=0; i<5; i++) for(let j=0; j<5; j++) { ctx.beginPath(); ctx.arc(nx - S*0.5 + i*S*0.25, ny + j*S*0.25, S*0.04, 0, Math.PI*2); ctx.fill(); }
  }
  ctx.restore();

  ctx.fillStyle = c.denim; const bw = S * 0.38;
  ctx.beginPath(); ctx.moveTo(hx - bw, hy - S*0.85); ctx.lineTo(hx + bw, hy - S*0.85); ctx.lineTo(hx + bw*1.1, hy); ctx.lineTo(hx - bw*1.1, hy); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.lineWidth = S * 0.1; ctx.beginPath(); ctx.moveTo(nx - sw*0.35, ny + S*0.25); ctx.quadraticCurveTo(nx - sw*0.45, hy - S*0.5, hx - bw*0.8, hy - S*0.85); ctx.moveTo(nx + sw*0.35, ny + S*0.25); ctx.quadraticCurveTo(nx + sw*0.45, hy - S*0.5, hx + bw*0.8, hy - S*0.85); ctx.stroke();
  ctx.restore();
}

function drawSomiLowerBody(ctx, hip, knL, ftL, knR, ftR, S, c, ol) {
  const hw = S * 0.48; ctx.save(); ctx.fillStyle = c.denim; ctx.strokeStyle = ol; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.ellipse(hip.x, hip.y, hw, S * 0.42, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  drawSomiCurvedLeg(ctx, {x: hip.x - hw*0.5, y: hip.y}, knL, ftL, S, c, ol);
  drawSomiCurvedLeg(ctx, {x: hip.x + hw*0.5, y: hip.y}, knR, ftR, S, c, ol);
  ctx.restore();
}

function drawSomiCurvedLeg(ctx, start, knee, foot, S, c, ol) {
  const lw = S * 0.3; ctx.save(); ctx.fillStyle = c.denim; ctx.strokeStyle = ol; ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(start.x - lw*0.5, start.y); ctx.quadraticCurveTo(knee.x - lw*0.6, knee.y, foot.x - lw*0.4, foot.y); ctx.lineTo(foot.x + lw*0.4, foot.y); ctx.quadraticCurveTo(knee.x + lw*0.6, knee.y, start.x + lw*0.5, start.y); ctx.fill(); ctx.stroke();
  drawSomiShoe(ctx, foot.x, foot.y, S, c, ol); ctx.restore();
}

function drawSomiCurvedArm(ctx, neck, elbow, hand, S, c, ol, side, action, styleIdx) {
  const aw = S * 0.2; const startX = neck.x + side * S * 0.3; const startY = neck.y + S * 0.3;
  ctx.save(); ctx.fillStyle = c.shirt; ctx.strokeStyle = ol; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(startX - aw*0.5, startY); ctx.quadraticCurveTo(elbow.x - aw*0.6, elbow.y, hand.x - aw*0.4, hand.y); ctx.lineTo(hand.x + aw*0.4, hand.y); ctx.quadraticCurveTo(elbow.x + aw*0.6, elbow.y, startX + aw*0.5, startY); ctx.fill(); ctx.stroke();
  ctx.fillStyle = c.skin; ctx.beginPath(); ctx.arc(hand.x, hand.y, S*0.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  if (side > 0 && action !== 'walk' && styleIdx === 0) {
    ctx.save(); ctx.translate(hand.x, hand.y); ctx.rotate(-0.2); ctx.fillStyle = '#FFF9F0'; ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 1;
    roundRect(ctx, -S*0.18, -S*0.28, S*0.36, S*0.48, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FFD700'; ctx.fillRect(S*0.1, -S*0.15, S*0.05, S*0.3); ctx.restore();
  }
  ctx.restore();
}

function drawSomiShoe(ctx, x, y, S, c, ol) {
  ctx.save(); ctx.translate(x, y);
  const shoeCol = (c.acc === 'daisy') ? '#FF4D4D' : (c.acc === 'heart') ? '#BA68C8' : '#455A64';
  ctx.fillStyle = shoeCol; ctx.beginPath(); ctx.ellipse(S*0.08, 0, S*0.24, S*0.13, 0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.ellipse(S*0.08, S*0.06, S*0.2, S*0.05, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawSomiHead(ctx, hx, hy, S, c, ol, emotion, action, t, styleIdx) {
  const r = S * 0.45; ctx.save();
  ctx.fillStyle = c.hair; ctx.strokeStyle = ol; ctx.lineWidth = 1.8;
  if (styleIdx === 0) { ctx.beginPath(); ctx.ellipse(hx, hy + r*0.15, r*1.2, r*1.15, Math.sin(t)*0.05, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
  else if (styleIdx === 1) { ctx.beginPath(); ctx.ellipse(hx, hy + r*0.4, r*1.3, r*1.4, Math.sin(t)*0.08, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
  else { ctx.beginPath(); ctx.ellipse(hx, hy - r*0.1, r*1.1, r*1.0, Math.sin(t)*0.03, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
  const hg = ctx.createRadialGradient(hx - r*0.25, hy - r*0.25, 0, hx, hy, r); hg.addColorStop(0, c.skinHi); hg.addColorStop(1, c.skin);
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  drawSomiFace(ctx, hx, hy, r, emotion, action, t, c);
  ctx.fillStyle = c.hair; ctx.beginPath(); ctx.arc(hx, hy - r*0.45, r*1.05, Math.PI+0.45, -0.45); ctx.quadraticCurveTo(hx + r*0.2, hy - r*0.05, hx - r*0.95, hy - r*0.4); ctx.fill(); ctx.stroke();
  const px = hx - r*0.65, py = hy - r*0.75; ctx.save(); ctx.translate(px, py); ctx.rotate(Math.sin(t*2)*0.2); ctx.fillStyle = c.accCol;
  if (c.acc === 'daisy') { for(let i=0; i<6; i++) { ctx.rotate(Math.PI/3); ctx.beginPath(); ctx.ellipse(r*0.12, 0, r*0.12, r*0.06, 0, 0, Math.PI*2); ctx.fill(); } ctx.fillStyle = c.accCenter; ctx.beginPath(); ctx.arc(0, 0, r*0.07, 0, Math.PI*2); ctx.fill(); }
  else if (c.acc === 'heart') { drawHeart(ctx, 0, 0, r*0.2); }
  else { ctx.beginPath(); for(let i=0; i<5; i++) { const a = i * Math.PI*0.8 - Math.PI/2; ctx.lineTo(Math.cos(a)*r*0.15, Math.sin(a)*r*0.15); } ctx.closePath(); ctx.fill(); }
  ctx.restore(); ctx.restore();
}

function drawSomiFace(ctx, hx, hy, r, emotion, action, t, c) {
  const eo = r*0.38, ey = hy - r*0.02, er = r*0.16;
  [hx-eo, hx+eo].forEach(ex => {
    ctx.save(); ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.ellipse(ex, ey, er, er*1.15, 0, 0, Math.PI*2); ctx.fill();
    const ig = ctx.createRadialGradient(ex, ey, 0, ex, ey, er); ig.addColorStop(0, c.eye); ig.addColorStop(0.6, liftColor(c.eye, -0.2)); ig.addColorStop(1, '#000');
    ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(ex, ey+er*0.15, er*0.85, er*0.95, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(ex-er*0.35, ey-er*0.35, er*0.45, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(ex+er*0.4, ey+er*0.3, er*0.2, 0, Math.PI*2); ctx.fill(); ctx.restore();
  });
  const bAlpha = 0.2 + Math.sin(t*1.5)*0.1; ctx.fillStyle = `rgba(255, 150, 150, ${bAlpha})`;
  ctx.beginPath(); ctx.arc(hx-eo-r*0.1, hy+r*0.3, r*0.2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(hx+eo+r*0.1, hy+r*0.3, r*0.2, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(50, 25, 10, 0.6)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(hx, hy + r*0.35, r*0.22, 0.15, Math.PI-0.15); ctx.stroke();
}

function drawProps(ctx,W,H,GY,S,props,chars,artStyle,t,location){
  if(!props||!chars.length)return;
  if(!chars.every(c=>c.arrived))return;
  const cx=chars[0].x;

  // 1. LOCATION BACKGROUND (피시방 배경)
  if(location === 'pcroom') {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 20, 0.4)';
    ctx.fillRect(0, 0, W, GY);
    // 게이밍 LED 효과
    for(let i=0; i<5; i++) {
      const lx = (i*W/4 + t*50) % W;
      ctx.shadowBlur = 15; ctx.shadowColor = 'cyan';
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.fillRect(lx, 0, 2, GY);
    }
    ctx.restore();
  }

  for(const prop of props){
    if(prop==='phone'){
      const px=cx+S*.9,py=GY-S; ctx.save(); ctx.fillStyle='#0A0A20'; ctx.strokeStyle='rgba(50, 25, 10, 0.6)'; ctx.lineWidth=2;
      roundRect(ctx,px-S*.2,py-S*.4,S*.4,S*.7,S*.07).fill(); ctx.stroke();
      ctx.fillStyle='#4488FF'; ctx.globalAlpha=.4+Math.sin(t*3)*.2; roundRect(ctx,px-S*.14,py-S*.3,S*.28,S*.45,S*.04).fill(); ctx.restore();
    }
    if(prop==='game'||prop==='computer'){
      const px=cx+S*.35,py=GY-S*2.3; ctx.save(); ctx.fillStyle='#06060F'; ctx.strokeStyle='rgba(50, 25, 10, 0.6)'; ctx.lineWidth=2;
      roundRect(ctx,px-S*.9,py-S*.72,S*1.8,S*1.28,S*.08).fill(); ctx.stroke();
      // 게이밍 화면
      ctx.fillStyle='#001E78'; ctx.globalAlpha=.8; roundRect(ctx,px-S*.75,py-S*.58,S*1.5,S*1.0,S*.05).fill();
      ctx.strokeStyle='#00FFFF'; ctx.globalAlpha=.3; for(let i=0;i<5;i++){ ctx.beginPath();ctx.moveTo(px-S*.75,py-S*.58+i*S*.2);ctx.lineTo(px+S*.75,py-S*.58+i*S*.2);ctx.stroke(); }
      // 키보드 LED
      ctx.fillStyle='#FF00FF'; ctx.globalAlpha=0.6; ctx.fillRect(px-S*.6, py+S*.75, S*1.2, S*.05);
      ctx.restore();
    }
  }
}


function getJoints(action,emotion,t,S){
  const b={ head:{x:0,y:-S*2.9},neck:{x:0,y:-S*2.3},elbL:{x:-S*.9,y:-S*1.7},elbR:{x:S*.9,y:-S*1.7},hanL:{x:-S*.9,y:-S*.9},hanR:{x:S*.9,y:-S*.9},hip:{x:0,y:0},knL:{x:-S*.3,y:S*.9},knR:{x:S*.3,y:S*.9},ftL:{x:-S*.5,y:S*1.9},ftR:{x:S*.5,y:S*1.9} };
  if(action==='walk'||action==='run'){
    const spd=action==='run'?5:3.2,sw=Math.sin(t*spd)*S*(action==='run'?.65:.52);
    return {head:{x:0,y:b.head.y+Math.sin(t*spd*2)*S*.04},neck:b.neck,elbL:{x:-S*.7,y:-S*1.7-sw*.25},elbR:{x:S*.7,y:-S*1.7+sw*.25},hanL:{x:-S*.65,y:-S*.8-sw*.4},hanR:{x:S*.65,y:-S*.8+sw*.4},hip:b.hip,knL:{x:-S*.3+sw*.3,y:S*.9-clamp(sw,0,S)*.5},knR:{x:S*.3-sw*.3,y:S*.9+clamp(sw,0,S)*.5},ftL:{x:-S*.5+sw*.52,y:S*1.88},ftR:{x:S*.5-sw*.52,y:S*1.88}};
  }
  if(action==='game'||action==='work'||action==='write'){
    const jig=Math.sin(t*10)*S*.02;
    return {head:{x:S*.1,y:b.head.y+S*.8},neck:{x:0,y:b.neck.y+S*.8},elbL:{x:-S*.8,y:-S*.6},elbR:{x:S*.8,y:-S*.6+jig},hanL:{x:-S*.4,y:S*.3},hanR:{x:S*.4,y:S*.3+jig},hip:b.hip,knL:{x:-S*.8,y:S*.8},knR:{x:S*.8,y:S*.8},ftL:{x:-S*1.2,y:S*1.5},ftR:{x:S*1.2,y:S*1.5}};
  }
  if(action==='sit'||action==='eat'||action==='read'){
    return {head:{x:0,y:b.head.y+S*.8},neck:{x:0,y:b.neck.y+S*.8},elbL:{x:-S*.7,y:-S*.8},elbR:{x:S*.7,y:-S*.8},hanL:{x:-S*.3,y:S*.2},hanR:{x:S*.3,y:S*.2},hip:b.hip,knL:{x:-S*.8,y:S*.8},knR:{x:S*.8,y:S*.8},ftL:{x:-S*1.2,y:S*1.5},ftR:{x:S*1.2,y:S*1.5}};
  }
  const sw=Math.sin(t*1.2)*S*.04;
  return {head:{x:sw,y:b.head.y+sw*.5},neck:{x:sw*.5,y:b.neck.y},elbL:b.elbL,elbR:b.elbR,hanL:b.hanL,hanR:b.hanR,hip:{x:sw*.3,y:0},knL:b.knL,knR:b.knR,ftL:b.ftL,ftR:b.ftR};
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
