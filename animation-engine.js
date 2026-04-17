// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE (V5.3 - PURE SHIN-CHAN ART STYLE)
// ═══════════════════════════════════════════════════════

const DEVELOPER_API_KEY = "";

function rand(a,b){return Math.random()*(b-a)+a;}
function randInt(a,b){return Math.floor(rand(a,b+1));}

// ── LOGO UTILS ──
function drawBearLogo(ctx, x, y, size, t) {
  ctx.save();
  ctx.translate(x, y);
  
  const ol = '#000';
  const bw = size * 1.6; 
  const bh = size * 1.0; 
  const breath = Math.sin(t * 1.5) * (size * 0.04);

  // 1. Bed Frame (정갈한 사각형 틀)
  ctx.fillStyle = '#2A2A3A';
  ctx.strokeStyle = ol;
  ctx.lineWidth = size * 0.06;
  roundRect(ctx, -bw/2, -bh/2, bw, bh, size*0.1).fill();
  ctx.stroke();

  // 2. Pillow
  ctx.fillStyle = '#4A4A6A';
  roundRect(ctx, -bw/2 + size*0.1, -bh/2 + size*0.1, size*0.6, size*0.4, size*0.08).fill();
  ctx.stroke();

  // 3. Bear (침대 중앙에 안착)
  ctx.save();
  ctx.translate(-size*0.05, breath); 
  
  // Ears
  ctx.fillStyle = '#7A5C44';
  ctx.beginPath(); ctx.arc(-size*0.3, -size*0.15, size*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(size*0.15, -size*0.15, size*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  // Face
  ctx.beginPath(); ctx.ellipse(-size*0.08, 0, size*0.48, size*0.4, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  // Closed Eyes
  ctx.strokeStyle = ol; ctx.lineWidth = size * 0.05;
  ctx.beginPath(); ctx.arc(-size*0.25, 0, size*0.08, 0.2, Math.PI-0.2); ctx.stroke();
  ctx.beginPath(); ctx.arc(size*0.1, 0, size*0.08, 0.2, Math.PI-0.2); ctx.stroke();

  // Nose
  ctx.fillStyle = '#4A3425';
  ctx.beginPath(); ctx.ellipse(-size*0.08, size*0.08, size*0.08, size*0.05, 0, 0, Math.PI*2); ctx.fill();
  
  // Blushes
  ctx.fillStyle = 'rgba(255, 120, 120, 0.4)';
  ctx.beginPath(); ctx.arc(-size*0.32, size*0.12, size*0.12, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(size*0.2, size*0.12, size*0.12, 0, Math.PI*2); ctx.fill();
  ctx.restore();

  // 4. Blanket (사각형 하단에 딱 맞춤)
  const grad = ctx.createLinearGradient(-bw/2, 0, bw/2, bh/2);
  grad.addColorStop(0, '#D4B892'); grad.addColorStop(1, '#B69B7A');
  ctx.fillStyle = grad;
  ctx.save();
  ctx.translate(0, breath * 0.5);
  roundRect(ctx, -bw/2, size*0.05, bw, bh/2 + size*0.2, size*0.08).fill();
  ctx.strokeStyle = ol; ctx.lineWidth = size * 0.06;
  ctx.stroke();
  ctx.restore();

  // 5. ZZZ
  ctx.fillStyle = '#D4B892';
  ctx.font = `bold ${size*0.3}px Arial`;
  for(let i=0; i<2; i++) {
    const zt = (t + i*1.8) % 3.5;
    const za = 1 - zt/3.5;
    ctx.save();
    ctx.globalAlpha = za;
    ctx.translate(size*0.6 + zt*size*0.3, -size*0.5 - zt*size*0.4);
    ctx.fillText('z', 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function drawShinSky(ctx, W, GY, timeOfDay, t) {
  const SKIES = {
    morning:   ['#FFD4A8', '#FFE8B0', '#B8E0F7'],
    afternoon: ['#87CEEB', '#B8E0F7', '#D1F0FF'],
    evening:   ['#FF7043', '#FF8A65', '#FFCCBC'],
    night:     ['#0A0A1E', '#1A1A4A', '#2A2A60'],
  };
  const stops = SKIES[timeOfDay] || SKIES.afternoon;
  const grad = ctx.createLinearGradient(0, 0, 0, GY);
  stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, GY);

  // 짱구 스타일 뭉게구름
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 3; i++) {
    const cx = (W * (0.2 + i * 0.3) + Math.sin(t * 0.2 + i) * 30) % (W + 200) - 100;
    const cy = GY * (0.2 + i * 0.1);
    const rs = GY * 0.12;
    ctx.beginPath();
    ctx.arc(cx, cy, rs, 0, Math.PI * 2);
    ctx.arc(cx + rs * 0.8, cy + rs * 0.2, rs * 0.8, 0, Math.PI * 2);
    ctx.arc(cx - rs * 0.5, cy + rs * 0.3, rs * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShinGround(ctx, W, H, GY) {
  // 따뜻한 종이 느낌의 지면
  ctx.fillStyle = '#FFFBF0'; 
  ctx.fillRect(0, GY, W, H - GY);
  
  // 지면 경계선 (약간 삐뚤빼뚤하게)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, GY);
  for(let x=0; x<=W; x+=50) {
    ctx.lineTo(x, GY + Math.sin(x*0.01)*2);
  }
  ctx.stroke();

  // 지면 질감 효과
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 1;
  for(let i=0; i<20; i++) {
    const lx = (i*137)%W, ly = GY + (i*17)%(H-GY);
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx+20, ly); ctx.stroke();
  }
}

// ═══ GEMINI AI & UTILS (Keep same) ═══
async function analyzeWithGemini(text) {
  const userApiKey = localStorage.getItem('GEMINI_API_KEY') || DEVELOPER_API_KEY;
  if (!userApiKey) return null;
  const prompt = `Analyze the following Korean diary sentence and return a JSON object for a character animation. Sentence: "${text}" Rules: 1. Select the BEST 'action' from: throw, hug, kiss, cry, laugh, eat, drink, game, sleep, walk, run, work, talk, wave, sit, cook, shop, dance, swim, climb, jump, idle. 2. Select the BEST 'location' from: snow, pcroom, cafe, home, outside, sea, mountain, school, store, office. 3. Select 1-2 'props' from: snowball, ball, phone, game, book, coffee, food, bag, money, music, umbrella. 4. Detect 'emotion' from: happy, sad, angry, peaceful, excited, lonely, night, rain, love, neutral. 5. 'charCount': Count the TOTAL number of people involved. Max 5. 6. 'time_of_day': Infer from context. Choose: "morning", "afternoon", "evening", "night". Default "afternoon". 7. 'intensity': Float 0.0–1.0. 8. 'weather': Infer weather. Return Format: {"action": "...", "location": "...", "props": ["..."], "emotion": "...", "charCount": number, "time_of_day": "...", "intensity": number, "weather": "..."}`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${userApiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json(); if (data.error) throw new Error(data.error.message);
    let resultText = data.candidates[0].content.parts[0].text; resultText = resultText.replace(/```json|```/g, "").trim();
    const jsonStart = resultText.indexOf('{'); const jsonEnd = resultText.lastIndexOf('}');
    return JSON.parse(resultText.substring(jsonStart, jsonEnd + 1));
  } catch (e) { console.error("Gemini Error:", e.message); return null; }
}

const EMOTIONS={ night:{words:['밤','별','달'],label:'밤하늘',color:'#9B8FE8'}, rain:{words:['비','우산'],label:'비 오는 날',color:'#7AAAD4'}, love:{words:['사랑','설레'],label:'사랑',color:'#FF88BB'}, happy:{words:['행복','웃었'],label:'행복',color:'#F5C842'}, sad:{words:['힘들','슬프'],label:'슬픔',color:'#6AAAD8'}, angry:{words:['화났'],label:'화남',color:'#F87171'}, peaceful:{words:['평화','조용'],label:'평온',color:'#6EE7B7'}, excited:{words:['두근'],label:'설렘',color:'#C084FC'}, lonely:{words:['혼자'],label:'외로움',color:'#94A3B8'} };
const ACTIONS={ throw:['던졌'], hug:['안았'], kiss:['키스'], cry:['울었'], laugh:['웃었'], eat:['먹었'], drink:['마셨'], game:['게임'], sleep:['잤다'], walk:['걸었'], run:['뛰었'], work:['공부'], talk:['얘기'], wave:['인사'], sit:['앉았'], cook:['요리'], shop:['쇼핑'], dance:['춤'], swim:['수영'], climb:['등산'] };
const PROP_DETECT={ snowball:['눈'], ball:['공'], phone:['폰'], game:['게임'], book:['책'], coffee:['커피'], food:['밥'], bag:['가방'], money:['돈'], music:['노래'], umbrella:['우산'] };
const LOCATIONS={ snow:['눈'], pcroom:['피방'], cafe:['카페'], home:['집'], outside:['밖'], sea:['바다'], mountain:['산'], school:['학교'], store:['마트'], office:['회사'] };
function detectEmotion(text){let b='neutral',s=0;for(const[e,d]of Object.entries(EMOTIONS)){const c=d.words.filter(w=>text.includes(w)).length;if(c>s){s=c;b=e;}}return b;}
function emotionLabel(e){return EMOTIONS[e]?.label||'하루';}
function emotionColor(e){return EMOTIONS[e]?.color||'#A1A1AA';}
function detectProps(text){const p=[];for(const[pr,ws]of Object.entries(PROP_DETECT)){if(ws.some(w=>text.includes(w)))p.push(pr);}return p;}
function detectAction(text){for(const[a,ws]of Object.entries(ACTIONS)){if(ws.some(w=>text.includes(w)))return a;}return'idle';}
function detectLocation(text){for(const[l,ws]of Object.entries(LOCATIONS)){if(ws.some(w=>text.includes(w)))return l;}return null;}
function buildCumulativeCharCounts(sentences){let c=1;return sentences.map(s=>{if(s.includes('혼자'))c=1;else if(['친구','가족','엄마','아빠'].some(w=>s.includes(w)))c=Math.min(c+1,3);return c;});}
function parseSentences(text){return text.replace(/([.!?！？。])\s*/g,'$1\n').split('\n').map(s=>s.trim()).filter(s=>s.length>1);}

async function startSceneSequence(canvas,text,artStyle){
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,GY=H*.88,S=H*.08;
  const sentences=parseSentences(text);
  const charCounts=buildCumulativeCharCounts(sentences);

  const scenes=await Promise.all(sentences.map(async(s,i)=>{
    const aiResult=await analyzeWithGemini(s);
    if(aiResult){return{text:s,emotion:aiResult.emotion||detectEmotion(text),action:aiResult.action||'idle',location:aiResult.location||null,props:aiResult.props||[],charCount:aiResult.charCount||charCounts[i],time_of_day:aiResult.time_of_day||'afternoon',intensity:aiResult.intensity??.5,weather:aiResult.weather||'clear'};}
    const emo=detectEmotion(text); return{text:s,emotion:emo,action:detectAction(s),location:detectLocation(s),props:detectProps(s),charCount:charCounts[i],time_of_day:emo==='night'?'night':'afternoon',intensity:.5,weather:emo==='rain'?'rain':'clear'};
  }));

  let sceneIdx=-1,startTime=performance.now();
  const captionContainer=document.getElementById('caption-container');
  let charStates = [];

  function render(now){
    const elapsed=(now-startTime)/1000,sceneDuration=4,fadeDuration=0.8;
    let currentIdx=Math.floor(elapsed/sceneDuration);
    if(currentIdx>=scenes.length){startTime=performance.now();currentIdx=0;charStates=[];}
    const scene=scenes[currentIdx],localT=elapsed%sceneDuration;
    const isFading = localT < fadeDuration && currentIdx > 0;
    const fadeAlpha = isFading ? localT / fadeDuration : 1.0;

    if(sceneIdx!==currentIdx){
      sceneIdx=currentIdx;
      if(captionContainer){
        if(state.activeCaption)state.activeCaption.remove();
        const cap=document.createElement('div'); cap.className='caption-box'; cap.textContent=scene.text;
        captionContainer.appendChild(cap); state.activeCaption=cap;
      }
      const targetCount = scene.charCount;
      charStates = Array.from({length:targetCount},(_,i)=>({
        targetX:W/2+(i-(targetCount-1)/2)*S*2.5,
        x: charStates[i] ? charStates[i].x : W/2+(i-(targetCount-1)/2)*S*2.5,
        y:GY, arrived:true, facing:1, opacity: charStates[i] ? 1.0 : 0.0
      }));
    }

    charStates.forEach(ch=>{ch.x+=(ch.targetX-ch.x)*0.08; if(ch.opacity<1)ch.opacity+=0.05;});

    ctx.clearRect(0,0,W,H);
    
    // 1. Draw Procedural Shin-chan Background
    drawShinSky(ctx, W, GY, scene.time_of_day, localT);
    drawShinGround(ctx, W, H, GY);

    // 2. Weather & Props
    ctx.save();
    if(isFading){
      const prev=scenes[currentIdx-1];
      ctx.globalAlpha=1-fadeAlpha;
      drawProps(ctx,W,H,GY,S,prev.props,charStates,artStyle,localT+sceneDuration,prev.location);
      ctx.globalAlpha=fadeAlpha;
    }
    drawProps(ctx,W,H,GY,S,scene.props,charStates,artStyle,localT,scene.location);
    ctx.restore();

    // 3. Characters
    for(let i=0;i<charStates.length;i++){
      const ch=charStates[i]; ctx.save(); ctx.globalAlpha=ch.opacity;
      drawCharacter(ctx,ch.x,ch.y,S,scene.action,scene.emotion,localT,ch.facing,null,artStyle,i,scene.intensity??.5);
      ctx.restore();
    }

    // 4. Branding Logo (Large & Centered)
    ctx.save();
    const logoSize = S * 2.2; const logoY = H * 0.16;
    drawBearLogo(ctx, W/2, logoY, logoSize, elapsed);
    ctx.shadowBlur=15; ctx.shadowColor='rgba(0,0,0,0.5)';
    ctx.fillStyle='#000'; ctx.strokeStyle='#FFF'; ctx.lineWidth=6;
    ctx.font='bold 48px Noto Serif KR'; ctx.textAlign='center';
    ctx.strokeText('내 오늘의 일기', W/2, logoY + logoSize);
    ctx.fillText('내 오늘의 일기', W/2, logoY + logoSize);
    ctx.restore();

    // 5. Frame
    ctx.strokeStyle='#000'; ctx.lineWidth=15; ctx.strokeRect(0,0,W,H);
    ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=2; ctx.strokeRect(10,10,W-20,H-20);

    state.animFrame=requestAnimationFrame(render);
  }
  
  if(scenes.length>0 && captionContainer){
    const cap=document.createElement('div'); cap.className='caption-box'; cap.textContent=scenes[0].text;
    captionContainer.appendChild(cap); state.activeCaption=cap;
  }
  state.animFrame=requestAnimationFrame(render);
}
