(() => {
  'use strict';
  const cfg = window.CS_FIREBASE_CONFIG;
  if (!cfg || !window.CS_FIREBASE_ENABLED) {
    window.CS_FIREBASE_READY = false;
    return;
  }
  try {
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    window.CS_AUTH = firebase.auth();
    window.CS_DB = firebase.firestore();
    window.CS_FIREBASE_READY = true;
  } catch (e) {
    console.error('Firebase initialization failed', e);
    window.CS_FIREBASE_READY = false;
  }
})();
