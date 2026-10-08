import {auth} from './firebase.js';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signOut,updateProfile,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
export function observeAuth(cb){return onAuthStateChanged(auth,cb)}
export async function signInOrCreate(email,password,name){
  try{return (await signInWithEmailAndPassword(auth,email,password)).user}
  catch(e){
    if(!['auth/user-not-found','auth/invalid-credential'].includes(e.code)) throw e;
    const c=await createUserWithEmailAndPassword(auth,email,password);
    if(name) await updateProfile(c.user,{displayName:name});
    try{await sendEmailVerification(c.user)}catch(_){}
    return c.user;
  }
}
export async function resetPassword(email){return sendPasswordResetEmail(auth,email)}
export async function verifyEmail(){if(!auth.currentUser)throw new Error('Sign in first.');return sendEmailVerification(auth.currentUser)}
export async function logout(){return signOut(auth)}
export function currentUser(){return auth.currentUser}