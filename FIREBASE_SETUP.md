# Firebase cloud setup

The portal works in local mode without Firebase. Firebase is optional but recommended if you want the same study profile to sync across devices.

## 1. Create Firebase project

Create a project in Firebase Console and add a **Web app**.

## 2. Enable Authentication

In Firebase Authentication, enable **Email/Password** sign-in.

## 3. Create Firestore

Create a Firestore database. Start in production mode and apply the `firestore.rules` file from this repository.

## 4. Add the web configuration

Copy the Web app configuration into `firebase-config.js`:

```js
window.CS_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
window.CS_FIREBASE_ENABLED = true;
```

These web configuration values are intended for client-side use. **Do not put a Firebase service-account private key in this repository.**

## 5. Firestore security

Deploy `firestore.rules`. The rules restrict each user to their own `/users/{uid}` document and their own subcollections.

## 6. GitHub Pages

After committing the config, GitHub Pages will serve the portal. Open:

`https://yeagerr9.github.io/dsssb-tgt-cs/portal.html`

## What cloud mode stores

The portal currently syncs the study profile document, including syllabus status, status history, targets, coded PYQs, and study sessions. Authentication is handled by Firebase Authentication; passwords are never stored by this application.

## Recommended production hardening

- Add Firebase App Check.
- Keep Firestore rules restrictive.
- Do not store question-paper PDFs or copyrighted bulk content in Firestore unless you have the right to do so.
- Add scheduled notifications through a trusted backend/Cloud Function if you need alerts when the browser is closed.
- Keep an export/import function so your study data is portable.
