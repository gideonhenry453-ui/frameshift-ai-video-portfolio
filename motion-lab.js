
(()=> {
const host=document.querySelector('#hero-visual');
if(!host)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const target=host.querySelector('.hero-placeholder');if(!target)return;
const orbit=document.createElement('div');orbit.className='orbit-scene';orbit.setAttribute('aria-hidden','true');
orbit.innerHTML='<div class="orbit-light"></div><div class="orbit-core"></div><div class="orbit-ring r1"></div><div class="orbit-ring r2"></div><div class="orbit-ring r3"></div>';
target.prepend(orbit);
const label=document.createElement('div');label.className='motion-counter';label.textContent='MOTION LAB / 001';host.append(label);
const tag=document.createElement('div');tag.className='motion-billboard';tag.textContent='DIMENSIONAL STORYTELLING';host.append(tag);
if(reduced)return;
let rId=0;
function applyMotion(){
const box=host.getBoundingClientRect(),vh=innerHeight||750;
const amount=Math.max(-1,Math.min(1,(box.top+box.height*.5-vh*.5)/(vh+box.height)*2));
const ring=orbit.querySelector('.orbit-core');
if(ring)ring.style.marginTop=(-amount*22)+'px';
rId=0;
}
function queue(){if(rId)return;rId=requestAnimationFrame(applyMotion)}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});queue();
})();
