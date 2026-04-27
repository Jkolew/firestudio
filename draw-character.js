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

// ═══════════════════════════════════════════════════════
//  SCENE BACKGROUNDS  (notebook sketch aesthetic)
// ═══════════════════════════════════════════════════════

function drawLocationBackground(ctx, W, H, GY, S, location, t) {
  if (!location) return;
  ctx.save();
  const fns = {
    cafe: drawCafeBg, home: drawHomeBg, school: drawSchoolBg,
    outside: drawOutsideBg, sea: drawSeaBg, mountain: drawMountainBg,
    pcroom: drawPcRoomBg, store: drawStoreBg, office: drawOfficeBg, snow: drawSnowBg
  };
  if (fns[location]) fns[location](ctx, W, H, GY, S, t);
  ctx.restore();
}

function drawCafeBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(75,50,30,0.52)';
  ctx.fillStyle = 'rgba(248,238,218,0.62)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  ctx.fillStyle = 'rgba(178,218,248,0.42)'; ctx.fillRect(W*0.57, H*0.17, W*0.32, H*0.33);
  ctx.strokeStyle = ol; ctx.lineWidth = 3; ctx.strokeRect(W*0.57, H*0.17, W*0.32, H*0.33);
  ctx.beginPath();
  ctx.moveTo(W*0.73, H*0.17); ctx.lineTo(W*0.73, H*0.50);
  ctx.moveTo(W*0.57, H*0.335); ctx.lineTo(W*0.89, H*0.335);
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(215,175,185,0.42)';
  ctx.fillRect(W*0.57, H*0.17, W*0.04, H*0.33);
  ctx.fillRect(W*0.85, H*0.17, W*0.04, H*0.33);
  ctx.fillStyle = 'rgba(195,158,115,0.72)';
  roundRect(ctx, W*0.04, GY-S*1.1, W*0.30, S*0.72, 5).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(215,178,135,0.6)'; ctx.fillRect(W*0.04, GY-S*1.1, W*0.30, S*0.10);
  ctx.fillStyle = 'rgba(182,145,105,0.78)';
  ctx.beginPath(); ctx.ellipse(W*0.67, GY-S*0.25, S*0.88, S*0.20, 0, 0, Math.PI*2);
  ctx.fill(); ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = 'rgba(148,108,72,0.68)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(W*0.67, GY-S*0.18); ctx.lineTo(W*0.67, GY); ctx.stroke();
  ctx.fillStyle = 'rgba(88,152,72,0.72)';
  ctx.beginPath(); ctx.arc(W*0.27, GY-S*1.22, S*0.20, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = 'rgba(128,88,52,0.70)'; ctx.fillRect(W*0.265, GY-S*1.02, S*0.12, S*0.17);
  ctx.fillStyle = 'rgba(48,40,30,0.72)';
  roundRect(ctx, W*0.06, H*0.18, W*0.18, H*0.17, 4).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.textAlign = 'center';
  ctx.font = `bold ${S*0.18}px 'Noto Serif KR',serif`;
  ctx.fillText('MENU', W*0.15, H*0.235);
  ctx.font = `${S*0.15}px sans-serif`;
  ['☕ 4,500','🍵 4,000','🧃 3,500'].forEach((l,i) => ctx.fillText(l, W*0.15, H*0.278+i*H*0.044));
}

function drawHomeBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(75,50,30,0.50)';
  ctx.fillStyle = 'rgba(242,238,228,0.62)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  ctx.fillStyle = 'rgba(188,178,162,0.22)';
  for (let i=0; i<30; i++) {
    ctx.beginPath(); ctx.arc(W*0.05+((i*71)%(W*0.9)), H*0.16+((i*49)%(H*0.58)), 3.5, 0, Math.PI*2); ctx.fill();
  }
  ctx.fillStyle = 'rgba(178,218,248,0.45)'; ctx.fillRect(W*0.56, H*0.17, W*0.31, H*0.30);
  ctx.strokeStyle = ol; ctx.lineWidth = 3; ctx.strokeRect(W*0.56, H*0.17, W*0.31, H*0.30);
  ctx.beginPath(); ctx.moveTo(W*0.715, H*0.17); ctx.lineTo(W*0.715, H*0.47);
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(208,172,198,0.48)';
  ctx.beginPath(); ctx.moveTo(W*0.56, H*0.17);
  ctx.quadraticCurveTo(W*0.595, H*0.31, W*0.56, H*0.47);
  ctx.lineTo(W*0.54, H*0.17); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W*0.87, H*0.17);
  ctx.quadraticCurveTo(W*0.835, H*0.31, W*0.87, H*0.47);
  ctx.lineTo(W*0.89, H*0.17); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(162,122,158,0.50)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(W*0.52, H*0.162); ctx.lineTo(W*0.91, H*0.162); ctx.stroke();
  ctx.fillStyle = 'rgba(172,155,198,0.70)';
  roundRect(ctx, W*0.04, GY-S*0.92, W*0.44, S*0.64, S*0.09).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(195,182,212,0.78)';
  roundRect(ctx, W*0.07, GY-S*0.89, W*0.18, S*0.38, S*0.05).fill(); ctx.stroke();
  roundRect(ctx, W*0.27, GY-S*0.89, W*0.18, S*0.38, S*0.05).fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(155,138,182,0.75)';
  roundRect(ctx, W*0.035, GY-S*0.86, W*0.04, S*0.52, S*0.04).fill(); ctx.stroke();
  roundRect(ctx, W*0.48, GY-S*0.86, W*0.04, S*0.52, S*0.04).fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(148,118,78,0.62)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(W*0.88, GY); ctx.lineTo(W*0.88, GY-S*1.82); ctx.stroke();
  ctx.fillStyle = 'rgba(242,208,138,0.68)';
  ctx.beginPath(); ctx.moveTo(W*0.82, GY-S*1.88); ctx.lineTo(W*0.94, GY-S*1.88);
  ctx.lineTo(W*0.92, GY-S*1.55); ctx.lineTo(W*0.84, GY-S*1.55); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  const lg = ctx.createRadialGradient(W*0.88, GY-S*1.70, 0, W*0.88, GY-S*1.70, S*0.58);
  lg.addColorStop(0, 'rgba(255,238,168,0.18)'); lg.addColorStop(1, 'rgba(255,238,168,0)');
  ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(W*0.88, GY-S*1.70, S*0.58, 0, Math.PI*2); ctx.fill();
}

function drawSchoolBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(75,50,30,0.50)';
  ctx.fillStyle = 'rgba(238,235,228,0.62)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  ctx.fillStyle = 'rgba(52,88,62,0.72)';
  roundRect(ctx, W*0.10, H*0.16, W*0.78, H*0.33, 5).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = 'rgba(175,155,135,0.62)'; ctx.fillRect(W*0.10, H*0.49, W*0.78, H*0.025);
  ctx.fillStyle = 'rgba(228,222,210,0.72)'; ctx.textAlign = 'center';
  ctx.font = `bold ${S*0.22}px 'Noto Serif KR',serif`;
  ctx.fillText('오늘의 수업', W*0.5, H*0.24);
  ctx.font = `${S*0.20}px sans-serif`;
  ctx.fillText('y = ax + b', W*0.5, H*0.32);
  ctx.fillStyle = 'rgba(255,255,180,0.60)'; ctx.font = `${S*0.18}px sans-serif`;
  ctx.fillText('★  열심히  ★', W*0.5, H*0.40);
  ctx.fillStyle = 'rgba(215,215,200,0.28)'; ctx.fillRect(W*0.10, H*0.46, W*0.78, H*0.032);
  ctx.fillStyle = 'rgba(198,172,138,0.62)';
  [W*0.10, W*0.36, W*0.62].forEach(dx => {
    roundRect(ctx, dx, GY-S*0.40, W*0.22, S*0.23, 3).fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 1.8; ctx.stroke();
    ctx.strokeStyle = 'rgba(148,112,78,0.50)'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(dx+W*0.06, GY-S*0.17); ctx.lineTo(dx+W*0.06, GY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx+W*0.16, GY-S*0.17); ctx.lineTo(dx+W*0.16, GY); ctx.stroke();
  });
}

function drawOutsideBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(65,45,28,0.42)';
  ctx.fillStyle = 'rgba(185,220,252,0.52)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  const cl = W*0.25 + Math.sin(t*0.12)*W*0.05;
  ctx.fillStyle = 'rgba(255,255,255,0.78)';
  [[0,0,S*0.23],[S*0.22,-S*0.05,S*0.17],[-S*0.22,-S*0.05,S*0.15],[S*0.40,S*0.04,S*0.14],[-S*0.40,S*0.04,S*0.13]]
    .forEach(([dx,dy,r])=>{ ctx.beginPath(); ctx.arc(cl+dx, H*0.22+dy, r, 0, Math.PI*2); ctx.fill(); });
  ctx.fillStyle = 'rgba(255,255,255,0.58)';
  const cl2 = W*0.68 + Math.sin(t*0.09+1.2)*W*0.04;
  [[0,0,S*0.17],[S*0.16,-S*0.04,S*0.13],[-S*0.16,-S*0.04,S*0.12]]
    .forEach(([dx,dy,r])=>{ ctx.beginPath(); ctx.arc(cl2+dx, H*0.19+dy, r, 0, Math.PI*2); ctx.fill(); });
  [[W*0.78,GY-S*1.22,'rgba(82,148,70,0.72)'],[W*0.89,GY-S*0.98,'rgba(65,128,56,0.68)']].forEach(([tx,ty,c]) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(tx, ty, S*0.38, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = 'rgba(108,78,48,0.62)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(tx, ty+S*0.35); ctx.lineTo(tx, GY); ctx.stroke();
  });
  ctx.fillStyle = 'rgba(92,152,78,0.68)'; ctx.beginPath(); ctx.arc(W*0.09, GY-S*1.02, S*0.32, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.strokeStyle = 'rgba(108,78,48,0.62)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(W*0.09, GY-S*0.72); ctx.lineTo(W*0.09, GY); ctx.stroke();
  ctx.fillStyle = 'rgba(198,178,148,0.52)';
  ctx.beginPath(); ctx.moveTo(W*0.36,GY); ctx.lineTo(W*0.64,GY);
  ctx.lineTo(W*0.57,GY-S*0.65); ctx.lineTo(W*0.43,GY-S*0.65); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(118,178,88,0.42)'; ctx.fillRect(0, GY, W, H-GY);
}

