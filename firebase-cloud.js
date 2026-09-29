import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, setPersistence, browserLocalPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const cfg=window.CS_FIREBASE_CONFIG||{};
const configured=Boolean(window.CS_FIREBASE_ENABLED && cfg.apiKey && cfg.authDomain && cfg.projectId && cfg.appId);
let auth=null,db=null;
if(configured){
  try{
    const app=initializeApp(cfg); auth=getAuth(app); db=getFirestore(app);
    await setPersistence(auth,browserLocalPersistence);
    window.CSCloud={configured:true,auth,db,
      async signUp(email,password,name){const c=await createUserWithEmailAndPassword(auth,email,password);if(name)await updateProfile(c.user,{displayName:name});await setDoc(doc(db,'users',c.user.uid),{displayName:name||email.split('@')[0],email:c.user.email,createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});return c.user;},
      async signIn(email,password){const c=await signInWithEmailAndPassword(auth,email,password);return c.user;},
      async signOut(){return signOut(auth);},
      async resetPassword(email){return sendPasswordResetEmail(auth,email);},
      async load(uid){const s=await getDoc(doc(db,'users',uid));return s.exists()?s.data():null;},
      async save(uid,payload){await setDoc(doc(db,'users',uid),{...payload,updatedAt:serverTimestamp(),email:auth.currentUser?.email||null},{merge:true});},
      onAuth(cb){return onAuthStateChanged(auth,cb)}
    };
  }catch(e){window.CSCloud={configured:false,error:e};}
}else{window.CSCloud={configured:false,error:new Error('Firebase is not configured')};}
window.dispatchEvent(new CustomEvent('cs-cloud-ready'));
