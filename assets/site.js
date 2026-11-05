/* U.S. Virgin Islands · accessible booking and navigation */
(()=>{"use strict";
const country="U.S. Virgin Islands";
const whatsapp="12425659382";
const nav=document.getElementById("mainNav"),menu=document.getElementById("menuToggle");
if(menu&&nav){menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.textContent=open?"×":"☰";});document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.textContent="☰";}));}
const dialog=document.getElementById("bookingDialog"),form=document.getElementById("bookingForm"),result=document.getElementById("bookingResult"),submit=document.getElementById("bookingSubmit");
const today=new Date(); const dateField=form?.querySelector('[name="date"]');if(dateField){const d=new Date(today.getTime()-today.getTimezoneOffset()*60000);dateField.min=d.toISOString().slice(0,10);}
document.querySelectorAll("[data-book]").forEach(el=>el.addEventListener("click",(event)=>{event.preventDefault();if(!dialog)return;const target=el.getAttribute("data-service");if(target&&form){const service=form.querySelector('[name="service"]');if(service&&[...service.options].some(opt=>opt.value===target))service.value=target;}result?.classList.remove("show");dialog.showModal();document.body.classList.add("modal-open");}));
document.querySelectorAll("[data-close-booking]").forEach(el=>el.addEventListener("click",()=>dialog?.close()));
if(dialog){dialog.addEventListener("close",()=>document.body.classList.remove("modal-open"));dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});}
function messageFrom(data){return "Hello Tranquilitas, I would like to request a massage.\n\nDestination: "+country+"\nService: "+(data.service||"")+"\nDuration: "+(data.duration||"")+" minutes\nArea: "+(data.area||"")+"\nProperty / meeting point: "+(data.property||"")+"\nDate: "+(data.date||"")+"\nPreferred time: "+(data.time||"")+"\nName: "+(data.name||"")+"\nEmail: "+(data.email||"")+"\nPhone: "+(data.phone||"")+"\nNotes: "+(data.notes||"")+"\nSource: "+location.href+"\n\nPlease confirm availability, any access requirements and final price before payment.";}
if(form){form.addEventListener("submit",async e=>{e.preventDefault();if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form).entries());const url="https://wa.me/"+whatsapp+"?text="+encodeURIComponent(messageFrom(data));const label=submit.textContent;submit.disabled=true;submit.textContent="Sending your request…";result.classList.remove("show");
try{const response=await fetch("/api/booking-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,country,sourcePage:location.pathname})});const payload=await response.json().catch(()=>({}));if(!response.ok||!payload.ok)throw new Error(payload.error||"The request could not be delivered.");
result.innerHTML="<strong>Request delivered.</strong> Our concierge will review therapist availability, location and pricing before confirming the appointment. You have not been charged.";form.reset();result.classList.add("show");submit.textContent=label;
}catch(error){result.innerHTML="The secure form could not confirm delivery. <strong>Your request has not been submitted.</strong> Use WhatsApp to send it directly to our concierge: <a id='bookingFallback' target='_blank' rel='noopener noreferrer'>Send request through WhatsApp</a>. You can also email <a href='mailto:info@massagebahamas.com'>info@massagebahamas.com</a>.";const link=result.querySelector("#bookingFallback");if(link)link.href=url;result.classList.add("show");submit.textContent=label;
}finally{submit.disabled=false;result.scrollIntoView({block:"nearest",behavior:"smooth"});}
});}

// Tranquilitas brand consistency and restrained editorial motion.
document.querySelectorAll(".brand strong").forEach(el=>{
 const subtitle=el.querySelector("small");if(!subtitle)return;
 const nameNode=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
 if(nameNode)nameNode.textContent="Tranquilitas";
 subtitle.textContent=country.toUpperCase()+" · PRIVATE MASSAGE";
});
if("IntersectionObserver" in window&&typeof Element.prototype.animate==="function"&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches){
 const items=document.querySelectorAll(".section .intro,.tile,.split-image,.split-copy,.location,.step,.coastal-interlude .interlude-copy,.coastal-interlude .interlude-photo");
 const observer=new IntersectionObserver((entries,watcher)=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   entry.target.animate([{opacity:.8,transform:"translateY(12px)"},{opacity:1,transform:"translateY(0)"}],{duration:680,easing:"cubic-bezier(.18,.8,.2,1)",fill:"both"});
   watcher.unobserve(entry.target);
  }
 },{threshold:.08,rootMargin:"0px 0px -24px 0px"});
 items.forEach(el=>observer.observe(el));
}

})();
