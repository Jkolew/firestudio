// ═══════════════════════════════════════════════════════
//  UNIVERSAL DRAWING ENGINE (V4.2 - WARM OUTLINE)
// ═══════════════════════════════════════════════════════

const CHAR_STYLES = [
  { skin:'#FFD5AA', hair:'#2C1D10', eye:'#442410', shirt:'#FF4444', denim:'#FFEE55', acc:'daisy', accCol:'#FFFFFF', accCenter:'#FFE000', shoeCol:'#EEAA33' },
  { skin:'#FFD5AA', hair:'#2C1D10', eye:'#442410', shirt:'#FF7799', denim:'#2255CC', acc:'heart', accCol:'#FF4477', accCenter:'#FFAACC', shoeCol:'#AA44CC' },
  { skin:'#FFD5AA', hair:'#2C1D10', eye:'#442410', shirt:'#66DDAA', denim:'#334466', acc:'star', accCol:'#FFEE00', accCenter:'#FFF176', shoeCol:'#445566' }
];

function roundRect(ctx,x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();return ctx;}
function drawHeart(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,-s*.15);ctx.bezierCurveTo(0,-s*.5,s*.7,-s*.5,s*.7,0);ctx.bezierCurveTo(s*.7,s*.4,0,s*.9,0,s);ctx.bezierCurveTo(0,s*.9,-s*.7,s*.4,-s*.7,0);ctx.bezierCurveTo(-s*.7,-s*.5,0,-s*.5,0,-s*.15);ctx.fill();ctx.restore();}

function drawCharacter(ctx,cx,cy,S,action,emotion,t,facing,_skin,_style,charIdx=0,intensity=0.5){
  drawShinStyle(ctx,cx,cy,S,action,emotion,t,facing,charIdx,intensity);
}

