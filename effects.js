
/* FRAME/SHIFT 3D preview system: progressive, accessible, mobile-friendly. */
(()=> {
const gallery=document.querySelector("#gallery");
const stageHost=document.querySelector("#hero-visual");
if(!gallery||!stageHost)return;
const ids=["vege-flumi-ugc","beauty-v2-routine","growboat-lifestyle","avatar-drink","cheeseburger-food","ai-car-dealer-showroom-ad","ai-car-drift-dubai","riviera","ai-ghost-ship-desert","ai-ancient-battle-pov","ai-firefighter-rescue-pov","ai-shark-encounter-pov","ai-time-freeze-times-square","ai-cloud-in-backpack","seedance-duel","v-room-that-changed","gaming-v2-cinematic","o-mona-lisa-hook","o-duck-bathroom"];
const lookup=new Map(ids.map((id,i)=>[id,i]));
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer=matchMedia("(hover: hover) and (pointer: fine)").matches;
function thumb(id) {const index=lookup.get(id)??0;const x=index%5,y=Math.floor(index/5);const node=document.createElement("span");node.className="sprite-thumb";node.style.backgroundPosition=(x*25)+"% "+(y*(100/3))+"%";node.setAttribute("aria-hidden","true");return node;}
function setupCards(){
gallery.querySelectorAll(".work-card").forEach(card=>{
if(card.dataset.activated)return;
card.dataset.activated="1";
const media=card.querySelector(".preview");if(!media)return;
media.prepend(thumb(card.dataset.id));
const caption=document.createElement("span");caption.className="preview-label";caption.textContent="WATCH PROJECT ↗";media.append(caption);
card.addEventListener("pointermove",e=>{
if(!finePointer||reduced)return;
const r=card.getBoundingClientRect();
const dx=(e.clientX-r.left)/r.width-.5;
const dy=(e.clientY-r.top)/r.height-.5;
card.style.setProperty("--tilt-x",(-dy*8).toFixed(2)+"deg");
card.style.setProperty("--tilt-y",(dx*10).toFixed(2)+"deg");
});
card.addEventListener("pointerleave",()=>{
card.style.setProperty("--tilt-x","0deg");card.style.setProperty("--tilt-y","0deg");
const clip=media.querySelector(".card-video");if(clip){clip.pause();clip.remove();}
});
if(finePointer && !reduced)card.addEventListener("pointerenter",()=>{
let clip=media.querySelector(".card-video");
if(clip)return;
clip=document.createElement("video");clip.className="card-video";clip.muted=true;clip.loop=true;clip.playsInline=true;clip.preload="none";clip.setAttribute("aria-hidden","true");clip.src="/media/"+card.dataset.id+".mp4";clip.addEventListener("playing",()=>clip.classList.add("visible"),{once:true});clip.addEventListener("error",()=>clip.remove(),{once:true});media.append(clip);clip.play().catch(()=>clip.remove());
});
});
}
setupCards();
new MutationObserver(setupCards).observe(gallery,{childList:true});
const stage=document.createElement("div");stage.className="showcase-stage";stage.setAttribute("aria-hidden","true");
for(const [id,clazz,label] of [["ai-car-dealer-showroom-ad","one","AUTOMOTIVE"],["beauty-v2-routine","two","BEAUTY"],["vege-flumi-ugc","three","AI UGC"]]){
const card=document.createElement("div");card.className="showcase-card "+clazz;card.dataset.id=id;card.append(thumb(id));const span=document.createElement("span");span.textContent=label;card.append(span);stage.append(card);
}
stageHost.querySelector(".hero-placeholder")?.append(stage);
const modal=document.querySelector("#player");const video=document.querySelector("#video-player");
if(modal&&video){
const poster=document.createElement("div");poster.className="modal-poster";poster.hidden=true;
const posterText=document.createElement("strong");poster.append(posterText);
video.insertAdjacentElement("afterend",poster);
gallery.addEventListener("click",e=>{
const card=e.target.closest(".work-card");if(!card)return;
const t=thumb(card.dataset.id);poster.querySelector(".sprite-thumb")?.remove();poster.prepend(t);
posterText.textContent=card.querySelector(".card-foot strong")?.textContent||"Selected work";
video.hidden=false;poster.hidden=true;
});
video.addEventListener("error",()=>{video.hidden=true;poster.hidden=false;document.querySelector("#player-status").textContent="Original video pending upload. This is a preview frame from the project.";});
modal.addEventListener("close",()=>{poster.hidden=true;video.hidden=false;});
}
})();
