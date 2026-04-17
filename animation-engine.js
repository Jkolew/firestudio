// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE (V5.2 - LARGE CENTERED BRANDING)
// ═══════════════════════════════════════════════════════

const DEVELOPER_API_KEY = "";

function rand(a,b){return Math.random()*(b-a)+a;}
function randInt(a,b){return Math.floor(rand(a,b+1));}

// ═══ GEMINI AI INTERFACE ═══
async function analyzeWithGemini(text) {
  const userApiKey = localStorage.getItem('GEMINI_API_KEY') || DEVELOPER_API_KEY;
  if (!userApiKey) return null;

  const prompt = `
    Analyze the following Korean diary sentence and return a JSON object for a character animation.
    Sentence: "${text}"

    Rules:
    1. Select the BEST 'action' from: throw, hug, kiss, cry, laugh, eat, drink, game, sleep, walk, run, work, talk, wave, sit, cook, shop, dance, swim, climb, jump, idle.
    2. Select the BEST 'location' from: snow, pcroom, cafe, home, outside, sea, mountain, school, store, office.
    3. Select 1-2 'props' from: snowball, ball, phone, game, book, coffee, food, bag, money, music, umbrella.
    4. Detect 'emotion' from: happy, sad, angry, peaceful, excited, lonely, night, rain, love, neutral.
    5. 'charCount': Count the TOTAL number of people involved. Max 5.
    6. 'time_of_day': Infer from context. Choose: "morning", "afternoon", "evening", "night". Default "afternoon".
    7. 'intensity': Float 0.0–1.0 for emotional intensity. 0.0=calm, 1.0=intense.
    8. 'weather': Infer from context. Choose: "clear", "cloudy", "rain", "snow". Default "clear".

    Return Format (ONLY JSON, no extra text):
    {"action": "...", "location": "...", "props": ["..."], "emotion": "...", "charCount": number, "time_of_day": "...", "intensity": number, "weather": "..."}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${userApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    let resultText = data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json|```/g, "").trim();
    const jsonStart = resultText.indexOf('{');
    const jsonEnd = resultText.lastIndexOf('}');
    return JSON.parse(resultText.substring(jsonStart, jsonEnd + 1));
  } catch (e) {
    console.error("Gemini AI Error:", e.message);
    return null;
  }
}

// ═══ KEYWORD ANALYSIS ═══
const EMOTIONS={ night:{words:['밤','별','달','새벽'],label:'밤하늘',color:'#9B8FE8'}, rain:{words:['비','우산','장마'],label:'비 오는 날',color:'#7AAAD4'}, love:{words:['사랑','보고싶','좋아해','설레'],label:'사랑',color:'#FF88BB'}, happy:{words:['행복','좋았','웃었','즐거','신났'],label:'행복',color:'#F5C842'}, sad:{words:['힘들','슬프','울었','우울','눈물'],label:'슬픔',color:'#6AAAD8'}, angry:{words:['화났','짜증','열받'],label:'화남',color:'#F87171'}, peaceful:{words:['평화','조용','쉬었','산책'],label:'평온',color:'#6EE7B7'}, excited:{words:['두근','기대','흥분'],label:'설렘',color:'#C084FC'}, lonely:{words:['혼자','쓸쓸','외롭'],label:'외로움',color:'#94A3B8'} };
const ACTIONS={ throw:['던졌','눈싸움'], hug:['안았'], kiss:['키스','뽀뽀'], cry:['울었','눈물'], laugh:['웃었','신나'], eat:['먹었','맛집'], drink:['마셨','커피','카페'], game:['게임','피씨방'], sleep:['잤다','졸렸'], walk:['걸었','산책'], run:['뛰었','달렸'], work:['공부','일했'], talk:['얘기','대화'], wave:['인사','안녕'], sit:['앉았'], cook:['요리'], shop:['쇼핑','마트'], dance:['춤','댄스'], swim:['수영','바다'], climb:['등산'] };
const PROP_DETECT={ snowball:['눈싸움'], ball:['공놀이'], phone:['핸드폰','카톡'], game:['게임'], book:['책','독서'], coffee:['커피','카페'], food:['밥','음식'], bag:['가방'], money:['돈','지갑'], music:['노래','음악'], umbrella:['우산'] };
const LOCATIONS={ snow:['눈'], pcroom:['피씨방'], cafe:['카페'], home:['집','방'], outside:['밖','공원'], sea:['바다'], mountain:['산'], school:['학교'], store:['마트','백화점'], office:['회사'] };

