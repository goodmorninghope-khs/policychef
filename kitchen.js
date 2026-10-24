// 정책 주방: 3D 정책셰프와 뜻땀때 주방 (three.js)
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const C={teal:'#136B66',coral:'#D95B43',amber:'#D9962B',sky:'#2E6FA3',ink:'#10302E',paper:'#F5F8F7',cream:'#F4EBDD'};
const FD='Hahmlet', FB='"IBM Plex Sans KR"';

const DISHES=[
  {id:'owl',name:'올빼미버스',yr:'2013 · 서울특별시',color:C.sky,jar:'데이터',more:'index.html#s-owl',
   tteut:'신청한 사람은 한 명도 없었다. 그래도 새벽에 집에 가야 하는 사람은 있었다.',
   ttam:'새벽의 통화 30억 건을 읽고, 그 길을 따라 9개 노선을 그었다.',
   ttae:'첫날 1,200명이 탔다. 신청을 기다리지 않는 발견행정의 시작.',
   ing:'심야 통화 데이터 30억 건',plate:'심야 노동자의 귀갓길',said:'데이터가 말하고 있었다. 우리만 듣지 못했던 것이다.'},
  {id:'cheong',name:'청책',yr:'2011–2017 · 서울특별시',color:C.teal,jar:'물음',more:'index.html#s-seoul',
   tteut:'정책의 ‘정’을 ‘청’으로. 듣는 것이 곧 정책이다.',
   ttam:'청책토론회만 150번. 시민 10만 명이 180일 동안 함께 썼다.',
   ttae:'트위터의 한 줄 민원이 그해의 우수정책이 되기도 했다.',
   ing:'시민 10만 명의 목소리',plate:'시민이 함께 쓴 기본계획',said:'정책은 말로 먼저 도착한다.'},
  {id:'highfive',name:'하이파이브',yr:'2020–2022 · 중소기업유통센터',color:C.amber,jar:'이야기',more:'index.html#s-2020',
   tteut:'코로나19 한복판, 진통제가 아니라 디지털 경제백신을 놓고 싶었다.',
   ttam:'5만 4천 명의 사장님과 디지털 전환을 건넜다. 가장 좋은 강사는 떡볶이집 사장님.',
   ttae:'첫 라이브 방송 30분에 50세트가 팔렸다.',
   ing:'사장님의 이야기',plate:'매출보다 먼저 온 자신감',said:'소상공인 교육은 소상공인 이야기가 강사다.'},
  {id:'baemin',name:'배민 독립선언',yr:'2023–2025 · 광주',color:C.coral,jar:'현장',more:'index.html#s-2023',
   tteut:'골목의 돈이 골목에서 돌게 한다. 재단을 수요혁신기관으로 다시 정의했다.',
   ttam:'첫 100일은 묻고 듣는 데 썼다. 1,547명의 사장님이 플랫폼에서 독립을 선언했다.',
   ttae:'광주 공공배달앱 점유율은 전국 평균의 네 배를 넘었다.',
   ing:'1,547명의 선언',plate:'골목이 스스로 도는 경제',said:''},
  {id:'sovereign',name:'소버린 AI',yr:'『소상공인을 버린 AI』',color:'#3E8E7E',jar:'사람',more:'index.html#tteut',
   tteut:'“우린 그런 거 몰라요. 그냥 소(상공인을) 버린 AI가 아니길 바랄 뿐이죠.”',
   ttam:'기술을 가진 자가 아니라 규칙을 만드는 자의 주권을 묻는다.',
   ttae:'소상공인을 버린 AI에서 소상공인이 부리는 AI로.',
   ing:'600만 사장님의 장부',plate:'소상공인이 주인인 AI',said:'진짜 소버린 AI는 소상공인이 주인인 AI다.'},
];
const JARS=[
  {k:'뜻',c:C.coral,line:'뜻(志)으로 방향을 잡고,'},
  {k:'땀',c:C.teal,line:'땀(汗)으로 증거하고,'},
  {k:'때',c:C.amber,line:'때(時)를 짓습니다.'},
  {k:'데이터',c:C.sky,up:true,line:'새벽의 통화 30억 건. 데이터는 이미 말하고 있었습니다.'},
  {k:'물음',c:C.coral,up:true,line:'좋은 질문이 올바른 답을 찾게 합니다.'},
  {k:'이야기',c:C.amber,up:true,line:'사장님 이야기가 가장 좋은 강사입니다.'},
  {k:'현장',c:C.teal,up:true,line:'첫 100일은 묻고 듣는 데 썼습니다.'},
  {k:'사람',c:'#3E8E7E',up:true,line:'기술은 사람을 향해야 합니다.'},
];
const CHEF_LINES=['정책도 요리처럼, 재료와 손과 불이 있어야 나옵니다.','데이터가 말하고 있었습니다. 우리만 듣지 못했던 거죠.','좋은 질문이 올바른 답을 찾게 합니다.','골목이 살아야 나라가 삽니다.','오늘은 뭘 지어 볼까요? 메뉴를 골라 주세요.','배가 항구에 있을 때 가장 안전합니다. 그러나 그것이 배의 존재 이유는 아니죠.'];

// ---------- 메뉴와 레시피 카드 (3D 없이도 동작) ----------
const $=id=>document.getElementById(id);
const menu=$('menu');
DISHES.forEach((d,i)=>{
  const b=document.createElement('button');
  b.type='button';b.textContent=d.name;b.style.setProperty('--dot',d.color);b.dataset.i=i;b.setAttribute('aria-pressed','false');
  b.addEventListener('click',()=>order(i));
  menu.appendChild(b);
});
function showRecipe(i){
  const d=DISHES[i];
  $('c-yr').textContent=d.yr;$('c-name').textContent=d.name;
  $('c-tteut').textContent=d.tteut;$('c-ttam').textContent=d.ttam;$('c-ttae').textContent=d.ttae;
  $('c-in').textContent=d.ing;$('c-plate').textContent=d.plate;$('c-said').textContent=d.said;
  $('c-more').href=d.more;
  menu.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.i===i)));
}
let cook3d=null;
function order(i){showRecipe(i);cook3d&&cook3d(i)}
showRecipe(0);

// ---------- 3D ----------
const stage=$('stage'), loading=$('loading'), bubble=$('bubble');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
}catch(e){
  loading.remove();
  const f=document.createElement('div');f.className='fallback';
  f.textContent='이 브라우저에서는 3D 주방을 열 수 없습니다. 아래 메뉴로 레시피는 볼 수 있어요.';
  stage.appendChild(f);
}
if(renderer)main();

function tex(w,h,draw){
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const g=c.getContext('2d');draw(g,w,h);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;
  t.userData.redraw=fn=>{g.clearRect(0,0,w,h);fn(g,w,h);t.needsUpdate=true};
  return t;
}
function rr(g,x,y,w,h,r){g.beginPath();g.roundRect?g.roundRect(x,y,w,h,r):g.rect(x,y,w,h)}
function fit(g,text,weight,family,size,maxW){
  let s=size;g.font=`${weight} ${s}px ${family}`;
  while(g.measureText(text).width>maxW&&s>10){s-=2;g.font=`${weight} ${s}px ${family}`}
  return s;
}
const M=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.65,...o});
let ENV=null;
const metal=(c='#C9CED1',r=.25,o={})=>M(c,{metalness:.9,roughness:r,envMap:ENV,...o});
function mesh(geo,mat,parent,{x=0,y=0,z=0,rx=0,ry=0,rz=0,s=null,cast=true,recv=false}={}){
  const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);
  if(s)Array.isArray(s)?m.scale.set(...s):m.scale.setScalar(s);
  m.castShadow=cast;m.receiveShadow=recv;parent&&parent.add(m);return m;
}
const ease=k=>k<0?0:k>1?1:k*k*(3-2*k);
const back=k=>{k=Math.min(Math.max(k,0),1);const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};

async function fontsReady(){
  if(!document.fonts)return;
  const txt=[...DISHES.map(d=>d.name),...JARS.map(j=>j.k),'정책셰프의 주방 오늘의 메뉴 뜻땀때 떡볶이 세탁소 철물점 꽃집 정육점 국밥 셰프 김현성 독립 소상공인을 버린'].join('');
  try{await Promise.race([Promise.all([document.fonts.load(`800 40px ${FD}`,txt),document.fonts.load(`600 40px ${FD}`,txt),document.fonts.load(`600 40px ${FB}`,txt)]),new Promise(r=>setTimeout(r,2500))])}catch(e){}
}