function drawShinStyle(ctx, cx, cy, S, action, emotion, t, facing, charIdx, intensity=0.5) {
  const styleIdx = charIdx % CHAR_STYLES.length;
  const c = CHAR_STYLES[styleIdx];
  const ol = '#442410'; // Warm, dark brown outlines

  ctx.save();
  ctx.translate(cx, cy);
  if (facing < 0) ctx.scale(-1, 1);

  const charScale = 0.9; 
  ctx.scale(charScale, charScale);

  const animScale = 0.6 + intensity * 0.8;
  const breath = Math.sin(t * 2.5 + charIdx) * S * 0.02 * animScale;
  const sway = Math.sin(t * 1.8 + charIdx) * S * 0.03 * animScale;
  const j = getJoints(action, emotion, t, S, intensity);

  // Ground Shadow
  ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(0, 0, S * 0.85, S * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

  drawSomiLowerBody(ctx, j.hip, j.knL, j.ftL, j.knR, j.ftR, S, c, ol);
  const neckPos = { x: j.neck.x + sway, y: j.neck.y + breath };
  drawSomiTorso(ctx, neckPos, j.hip, S, c, ol);
  drawSomiCurvedArm(ctx, neckPos, j.elbL, j.hanL, S, c, ol, -1);
  drawSomiCurvedArm(ctx, neckPos, j.elbR, j.hanR, S, c, ol, 1);
  const headPos = { x: j.head.x + sway * 1.3, y: j.head.y + breath };
  drawSomiHead(ctx, headPos.x, headPos.y, S, c, ol, emotion, action, t, charIdx);

  ctx.restore();
}

function drawSomiTorso(ctx, neck, hip, S, c, ol) {
    const nx = neck.x, ny = neck.y, hx = hip.x, hy = hip.y;
    const bodyWidth = S * 0.55, waistWidth = S * 0.5;
    const lw = S * 0.1; // Thicker lines for body
    ctx.save();
    ctx.strokeStyle = ol; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // Torso (Shirt)
    ctx.fillStyle = c.shirt;
    ctx.beginPath();
    ctx.moveTo(nx - S * 0.2, ny);
    ctx.lineTo(nx + S * 0.2, ny);
    ctx.lineTo(hx + waistWidth / 2, hy - S * 0.5);
    ctx.lineTo(hx - waistWidth / 2, hy - S * 0.5);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();
}

function drawSomiLowerBody(ctx, hip, knL, ftL, knR, ftR, S, c, ol) {
    const hw = S * 0.5, lw = S * 0.1;
    ctx.save();
    ctx.strokeStyle = ol; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // Shorts
    ctx.fillStyle = c.denim;
    ctx.beginPath();
    ctx.moveTo(hip.x - hw, hip.y - S * 0.5);
    ctx.lineTo(hip.x + hw, hip.y - S * 0.5);
    ctx.lineTo(hip.x + hw * 0.9, hip.y + S * 0.4);
    ctx.lineTo(hip.x - hw * 0.9, hip.y + S * 0.4);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Legs
    drawSomiCurvedLeg(ctx, { x: hip.x - hw * 0.6, y: hip.y + S * 0.3 }, knL, ftL, S, c, ol);
    drawSomiCurvedLeg(ctx, { x: hip.x + hw * 0.6, y: hip.y + S * 0.3 }, knR, ftR, S, c, ol);
    ctx.restore();
}

function drawSomiCurvedLeg(ctx, start, knee, foot, S, c, ol) {
  const legW = S * 0.22, shoeW = S * 0.28, shoeH = S * 0.15;
  ctx.save(); ctx.strokeStyle = ol; ctx.lineJoin='round'; ctx.lineCap='round';

  // Leg
  ctx.lineWidth = S * 0.09;
  ctx.fillStyle = c.skin;
  ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.quadraticCurveTo(knee.x, knee.y, foot.x, foot.y - shoeH*0.8); ctx.stroke();

  // Shoe
  ctx.lineWidth = S * 0.07;
  ctx.fillStyle = c.shoeCol;
  ctx.beginPath(); ctx.ellipse(foot.x, foot.y, shoeW, shoeH, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawSomiCurvedArm(ctx, neck, elbow, hand, S, c, ol, side) {
    const armW = S * 0.2;
    const startX = neck.x + side * S * 0.15;
    const startY = neck.y + S * 0.1;

    ctx.save(); ctx.strokeStyle = ol; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    
    // Arm (Sleeve)
    ctx.lineWidth = S * 0.09;
    ctx.fillStyle = c.shirt;
    ctx.beginPath(); ctx.moveTo(startX, startY); ctx.quadraticCurveTo(elbow.x, elbow.y, hand.x, hand.y); ctx.stroke();

    // Hand
    ctx.lineWidth = S * 0.08;
    ctx.fillStyle = c.skin;
    ctx.beginPath(); ctx.arc(hand.x, hand.y, S * 0.14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
}


function drawSomiHead(ctx, hx, hy, S, c, ol, emotion, action, t, charIdx) {
  const r = S * 0.5;
  ctx.save();
  ctx.strokeStyle = ol; ctx.lineWidth = S * 0.08; ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  // Head Shape
  ctx.fillStyle = c.skin;
  ctx.beginPath();
  ctx.ellipse(hx, hy, r, r * 1.05, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Hair
  ctx.fillStyle = c.hair;
  ctx.beginPath();
  ctx.arc(hx, hy - r * 0.5, r, Math.PI*0.9, Math.PI*0.1, true);
  ctx.arc(hx, hy + r * 0.2, r * 0.6, Math.PI*0.1, Math.PI*0.9, false)
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  
  // Face
  drawSomiFace(ctx, hx, hy, r, emotion, action, t, c, ol);

  ctx.restore();
}

function drawSomiFace(ctx, hx, hy, r, emotion, action, t, c, ol) {
  const eo = r*0.5, ey = hy + r*0.1, er = r*0.12;
  const isCrying = ['cry', 'sad', 'lonely'].includes(emotion) || action==='cry';
  const isHappy = ['happy', 'excited', 'love', 'laugh'].includes(emotion) || ['laugh', 'dance','wave'].includes(action);
  const isAngry = emotion === 'angry';
  const isSleeping = action === 'sleep';
  const isKissing = action === 'kiss';

  // Eyebrows
  ctx.save(); ctx.fillStyle = ol;
  [hx - eo, hx + eo].forEach(bx => {
      ctx.save();
      ctx.translate(bx, ey - r * 0.55);
      if (isAngry) ctx.rotate(bx < hx ? 0.35 : -0.35);
      else if (isHappy) ctx.rotate(bx < hx ? -0.15 : 0.15);
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.38, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
  });
  ctx.restore();

  // Eyes
  [hx - eo, hx + eo].forEach(ex => {
      ctx.save();
      if (isHappy || isSleeping || isKissing) {
          ctx.strokeStyle = ol; ctx.lineWidth = S * 0.05; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.arc(ex, ey, er, Math.PI * 1.2, -0.2); ctx.stroke();
      } else {
          ctx.fillStyle = ol; ctx.beginPath(); ctx.ellipse(ex, ey, er * 0.7, er, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
  });

  // Blush
  ctx.fillStyle = `rgba(255, 100, 100, 0.25)`;
  ctx.beginPath(); ctx.arc(hx - r * 0.6, hy + r * 0.4, r * 0.25, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + r * 0.6, hy + r * 0.4, r * 0.25, 0, Math.PI * 2); ctx.fill();

  // Mouth
  ctx.strokeStyle = ol; ctx.lineWidth = S * 0.04; ctx.lineCap = 'round';
  ctx.beginPath();
  if (isCrying) {
      ctx.arc(hx, hy + r * 0.8, r * 0.4, 0, Math.PI);
  } else if (isHappy) {
      ctx.arc(hx, hy + r * 0.4, r * 0.5, 0.2, Math.PI - 0.2);
  } else {
      ctx.moveTo(hx - r * 0.2, hy + r * 0.55);
      ctx.lineTo(hx + r * 0.2, hy + r * 0.55);
  }
  ctx.stroke();
}

// ── UNIVERSAL ENVIRONMENT & PROPS ──
function drawProps(ctx,W,H,GY,S,props,chars,artStyle,t,location){
  if(!chars.length)return;
  const cx=chars[0].x, ol='#442410';
  ctx.save();
  ctx.strokeStyle = ol; ctx.lineWidth = S * 0.07; ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  if(location === 'cafe') { ctx.fillStyle='rgba(100,50,0,0.08)'; ctx.fillRect(0,0,W,GY); }
  else if(location === 'home') { ctx.fillStyle='rgba(240,220,200,0.08)'; ctx.fillRect(0,0,W,GY); const wx=W*.1,wy=GY*.15,ww=W*.2,wh=GY*.3;ctx.fillStyle='rgba(180,220,255,0.5)';ctx.strokeStyle=ol;ctx.lineWidth=S*0.08;roundRect(ctx,wx,wy,ww,wh,8).fill();ctx.stroke();ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.moveTo(wx,wy+wh/2);ctx.lineTo(wx+ww,wy+wh/2);ctx.stroke();}
  else if(location === 'outside') {[[W*.1,GY,1.2],[W*.85,GY,1.0]].forEach(([tx,ty,sc])=>{ctx.fillStyle='rgba(55,90,45,0.5)';ctx.beginPath();ctx.ellipse(tx,ty-S*sc*2,S*sc,S*sc*1.2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(80,50,30,0.6)';roundRect(ctx,tx-S*sc*.1,ty-S*sc*1,S*sc*.2,S*sc,4).fill()});}
  
  for(const prop of props){
    ctx.save();
    if(prop==='coffee'||prop==='drink'){const px=cx+S*1.2,py=GY-S*.5;ctx.fillStyle='#FFF';ctx.beginPath();ctx.moveTo(px-S*.15,py);ctx.lineTo(px+S*.15,py);ctx.lineTo(px+S*.1,py+S*.32);ctx.lineTo(px-S*.1,py+S*.32);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#8E5A2F';ctx.beginPath();ctx.ellipse(px,py+S*.04,S*.11,S*.06,0,0,Math.PI*2);ctx.fill();}
    else if(prop==='book'){const bx=cx+S*1.05,by=GY-S*.5;ctx.save();ctx.translate(bx,by);ctx.rotate(-.15);ctx.fillStyle='#F5E8C0';roundRect(ctx,-S*.2,-S*.3,S*.4,S*.6,3).fill();ctx.stroke();ctx.fillStyle='#CC8844';ctx.fillRect(-S*.2,-S*.3,S*.05,S*.6);ctx.restore();}
    else if(prop==='food'){const fx=cx+S*1.2,fy=GY-S*.1;ctx.fillStyle='#FFFAF0';ctx.beginPath();ctx.ellipse(fx,fy,S*.4,S*.15,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#F4A261';ctx.beginPath();ctx.arc(fx,fy-S*.05,S*.25,Math.PI,0);ctx.fill();}
    else if(prop==='music'){ctx.save();ctx.fillStyle=ol;ctx.font=`${S*.45}px serif`;ctx.fillText('♪',cx+S*1.2,GY-S*2.2+Math.sin(t*3)*S*.1);ctx.globalAlpha=.6;ctx.fillText('♫',cx+S*1.6,GY-S*1.8+Math.sin(t*3+1.2)*S*.1);ctx.restore();}
    ctx.restore();
  }
  ctx.restore();
}

function getJoints(action,emotion,t,S,intensity){
    const b = { head: { x: 0, y: -S * 2.2 }, neck: { x: 0, y: -S * 1.8 }, elbL: { x: -S * .9, y: -S * 1.1 }, elbR: { x: S * .9, y: -S * 1.1 }, hanL: { x: -S * .9, y: -S * .4 }, hanR: { x: S * .9, y: -S * .4 }, hip: { x: 0, y: -S * 0.5 }, knL: { x: -S * .3, y: S * .5 }, knR: { x: S * .3, y: S * .5 }, ftL: { x: -S * .4, y: S * 1.4 }, ftR: { x: S * .4, y: S * 1.4 } };

    if (action === 'walk' || action === 'run') {
        const spd = action === 'run' ? 6 : 3.5;
        const amt = action === 'run' ? 0.7 : 0.5;
        const sw = Math.sin(t * spd) * S * amt;
        const yOff = Math.abs(Math.sin(t * spd)) * -S * 0.1;
        return { ...b, hip: {x:0, y:b.hip.y + yOff}, elbL: { x: b.elbL.x + sw * 0.5, y: b.elbL.y }, elbR: { x: b.elbR.x - sw * 0.5, y: b.elbR.y }, hanL: { x: b.hanL.x + sw, y: b.hanL.y }, hanR: { x: b.hanR.x - sw, y: b.hanR.y }, knL: { x: b.knL.x - sw, y: b.knL.y }, knR: { x: b.knR.x + sw, y: b.knR.y }, ftL: { x: b.ftL.x - sw, y: b.ftL.y + yOff }, ftR: { x: b.ftR.x + sw, y: b.ftR.y + yOff } };
    }
    if(action==='cry'){const sob=Math.sin(t*8)*S*0.05;return{...b,head:{x:b.head.x+sob,y:b.head.y+S*.3},hanL:{x:-S*.2,y:-S*1.8+sob},hanR:{x:S*.2,y:-S*1.8+sob}}};
    if(action==='laugh'){const lol=Math.abs(Math.sin(t*8))*S*0.1;return{...b,head:{x:0,y:b.head.y-lol},hip:{x:0,y:b.hip.y-lol*.5}}};
    if(action==='wave'){const wv=Math.sin(t*5)*S*0.3;return{...b,elbR:{x:S*.5,y:-S*2},hanR:{x:S*.5+wv,y:-S*2.5}}};
    if(action==='drink'){const dl=Math.sin(t*2)*S*.05;return{...b,head:{x:b.head.x-S*.2,y:b.head.y+S*.1+dl},elbR:{x:S*.4,y:-S*1.5},hanR:{x:S*.1,y:-S*1.9+dl}}};

    return b;
}
