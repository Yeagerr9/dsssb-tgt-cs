(() => {
'use strict';

const $ = id => document.getElementById(id);
const STATUS = ['⬜ Not Started','🟨 Studying','🟦 Notes Done','🟩 PYQ Done','⭐ Mastered'];
const EXAMS = [
  ['DSSSB CS','dsssbTech'],
  ['DSSSB Paper 1','dsssbPaper1'],
  ['BPSC CS','bpscSubject'],
  ['BPSC Prelims','bpscPrelims'],
  ['BPSC Paper 1','bpscMainPaper1'],
  ['BPSC GS','bpscMainGS']
];

let ME = null;
let PAGE = 'home';
let timer = null;
let sec = 0;
let saveTimer = null;
let DATA_READY = window.DATA || {};
let U = {
  status:{}, targets:{}, pyq:[], sessions:[], history:[], revision:{},
  daily:120, today:0, total:0, createdAt:Date.now(), lastDay:new Date().toISOString().slice(0,10)
};

const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[m]));

const msg = s => { if ($('loginMsg')) $('loginMsg').textContent = s || ''; };

const setAuthState = (text, cls='') => {
  const e = $('authState');
  if (e) {
    e.textContent = text;
    e.className = 'authstate ' + cls;
  }
};

const today = () => new Date().toISOString().slice(0,10);

const normalize = x => Object.assign({
  status:{}, targets:{}, pyq:[], sessions:[], history:[], revision:{},
  daily:120, today:0, total:0, createdAt:Date.now(), lastDay:today(), displayName:''
}, x || {}, {
  status:(x && x.status) || {},
  targets:(x && x.targets) || {},
  pyq:(x && x.pyq) || [],
  sessions:(x && x.sessions) || [],
  history:(x && x.history) || [], revision:(x && x.revision) || {}
});

const statusWeight = s => s === STATUS[4] ? 1 : s === STATUS[3] ? .78 : s === STATUS[2] ? .55 : s === STATUS[1] ? .25 : 0;
const priWeight = p => p === 'A+' ? 4 : p === 'A' ? 3 : p === 'B' ? 2 : 1;

function rowsFor() {
  const out = [];
  EXAMS.forEach(pair => {
    const exam = pair[0], key = pair[1];
    (DATA_READY[key] || []).forEach(x => {
      (x[3] || []).forEach(topic => {
        out.push({exam, section:x[0], topic, priority:x[2], expected:Number(x[1]) || 0, id:exam + '|' + x[0] + '|' + topic});
      });
    });
  });
  return out;
}

function st(id) {
  return U.status[id] || STATUS[0];
}

async function saveCloud() {
  if (!ME || !window.CS_DB) return;
  try {
    await CS_DB.collection('users').doc(ME.uid).set(
      Object.assign({}, U, {
        displayName:ME.displayName || U.displayName || (($('displayName') || {}).value || ''),
        email:ME.email || '',
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      }),
      {merge:true}
    );
    setAuthState('Signed in to Firebase ✓','ok');
  } catch (e) {
    console.error('[CS Portal] Firestore save:', e);
    setAuthState('Signed in, but Firestore save failed.','err');
    msg('Firestore save failed: ' + (e.code || e.message));
  }
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCloud, 500);
}

async function loadCloud(user) {
  ME = user;
  setAuthState('Signed in to Firebase ✓','ok');
  msg('Authentication successful. Loading your cloud profile…');
  try {
    const snap = await CS_DB.collection('users').doc(user.uid).get();
    if (snap.exists) {
      U = normalize(snap.data());
    } else {
      U = normalize({displayName:user.displayName || (($('displayName') || {}).value || '')});
      await saveCloud();
    }
    if (U.lastDay !== today()) {
      U.today = 0;
      U.lastDay = today();
      queueSave();
    }
    openApp();
  } catch (e) {
    console.error('[CS Portal] Firestore load:', e);
    U = normalize({displayName:user.displayName || (($('displayName') || {}).value || '')});
    msg('Authentication succeeded, but Firestore read failed: ' + (e.code || e.message));
    openApp();
  }
}

