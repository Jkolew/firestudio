// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE (V6.0 - NOTEBOOK STYLE)
// ═══════════════════════════════════════════════════════

const DEVELOPER_API_KEY = "";

function rand(a,b){return Math.random()*(b-a)+a;}
function randInt(a,b){return Math.floor(rand(a,b+1));}

// ── NOTEBOOK BACKGROUND (paper + lines only) ──
function drawNotebookBackground(ctx, W, H) {
  ctx.fillStyle = '#FEFDF4';
  ctx.fillRect(0, 0, W, H);

  const lineSpacing = Math.max(22, H / 27);
  ctx.strokeStyle = 'rgba(100, 149, 237, 0.22)';
  ctx.lineWidth = 1;
  for (let y = lineSpacing; y < H; y += lineSpacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const margin = Math.max(48, W * 0.07);
  ctx.strokeStyle = 'rgba(220, 70, 70, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(margin, 0); ctx.lineTo(margin, H); ctx.stroke();

  ctx.strokeStyle = 'rgba(0,0,0,0.025)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 18; i++) {
    const lx = ((i * 173) % (W - 60)) + 30;
    const ly = ((i * 53)  % (H - 20)) + 10;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 28, ly); ctx.stroke();
  }
}

// ── NOTEBOOK BINDING (drawn above scene, below characters) ──
function drawNotebookBinding(ctx, W, H) {
  const margin  = Math.max(48, W * 0.07);
  const spiralX = margin * 0.38;
  const coilR   = Math.max(5, margin * 0.13);
  const numCoils = Math.floor(H / (coilR * 4.2));
  ctx.strokeStyle = 'rgba(90, 90, 90, 0.38)';
  ctx.lineWidth = 2.2;
  for (let i = 0; i < numCoils; i++) {
    const cy = (i + 0.5) * (H / numCoils);
    ctx.beginPath();
    ctx.arc(spiralX, cy, coilR, -Math.PI * 0.25, Math.PI * 1.25);
    ctx.stroke();
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

const EMOTIONS={
  night:   {words:['밤','별','달','야간','야밤'],label:'밤하늘',color:'#9B8FE8'},
  rain:    {words:['비','우산','비가','빗','장마'],label:'비 오는 날',color:'#7AAAD4'},
  love:    {words:['사랑','설레','좋아','보고 싶','그리'],label:'사랑',color:'#FF88BB'},
  happy:   {words:['행복','웃었','좋았','즐거','기분 좋','최고','신났','재밌','기쁘'],label:'행복',color:'#F5C842'},
  sad:     {words:['힘들','슬프','슬펐','속상','눈물','마음이 아','우울','지쳤'],label:'슬픔',color:'#6AAAD8'},
  angry:   {words:['화났','짜증','열받','화가','억울','분해'],label:'화남',color:'#F87171'},
  peaceful:{words:['평화','조용','평온','여유','한가','잔잔'],label:'평온',color:'#6EE7B7'},
  excited: {words:['두근','설렘','기대','흥분','떨렸','떨려'],label:'설렘',color:'#C084FC'},
  lonely:  {words:['혼자','외로','쓸쓸','쓸'],label:'외로움',color:'#94A3B8'},
};
const ACTIONS={
  throw: ['던졌','던지','던','투척'],
  hug:   ['안았','안아','포옹','껴안','안고','안겨','품에'],
  kiss:  ['키스','뽀뽀','입맞'],
  cry:   ['울었','울어','눈물','흐느','흑흑','ㅠㅠ','ㅜㅜ','울고','울음','울','서럽','힘들었','힘들어','슬펐','슬퍼'],
  laugh: ['웃었','웃어','ㅋㅋ','ㅎㅎ','하하','히히','웃음','낄낄','빵','크크','웃','재밌었','재미있었','즐거웠','신났','신나'],
  eat:   ['먹었','먹어','먹고','먹음','먹','식사','점심','저녁','아침','밥을','밥 먹','음식','라면','치킨','피자','햄버거','삼겹','떡볶','분식','간식','맛집','배달','드셨'],
  drink: ['마셨','마셔','마시고','마심','커피','음료','물을','술을','음주','차를','카페라테','아메리카노'],
  game:  ['게임','롤','스팀','닌텐도','피씨방','피방','pc방','플스','오버워치','마인크래프트','배그'],
  sleep: ['잤','잠을','자고','졸려','누웠','침대','피곤','꿈을','잠자','취침','낮잠','자버렸','늦잠','피곤했'],
  walk:  ['걸었','걸어','걷고','산책','걷기','걸어서','걸음','보행','갔다','갔어','갔음','왔다','왔어','왔음','나갔','나왔','다녀왔','외출','나가','나와'],
  run:   ['뛰었','뛰어','달렸','달리','조깅','뛰고','뛰어가','달려'],
  work:  ['공부','일했','일해','과제','숙제','업무','시험','야근','리포트','보고서','일하고','공부했','공부하','코딩'],
  talk:  ['얘기','말했','대화','통화','카톡','문자','말을','수다','채팅','전화했','이야기','만났','만나서','만나'],
  wave:  ['인사','안녕','반가','손을 흔','배웅','인사했'],
  sit:   ['앉았','앉아','앉고','쉬었','쉬어','휴식','쉬고','앉아서'],
  cook:  ['요리','만들었','끓였','볶았','구웠','조리','만들어','요리했','해먹'],
  shop:  ['쇼핑','샀다','샀어','구매','마트','편의점','백화점','사고','구입','장봤','장을'],
  dance: ['춤','댄스','춤을','댄싱','들썩','노래방'],
  swim:  ['수영','물놀이','수영장'],
  climb: ['등산','올랐','등반','트레킹','오르고','산에 올'],
  jump:  ['점프','뛰어올','뛰어내','깡충'],
};
const LOCATION_ACTION_DEFAULT = {
  cafe:'drink', home:'sit', school:'work', pcroom:'game',
  sea:'walk', mountain:'climb', store:'shop', office:'work',
  outside:'walk', snow:'walk',
};
const PROP_DETECT={
  snowball:['눈'], ball:['공','축구','농구'], phone:['폰','핸드폰','스마트폰','전화'],
  game:['게임','닌텐도','조이스틱'], book:['책','교재','소설','만화'],
  coffee:['커피','카페라테','아메리카','라떼'], food:['밥','음식','라면','치킨','피자','떡볶'],
  bag:['가방','백팩','쇼핑백'], money:['돈','용돈','지갑'],
  music:['노래','음악','이어폰','헤드폰'], umbrella:['우산'],
};
const LOCATIONS={
  snow:   ['눈이 오','눈밭','눈 오','설원','눈이'],
  pcroom: ['피방','pc방','피씨방','게임방'],
  cafe:   ['카페','커피숍','스타벅스'],
  home:   ['집에','집에서','방에서','방에','자취방','거실'],
  outside:['밖에','공원','거리','길가','야외'],
  sea:    ['바다','해변','해수욕','해안'],
  mountain:['등산','산에','산길','산을'],
  school: ['학교','교실','강의실','도서관','캠퍼스','수업','학원'],
  store:  ['마트','편의점','백화점','쇼핑몰','시장'],
  office: ['회사','사무실','직장','오피스'],
};
function detectEmotion(text){let b='neutral',s=0;for(const[e,d]of Object.entries(EMOTIONS)){const c=d.words.filter(w=>text.includes(w)).length;if(c>s){s=c;b=e;}}return b;}
function emotionLabel(e){return EMOTIONS[e]?.label||'하루';}
function emotionColor(e){return EMOTIONS[e]?.color||'#A1A1AA';}
function detectProps(text){const p=[];for(const[pr,ws]of Object.entries(PROP_DETECT)){if(ws.some(w=>text.includes(w)))p.push(pr);}return p;}
function detectAction(text,location){for(const[a,ws]of Object.entries(ACTIONS)){if(ws.some(w=>text.includes(w)))return a;}return LOCATION_ACTION_DEFAULT[location]||'idle';}
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
    const emo=detectEmotion(s); const loc=detectLocation(s); return{text:s,emotion:emo,action:detectAction(s,loc),location:loc,props:detectProps(s),charCount:charCounts[i],time_of_day:emo==='night'?'night':'afternoon',intensity:.5,weather:emo==='rain'?'rain':'clear'};
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
    S_GLOBAL = S;

    // 1. Notebook paper (lines + margin — no spiral yet)
    drawNotebookBackground(ctx, W, H);

    // 2. Location background + time overlay (with cross-fade)
    ctx.save();
    if(isFading){
      const prev=scenes[currentIdx-1];
      ctx.globalAlpha=1-fadeAlpha;
      drawLocationBackground(ctx,W,H,GY,S,prev.location,elapsed);
      drawTimeOverlay(ctx,W,H,prev.time_of_day,elapsed);
      ctx.globalAlpha=fadeAlpha;
    }
    drawLocationBackground(ctx,W,H,GY,S,scene.location,elapsed);
    drawTimeOverlay(ctx,W,H,scene.time_of_day,elapsed);
    ctx.restore();

    // 3. Spiral binding (sits on top of scene background)
    drawNotebookBinding(ctx, W, H);

    // 4. Props (with cross-fade)
    ctx.save();
    if(isFading){
      const prev=scenes[currentIdx-1];
      ctx.globalAlpha=1-fadeAlpha;
      drawProps(ctx,W,H,GY,S,prev.props,charStates,artStyle,elapsed,prev.location);
      ctx.globalAlpha=fadeAlpha;
    }
    drawProps(ctx,W,H,GY,S,scene.props,charStates,artStyle,elapsed,scene.location);
    ctx.restore();

    // 5. Characters
    for(let i=0;i<charStates.length;i++){
      const ch=charStates[i]; ctx.save(); ctx.globalAlpha=ch.opacity;
      drawCharacter(ctx,ch.x,ch.y,S,scene.action,scene.emotion,localT,ch.facing,null,artStyle,i,scene.intensity??.5);
      ctx.restore();
    }

    // 6. Weather (on top of characters)
    drawWeatherEffect(ctx,W,H,scene.weather,elapsed);

    // 7. Top-left page title
    ctx.save();
    const margin = Math.max(48, W * 0.07);
    const titleX = margin + W * 0.03;
    const titleY = H * 0.07;
    ctx.font = `bold ${Math.round(S * 0.7)}px 'Noto Serif KR', serif`;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(50, 40, 80, 0.75)';
    ctx.fillText('오늘의 일기', titleX, titleY);
    ctx.restore();

    // 8. Thin border
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 8; ctx.strokeRect(0,0,W,H);

    state.animFrame=requestAnimationFrame(render);
  }
  
  if(scenes.length>0 && captionContainer){
    const cap=document.createElement('div'); cap.className='caption-box'; cap.textContent=scenes[0].text;
    captionContainer.appendChild(cap); state.activeCaption=cap;
  }
  state.animFrame=requestAnimationFrame(render);
}
