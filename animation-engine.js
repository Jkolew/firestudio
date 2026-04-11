// ═══════════════════════════════════════════════════════
//  ANIMATION ENGINE
//  Separated from index.html for maintainability
//  Depends on: draw-character.js (loaded after this)
// ═══════════════════════════════════════════════════════

// ── MATH UTILS ──
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

// ═══ ACTION DETECTION ═══
const ACTIONS={
  hug:    ['안았','안겨','안아줬','껴안'],
  kiss:   ['키스','입맞'],
  cry:    ['울었','눈물','울었다','울다','흘렸','흑흑','훌쩍','눈물이'],
  laugh:  ['웃었','웃음','웃었다','크게 웃','하하','깔깔','뿜었'],
  write:  ['일기를','일기 썼','일기 씀','적었다','써봤','기록했','메모했','노트에','노트를 씀'],
  read:   ['읽었다','독서했','책 읽','읽다가','읽으며','읽고 있'],
  drink:  ['마셨다','커피를 마','음료를 마','한 모금','홀짝'],
  think:  ['생각했','고민했','떠올렸','상상했','생각해봤','고민해봤','머릿속'],
  stretch:['기지개','스트레칭','일어났다','깼다','눈을 떴'],
  game:   ['게임했다','게임을 했','롤을 했','배그를','피씨방','pc방에','게임 켰'],
  eat:    ['먹었','밥 먹','식사했','점심 먹','저녁 먹','아침 먹','라면','피자','치킨','초밥','국밥'],
  sleep:  ['잤다','잠들','잠이','졸렸','누웠','낮잠'],
  walk:   ['걸었','산책했','걷다가','나갔다','나왔다','걸어갔'],
  run:    ['뛰었','달렸','뛰어갔','달려갔'],
  work:   ['공부했','일했','작업했','공부 중','숙제했','코딩했'],
  talk:   ['말했','얘기했','대화했','이야기했','통화했','물었다'],
  wave:   ['인사했','손 흔들','손을 흔들'],
  dance:  ['춤췄','댄스했','춤을 췄'],
  look:   ['봤다','바라봤','쳐다봤','올려다봤','드라마를','영화를','티비를'],
  sit:    ['앉았다','앉아서','앉아있','앉아 있'],
  jump:   ['뛰어올랐','점프했','점프를'],
};
// ═══ PROP DETECTION ═══
const PROP_DETECT={
  phone:    ['핸드폰','스마트폰','폰을','폰이','폰으로','폰 보','카톡','문자를','셀카','사진 찍'],
  game:     ['게임','롤','배그','피씨방','pc방','플스','닌텐도','스팀','마크','오버워치'],
  computer: ['컴퓨터','노트북','피씨','작업 중','코딩'],
  book:     ['책을','책이','독서','읽었','교과서','노트를','필기했','공부했'],
  coffee:   ['커피','아메리카노','라떼','카페라','아이스티','따뜻한 음료'],
  food:     ['밥을','밥이','음식','먹었','점심','저녁','아침','라면','피자','치킨','초밥','국밥'],
  music:    ['음악','노래를','이어폰','헤드폰','듣고','플레이리스트','멜론','스포티파이'],
  tv:       ['티비','tv를','드라마','영화를','유튜브','넷플릭스'],
  bag:      ['가방','책가방','배낭','들고 나','챙겼'],
  flower:   ['꽃을','꽃이','장미','꽃다발','꽃 사','꽃받았'],
  ball:     ['공을','축구','농구','배구','야구','운동장에서'],
  headphones:['이어폰을','헤드폰을','에어팟','음악 들'],
};
function detectProps(text){
  const lower=text.toLowerCase();
  const props=[];
  for(const[prop,words]of Object.entries(PROP_DETECT)){
    if(words.some(w=>lower.includes(w))) props.push(prop);
  }
  return props;
}

function detectAction(text){
  for(const[action,words]of Object.entries(ACTIONS)){
    if(words.some(w=>text.includes(w))) return action==='sleep2'?'sleep':action;
  }
  return 'idle';
}

// ═══ LOCATION DETECTION ═══
const LOCATIONS={
  home:   ['집','방','침대','소파','거실','베란다'],
  school: ['학교','교실','도서관','캠퍼스','수업','강의'],
  outside:['밖','공원','길','거리','야외','산책로','운동장'],
  cafe:   ['카페','커피숍','스타벅스','이디야','투썸'],
  work:   ['회사','사무실','직장'],
  pcroom: ['피씨방','pc방','피방','게임방'],
  night:  ['밤','새벽','야밤'],
  rain:   ['비','우산','비가'],
};
function detectLocation(text){
  for(const[loc,words]of Object.entries(LOCATIONS)){
    if(words.some(w=>text.includes(w))) return loc;
  }
  return null;
}

// ═══ CHARACTER COUNT ═══
const PERSON_WORDS=['친구','가족','엄마','아빠','형','오빠','언니','누나','동생',
  '남자친구','여자친구','남친','여친','선배','후배','동료','선생님','교수님','그녀','상대방'];
function countCharacters(text){
  let n=1;
  for(const w of PERSON_WORDS){if(text.includes(w)){n=Math.min(n+1,3);break;}}
  if(text.includes('우리')&&text.length>15) n=Math.min(n+1,3);
  return n;
}

// ═══ CUMULATIVE CHARACTER COUNT ═══
const MEET_WORDS=['만났','왔다','왔어','왔음','나타났','합류','같이 왔','데려','오더니','놀러왔','찾아왔'];
const ALONE_WORDS=['혼자','나만','나 혼자','집에 왔','집에 돌아','혼자서','각자','헤어졌','혼자였'];
function buildCumulativeCharCounts(sentences){
  let count=1;
  return sentences.map(s=>{
    if(ALONE_WORDS.some(w=>s.includes(w))){count=1;return count;}
    const hasPerson=PERSON_WORDS.some(w=>s.includes(w));
    if(hasPerson&&count<4) count=Math.min(count+1,4);
    return count;
  });
}

// ═══ SENTENCE PARSING ═══
function parseSentences(text){
  let raw=text
    .replace(/([.!?！？。])\s*/g,'$1\n')
    .split('\n')
    .map(s=>s.trim())
    .filter(s=>s.length>1);
  if(raw.length===1&&raw[0].length>40){
    raw=raw[0].split(/(?<=[다요았었겠네죠])\s+(?=\S)/)
      .map(s=>s.trim()).filter(s=>s.length>1);
  }
  return raw.length>0?raw:[text.trim()];
}

