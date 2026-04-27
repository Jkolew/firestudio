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
    ctx.strokeStyle = ol; ctx.lineWidth = S*0.065;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const px = cx + S*1.5, py = GY - S*0.55;

    if (prop === 'coffee' || prop === 'drink') {
      // Cup body
      ctx.fillStyle = '#FFF9F0';
      ctx.beginPath();
      ctx.moveTo(px-S*.18, py-S*.38); ctx.lineTo(px+S*.18, py-S*.38);
      ctx.lineTo(px+S*.13, py+S*.05); ctx.lineTo(px-S*.13, py+S*.05);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // Saucer
      ctx.fillStyle = '#EDE0C8';
      ctx.beginPath(); ctx.ellipse(px, py+S*.05, S*.18, S*.06, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Handle
      ctx.strokeStyle = ol; ctx.lineWidth = S*0.055;
      ctx.beginPath();
      ctx.arc(px+S*.18, py-S*.16, S*.09, -Math.PI*0.4, Math.PI*0.4);
      ctx.stroke();
      // Steam
      ctx.strokeStyle = 'rgba(130,80,50,0.4)'; ctx.lineWidth = S*0.038;
      for (let i=0; i<3; i++) {
        const sx = px - S*0.08 + i*S*0.09;
        ctx.beginPath(); ctx.moveTo(sx, py-S*.43);
        ctx.quadraticCurveTo(sx+S*.05, py-S*.57, sx, py-S*.67); ctx.stroke();
      }
    } else if (prop === 'book') {
      ctx.save(); ctx.translate(px, py); ctx.rotate(-0.1);
      ctx.fillStyle = '#F5E6C8';
      roundRect(ctx, -S*.22, -S*.3, S*.44, S*.62, 4).fill(); ctx.stroke();
      ctx.fillStyle = '#B8722A'; ctx.fillRect(-S*.22, -S*.3, S*.07, S*.62);
      // Spine highlight
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(-S*.22, -S*.3, S*.03, S*.62);
      // Lines
      ctx.strokeStyle='rgba(140,90,50,0.3)'; ctx.lineWidth=S*.03;
      for (let i=1;i<5;i++){
        ctx.beginPath();
        ctx.moveTo(-S*.12,-S*.3+i*S*.11); ctx.lineTo(S*.22,-S*.3+i*S*.11); ctx.stroke();
      }
      ctx.restore();
    } else if (prop === 'music') {
      // Floating notes (procedural, no font dependency)
      const notes = [
        { x: cx+S*1.25, y: GY-S*1.9, phase: 0,   scale: 1.0 },
        { x: cx+S*1.75, y: GY-S*1.6, phase: 1.2,  scale: 0.75 },
        { x: cx+S*2.1,  y: GY-S*2.1, phase: 2.1,  scale: 0.6 },
      ];
      notes.forEach(({ x, y, phase, scale }) => {
        const dy = Math.sin(t*3 + phase) * S*0.13;
        const ns = S * scale;
        ctx.save();
        ctx.translate(x, y + dy);
        ctx.fillStyle = `rgba(58,48,96,${0.85 * scale})`;
        ctx.strokeStyle = `rgba(58,48,96,${0.85 * scale})`;
        ctx.lineWidth = ns * 0.07;
        // Note head (filled oval)
        ctx.beginPath();
        ctx.save(); ctx.rotate(-0.4);
        ctx.ellipse(0, ns*0.38, ns*0.13, ns*0.1, 0, 0, Math.PI*2);
        ctx.restore();
        ctx.fill();
        // Stem
        ctx.beginPath(); ctx.moveTo(ns*0.13, ns*0.36); ctx.lineTo(ns*0.13, -ns*0.1); ctx.stroke();
        // Flag
        ctx.beginPath();
        ctx.moveTo(ns*0.13, -ns*0.1);
        ctx.quadraticCurveTo(ns*0.4, -ns*0.05, ns*0.32, ns*0.12);
        ctx.stroke();
        ctx.restore();
      });
    } else if (prop === 'food') {
      // Plate
      ctx.fillStyle = '#FFF';
      ctx.beginPath(); ctx.ellipse(px, py, S*.38, S*.14, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Plate rim shadow
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.beginPath(); ctx.ellipse(px, py, S*.33, S*.10, 0, 0, Math.PI*2); ctx.fill();
      // Food (rice mound)
      ctx.fillStyle = '#F4A261';
      ctx.beginPath(); ctx.arc(px, py-S*.07, S*.24, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = ol; ctx.lineWidth = S*0.05;
      ctx.beginPath(); ctx.arc(px, py-S*.07, S*.24, Math.PI, 0); ctx.stroke();
      // Garnish dot
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath(); ctx.arc(px, py-S*.29, S*.05, 0, Math.PI*2); ctx.fill();
    } else if (prop === 'phone') {
      ctx.fillStyle = '#2A2A3A';
      roundRect(ctx, px-S*.12, py-S*.42, S*.24, S*.42, S*.05).fill(); ctx.stroke();
      // Screen
      ctx.fillStyle = '#6ABAFF';
      roundRect(ctx, px-S*.09, py-S*.39, S*.18, S*.32, S*.03).fill();
      // Home button
      ctx.fillStyle = '#444';
      ctx.beginPath(); ctx.arc(px, py-S*.02, S*.03, 0, Math.PI*2); ctx.fill();
      // Camera dot
      ctx.fillStyle = '#555';
      ctx.beginPath(); ctx.arc(px, py-S*.41, S*.02, 0, Math.PI*2); ctx.fill();
    } else if (prop === 'snowball') {
      // Snowball
      ctx.fillStyle = '#EEF6FF';
      ctx.beginPath(); ctx.arc(px, py-S*.22, S*.28, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Snow texture dots
      ctx.fillStyle = 'rgba(160,210,255,0.5)';
      [[0,0],[S*.1,-S*.08],[-S*.09,S*.08],[S*.06,S*.14],[-S*.13,-S*.04]].forEach(([dx,dy])=>{
        ctx.beginPath(); ctx.arc(px+dx, py-S*.22+dy, S*.04, 0, Math.PI*2); ctx.fill();
      });
      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath(); ctx.ellipse(px, py+S*.06, S*.22, S*.07, 0, 0, Math.PI*2); ctx.fill();
    } else if (prop === 'ball') {
      // Ball (soccer style)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(px, py-S*.22, S*.28, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      // Pentagon patches
      ctx.fillStyle = '#1A1208';
      ctx.beginPath(); ctx.arc(px, py-S*.22, S*.09, 0, Math.PI*2); ctx.fill();
      for (let i=0; i<5; i++) {
        const a = i * Math.PI*2/5 - Math.PI/2;
        ctx.beginPath();
        ctx.arc(px+Math.cos(a)*S*.18, py-S*.22+Math.sin(a)*S*.18, S*.06, 0, Math.PI*2);
        ctx.fill();
      }
      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath(); ctx.ellipse(px, py+S*.06, S*.22, S*.07, 0, 0, Math.PI*2); ctx.fill();
    } else if (prop === 'bag') {
      // Bag body
      ctx.fillStyle = '#F5DEB3';
      roundRect(ctx, px-S*.18, py-S*.38, S*.36, S*.48, S*.06).fill(); ctx.stroke();
      // Handle
      ctx.strokeStyle = ol; ctx.lineWidth = S*0.065;
      ctx.beginPath();
      ctx.moveTo(px-S*.09, py-S*.38);
      ctx.quadraticCurveTo(px-S*.09, py-S*.58, px, py-S*.58);
      ctx.quadraticCurveTo(px+S*.09, py-S*.58, px+S*.09, py-S*.38);
      ctx.stroke();
      // Logo stripe
      ctx.strokeStyle = 'rgba(180,120,60,0.5)'; ctx.lineWidth = S*0.04;
      ctx.beginPath();
      ctx.moveTo(px-S*.18, py-S*.15); ctx.lineTo(px+S*.18, py-S*.15);
      ctx.stroke();
    } else if (prop === 'money') {
      // Bill (slightly tilted)
      ctx.save(); ctx.translate(px, py-S*.2); ctx.rotate(-0.12);
      ctx.fillStyle = '#85BB65';
      roundRect(ctx, -S*.26, -S*.14, S*.52, S*.28, S*.04).fill(); ctx.stroke();
      // Inner border
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = S*0.03;
      roundRect(ctx, -S*.21, -S*.09, S*.42, S*.18, S*.03).stroke();
      // Center circle
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(0, 0, S*.07, 0, Math.PI*2); ctx.fill();
      ctx.restore();
      // Coin on top
      ctx.fillStyle = '#FFD700';
      ctx.beginPath(); ctx.arc(px+S*.18, py-S*.36, S*.1, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#DAA520';
      ctx.font = `bold ${S*.12}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('₩', px+S*.18, py-S*.36);
    } else if (prop === 'umbrella') {
      const ux = px, uy = GY - S*1.8;
      // Canopy
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath();
      ctx.arc(ux, uy, S*0.42, Math.PI, 0);
      ctx.fill(); ctx.stroke();
      // Scallop edge
      ctx.fillStyle = '#C0392B';
      for (let i=0; i<=4; i++) {
        const ex = ux - S*0.42 + i*(S*0.84/4);
        ctx.beginPath(); ctx.arc(ex + S*0.105, uy, S*0.105, 0, Math.PI); ctx.fill();
      }
      // Spokes
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = S*0.04;
      for (let i=0; i<=4; i++) {
        const a = Math.PI + i*Math.PI/4;
        ctx.beginPath(); ctx.moveTo(ux, uy);
        ctx.lineTo(ux+Math.cos(a)*S*0.42, uy+Math.sin(a)*S*0.42); ctx.stroke();
      }
      // Handle
      ctx.strokeStyle = ol; ctx.lineWidth = S*0.075;
      ctx.beginPath();
      ctx.moveTo(ux, uy); ctx.lineTo(ux, uy+S*0.7);
      ctx.quadraticCurveTo(ux, uy+S*0.92, ux-S*0.13, uy+S*0.92);
      ctx.stroke();
    } else if (prop === 'game') {
      // Controller body
      ctx.fillStyle = '#2C2C54';
      roundRect(ctx, px-S*.24, py-S*.36, S*.48, S*.3, S*.08).fill(); ctx.stroke();
      // Grips (rounded bottom corners)
      ctx.fillStyle = '#2C2C54';
      roundRect(ctx, px-S*.22, py-S*.1, S*.14, S*.16, S*.06).fill(); ctx.stroke();
      roundRect(ctx, px+S*.08, py-S*.1, S*.14, S*.16, S*.06).fill(); ctx.stroke();
      // D-pad
      ctx.fillStyle = '#555';
      ctx.fillRect(px-S*.19, py-S*.27, S*.06, S*.18);
      ctx.fillRect(px-S*.22, py-S*.21, S*.12, S*.06);
      // Buttons
      const btns = [['#E74C3C', S*.1, -S*.26], ['#27AE60', S*.18, -S*.19], ['#3498DB', S*.1, -S*.12], ['#F1C40F', S*.02, -S*.19]];
      btns.forEach(([c, bx, by]) => {
        ctx.fillStyle = c; ctx.strokeStyle = ol; ctx.lineWidth = S*.04;
        ctx.beginPath(); ctx.arc(px+bx, py+by, S*.05, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      });
      // Center buttons
      ctx.fillStyle = '#888';
      ctx.beginPath(); ctx.arc(px-S*.03, py-S*.2, S*.04, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(px+S*.03, py-S*.2, S*.04, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
}