async function authAction() {
  const email = ($('username') || {}).value.trim();
  const pass = ($('password') || {}).value;
  const display = ($('displayName') || {}).value.trim();

  if (!email || !pass) return msg('Enter your email and password.');
  if (pass.length < 6) return msg('Password must be at least 6 characters.');
  if (!window.CS_FIREBASE_READY || !window.CS_AUTH) return msg('Firebase Authentication is not ready.');

  const btn = $('auth');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Please wait…';
  }

  msg('Connecting to Firebase Authentication…');

  try {
    let cred;

    try {
      cred = await CS_AUTH.signInWithEmailAndPassword(email, pass);
      msg('Existing account found. Signing in…');
    } catch (signInError) {
      if (signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/user-not-found') {
        msg('No matching sign-in. Trying to create the Firebase account…');
        try {
          cred = await CS_AUTH.createUserWithEmailAndPassword(email, pass);
          if (display) {
            try { await cred.user.updateProfile({displayName:display}); } catch (_) {}
          }
          try { await cred.user.sendEmailVerification(); } catch (_) {}
          msg('Firebase account created successfully.');
        } catch (createError) {
          if (createError.code === 'auth/email-already-in-use') {
            throw {code:'auth/existing-account', message:'This email already has a Firebase account. Use the correct password or Reset password.'};
          }
          throw createError;
        }
      } else {
        throw signInError;
      }
    }

    if (display && cred.user.displayName !== display) {
      try { await cred.user.updateProfile({displayName:display}); } catch (_) {}
    }

    await loadCloud(cred.user);
  } catch (e) {
    console.error('[CS Portal] Auth error:', e);
    const known = {
      'auth/existing-account':'This email already has a Firebase account. Use the correct password or Reset password.',
      'auth/wrong-password':'Incorrect password.',
      'auth/invalid-email':'Enter a valid email address.',
      'auth/weak-password':'Password is too weak.',
      'auth/operation-not-allowed':'Email/password authentication is not enabled.',
      'auth/too-many-requests':'Too many attempts. Please wait and try again.',
      'auth/network-request-failed':'Network request failed. Check your connection or browser extensions.'
    };
    msg((known[e.code] || e.message || 'Authentication failed.') + ' [' + (e.code || 'unknown') + ']');
    setAuthState('Firebase connected ✓ — authentication error','err');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Create account / Sign in';
    }
  }
}

async function resetPassword() {
  const email = ($('username') || {}).value.trim();
  if (!email) return msg('Enter your email address first.');
  try {
    await CS_AUTH.sendPasswordResetEmail(email);
    msg('Password reset email sent. Check your inbox.');
  } catch (e) {
    msg((e.message || 'Password reset failed.') + ' [' + (e.code || 'unknown') + ']');
  }
}

async function verifyEmail() {
  const user = CS_AUTH && CS_AUTH.currentUser;
  if (!user) return msg('Sign in first.');
  try {
    await user.sendEmailVerification();
    msg('Verification email sent.');
  } catch (e) {
    msg((e.message || 'Could not send verification email.') + ' [' + (e.code || 'unknown') + ']');
  }
}

function signOut() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (CS_AUTH) CS_AUTH.signOut();
  ME = null;
  $('app').classList.add('hide');
  $('login').classList.remove('hide');
  setAuthState('Firebase ready — sign in to continue','');
  msg('Signed out.');
}

function openApp() {
  $('login').classList.add('hide');
  $('app').classList.remove('hide');
  $('who').textContent = '👤 ' + (ME.displayName || ME.email) + '  ☁ Firebase';
  render();
}

function setSt(id, value) {
  const old = st(id);
  U.status[id] = value;
  U.revision[id] = Date.now();
  U.history.push({type:'status',id,from:old,to:value,at:Date.now()});
  queueSave();
  render();
}

function stats(exam) {
  const a = rowsFor().filter(x => x.exam === exam);
  const den = a.reduce((n,x) => n + priWeight(x.priority), 0);
  const score = den ? Math.round(a.reduce((n,x) => n + priWeight(x.priority) * statusWeight(st(x.id)), 0) / den * 100) : 0;
  return {
    total:a.length,
    done:a.filter(x => st(x.id) === STATUS[3] || st(x.id) === STATUS[4]).length,
    master:a.filter(x => st(x.id) === STATUS[4]).length,
    score
  };
}

