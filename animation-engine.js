// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE (V6.0 - NOTEBOOK STYLE)
// ═══════════════════════════════════════════════════════

const DEVELOPER_API_KEY = "";

function rand(a,b){return Math.random()*(b-a)+a;}
function randInt(a,b){return Math.floor(rand(a,b+1));}

// ── NOTEBOOK BACKGROUND ──
function drawNotebookBackground(ctx, W, H) {
  // Paper base
  ctx.fillStyle = '#FEFDF4';
  ctx.fillRect(0, 0, W, H);

  // Horizontal ruled lines
  const lineSpacing = Math.max(22, H / 27);
  ctx.strokeStyle = 'rgba(100, 149, 237, 0.22)';
  ctx.lineWidth = 1;
  for (let y = lineSpacing; y < H; y += lineSpacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Red margin line
  const margin = Math.max(48, W * 0.07);
  ctx.strokeStyle = 'rgba(220, 70, 70, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(margin, 0); ctx.lineTo(margin, H); ctx.stroke();

  // Spiral binding
  const spiralX  = margin * 0.38;
  const coilR    = Math.max(5, margin * 0.13);
  const numCoils = Math.floor(H / (coilR * 4.2));
  ctx.strokeStyle = 'rgba(90, 90, 90, 0.38)';
  ctx.lineWidth = 2.2;
  for (let i = 0; i < numCoils; i++) {
    const cy = (i + 0.5) * (H / numCoils);
    ctx.beginPath();
    ctx.arc(spiralX, cy, coilR, -Math.PI * 0.25, Math.PI * 1.25);
    ctx.stroke();
  }

  // Subtle paper texture (faint horizontal strokes)
  ctx.strokeStyle = 'rgba(0,0,0,0.025)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 18; i++) {
    const lx = ((i * 173) % (W - 60)) + 30;
    const ly = ((i * 53)  % (H - 20)) + 10;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 28, ly); ctx.stroke();
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

    // 1. Notebook background
    drawNotebookBackground(ctx, W, H);

    // 2. Props
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

    // 4. Top-left page title
    ctx.save();
    const margin = Math.max(48, W * 0.07);
    const titleX = margin + W * 0.03;
    const titleY = H * 0.07;
    ctx.font = `bold ${Math.round(S * 0.7)}px 'Noto Serif KR', serif`;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(50, 40, 80, 0.75)';
    ctx.fillText('오늘의 일기', titleX, titleY);
    ctx.restore();

    // 5. Thin border
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 8; ctx.strokeRect(0,0,W,H);

    state.animFrame=requestAnimationFrame(render);
  }
  
  if(scenes.length>0 && captionContainer){
    const cap=document.createElement('div'); cap.className='caption-box'; cap.textContent=scenes[0].text;
    captionContainer.appendChild(cap); state.activeCaption=cap;
  }
  state.animFrame=requestAnimationFrame(render);
}