async function main(){
  await fontsReady();
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  stage.prepend(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden','true');

  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#2a3a37');
  scene.fog=new THREE.Fog('#2a3a37',11,20);
  const pmrem=new THREE.PMREMGenerator(renderer);
  ENV=pmrem.fromScene(new RoomEnvironment(renderer),.04).texture;

  const camera=new THREE.PerspectiveCamera(40,1,.1,60);
  const target=new THREE.Vector3(0,1.3,-.3);
  const camDir=new THREE.Vector3(0,.85,5.6).normalize();
  camera.position.copy(target).addScaledVector(camDir,5.7);
  const controls=new OrbitControls(camera,renderer.domElement);
  Object.assign(controls,{enableDamping:true,dampingFactor:.08,enablePan:false,minPolarAngle:1.0,maxPolarAngle:1.52,minAzimuthAngle:-.75,maxAzimuthAngle:.75,rotateSpeed:.6});
  controls.target.copy(target);

  // 빛
  scene.add(new THREE.HemisphereLight('#FFF4E2','#5d7470',1.1));
  const key=new THREE.DirectionalLight('#FFF1DC',2.2);
  key.position.set(3,6.5,4.5);key.castShadow=true;
  Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-3,near:1,far:16});
  key.shadow.mapSize.set(2048,2048);key.shadow.bias=-.0004;key.shadow.normalBias=.02;
  scene.add(key);
  const fill=new THREE.DirectionalLight('#BFD8FF',.5);fill.position.set(-4,3,2);scene.add(fill);

  const pick=[]; // 눌러 볼 수 있는 것들
  const room=buildRoom(scene);
  const jars={};
  JARS.forEach((j,i)=>{const o=buildJar(j,i);scene.add(o);jars[j.k]=o;pick.push(o)});
  const board=buildBoard(scene);
  const isl=buildIsland(scene);
  pick.push(isl.pot);
  const chef=buildChef();
  chef.root.position.set(0,0,-.5);chef.root.scale.setScalar(.9);
  scene.add(chef.root);pick.push(chef.root);

  // 김: 냄비 위로 피어오르는 증기
  const glow=tex(128,128,(g,w,h)=>{const r=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.4,'rgba(255,255,255,.5)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)});
  const potTop=new THREE.Vector3();isl.pot.getWorldPosition(potTop);potTop.y+=.28;
  const steam=[];
  for(let i=0;i<18;i++){
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color:'#ffffff',transparent:true,opacity:0,depthWrite:false}));
    s.userData={life:Math.random(),sp:.25+Math.random()*.2,dx:(Math.random()-.5)*.35,dz:(Math.random()-.5)*.25};
    scene.add(s);steam.push(s);
  }
  // 반짝이: 접시가 나올 때
  const sparks=[];
  for(let i=0;i<26;i++){
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));
    s.visible=false;scene.add(s);sparks.push(s);
  }
  // 재료 구슬
  const orbs=[];
  for(let i=0;i<4;i++){
    const o=new THREE.Group();
    mesh(new THREE.SphereGeometry(.07,20,14),new THREE.MeshBasicMaterial({color:'#fff'}),o,{cast:false});
    const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    halo.scale.setScalar(.45);o.add(halo);o.visible=false;scene.add(o);orbs.push(o);
  }

  // ---------- 요리 ----------
  let cook=null, dishProp=null, tag=null, current=-1;
  const plateTop=isl.plate.position.clone();plateTop.y+=.03;
  function startCook(i){
    current=i;const d=DISHES[i];
    menu.querySelectorAll('button').forEach(b=>b.disabled=true);
    drawBoard(board,i);
    const names=['뜻','땀','때',d.jar];
    cook={i,d,t:0,flights:names.map((n,k)=>{const p=new THREE.Vector3();jars[n].getWorldPosition(p);p.y+=.18;return{from:p,delay:.15+k*.38,dur:.95,jar:jars[n],color:JARS.find(j=>j.k===n).c,done:false}}),old:dishProp,oldTag:tag,col0:isl.soup.material.color.clone(),col1:new THREE.Color(d.color).lerp(new THREE.Color('#fff'),.2),served:false,sparked:false,covered:isl.cloche.visible&&isl.cloche.scale.x>.99};
    dishProp=null;tag=null;
    say(`${d.name}, 들어갑니다!`,1.6);
    if(RM)cook.t=4.2;
  }
  cook3d=i=>{if(!cook)startCook(i)};

  function updateCook(dt,time){
    if(!cook)return 0;
    const c=cook;c.t+=dt;const t=c.t;
    // 덮개 내려오기 + 이전 접시 치우기
    const cl=isl.cloche;
    if(t<.4&&!c.covered){const k=ease(t/.4);cl.visible=true;cl.position.y=plateTop.y+.9*(1-k);cl.scale.setScalar(Math.max(k,.01));cl.rotation.z=0;cl.position.x=isl.plate.position.x}
    else if(c.old){isl.root.remove(c.old);c.old=null;if(c.oldTag){scene.remove(c.oldTag);c.oldTag=null}}
    // 재료가 날아든다
    c.flights.forEach((f,k)=>{
      const o=orbs[k];const u=(t-f.delay)/f.dur;
      f.jar.userData.glow(u>-.3&&u<.4?1:0);
      if(u<0||f.done){o.visible=false;return}
      if(u>=1){f.done=true;o.visible=false;puff(f.color);return}
      o.visible=true;o.children[0].material.color.set(f.color);o.children[1].material.color.set(f.color);
      const e=ease(u);o.position.lerpVectors(f.from,potTop,e);o.position.y+=Math.sin(Math.PI*u)*.9;
      o.scale.setScalar(1-.4*u);
    });
    // 국물 색이 바뀐다
    const kc=ease((t-.8)/1.4);isl.soup.material.color.copy(c.col0).lerp(c.col1,kc);
    isl.ring.material.emissiveIntensity=1.2+Math.sin(time*9)*.25;
    // 덮개 열기 + 접시 등장
    if(t>=2.7&&!c.served){c.served=true;dishProp=buildProp(c.d.id);dishProp.position.copy(plateTop);isl.root.add(dishProp);tag=makeTag(c.d);scene.add(tag)}
    if(t>=2.6){const k=ease((t-2.6)/.7);cl.position.y=plateTop.y+k*.8;cl.rotation.z=-k*.6;cl.position.x=isl.plate.position.x+k*.25;cl.scale.setScalar(Math.max(1-ease((t-3.0)/.4),.001));if(t>3.4)cl.visible=false}
    if(dishProp){const k=back((t-2.75)/.55);dishProp.scale.setScalar(Math.max(k,.001));dishProp.rotation.y=(1-ease((t-2.75)/.9))*1.6}
    if(tag){const k=ease((t-3.1)/.4);tag.material.opacity=k;tag.position.y=plateTop.y+.7+.1*k}
    if(t>=2.9&&!c.sparked){c.sparked=true;burst(c.d.color)}
    if(t>=4.4){
      cook=null;isl.ring.material.emissiveIntensity=.35;
      Object.values(jars).forEach(j=>j.userData.glow(0));
      menu.querySelectorAll('button').forEach(b=>b.disabled=false);
      if(c.d.said)say(c.d.said,4);
      return 0;
    }
    return t;
  }
  let boost=0;
  function puff(color){boost=1;steam.forEach(s=>{if(Math.random()<.4){s.userData.life=0;s.material.color.set(color)}})}
  function burst(color){
    const col=new THREE.Color(color);
    sparks.forEach(s=>{s.visible=true;s.material.color.copy(col).lerp(new THREE.Color('#fff'),Math.random()*.5);s.position.copy(plateTop).add(new THREE.Vector3(0,.2,0));const a=Math.random()*Math.PI*2,v=.6+Math.random()*.9;s.userData={v:new THREE.Vector3(Math.cos(a)*v*.6,1.2+Math.random()*1.2,Math.sin(a)*v*.4),life:1};s.scale.setScalar(.08+Math.random()*.08)});
  }
  function makeTag(d){
    const t=tex(512,128,(g,w,h)=>{g.fillStyle='rgba(255,253,248,.96)';rr(g,6,10,w-12,h-20,54);g.fill();g.fillStyle=d.color;g.beginPath();g.arc(58,h/2,16,0,7);g.fill();g.fillStyle=C.ink;g.textBaseline='middle';fit(g,d.name,800,FD,56,w-130);g.fillText(d.name,92,h/2+3)});
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,opacity:0,depthWrite:false}));
    s.scale.set(.88,.22,1);s.position.copy(plateTop);s.renderOrder=5;return s;
  }

  // ---------- 말풍선 ----------
  let sayUntil=0,clock=0;
  function say(text,sec=3){bubble.textContent=text;bubble.classList.add('on');sayUntil=clock+sec;chef.talk=sec}
  const headTop=new THREE.Vector3();
  function placeBubble(){
    if(!bubble.classList.contains('on'))return;
    if(clock>sayUntil){bubble.classList.remove('on');return}
    chef.head.getWorldPosition(headTop);headTop.y+=.95;
    headTop.project(camera);
    const bw=bubble.offsetWidth/2+8;
    bubble.style.left=`${Math.min(Math.max((headTop.x*.5+.5)*stage.clientWidth,bw),stage.clientWidth-bw)}px`;
    bubble.style.top=`${(-headTop.y*.5+.5)*stage.clientHeight}px`;
  }

  // ---------- 누르기 ----------
  const ray=new THREE.Raycaster(), ptr=new THREE.Vector2(), look=new THREE.Vector2();
  let down=null;
  const cvs=renderer.domElement;
  function hitAt(e){
    const r=cvs.getBoundingClientRect();
    ptr.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    ray.setFromCamera(ptr,camera);
    const h=ray.intersectObjects(pick,true)[0];if(!h)return null;
    let o=h.object;while(o&&!pick.includes(o))o=o.parent;return o;
  }
  cvs.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
  cvs.addEventListener('pointermove',e=>{
    const r=cvs.getBoundingClientRect();look.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    if(e.pointerType==='mouse')cvs.style.cursor=hitAt(e)?'pointer':'grab';
  });
  cvs.addEventListener('pointerup',e=>{
    if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;down=null;
    const o=hitAt(e);if(!o)return;
    if(o===chef.root){chef.wave=1.6;say(CHEF_LINES[Math.floor(Math.random()*CHEF_LINES.length)],3.4)}
    else if(o===isl.pot){if(!cook)order((current+1)%DISHES.length)}
    else if(o.userData.jar){const j=o.userData.jar;o.userData.glow(1);o.userData.hop=.6;say(`${j.k}. ${j.line}`,3);setTimeout(()=>!cook&&o.userData.glow(0),900)}
  });

  // ---------- 크기 ----------
  function resize(){
    const w=stage.clientWidth,h=stage.clientHeight;
    renderer.setSize(w,h,false);camera.aspect=w/h;
    const half=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    const dist=Math.max(5.7,2.0/(half*camera.aspect));
    controls.target.copy(target);controls.target.y+=camera.aspect<1?.3:0;
    camera.position.copy(controls.target).addScaledVector(camDir,dist);
    controls.minDistance=dist*.62;controls.maxDistance=dist*1.25;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);resize();

  let visible=true;
  new IntersectionObserver(es=>{visible=es[0].isIntersecting}).observe(stage);

  // ---------- 움직임 ----------
  const tmpV=new THREE.Vector3(),tmpQ=new THREE.Quaternion(),tmpQ2=new THREE.Quaternion(),DOWN=new THREE.Vector3(0,-1,0),aim=new THREE.Vector3(),REST=new THREE.Vector3(-.25,.05,1).normalize();
  const potW=new THREE.Vector3();isl.pot.getWorldPosition(potW);
  let last=performance.now(),nextBlink=2,first=true;
  function frame(now){
    requestAnimationFrame(frame);
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(!visible||document.hidden)return;
    clock+=dt;const T=clock;
    const ct=updateCook(dt,T);

    // 셰프 자세
    const stirW=chef.w.stir+=((cook&&ct<2.7?1:0)-chef.w.stir)*Math.min(dt*6,1);
    const presW=chef.w.pres+=((cook&&ct>2.6?1:0)-chef.w.pres)*Math.min(dt*5,1);
    chef.wave=Math.max(chef.wave-dt,0);
    const waveW=chef.w.wave+=((chef.wave>0?1:0)-chef.w.wave)*Math.min(dt*7,1);
    const breathe=Math.sin(T*2.1);
    chef.body.position.y=breathe*.008+(presW>.5?Math.max(0,Math.sin((ct-2.7)*9))*.03*(ct<3.4):0);
    chef.body.rotation.z=Math.sin(T*.9)*.02;
    chef.torso.scale.set(1+breathe*.01,1,.85*(1+breathe*.01));
    // 오른팔: 젓기
    const sw=T*5.5;
    const R=chef.armR,L=chef.armL;
    R.sh.rotation.x=THREE.MathUtils.lerp(-.5,-.95+Math.sin(sw)*.12,stirW);
    R.sh.rotation.z=THREE.MathUtils.lerp(-.1,-.22+Math.cos(sw)*.14,stirW);
    R.el.rotation.x=THREE.MathUtils.lerp(-.9,-1.25,stirW);
    // 왼팔: 내밀기, 손 흔들기
    L.sh.rotation.x=THREE.MathUtils.lerp(THREE.MathUtils.lerp(-.5,-1.15,presW),-.15,waveW);
    L.sh.rotation.z=THREE.MathUtils.lerp(THREE.MathUtils.lerp(.1,.55,presW),2.55,waveW);
    L.el.rotation.x=THREE.MathUtils.lerp(THREE.MathUtils.lerp(-.9,-.25,presW),-.2,waveW);
    L.el.rotation.z=waveW*Math.sin(T*13)*.45;
    // 고개: 손님(포인터)을 보다가, 요리할 땐 냄비를, 낼 땐 접시를
    const hy=stirW*-.45+presW*.5+(1-Math.max(stirW,presW))*look.x*.5;
    const hx=stirW*.35+presW*.2+(1-Math.max(stirW,presW))*-look.y*.25;
    chef.head.rotation.y+=(hy-chef.head.rotation.y)*Math.min(dt*6,1);
    chef.head.rotation.x+=(hx-chef.head.rotation.x)*Math.min(dt*6,1);
    chef.head.rotation.z=Math.sin(T*1.3)*.03+waveW*.08;
    // 눈 깜빡
    if(T>nextBlink){chef.blink=.14;nextBlink=T+2.5+Math.random()*3}
    chef.blink=Math.max(chef.blink-dt,0);
    chef.eyes.forEach(e=>e.scale.y=(chef.blink>0?.2:1)*e.userData.sy);
    chef.talk=Math.max(chef.talk-dt,0);
    chef.mouth.scale.y=chef.talk>0?1+Math.abs(Math.sin(T*14))*1.4:1;
    // 국자: 손에서 냄비 속으로
    chef.root.updateMatrixWorld(true);
    chef.armR.hand.getWorldPosition(tmpV);
    aim.set(potW.x+Math.cos(sw)*.08,potW.y+.12,potW.z+Math.sin(sw)*.06).sub(tmpV).normalize();
    aim.lerp(REST,1-Math.min(stirW*1.5,1)).normalize();
    tmpQ.setFromUnitVectors(DOWN,aim);
    chef.armR.hand.getWorldQuaternion(tmpQ2);
    chef.ladle.quaternion.copy(tmpQ2.invert().multiply(tmpQ));

    // 김
    boost=Math.max(boost-dt*.8,0);
    const heat=cook?1.6:1;
    steam.forEach(s=>{
      const u=s.userData;u.life+=dt*u.sp*heat*(1+boost);
      if(u.life>1){u.life-=1;s.material.color.set('#ffffff')}
      const l=u.life;s.position.set(potTop.x+u.dx*l+Math.sin(T+u.dz*20)*.04,potTop.y+l*1.0,potTop.z+u.dz*l);
      s.scale.setScalar(.12+l*.45);s.material.opacity=Math.sin(Math.PI*l)*(.16+boost*.25)*heat;
    });
    sparks.forEach(s=>{if(!s.visible)return;const u=s.userData;u.life-=dt*.9;u.v.y-=dt*3.2;s.position.addScaledVector(u.v,dt);s.material.opacity=Math.max(u.life,0);if(u.life<=0)s.visible=false});
    isl.bubbles.forEach((b,k)=>{const p=(T*.9+k*.37)%1;b.scale.setScalar(Math.sin(Math.PI*p)*(cook?1.4:1));});
    // 항아리 통통
    Object.values(jars).forEach(j=>{const u=j.userData;u.hop=Math.max(u.hop-dt,0);j.position.y=u.y0+Math.abs(Math.sin(u.hop*10))*u.hop*.12;u.light.material.opacity+=(u.g-u.light.material.opacity)*Math.min(dt*8,1)});
    if(dishProp&&!cook)dishProp.rotation.y+=dt*.35;
    room.lamps.forEach((l,k)=>l.rotation.z=Math.sin(T*.7+k)*.015);
    room.bus.position.x=room.busX(T);

    controls.update();
    renderer.render(scene,camera);
    placeBubble();
    if(first){first=false;loading.classList.add('done');setTimeout(()=>{order(0);say('어서 오세요. 정책셰프의 주방입니다.',3)},RM?0:700)}
  }
  requestAnimationFrame(frame);
  setTimeout(()=>$('hint').style.opacity='.0',12000);
  $('hint').style.transition='opacity 1s';
}