function pyqStats(exam) {
  const q = (U.pyq || []).filter(x => !exam || x.e === exam);
  const attempts = q.reduce((n,x) => n + (+x.attempts || 0), 0);
  const correct = q.reduce((n,x) => n + (+x.correct || 0), 0);
  return {
    n:q.length, attempts, correct,
    accuracy:attempts ? Math.round(correct / attempts * 100) : 0,
    topics:new Set(q.map(x => x.t)).size
  };
}

function overall() {
  const a = rowsFor();
  const den = a.reduce((n,x) => n + priWeight(x.priority), 0);
  const score = den ? Math.round(a.reduce((n,x) => n + priWeight(x.priority) * statusWeight(st(x.id)), 0) / den * 100) : 0;
  const done = a.filter(x => st(x.id) === STATUS[3] || st(x.id) === STATUS[4]).length;
  return {score,total:a.length,done,remaining:a.length-done,master:a.filter(x => st(x.id) === STATUS[4]).length,pyq:pyqStats()};
}

function fmtMin(m) {
  m = Math.round(m || 0);
  return Math.floor(m/60) + 'h ' + (m%60) + 'm';
}

function fmtSec(s) {
  s = Math.round(s || 0);
  return Math.floor(s/3600) + 'h ' + Math.floor((s%3600)/60) + 'm ' + (s%60) + 's';
}

function topicMetrics(x) {
  const status=st(x.id), mastery=statusWeight(status);
  const qs=(U.pyq||[]).filter(q=>String(q.t||'').trim().toLowerCase()===String(x.topic||'').trim().toLowerCase());
  const attempts=qs.reduce((n,q)=>n+Math.max(0,+q.attempts||0),0);
  const correct=qs.reduce((n,q)=>n+Math.max(0,+q.correct||0),0);
  const accuracy=attempts?correct/attempts:null;
  const evidence=Math.min(1,qs.length/5);
  const last=Number((U.revision||{})[x.id]||0);
  const daysSince=last?Math.max(0,(Date.now()-last)/86400000):999;
  const retention=last?Math.exp(-daysSince/21):0;
  const revisionDebt=mastery>=1?0:Math.min(1,daysSince/30);
  const priorityScore=priWeight(x.priority)/4;
  const frequencyScore=x.expected?Math.min(1,x.expected/14):priorityScore;
  const accuracyScore=accuracy===null?0.55:accuracy;
  const weakness=1-mastery, confidenceGap=1-accuracyScore;
  const staleness=mastery>=1?0:(0.45*revisionDebt+0.55*(1-retention));
  const readiness=100*(0.42*mastery+0.18*accuracyScore+0.12*evidence+0.18*retention+0.10*frequencyScore);
  const targetDays=['dsssb','bpsc'].filter(k=>U.targets[k]).map(k=>Math.max(1,(new Date(U.targets[k])-Date.now())/86400000));
  const urgencyBoost=targetDays.length?Math.min(1,14/Math.min.apply(null,targetDays)):0;
  const nextScore=100*(0.30*priorityScore+0.18*frequencyScore+0.20*weakness+0.14*confidenceGap+0.10*staleness+0.08*urgencyBoost);
  return {status,mastery,attempts,correct,accuracy,evidence,daysSince,retention,revisionDebt,readiness,nextScore};
}
function readiness() {
  const rows=rowsFor();
  if(!rows.length)return {score:0,accuracy:0,coverage:0,need:null,debt:0};
  const m=rows.map(topicMetrics);
  const attempts=m.reduce((s,x)=>s+x.attempts,0), correct=m.reduce((s,x)=>s+x.correct,0);
  const accuracy=attempts?Math.round(correct/attempts*100):0;
  const coverage=Math.round(m.filter(x=>x.attempts>0).length/m.length*100);
  const score=Math.round(m.reduce((s,x)=>s+x.readiness,0)/m.length);
  const debt=Math.round(m.reduce((s,x)=>s+(1-x.mastery)*Math.min(1,(x.daysSince===999?30:x.daysSince)/30),0)/m.length*100)/100;
  const days=['dsssb','bpsc'].filter(k=>U.targets[k]).map(k=>Math.max(.25,(new Date(U.targets[k])-Date.now())/86400000));
  const remaining=rows.reduce((s,x)=>s+(x.expected||1)*(1-statusWeight(st(x.id))),0);
  const need=days.length?Math.ceil(remaining/Math.min.apply(null,days)):null;
  return {score,accuracy,coverage,need,debt};
}
function countdown(t) {
  const ms0 = new Date(t) - Date.now();
  if (ms0 <= 0) return '<b>Target reached</b>';
  let ms = ms0;
  const d = Math.floor(ms/86400000); ms %= 86400000;
  const h = Math.floor(ms/3600000); ms %= 3600000;
  const m = Math.floor(ms/60000);
  return '<b>' + d + 'd ' + h + 'h ' + m + 'm</b> remaining';
}