// ═══════════════════════════════════════════════════════
//  SCENE SEQUENCE ENGINE
// ═══════════════════════════════════════════════════════

const PALETTES={
  anime:  {char1:'#FFD0BC',char2:'#FFB898',char3:'#EC9872',accent:'#FF8FAD',outline:'rgba(68,36,16,0.58)',paper:'#FFFBF0',ground:'#EED8C2',groundLine:'rgba(162,128,98,0.40)'},
  comic:  {char1:'#FFE066',char2:'#FFBC42',char3:'#E8960A',accent:'#FF6B6B',outline:'rgba(100,60,0,0.38)',paper:'#FFFBEE',ground:'#F0E8C8',groundLine:'rgba(190,160,80,0.28)'},
  minimal:{char1:'#E0D4FF',char2:'#C4B0FF',char3:'#A08BE8',accent:'#B8E0FF',outline:'rgba(90,60,150,0.28)',paper:'#F8F5FF',ground:'#EDE8F5',groundLine:'rgba(150,130,190,0.22)'},
  sketch: {char1:'#C8E6FF',char2:'#9ACBF0',char3:'#68AADC',accent:'#A8E6CF',outline:'rgba(40,80,130,0.30)',paper:'#F4FAFF',ground:'#E4EEF5',groundLine:'rgba(80,130,175,0.22)'},
  warm:   {char1:'#FFDDC1',char2:'#FFB999',char3:'#E88870',accent:'#F9D56E',outline:'rgba(150,80,40,0.3)',paper:'#FFF8EE',ground:'#F0E8D4',groundLine:'rgba(185,155,105,0.25)'},
  cool:   {char1:'#C8E6FF',char2:'#A0C8F0',char3:'#78A8D8',accent:'#88CCEE',outline:'rgba(40,80,140,0.3)',paper:'#F0F8FF',ground:'#E0EEF5',groundLine:'rgba(80,120,170,0.22)'},
  night:  {char1:'#D4C8FF',char2:'#B0A0E8',char3:'#8878C8',accent:'#9B8FE8',outline:'rgba(60,40,100,0.3)',paper:'#F0EEFF',ground:'#E8E0F8',groundLine:'rgba(110,90,165,0.22)'},
};

