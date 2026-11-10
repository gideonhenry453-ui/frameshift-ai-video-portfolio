
(() => {
'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) return;
const root=document.documentElement;
root.classList.add('motion-on');
const bar=document.createElement('div');
bar.className='scroll-progress';
bar.setAttribute('aria-hidden','true');
document.body.append(bar);
const header=document.querySelector('header.wrap');
let ticking=false;
function syncScroll(){
 const y=window.scrollY||0;
 const range=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
 root.style.setProperty('--scroll-progress',Math.min(1,y/range).toFixed(4));
 root.style.setProperty('--scroll-shift',Math.min(550,y)+'px');
 if(header) header.classList.toggle('scrolled',y>36);
 ticking=false;
}
function queueScroll(){if(!ticking){requestAnimationFrame(syncScroll);ticking=true}}
window.addEventListener('scroll',queueScroll,{passive:true});
window.addEventListener('resize',queueScroll,{passive:true});
syncScroll();
const seen=new WeakSet();
let observer;
if ('IntersectionObserver' in window) {
 observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.remove('pending');
   entry.target.classList.add('revealed');
   observer.unobserve(entry.target);
  });
 },{threshold:0.08,rootMargin:'0px 0px 30px 0px'});
}
function register(){
 const targets=document.querySelectorAll('.section-head, .section-sub, .service, .about-art, .about-copy, .contact .kicker, .contact h2, .contact-flex, .work-card');
 targets.forEach((el,index)=>{
  if(seen.has(el)) return;
  seen.add(el);
  el.classList.add('scroll-reveal');
  el.style.setProperty('--reveal-delay',((index%3)*75)+'ms');
  const r=el.getBoundingClientRect();
  const belowFold=r.top>window.innerHeight*.77;
  if(observer && belowFold){
   el.classList.add('pending');
   observer.observe(el);
  }else {
   el.classList.add('revealed');
  }
 });
}
register();
const gallery=document.getElementById('gallery');
if(gallery){
 let queued=false;
 new MutationObserver(()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;register();queueScroll()});
 }).observe(gallery,{childList:true});
}
})();
