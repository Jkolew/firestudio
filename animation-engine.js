// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE (V3 - UNIVERSAL & AI READY)
// ═══════════════════════════════════════════════════════

// ═══ [중요] 개발자 API 키 설정 ═══
// 여기에 본인의 Gemini API 키를 따옴표 안에 넣으세요.
// 모든 사용자가 이 키를 통해 AI 분석을 사용하게 됩니다.
const DEVELOPER_API_KEY = ""; // 키는 앱 설정에서 직접 입력

function rand(a,b){return Math.random()*(b-a)+a;}
function randInt(a,b){return Math.floor(rand(a,b+1));}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

// ═══ GEMINI AI INTERFACE ═══
async function analyzeWithGemini(text) {
  // 1. 개별 사용자가 설정한 키가 있는지 먼저 확인 (우선순위)
  // 2. 없으면 개발자가 설정한 DEVELOPER_API_KEY 사용
  const userApiKey = localStorage.getItem('GEMINI_API_KEY') || DEVELOPER_API_KEY;
  
  if (!userApiKey) return null; // 둘 다 없으면 키워드 모드로 작동

  const prompt = `
    Analyze the following Korean diary sentence and return a JSON object for a character animation.
    Sentence: "${text}"

    Rules:
    1. Select the BEST 'action' from: throw, hug, kiss, cry, laugh, eat, drink, game, sleep, walk, run, work, talk, wave, sit, cook, shop, dance, swim, climb, jump, idle.
    2. Select the BEST 'location' from: snow, pcroom, cafe, home, outside, sea, mountain, school, store, office.
    3. Select 1-2 'props' from: snowball, ball, phone, game, book, coffee, food, bag, money, music, umbrella.
    4. Detect 'emotion' from: happy, sad, angry, peaceful, excited, lonely, night, rain, love, neutral.
    5. 'charCount': Count the TOTAL number of people involved.
       - If it says "met 2 friends", charCount is 3 (author + 2 friends).
       - If it says "with my family (mom, dad)", charCount is 3.
       - If no mention of others, charCount is 1.
       - Max limit is 5 for screen layout.
    6. 'time_of_day': Infer the time from context. Choose from: "morning", "afternoon", "evening", "night". Default "afternoon" if unclear.
    7. 'intensity': A float 0.0–1.0 representing emotional intensity. 0.0=very calm, 1.0=very intense/dramatic.
    8. 'weather': Infer weather from context. Choose from: "clear", "cloudy", "rain", "snow". Default "clear" if unclear.

    Return Format (ONLY JSON, no extra text):
    {"action": "...", "location": "...", "props": ["..."], "emotion": "...", "charCount": number, "time_of_day": "...", "intensity": number, "weather": "..."}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${userApiKey}`, {
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
    console.error("Gemini AI 분석 실패:", e.message);
    return null;
  }
}

// ═══ EMOTION DETECTION ═══
const EMOTIONS={
  night:  {words:['밤','별','달','새벽','밤하늘','야밤','별빛'],label:'밤하늘',color:'#9B8FE8'},
  rain:   {words:['비','빗소리','우산','비가','빗물','장마','소나기'],label:'비 오는 날',color:'#7AAAD4'},
  love:   {words:['사랑','보고싶','그리워','그립','좋아해','사랑해','설레','보고 싶'],label:'사랑',color:'#FF88BB'},
  happy:  {words:['행복','좋았','웃었','즐거','신났','기뻐','최고','행복해','웃음','재밌'],label:'행복',color:'#F5C842'},
  sad:    {words:['힘들','슬프','울었','외로','우울','지쳐','눈물','슬펐','아팠'],label:'슬픔',color:'#6AAAD8'},
  angry:  {words:['화났','짜증','열받','분노','싫었','화가'],label:'화남',color:'#F87171'},
  peaceful:{words:['평화','조용','쉬었','산책','여유','편안','차분','평온'],label:'평온',color:'#6EE7B7'},
  excited:{words:['두근','기대','흥분','두근두근','기대돼','신나'],label:'설렘',color:'#C084FC'},
  lonely: {words:['혼자','쓸쓸','고독','외롭'],label:'외로움',color:'#94A3B8'},
};

