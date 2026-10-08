const defs=[
{id:'dashboard',title:'Dashboard',icon:'⌂',exams:['dsssb','bpsc'],loader:()=>import('../modules/dashboard.js')},
{id:'syllabus',title:'Syllabus Tracker',icon:'▦',exams:['dsssb','bpsc'],loader:()=>import('../modules/syllabus.js')},
{id:'practice',title:'Practice Bank',icon:'✓',exams:['dsssb','bpsc'],loader:()=>import('../modules/practice.js')},
{id:'mocks',title:'Mock Tests',icon:'◈',exams:['dsssb','bpsc'],loader:()=>import('../modules/mocks.js')},
{id:'planner',title:'Smart Planner',icon:'◆',exams:['dsssb','bpsc'],loader:()=>import('../modules/planner.js')},
{id:'paper1',title:'Paper 1 / GS',icon:'▤',exams:['dsssb','bpsc'],loader:()=>import('../modules/paper1.js')},
{id:'analytics',title:'Analytics',icon:'◉',exams:['dsssb','bpsc'],loader:()=>import('../modules/analytics.js')},
{id:'notes',title:'Notes & Revision',icon:'✎',exams:['dsssb','bpsc'],loader:()=>import('../modules/notes.js')},
{id:'time',title:'Time & Sessions',icon:'◷',exams:['dsssb','bpsc'],loader:()=>import('../modules/time.js')},
{id:'settings',title:'Settings',icon:'⚙',exams:['dsssb','bpsc'],loader:()=>import('../modules/settings.js')}
];
export const registry=defs;
export const byId=Object.fromEntries(defs.map(m=>[m.id,m]));
const cache={};
export async function loadModule(id){if(cache[id])return cache[id];const m=await byId[id].loader();cache[id]=m.default;return cache[id]}