function drawSeaBg(ctx, W, H, GY, S, t) {
  const seaY = GY * 0.52;
  ctx.fillStyle = 'rgba(168,215,252,0.55)'; ctx.fillRect(0, H*0.12, W, seaY - H*0.12);
  ctx.fillStyle = 'rgba(255,232,98,0.68)';
  ctx.beginPath(); ctx.arc(W*0.78, H*0.22, S*0.30, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(255,218,80,0.25)';
  ctx.beginPath(); ctx.arc(W*0.78, H*0.22, S*0.48, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,245,180,0.35)'; ctx.lineWidth = 1.5;
  for (let i=0; i<6; i++) {
    const sx = W*0.55 + i*W*0.07 + Math.sin(t*2+i)*S*0.15;
    ctx.beginPath(); ctx.moveTo(sx, seaY+S*0.05); ctx.lineTo(sx+S*0.12, seaY+S*0.05); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(78,158,212,0.52)'; ctx.fillRect(0, seaY, W, GY - seaY);
  ctx.strokeStyle = 'rgba(118,188,232,0.58)'; ctx.lineWidth = 2.5;
  for (let i=0; i<4; i++) {
    const wy = seaY + S*0.15 + i*S*0.23 + Math.sin(t*1.5+i*0.9)*S*0.06;
    ctx.beginPath(); ctx.moveTo(0, wy);
    for (let x=0; x<W; x+=22) ctx.quadraticCurveTo(x+11, wy+Math.sin(x/42+t*1.2+i)*9, x+22, wy);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(238,212,162,0.65)'; ctx.fillRect(0, GY-S*0.18, W, S*0.18);
  ctx.strokeStyle = 'rgba(255,255,255,0.52)'; ctx.lineWidth = 2.5;
  const sy = GY - S*0.09 + Math.sin(t*2.2)*S*0.07;
  ctx.beginPath(); ctx.moveTo(W*0.08, sy);
  for (let x=W*0.08; x<W*0.92; x+=32) ctx.quadraticCurveTo(x+16, sy+Math.sin(x/52+t)*6, x+32, sy);
  ctx.stroke();
}

function drawMountainBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(48,38,58,0.38)';
  ctx.fillStyle = 'rgba(178,200,238,0.55)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  ctx.fillStyle = 'rgba(152,162,198,0.42)';
  ctx.beginPath(); ctx.moveTo(-W*0.05, GY*0.72);
  ctx.lineTo(W*0.20, H*0.25); ctx.lineTo(W*0.45, GY*0.58);
  ctx.lineTo(W*0.65, H*0.21); ctx.lineTo(W*0.85, GY*0.52); ctx.lineTo(W*1.05, GY*0.72);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(102,128,98,0.60)';
  ctx.beginPath(); ctx.moveTo(-W*0.05, GY);
  ctx.lineTo(W*0.15, GY*0.56); ctx.lineTo(W*0.35, GY*0.72);
  ctx.lineTo(W*0.55, GY*0.42); ctx.lineTo(W*0.75, GY*0.66); ctx.lineTo(W*0.95, GY*0.48);
  ctx.lineTo(W*1.05, GY*0.65); ctx.lineTo(W*1.05, GY); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(68,88,58,0.32)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.fillStyle = 'rgba(252,252,255,0.72)';
  [[W*0.55,GY*0.42,W*0.06],[W*0.95,GY*0.48,W*0.055]].forEach(([mx,my,hw])=>{
    ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(mx-hw, my+H*0.08); ctx.lineTo(mx+hw, my+H*0.08); ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle = 'rgba(48,98,58,0.68)';
  [W*0.04,W*0.14,W*0.64,W*0.74,W*0.84,W*0.93].forEach(tx => {
    const th = S*0.52;
    ctx.beginPath(); ctx.moveTo(tx, GY-th*1.1); ctx.lineTo(tx-S*0.22, GY-th*0.42); ctx.lineTo(tx+S*0.22, GY-th*0.42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx, GY-th*0.78); ctx.lineTo(tx-S*0.28, GY); ctx.lineTo(tx+S*0.28, GY); ctx.closePath(); ctx.fill();
  });
}

function drawPcRoomBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(48,58,78,0.50)';
  ctx.fillStyle = 'rgba(18,26,44,0.68)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  ctx.strokeStyle = 'rgba(78,88,102,0.48)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H*0.19); ctx.lineTo(W, H*0.19); ctx.stroke();
  [W*0.08, W*0.37, W*0.65].forEach((mx, i) => {
    const monW = S*0.78, monH = S*0.58, my = GY - S*1.38;
    const hues = ['100,162,222','118,202,98','208,98,98'];
    const glow = ctx.createRadialGradient(mx+monW/2, my+monH/2, 0, mx+monW/2, my+monH/2, monW*1.1);
    glow.addColorStop(0, `rgba(${hues[i]},0.22)`); glow.addColorStop(1, `rgba(${hues[i]},0)`);
    ctx.fillStyle = glow; ctx.fillRect(mx-monW*0.4, my-monH*0.4, monW*1.8, monH*1.8);
    ctx.fillStyle = 'rgba(12,18,28,0.90)'; roundRect(ctx, mx, my, monW, monH, 5).fill();
    ctx.strokeStyle = 'rgba(78,92,112,0.80)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = `rgba(${hues[i]},${0.48+Math.sin(t*3.2+i)*0.14})`;
    roundRect(ctx, mx+S*0.04, my+S*0.04, monW-S*0.08, monH-S*0.08, 3).fill();
    ctx.strokeStyle = `rgba(255,255,255,${0.14+Math.sin(t*2+i)*0.06})`; ctx.lineWidth = 1.5;
    for (let li=0; li<4; li++) {
      ctx.beginPath(); ctx.moveTo(mx+S*0.07, my+S*0.1+li*S*0.095); ctx.lineTo(mx+monW-S*0.07, my+S*0.1+li*S*0.095); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(38,48,62,0.88)';
    ctx.fillRect(mx+monW*0.38, my+monH, monW*0.22, S*0.14);
    ctx.fillRect(mx+monW*0.22, my+monH+S*0.14, monW*0.54, S*0.07);
    ctx.fillStyle = 'rgba(32,40,58,0.82)';
    roundRect(ctx, mx, GY-S*0.26, monW, S*0.17, 3).fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(mx+monW+S*0.1, GY-S*0.18, S*0.07, S*0.10, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  });
}

function drawStoreBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(72,50,32,0.50)';
  ctx.fillStyle = 'rgba(245,240,230,0.62)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  const itemColors = ['rgba(232,92,82,0.68)','rgba(82,172,212,0.62)','rgba(238,192,58,0.68)','rgba(102,182,88,0.62)','rgba(212,128,82,0.68)','rgba(178,118,198,0.62)'];
  [H*0.19, H*0.32, H*0.45].forEach((sy, row) => {
    ctx.fillStyle = 'rgba(192,162,128,0.72)'; ctx.fillRect(W*0.04, sy, W*0.88, H*0.022);
    ctx.strokeStyle = ol; ctx.lineWidth = 1.8; ctx.strokeRect(W*0.04, sy, W*0.88, H*0.022);
    for (let j=0; j<7; j++) {
      const ic = itemColors[(row*3+j) % itemColors.length];
      const ix = W*0.07 + j*(W*0.122);
      ctx.fillStyle = ic;
      if (j % 3 === 1) { ctx.beginPath(); ctx.arc(ix+W*0.042, sy-H*0.065, H*0.048, 0, Math.PI*2); ctx.fill(); }
      else { roundRect(ctx, ix, sy-H*0.102, W*0.082, H*0.10, 3).fill(); }
      ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke();
    }
  });
  ctx.fillStyle = 'rgba(198,172,142,0.78)';
  roundRect(ctx, W*0.68, GY-S*0.82, W*0.27, S*0.57, 5).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(218,192,162,0.58)'; ctx.fillRect(W*0.68, GY-S*0.82, W*0.27, S*0.08);
  ctx.strokeStyle = 'rgba(198,188,172,0.38)'; ctx.lineWidth = 1;
  for (let fx=0; fx<W; fx+=W*0.14) {
    ctx.beginPath(); ctx.moveTo(fx, GY-S*0.5); ctx.lineTo(fx, GY); ctx.stroke();
  }
}

function drawOfficeBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(72,52,38,0.50)';
  ctx.fillStyle = 'rgba(238,235,228,0.62)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  ctx.fillStyle = 'rgba(182,222,252,0.42)'; ctx.fillRect(W*0.57, H*0.17, W*0.33, H*0.30);
  ctx.strokeStyle = ol; ctx.lineWidth = 3; ctx.strokeRect(W*0.57, H*0.17, W*0.33, H*0.30);
  ctx.strokeStyle = 'rgba(198,188,172,0.52)'; ctx.lineWidth = 1.5;
  for (let bi=1; bi<9; bi++) {
    const by = H*0.17 + bi*(H*0.30/9);
    ctx.beginPath(); ctx.moveTo(W*0.57, by); ctx.lineTo(W*0.90, by); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(188,158,122,0.76)';
  roundRect(ctx, W*0.05, GY-S*0.57, W*0.53, S*0.40, 5).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.strokeStyle = 'rgba(152,122,88,0.62)'; ctx.lineWidth = 5;
  [[W*0.10, GY-S*0.17],[W*0.52, GY-S*0.17]].forEach(([lx,ly])=>{
    ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx,GY); ctx.stroke();
  });
  ctx.fillStyle = 'rgba(28,34,46,0.86)';
  roundRect(ctx, W*0.27, GY-S*1.22, S*0.67, S*0.57, 5).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'rgba(78,148,222,0.52)';
  roundRect(ctx, W*0.29, GY-S*1.19, S*0.63, S*0.50, 3).fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.5;
  [0,1,2].forEach(li=>{
    ctx.beginPath(); ctx.moveTo(W*0.30, GY-S*1.10+li*S*0.13); ctx.lineTo(W*0.29+S*0.62, GY-S*1.10+li*S*0.13); ctx.stroke();
  });
  ctx.fillStyle = 'rgba(38,44,58,0.82)';
  ctx.fillRect(W*0.27+S*0.28, GY-S*0.65, S*0.11, S*0.12);
  ctx.fillRect(W*0.27+S*0.17, GY-S*0.53, S*0.33, S*0.06);
  ctx.save(); ctx.rotate(0.06);
  ctx.fillStyle = 'rgba(255,255,255,0.72)'; roundRect(ctx, W*0.09, GY-S*0.53, W*0.15, W*0.105, 3).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.rotate(-0.07);
  ctx.fillStyle = 'rgba(245,245,235,0.62)'; roundRect(ctx, W*0.11, GY-S*0.55, W*0.15, W*0.105, 3).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
}

function drawSnowBg(ctx, W, H, GY, S, t) {
  const ol = 'rgba(55,68,88,0.38)';
  ctx.fillStyle = 'rgba(198,215,238,0.55)'; ctx.fillRect(0, H*0.12, W, GY - H*0.12);
  ctx.fillStyle = 'rgba(218,232,248,0.60)';
  ctx.beginPath(); ctx.moveTo(-W*0.05, GY*0.68);
  ctx.quadraticCurveTo(W*0.22, GY*0.36, W*0.46, GY*0.62);
  ctx.quadraticCurveTo(W*0.72, GY*0.38, W*1.05, GY*0.62);
  ctx.lineTo(W*1.05, GY); ctx.lineTo(-W*0.05, GY); ctx.closePath(); ctx.fill();
  [[W*0.06,GY-S*1.1],[W*0.15,GY-S*0.88],[W*0.76,GY-S*1.02],[W*0.86,GY-S*1.18],[W*0.94,GY-S*0.88]].forEach(([tx,ty])=>{
    ctx.fillStyle = 'rgba(48,88,58,0.62)';
    ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx-S*0.25,GY); ctx.lineTo(tx+S*0.25,GY); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = 'rgba(232,242,255,0.82)';
    ctx.beginPath(); ctx.moveTo(tx, ty+S*0.12); ctx.lineTo(tx-S*0.18, GY-S*0.12); ctx.lineTo(tx+S*0.18, GY-S*0.12); ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle = 'rgba(232,242,255,0.72)'; ctx.fillRect(0, GY-S*0.14, W, S*0.14);
  ctx.fillStyle = 'rgba(245,250,255,0.82)';
  for (let i=0; i<6; i++) {
    ctx.beginPath(); ctx.ellipse(W*0.08+i*W*0.16, GY-S*0.07, S*0.20, S*0.09, 0, 0, Math.PI*2); ctx.fill();
  }
}

// ── TIME OF DAY OVERLAY ──
function drawTimeOverlay(ctx, W, H, time_of_day, t) {
  ctx.save();
  if (time_of_day === 'night') {
    ctx.fillStyle = 'rgba(6,10,34,0.44)'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(242,238,208,0.76)';
    ctx.beginPath(); ctx.arc(W*0.82, H*0.11, S_GLOBAL*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(6,10,34,0.44)';
    ctx.beginPath(); ctx.arc(W*0.86, H*0.095, S_GLOBAL*0.19, 0, Math.PI*2); ctx.fill();
    for (let i=0; i<24; i++) {
      const sx = (i*173) % W, sy = (i*97) % (H*0.44);
      const flicker = 0.55 + Math.sin(t*2.8+i*1.5)*0.45;
      ctx.globalAlpha = flicker;
      ctx.fillStyle = 'rgba(255,255,228,0.85)';
      ctx.beginPath(); ctx.arc(sx, sy, 1.4+(i%3)*0.55, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (time_of_day === 'evening') {
    const grad = ctx.createLinearGradient(0, 0, 0, H*0.55);
    grad.addColorStop(0, 'rgba(255,118,52,0.22)');
    grad.addColorStop(0.5, 'rgba(255,88,38,0.10)');
    grad.addColorStop(1, 'rgba(255,88,38,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H*0.55);
    ctx.fillStyle = 'rgba(255,148,48,0.10)'; ctx.fillRect(0, 0, W, H);
  } else if (time_of_day === 'morning') {
    const grad = ctx.createLinearGradient(0, 0, 0, H*0.5);
    grad.addColorStop(0, 'rgba(255,222,118,0.18)');
    grad.addColorStop(1, 'rgba(255,222,118,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H*0.5);
  }
  ctx.restore();
}

// ── WEATHER EFFECTS ──
function drawWeatherEffect(ctx, W, H, weather, elapsed) {
  if (!weather || weather === 'clear') return;
  ctx.save();
  if (weather === 'rain') {
    ctx.strokeStyle = 'rgba(98,148,218,0.44)'; ctx.lineWidth = 1.8;
    for (let i=0; i<58; i++) {
      const seed = i * 137.8;
      const x = ((seed*0.618 + elapsed*92) % W + W) % W;
      const y = ((seed*0.382 + elapsed*235) % H + H) % H;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x-2.8, y+14); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(98,148,218,0.22)'; ctx.lineWidth = 1.2;
    for (let i=0; i<5; i++) {
      const rx = (i*W*0.18 + elapsed*15) % W;
      const rp = (elapsed*1.8 + i*0.7) % 1;
      ctx.globalAlpha = 0.4*(1-rp);
      ctx.beginPath(); ctx.ellipse(rx, H*0.89, rp*S_GLOBAL*0.22, rp*S_GLOBAL*0.08, 0, 0, Math.PI*2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (weather === 'snow') {
    ctx.fillStyle = 'rgba(218,232,255,0.84)';
    for (let i=0; i<32; i++) {
      const seed = i * 174.2;
      const drift = Math.sin(elapsed*0.85 + i*1.15)*22;
      const x = ((seed*0.618 + elapsed*19 + drift) % W + W) % W;
      const y = ((seed*0.382 + elapsed*46) % H + H) % H;
      const r = 2.2 + ((seed*3) % 2.8);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
  }
  ctx.restore();
}

let S_GLOBAL = 40;
