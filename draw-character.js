// ═══════════════════════════════════════════════════════
//  DIARY CHARACTER ENGINE  (V2.0 - Fresh Start)
// ═══════════════════════════════════════════════════════

const CHAR_PALETTES = [
  { skin:'#FFDAB9', hair:'#1A1208', shirt:'#FF6B6B', pants:'#4A8FD9', shoe:'#D4702A' },
  { skin:'#FFDAB9', hair:'#6B3A1F', shirt:'#5BAAE0', pants:'#2C3E60', shoe:'#9660C8' },
  { skin:'#FFDAB9', hair:'#C8A020', shirt:'#50C878', pants:'#B03028', shoe:'#20A090' },
];

function roundRect(ctx, x, y, w, h, r) {
  if (w < 2*r) r = w/2;
  if (h < 2*r) r = h/2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  return ctx;
}

function drawCharacter(ctx, cx, cy, S, action, emotion, t, facing, _s, _st, charIdx=0, intensity=0.5) {
  const p   = CHAR_PALETTES[charIdx % CHAR_PALETTES.length];
  const ol  = '#1A1208';

  ctx.save();
  ctx.translate(cx, cy);
  if (facing < 0) ctx.scale(-1, 1);

  const legH    = S * 1.2;
  const bodyH   = S * 0.9;
  const bodyW   = S * 0.84;
  const headR   = S * 0.72;
  const bTopY   = -(legH + bodyH);   // body top y
  const headCY  = bTopY - headR;     // head centre y

  const bounce  = Math.sin(t * 2.8) * S * 0.03;

  // Default joint positions
  let lLfx = -S*0.26, lLfy = 0;
  let lRfx =  S*0.26, lRfy = 0;
  let aLhx = -S*0.65, aLhy = bTopY + S*1.05;
  let aRhx =  S*0.65, aRhy = bTopY + S*1.05;
  let hx   = 0,       hy   = headCY;

  // Action overrides
  if (action === 'walk' || action === 'run') {
    const spd = action === 'run' ? 5.5 : 3.5;
    const amt = action === 'run' ? 0.50 : 0.36;
    const sw  = Math.sin(t * spd) * S * amt;
    lLfx -= sw; lRfx += sw;
    if (sw < 0) lLfy = S * 0.22; else lRfy = S * 0.22;
    aLhx += sw * 0.4; aRhx -= sw * 0.4;
  } else if (action === 'wave') {
    aRhx = S*0.28 + Math.sin(t*5)*S*0.15;
    aRhy = bTopY - S*0.3;
  } else if (action === 'cry') {
    aLhx = -S*0.1; aLhy = bTopY + S*0.2;
    aRhx =  S*0.1; aRhy = bTopY + S*0.2;
    hy  += S*0.1 + Math.sin(t*7)*S*0.025;
  } else if (action === 'laugh' || action === 'dance') {
    const la = Math.sin(t * 4) * S * 0.2;
    aLhx = -S*0.65; aLhy = bTopY - S*0.05 + la;
    aRhx =  S*0.65; aRhy = bTopY - S*0.05 - la;
    hy  -= Math.abs(la) * 0.05;
  } else if (action === 'drink' || action === 'eat') {
    aRhx = S*0.10; aRhy = bTopY + S*0.05;
  } else if (action === 'sleep') {
    hy += S*0.12;
    hx += S*0.08;
  }

  // Ground shadow (not affected by bounce)
  ctx.save();
  ctx.globalAlpha = 0.07; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(0, 0, S*0.5, S*0.09, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // Legs (feet stay on ground; compensate for bounce)
  const hipY = -legH;
  drawLeg(ctx, -bodyW*0.28, hipY + bounce, lLfx, lLfy - bounce, S, p, ol);
  drawLeg(ctx,  bodyW*0.28, hipY + bounce, lRfx, lRfy - bounce, S, p, ol);

  // Upper body translated by bounce
  ctx.translate(0, bounce);

  // Body
  ctx.save();
  ctx.strokeStyle = ol; ctx.lineWidth = S*0.07; ctx.lineJoin = 'round';
  ctx.fillStyle = p.shirt;
  roundRect(ctx, -bodyW/2, bTopY, bodyW, bodyH, S*0.14).fill();
  ctx.stroke();
  ctx.restore();

  // Arms
  drawArm(ctx, -bodyW/2, bTopY + S*0.18, aLhx, aLhy, S, p, ol);
  drawArm(ctx,  bodyW/2, bTopY + S*0.18, aRhx, aRhy, S, p, ol);

  // Head
  drawHead(ctx, hx, hy, headR, S, p, ol, emotion, action, t);

  ctx.restore();
}

// ── LEGS ──
function drawLeg(ctx, hipX, hipY, footX, footY, S, p, ol) {
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  ctx.strokeStyle = p.pants; ctx.lineWidth = S * 0.26;
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.quadraticCurveTo(
    hipX + (footX - hipX) * 0.35,
    hipY + (footY - hipY) * 0.65,
    footX, footY - S * 0.09
  );
  ctx.stroke();

  ctx.strokeStyle = ol; ctx.lineWidth = S * 0.26; ctx.globalAlpha = 0.14;
  ctx.stroke(); ctx.globalAlpha = 1;

  ctx.fillStyle = p.shoe; ctx.strokeStyle = ol; ctx.lineWidth = S * 0.065;
  ctx.beginPath();
  ctx.ellipse(footX, footY, S*0.22, S*0.10, 0, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

// ── ARMS ──
function drawArm(ctx, sx, sy, hx, hy, S, p, ol) {
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  ctx.strokeStyle = p.shirt; ctx.lineWidth = S * 0.22;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.quadraticCurveTo((sx + hx) * 0.58, sy + (hy - sy) * 0.55, hx, hy);
  ctx.stroke();

  ctx.strokeStyle = ol; ctx.lineWidth = S * 0.22; ctx.globalAlpha = 0.14;
  ctx.stroke(); ctx.globalAlpha = 1;

  ctx.fillStyle = p.skin; ctx.strokeStyle = ol; ctx.lineWidth = S * 0.065;
  ctx.beginPath(); ctx.arc(hx, hy, S * 0.145, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// ── HEAD ──
function drawHead(ctx, hx, hy, r, S, p, ol, emotion, action, t) {
  ctx.save();
  ctx.strokeStyle = ol; ctx.lineWidth = S * 0.07; ctx.lineJoin = 'round';

  ctx.fillStyle = p.skin;
  ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  ctx.fillStyle = p.hair;
  ctx.beginPath();
  ctx.arc(hx, hy - r*0.22, r*1.01, Math.PI*0.95, Math.PI*0.05, false);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  drawFace(ctx, hx, hy, r, S, p, ol, emotion, action, t);
  ctx.restore();
}

// ── FACE ──
function drawFace(ctx, hx, hy, r, S, p, ol, emotion, action, t) {
  const isHappy    = ['happy','excited','love'].includes(emotion) || ['laugh','dance','wave'].includes(action);
  const isCrying   = ['sad','lonely'].includes(emotion) || action === 'cry';
  const isAngry    = emotion === 'angry';
  const isSleeping = action === 'sleep';

  const eyeLX = hx - r * 0.34;
  const eyeRX = hx + r * 0.34;
  const eyeY  = hy + r * 0.02;
  const eyeR  = r * 0.175;

  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  // Eyebrows
  ctx.strokeStyle = p.hair; ctx.lineWidth = S * 0.055;
  [[eyeLX, -1], [eyeRX, 1]].forEach(([ex, side]) => {
    ctx.save();
    ctx.translate(ex, eyeY - r*0.42);
    if (isAngry) ctx.rotate(side * -0.32);
    else if (isHappy) ctx.rotate(side * 0.14);
    ctx.beginPath();
    ctx.moveTo(-eyeR*0.85, 0); ctx.lineTo(eyeR*0.85, 0);
    ctx.stroke();
    ctx.restore();
  });

  // Eyes
  if (isSleeping || isHappy) {
    ctx.strokeStyle = ol; ctx.lineWidth = S * 0.055;
    [eyeLX, eyeRX].forEach(ex => {
      ctx.beginPath();
      ctx.arc(ex, eyeY + eyeR*0.18, eyeR*0.88, Math.PI*1.15, Math.PI*-0.15);
      ctx.stroke();
    });
  } else {
    ctx.fillStyle = '#FFF'; ctx.strokeStyle = ol; ctx.lineWidth = S*0.055;
    [eyeLX, eyeRX].forEach(ex => {
      ctx.beginPath(); ctx.arc(ex, eyeY, eyeR, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    });
    const pupilR = eyeR * 0.58;
    ctx.fillStyle = ol;
    [[eyeLX, isAngry ?  0.09 : 0],
     [eyeRX, isAngry ? -0.09 : 0]].forEach(([ex, off]) => {
      ctx.beginPath(); ctx.arc(ex + off*r, eyeY, pupilR, 0, Math.PI*2); ctx.fill();
    });
    ctx.fillStyle = '#FFF';
    [eyeLX, eyeRX].forEach(ex => {
      ctx.beginPath(); ctx.arc(ex + eyeR*0.18, eyeY - eyeR*0.22, pupilR*0.38, 0, Math.PI*2); ctx.fill();
    });
  }

  // Blush
  if (isHappy || emotion === 'love') {
    ctx.fillStyle = 'rgba(255,120,100,0.2)';
    [eyeLX - r*0.14, eyeRX + r*0.14].forEach(bx => {
      ctx.beginPath();
      ctx.ellipse(bx, eyeY + r*0.26, r*0.2, r*0.12, 0, 0, Math.PI*2);
      ctx.fill();
    });
  }

  // Mouth
  ctx.strokeStyle = ol; ctx.lineWidth = S*0.045;
  ctx.beginPath();
  if (isCrying) {
    ctx.arc(hx, hy + r*0.65, r*0.22, Math.PI+0.25, -0.25);
  } else if (isHappy) {
    ctx.arc(hx, hy + r*0.33, r*0.28, 0.22, Math.PI-0.22);
  } else if (isAngry) {
    ctx.moveTo(hx - r*0.28, hy + r*0.60); ctx.lineTo(hx + r*0.28, hy + r*0.50);
  } else {
    ctx.arc(hx, hy + r*0.5, r*0.16, 0.2, Math.PI-0.2);
  }
  ctx.stroke();

  // Tears
  if (isCrying) {
    const tp = (t * 1.5) % 1;
    ctx.fillStyle = 'rgba(110,180,255,0.75)';
    [eyeLX, eyeRX].forEach(ex => {
      ctx.beginPath();
      ctx.arc(ex, eyeY + eyeR + S*0.04 + tp*S*0.38, S*0.055, 0, Math.PI*2);
      ctx.fill();
    });
  }

  ctx.restore();
}

// ── PROPS ──
function drawProps(ctx, W, H, GY, S, props, chars, artStyle, t, location) {
  if (!chars.length) return;
  const cx = chars[0].x;
  const ol = '#1A1208';

  ctx.save();
  ctx.strokeStyle = ol; ctx.lineWidth = S*0.065;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  for (const prop of props) {
    ctx.save();
    const px = cx + S*1.5, py = GY - S*0.55;

    if (prop === 'coffee' || prop === 'drink') {
      ctx.fillStyle = '#FFF9F0';
      ctx.beginPath();
      ctx.moveTo(px-S*.18, py-S*.38); ctx.lineTo(px+S*.18, py-S*.38);
      ctx.lineTo(px+S*.13, py+S*.05); ctx.lineTo(px-S*.13, py+S*.05);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(130,80,50,0.4)'; ctx.lineWidth = S*0.038;
      for (let i=0; i<3; i++) {
        const sx = px - S*0.1 + i*S*0.1;
        ctx.beginPath(); ctx.moveTo(sx, py-S*.43);
        ctx.quadraticCurveTo(sx+S*.04, py-S*.57, sx, py-S*.67); ctx.stroke();
      }
    } else if (prop === 'book') {
      ctx.save(); ctx.translate(px, py); ctx.rotate(-0.1);
      ctx.fillStyle = '#F5E6C8';
      roundRect(ctx, -S*.22, -S*.3, S*.44, S*.62, 4).fill(); ctx.stroke();
      ctx.fillStyle = '#B8722A'; ctx.fillRect(-S*.22, -S*.3, S*.07, S*.62);
      ctx.strokeStyle='rgba(140,90,50,0.3)'; ctx.lineWidth=S*.03;
      for (let i=1;i<5;i++){
        ctx.beginPath();
        ctx.moveTo(-S*.12,-S*.3+i*S*.11); ctx.lineTo(S*.22,-S*.3+i*S*.11); ctx.stroke();
      }
      ctx.restore();
    } else if (prop === 'music') {
      ctx.fillStyle = '#3A3060'; ctx.font = `${S*.42}px serif`;
      ctx.fillText('♪', cx+S*1.3, GY-S*1.9+Math.sin(t*3)*S*.15);
      ctx.globalAlpha=.6; ctx.font=`${S*.3}px serif`;
      ctx.fillText('♫', cx+S*1.78, GY-S*1.5+Math.sin(t*3+1)*S*.12);
      ctx.globalAlpha=1;
    } else if (prop === 'food') {
      ctx.fillStyle = '#FFF';
      ctx.beginPath(); ctx.ellipse(px, py, S*.36, S*.13, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#F4A261';
      ctx.beginPath(); ctx.arc(px, py-S*.06, S*.24, Math.PI, 0); ctx.fill();
    } else if (prop === 'phone') {
      ctx.fillStyle = '#2A2A3A';
      roundRect(ctx, px-S*.12, py-S*.42, S*.24, S*.4, S*.04).fill(); ctx.stroke();
      ctx.fillStyle = '#6ABAFF';
      roundRect(ctx, px-S*.09, py-S*.39, S*.18, S*.3, S*.03).fill();
    }
    ctx.restore();
  }
  ctx.restore();
}
