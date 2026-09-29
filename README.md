# CS Teacher Master Portal

A preparation and analytics portal for **DSSSB TGT Computer Science** and **BPSC TRE 4.0 Computer Science**, including Paper 1 / GS components.

## Current capabilities

- Separate DSSSB and BPSC syllabus trackers
- Five-state topic workflow: Not Started → Studying → Notes Done → PYQ Done → Mastered
- A+/A/B/C priority mapping
- Weighted readiness score
- PYQ coverage and accuracy analytics
- PYQ pattern distribution from question-level records
- Smart next-topic queue using priority + current status + observed PYQ evidence
- Study-session timer, daily target and pacing
- Exam countdowns
- Multiple local profiles
- Optional Firebase Authentication + Firestore cloud sync
- Per-user Firestore security rules
- Responsive desktop/mobile UI

## Important analytics rule

The priority maps currently contain **planning references** based on the preparation model. They must not be described as verified historical frequency percentages until real PYQs are coded into the bank. The portal therefore labels PYQ-derived analytics separately from planning priority.

## Cloud setup

See [`FIREBASE_SETUP.md`](FIREBASE_SETUP.md). Firebase is optional. The portal remains usable locally without it.

Do not place Firebase service-account private keys in the repository.

## Portal

https://yeagerr9.github.io/dsssb-tgt-cs/portal.html
