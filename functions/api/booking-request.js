// Cloudflare Pages Function — bookings for U.S. Virgin Islands
const escapeHtml=s=>String(s||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const toText=(obj,keys)=>keys.map(k=>k+": "+String(obj[k]||"")).join("\n");
export async function onRequestPost({request,env}){
const country="U.S. Virgin Islands";
const host=new URL(request.url).hostname;
const allowedHost="usvi.tranquilitasspa.com";
if(host!==allowedHost&&!host.endsWith(".pages.dev")&&host!=="localhost")return Response.json({ok:false,error:"Host mismatch."},{status:403});
if(!String(request.headers.get("content-type")||"").includes("application/json"))return Response.json({ok:false,error:"JSON required."},{status:415});
const len=Number(request.headers.get("content-length")||0);if(len>12000)return Response.json({ok:false,error:"Too much information."},{status:413});
let data;try{data=await request.json()}catch{return Response.json({ok:false,error:"Invalid request."},{status:400})}
if(!data||typeof data!=="object"||Array.isArray(data))return Response.json({ok:false,error:"Invalid request."},{status:400});
if(data.website||data.company_fax)return Response.json({ok:true}); // Anti-bot field
const keys=["service","duration","area","property","date","time","name","email","phone","notes","sourcePage"];
const clean={};for(const key of keys){const v=String(data[key]??"").trim();if(v.length>1200)return Response.json({ok:false,error:"Field too long."},{status:400});clean[key]=v}
for(const key of ["service","duration","area","property","date","time","name","email","phone"]){if(!clean[key])return Response.json({ok:false,error:"Please complete the required fields."},{status:400})}
if(!/^\d{4}-\d{2}-\d{2}$/.test(clean.date)||!/^\d{2}:\d{2}$/.test(clean.time))return Response.json({ok:false,error:"Invalid date or time."},{status:400});
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)||clean.email.length>254)return Response.json({ok:false,error:"Invalid email."},{status:400});
if(!/^[+0-9() .-]{7,25}$/.test(clean.phone))return Response.json({ok:false,error:"Invalid phone."},{status:400});
if(!["60","90"].includes(clean.duration))return Response.json({ok:false,error:"Invalid duration."},{status:400});
if(!env.RESEND_API_KEY||!env.BOOKING_FROM_EMAIL)return Response.json({ok:false,error:"Secure delivery is not configured. Use WhatsApp."},{status:503});
const stamp=new Date().toISOString();const id="TQ-"+country.replace(/[^A-Z]/gi,"").slice(0,4).toUpperCase()+"-"+Date.now().toString(36).toUpperCase();
const text="New Tranquilitas booking request\nReference: "+id+"\nDestination: "+country+"\n"+toText(clean,keys)+"\nSubmitted at: "+stamp+"\nStatus: PENDING — do not confirm before checking local therapist and property access.";
const html="<h2>New "+escapeHtml(country)+" booking request</h2><p><b>Reference:</b> "+escapeHtml(id)+"</p><p><b>Status:</b> Pending local availability and access review.</p><table style='border-collapse:collapse'>"+keys.map(k=>"<tr><td style='padding:6px;border-bottom:1px solid #ddd'><b>"+escapeHtml(k)+"</b></td><td style='padding:6px;border-bottom:1px solid #ddd'>"+escapeHtml(clean[k])+"</td></tr>").join("")+"</table>";
const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:env.BOOKING_FROM_EMAIL,to:["info@massagebahamas.com","amar@massagebahamas.com"],subject:"["+country+"] Massage request "+id,html,text,reply_to:clean.email})}).catch(()=>null);
if(!response||!response.ok)return Response.json({ok:false,error:"Email delivery failed. Use WhatsApp."},{status:502});
return Response.json({ok:true,reference:id});
}
export function onRequestGet(){return new Response("Method not allowed",{status:405,headers:{"Allow":"POST"}})}