function priorityMap(key) {
  const arr = (DATA_READY.maps && DATA_READY.maps[key]) || [];
  return '<div class="heat">' + (arr.map(x =>
    '<div><span class="badge">' + esc(x[2]) + '</span><br><b>' + esc(x[0]) +
    '</b><br><span class="small">' + esc(x[1]) + '</span></div>'
  ).join('') || '<span class="mut">Priority map data not loaded.</span>') + '</div>';
}

function home() {
  const r = readiness(), o = overall();
  let exams = '';
  EXAMS.forEach(pair => {
    const s = stats(pair[0]);
    exams += '<div class="card"><b>' + esc(pair[0]) + '</b><div class="kpi">' + s.score +
      '%</div><div class="bar"><i style="width:' + s.score + '%"></i></div><span class="small">' +
      s.master + ' mastered • ' + s.done + ' completed</span></div>';
  });
  return '<div class="alert ' + (r.score >= 75 ? 'success' : r.score < 45 ? 'dangerbox' : 'warning') +
    '"><b>Weighted readiness: ' + r.score + '/100.</b> This is a study-readiness index, not a predicted exam score.</div>' +
    '<div class="grid">' +
    '<div class="card"><span class="small">Overall readiness</span><div class="kpi">' + r.score + '%</div><div class="bar"><i style="width:' + r.score + '%"></i></div></div>' +
    '<div class="card"><span class="small">Completed / mastered</span><div class="kpi">' + o.done + '/' + o.total + '</div></div>' +
    '<div class="card"><span class="small">PYQ accuracy</span><div class="kpi">' + r.accuracy + '%</div><span class="small">' + o.pyq.attempts + ' attempts</span></div>' +
    '<div class="card"><span class="small">PYQ topic coverage</span><div class="kpi">' + r.coverage + '%</div></div></div>' +
    '<div class="grid">' + exams + '</div>' +
    '<div class="two"><div class="card"><h2>DSSSB priority map</h2>' + priorityMap('dsssb') +
    '</div><div class="card"><h2>BPSC CS priority map</h2>' + priorityMap('bpscSubject') + '</div></div>' +
    '<div class="two"><div class="card"><h2>Exam countdown</h2>' +
    (U.targets.dsssb ? 'DSSSB: ' + countdown(U.targets.dsssb) : 'DSSSB: <span class="mut">set date</span>') + '<br>' +
    (U.targets.bpsc ? 'BPSC: ' + countdown(U.targets.bpsc) : 'BPSC: <span class="mut">set date</span>') +
    '</div><div class="card"><h2>Study pace</h2><div class="statrow"><span>Today</span><b>' + fmtMin(U.today) +
    '</b></div><div class="statrow"><span>Total focused</span><b>' + fmtMin(U.total) +
    '</b></div><div class="statrow"><span>Daily target</span><b>' + U.daily + ' min</b></div>' +
    (r.need ? '<div class="statrow"><span>Required topic completions/day</span><b>' + r.need + '</b></div>' : '') +
    '</div></div>';
}