function startSceneSequence(canvas, text, style, date){
  const ctx=canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  const GY=H*0.68;
  const S=Math.min(W,H)*0.092;
  const pal=PALETTES[style]||PALETTES.anime;

  const sentences=parseSentences(text);
  const cumCounts=buildCumulativeCharCounts(sentences);
  const scenes=sentences.map((sentence,i)=>({
    text:sentence,
    emotion:detectEmotion(sentence),
    action:detectAction(sentence),
    charCount:cumCounts[i],
    location:detectLocation(sentence),
    props:detectProps(sentence),
    duration:clamp(sentence.length/8, 3.5, 7),
  }));

  function makeSceneState(scene){
    const n=scene.charCount;
    const close=['hug','kiss','talk','love'].includes(scene.action)||scene.emotion==='love';
    const targets=n===1
      ?[{x:W*.5,facing:1}]
      :n===2
        ?[{x:W*(close?.41:.36),facing:1},{x:W*(close?.59:.64),facing:-1}]
        :[{x:W*.28,facing:1},{x:W*.5,facing:1},{x:W*.72,facing:-1}];

    const chars=targets.map((tgt,i)=>({
      x:i%2===0?-S*4:W+S*4,
      y:GY, targetX:tgt.x, facing:tgt.facing,
      secondary:i>0, tertiary:i>1, arrived:false,
    }));
    const e=scene.emotion, loc=scene.location;
    return {
      chars, particles:[],
      rainDrops:(['sad','rain'].includes(e)||loc==='rain')
        ?Array.from({length:160},()=>({x:rand(0,W),y:rand(-H,H),spd:rand(7,16),len:rand(10,24)})):[],
      stars:(['night','lonely'].includes(e)||loc==='night')
        ?Array.from({length:220},()=>({x:rand(0,W),y:rand(0,GY*.92),r:rand(.4,2),ph:rand(0,Math.PI*2),a:rand(.2,1)})):[],
      localT:0,
    };
  }

  const sceneStates=scenes.map(sc=>makeSceneState(sc));
  let sceneIdx=0, sceneT=0, fadeAlpha=0, fading=false;
  let lastTime=performance.now();

  function spawnParticle(ps, cx, cy, emotion, action){
    if(emotion==='love'||action==='hug'||action==='kiss')
      ps.push({x:cx+rand(-30,30),y:cy,vx:rand(-.4,.4),vy:rand(-.8,-2.2),type:'heart',sz:rand(7,18),alpha:1,color:Math.random()<.5?'#FF88BB':'#FFB3D4'});
    else if(['happy','excited'].includes(emotion)||['laugh','dance'].includes(action)){
      const col=`hsl(${randInt(0,360)},80%,70%)`;
      ps.push({x:cx+rand(-55,55),y:cy+rand(-20,10),vx:rand(-1.8,1.8),vy:rand(-1.5,-3.5),type:'circle',sz:rand(4,10),alpha:1,color:col});
      if(Math.random()<.4) ps.push({x:cx+rand(-35,35),y:cy,vx:rand(-1,1),vy:rand(-2,-4),type:'star',sz:rand(6,12),alpha:1,color:col});
    } else if(emotion==='angry'){
      ps.push({x:cx+rand(-25,25),y:cy,vx:rand(-2.5,2.5),vy:rand(-3,-1),type:'spark',sz:rand(3,7),alpha:1,color:Math.random()<.5?'#FF4422':'#FF8822'});
    } else if(['sad','lonely'].includes(emotion)||action==='cry'){
      ps.push({x:cx+rand(-5,5),y:cy+rand(0,10),vx:rand(-.2,.2),vy:rand(1,2.5),type:'tear',sz:rand(3,7),alpha:.85,color:'#6AAAD8'});
    } else if(emotion==='peaceful'){
      ps.push({x:cx+rand(-70,70),y:cy,vx:rand(-.3,.3),vy:rand(-.5,-1.4),type:'leaf',sz:rand(5,9),alpha:.7,color:Math.random()<.5?'#86EFAC':'#FCA5A5'});
    } else if(emotion==='night'){
      ps.push({x:cx+rand(-80,80),y:cy-rand(10,50),vx:rand(-.15,.15),vy:rand(-.3,-.8),type:'star',sz:rand(3,7),alpha:.6,color:'#D4C8FF'});
    } else if(action==='music'||action==='dance'){
      ps.push({x:cx+rand(-40,40),y:cy,vx:rand(-.8,.8),vy:rand(-1.5,-3),type:'note',sz:rand(10,18),alpha:1,color:'#F9D56E'});
    }
  }

  function resetSceneChars(idx){
    const scene=scenes[idx];
    const n=scene.charCount;
    const close=['hug','kiss','talk','love'].includes(scene.action)||scene.emotion==='love';
    const targets=n===1
      ?[{x:W*.5,facing:1}]
      :n===2
        ?[{x:W*(close?.41:.36),facing:1},{x:W*(close?.59:.64),facing:-1}]
        :[{x:W*.28,facing:1},{x:W*.5,facing:1},{x:W*.72,facing:-1}];
    const ss=sceneStates[idx];
    // Rebuild chars array to match new charCount
    ss.chars=targets.map((tgt,i)=>({
      x:i%2===0?-S*4:W+S*4,
      y:GY, targetX:tgt.x, facing:tgt.facing,
      secondary:i>0, tertiary:i>1, arrived:false,
    }));
    ss.localT=0;
    ss.particles=[];
    // Refresh rain/stars
    const e=scene.emotion, loc=scene.location;
    ss.rainDrops=(['sad','rain'].includes(e)||loc==='rain')
      ?Array.from({length:160},()=>({x:rand(0,W),y:rand(-H,H),spd:rand(7,16),len:rand(10,24)})):[];
    ss.stars=(['night','lonely'].includes(e)||loc==='night')
      ?Array.from({length:220},()=>({x:rand(0,W),y:rand(0,GY*.92),r:rand(.4,2),ph:rand(0,Math.PI*2),a:rand(.2,1)})):[];
  }

  function frame(now){
    const raf=requestAnimationFrame(frame);
    if(typeof state!=='undefined') state.animFrame=raf;
    const dt=clamp((now-lastTime)/1000,.001,.05);
    lastTime=now;
    const scene=scenes[sceneIdx];
    const ss=sceneStates[sceneIdx];

    if(!fading){
      sceneT+=dt; ss.localT+=dt;
      if(sceneT>=scene.duration){fading=true;fadeAlpha=0;}
    }

    // Diary paper background
    drawDiaryBackground(ctx,W,H,scene.emotion,pal);
    drawEnvironment(ctx,W,H,GY,scene,pal,ss,ss.localT);
    drawDiaryTitle(ctx,W,date,style,emotionLabel(scene.emotion));

    // Move characters
    let allArrived=true;
    for(const ch of ss.chars){
      if(!ch.arrived){
        const spd=S*.12;
        ch.x=ch.x<ch.targetX?Math.min(ch.x+spd,ch.targetX):Math.max(ch.x-spd,ch.targetX);
        if(Math.abs(ch.x-ch.targetX)<1){ch.x=ch.targetX;ch.arrived=true;}
        else allArrived=false;
      }
    }

    // Spawn particles every ~5 frames once chars arrived
    if(allArrived&&ss.localT>0.5){
      const spawnInterval=0.1;
      if(Math.floor(ss.localT/spawnInterval)>Math.floor((ss.localT-dt)/spawnInterval)){
        for(const ch of ss.chars)
          spawnParticle(ss.particles,ch.x,ch.y-S*3.0,scene.emotion,scene.action);
      }
    }

    // Auto-add headphones for Character C in PC room scene
    const autoProps=[...(scene.props||[])];
    if(scene.location==='pcroom'&&!autoProps.includes('headphones')) autoProps.push('headphones');
    // Draw props (before characters so chars appear on top)
    drawProps(ctx,W,H,GY,S,autoProps,ss.chars,style,ss.localT);

    // Draw characters
    const action=allArrived?scene.action:'walk';
    for(let i=ss.chars.length-1;i>=0;i--){
      const ch=ss.chars[i];
      const color=ch.tertiary?pal.char3:ch.secondary?pal.char2:pal.char1;
      drawCharacter(ctx,ch.x,ch.y,S,action,scene.emotion,ss.localT,ch.facing,color,style,i);
    }

    // Motion speed lines for run action (manhwa dynamic effect)
    if(action==='run'&&allArrived){
      ctx.save();ctx.globalAlpha=0.18;ctx.strokeStyle='rgba(180,160,130,0.7)';ctx.lineWidth=1.5;ctx.lineCap='round';
      for(const ch of ss.chars){
        for(let i=0;i<6;i++){
          const lx=ch.x-S*(1.2+i*.4),ly=ch.y-S*(0.5+i*.22);
          ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx-S*(0.9+i*.2),ly);ctx.stroke();
        }
      }
      ctx.restore();
    }

    // Hug connecting arm
    if(action==='hug'&&ss.chars.length>=2&&allArrived){
      ctx.save();ctx.strokeStyle=pal.char1;ctx.lineWidth=S*.14;ctx.lineCap='round';ctx.globalAlpha=.65;
      const c1=ss.chars[0],c2=ss.chars[1];
      ctx.beginPath();
      ctx.moveTo(c1.x+S*.8,c1.y-S*1.5);
      ctx.bezierCurveTo(c1.x+S*1.5,c1.y-S*2.0,c2.x-S*1.5,c2.y-S*2.0,c2.x-S*.8,c2.y-S*1.5);
      ctx.stroke();ctx.restore();
    }

    // Update & draw particles
    updateAndDrawParticles(ctx,ss.particles,dt);

    // Subtitle + progress
    drawSubtitle(ctx,W,H,scene.text,ss.localT,scene.duration);
    drawProgress(ctx,W,sceneIdx,scenes.length);

    // Overlays
    warmGrain(ctx,W,H);
    warmVignette(ctx,W,H);

    // Transition fade (warm paper)
    if(fading){
      fadeAlpha+=dt*2.8;
      ctx.save();ctx.globalAlpha=clamp(fadeAlpha,0,1);ctx.fillStyle=pal.paper||'#FFF8EE';ctx.fillRect(0,0,W,H);ctx.restore();
      if(fadeAlpha>=1){
        sceneIdx=(sceneIdx+1)%scenes.length;
        sceneT=0;fading=false;fadeAlpha=0;
        resetSceneChars(sceneIdx);
      }
    }
  }
  requestAnimationFrame(frame);
}

