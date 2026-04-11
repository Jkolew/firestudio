// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE (V3 - UNIVERSAL & AI READY)
// ═══════════════════════════════════════════════════════

function rand(a,b){return Math.random()*(b-a)+a;}
function randInt(a,b){return Math.floor(rand(a,b+1));}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

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

// ═══ ACTION & PROP & LOCATION (EXPANDED) ═══
const ACTIONS={
  throw:  ['던졌','눈싸움','공놀이','눈뭉치','던지며','눈을 던'],
  hug:    ['안았','안겨','안아줬','껴안','포옹'],
  kiss:   ['키스','입맞','뽀뽀'],
  cry:    ['울었','눈물','울었다','울다','흘렸','흑흑','훌쩍'],
  laugh:  ['웃었','웃음','웃었다','크게 웃','하하','깔깔','재밌'],
  eat:    ['먹었','밥','식사','점심','저녁','아침','냠냠','맛집'],
  drink:  ['마셨','커피','음료','티타임','한 잔'],
  game:   ['게임','롤','배그','피씨방','pc방','피방','발로','옵치'],
  sleep:  ['잤다','잠들','졸렸','누웠','낮잠','꿈나라'],
  walk:   ['걸었','산책','걷기','나갔다','나왔다','등교','하교'],
  run:    ['뛰었','달렸','뛰어갔','조깅','질주'],
  work:   ['공부','일했','작업','숙제','코딩','열일'],
  talk:   ['말했','얘기','대화','수다','통화'],
  wave:   ['인사','안녕','흔들'],
  sit:    ['앉았','대기','멍때'],
};

const PROP_DETECT={
  snowball: ['눈싸움','눈덩이','눈뭉치','함박눈'],
  ball:     ['공을','축구','농구','야구'],
  phone:    ['폰','핸드폰','카톡','인스타'],
  game:     ['게임','롤','배그','피방'],
  book:     ['책','독서','공부'],
  coffee:   ['커피','아메리카노','라떼','차를'],
  food:     ['밥','음식','피자','치킨','라면'],
};

const LOCATIONS={
  snow:   ['눈싸움','겨울','눈이','함박눈','스키장','추운'],
  pcroom: ['피씨방','pc방','피방','게임방'],
  cafe:   ['카페','커피숍','스벅'],
  home:   ['집','방','침대','거실'],
  outside:['밖','공원','길','거리','야외'],
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

function startSceneSequence(canvas,text,artStyle,dateStr){
  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  const GY=H*0.75, S=H*0.08;
  const sentences=parseSentences(text);
  const charCounts=buildCumulativeCharCounts(sentences);
  const emotion=detectEmotion(text);

  const scenes=sentences.map((s,i)=>({
    text:s, emotion, action:detectAction(s),
    location:detectLocation(s), props:detectProps(s),
    charCount:charCounts[i]
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
    // Background
    ctx.fillStyle=PALETTES.anime.paper; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle=PALETTES.anime.groundLine; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,GY); ctx.lineTo(W,GY); ctx.stroke();

    // Environment & Props
    const ssChars=Array.from({length:scene.charCount},(_,i)=>({
      x:W/2+(i-(scene.charCount-1)/2)*S*2.5, y:GY, arrived:true, facing:1
    }));
    
    drawProps(ctx,W,H,GY,S,scene.props,ssChars,artStyle,localT,scene.location);

    // Characters
    scenes[sceneIdx].chars=ssChars;
    for(let i=0; i<ssChars.length; i++){
      const ch=ssChars[i];
      drawCharacter(ctx,ch.x,ch.y,S,scene.action,scene.emotion,localT,ch.facing,null,artStyle,i);
    }

    // Text Overlay
    ctx.save(); ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.font='20px Noto Serif KR'; ctx.textAlign='center';
    ctx.fillText(scene.text, W/2, H*0.15); ctx.restore();

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