function analytics() {
  const r=readiness();
  const all=rowsFor().map(x=>({x,m:topicMetrics(x)}));
  const weak=all.filter(z=>z.m.status!==STATUS[4]).sort((a,b)=>b.m.nextScore-a.m.nextScore).slice(0,15);
  const stale=all.filter(z=>z.m.status!==STATUS[0]).sort((a,b)=>b.m.daysSince-a.m.daysSince).slice(0,10);
  const weakHtml=weak.map(z=>'<div class="statrow"><span><b>'+esc(z.x.topic)+'</b><br><span class="small">'+esc(z.x.exam)+' • '+esc(z.x.priority)+' • '+z.m.status+'</span></span><b>'+Math.round(z.m.nextScore)+'</b></div>').join('');
  const staleHtml=stale.map(z=>'<div class="statrow"><span>'+esc(z.x.topic)+'</span><span>'+(z.m.daysSince===999?'never':Math.round(z.m.daysSince)+'d')+'</span></div>').join('');
  return '<div class="grid"><div class="card"><span class="small">Adaptive readiness</span><div class="kpi">'+r.score+'/100</div></div>'+
    '<div class="card"><span class="small">PYQ accuracy</span><div class="kpi">'+r.accuracy+'%</div></div>'+
    '<div class="card"><span class="small">PYQ coverage</span><div class="kpi">'+r.coverage+'%</div></div>'+
    '<div class="card"><span class="small">Revision debt</span><div class="kpi">'+r.debt+'</div></div></div>'+
    '<div class="two"><div class="card"><h2>Highest-value unfinished topics</h2>'+(weakHtml||'<span class="mut">No unfinished topics.</span>')+'</div>'+
    '<div class="card"><h2>Revision debt queue</h2>'+(staleHtml||'<span class="mut">No revision history yet.</span>')+'</div></div>'+
    '<div class="card"><h2>Algorithm weights</h2><ul>'+
    '<li>Topic readiness: 42% mastery + 18% PYQ accuracy + 12% PYQ evidence + 18% retention + 10% historical frequency.</li>'+
    '<li>Next-topic score: 30% priority + 18% frequency + 20% weakness + 14% confidence gap + 10% staleness + 8% exam urgency.</li>'+
    '<li>Unknown PYQ accuracy is neutral until attempts exist.</li>'+
    '<li>Revision decay is a planning heuristic, not a scientific memory model.</li></ul></div>';
}
function planner() {
  const rows=rowsFor().map(x=>({x,m:topicMetrics(x)})).filter(z=>z.m.status!==STATUS[4]).sort((a,b)=>b.m.nextScore-a.m.nextScore);
  const daily=Math.max(30,Number(U.daily)||120);
  let budget=daily, plan=[];
  for(const z of rows){
    if(budget<=0)break;
    const mins=z.m.mastery<.25?35:z.m.mastery<.55?30:z.m.mastery<.78?25:20;
    const alloc=Math.min(mins,budget);
    plan.push({...z,mins:alloc});
    budget-=alloc;
  }
  const html=plan.map(z=>'<tr><td><b>'+esc(z.x.topic)+'</b><br><span class="small">'+esc(z.x.section)+'</span></td><td>'+esc(z.x.exam)+'</td><td>'+esc(z.x.priority)+'</td><td>'+z.m.status+'</td><td>'+Math.round(z.m.nextScore)+'</td><td>'+(z.m.accuracy===null?'—':Math.round(z.m.accuracy*100)+'%')+'</td><td>'+z.mins+' min</td></tr>').join('');
  return '<div class="alert"><b>Adaptive queue:</b> priority + frequency + mastery + PYQ accuracy + revision decay + exam urgency.</div>'+
    '<div class="grid"><div class="card"><span class="small">Daily budget</span><div class="kpi">'+daily+'m</div></div>'+
    '<div class="card"><span class="small">Revision debt</span><div class="kpi">'+readiness().debt+'</div></div>'+
    '<div class="card"><span class="small">Queue size</span><div class="kpi">'+rows.length+'</div></div></div>'+
    '<div class="card"><h2>Today\'s study queue</h2><table><tr><th>Topic</th><th>Exam</th><th>Priority</th><th>Status</th><th>Score</th><th>PYQ Acc.</th><th>Time</th></tr>'+html+'</table></div>';
}
function syllabus(key, exam) {
  const data = DATA_READY[key] || [];
  let html = '<div class="card"><div class="toolbar"><input id="search" placeholder="Search topic or subtopic">' +
    '<select id="priority"><option value="">All priorities</option><option>A+</option><option>A</option><option>B</option><option>C</option></select>' +
    '<select id="statusFilter"><option value="">All statuses</option>' +
    STATUS.map(s => '<option>' + s + '</option>').join('') + '</select></div>' +
    '<p class="small"><b>Status:</b> ' + STATUS.join(' → ') + '. Changes are saved to your cloud profile.</p></div>';
  data.forEach(x => {
    html += '<section class="section"><div class="sh"><b>' + esc(x[0]) + '</b><span class="badge">' + esc(x[2]) +
      '</span></div><table><tr><th>Micro-topic</th><th>Priority</th><th>Status</th></tr>';
    (x[3] || []).forEach(t => {
      const id = exam + '|' + x[0] + '|' + t;
      const v = st(id);
      html += '<tr class="topicrow" data-text="' + esc((x[0] + ' ' + t).toLowerCase()) +
        '" data-priority="' + esc(x[2]) + '" data-status="' + esc(v) + '">' +
        '<td><b>' + esc(t) + '</b></td><td>' + esc(x[2]) + '</td><td><select class="statusSelect" data-id="' +
        esc(id) + '">' + STATUS.map(s => '<option ' + (s === v ? 'selected' : '') + '>' + s + '</option>').join('') +
        '</select></td></tr>';
    });
    html += '</table></section>';
  });
  return html;
}

