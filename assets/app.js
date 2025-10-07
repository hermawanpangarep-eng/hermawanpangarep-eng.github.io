// therun.app main script
function viewLeaderboard(){
const rows = [
['1','Alex R','Run','5K','00:19:43'],
['2','Jamie T','Bike','10K','00:18:10'],
['3','Sam P','Skate','3K','00:07:58']
];
$('#view').innerHTML = card('Leaderboard', `
<div class="list">${rows.map(r=>`<div class="stat"><div>#${r[0]} ${r[1]}</div><div class="flex"><span class="chip">${r[2]}</span><span class="chip">${r[3]}</span><strong>${r[4]}</strong></div></div>`).join('')}</div>
`);
}


function viewProfile(){
$('#view').innerHTML = card('Your profile', `
<div class="form-row">
<label>Name<br><input id="pName" value="${state.profile.name}"/></label>
<label>City<br><input id="pCity" value="${state.profile.city}" placeholder="Jakarta"/></label>
<label>Units<br><select id="pUnits"><option value="metric" ${state.profile.units==='metric'?'selected':''}>Metric</option><option value="imperial" ${state.profile.units==='imperial'?'selected':''}>Imperial</option></select></label>
<button class="btn" id="pSave">Save</button>
</div>
`);
$('#pSave').addEventListener('click', ()=>{
state.profile = { name:$('#pName').value.trim()||'Guest', city:$('#pCity').value.trim(), units:$('#pUnits').value };
save();
alert('Profile saved');
});
}


// utils
function uid(){ return Math.random().toString(36).slice(2,9); }
function polyDistance(latlngs){
let d=0; for(let i=1;i<latlngs.length;i++){ d+= dist(latlngs[i-1], latlngs[i]); } return d;
}
function dist(a,b){ // km
const toRad = x=> x*Math.PI/180;
const R=6371, dLat=toRad(b.lat-a.lat), dLon=toRad(b.lng-a.lng);
const s1=Math.sin(dLat/2), s2=Math.sin(dLon/2);
const aa=s1*s1 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*s2*s2; return 2*R*Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
}


// PWA install
let deferredPrompt;
function setupInstall(){
const btn = $('#install');
window.addEventListener('beforeinstallprompt', (e)=>{
e.preventDefault(); deferredPrompt = e; btn.hidden=false;
});
btn.addEventListener('click', async ()=>{
if(!deferredPrompt) return; deferredPrompt.prompt();
await deferredPrompt.userChoice; btn.hidden=true; deferredPrompt=null;
});
}


// Register SW
async function registerSW(){
if('serviceWorker' in navigator){
try{ await navigator.serviceWorker.register('/sw.js'); }catch(err){ console.warn('SW reg failed', err); }
}
}