function detectEmotion(text){let best='neutral',score=0;for(const[e,d]of Object.entries(EMOTIONS)){const s=d.words.filter(w=>text.includes(w)).length;if(s>score){score=s;best=e;}}return best;}
function emotionLabel(e){return EMOTIONS[e]?.label||'하루';}
function emotionColor(e){return EMOTIONS[e]?.color||'#A1A1AA';}
function detectProps(text){const p=[];for(const[pr,wds]of Object.entries(PROP_DETECT)){if(wds.some(w=>text.includes(w)))p.push(pr);}return p;}
function detectAction(text){for(const[a,wds]of Object.entries(ACTIONS)){if(wds.some(w=>text.includes(w)))return a;}return'idle';}
function detectLocation(text){for(const[l,wds]of Object.entries(LOCATIONS)){if(wds.some(w=>text.includes(w)))return l;}return null;}
function buildCumulativeCharCounts(sentences){let c=1;return sentences.map(s=>{if(s.includes('혼자'))c=1;else if(['친구','가족','엄마','아빠'].some(w=>s.includes(w)))c=Math.min(c+1,3);return c;});}
function parseSentences(text){return text.replace(/([.!?！？。])\s*/g,'$1\n').split('\n').map(s=>s.trim()).filter(s=>s.length>1);}


// ═══════════════════════════════════════════════════════
//  SCENE SEQUENCE ENGINE
// ═══════════════════════════════════════════════════════

// ═══ BACKGROUND & FRAME LOAD ═══
let bgImage = null;
const loadBg = () => new Promise(res => {
  if(bgImage) return res(bgImage);
  const img = new Image(); img.src = '애니메이션 그림체.png';
  img.onload = () => { bgImage = img; res(img); };
  img.onerror = () => res(null);
});