function common() {
  const a = new Set((DATA_READY.dsssbTech || []).flatMap(x => x[3] || []));
  const b = (DATA_READY.bpscSubject || []).flatMap(x => x[3] || []).filter(x => a.has(x));
  return '<div class="card"><h2>Common Core</h2><p>Concepts that overlap across DSSSB and BPSC CS.</p><div class="heat">' +
    b.map(x => '<div><b>' + esc(x) + '</b></div>').join('') + '</div></div>';
}

function pyq() {
  const a = U.pyq || [], q = overall().pyq;
  let rows = a.map(x => '<tr><td>' + esc(x.e) + '</td><td>' + esc(x.y) + '</td><td>' +
    esc(x.t) + '</td><td>' + esc(x.p) + '</td><td>' + esc(x.d) + '</td><td>' + x.attempts +
    '</td><td>' + x.correct + '</td></tr>').join('');
  return '<div class="card"><div class="toolbar"><div><h2>PYQ Bank</h2><span class="small">Question-level evidence drives analytics.</span></div>' +
    '<button class="primary" id="addPyq">＋ Add PYQ</button></div><div class="grid">' +
    '<div class="card"><b>' + a.length + '</b><br><span class="small">Questions</span></div>' +
    '<div class="card"><b>' + q.attempts + '</b><br><span class="small">Attempts</span></div>' +
    '<div class="card"><b>' + q.accuracy + '%</b><br><span class="small">Accuracy</span></div>' +
    '<div class="card"><b>' + q.topics + '</b><br><span class="small">Unique topics</span></div></div>' +
    (a.length ? '<table><tr><th>Exam</th><th>Year/shift</th><th>Topic</th><th>Pattern</th><th>Difficulty</th><th>Attempts</th><th>Correct</th></tr>' + rows + '</table>' :
    '<div class="alert">No PYQs recorded yet. Add real questions to build observed pattern analytics.</div>') + '</div>';
}

function settings() {
  return '<div class="two"><div class="card"><h2>Exam dates</h2>' +
    '<label>DSSSB<input id="dd" type="datetime-local" value="' + String(U.targets.dsssb || '').slice(0,16) + '"></label>' +
    '<label>BPSC<input id="bd" type="datetime-local" value="' + String(U.targets.bpsc || '').slice(0,16) + '"></label>' +
    '<button id="dates" class="primary">Save dates</button></div><div class="card"><h2>Study target</h2>' +
    '<input id="daily" type="number" min="1" value="' + U.daily + '"><button id="dailySave">Save daily minutes</button><hr>' +
    '<b>Account</b><p class="small">' + esc(ME.email) + (ME.emailVerified ? ' • Email verified' : ' • Email not verified') +
    '</p><button id="verify2">Send verification email</button></div></div>';
}

function timePage() {
  return '<div class="grid"><div class="card"><span class="small">Current session</span><div id="tm" class="kpi">' +
    fmtSec(sec) + '</div><button id="start" class="primary">' + (timer ? 'Pause' : 'Start') +
    '</button> <button id="rst">Reset</button></div><div class="card">Today<div class="kpi">' + fmtMin(U.today) +
    '</div></div><div class="card">Total focused<div class="kpi">' + fmtMin(U.total) +
    '</div></div><div class="card">Daily target<div class="kpi">' + U.daily + 'm</div></div></div>';
}

