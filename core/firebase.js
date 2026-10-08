import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const config=window.CS_FIREBASE_CONFIG;
if(!config) throw new Error('Firebase configuration missing');
const app=getApps().length?getApps()[0]:initializeApp(config);
export const auth=getAuth(app);
export const db=getFirestore(app);
export { app };