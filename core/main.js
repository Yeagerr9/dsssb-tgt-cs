import './theme.css';
import {observeAuth,signInOrCreate,resetPassword,verifyEmail,logout} from './auth.js';
import {setUser,load,loadLocal,getState,legacyMigrate} from './store.js';
import {registry,byId} from './registry.js';
import {startRouter,navigate} from './router.js';
const $=id=>document.getElementById(id);
const exams={
 dsssb:{id:'dsssb',label:'DSSSB TGT',full:'DSSSB TGT Computer Science',color:'#60a5fa'},
 bpsc:{id:'bpsc',label:'BPSC TRE 4.0',full:'BPSC TRE 4.0 Computer Science',color:'#5eead4'}
};
let activeExam='dsssb', route='dashboard', user=null;
const navGroups=[
 ['WORKSPACE',['dashboard','syllabus','practice','mocks']],
 ['GENERAL',['paper1','analytics','notes']]
];
function state(){return getState()}
function examScope(m){return !m.exams||m.exams.includes(activeExam)}
function visibleModules(){return registry.filter(examScope)}
function setStatus(text,kind=''){const e=$('authStatus');if(e){e.textContent=text;e.className='notice '+kind}}
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function renderNav(){
 const ds=navGroups.map(([g,ids])=>'<div class="nav-group">'+g+'</div>'+ids.map(id=>{const m=byId[id];if(!m||!examScope(m))return '';return '<button class="nav-item '+(route===id?'active':'')+'" data-route="'+id+'">'+m.icon+' '+m.title+'</button>'}).join('')).join('');
 $('desktopNav').innerHTML=ds;$('mobileNav').innerHTML=visibleModules().slice(0,4).map(m=>'<button class="'+(route===m.id?'active':'')+'" data-route="'+m.id+'">'+m.icon+'<br>'+m.title.split(' ')[0]+'</button>').join('');
 document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>navigate(b.dataset.route));
 document.querySelectorAll('[data-exam]').forEach(b=>b.onclick=()=>{activeExam=b.dataset.exam;state().settings.activeExam=activeExam;localStorage.setItem('cstm-active-exam',activeExam);renderAll()});
 document.querySelectorAll('.exam-switch').forEach(b=>b.classList.toggle('active',b.dataset.exam===activeExam));
}
function examRows(){
 const d=window.CS_CATALOG||{};
 const sets=activeExam==='dsssb'?[d.dsssbTech,d.dsssbPaper1]:[d.bpscSubject,d.bpscMainPaper1,d.bpscPrelims,d.bpscMainGS];
 return sets.flatMap(x=>x||[]);
}
function examStats(){
 const rows=examRows(), ts=state().topicState||{};
 const w=x=>x[2]==='A+'?4:x[2]==='A'?3:x[2]==='B'?2:1;
 const mastery=(x[3]||[]).map(t=>ts[t]?.mastery??.3);
 const total=rows.reduce((s,x)=>s+(x[3]||[]).length,0);
 const done=mastery.filter(x=>x>=.78).length;
 const score=total?Math.round(mastery.reduce((s,x)=>s+x,0)/total*100):0;
 return {rows,total,done,score};
}
function renderBanner(){
 const s=state(),e=exams[activeExam],date=s.settings?.targets?.[activeExam],st=examStats();
 let countdown='Set exam date';if(date){const ms=new Date(date)-Date.now();if(ms<=0)countdown='Exam date reached';else{const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000);countdown=d+'d '+String(h).padStart(2,'0')+'h '+String(m).padStart(2,'0')+'m'}}
 $('examBanner').innerHTML='<div class="banner-cell"><span class="eyebrow">'+e.label+'</span><div class="banner-value">'+e.full+'</div></div><div class="banner-cell"><span class="small">COUNTDOWN</span><div class="banner-value">'+countdown+'</div></div><div class="banner-cell"><span class="small">TOPICS</span><div class="banner-value">'+(st.total-st.done)+' / '+st.total+'</div></div><div class="banner-cell"><span class="small">MASTERED</span><div class="banner-value">'+st.done+' / '+st.total+'</div></div><div class="banner-cell"><span class="small">READINESS</span><div class="banner-value">'+st.score+'%</div></div>';
}
async function renderPage(){
 const m=byId[route]||byId.dashboard;
 if(!examScope(m)){navigate('dashboard');return}
 $('pageTitle').textContent=m.title;$('workspaceEyebrow').textContent=exams[activeExam].label;
 $('content').innerHTML=await m.render($('content'),{exam:activeExam,state:state(),catalog:window.CS_CATALOG,navigate,toast});
 renderNav();renderBanner();
}
function renderAll(){renderNav();renderBanner();renderPage()}
$('authForm').onsubmit=async e=>{e.preventDefault();try{setStatus('Signing in…');user=await signInOrCreate($('authEmail').value.trim(),$('authPassword').value,$('authName').value.trim());await enter(user)}catch(x){setStatus(x.message||x.code||'Authentication failed','error')}};
$('resetBtn').onclick=async()=>{try{await resetPassword($('authEmail').value.trim());setStatus('Password reset email sent.','ok')}catch(x){setStatus(x.message,'error')}};
$('verifyBtn').onclick=async()=>{try{await verifyEmail();setStatus('Verification email sent.','ok')}catch(x){setStatus(x.message,'error')}};
$('signOutBtn').onclick=async()=>{await logout();location.reload()};
async function enter(u){
 user=u;setUser(u.uid);loadLocal();
 try{await load()}catch(e){toast('Cloud read failed; local cache shown.')} 
 const legacy=state().legacy;if(legacy)legacyMigrate(legacy);
 activeExam=state().settings?.activeExam||localStorage.getItem('cstm-active-exam')||'dsssb';
 $('profileName').textContent=u.displayName||state().profile?.displayName||u.email;
 $('profileEmail').textContent=u.email||'';
 $('authGate').classList.add('hidden');$('app').classList.remove('hidden');
 renderAll();
}
observeAuth(async u=>{if(u){try{await enter(u)}catch(e){setStatus(e.message,'error')}}else{$('authGate').classList.remove('hidden');$('app').classList.add('hidden')}});
setInterval(()=>{if(!$('app').classList.contains('hidden')){renderBanner();$('clock').textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}},1000);
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});