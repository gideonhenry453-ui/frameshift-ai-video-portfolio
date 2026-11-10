/* FRAME/SHIFT Motion Lab / planetary orbital gallery */
(() => {
'use strict';
const host=document.getElementById('hero-visual');
const hero=document.querySelector('.hero');
const placeholder=host?.querySelector('.hero-placeholder');
if(!host||!hero||!placeholder)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=matchMedia('(max-width: 680px)');
const coarse=matchMedia('(hover: none), (pointer: coarse)').matches;
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const camera=document.createElement('div');camera.className='lab-camera';camera.setAttribute('aria-hidden','true');
const stage=document.createElement('div');stage.className='lab-stage';
for(const name of ['lab-film','lab-light','lab-streak','lab-streak second']){
 const e=document.createElement('div');e.className=name;stage.append(e);
}
const orbit=document.createElement('div');orbit.className='orbit-scene';
orbit.innerHTML='<div class="orbit-light"></div><div class="orbit-core"></div><div class="orbit-ring r1"></div><div class="orbit-ring r2"></div><div class="orbit-ring r3"></div>';
stage.append(orbit);
const track=document.createElement('div');track.className='orbit-track';track.setAttribute('aria-hidden','true');stage.append(track);
camera.append(stage);placeholder.prepend(camera);
const cardsStage=placeholder.querySelector('.showcase-stage');
if(cardsStage)stage.append(cardsStage);
const cards=Array.from(stage.querySelectorAll('.showcase-card'));
const counter=document.createElement('div');counter.className='motion-counter';counter.textContent='MOTION LAB / 001';
const tag=document.createElement('div');tag.className='motion-billboard';tag.textContent='DIMENSIONAL STORYTELLING';
host.append(counter,tag);
const state={rotation:0,mx:0,my:0};
const target={rotation:0,mx:0,my:0};
let raf=0;
function measure(){
 // One full revolution while scrolling through the hero and into the work threshold.
 const rect=hero.getBoundingClientRect();
 const distance=Math.max(hero.offsetHeight+Math.min(innerHeight*.36,270),1);
 const progress=clamp(-rect.top/distance,0,1);
 target.rotation=progress*Math.PI*2;
 requestFrame();
}
function pointer(event){
 if(reduced||coarse)return;
 const b=host.getBoundingClientRect();
 target.mx=clamp((event.clientX-b.left)/b.width*2-1,-1,1);
 target.my=clamp((event.clientY-b.top)/b.height*2-1,-1,1);
 requestFrame();
}
function resetPointer(){target.mx=0;target.my=0;requestFrame()}
function requestFrame(){if(!raf)raf=requestAnimationFrame(render)}
function render(){
 raf=0;
 const lerp=reduced?1:(mobile.matches?.16:.11);
 state.rotation+=(target.rotation-state.rotation)*lerp;
 state.mx+=(target.mx-state.mx)*(reduced?1:.1);
 state.my+=(target.my-state.my)*(reduced?1:.1);
 const w=host.clientWidth,h=host.clientHeight;
 const small=mobile.matches;
 const radiusX=w*(small?.305:.34);
 const radiusY=h*(small?.155:.18);
 const tilt=-.23;
 const cx=Math.cos(tilt),sx=Math.sin(tilt);
 // Orbit cards on an ellipse in the visible XY plane. Z controls only lighting/scale.
 // sin(angle)>0 is the front/lower half of the orbit.
 cards.forEach((card,index)=>{
  const angle=state.rotation+index*Math.PI*2/3-Math.PI/2;
  const cos=Math.cos(angle),sin=Math.sin(angle);
  const x=cos*radiusX*cx-sin*radiusY*sx;
  const y=cos*radiusX*sx+sin*radiusY*cx;
  const front=(sin+1)*.5;
  const scale=(small?.78:.84)+front*(small?.19:.24);
  const opacity=.78+front*.22;
  const brightness=.78+front*.28;
  const rotateY=(cos*11+state.mx*(small?0:3));
  const rotateZ=cos*-5;
  card.style.setProperty('--orbit-x',(x+state.mx*(small?0:5)).toFixed(2)+'px');
  card.style.setProperty('--orbit-y',(y+state.my*(small?0:4)).toFixed(2)+'px');
  card.style.setProperty('--orbit-scale',scale.toFixed(4));
  card.style.setProperty('--orbit-opacity',opacity.toFixed(4));
  card.style.setProperty('--orbit-brightness',brightness.toFixed(4));
  card.style.setProperty('--orbit-ry',rotateY.toFixed(2)+'deg');
  card.style.setProperty('--orbit-rz',rotateZ.toFixed(2)+'deg');
  card.style.setProperty('--orbit-layer',String(10+Math.round(front*100)));
 });
 host.style.setProperty('--lab-pointer-x-px',(state.mx*(small?0:5)).toFixed(2)+'px');
 host.style.setProperty('--lab-pointer-y-px',(state.my*(small?0:4)).toFixed(2)+'px');
 const error=Math.max(Math.abs(target.rotation-state.rotation),Math.abs(target.mx-state.mx),Math.abs(target.my-state.my));
 if(error>.0008&&!reduced)requestFrame();
}
if(!reduced){
 addEventListener('scroll',measure,{passive:true});
 addEventListener('resize',()=>{measure();requestFrame()},{passive:true});
 if(!coarse){host.addEventListener('pointermove',pointer,{passive:true});host.addEventListener('pointerleave',resetPointer)}
}
measure();render();
})();