// ================= 만들기 =================
function buildRoom(scene){
  const out={lamps:[]};
  // 바닥: 크림·민트 체크 타일
  const ft=tex(256,256,(g,w,h)=>{g.fillStyle='#EDE4D3';g.fillRect(0,0,w,h);g.fillStyle='#BCD5CF';g.fillRect(0,0,w/2,h/2);g.fillRect(w/2,h/2,w/2,h/2);g.strokeStyle='rgba(0,0,0,.06)';g.lineWidth=3;g.strokeRect(0,0,w,h)});
  ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(7,6);
  mesh(new THREE.PlaneGeometry(12,11),M('#fff',{map:ft,roughness:.55}),scene,{rx:-Math.PI/2,z:2.3,cast:false,recv:true});
  // 벽
  const wall=M('#DCE7E3',{roughness:.9});
  mesh(new THREE.PlaneGeometry(12,4.6),wall,scene,{y:2.3,z:-3.2,cast:false,recv:true});
  mesh(new THREE.PlaneGeometry(11,4.6),M('#D2DFDB',{roughness:.9}),scene,{x:-5.2,y:2.3,z:2.3,ry:Math.PI/2,cast:false,recv:true});
  mesh(new THREE.PlaneGeometry(11,4.6),M('#D2DFDB',{roughness:.9}),scene,{x:5.2,y:2.3,z:2.3,ry:-Math.PI/2,cast:false,recv:true});
  // 타일 백스플래시
  const tt=tex(256,256,(g,w,h)=>{g.fillStyle='#C9D6D2';g.fillRect(0,0,w,h);g.fillStyle='#FBFAF6';for(let r=0;r<4;r++)for(let c=-1;c<3;c++){const x=c*128+(r%2)*64;rr(g,x+3,r*64+3,122,58,6);g.fill()}});
  tt.wrapS=tt.wrapT=THREE.RepeatWrapping;tt.repeat.set(9,1.4);
  mesh(new THREE.PlaneGeometry(10,.9),M('#fff',{map:tt,roughness:.3}),scene,{y:1.38,z:-3.19,cast:false,recv:true});
  // 벽 위 띠
  mesh(new THREE.BoxGeometry(12,.06,.04),M(C.teal),scene,{y:3.35,z:-3.18,cast:false});

  // 뒤 조리대
  const cab=M('#2F7F78',{roughness:.55});
  mesh(new THREE.BoxGeometry(9.2,.84,.62),cab,scene,{y:.46,z:-2.88,recv:true});
  mesh(new THREE.BoxGeometry(9.2,.08,.6),M('#1E2A28'),scene,{y:.04,z:-2.84,cast:false});
  mesh(new THREE.BoxGeometry(9.4,.06,.72),M('#EFEBE3',{roughness:.3}),scene,{y:.91,z:-2.85,recv:true});
  const seam=M('#22625C'),brass=metal('#C8A35A',.35);
  for(let x=-4.6;x<=4.61;x+=1.15){
    mesh(new THREE.BoxGeometry(.02,.74,.01),seam,scene,{x,y:.47,z:-2.565,cast:false});
    if(x<4.5)mesh(new THREE.SphereGeometry(.03,12,8),brass,scene,{x:x+.5,y:.74,z:-2.55,cast:false});
  }
  // 선반
  const wood=M('#C99764',{roughness:.6});
  [1.72,2.42].forEach(y=>{
    mesh(new THREE.BoxGeometry(4.9,.05,.34),wood,scene,{x:-1.95,y,z:-3.03,recv:true});
    [-4.2,.3].forEach(x=>mesh(new THREE.BoxGeometry(.04,.16,.28),M('#1E2A28'),scene,{x,y:y-.1,z:-3.05}));
  });
  // 창: 밤 골목
  const wx=2.75,wy=2.05,ww=2.6,wh=1.55;
  const shops=[['떡볶이','#D95B43'],['세탁소','#2E6FA3'],['철물점','#D9962B'],['꽃집','#3E8E7E'],['국밥','#B04A3A']];
  const al=tex(1024,620,(g,w,h)=>{
    const sky=g.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#0F2140');sky.addColorStop(1,'#2C4D6E');g.fillStyle=sky;g.fillRect(0,0,w,h);
    g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<60;i++){g.fillRect((i*137)%w,(i*71)%200,2,2)}
    g.fillStyle='#FFF3C8';g.beginPath();g.arc(840,90,38,0,7);g.fill();g.fillStyle='#173054';g.beginPath();g.arc(856,80,34,0,7);g.fill();
    const bw=w/5;
    shops.forEach(([n,c],i)=>{
      const x=i*bw,top=150+((i*53)%90);
      g.fillStyle=['#33405A','#2B364D','#3A4660','#2F3A52','#36435C'][i];g.fillRect(x+4,top,bw-8,h-top);
      g.fillStyle='rgba(255,214,140,.85)';for(let r=0;r<3;r++)for(let k=0;k<3;k++)if((i+r+k)%3)g.fillRect(x+22+k*58,top+22+r*52,34,30);
      g.fillStyle=c;rr(g,x+14,h-250,bw-28,62,10);g.fill();
      g.fillStyle='#FFF7E6';g.textAlign='center';g.textBaseline='middle';fit(g,n,800,FD,40,bw-50);g.fillText(n,x+bw/2,h-217);
      g.fillStyle='rgba(255,226,160,.9)';g.fillRect(x+24,h-178,bw-48,110);
      g.fillStyle='rgba(60,40,20,.35)';g.fillRect(x+bw/2-2,h-178,4,110);
    });
    g.fillStyle='#1A2233';g.fillRect(0,h-62,w,62);
    g.strokeStyle='#FFE08A';g.lineWidth=2;g.beginPath();g.moveTo(0,40);for(let x=0;x<=w;x+=40)g.quadraticCurveTo(x+20,62,x+40,40);g.stroke();
    for(let x=20;x<w;x+=40){g.fillStyle=['#FFD36B','#FF8F6B','#9BE3D6'][x/40%3|0];g.beginPath();g.arc(x,52,5,0,7);g.fill()}
  });
  const winGroup=new THREE.Group();scene.add(winGroup);
  mesh(new THREE.PlaneGeometry(ww,wh),new THREE.MeshBasicMaterial({map:al,toneMapped:false}),winGroup,{x:wx,y:wy,z:-3.185,cast:false});
  // 올빼미버스가 창밖을 지나간다
  const busT=tex(256,96,(g,w,h)=>{g.fillStyle='#1F4E8C';rr(g,0,0,w,h-16,14);g.fill();g.fillStyle='#FFE7A0';for(let i=0;i<5;i++)g.fillRect(14+i*44,12,34,30);g.fillStyle='#fff';g.font=`800 22px ${FB}`;g.fillText('N26',196,70);g.fillStyle='#111';g.beginPath();g.arc(50,h-14,13,0,7);g.arc(200,h-14,13,0,7);g.fill()});
  out.bus=mesh(new THREE.PlaneGeometry(.62,.23),new THREE.MeshBasicMaterial({map:busT,transparent:true,toneMapped:false}),winGroup,{y:wy-wh/2+.17,z:-3.183,cast:false});
  out.busX=T=>{const p=((T*.12)%1.6)/1.6;return wx-ww/2-.4+p*(ww+.8)};
  // 창 밖에 버스가 나가면 가려 주는 벽
  const wallM=M('#DCE7E3',{roughness:.9});
  mesh(new THREE.PlaneGeometry(.9,.4),wallM,winGroup,{x:wx-ww/2-.45,y:wy-wh/2+.17,z:-3.18,cast:false});
  mesh(new THREE.PlaneGeometry(.9,.4),wallM,winGroup,{x:wx+ww/2+.45,y:wy-wh/2+.17,z:-3.18,cast:false});
  const frame=M('#F3EFE6',{roughness:.5});
  [[0,wh/2,ww+.16,.08],[0,-wh/2,ww+.16,.08],[-ww/2,0,.08,wh],[ww/2,0,.08,wh],[0,0,.05,wh],[0,.15,ww,.04]].forEach(([x,y,w,h])=>mesh(new THREE.BoxGeometry(w,h,.08),frame,winGroup,{x:wx+x,y:wy+y,z:-3.15}));
  mesh(new THREE.BoxGeometry(ww+.3,.05,.22),frame,winGroup,{x:wx,y:wy-wh/2-.05,z:-3.1});
  const moon=new THREE.PointLight('#9FC3FF',1.2,6,2);moon.position.set(wx,wy,-2.6);scene.add(moon);

  // 뒤 조리대 소품: 라디오, 책, 화분
  const radio=new THREE.Group();radio.position.set(1.15,.94,-2.82);scene.add(radio);
  mesh(new RoundedBoxGeometry(.5,.3,.18,4,.04),M(C.coral,{roughness:.45}),radio,{y:.15});
  mesh(new THREE.CylinderGeometry(.085,.085,.01,24),M('#3a2a22'),radio,{x:-.11,y:.15,z:.092,rx:Math.PI/2});
  [.1,.17].forEach(x=>mesh(new THREE.CylinderGeometry(.025,.025,.03,16),M(C.cream),radio,{x,y:.17,z:.095,rx:Math.PI/2}));
  mesh(new THREE.CylinderGeometry(.006,.006,.42),metal(),radio,{x:.18,y:.48,rz:-.35});
  const book=new THREE.Group();book.position.set(1.95,.94,-2.9);book.rotation.y=-.12;scene.add(book);
  const cover=new THREE.TextureLoader().load('img/fb-book-cover.jpg');cover.colorSpace=THREE.SRGBColorSpace;
  mesh(new THREE.BoxGeometry(.34,.38,.04),[M('#eee'),M('#eee'),M('#eee'),M('#eee'),M('#fff',{map:cover,roughness:.5}),M('#ddd')],book,{y:.19,rx:-.12,z:.02});
  mesh(new THREE.BoxGeometry(.3,.02,.16),M('#1E2A28'),book,{y:.01,z:.04});
  const plant=new THREE.Group();plant.position.set(4.0,.94,-2.85);scene.add(plant);
  mesh(new THREE.CylinderGeometry(.16,.12,.26,24),M('#C8664B'),plant,{y:.13});
  const leaf=M('#3F8A55',{roughness:.7});
  [[0,.42,0,.17],[.12,.36,.05,.12],[-.12,.34,0,.13],[.04,.55,-.03,.12],[-.06,.5,.08,.1]].forEach(([x,y,z,r])=>mesh(new THREE.SphereGeometry(r,16,12),leaf,plant,{x,y,z}));
  // 김치 항아리 놓을 자리 대신 큰 들통
  const stock=new THREE.Group();stock.position.set(-3.3,.94,-2.8);scene.add(stock);
  mesh(new THREE.CylinderGeometry(.24,.24,.42,28),metal('#B9C0C4',.3),stock,{y:.21});
  mesh(new THREE.CylinderGeometry(.25,.25,.03,28),metal('#AEB5B9',.3),stock,{y:.43});

  // 왼벽 냄비 걸이
  mesh(new THREE.CylinderGeometry(.015,.015,2.2,10),metal(),scene,{x:-5.12,y:2.55,z:-1.9,rx:Math.PI/2});
  [[-2.7,.24,C.coral],[-1.95,.19,C.teal],[-1.25,.16,C.amber]].forEach(([z,r,c])=>{
    const p=new THREE.Group();p.position.set(-5.1,2.5,z);scene.add(p);
    mesh(new THREE.CylinderGeometry(r,r*.9,.06,28),M(c,{roughness:.4}),p,{x:.04,y:-r-.2,rz:Math.PI/2});
    mesh(new THREE.BoxGeometry(.03,.24,.04),M('#1E2A28'),p,{x:.04,y:-.1});
  });

  // 펜던트 조명
  [[-1.05,C.coral],[1.05,C.teal]].forEach(([x,c])=>{
    const g=new THREE.Group();g.position.set(x,4.6,.3);scene.add(g);out.lamps.push(g);
    mesh(new THREE.CylinderGeometry(.008,.008,1.5,6),M('#222'),g,{y:-.75,cast:false});
    mesh(new THREE.CylinderGeometry(.06,.3,.26,32,1,true),M(c,{side:THREE.DoubleSide,roughness:.45}),g,{y:-1.6,cast:false});
    mesh(new THREE.SphereGeometry(.07,16,12),new THREE.MeshBasicMaterial({color:'#FFE9B8'}),g,{y:-1.7,cast:false});
    const pl=new THREE.PointLight('#FFD9A0',4.5,6,1.6);pl.position.y=-1.78;g.add(pl);
  });
  return out;
}

