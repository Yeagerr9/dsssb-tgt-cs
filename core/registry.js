import dashboard from '../modules/dashboard.js';
import syllabus from '../modules/syllabus.js';
import practice from '../modules/practice.js';
import mocks from '../modules/mocks.js';
import paper1 from '../modules/paper1.js';
import analytics from '../modules/analytics.js';
import notes from '../modules/notes.js';
export const registry=[dashboard,syllabus,practice,mocks,paper1,analytics,notes];
export const byId=Object.fromEntries(registry.map(m=>[m.id,m]));