// ── SUBTITLE ──
function drawSubtitle(ctx,W,H,text,localT,duration){
  const fadeIn=clamp(localT*3,0,1);
  const fadeOut=localT>duration-.8?clamp((duration-localT)/.8,0,1):1;
  const alpha=fadeIn*fadeOut;
  if(alpha<.01)return;
  const maxW=W*.72;
  ctx.save();
  ctx.font="300 17px 'Noto Serif KR',serif";
  ctx.textAlign='center';
  const lines=[];let line='';
  for(const ch of text){
    const test=line+ch;
    if(ctx.measureText(test).width>maxW){lines.push(line);line=ch;}
    else line=test;
  }
  if(line)lines.push(line);
  const lineH=28,pad=16;
  const totalH=lines.length*lineH+pad*2;
  const boxY=H*.88-totalH;
  const tw=Math.max(...lines.map(l=>ctx.measureText(l).width))+44;
  // Diary paper card
  ctx.save();ctx.globalAlpha=alpha*.92;
  ctx.shadowColor='rgba(180,140,80,0.15)';ctx.shadowBlur=14;ctx.shadowOffsetY=3;
  ctx.fillStyle='rgba(255,250,238,0.93)';
  roundRect(ctx,W/2-tw/2,boxY,tw,totalH,12);ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle='rgba(200,170,130,0.3)';ctx.lineWidth=1.5;
  roundRect(ctx,W/2-tw/2,boxY,tw,totalH,12);ctx.stroke();
  ctx.restore();
  // Warm text
  ctx.fillStyle=`rgba(100,68,48,${alpha*.88})`;
  lines.forEach((l,i)=>ctx.fillText(l,W/2,boxY+pad+lineH*.85+i*lineH));
  ctx.restore();
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
}

// ── PROGRESS DOTS ──
function drawProgress(ctx,W,idx,total){
  if(total<=1)return;
  const dotR=3,gap=10,totalW=(total-1)*gap+total*dotR*2;
  const startX=W/2-totalW/2+dotR,y=28;
  for(let i=0;i<total;i++){
    ctx.save();ctx.globalAlpha=i===idx?.9:.28;ctx.fillStyle=i===idx?'#FFF':'#AAA';
    ctx.beginPath();ctx.arc(startX+i*(dotR*2+gap),y,dotR,0,Math.PI*2);ctx.fill();ctx.restore();
  }
}