function buildJar(j,i){
  const g=new THREE.Group();
  const up=!!j.up, idx=up?i-3:i;
  const r=up?.15:.22, h=up?.34:.48;
  g.position.set(up?-3.9+idx*.84:-3.55+idx*1.1,(up?2.445:1.745),-3.0);
  g.userData={jar:j,y0:g.position.y,hop:0,g:0};
  const glass=new THREE.MeshStandardMaterial({color:'#EAF6F4',transparent:true,opacity:.32,roughness:.05,metalness:0,depthWrite:false});
  mesh(new THREE.CylinderGeometry(r,r*.94,h,32),glass,g,{y:h/2,cast:false});
  mesh(new THREE.CylinderGeometry(r*.86,r*.82,h*.66,28),M(j.c,{roughness:.8}),g,{y:h*.35});
  mesh(new THREE.CylinderGeometry(r*1.05,r*1.05,.06,32),M('#B98552'),g,{y:h+.03});
  mesh(new THREE.SphereGeometry(r*.25,16,10),M('#B98552'),g,{y:h+.08});
  const wide=j.k.length>1, lw=wide?360:256;
  const lt=tex(lw,256,(c,w,hh)=>{c.fillStyle='#FFFBF2';rr(c,10,10,w-20,hh-20,28);c.fill();c.strokeStyle=j.c;c.lineWidth=10;rr(c,22,22,w-44,hh-44,20);c.stroke();c.fillStyle=C.ink;c.textAlign='center';c.textBaseline='middle';fit(c,j.k,800,FD,wide?110:150,w-60);c.fillText(j.k,w/2,hh/2+8)});
  const ls=r*1.25;
  mesh(new THREE.PlaneGeometry(ls*lw/256,ls),M('#fff',{map:lt,roughness:.7}),g,{y:h*.48,z:r+.004,cast:false});
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({color:j.c,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,map:tex(64,64,(c,w,hh)=>{const rg=c.createRadialGradient(32,32,0,32,32,32);rg.addColorStop(0,'rgba(255,255,255,1)');rg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=rg;c.fillRect(0,0,w,hh)})}));
  halo.scale.setScalar(r*5);halo.position.y=h/2;g.add(halo);
  g.userData.light=halo;g.userData.glow=v=>g.userData.g=v;
  return g;
}