// ── LOGO UTILS ──
function drawBearLogo(ctx, x, y, size, t) {
  ctx.save();
  ctx.translate(x, y);
  
  const ol = '#000';
  const bw = size * 1.5; // 침대 너비
  const bh = size * 0.9; // 침대 높이
  const breath = Math.sin(t * 1.5) * (size * 0.04);

  // 1. Bed Frame (침대 사각형 틀)
  ctx.fillStyle = '#2A2A3A';
  ctx.strokeStyle = ol;
  ctx.lineWidth = size * 0.05;
  roundRect(ctx, -bw/2, -bh/2, bw, bh, size*0.15).fill();
  ctx.stroke();

  // 2. Pillow (베개 - 사각형에 맞게 배치)
  ctx.fillStyle = '#3F3F5F';
  roundRect(ctx, -bw/2 + size*0.1, -bh/2 + size*0.1, size*0.5, size*0.35, size*0.08).fill();
  ctx.stroke();

  // 3. Bear Head (잠자는 곰돌이)
  ctx.save();
  ctx.translate(-size*0.1, breath); // 호흡 애니메이션
  
  // Ears
  ctx.fillStyle = '#7A5C44';
  ctx.beginPath(); ctx.arc(-size*0.3, -size*0.15, size*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(size*0.1, -size*0.15, size*0.18, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  // Face
  ctx.beginPath(); ctx.ellipse(-size*0.1, 0, size*0.45, size*0.38, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();

  // Eyes (Closed)
  ctx.strokeStyle = ol; ctx.lineWidth = size * 0.04;
  ctx.beginPath(); ctx.arc(-size*0.25, 0, size*0.07, 0.2, Math.PI-0.2); ctx.stroke();
  ctx.beginPath(); ctx.arc(size*0.05, 0, size*0.07, 0.2, Math.PI-0.2); ctx.stroke();

  // Nose
  ctx.fillStyle = '#4A3425';
  ctx.beginPath(); ctx.ellipse(-size*0.1, size*0.08, size*0.08, size*0.05, 0, 0, Math.PI*2); ctx.fill();
  
  ctx.restore();

  // 4. Blanket (이불 - 침대 사각형 하단을 꽉 채움)
  const grad = ctx.createLinearGradient(-bw/2, 0, bw/2, bh/2);
  grad.addColorStop(0, '#C4A882'); grad.addColorStop(1, '#A68B6A');
  ctx.fillStyle = grad;
  ctx.save();
  ctx.translate(0, breath * 0.4);
  roundRect(ctx, -bw/2, size*0.05, bw, bh/2 + size*0.15, size*0.1).fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-bw/2 + 5, size*0.05 + 5); ctx.lineTo(bw/2 - 5, size*0.05 + 5); ctx.stroke();
  ctx.strokeStyle = ol; ctx.lineWidth = size * 0.05;
  ctx.stroke();
  ctx.restore();

  // 5. ZZZ Animation
  ctx.fillStyle = '#C4A882';
  ctx.font = `bold ${size*0.25}px Arial`;
  for(let i=0; i<2; i++) {
    const zt = (t + i*1.8) % 3.5;
    const za = 1 - zt/3.5;
    ctx.save();
    ctx.globalAlpha = za;
    ctx.translate(size*0.5 + zt*size*0.25, -size*0.4 - zt*size*0.4);
    ctx.fillText('z', 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function drawSky(ctx,W,GY,timeOfDay,t){
  const SKIES={morning:['#B8E0F7','#FFD4A8'],afternoon:['#87CEEB','#5BA3D9'],evening:['#7B2D8B','#FF7043'],night:['#12124A','#0A0A1E']};
  const stops=SKIES[timeOfDay]||SKIES.afternoon;
  const grad=ctx.createLinearGradient(0,0,0,GY); grad.addColorStop(0,stops[0]); grad.addColorStop(1,stops[1]);
  ctx.fillStyle=grad; ctx.fillRect(0,0,W,GY);
  if(timeOfDay==='night'){ctx.fillStyle='rgba(255,255,255,0.9)';for(let i=0;i<40;i++){const sx=((Math.sin(i*2.7)*.5+.5))*W,sy=((Math.sin(i*3.9)*.5+.5))*GY*.85,sz=.8+Math.abs(Math.sin(t*1.5+i))*1.2;ctx.beginPath();ctx.arc(sx,sy,sz,0,Math.PI*2);ctx.fill();}}
  else if(timeOfDay==='morning'){ctx.save();ctx.globalAlpha=.6;const sg=ctx.createRadialGradient(W*.15,GY*.3,0,W*.15,GY*.3,GY*.25);sg.addColorStop(0,'#FFFDE0');sg.addColorStop(1,'transparent');ctx.fillStyle=sg;ctx.fillRect(0,0,W,GY);ctx.restore();}
  else if(timeOfDay==='evening'){ctx.save();ctx.globalAlpha=.4;const eg=ctx.createRadialGradient(W*.5,GY,0,W*.5,GY,GY*.8);eg.addColorStop(0,'#FFD700');eg.addColorStop(1,'transparent');ctx.fillStyle=eg;ctx.fillRect(0,0,W,GY);ctx.restore();}
}

function drawGround(ctx,W,H,GY){
  ctx.fillStyle='#F4E8D4'; ctx.fillRect(0,GY,W,H-GY);
  ctx.strokeStyle='rgba(162,128,98,0.40)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,GY); ctx.lineTo(W,GY); ctx.stroke();
}

function drawWeather(ctx,W,H,GY,weather,t){
  if(weather==='rain'){ctx.save();ctx.strokeStyle='rgba(120,170,255,0.55)';ctx.lineWidth=1.5;for(let i=0;i<35;i++){const rx=((Math.sin(i*2.1+.5)*.5+.5))*W,ry=(t*350+i*(H/35))%H;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-3,ry+16);ctx.stroke();}ctx.restore();}
  else if(weather==='snow'){ctx.save();ctx.fillStyle='rgba(255,255,255,0.88)';for(let i=0;i<25;i++){const sx=((Math.sin(i*1.7+t*.4)*.5+.5))*W,sy=(t*70+i*(H/25))%H;ctx.beginPath();ctx.arc(sx,sy,2.5+Math.sin(i)*1,0,Math.PI*2);ctx.fill();}ctx.restore();}
  else if(weather==='cloudy'){ctx.save();ctx.globalAlpha=.18;ctx.fillStyle='#FFF';for(let i=0;i<3;i++){const cx=(W*(.2+i*.3)+Math.sin(t*.2+i)*20),cy=GY*(.2+i*.12);ctx.beginPath();ctx.ellipse(cx,cy,GY*.2,GY*.12,0,0,Math.PI*2);ctx.fill();}ctx.restore();}
}

async function startSceneSequence(canvas,text,artStyle){
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,GY=H*.88,S=H*.08;
  const sentences=parseSentences(text);
  const charCounts=buildCumulativeCharCounts(sentences);
  
  await loadBg();

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
    let currentSceneIdx=Math.floor(elapsed/sceneDuration);
    if(currentSceneIdx>=scenes.length){startTime=performance.now();currentSceneIdx=0;charStates=[];}
    const scene=scenes[currentSceneIdx],localT=elapsed%sceneDuration;
    const isFading = localT < fadeDuration && currentSceneIdx > 0;
    const fadeAlpha = isFading ? localT / fadeDuration : 1.0;

    if(sceneIdx!==currentSceneIdx){
      sceneIdx=currentSceneIdx;
      if(captionContainer){
        if(state.activeCaption)state.activeCaption.remove();
        const cap=document.createElement('div');
        cap.className='caption-box';
        cap.textContent=scene.text;
        captionContainer.appendChild(cap);
        state.activeCaption=cap;
      }
      
      const targetCharCount = scene.charCount;
      const newChars = Array.from({length:targetCharCount},(_,i)=>({
        targetX:W/2+(i-(targetCharCount-1)/2)*S*2.5,
        x: charStates[i] ? charStates[i].x : W/2+(i-(targetCharCount-1)/2)*S*2.5,
        y:GY, arrived:true, facing:1, opacity: charStates[i] ? 1.0 : 0.0
      }));
      charStates = newChars;
    }

    charStates.forEach(ch => {
      ch.x += (ch.targetX - ch.x) * 0.08;
      if (ch.opacity < 1.0) ch.opacity += 0.05;
    });

    ctx.clearRect(0,0,W,H);
    
    // 1. Draw Background
    if(bgImage) {
      const iw=bgImage.width, ih=bgImage.height;
      const scale=Math.max(W/iw, H/ih);
      const dw=iw*scale, dh=ih*scale;
      ctx.drawImage(bgImage, (W-dw)/2, (H-dh)/2, dw, dh);
    } else {
      drawSky(ctx,W,GY,scene.time_of_day,localT);
      drawGround(ctx,W,H,GY);
    }

    // 2. Weather & Props (Smooth Transitioning)
    ctx.save();
    if (isFading) {
      const prev = scenes[currentSceneIdx - 1];
      ctx.globalAlpha = 1.0 - fadeAlpha;
      drawProps(ctx,W,H,GY,S,prev.props,charStates,artStyle,localT + sceneDuration,prev.location);
      drawWeather(ctx, W, H, GY, prev.weather || 'clear', localT + sceneDuration);
      ctx.globalAlpha = fadeAlpha;
      drawProps(ctx,W,H,GY,S,scene.props,charStates,artStyle,localT,scene.location);
      drawWeather(ctx, W, H, GY, scene.weather || 'clear', localT);
    } else {
      drawProps(ctx,W,H,GY,S,scene.props,charStates,artStyle,localT,scene.location);
      drawWeather(ctx, W, H, GY, scene.weather || 'clear', localT);
    }
    ctx.restore();

    // 3. Characters
    for(let i=0;i<charStates.length;i++){
      const ch=charStates[i];
      ctx.save(); ctx.globalAlpha = ch.opacity;
      drawCharacter(ctx,ch.x,ch.y,S,scene.action,scene.emotion,localT,ch.facing,null,artStyle,i,scene.intensity??.5);
      ctx.restore();
    }

    // 4. Logo Overlay (BRANDING PERSISTENT)
    ctx.save();
    const logoSize = S * 2.2; // 로고 크기 대폭 확대
    const logoY = H * 0.16; // 위치를 중앙 쪽으로 조금 더 내림
    
    // Draw Sleeping Bear (사각형 침대 틀 버전)
    drawBearLogo(ctx, W/2, logoY, logoSize, elapsed);

    // Draw Text Logo (큰 텍스트)
    ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.fillStyle = '#000'; ctx.strokeStyle = '#FFF'; ctx.lineWidth = 6;
    ctx.font = 'bold 46px Noto Serif KR';
    ctx.textAlign = 'center';
    ctx.strokeText('내 오늘의 일기', W/2, logoY + logoSize * 1.0);
    ctx.fillText('내 오늘의 일기', W/2, logoY + logoSize * 1.0);
    ctx.restore();

    // 5. Frame (Black border)
    ctx.strokeStyle = '#000'; ctx.lineWidth = 15;
    ctx.strokeRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, W-20, H-20);

    state.animFrame=requestAnimationFrame(render);
  }
  
  if(scenes.length>0 && captionContainer){
    const cap=document.createElement('div');
    cap.className='caption-box';
    cap.textContent=scenes[0].text;
    captionContainer.appendChild(cap);
    state.activeCaption=cap;
  }
  state.animFrame=requestAnimationFrame(render);
}
