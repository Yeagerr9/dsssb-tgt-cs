# CS Teacher Master Portal

A modular, GitHub Pages-compatible study portal for DSSSB TGT Computer Science and BPSC TRE 4.0.

## Architecture
- `portal.html`: shell only.
- `core/`: Firebase auth, Firestore store, hash router, lazy module registry and theme.
- `engine/`: pure study algorithms.
- `modules/`: independently loadable screens.
- `data/catalog.js`: syllabus/topic catalog.
- `data/questions.json`: verified question bank; intentionally empty until verified questions are added.
- `firestore.rules`: per-user access control.
- `sw.js` + `manifest.webmanifest`: PWA/offline shell.

## Exam workspaces
The DSSSB TGT and BPSC TRE 4.0 switcher changes the complete workspace. Analytics, readiness, planner, practice, mocks, notes and time are scoped to the active exam.

## Algorithms
Mastery, spaced revision, adaptive question selection, readiness, score projection, weak-topic detection, dynamic planning and streak logic live under `engine/`.

## Test
1. Open the portal and create/sign in with Firebase.
2. Switch DSSSB/BPSC and confirm the complete navigation changes scope.
3. Set an exam date in Settings.
4. Add verified questions from Practice Bank.
5. Complete practice answers and verify topic mastery/attempts update.
6. Run 3+ mocks to activate score projection.
7. In the browser console run `CSTM_TESTS()`.
8. Test at 390px width and with keyboard navigation.
