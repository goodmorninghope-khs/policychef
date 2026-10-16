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