let boardTex=null;
function drawBoard(b,active){
  boardTex.userData.redraw((g,w,h)=>{
    g.fillStyle='#21403A';g.fillRect(0,0,w,h);
    g.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<40;i++)g.fillRect((i*97)%w,(i*53)%h,60,3);
    g.textAlign='center';g.textBaseline='middle';
    g.fillStyle='#F6EFD9';g.font=`800 54px ${FD}`;g.fillText('오늘의 메뉴',w/2,74);
    g.strokeStyle='rgba(246,239,217,.5)';g.lineWidth=3;g.beginPath();g.moveTo(80,120);g.lineTo(w-80,120);g.stroke();
    g.textAlign='left';
    DISHES.forEach((d,i)=>{
      const y=176+i*88,on=i===active;
      g.fillStyle=d.color;g.beginPath();g.arc(70,y,12,0,7);g.fill();
      g.fillStyle=on?'#FFD36B':'#F6EFD9';fit(g,d.name,on?800:600,FD,44,w-150);g.fillText(d.name,98,y+2);
      if(on){g.strokeStyle='#FFD36B';g.lineWidth=4;g.beginPath();g.ellipse(w/2,y,w/2-30,36,0,0,7);g.stroke()}
    });
    g.fillStyle='rgba(246,239,217,.75)';g.textAlign='center';g.font=`600 30px ${FD}`;g.fillText('뜻 · 땀 · 때  — 셰프 김현성',w/2,h-46);
  });
}
function buildBoard(scene){
  const g=new THREE.Group();g.position.set(-2.55,0,1.3);g.rotation.y=.45;scene.add(g);
  const wood=M('#A8723F',{roughness:.6});
  boardTex=tex(512,680,()=>{});
  const face=new THREE.Group();face.rotation.x=-.12;face.position.y=0;g.add(face);
  mesh(new THREE.BoxGeometry(1.04,1.34,.05),wood,face,{y:.82});
  mesh(new THREE.PlaneGeometry(.92,1.22),M('#fff',{map:boardTex,roughness:.9}),face,{y:.82,z:.027,cast:false});
  const legB=new THREE.Group();legB.rotation.x=.18;legB.position.z=-.42;g.add(legB);
  mesh(new THREE.BoxGeometry(1.0,1.3,.04),wood,legB,{y:.7});
  drawBoard(g,-1);
  return g;
}

