/* FRAME/SHIFT Motion Lab 001 — unified eased camera */
(() => {
'use strict';
const hero=document.querySelector('.hero');
const host=document.getElementById('hero-visual');
const placeholder=host?.querySelector('.hero-placeholder');
const work=document.getElementById('work');
if(!hero||!host||!placeholder||!work)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse=matchMedia('(hover: none), (pointer: coarse)').matches;
const camera=document.createElement('div');
camera.className='lab-camera';
camera.setAttribute('aria-hidden','true');
const stage=document.createElement('div');
stage.className='lab-stage';
const film=document.createElement('div');film.className='lab-film';
const light=document.createElement('div');light.className='lab-light';
const streak=document.createElement('div');streak.className='lab-streak';
const streak2=document.createElement('div');streak2.className='lab-streak second';
stage.append(film,light,streak,streak2);
const orbit=document.createElement('div');
orbit.className='orbit-scene';
orbit.innerHTML='<div class="orbit-light"></div><div class="orbit-core"></div><div class="orbit-ring r1"></div><div class="orbit-ring r2"></div><div class="orbit-ring r3"></div>';
stage.append(orbit);
camera.append(stage);
placeholder.prepend(camera);
const oldStage=placeholder.querySelector('.showcase-stage');
if(oldStage)stage.append(oldStage);
const counter=document.createElement('div');counter.className='motion-counter';counter.textContent='MOTION LAB / 001';
const label=document.createElement('div');label.className='motion-billboard';label.textContent='DIMENSIONAL STORYTELLING';
host.append(counter,label);
if(reduced)return;
const state={progress:0,mx:0,my:0};
const target={progress:0,mx:0,my:0};
const root=host.style;
let running=false,visible=true;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
function measure(){
 const box=hero.getBoundingClientRect();
 const total=Math.max(1,hero.offsetHeight+Math.min(innerHeight*.24,240));
 target.progress=clamp((-box.top)/total,0,1);
 if(!visible && target.progress===state.progress)return;
 requestTick();
}
function pointer(e){
 if(coarse)return;
 const box=host.getBoundingClientRect();
 if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)return;
 target.mx=clamp(((e.clientX-box.left)/box.width-.5)*2,-1,1);
 target.my=clamp(((e.clientY-box.top)/box.height-.5)*2,-1,1);
 requestTick();
}
function resetPointer(){target.mx=0;target.my=0;requestTick()}
function requestTick(){if(running)return;running=true;requestAnimationFrame(tick)}
function tick(){
 const factor=coarse ? 0.14 : 0.095;
 state.progress+=(target.progress-state.progress)*factor;
 state.mx+=(target.mx-state.mx)*.085;
 state.my+=(target.my-state.my)*.085;
 const p=state.progress;
 // Eased forward dolly. Perspective comes from independent depth planes.
 const smooth=p*p*(3-2*p);
 root.setProperty('--lab-progress',smooth.toFixed(4));
 root.setProperty('--lab-camera-z',(smooth*120).toFixed(2)+'px');
 root.setProperty('--lab-camera-y',(-smooth*34).toFixed(2)+'px');
 root.setProperty('--lab-mouse-x',state.mx.toFixed(4));
 root.setProperty('--lab-mouse-y',state.my.toFixed(4));
 root.setProperty('--lab-pointer-x-px',(state.mx*9).toFixed(2)+'px');
 root.setProperty('--lab-rotate-x',(-state.my*3).toFixed(2)+'deg');
 root.setProperty('--lab-rotate-y',(state.mx*4).toFixed(2)+'deg');
 root.setProperty('--lab-camera-scale',(1+smooth*.20).toFixed(4));
 root.setProperty('--lab-mobile-scale',(1+smooth*.07).toFixed(4));
 root.setProperty('--lab-mobile-y',(-smooth*13).toFixed(2)+'px');
 root.setProperty('--lab-orb-scale',(1+smooth*.14).toFixed(4));
 root.setProperty('--lab-mobile-orb-scale',(1+smooth*.05).toFixed(4));
 root.setProperty('--lab-orb-x',(-state.mx*9).toFixed(2)+'px');
 root.setProperty('--lab-orb-y',(-state.my*6).toFixed(2)+'px');
 root.setProperty('--lab-orb-opacity',(1-smooth*.12).toFixed(4));
 root.setProperty('--lab-overlay-opacity',(.7+smooth*.23).toFixed(4));
 work.style.setProperty('--lab-work-shift',((1-smooth)*-45).toFixed(2)+'px');
 const cards=stage.querySelectorAll('.showcase-card');
 cards.forEach(card=>{
  const v=getComputedStyle(card);
  const num=(key)=>Number.parseFloat(v.getPropertyValue(key))||0;
  card.style.setProperty('--card-translate-x',(state.mx*num('--card-pointer-x')+smooth*num('--card-drift-x')).toFixed(2)+'px');
  card.style.setProperty('--card-translate-y',(state.my*num('--card-pointer-y')+smooth*num('--card-drift-y')).toFixed(2)+'px');
  card.style.setProperty('--card-translate-z',(smooth*num('--card-depth')).toFixed(2)+'px');
 });

 work.style.setProperty('--lab-work-glow',clamp(smooth*1.3,0,1).toFixed(3));
 const remaining=Math.max(Math.abs(target.progress-state.progress),Math.abs(target.mx-state.mx),Math.abs(target.my-state.my));
 if(remaining>.001){requestAnimationFrame(tick)}else{running=false}
}
addEventListener('scroll',measure,{passive:true});
addEventListener('resize',measure,{passive:true});
if(!coarse){host.addEventListener('pointermove',pointer,{passive:true});host.addEventListener('pointerleave',resetPointer)}
const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)measure()},{rootMargin:'350px 0px 350px 0px'});
io.observe(hero);
measure();
})();
