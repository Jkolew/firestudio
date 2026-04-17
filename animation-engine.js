// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE (V4 - DYNAMIC BACKGROUND)
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

  const scenes=await Promise.all(sentences.map(async(s,i)=>{
    const aiResult=await analyzeWithGemini(s);
    if(aiResult){return{text:s,emotion:aiResult.emotion||detectEmotion(text),action:aiResult.action||'idle',location:aiResult.location||null,props:aiResult.props||[],charCount:aiResult.charCount||charCounts[i],time_of_day:aiResult.time_of_day||'afternoon',intensity:aiResult.intensity??.5,weather:aiResult.weather||'clear'};}
    const emo=detectEmotion(text); return{text:s,emotion:emo,action:detectAction(s),location:detectLocation(s),props:detectProps(s),charCount:charCounts[i],time_of_day:emo==='night'?'night':'afternoon',intensity:.5,weather:emo==='rain'?'rain':'clear'};
  }));

  let sceneIdx=-1,startTime=performance.now();
  const captionContainer=document.getElementById('caption-container');

  function render(now){
    const elapsed=(now-startTime)/1000,sceneDuration=4;
    let currentSceneIdx=Math.floor(elapsed/sceneDuration);
    if(currentSceneIdx>=scenes.length){startTime=performance.now();currentSceneIdx=0;}
    const scene=scenes[currentSceneIdx],localT=elapsed%sceneDuration;

    if(sceneIdx!==currentSceneIdx){sceneIdx=currentSceneIdx;if(state.activeCaption)state.activeCaption.remove();const cap=document.createElement('div');cap.className='caption-box';cap.textContent=scene.text;captionContainer.appendChild(cap);state.activeCaption=cap;}

    ctx.clearRect(0,0,W,H);
    drawSky(ctx,W,GY,scene.time_of_day,localT);
    drawGround(ctx,W,H,GY);
    const ssChars=Array.from({length:scene.charCount},(_,i)=>({x:W/2+(i-(scene.charCount-1)/2)*S*2.5,y:GY,arrived:true,facing:1}));
    drawProps(ctx,W,H,GY,S,scene.props,ssChars,artStyle,localT,scene.location);
    drawWeather(ctx,W,H,GY,scene.weather||'clear',localT);
    for(let i=0;i<ssChars.length;i++){const ch=ssChars[i];drawCharacter(ctx,ch.x,ch.y,S,scene.action,scene.emotion,localT,ch.facing,null,artStyle,i,scene.intensity??.5);}

    state.animFrame=requestAnimationFrame(render);
  }
  
  if(scenes.length>0){const cap=document.createElement('div');cap.className='caption-box';cap.textContent=scenes[0].text;captionContainer.appendChild(cap);state.activeCaption=cap;}
  state.animFrame=requestAnimationFrame(render);
}