function buildIsland(scene){
  const root=new THREE.Group();scene.add(root);
  const z0=.35;
  mesh(new THREE.BoxGeometry(3.8,.84,.9),M('#ECE1CD',{roughness:.7}),root,{y:.46,z:z0,recv:true});
  mesh(new THREE.BoxGeometry(3.8,.08,.86),M('#1E2A28'),root,{y:.04,z:z0+.01,cast:false});
  mesh(new THREE.BoxGeometry(4.0,.07,1.0),M('#F8F5EF',{roughness:.28}),root,{y:.895,z:z0,recv:true});
  // 앞면 간판
  const st=tex(1024,256,(g,w,h)=>{g.fillStyle=C.teal;rr(g,0,0,w,h,36);g.fill();g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=4;rr(g,16,16,w-32,h-32,26);g.stroke();g.fillStyle='#FFFBF2';g.textAlign='center';g.textBaseline='middle';g.font=`800 92px ${FD}`;g.fillText('정책셰프의 주방',w/2,h/2-18);g.fillStyle='#FFD36B';g.font=`600 40px ${FD}`;g.fillText('뜻  ·  땀  ·  때',w/2,h/2+66)});
  mesh(new THREE.PlaneGeometry(1.9,.475),M('#fff',{map:st,roughness:.6}),root,{y:.5,z:z0+.452,cast:false});
  [-1.55,1.55].forEach(x=>mesh(new THREE.BoxGeometry(.02,.72,.01),M('#D6C8AE'),root,{x,y:.47,z:z0+.452,cast:false}));
  // 화구와 냄비
  const px=-.45,pz=.25;
  mesh(new THREE.BoxGeometry(.72,.012,.62),M('#151A1A',{roughness:.2}),root,{x:px,y:.935,z:pz,cast:false});
  const ring=mesh(new THREE.TorusGeometry(.19,.014,8,40),M('#331',{emissive:'#FF5A1F',emissiveIntensity:.35}),root,{x:px,y:.943,z:pz,rx:Math.PI/2,cast:false});
  const pot=new THREE.Group();pot.position.set(px,.942,pz);root.add(pot);
  const prof=[[0,0],[.25,0],[.28,.02],[.285,.06],[.285,.29],[.3,.3],[.3,.315],[.275,.31],[.27,.29],[.27,.03],[0,.025]].map(([x,y])=>new THREE.Vector2(x,y));
  mesh(new THREE.LatheGeometry(prof,48),metal('#CDD3D6',.22),pot,{});
  [-1,1].forEach(s=>mesh(new THREE.TorusGeometry(.05,.013,8,20,Math.PI),metal('#9EA6AA',.3),pot,{x:s*.31,y:.25,rz:s*-Math.PI/2,ry:0}));
  const soup=mesh(new THREE.CircleGeometry(.268,40),M('#E9D8B4',{roughness:.35,emissive:'#3a2a10',emissiveIntensity:.15}),pot,{y:.24,rx:-Math.PI/2,cast:false});
  const bubbles=[];
  for(let k=0;k<7;k++){const a=k*2.4,rr2=.05+(k%3)*.06;bubbles.push(mesh(new THREE.SphereGeometry(.022,10,8),M('#FFF8EA',{roughness:.2,transparent:true,opacity:.85}),pot,{x:Math.cos(a)*rr2,y:.243,z:Math.sin(a)*rr2,cast:false}))}
  // 도마와 채소
  const bd=new THREE.Group();bd.position.set(-1.45,.93,.42);bd.rotation.y=.2;root.add(bd);
  mesh(new RoundedBoxGeometry(.72,.04,.42,3,.015),M('#D9AA6E',{roughness:.6}),bd,{y:.02});
  mesh(new THREE.ConeGeometry(.045,.26,16),M('#E8782E'),bd,{x:-.12,y:.07,z:.05,rz:Math.PI/2,ry:.3});
  mesh(new THREE.SphereGeometry(.075,20,14),M('#D9412B',{roughness:.4}),bd,{x:.15,y:.11,z:-.05});
  mesh(new THREE.ConeGeometry(.03,.05,8),M('#3F8A55'),bd,{x:.15,y:.19,z:-.05});
  mesh(new THREE.BoxGeometry(.2,.006,.045),metal('#DDE2E4',.15),bd,{x:.05,y:.05,z:.13,ry:-.2});
  mesh(new THREE.BoxGeometry(.11,.025,.035),M('#2A2A2A'),bd,{x:-.1,y:.055,z:.17,ry:-.2});
  // 접시와 덮개
  const plate=new THREE.Group();plate.position.set(1.2,.93,.32);root.add(plate);
  const ceramic=M('#FFFFFF',{roughness:.25});
  mesh(new THREE.CylinderGeometry(.34,.28,.03,40),ceramic,plate,{y:.015,recv:true});
  mesh(new THREE.TorusGeometry(.33,.012,8,48),ceramic,plate,{y:.03,rx:Math.PI/2});
  const cloche=new THREE.Group();cloche.position.set(1.2,.96,.32);root.add(cloche);
  mesh(new THREE.SphereGeometry(.29,40,20,0,Math.PI*2,0,Math.PI/2),metal('#D9DEE1',.15),cloche,{});
  mesh(new THREE.SphereGeometry(.045,16,12),metal('#C8A35A',.3),cloche,{y:.31});
  mesh(new THREE.TorusGeometry(.29,.012,8,48),metal('#C8A35A',.3),cloche,{rx:Math.PI/2});
  // 소금 후추
  [[1.72,'#fff'],[1.82,'#2a2a2a']].forEach(([x,c])=>{mesh(new THREE.CylinderGeometry(.035,.04,.13,16),M(c,{roughness:.4}),root,{x,y:.995,z:.62});mesh(new THREE.SphereGeometry(.036,12,8,0,7,0,Math.PI/2),metal(),root,{x,y:1.06,z:.62})});
  return {root,pot,soup,ring,bubbles,plate,cloche};
}

