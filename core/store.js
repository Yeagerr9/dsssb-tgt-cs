import {db} from './firebase.js';
import {doc,getDoc,setDoc,collection,addDoc,getDocs,deleteDoc,query,orderBy,limit,serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const CACHE='cstm-cache-v1';
let uid=null;
let state={profile:{},topicState:{},attempts:[],mocks:[],notes:[],sessions:[],settings:{}};
export function setUser(id){uid=id}
export function getState(){return state}
export async function load(){
 if(!uid) throw new Error('No authenticated user');
 const ref=doc(db,'users',uid); const snap=await getDoc(ref);
 if(snap.exists()){
   const x=snap.data();
   state={profile:x.profile||{},topicState:x.topicState||{},attempts:x.attempts||[],mocks:x.mocks||[],notes:x.notes||[],sessions:x.sessions||[],settings:x.settings||{},...x};
 }else await save();
 try{localStorage.setItem(CACHE,JSON.stringify(state))}catch(_){}
 return state;
}
export function loadLocal(){
 try{const x=JSON.parse(localStorage.getItem(CACHE)||'null');if(x)state={...state,...x}}catch(_){}
 return state;
}
export async function save(){
 if(!uid)return;
 state.updatedAt=serverTimestamp();
 await setDoc(doc(db,'users',uid),state,{merge:true});
 try{localStorage.setItem(CACHE,JSON.stringify({...state,updatedAt:Date.now()}))}catch(_){}
}
let saveTimer;
export function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>save().catch(console.error),500)}
export async function addAttempt(a){state.attempts.push(a);queueSave();return a}
export async function addMock(m){state.mocks.push(m);queueSave();return m}
export async function saveNote(n){
 const i=state.notes.findIndex(x=>x.id===n.id); if(i>=0)state.notes[i]=n;else state.notes.push(n);queueSave();
}
export async function deleteNote(id){state.notes=state.notes.filter(x=>x.id!==id);queueSave()}
export function patchTopic(id,patch){state.topicState[id]={...(state.topicState[id]||{}),...patch};queueSave()}
export function setSetting(k,v){state.settings[k]=v;queueSave()}
export function legacyMigrate(legacy){
 if(!legacy||state._migratedLegacy)return;
 state.profile={...state.profile,displayName:legacy.displayName||''};
 state.settings={...state.settings,targets:legacy.targets||{},daily:legacy.daily||120,activeExam:legacy.activeExam||'dsssb'};
 Object.entries(legacy.status||{}).forEach(([id,status])=>{state.topicState[id]={...(state.topicState[id]||{}),status,mastery:status.includes('Mastered')?1:status.includes('PYQ Done')?.78:status.includes('Notes Done')?.55:status.includes('Studying')?.25:.3}});
 (legacy.pyq||[]).forEach(q=>state.attempts.push({id:'legacy-'+(q.at||Date.now())+'-'+Math.random(),questionId:q.id||'',topicId:q.t||'',correct:Number(q.correct||0),attempts:Number(q.attempts||0),timestamp:q.at||Date.now(),mode:'legacy'}));
 state._migratedLegacy=true;queueSave();
}