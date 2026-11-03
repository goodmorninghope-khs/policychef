// 공통: 모바일 메뉴, 스크롤 등장
(()=>{
  const b=document.querySelector('.burger'), m=document.getElementById('mmenu');
  if(b&&m){
    const set=o=>{m.hidden=!o;b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'메뉴 닫기':'메뉴 열기')};
    b.addEventListener('click',()=>set(m.hidden));
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
  }
  const els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(e=>e.classList.add('visible'));return}
  document.documentElement.classList.add('js-reveal');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.06,rootMargin:'0px 0px -30px 0px'});
  els.forEach(e=>io.observe(e));
})();

// 첫 화면 사진 넘김: 5초마다 한 장, 움직임 줄이기 설정이면 멈춤
(()=>{
  const box=document.querySelector('.hero2-media'); if(!box)return;
  const imgs=[...box.querySelectorAll('.slides img')], ticks=[...box.querySelectorAll('.ticks i')];
  const y=box.querySelector('.hero2-cap .y'), t=box.querySelector('.hero2-cap .t');
  if(imgs.length<2||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  imgs.slice(1).forEach(im=>{im.loading='eager'});
  let i=0, timer;
  const show=n=>{
    imgs[i].classList.remove('on'); ticks[i]&&ticks[i].classList.replace('on','done');
    i=n%imgs.length;
    if(i===0)ticks.forEach(k=>k.classList.remove('done','on'));
    imgs[i].classList.add('on');
    if(ticks[i]){ticks[i].classList.remove('done');void ticks[i].offsetWidth;ticks[i].classList.add('on')}
    y.textContent=imgs[i].dataset.y; t.textContent=imgs[i].dataset.cap;
  };
  const run=()=>{clearInterval(timer);timer=setInterval(()=>show(i+1),5000)};
  document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(timer):run());
  run();
})();