function buildChef(){
  // 김현성을 닮게: 풍성한 곱슬 갈색 머리, 넓은 얼굴, 가는 금테 동그란 안경, 웃는 눈, 남색 재킷에 하늘색 셔츠와 줄무늬 넥타이
  const root=new THREE.Group();
  const navy=M('#2B3E63',{roughness:.7}), navyD=M('#22314F',{roughness:.7}), skin=M('#EDC29E',{roughness:.68}), dark=M('#2A2E36',{roughness:.6}), hair=M('#47321F',{roughness:.8});
  const shirt=M('#BCD5EE',{roughness:.6}), gold=metal('#C49A62',.3);
  // 다리
  [-1,1].forEach(s=>{mesh(new THREE.CylinderGeometry(.1,.09,.82,16),dark,root,{x:s*.13,y:.41});mesh(new RoundedBoxGeometry(.17,.1,.3,3,.04),M('#151515'),root,{x:s*.13,y:.05,z:.05})});
  const body=new THREE.Group();root.add(body);
  const torso=mesh(new THREE.CapsuleGeometry(.31,.36,8,24),navy,body,{y:1.18,s:[1,1,.85]});
  // 셔츠 깃과 넥타이
  mesh(new THREE.CylinderGeometry(.12,.14,.1,20),shirt,body,{y:1.6});
  mesh(new THREE.BoxGeometry(.17,.38,.01),shirt,body,{y:1.37,z:.27,rx:-.05});
  [-1,1].forEach(s=>mesh(new THREE.ConeGeometry(.045,.1,3),shirt,body,{x:s*.05,y:1.57,z:.19,rx:Math.PI*.85,rz:s*.55}));
  const tt=tex(64,256,(g,w,h)=>{g.fillStyle='#24345A';g.fillRect(0,0,w,h);g.save();g.rotate(-.6);for(let y=-60;y<h+60;y+=34){g.fillStyle='#B2333A';g.fillRect(-80,y,240,9);g.fillStyle='#F2EEE6';g.fillRect(-80,y+11,240,3)}g.restore()});
  const tieM=M('#fff',{map:tt,roughness:.55});
  mesh(new THREE.BoxGeometry(.055,.05,.03),tieM,body,{y:1.52,z:.25,rx:-.4});
  mesh(new THREE.BoxGeometry(.06,.32,.012),tieM,body,{y:1.34,z:.281,rx:-.05});
  mesh(new THREE.CylinderGeometry(.043,.043,.012,4,1),tieM,body,{y:1.18,z:.282,rx:Math.PI/2,ry:Math.PI/4});
  // 재킷 깃
  [-1,1].forEach(s=>mesh(new THREE.BoxGeometry(.08,.34,.02),navyD,body,{x:s*.125,y:1.4,z:.276,rz:s*.28,rx:-.1}));
  // 앞치마
  const at=tex(256,320,(g,w,h)=>{g.fillStyle='#F7F1E4';g.fillRect(0,0,w,h);g.fillStyle='rgba(19,107,102,.07)';for(let i=0;i<h;i+=8)g.fillRect(0,i,w,2);g.fillStyle=C.teal;g.textAlign='center';g.textBaseline='middle';g.font=`800 50px ${FD}`;g.fillText('정책',w/2,92);g.fillText('셰프',w/2,152);g.fillStyle=C.coral;g.font=`600 26px ${FD}`;g.fillText('뜻·땀·때',w/2,204);g.strokeStyle='rgba(19,107,102,.35)';g.lineWidth=4;rr(g,58,238,140,56,10);g.stroke()});
  const apM=M('#F7F1E4',{roughness:.85});
  mesh(new THREE.BoxGeometry(.5,.46,.02),[apM,apM,apM,apM,M('#fff',{map:at,roughness:.85}),apM],body,{y:.88,z:.28,rx:-.04});
  mesh(new THREE.TorusGeometry(.3,.014,6,32),apM,body,{y:1.1,rx:Math.PI/2,s:[1,.86,1]});
    // 단추
  [1.24,1.36].forEach(y=>[-1,1].forEach(s=>mesh(new THREE.SphereGeometry(.017,10,8),gold,body,{x:s*.2,y,z:.22,cast:false})));
  // 머리
  const head=new THREE.Group();head.position.y=1.63;body.add(head);
  mesh(new THREE.CylinderGeometry(.09,.1,.12,16),skin,head,{y:.03});
  mesh(new THREE.SphereGeometry(.28,40,30),skin,head,{y:.31,s:[1.06,1.04,.95]});
  mesh(new THREE.SphereGeometry(.24,32,20),skin,head,{y:.2,z:.01,s:[1.12,.8,.92]}); // 넓은 턱과 볼
  [-1,1].forEach(s=>mesh(new THREE.SphereGeometry(.06,16,12),skin,head,{x:s*.295,y:.3,s:[.55,1,1]}));
  // 풍성하고 물결진 머리: 위로 부풀어 옆으로 넘긴 앞머리
  mesh(new THREE.SphereGeometry(.31,32,20,0,Math.PI*2,0,Math.PI*.5),hair,head,{y:.34,z:-.035,rx:-.3,s:[1.1,1.15,1.06]});
  [[-.16,.52,.12,.11,[1.15,.85,1],.5],[-.04,.56,.15,.11,[1.2,.85,1],.25],[.08,.56,.14,.11,[1.2,.85,1],0],[.19,.5,.1,.1,[1,.9,1],-.4],
   [-.08,.63,-.02,.17,[1.3,.7,1.1],.1],[.12,.62,-.06,.15,[1.2,.7,1.1],-.15],[-.07,.64,.09,.12,[1.2,.85,1],.3],[.09,.64,.08,.12,[1.2,.85,1],-.2],[0,.55,-.2,.17,[1.3,.8,1],0],
   [-.28,.43,-.02,.09,[.8,1.1,1.1],0],[.28,.43,-.02,.09,[.8,1.1,1.1],0],[-.25,.4,-.16,.12,[.9,1,1],0],[.25,.4,-.16,.12,[.9,1,1],0],[0,.36,-.25,.16,[1.3,.9,.8],0]]
   .forEach(([x,y,z,r,sc,rz])=>mesh(new THREE.SphereGeometry(r,20,14),hair,head,{x,y,z,s:sc,rz}));
  [[-.02,.7,.13,-.9],[.16,.64,.12,-1.2],[-.17,.64,.1,.7]].forEach(([x,y,z,r])=>mesh(new THREE.ConeGeometry(.03,.11,8),hair,head,{x,y,z,rz:r,rx:.5}));
  const eyes=[];
  [-1,1].forEach(s=>{
    // 웃는 가는 눈
    const e=mesh(new THREE.SphereGeometry(.03,16,12),M('#1E1712',{roughness:.3}),head,{x:s*.105,y:.315,z:.262,s:[1.4,.42,.5]});e.userData.sy=.42;eyes.push(e);
    // 금테 동그란 안경
    mesh(new THREE.TorusGeometry(.085,.0065,8,36),gold,head,{x:s*.105,y:.315,z:.285,cast:false});
    mesh(new THREE.CylinderGeometry(.005,.005,.27,6),gold,head,{x:s*.205,y:.325,z:.15,rx:Math.PI/2,ry:s*.12,cast:false});
    // 짙고 곧은 눈썹
    mesh(new RoundedBoxGeometry(.11,.032,.025,2,.01),hair,head,{x:s*.105,y:.425,z:.25,rz:s*.07});
    mesh(new THREE.SphereGeometry(.045,12,10),M('#F0A08C',{roughness:.9,transparent:true,opacity:.35}),head,{x:s*.19,y:.22,z:.225,s:[1,.7,.3],cast:false});
  });
  mesh(new THREE.TorusGeometry(.022,.0055,6,12,Math.PI),gold,head,{y:.325,z:.29,cast:false});
  // 코: 콧대와 둥근 코끝
  mesh(new THREE.CapsuleGeometry(.022,.05,4,8),skin,head,{y:.29,z:.28,rx:.25});
  mesh(new THREE.SphereGeometry(.043,16,12),M('#E6B48E',{roughness:.65}),head,{y:.245,z:.295,s:[1.25,.95,1]});
  [-1,1].forEach(s=>mesh(new THREE.SphereGeometry(.024,10,8),M('#E6B48E',{roughness:.65}),head,{x:s*.04,y:.235,z:.28}));
  // 입: 다문 채 살짝 웃는 입
  const mouth=new THREE.Group();mouth.position.set(0,.165,.268);head.add(mouth);
  const a=Math.PI*.6;
  mesh(new THREE.TorusGeometry(.065,.009,8,20,a),M('#9A4A3C'),mouth,{y:.065,rz:-Math.PI/2-a/2,cast:false});
  // 토크 모자: 머리숱 위에 살짝 뒤로 얹는다
  const hat=new THREE.Group();hat.position.set(.02,.7,-.17);hat.rotation.set(-.38,0,-.1);hat.scale.setScalar(.76);head.add(hat);
  mesh(new THREE.CylinderGeometry(.25,.26,.17,32),M('#FBFAF6',{roughness:.78}),hat,{});
  mesh(new THREE.CylinderGeometry(.252,.262,.03,32),M('#E8E4DA'),hat,{y:-.07});
  [[0,.24,0,.2],[.15,.18,.08,.15],[-.15,.18,.08,.15],[.13,.18,-.12,.15],[-.13,.18,-.12,.15],[0,.2,.16,.14],[0,.3,0,.13]].forEach(([x,y,z,r])=>mesh(new THREE.SphereGeometry(r,24,16),M('#FBFAF6',{roughness:.78}),hat,{x,y,z}));
  // 팔
  function arm(s){
    const sh=new THREE.Group();sh.position.set(s*.35,1.46,0);body.add(sh);
    mesh(new THREE.SphereGeometry(.1,16,12),navy,sh,{});
    mesh(new THREE.CapsuleGeometry(.088,.24,6,14),navy,sh,{y:-.18});
    const el=new THREE.Group();el.position.y=-.36;sh.add(el);
    mesh(new THREE.CapsuleGeometry(.08,.2,6,14),navy,el,{y:-.13});
    mesh(new THREE.TorusGeometry(.072,.02,8,20),shirt,el,{y:-.27,rx:Math.PI/2});
    const hand=new THREE.Group();hand.position.y=-.34;el.add(hand);
    mesh(new THREE.SphereGeometry(.078,16,12),skin,hand,{s:[1,1.05,.9]});
    mesh(new THREE.SphereGeometry(.032,10,8),skin,hand,{x:s*-.06,y:.02,z:.04});
    return {sh,el,hand};
  }
  const armR=arm(-1), armL=arm(1);
  // 국자
  const ladle=new THREE.Group();armR.hand.add(ladle);
  const steel=metal('#D5DADD',.2);
  mesh(new THREE.CylinderGeometry(.012,.012,.5,10),steel,ladle,{y:-.2});
  mesh(new THREE.SphereGeometry(.07,20,12,0,Math.PI*2,Math.PI/2,Math.PI/2),metal('#D5DADD',.2,{side:THREE.DoubleSide}),ladle,{y:-.43});
  mesh(new THREE.CylinderGeometry(.016,.016,.1,10),M(C.coral),ladle,{y:.08});
  return {root,body,torso,head,eyes,mouth,armR,armL,ladle,w:{stir:0,pres:0,wave:0},wave:0,blink:0,talk:0};
}