function render() {
  const titles = {
    home:'Dashboard', analytics:'Analytics', planner:'Smart Planner',
    dsssb:'DSSSB TGT Computer Science', d1:'DSSSB Paper 1',
    bpsc:'BPSC TRE 4.0 Computer Science', b1:'BPSC Paper 1',
    bg:'BPSC GS / Prelims', common:'Common Core', pyq:'PYQ Bank',
    time:'Time & Sessions', settings:'Settings'
  };
  $('title').textContent = titles[PAGE] || 'Dashboard';
  let v;
  if (PAGE === 'home') v=home();
  else if (PAGE === 'analytics') v=analytics();
  else if (PAGE === 'planner') v=planner();
  else if (PAGE === 'dsssb') v=syllabus('dsssbTech','DSSSB CS');
  else if (PAGE === 'd1') v=syllabus('dsssbPaper1','DSSSB Paper 1');
  else if (PAGE === 'bpsc') v=syllabus('bpscSubject','BPSC CS');
  else if (PAGE === 'b1') v=syllabus('bpscMainPaper1','BPSC Paper 1');
  else if (PAGE === 'bg') v=syllabus('bpscPrelims','BPSC Prelims');
  else if (PAGE === 'common') v=common();
  else if (PAGE === 'pyq') v=pyq();
  else if (PAGE === 'time') v=timePage();
  else v=settings();
  $('content').innerHTML = v;
  bind();
}

function bind() {
  document.querySelectorAll('[data-page]').forEach(b => b.onclick = () => { PAGE=b.dataset.page; render(); });
  document.querySelectorAll('.statusSelect').forEach(s => s.onchange = () => setSt(s.dataset.id,s.value));

  const se=$('search'), pr=$('priority'), sf=$('statusFilter');
  if (se && pr && sf) {
    const filter = () => document.querySelectorAll('.topicrow').forEach(r => {
      r.style.display = (!se.value || r.dataset.text.includes(se.value.toLowerCase())) &&
        (!pr.value || r.dataset.priority === pr.value) &&
        (!sf.value || r.dataset.status === sf.value) ? '' : 'none';
    });
    se.oninput=filter; pr.onchange=filter; sf.onchange=filter;
  }

  if ($('addPyq')) $('addPyq').onclick = () => {
    const e=prompt('Exam'), y=prompt('Year / shift'), t=prompt('Topic / subtopic'),
      p=prompt('Pattern'), d=prompt('Difficulty'), a=prompt('Attempts','1'), c=prompt('Correct','0');
    if (e && y && t) {
      U.pyq.push({e,y,t,p,d,attempts:+a||0,correct:+c||0,at:Date.now()});
      queueSave(); render();
    }
  };

  if ($('dates')) $('dates').onclick = () => {
    U.targets={dsssb:$('dd').value,bpsc:$('bd').value};
    queueSave(); render();
  };

  if ($('dailySave')) $('dailySave').onclick = () => {
    U.daily=Math.max(1,+$('daily').value||120);
    queueSave(); render();
  };

  if ($('start')) $('start').onclick=toggleTimer;
  if ($('rst')) $('rst').onclick=()=>{sec=0;render();};
  if ($('verify2')) $('verify2').onclick=verifyEmail;
}

function toggleTimer() {
  if (timer) {
    clearInterval(timer); timer=null;
    U.sessions.push({at:Date.now(),seconds:sec});
    queueSave(); render();
  } else {
    timer=setInterval(() => {
      sec++;
      U.today += 1/60;
      U.total += 1/60;
      const e=$('tm');
      if (e) e.textContent=fmtSec(sec);
    },1000);
    render();
  }
}

$('auth').onclick=authAction;
$('resetPassword').onclick=resetPassword;
$('verify').onclick=verifyEmail;
$('lock').onclick=signOut;
$('password').onkeydown=e=>{if(e.key==='Enter')authAction();};

if (window.CS_FIREBASE_READY && window.CS_AUTH) {
  setAuthState('Firebase connected ✓ — sign in or create an account','ok');
  CS_AUTH.onAuthStateChanged(user => { if (user && !ME) loadCloud(user); });
} else {
  setAuthState('Firebase configuration unavailable','err');
}

})();