// ═══ ACTION & PROP & LOCATION (MASSIVE EXPANSION) ═══
const ACTIONS={
  throw:  ['던졌','눈싸움','공놀이','눈뭉치','던지며','눈을 던','야구','배구','공을 던'],
  hug:    ['안았','안겨','안아줬','껴안','포옹','포근하게'],
  kiss:   ['키스','입맞','뽀뽀','설레는'],
  cry:    ['울었','눈물','슬퍼서','펑펑','울다','흘렸','흑흑','훌쩍','우울','힘들어'],
  laugh:  ['웃었','웃음','웃었다','크게 웃','하하','깔깔','재밌','신나','즐거','박장대소'],
  eat:    ['먹었','밥','식사','점심','저녁','아침','냠냠','맛집','맛있게','요리했','요리해','맛있는'],
  drink:  ['마셨','커피','음료','티타임','한 잔','차를','카페','맥주','칵테일','홀짝'],
  game:   ['게임','롤','배그','피씨방','pc방','피방','발로','옵치','승리','패배','게이밍','플스'],
  sleep:  ['잤다','잠들','졸렸','누웠','낮잠','꿈나라','숙면','피곤해서'],
  walk:   ['걸었','산책','걷기','나갔다','나왔다','등교','하교','출근','퇴근','산보'],
  run:    ['뛰었','달렸','뛰어갔','조깅','질주','운동장','달리기','급하게'],
  work:   ['공부','일했','작업','숙제','코딩','열일','발표','프로젝트','공부방','도서관'],
  talk:   ['말했','얘기','대화','수다','통화','상담','물었','이야기','재잘'],
  wave:   ['인사','안녕','흔들','반갑게'],
  sit:    ['앉았','대기','멍때','기다리','버스','지하철','앉아'],
  cook:   ['요리','칼질','지글','보글','프라이팬','주방','앞치마'],
  shop:   ['쇼핑','백화점','마트','장보기','샀다','지름','택배','물건'],
  dance:  ['춤','댄스','흥얼','둠칫','리듬','노래방','무대'],
  swim:   ['수영','바다','물놀이','워터파크','잠수','해변'],
  climb:  ['등산','산에','정상','정복','하이킹'],
};

const PROP_DETECT={
  snowball: ['눈싸움','눈덩이','눈뭉치','함박눈'],
  ball:     ['공을','축구','농구','야구','축구공','농구공'],
  phone:    ['폰','핸드폰','카톡','인스타','디엠','문자','스마트폰'],
  game:     ['게임','롤','배그','피방','닌텐도','스위치'],
  book:     ['책','독서','공부','참고서','문제집','소설'],
  coffee:   ['커피','아메리카노','라떼','차를','카페','스타벅스'],
  food:     ['밥','음식','피자','치킨','라면','빵','디저트','케이크','고기','스테이크'],
  bag:      ['가방','쇼핑백','배낭','숄더백','에코백'],
  money:    ['지갑','돈을','결제','카드','페이'],
  music:    ['노래','음악','이어폰','헤드폰','멜론','스포티파이'],
  umbrella: ['우산','비옷','양산'],
};

const LOCATIONS={
  snow:   ['눈싸움','겨울','눈이','함박눈','스키장','추운','얼음'],
  pcroom: ['피씨방','pc방','피방','게임방'],
  cafe:   ['카페','커피숍','스벅','투썸','베이커리'],
  home:   ['집','방','침대','거실','내 방','우리 집'],
  outside:['밖','공원','길','거리','야외','광장'],
  sea:    ['바다','해변','해수욕장','모래사장','파도','강변'],
  mountain:['산에','등산','숲','정상'],
  school: ['학교','교실','캠퍼스','학원'],
  store:  ['가게','마트','백화점','편의점','쇼핑'],
  office: ['회사','사무실','직장','업무'],
};

function detectEmotion(text){
  let best='neutral',score=0;
  for(const[e,d]of Object.entries(EMOTIONS)){
    const s=d.words.filter(w=>text.includes(w)).length;
    if(s>score){score=s;best=e;}
  }
  return best;
}
function emotionLabel(e){return EMOTIONS[e]?.label||'하루';}
function emotionColor(e){return EMOTIONS[e]?.color||'#A1A1AA';}

function detectProps(text){
  const props=[];
  for(const[prop,words]of Object.entries(PROP_DETECT)){
    if(words.some(w=>text.includes(w))) props.push(prop);
  }
  return props;
}

function detectAction(text){
  for(const[action,words]of Object.entries(ACTIONS)){
    if(words.some(w=>text.includes(w))) return action;
  }
  return 'idle';
}

function detectLocation(text){
  for(const[loc,words]of Object.entries(LOCATIONS)){
    if(words.some(w=>text.includes(w))) return loc;
  }
  return null;
}