// ── PARTICLES ──
function updateAndDrawParticles(ctx,particles,dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;p.y+=p.vy;p.alpha-=.011;
    if(p.type==='leaf'){p.x+=Math.sin(p.y*.04)*0.4;p.vy+=0.018;}
    if(p.alpha<=0){particles.splice(i,1);continue;}
    ctx.save();ctx.globalAlpha=p.alpha;ctx.shadowBlur=6;ctx.shadowColor=p.color;ctx.fillStyle=p.color;
    if(p.type==='heart'){drawHeart(ctx,p.x,p.y,p.sz);}
    else if(p.type==='spark'){
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*4,p.y-p.vy*4);
      ctx.strokeStyle=p.color;ctx.lineWidth=2;ctx.stroke();
    } else if(p.type==='star'){
      ctx.translate(p.x,p.y);
      for(let s=0;s<5;s++){const a=s/5*Math.PI*2-Math.PI/2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*p.sz*.5,Math.sin(a)*p.sz*.5);ctx.strokeStyle=p.color;ctx.lineWidth=1.5;ctx.stroke();}
      ctx.beginPath();ctx.arc(0,0,p.sz*.25,0,Math.PI*2);ctx.fill();
    } else if(p.type==='leaf'){
      ctx.translate(p.x,p.y);ctx.rotate(p.y*.05);
      ctx.beginPath();ctx.ellipse(0,0,p.sz*.5,p.sz*.3,Math.sin(p.y*.08),0,Math.PI*2);ctx.fill();
    } else if(p.type==='note'){
      ctx.font=`bold ${p.sz}px serif`;ctx.textAlign='center';ctx.fillText(Math.random()<.5?'♪':'♫',p.x,p.y);
    } else {
      ctx.beginPath();ctx.arc(p.x,p.y,p.sz/2,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
}
function drawHeart(ctx,x,y,s){
  ctx.save();ctx.translate(x,y);ctx.beginPath();
  ctx.moveTo(0,-s*.15);ctx.bezierCurveTo(0,-s*.5,s*.7,-s*.5,s*.7,0);
  ctx.bezierCurveTo(s*.7,s*.4,0,s*.9,0,s);ctx.bezierCurveTo(0,s*.9,-s*.7,s*.4,-s*.7,0);
  ctx.bezierCurveTo(-s*.7,-s*.5,0,-s*.5,0,-s*.15);ctx.fill();ctx.restore();
}

// ═══════════════════════════════════════════════════════
//  WATERCOLOR DIARY VISUAL SYSTEM
// ═══════════════════════════════════════════════════════
function hexToRgb(hex){
  try{const h=hex.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
  catch{return[200,180,160];}
}
function liftColor(hex,amt){
  const[r,g,b]=hexToRgb(hex);
  return `rgb(${Math.min(255,(r+amt*255)|0)},${Math.min(255,(g+amt*255)|0)},${Math.min(255,(b+amt*255)|0)})`;
}

// ── DIARY PAPER BACKGROUND ──
function drawDiaryBackground(ctx,W,H,emotion,pal){
  ctx.fillStyle=pal.paper||'#FFF8EE';
  ctx.fillRect(0,0,W,H);
  // Emotion watercolor wash
  const washes={
    happy:'rgba(255,220,80,0.06)',sad:'rgba(100,150,220,0.07)',love:'rgba(255,130,160,0.07)',
    peaceful:'rgba(100,220,150,0.06)',angry:'rgba(255,100,80,0.05)',excited:'rgba(200,100,255,0.06)',
    night:'rgba(120,100,200,0.07)',lonely:'rgba(150,160,180,0.05)',rain:'rgba(80,140,210,0.07)',
  };
  ctx.fillStyle=washes[emotion]||'rgba(200,180,150,0.04)';
  ctx.fillRect(0,0,W,H);
  // Diary horizontal lines
  ctx.save();
  ctx.strokeStyle=pal.groundLine||'rgba(180,155,120,0.22)';
  ctx.lineWidth=1;
  const lg=Math.max(24,Math.round(H/20));
  for(let y=lg*2.5;y<H-10;y+=lg){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // Left margin
  ctx.strokeStyle='rgba(220,160,155,0.18)';
  ctx.beginPath();ctx.moveTo(54,0);ctx.lineTo(54,H);ctx.stroke();
  ctx.restore();
  // Paper grain
  ctx.save();ctx.globalAlpha=0.022;
  for(let i=0;i<900;i++){const v=randInt(140,215);ctx.fillStyle=`rgb(${v},${Math.max(0,v-12)},${Math.max(0,v-28)})`;ctx.fillRect(rand(0,W),rand(0,H),1.3,1.3);}
  ctx.restore();
}

// ── DIARY TITLE ──
function drawDiaryTitle(ctx,W,date,style,emotionLbl){
  const styleNames={anime:'애니풍',comic:'만화체',minimal:'미니멀',sketch:'스케치'};
  ctx.save();
  ctx.font="600 18px 'Noto Serif KR',serif";
  ctx.fillStyle='rgba(140,100,70,0.68)';
  ctx.textAlign='left';
  ctx.fillText('오늘의 일기',62,36);
  ctx.font="300 11px 'Noto Sans KR',sans-serif";
  ctx.fillStyle='rgba(180,140,110,0.5)';
  ctx.fillText((styleNames[style]||'')+' · '+emotionLbl,62,52);
  ctx.restore();
}

// ── WARM OVERLAYS ──
function warmGrain(ctx,W,H){
  ctx.save();ctx.globalAlpha=0.015;
  for(let i=0;i<400;i++){const v=randInt(130,195);ctx.fillStyle=`rgb(${v},${Math.max(0,v-12)},${Math.max(0,v-30)})`;ctx.fillRect(rand(0,W),rand(0,H),1,1);}
  ctx.restore();
}
function warmVignette(ctx,W,H){
  const g=ctx.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,H*.82);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(160,120,70,0.07)');
  ctx.save();ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
}

// ── ENVIRONMENT (PASTEL) ──
function drawEnvironment(ctx,W,H,GY,scene,pal,ss,t){
  const e=scene.emotion,loc=scene.location;

  // Night sky overlay
  if(['night','lonely'].includes(e)||loc==='night'){
    const sky=ctx.createLinearGradient(0,0,0,GY*.85);
    sky.addColorStop(0,'rgba(30,20,65,0.38)');sky.addColorStop(1,'rgba(70,55,110,0.08)');
    ctx.save();ctx.fillStyle=sky;ctx.fillRect(0,0,W,GY*.85);
    // Milky way
    ctx.globalAlpha=0.06;ctx.fillStyle='rgba(200,185,255,0.8)';
    ctx.beginPath();ctx.ellipse(W*.5,GY*.3,W*.42,H*.07,-0.25,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  // Stars
  for(const s of ss.stars){
    ctx.save();ctx.globalAlpha=s.a*(0.4+0.4*Math.sin(t*1.5+s.ph));
    ctx.fillStyle='rgba(210,200,255,0.92)';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  if(ss.stars.length>0&&Math.random()<.003) drawShootingStar(ctx,W,H*.8);
  // Celestial
  if(['night','lonely'].includes(e)||loc==='night') drawPastelMoon(ctx,W*.82,H*.12,26,pal);
  else if(['happy','excited','peaceful','love'].includes(e)&&loc!=='night'&&loc!=='pcroom') drawPastelSun(ctx,W*.8,H*.11,pal);

  // Location-specific scenes
  if(loc==='cafe') drawCafeScene(ctx,W,H,GY,pal,t);
  else if(loc==='school') drawSchoolScene(ctx,W,H,GY,pal,t);
  else if(loc==='pcroom') drawPcRoomScene(ctx,W,H,GY,pal,t);
  else if(loc==='home'){
    drawHomeScene(ctx,W,H,GY,pal,t);
    drawPastelTree(ctx,W*.07,GY,80,pal,e);
  } else if(loc==='outside'){
    drawOutdoorScene(ctx,W,H,GY,pal,e,t);
    drawPastelTree(ctx,W*.08,GY,95,pal,e);drawPastelTree(ctx,W*.9,GY,74,pal,e);
    drawPastelFlowers(ctx,W,GY,pal,e);
  } else {
    // Default: trees + bench per emotion
    if(['happy','peaceful','excited','love','night','lonely'].includes(e)){
      drawPastelTree(ctx,W*.09,GY,90,pal,e);drawPastelTree(ctx,W*.91,GY,72,pal,e);
    }
    if(['lonely','love','peaceful','sad'].includes(e)) drawPastelBench(ctx,W*.5,GY,pal);
    if(['peaceful','happy','love'].includes(e)) drawPastelFlowers(ctx,W,GY,pal,e);
  }

  // Weather overlays
  if(['sad','rain'].includes(e)||loc==='rain') drawPastelRainClouds(ctx,W,H,GY,pal,ss,t);
  else if(e==='angry') drawPastelClouds(ctx,W,H,GY,pal,'angry',t);
  else if(['happy','excited'].includes(e)&&loc!=='pcroom') drawPastelClouds(ctx,W,H,GY,pal,'happy',t);

  // Ground
  ctx.save();
  ctx.fillStyle=pal.ground||'#F0E4D8';ctx.globalAlpha=loc==='pcroom'?0.15:0.42;
  ctx.fillRect(0,GY,W,H-GY);
  ctx.globalAlpha=1;ctx.strokeStyle=pal.groundLine||'rgba(180,155,120,0.4)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(0,GY);ctx.lineTo(W,GY);ctx.stroke();
  ctx.restore();
}

// ── SCENE: CAFE ──
function drawCafeScene(ctx,W,H,GY,pal,t){
  ctx.save();
  // Large window with outside sky view
  ctx.fillStyle='rgba(180,210,240,0.35)';ctx.strokeStyle='rgba(160,130,90,0.45)';ctx.lineWidth=3;
  roundRect(ctx,W*.62,H*.07,W*.3,H*.33,7);ctx.fill();ctx.stroke();
  // Window cross dividers
  ctx.strokeStyle='rgba(160,130,90,0.45)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(W*.77,H*.07);ctx.lineTo(W*.77,H*.4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(W*.62,H*.235);ctx.lineTo(W*.92,H*.235);ctx.stroke();
  // Outside tiny tree visible through window
  ctx.fillStyle='rgba(130,200,140,0.4)';ctx.globalAlpha=0.7;
  ctx.beginPath();ctx.arc(W*.72,H*.17,H*.06,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  // Cafe table (wooden)
  const tx=W*.42,tw=W*.32;
  ctx.fillStyle='rgba(180,140,90,0.72)';ctx.strokeStyle='rgba(140,100,60,0.4)';ctx.lineWidth=2;
  roundRect(ctx,tx-tw/2,GY-14,tw,16,5);ctx.fill();ctx.stroke();
  // Table legs
  ctx.strokeStyle='rgba(140,100,60,0.45)';ctx.lineWidth=3;
  [[tx-tw*.38,GY+2,tx-tw*.38,GY+36],[tx+tw*.38,GY+2,tx+tw*.38,GY+36]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  });
  // Wall menu board (chalkboard)
  ctx.fillStyle='rgba(40,80,55,0.35)';ctx.strokeStyle='rgba(60,110,75,0.4)';ctx.lineWidth=2;
  roundRect(ctx,W*.04,H*.1,W*.18,H*.25,4);ctx.fill();ctx.stroke();
  // Chalk lines on menu board
  ctx.strokeStyle='rgba(255,255,255,0.28)';ctx.lineWidth=1.5;ctx.lineCap='round';
  [[W*.07,H*.17,W*.18,H*.17],[W*.07,H*.22,W*.15,H*.22],[W*.07,H*.27,W*.19,H*.27]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  });
  // Small plant on counter
  ctx.fillStyle='rgba(90,180,110,0.65)';
  ctx.beginPath();ctx.arc(W*.92,GY-38,14,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(W*.92,GY-26,10,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(160,100,55,0.6)';
  roundRect(ctx,W*.916,GY-14,8,14,3);ctx.fill();
  ctx.restore();
}

// ── SCENE: SCHOOL ──
function drawSchoolScene(ctx,W,H,GY,pal,t){
  ctx.save();
  // Blackboard
  ctx.fillStyle='rgba(40,100,60,0.35)';ctx.strokeStyle='rgba(70,130,85,0.45)';ctx.lineWidth=3;
  roundRect(ctx,W*.07,H*.07,W*.86,H*.3,6);ctx.fill();ctx.stroke();
  // Board frame strip at bottom
  ctx.fillStyle='rgba(180,140,90,0.4)';
  ctx.fillRect(W*.07,H*.07+H*.3-4,W*.86,8);
  // Chalk text/equations on board
  ctx.strokeStyle='rgba(255,255,255,0.32)';ctx.lineWidth=2;ctx.lineCap='round';
  [[W*.13,H*.15,W*.38,H*.15],[W*.13,H*.21,W*.3,H*.21],[W*.42,H*.15,W*.6,H*.15],[W*.62,H*.17,W*.88,H*.17],[W*.62,H*.23,W*.82,H*.23]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  });
  // Desks (two, centered)
  [[W*.3,GY],[W*.7,GY]].forEach(([dx])=>{
    ctx.fillStyle='rgba(205,175,120,0.62)';ctx.strokeStyle='rgba(160,120,80,0.35)';ctx.lineWidth=1.5;
    roundRect(ctx,dx-32,GY-16,64,16,4);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(140,100,60,0.4)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(dx-24,GY);ctx.lineTo(dx-24,GY+32);ctx.moveTo(dx+24,GY);ctx.lineTo(dx+24,GY+32);ctx.stroke();
  });
  ctx.restore();
}

// ── SCENE: HOME ──
function drawHomeScene(ctx,W,H,GY,pal,t){
  ctx.save();
  // Window with curtains
  ctx.fillStyle='rgba(185,220,255,0.32)';ctx.strokeStyle='rgba(155,130,95,0.4)';ctx.lineWidth=2.5;
  roundRect(ctx,W*.68,H*.08,W*.23,H*.31,6);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(W*.795,H*.08);ctx.lineTo(W*.795,H*.39);ctx.moveTo(W*.68,H*.235);ctx.lineTo(W*.91,H*.235);ctx.stroke();
  // Curtains
  ctx.globalAlpha=0.45;ctx.fillStyle='rgba(255,170,170,0.55)';
  ctx.beginPath();ctx.moveTo(W*.665,H*.07);ctx.quadraticCurveTo(W*.695,H*.16,W*.7,H*.41);ctx.lineTo(W*.68,H*.41);ctx.lineTo(W*.68,H*.07);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(W*.925,H*.07);ctx.quadraticCurveTo(W*.895,H*.16,W*.89,H*.41);ctx.lineTo(W*.91,H*.41);ctx.lineTo(W*.91,H*.07);ctx.closePath();ctx.fill();
  ctx.globalAlpha=1;
  // Sofa
  ctx.fillStyle='rgba(210,170,130,0.55)';ctx.strokeStyle='rgba(180,130,90,0.35)';ctx.lineWidth=2;
  roundRect(ctx,W*.12,GY-46,W*.76,46,12);ctx.fill();ctx.stroke();
  // Cushions
  ctx.fillStyle='rgba(240,195,155,0.48)';
  roundRect(ctx,W*.16,GY-40,W*.3,36,9);ctx.fill();
  roundRect(ctx,W*.54,GY-40,W*.3,36,9);ctx.fill();
  // Sofa armrest
  ctx.fillStyle='rgba(200,165,120,0.5)';
  roundRect(ctx,W*.12,GY-52,W*.06,52,8);ctx.fill();
  roundRect(ctx,W*.82,GY-52,W*.06,52,8);ctx.fill();
  // Potted plant top-left
  ctx.fillStyle='rgba(85,175,100,0.6)';
  ctx.beginPath();ctx.arc(W*.06,GY-55,16,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(W*.06,GY-42,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(150,95,55,0.58)';
  roundRect(ctx,W*.052,GY-30,14,24,3);ctx.fill();
  ctx.restore();
}

// ── SCENE: PC ROOM ──
function drawPcRoomScene(ctx,W,H,GY,pal,t){
  ctx.save();
  // Dark ambient overlay
  ctx.fillStyle='rgba(5,5,20,0.32)';ctx.fillRect(0,0,W,H);
  // Neon ceiling strip
  const neon=ctx.createLinearGradient(0,0,W,0);
  neon.addColorStop(0,'rgba(0,210,255,0.18)');neon.addColorStop(.5,'rgba(210,0,255,0.18)');neon.addColorStop(1,'rgba(0,210,255,0.18)');
  ctx.fillStyle=neon;ctx.fillRect(0,0,W,10);
  // Monitors on back wall
  [[W*.22,H*.1],[W*.5,H*.08],[W*.78,H*.1]].forEach(([mx,my],i)=>{
    ctx.fillStyle='rgba(5,5,18,0.75)';ctx.strokeStyle=`rgba(${i===1?'80,120,255':'0,200,255'},0.5)`;ctx.lineWidth=2;
    roundRect(ctx,mx-32,my,64,46,5);ctx.fill();ctx.stroke();
    const pulsed=.22+.12*Math.sin(t*2.5+i*1.1);
    ctx.fillStyle=`rgba(${i===1?'50,90,255':'0,180,255'},${pulsed})`;
    roundRect(ctx,mx-26,my+6,52,34,4);ctx.fill();
    // Scanlines
    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(let s=0;s<5;s++){ctx.beginPath();ctx.moveTo(mx-26,my+10+s*7);ctx.lineTo(mx+26,my+10+s*7);ctx.stroke();}
  });
  // Desk surface with neon edge
  ctx.fillStyle='rgba(18,12,40,0.62)';ctx.strokeStyle='rgba(80,60,160,0.45)';ctx.lineWidth=2;
  ctx.fillRect(0,GY-22,W,22);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,GY-22);ctx.lineTo(W,GY-22);ctx.stroke();
  // Neon floor reflection
  ctx.fillStyle='rgba(0,180,255,0.04)';ctx.fillRect(0,GY,W,H-GY);
  ctx.restore();
}

// ── SCENE: OUTDOOR ──
function drawOutdoorScene(ctx,W,H,GY,pal,emotion,t){
  ctx.save();
  // Green soccer field grass tint for sports mood
  ctx.fillStyle='rgba(130,200,120,0.08)';ctx.fillRect(0,GY*.55,W,H-GY*.55);
  // Field lines (goal box area)
  ctx.strokeStyle='rgba(255,255,255,0.18)';ctx.lineWidth=1.5;ctx.setLineDash([8,6]);
  ctx.beginPath();ctx.moveTo(W*.2,GY);ctx.lineTo(W*.2,GY+H*.12);ctx.lineTo(W*.8,GY+H*.12);ctx.lineTo(W*.8,GY);ctx.stroke();
  ctx.setLineDash([]);
  // Path
  ctx.fillStyle='rgba(220,200,160,0.18)';
  ctx.beginPath();ctx.moveTo(W*.38,GY);ctx.lineTo(W*.62,GY);ctx.lineTo(W*.72,H);ctx.lineTo(W*.28,H);ctx.closePath();ctx.fill();
  // Lamp post
  ctx.strokeStyle='rgba(120,100,80,0.52)';ctx.lineWidth=4;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(W*.84,GY);ctx.lineTo(W*.84,GY-H*.36);ctx.stroke();
  ctx.beginPath();ctx.moveTo(W*.84,GY-H*.36);ctx.quadraticCurveTo(W*.84,GY-H*.42,W*.87,GY-H*.42);ctx.stroke();
  ctx.fillStyle='rgba(255,240,180,0.72)';ctx.strokeStyle='rgba(220,185,60,0.5)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(W*.87,GY-H*.42,7,0,Math.PI*2);ctx.fill();ctx.stroke();
  // Lamp glow
  const glow=ctx.createRadialGradient(W*.87,GY-H*.42,0,W*.87,GY-H*.42,30);
  glow.addColorStop(0,'rgba(255,240,150,0.18)');glow.addColorStop(1,'transparent');
  ctx.fillStyle=glow;ctx.fillRect(W*.82,GY-H*.48,30,22);
  ctx.restore();
}

function drawPastelMoon(ctx,x,y,r,pal){
  ctx.save();
  const gg=ctx.createRadialGradient(x,y,0,x,y,r*3.5);
  gg.addColorStop(0,'rgba(220,215,255,0.22)');gg.addColorStop(1,'transparent');
  ctx.fillStyle=gg;ctx.fillRect(x-r*4,y-r*4,r*8,r*8);
  const mg=ctx.createRadialGradient(x-r*.2,y-r*.2,0,x,y,r);
  mg.addColorStop(0,'#FEFCE8');mg.addColorStop(.6,'#FEF08A');mg.addColorStop(1,'#FDE68A');
  ctx.fillStyle=mg;ctx.globalAlpha=.88;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(230,210,140,0.2)';ctx.beginPath();ctx.arc(x+r*.3,y,r*.72,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(200,160,50,0.38)';ctx.strokeStyle='rgba(200,160,50,0.38)';ctx.lineWidth=r*.1;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(x-r*.25,y-r*.1,r*.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+r*.1,y-r*.1,r*.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x-r*.08,y+r*.15,r*.18,0.1,Math.PI-.1);ctx.stroke();
  ctx.restore();
}

function drawPastelSun(ctx,x,y,pal){
  ctx.save();
  const gg=ctx.createRadialGradient(x,y,0,x,y,95);
  gg.addColorStop(0,'rgba(255,230,80,0.32)');gg.addColorStop(.5,'rgba(255,210,50,0.1)');gg.addColorStop(1,'transparent');
  ctx.fillStyle=gg;ctx.fillRect(x-105,y-105,210,210);
  const sg=ctx.createRadialGradient(x-5,y-5,0,x,y,22);
  sg.addColorStop(0,'#FFFACD');sg.addColorStop(.5,'#FFE566');sg.addColorStop(1,'#FFD633');
  ctx.fillStyle=sg;ctx.globalAlpha=.92;ctx.beginPath();ctx.arc(x,y,22,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(255,220,60,0.5)';ctx.lineWidth=2.5;ctx.lineCap='round';
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*27,y+Math.sin(a)*27);ctx.lineTo(x+Math.cos(a)*40,y+Math.sin(a)*40);ctx.stroke();}
  ctx.fillStyle='rgba(200,140,0,0.45)';ctx.strokeStyle='rgba(200,140,0,0.45)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(x-7,y-4,2.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x+7,y-4,2.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(x,y+5,8,0.2,Math.PI-0.2);ctx.stroke();
  ctx.restore();
}

function drawPastelTree(ctx,x,gy,h,pal,emotion){
  ctx.save();
  const cmap={happy:'#A8E6CF',peaceful:'#86EFAC',love:'#FCA5A5',excited:'#DDA0DD',sad:'#B0C4DE',night:'#B8B0D8',lonely:'#C0C8D0',rain:'#A0B8C8',angry:'#F4A261'};
  const leafCol=cmap[emotion]||'#A8E6CF';
  ctx.globalAlpha=0.62;ctx.fillStyle='rgba(180,140,100,0.65)';
  ctx.beginPath();ctx.moveTo(x-h*.05,gy);ctx.bezierCurveTo(x-h*.03,gy-h*.25,x-h*.02,gy-h*.28,x,gy-h*.3);ctx.bezierCurveTo(x+h*.02,gy-h*.28,x+h*.03,gy-h*.25,x+h*.05,gy);ctx.fill();
  [[x,gy-h*.8,h*.28],[x-h*.16,gy-h*.62,h*.22],[x+h*.18,gy-h*.6,h*.2],[x,gy-h*.52,h*.25],[x-h*.05,gy-h*.9,h*.18]].forEach(([cx,cy,r])=>{
    const g=ctx.createRadialGradient(cx-r*.2,cy-r*.2,0,cx,cy,r);
    g.addColorStop(0,leafCol);g.addColorStop(.7,leafCol+'CC');g.addColorStop(1,leafCol+'33');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
  });
  ctx.restore();
}

function drawPastelBench(ctx,x,gy,pal){
  ctx.save();ctx.globalAlpha=0.62;
  ctx.fillStyle='rgba(200,165,115,0.85)';ctx.strokeStyle='rgba(160,120,80,0.45)';ctx.lineWidth=1.5;
  ctx.beginPath();roundRect(ctx,x-55,gy-36,110,11,4);ctx.fill();ctx.stroke();
  ctx.beginPath();roundRect(ctx,x-55,gy-62,110,10,4);ctx.fill();ctx.stroke();
  [[x-44,gy-25,x-40,gy],[x+40,gy-25,x+44,gy]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  ctx.restore();
}

function drawPastelClouds(ctx,W,H,GY,pal,emotion,t){
  const cols={angry:'rgba(225,145,125,0.32)',happy:'rgba(255,255,255,0.45)',excited:'rgba(220,200,255,0.38)'};
  const col=cols[emotion]||'rgba(185,185,205,0.28)';
  ctx.save();ctx.fillStyle=col;
  [[W*.12,H*.09,95],[W*.48,H*.06,118],[W*.8,H*.11,80]].forEach(([cx,cy,r])=>{
    const dx=Math.sin(t*.18)*7;
    ctx.beginPath();ctx.arc(cx+dx,cy,r*.52,0,Math.PI*2);ctx.arc(cx+dx+r*.38,cy+5,r*.44,0,Math.PI*2);ctx.arc(cx+dx-r*.28,cy+8,r*.37,0,Math.PI*2);ctx.arc(cx+dx+r*.18,cy-r*.15,r*.32,0,Math.PI*2);ctx.fill();
  });
  // Happy: sunlit cloud edges
  if(emotion==='happy'){
    ctx.fillStyle='rgba(255,240,180,0.18)';
    [[W*.12,H*.09,95],[W*.48,H*.06,118],[W*.8,H*.11,80]].forEach(([cx,cy,r])=>{
      const dx=Math.sin(t*.18)*7;
      ctx.beginPath();ctx.arc(cx+dx-r*.1,cy-r*.1,r*.3,0,Math.PI*2);ctx.fill();
    });
  }
  ctx.restore();
}

function drawPastelRainClouds(ctx,W,H,GY,pal,ss,t){
  ctx.save();ctx.fillStyle='rgba(120,162,215,0.28)';
  [[W*.15,H*.09,90],[W*.52,H*.06,115],[W*.82,H*.11,75]].forEach(([cx,cy,r])=>{
    const dx=Math.sin(t*.22)*5;
    ctx.beginPath();ctx.arc(cx+dx,cy,r*.5,0,Math.PI*2);ctx.arc(cx+dx+r*.36,cy+4,r*.41,0,Math.PI*2);ctx.arc(cx+dx-r*.28,cy+7,r*.35,0,Math.PI*2);ctx.fill();
  });
  for(const d of ss.rainDrops){
    d.y+=d.spd;d.x-=d.spd*.22;
    if(d.y>H+10){d.y=rand(-40,-5);d.x=rand(0,W+60);}
    ctx.strokeStyle='rgba(120,178,240,0.32)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.spd*.11,d.y-d.len*.7);ctx.stroke();
  }
  ctx.restore();
}

function drawPastelFlowers(ctx,W,GY,pal,emotion){
  const fmap={peaceful:'#86EFAC',happy:'#FCA5A5',love:'#FDA4AF',excited:'#D8B4FE'};
  const fcol=fmap[emotion]||'#FCA5A5';
  ctx.save();
  [[W*.11,GY-3],[W*.26,GY-2],[W*.74,GY-3],[W*.89,GY-4]].forEach(([fx,fy])=>{
    ctx.globalAlpha=0.55;ctx.strokeStyle='rgba(130,190,120,0.65)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx,fy+14);ctx.stroke();
    ctx.fillStyle=fcol;ctx.globalAlpha=0.65;
    for(let p=0;p<5;p++){const a=(p/5)*Math.PI*2;ctx.beginPath();ctx.ellipse(fx+Math.cos(a)*7,fy-6+Math.sin(a)*7,5,3,a,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#FEFCE8';ctx.globalAlpha=0.9;ctx.beginPath();ctx.arc(fx,fy-6,3.5,0,Math.PI*2);ctx.fill();
  });
  ctx.restore();
}
function drawShootingStar(ctx,W,H){
  const sx=rand(0,W),sy=rand(0,H),len=rand(60,140);
  const g=ctx.createLinearGradient(sx,sy,sx+len,sy+len*.35);
  g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.65)');g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+len,sy+len*.35);
  ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.stroke();
}


// ── OVERLAYS ──
function grainOverlay(ctx,W,H,alpha){
  ctx.save();ctx.globalAlpha=alpha;
  for(let i=0;i<900;i++){const v=randInt(0,255);ctx.fillStyle=`rgb(${v},${v},${v})`;ctx.fillRect(rand(0,W),rand(0,H),1,1);}
  ctx.restore();
}
function vignetteOverlay(ctx,W,H,str=.68){
  const g=ctx.createRadialGradient(W/2,H/2,H*.28,W/2,H/2,H*.83);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${str})`);
  ctx.save();ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
}
