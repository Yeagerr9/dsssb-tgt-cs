(() => {
  'use strict';

  const show = (text, cls) => {
    const el = document.getElementById('authState');
    if (el) {
      el.textContent = text;
      el.className = 'authstate ' + (cls || '');
    }
  };

  const fail = (text) => {
    console.error('[CS Master Portal] Firebase:', text);
    window.CS_FIREBASE_READY = false;
    window.CS_FIREBASE_ERROR = text;
    show('Firebase connection failed: ' + text, 'err');
  };

  const init = () => {
    const cfg = window.CS_FIREBASE_CONFIG;
    if (!cfg) return fail('configuration not loaded');
    if (!window.firebase) return fail('Firebase SDK did not load');

    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      window.CS_AUTH = firebase.auth();
      window.CS_DB = firebase.firestore();
      window.CS_FIREBASE_READY = true;
      window.CS_FIREBASE_ERROR = '';
      show('Firebase connected ✓', 'ok');

      window.CS_AUTH.onAuthStateChanged((user) => {
        window.CS_FIREBASE_USER = user || null;
        if (!user && document.getElementById('login')) {
          show('Firebase connected ✓ — sign in or create an account', 'ok');
        }
      });
    } catch (e) {
      fail(e && e.message ? e.message : String(e));
    }
  };

  let attempts = 0;
  const wait = () => {
    attempts += 1;
    if (window.firebase) return init();
    if (attempts >= 100) return fail('Firebase CDN unavailable');
    setTimeout(wait, 100);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wait, { once: true });
  } else {
    wait();
  }
})();