const PERSON_WORDS=['친구','가족','엄마','아빠','형','오빠','언니','누나','동생','그녀','상대방'];
function buildCumulativeCharCounts(sentences){
  let count=1;
  return sentences.map(s=>{
    if(s.includes('혼자')||s.includes('나만')) {count=1; return count;}
    if(PERSON_WORDS.some(w=>s.includes(w))) count=Math.min(count+1,3);
    return count;
  });
}

function parseSentences(text){
  return text.replace(/([.!?！？。])\s*/g,'$1\n').split('\n').map(s=>s.trim()).filter(s=>s.length>1);
}

// ═══════════════════════════════════════════════════════
//  SCENE SEQUENCE ENGINE
// ═══════════════════════════════════════════════════════

const PALETTES={
  anime:  {char1:'#FFD0BC',char2:'#FFB898',char3:'#EC9872',accent:'#FF8FAD',outline:'rgba(68,36,16,0.58)',paper:'#FFFBF0',ground:'#EED8C2',groundLine:'rgba(162,128,98,0.40)'},
};

// ═══ SKY RENDERER ═══
function drawSky(ctx, W, GY, timeOfDay, t) {
  const SKIES = {
    morning:   ['#FFD4A8', '#FFE8B0', '#B8E0F7'],
    afternoon: ['#87CEEB', '#5BA3D9', '#3A87C8'],
    evening:   ['#FF7043', '#FF5082', '#7B2D8B'],
    night:     ['#0A0A1E', '#12124A', '#1A2060'],
  };
  const stops = SKIES[timeOfDay] || SKIES.afternoon;
  const grad = ctx.createLinearGradient(0, 0, 0, GY);
  stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, GY);

  if (timeOfDay === 'night') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 40; i++) {
      const sx = ((Math.sin(i * 2.7) * 0.5 + 0.5)) * W;
      const sy = ((Math.sin(i * 3.9) * 0.5 + 0.5)) * GY * 0.85;
      const sz = 0.8 + Math.abs(Math.sin(t * 1.5 + i)) * 1.2;
      ctx.beginPath(); ctx.arc(sx, sy, sz, 0, Math.PI * 2); ctx.fill();
    }
  } else if (timeOfDay === 'morning') {
    // Sun
    ctx.save(); ctx.globalAlpha = 0.6;
    const sg = ctx.createRadialGradient(W * 0.15, GY * 0.3, 0, W * 0.15, GY * 0.3, GY * 0.25);
    sg.addColorStop(0, '#FFFDE0'); sg.addColorStop(1, 'transparent');
    ctx.fillStyle = sg; ctx.fillRect(0, 0, W, GY); ctx.restore();
  } else if (timeOfDay === 'evening') {
    // Sunset glow
    ctx.save(); ctx.globalAlpha = 0.4;
    const eg = ctx.createRadialGradient(W * 0.5, GY, 0, W * 0.5, GY, GY * 0.8);
    eg.addColorStop(0, '#FFD700'); eg.addColorStop(1, 'transparent');
    ctx.fillStyle = eg; ctx.fillRect(0, 0, W, GY); ctx.restore();
  }
}