// 접시마다 올라가는 작은 모형
function buildProp(id){
  const g=new THREE.Group();
  if(id==='owl'){
    const bus=new THREE.Group();bus.position.y=.12;bus.rotation.y=-.5;g.add(bus);
    mesh(new RoundedBoxGeometry(.46,.2,.2,3,.04),M('#1F4E8C',{roughness:.4}),bus,{});
    const lit=new THREE.MeshStandardMaterial({color:'#FFE7A0',emissive:'#FFC94D',emissiveIntensity:.8});
    for(let i=0;i<4;i++){mesh(new THREE.BoxGeometry(.075,.06,.005),lit,bus,{x:-.15+i*.1,y:.035,z:.101,cast:false});mesh(new THREE.BoxGeometry(.075,.06,.005),lit,bus,{x:-.15+i*.1,y:.035,z:-.101,cast:false})}
    mesh(new THREE.BoxGeometry(.005,.08,.16),lit,bus,{x:.231,y:.03,cast:false});
    [[-.14,1],[.14,1],[-.14,-1],[.14,-1]].forEach(([x,s])=>mesh(new THREE.CylinderGeometry(.04,.04,.03,16),M('#151515'),bus,{x,y:-.1,z:s*.09,rx:Math.PI/2}));
    // 올빼미 눈 전조등
    [-.05,.05].forEach(z=>mesh(new THREE.SphereGeometry(.02,10,8),new THREE.MeshBasicMaterial({color:'#FFF6C8'}),bus,{x:.232,y:-.05,z,cast:false}));
    mesh(new THREE.ConeGeometry(.03,.05,4),M('#1F4E8C'),bus,{x:.17,y:.12,z:-.05});mesh(new THREE.ConeGeometry(.03,.05,4),M('#1F4E8C'),bus,{x:.17,y:.12,z:.05});
  }else if(id==='cheong'){
    [[0,.09,0,.13,C.teal],[.12,.27,.02,.1,'#F4EBDD'],[-.1,.4,-.02,.085,C.amber]].forEach(([x,y,z,r,c])=>{
      const b=new THREE.Group();b.position.set(x,y,z);g.add(b);
      mesh(new THREE.SphereGeometry(r,24,16),M(c,{roughness:.5}),b,{s:[1.3,.85,.7]});
      mesh(new THREE.ConeGeometry(r*.35,r*.6,10),M(c,{roughness:.5}),b,{x:-r*.5,y:-r*.75,rz:-.5});
      [-1,0,1].forEach(k=>mesh(new THREE.SphereGeometry(r*.13,8,6),M(C.ink),b,{x:k*r*.38,z:r*.62,cast:false}));
    });
  }else if(id==='highfive'){
    mesh(new THREE.CylinderGeometry(.08,.08,.26,24),new THREE.MeshStandardMaterial({color:'#EAF6F4',transparent:true,opacity:.4,roughness:.05}),g,{y:.13,cast:false});
    mesh(new THREE.CylinderGeometry(.07,.07,.17,24),M(C.amber,{emissive:C.amber,emissiveIntensity:.3}),g,{y:.1});
    mesh(new THREE.CylinderGeometry(.085,.085,.06,24),M(C.teal),g,{y:.29});
    mesh(new THREE.CylinderGeometry(.05,.05,.04,24),metal('#C9CED1'),g,{y:.34});
    // 하이파이브 손바닥
    const p=new THREE.Group();p.position.set(.18,.14,.02);p.rotation.z=-.25;g.add(p);
    const sk=M('#F1C7A3',{roughness:.7});
    mesh(new RoundedBoxGeometry(.12,.13,.04,3,.02),sk,p,{});
    [-.042,-.014,.014,.042].forEach((x,k)=>mesh(new THREE.CapsuleGeometry(.014,.06+(k%3?.015:0),4,8),sk,p,{x,y:.1}));
    mesh(new THREE.CapsuleGeometry(.015,.045,4,8),sk,p,{x:-.07,y:.01,rz:.9});
  }else if(id==='baemin'){
    const bowl=[[0,0],[.12,0],[.2,.04],[.24,.13],[.245,.14]].map(([x,y])=>new THREE.Vector2(x,y));
    mesh(new THREE.LatheGeometry(bowl,40),M('#F4EBDD',{side:THREE.DoubleSide,roughness:.3}),g,{});
    mesh(new THREE.CircleGeometry(.225,32),M('#C8321E',{roughness:.3}),g,{y:.115,rx:-Math.PI/2,cast:false});
    for(let i=0;i<9;i++){const a=i*.7,r=.05+(i%3)*.05;mesh(new THREE.CapsuleGeometry(.022,.07,4,8),M('#E9573A',{roughness:.35}),g,{x:Math.cos(a)*r,y:.135,z:Math.sin(a)*r,rz:Math.PI/2,ry:a*1.7})}
    [[.06,.1],[-.09,-.04]].forEach(([x,z])=>mesh(new THREE.CylinderGeometry(.04,.04,.01,3),M('#F2D59A'),g,{x,y:.14,z,rx:.2}));
    mesh(new THREE.SphereGeometry(.035,12,10),M('#fff'),g,{x:-.02,y:.15,z:.1,s:[1,.8,1.2]});
    // 독립 깃발
    mesh(new THREE.CylinderGeometry(.005,.005,.34),M('#6b4a2a'),g,{x:.14,y:.28,z:-.08});
    const ft=tex(128,80,(c,w,h)=>{c.fillStyle=C.coral;c.fillRect(0,0,w,h);c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.font=`800 40px ${FD}`;c.fillText('독립',w/2,h/2+3)});
    mesh(new THREE.PlaneGeometry(.16,.1),M('#fff',{map:ft,side:THREE.DoubleSide}),g,{x:.22,y:.39,z:-.08,cast:false});
  }else{
    const chip=new THREE.Group();chip.position.y=.05;g.add(chip);
    mesh(new RoundedBoxGeometry(.34,.06,.34,3,.02),M('#1E2A28',{roughness:.4}),chip,{});
    const pin=metal('#C8A35A');
    for(let i=0;i<5;i++)[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>mesh(new THREE.BoxGeometry(a?.06:.025,.012,b?.06:.025),pin,chip,{x:a?a*.19:-.12+i*.06,z:b?b*.19:-.12+i*.06,y:-.01,cast:false}));
    mesh(new THREE.BoxGeometry(.18,.012,.18),new THREE.MeshStandardMaterial({color:'#5BBFB5',emissive:'#5BBFB5',emissiveIntensity:.9}),chip,{y:.035,cast:false});
    // 사장님 왕관
    const crown=new THREE.Group();crown.position.y=.12;chip.add(crown);
    const gold=metal('#E2B34B');
    mesh(new THREE.CylinderGeometry(.1,.1,.06,24,1,true),metal('#E2B34B',.3,{side:THREE.DoubleSide}),crown,{});
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2;mesh(new THREE.ConeGeometry(.025,.07,6),gold,crown,{x:Math.cos(a)*.09,y:.06,z:Math.sin(a)*.09});mesh(new THREE.SphereGeometry(.013,8,6),M(i%2?C.coral:C.sky),crown,{x:Math.cos(a)*.09,y:.1,z:Math.sin(a)*.09})}
  }
  return g;
}