// ═══ WEATHER RENDERER ═══
function drawWeather(ctx, W, H, GY, weather, t) {
  if (weather === 'rain') {
    ctx.save(); ctx.strokeStyle = 'rgba(120, 170, 255, 0.55)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 35; i++) {
      const rx = ((Math.sin(i * 2.1 + 0.5) * 0.5 + 0.5)) * W;
      const ry = (t * 350 + i * (H / 35)) % H;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 16); ctx.stroke();
    }
    ctx.restore();
  } else if (weather === 'snow') {
    ctx.save(); ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    for (let i = 0; i < 25; i++) {
      const sx = ((Math.sin(i * 1.7 + t * 0.4) * 0.5 + 0.5)) * W;
      const sy = (t * 70 + i * (H / 25)) % H;
      ctx.beginPath(); ctx.arc(sx, sy, 2.5 + Math.sin(i) * 1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  } else if (weather === 'cloudy') {
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#AAC8E8';
    for (let i = 0; i < 3; i++) {
      const cx = (W * (0.2 + i * 0.3) + Math.sin(t * 0.2 + i) * 20);
      const cy = GY * (0.2 + i * 0.12);
      ctx.beginPath(); ctx.arc(cx, cy, GY * 0.12, 0, Math.PI * 2);
      ctx.arc(cx + GY * 0.1, cy - GY * 0.05, GY * 0.09, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

// ═══ BACKGROUND & FRAME LOAD ═══
let bgImage = null;
const loadBg = () => new Promise(res => {
  if(bgImage) return res(bgImage);
  const img = new Image(); img.src = '애니메이션 그림체.png';
  img.onload = () => { bgImage = img; res(img); };
  img.onerror = () => res(null);
});

async function startSceneSequence(canvas,text,artStyle,dateStr){
  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  const GY=H*0.75, S=H*0.08;
  const sentences=parseSentences(text);
  const charCounts=buildCumulativeCharCounts(sentences);
  
  // Load background image first
  await loadBg();

  // 1. AI 분석 또는 키워드 분석 (Hybrid)
  const scenes = await Promise.all(sentences.map(async (s, i) => {
    const aiResult = await analyzeWithGemini(s);
    if (aiResult) {
      return {
        text: s,
        emotion: aiResult.emotion || detectEmotion(text),
        action: aiResult.action || 'idle',
        location: aiResult.location || null,
        props: aiResult.props || [],
        charCount: aiResult.charCount || charCounts[i],
        time_of_day: aiResult.time_of_day || 'afternoon',
        intensity: typeof aiResult.intensity === 'number' ? aiResult.intensity : 0.5,
        weather: aiResult.weather || 'clear'
      };
    }
    // Fallback to keywords
    const emo = detectEmotion(text);
    return {
      text:s, emotion: emo, action:detectAction(s),
      location:detectLocation(s), props:detectProps(s),
      charCount:charCounts[i],
      time_of_day: emo === 'night' ? 'night' : 'afternoon',
      intensity: 0.5,
      weather: emo === 'rain' ? 'rain' : 'clear'
    };
  }));

  let sceneIdx=0, startTime=performance.now();
  
  function render(now){
    const elapsed=(now-startTime)/1000;
    const sceneDuration=3.5;
    sceneIdx=Math.floor(elapsed/sceneDuration);
    if(sceneIdx>=scenes.length){
      // Replay or stop
      startTime=performance.now(); sceneIdx=0;
    }
    const scene=scenes[sceneIdx];
    const localT=elapsed % sceneDuration;

    ctx.clearRect(0,0,W,H);
    
    // 1. Draw Background Image (Shin-chan Style Template)
    if(bgImage) {
      // Draw as background (Cover)
      const iw=bgImage.width, ih=bgImage.height;
      const scale=Math.max(W/iw, H/ih);
      const dw=iw*scale, dh=ih*scale;
      ctx.drawImage(bgImage, (W-dw)/2, (H-dh)/2, dw, dh);
    } else {
      // Fallback to paper color if image fails
      ctx.fillStyle='#FFFBF0'; ctx.fillRect(0,0,W,H);
    }

    // Environment & Props
    const ssChars=Array.from({length:scene.charCount},(_,i)=>({
      x:W/2+(i-(scene.charCount-1)/2)*S*2.5, y:GY, arrived:true, facing:1
    }));

    drawProps(ctx,W,H,GY,S,scene.props,ssChars,artStyle,localT,scene.location);
    // Weather overlay (Keep subtle weather effects)
    drawWeather(ctx, W, H, GY, scene.weather || 'clear', localT);

    // Characters
    scenes[sceneIdx].chars=ssChars;
    const sceneIntensity = scene.intensity ?? 0.5;
    for(let i=0; i<ssChars.length; i++){
      const ch=ssChars[i];
      drawCharacter(ctx,ch.x,ch.y,S,scene.action,scene.emotion,localT,ch.facing,null,artStyle,i,sceneIntensity);
    }

    // Text Overlay - Shin-chan Style Caption
    ctx.save();
    ctx.font='bold 20px Noto Serif KR';
    const tw = ctx.measureText(scene.text).width;
    const padding = 24;
    
    // Caption Box
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2.5;
    roundRect(ctx, W/2 - tw/2 - padding, H*0.08, tw + padding*2, 45, 12).fill();
    ctx.stroke();

    ctx.fillStyle='#000'; ctx.textAlign='center';
    ctx.fillText(scene.text, W/2, H*0.135); 
    ctx.restore();

    // 2. Draw Frame Overlay (Black border)
    ctx.strokeStyle = '#000'; ctx.lineWidth = 12;
    ctx.strokeRect(0, 0, W, H);
    // Rough inner line for hand-drawn feel
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, W-20, H-20);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
