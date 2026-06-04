/* =============================================
   CAREERSPHERE - script.js
============================================= */
'use strict';

const State = {
  user: null, token: null,
  init() {
    try {
      const saved = localStorage.getItem('cgs_user');
      const token = localStorage.getItem('cgs_token');
      if (saved && token) { this.user = JSON.parse(saved); this.token = token; }
    } catch(_) {}
  },
  save(user, token) {
    this.user = user; this.token = token;
    localStorage.setItem('cgs_user', JSON.stringify(user));
    localStorage.setItem('cgs_token', token);
  },
  clear() {
    this.user = null; this.token = null;
    localStorage.removeItem('cgs_user');
    localStorage.removeItem('cgs_token');
  },
  isLoggedIn() { return !!this.token; }
};

async function api(endpoint, body = {}, method = 'POST') {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (State.token) opts.headers['Authorization'] = `Bearer ${State.token}`;
  if (method !== 'GET') opts.body = JSON.stringify(body);
  try {
    const res = await fetch(endpoint, opts);
    if (res.status === 401) {
      State.clear();
      window.location.href = '/login.html?expired=1';
      return { ok: false, error: 'Session expired.' };
    }
    let data;
    try { data = await res.json(); } catch(_) { data = {}; }
    if (!res.ok) throw new Error(data.detail || data.message || `Server error (${res.status})`);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof TypeError ? 'Cannot reach server.' : err.message };
  }
}

function buildNavbar() {
  const loggedIn = State.isLoggedIn();
  const user = State.user;
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const guestLinks = `
    <a href="/index.html"   class="nav-link ${page==='index.html'  ?'active':''}">Home</a>
    <a href="/modules.html" class="nav-link ${page==='modules.html'?'active':''}">Modules</a>
    <a href="/about.html"   class="nav-link ${page==='about.html'  ?'active':''}">About</a>
    <a href="/contact.html" class="nav-link ${page==='contact.html'?'active':''}">Contact</a>`;
  const authLinks = `
    <a href="/dashboard.html" class="nav-link ${page==='dashboard.html'?'active':''}">Dashboard</a>
    <a href="/modules.html"   class="nav-link ${page==='modules.html'  ?'active':''}">Modules</a>
    <a href="/reports.html"   class="nav-link ${page==='reports.html'  ?'active':''}">Reports</a>
    <a href="/profile.html"   class="nav-link ${page==='profile.html'  ?'active':''}">Profile</a>`;
  const guestActions = `
    <a href="/login.html"    class="btn btn-outline btn-sm">Login</a>
    <a href="/register.html" class="btn btn-primary btn-sm">Register</a>`;
  const authActions = `
    <span style="font-size:.85rem;color:var(--gray-500);margin-right:4px">Hi, ${user?.name?.split(' ')[0] || 'Student'}</span>
    <button onclick="logout()" class="btn btn-outline btn-sm">Logout</button>`;
  const mobileActions = loggedIn
    ? `<button onclick="logout()" class="btn btn-outline btn-sm btn-full">Logout</button>`
    : `<a href="/login.html"    class="btn btn-outline btn-sm btn-full">Login</a>
       <a href="/register.html" class="btn btn-primary btn-sm btn-full">Register</a>`;
  return `
  <nav class="navbar">
    <div class="container navbar-inner">
      <a href="/index.html" class="navbar-brand">
        <div class="brand-icon"><i class="fas fa-graduation-cap"></i></div>
        Career<span>Sphere</span>
      </a>
      <div class="navbar-nav">${loggedIn ? authLinks : guestLinks}</div>
      <div class="navbar-actions">${loggedIn ? authActions : guestActions}</div>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-nav" id="mobile-nav">
      ${loggedIn ? authLinks : guestLinks}
      <div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">${mobileActions}</div>
    </div>
  </nav>`;
}

function buildFooter() {
  return `
  <footer>
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="brand-name">
            <div style="width:32px;height:32px;background:var(--blue-mid);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:.9rem">
              <i class="fas fa-graduation-cap"></i>
            </div>
            CareerSphere
          </div>
          <p>Empowering students across India to make informed decisions about their education and career path through AI-powered guidance.</p>
        </div>
        <div class="footer-col">
          <h4>Navigation</h4>
          <a href="/index.html">Home</a>
          <a href="/about.html">About</a>
          <a href="/contact.html">Contact</a>
          <a href="/modules.html">Modules</a>
          <a href="/login.html">Login</a>
        </div>
        <div class="footer-col">
          <h4>Modules</h4>
          <a href="/career-recommendation.html">Career Recommendation</a>
          <a href="/stream-selector.html">Stream Selector</a>
          <a href="/degree-finder.html">Degree Finder</a>
          <a href="/chatbot.html">AI Chatbot</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 CareerSphere. All rights reserved.</span>
        <div class="footer-socials">
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-github"></i></a>
        </div>
      </div>
    </div>
  </footer>`;
}

document.addEventListener('DOMContentLoaded', () => {
  State.init();
  const navPlaceholder = document.getElementById('navbar-placeholder');
  if (navPlaceholder) navPlaceholder.outerHTML = buildNavbar();
  const ftPlaceholder = document.getElementById('footer-placeholder');
  if (ftPlaceholder) ftPlaceholder.outerHTML = buildFooter();
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 400);
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const initFns = {
    'login.html': initLogin,
    'register.html': initRegister,
    'dashboard.html': initDashboard,
    'profile.html': initProfile,
    'reports.html': initReports,
    'career-recommendation.html': initCareerRec,
    'stream-selector.html': initStreamSelector,
    'degree-finder.html': initDegreeFinder,
    'chatbot.html': initChatbot,
    'contact.html': initContact,
  };
  if (initFns[page]) initFns[page]();
});

function requireAuth(redirectTo = '/login.html') {
  if (!State.isLoggedIn()) {
    const dest = window.location.pathname + window.location.search;
    if (dest && dest !== '/login.html') sessionStorage.setItem('cgs_redirect', dest);
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

function logout() { State.clear(); window.location.href = '/index.html'; }

function showAlert(id, msg, type = 'info') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':type==='danger'?'exclamation-circle':'info-circle'}"></i> ${msg}`;
  if (type === 'success') setTimeout(() => el.classList.remove('show'), 4000);
}

function setLoading(btn, loading, text = '') {
  if (!btn) return;
  if (loading && !btn.dataset.original) btn.dataset.original = btn.innerHTML;
  btn.disabled = loading;
  btn.innerHTML = loading ? `<span class="spinner"></span> ${text || 'Please wait...'}` : (btn.dataset.original || text || 'Submit');
  if (!loading) btn.dataset.original = '';
}

function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function fillInput(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
function formatDate(str) {
  if (!str) return '';
  try { return new Date(str).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }); }
  catch { return str; }
}

/* LOGIN */
function initLogin() {
  if (State.isLoggedIn()) { window.location.href = '/dashboard.html'; return; }
  const params = new URLSearchParams(window.location.search);
  if (params.get('expired') === '1') showAlert('login-alert', 'Your session has expired. Please sign in again.', 'info');
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const email = form.email.value.trim();
    const pwd = form.password.value;
    btn.dataset.original = btn.textContent;
    setLoading(btn, true, 'Signing in...');
    const result = await api('/login', { email, password: pwd });
    setLoading(btn, false);
    if (result.ok) {
      const d = result.data;
      State.save(d.user || { name: d.name || email, email }, d.access_token || d.token || 'token');
      const dest = sessionStorage.getItem('cgs_redirect') || '/dashboard.html';
      sessionStorage.removeItem('cgs_redirect');
      window.location.href = dest;
    } else {
      showAlert('login-alert', result.error || 'Invalid credentials. Please try again.', 'danger');
    }
  });
}

/* REGISTER */
function initRegister() {
  if (State.isLoggedIn()) { window.location.href = '/dashboard.html'; return; }
  const form = document.getElementById('register-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const name = form.full_name?.value.trim() || form.name?.value.trim();
    const email = form.email.value.trim();
    const pwd = form.password.value;
    const cpwd = form.confirm_password?.value || form.cpassword?.value;
    if (cpwd && pwd !== cpwd) { showAlert('reg-alert', 'Passwords do not match.', 'danger'); return; }
    btn.dataset.original = btn.textContent;
    setLoading(btn, true, 'Creating account...');
    const result = await api('/register', { name, email, password: pwd });
    setLoading(btn, false);
    if (result.ok) {
      showAlert('reg-alert', 'Account created! Redirecting to login...', 'success');
      setTimeout(() => window.location.href = '/login.html', 1600);
    } else {
      showAlert('reg-alert', result.error || 'Registration failed. Please try again.', 'danger');
    }
  });
}

/* DASHBOARD */
async function initDashboard() {
  if (!requireAuth()) return;
  const nameEl = document.getElementById('dash-user-name');
  if (nameEl) nameEl.textContent = State.user?.name || 'Student';
  const result = await api('/dashboard', { user_id: State.user?.id });
  if (result.ok) {
    const d = result.data;
    setText('dash-modules-used', d.modules_used ?? '--');
    setText('dash-reports-count', d.reports_count ?? '--');
    setText('dash-career-recs', d.career_recommendations ?? '--');
    setText('dash-streak', d.streak ?? '--');
    const actEl = document.getElementById('recent-activity');
    if (actEl && d.recent_activity?.length) {
      actEl.innerHTML = d.recent_activity.map(a => `
        <div class="activity-item">
          <div class="activity-dot"></div>
          <div>
            <div class="activity-text">${a.action || a.text || a}</div>
            <div class="activity-time">${a.time || ''}</div>
          </div>
        </div>`).join('');
    }
  }
}

/* PROFILE */
function initProfile() {
  if (!requireAuth()) return;
  const user = State.user || {};
  fillInput('profile-name', user.name || '');
  fillInput('profile-email', user.email || '');
  const avatarEl = document.getElementById('profile-avatar-text');
  if (avatarEl) avatarEl.textContent = (user.name || 'S')[0].toUpperCase();
  const displayName = document.getElementById('profile-display-name');
  if (displayName) displayName.textContent = user.name || 'Student';
  const displayEmail = document.getElementById('profile-display-email');
  if (displayEmail) displayEmail.textContent = user.email || '';
  const form = document.getElementById('profile-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const name = form.profile_name?.value.trim() || form.querySelector('[name=name]')?.value.trim();
    btn.dataset.original = btn.textContent;
    setLoading(btn, true, 'Saving...');
    if (name) { State.user.name = name; State.save(State.user, State.token); }
    showAlert('profile-alert', 'Profile updated successfully!', 'success');
    setLoading(btn, false);
  });
}

/* REPORTS */
async function initReports() {
  if (!requireAuth()) return;
  const container = document.getElementById('reports-container');
  const empty = document.getElementById('reports-empty');
  if (!container) return;
  const result = await api('/reports', { user_id: State.user?.id });
  if (result.ok && result.data?.reports?.length) {
    if (empty) empty.style.display = 'none';
    container.innerHTML = result.data.reports.map(r => `
      <div class="report-card">
        <div class="report-header">
          <div>
            <div class="report-title">${r.title || r.module || 'Career Report'}</div>
            <div class="report-date">${formatDate(r.created_at || r.date)}</div>
          </div>
          <span class="badge badge-blue">${r.type || 'Report'}</span>
        </div>
        <div class="report-body">${r.summary || r.result || r.content || 'View your detailed career report below.'}</div>
        ${r.tags ? `<div class="report-tags">${r.tags.map(t => '<span class="tag">'+t+'</span>').join('')}</div>` : ''}
      </div>`).join('');
  } else {
    if (empty) empty.style.display = 'block';
    container.innerHTML = '';
  }
}

/* ═══════════════════════════════════════════
   CAREER RECOMMENDATION — FIXED (no more [object Object])
═══════════════════════════════════════════ */
function initCareerRec() {
  const form   = document.getElementById('career-rec-form');
  const result = document.getElementById('career-result');
  if (!form) return;

  /* ---------- fallback data ---------- */
  const careerFallback = {
    mathematics: [
      { title: 'Data Scientist',     description: 'Analyse large datasets to find insights using Python, statistics, and machine learning.', skills: ['Python','Statistics','ML'], entrance_exams: ['JEE Main','CUET'] },
      { title: 'Actuary',            description: 'Use maths and statistics to assess financial risks in insurance and finance sectors.',      skills: ['Statistics','Risk Analysis','Excel'], entrance_exams: ['IAI Actuarial Exams'] },
      { title: 'Financial Analyst',  description: 'Evaluate financial data to guide business investment decisions and corporate strategy.',    skills: ['Accounting','Finance','Excel'], entrance_exams: ['CFA','CA Foundation'] },
      { title: 'Software Engineer',  description: 'Design, build and maintain software applications across web, mobile and enterprise.',      skills: ['Programming','DSA','Problem Solving'], entrance_exams: ['JEE Main','BITSAT'] }
    ],
    science: [
      { title: 'Medical Doctor (MBBS)', description: 'Diagnose and treat patients; specialise in surgery, medicine or other healthcare fields.', skills: ['Biology','Chemistry','Patient Care'], entrance_exams: ['NEET UG'] },
      { title: 'Research Scientist',    description: 'Conduct experiments to advance knowledge in physics, chemistry, or biology.',              skills: ['Research','Lab Work','Analysis'], entrance_exams: ['CUET','IIT JAM'] },
      { title: 'Biomedical Engineer',   description: 'Combine engineering and medicine to design healthcare devices and equipment.',             skills: ['Engineering','Biology','Electronics'], entrance_exams: ['JEE Main','NEET'] },
      { title: 'Pharmacist',            description: 'Dispense medications and counsel patients on safe pharmaceutical use.',                    skills: ['Chemistry','Biology','Healthcare'], entrance_exams: ['GPAT','NEET'] }
    ],
    commerce: [
      { title: 'Chartered Accountant', description: 'Manage financial accounts, audit firms, and provide expert tax and financial advice.',   skills: ['Accounting','Taxation','Finance'], entrance_exams: ['CA Foundation','CUET'] },
      { title: 'Business Analyst',     description: 'Bridge IT and business by identifying needs and recommending data-driven solutions.',    skills: ['Analysis','Communication','Excel'], entrance_exams: ['CAT','CUET'] },
      { title: 'Investment Banker',    description: 'Help companies raise capital, manage mergers, and advise on financial transactions.',    skills: ['Finance','Valuation','Excel'], entrance_exams: ['CAT','GMAT'] },
      { title: 'Marketing Manager',    description: 'Plan and execute campaigns to promote products and grow brand awareness.',               skills: ['Marketing','Creativity','Analytics'], entrance_exams: ['CAT','XAT'] }
    ],
    arts: [
      { title: 'Journalist',       description: 'Research and report news stories across print, digital, radio, or television media.',        skills: ['Writing','Communication','Research'], entrance_exams: ['CUET','IIMC Entrance'] },
      { title: 'Psychologist',     description: 'Study human behaviour and mental processes to help people overcome emotional challenges.',   skills: ['Empathy','Counseling','Analysis'], entrance_exams: ['CUET','University Exams'] },
      { title: 'Graphic Designer', description: 'Create visual content for brands, websites, advertisements, and digital platforms.',        skills: ['Creativity','Photoshop','Illustration'], entrance_exams: ['NID DAT','NIFT'] },
      { title: 'Social Worker',    description: 'Support individuals and communities to improve social functioning and well-being.',          skills: ['Empathy','Communication','Counseling'], entrance_exams: ['CUET','University Exams'] }
    ],
    technology: [
      { title: 'AI / ML Engineer',       description: 'Build artificial intelligence and machine learning systems for modern applications.', skills: ['Python','TensorFlow','Maths'], entrance_exams: ['JEE Main','BITSAT'] },
      { title: 'Cybersecurity Analyst',  description: 'Protect computer systems and networks from cyber attacks and data breaches.',         skills: ['Networking','Ethical Hacking','Security'], entrance_exams: ['JEE Main','CUET'] },
      { title: 'Web Developer',          description: 'Design and build websites and web applications for businesses and individuals.',      skills: ['HTML','CSS','JavaScript'], entrance_exams: ['JEE Main','CUET'] },
      { title: 'Cloud Architect',        description: 'Design and manage cloud computing infrastructure for organisations.',                 skills: ['AWS','DevOps','Networking'], entrance_exams: ['JEE Main','GATE'] }
    ],
    biology: [
      { title: 'Doctor (MBBS)',          description: 'Diagnose illnesses, prescribe treatments, and care for patients in hospitals.',       skills: ['Medicine','Biology','Patient Care'], entrance_exams: ['NEET UG'] },
      { title: 'Biologist / Researcher', description: 'Study living organisms and their environment through scientific research.',           skills: ['Lab Skills','Research','Analysis'], entrance_exams: ['CUET','IIT JAM'] },
      { title: 'Dietitian',              description: 'Advise individuals on healthy eating and nutrition to improve health outcomes.',      skills: ['Nutrition','Biology','Counseling'], entrance_exams: ['CUET','University Exams'] },
      { title: 'Dentist (BDS)',          description: 'Diagnose and treat dental problems and promote oral health care.',                   skills: ['Biology','Surgery','Patient Care'], entrance_exams: ['NEET UG'] }
    ]
  };

  /* match keyword → fallback list */
  function getFallback(subjects, interests) {
    const key = ((subjects || '') + ' ' + (interests || '')).toLowerCase();
    if (key.includes('math'))                                    return careerFallback.mathematics;
    if (key.includes('bio'))                                     return careerFallback.biology;
    if (key.includes('tech') || key.includes('computer') || key.includes('it')) return careerFallback.technology;
    if (key.includes('commerce') || key.includes('account') || key.includes('business')) return careerFallback.commerce;
    if (key.includes('art') || key.includes('history') || key.includes('english'))       return careerFallback.arts;
    if (key.includes('science') || key.includes('physics') || key.includes('chem'))      return careerFallback.science;
    /* default mix */
    return [careerFallback.mathematics[0], careerFallback.science[0], careerFallback.technology[0], careerFallback.commerce[0]];
  }

  /* render career cards */
  function renderCareers(careers) {
    if (!result) return;
    result.classList.add('show');
    result.innerHTML = `
      <h3><i class="fas fa-star" style="color:var(--amber)"></i> Recommended Careers for You</h3>
      ${careers.map(c => `
        <div class="career-result-item">
          <h4>${c.title || c.name || ''}</h4>
          <p>${c.description || c.desc || ''}</p>
          ${c.skills && c.skills.length
            ? '<div class="tags">' + c.skills.map(s => '<span class="tag">' + s + '</span>').join('') + '</div>'
            : ''}
          ${c.entrance_exams && c.entrance_exams.length
            ? '<p style="margin-top:8px;font-size:.8rem;color:var(--gray-400)"><i class="fas fa-file-alt"></i> Exams: ' + c.entrance_exams.join(', ') + '</p>'
            : ''}
        </div>`).join('')}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = form.querySelector('[type=submit]');
    const interests = form.interests?.value.trim();
    const skills    = form.skills?.value.trim();
    const grade     = form.grade?.value;
    const subjects  = form.subjects?.value.trim();

    btn.dataset.original = btn.textContent;
    setLoading(btn, true, 'Analyzing...');

    const res = await api('/recommend-career', { interests, skills, grade, subjects });
    setLoading(btn, false);

    if (res.ok) {
      const careers = res.data.careers || res.data.recommendations || [];
      /* API returned results → show them; otherwise fall back */
      renderCareers(careers.length ? careers : getFallback(subjects, interests));
    } else {
      /* API failed → silently show fallback, no red error box */
      renderCareers(getFallback(subjects, interests));
    }
  });
}

/* STREAM SELECTOR */
function initStreamSelector() {
  const questions = [
    { q: 'Which subject do you enjoy the most?', opts: ['Mathematics and Physics','Accounts and Economics','Biology and Life Sciences','History and Literature'] },
    { q: 'What type of work excites you?', opts: ['Building and Engineering','Managing businesses and finances','Helping and healing people','Creating and expressing ideas'] },
    { q: 'Which career appeals to you most?', opts: ['Engineer / Scientist','Doctor / Pharmacist','CA / Banker / Economist','Artist / Writer / Journalist'] },
    { q: 'How do you prefer to learn?', opts: ['Through experiments and logic','Through memorization and facts','Through numbers and data','Through creativity and stories'] },
    { q: 'Which board result are you planning around?', opts: ['After 10th (Stream selection)','After 12th Science','After 12th Commerce','After 12th Arts'] },
  ];
  const streamFallback = {
    Science:  { stream:'Science',  description:'Best for analytical minds. Opens doors to engineering, medicine, technology, and research.', subjects:['Physics','Chemistry','Mathematics','Biology','Computer Science'], career_opportunities:['Engineer','Doctor','Scientist','Pharmacist','Data Analyst'] },
    Commerce: { stream:'Commerce', description:'Ideal for business-minded individuals. Leads to finance, accounting, and management.',       subjects:['Accountancy','Business Studies','Economics','Mathematics','Entrepreneurship'], career_opportunities:['CA','Business Analyst','Banker','MBA Graduate','Economist'] },
    Arts:     { stream:'Arts',     description:'Best for creative minds. Opens paths in humanities, social sciences, and creative fields.',  subjects:['History','Political Science','Psychology','Sociology','Literature'], career_opportunities:['Lawyer','Psychologist','Journalist','Designer','Teacher'] }
  };
  function getStream(answers) {
    let s=0,c=0,a=0;
    answers.forEach((v,i)=>{
      if(i===0){if(v===0||v===2)s++;else if(v===1)c++;else a++;}
      else if(i===1){if(v===0||v===2)s++;else if(v===1)c++;else a++;}
      else if(i===2){if(v===0||v===1)s++;else if(v===2)c++;else a++;}
      else if(i===3){if(v===0)s++;else if(v===2)c++;else a++;}
      else if(i===4){if(v===1)s++;else if(v===2)c++;else if(v===3)a++;}
    });
    if(c>=s&&c>=a) return 'Commerce';
    if(a>s&&a>c)   return 'Arts';
    return 'Science';
  }
  let current=0; const answers=[];
  const qEl=document.getElementById('quiz-question');
  const optsEl=document.getElementById('quiz-options');
  const prevBtn=document.getElementById('quiz-prev');
  const nextBtn=document.getElementById('quiz-next');
  const progFill=document.getElementById('prog-fill');
  const progText=document.getElementById('prog-text');
  const resultEl=document.getElementById('stream-result');

  function renderQ() {
    const q=questions[current]; if(!q||!qEl) return;
    qEl.textContent=q.q;
    optsEl.innerHTML=q.opts.map((o,i)=>`
      <label class="quiz-option ${answers[current]===i?'selected':''}">
        <input type="radio" name="qopt" value="${i}" ${answers[current]===i?'checked':''}>${o}
      </label>`).join('');
    optsEl.querySelectorAll('.quiz-option').forEach(el=>{
      el.addEventListener('click',()=>{
        answers[current]=parseInt(el.querySelector('input').value);
        optsEl.querySelectorAll('.quiz-option').forEach(x=>x.classList.remove('selected'));
        el.classList.add('selected');
      });
    });
    const pct=Math.round((current/questions.length)*100);
    if(progFill) progFill.style.width=pct+'%';
    if(progText) progText.textContent=`Question ${current+1} of ${questions.length}`;
    const progPct=document.getElementById('prog-pct');
    if(progPct) progPct.textContent=pct+'%';
    if(prevBtn) prevBtn.disabled=current===0;
    if(nextBtn) nextBtn.textContent=current===questions.length-1?'Get Result':'Next →';
  }

  function showResult(d) {
    const quizContainer=document.getElementById('quiz-container');
    if(quizContainer) quizContainer.style.display='none';
    if(resultEl) resultEl.classList.add('show');
    const streamEl=document.getElementById('stream-name');
    const descEl=document.getElementById('stream-desc');
    const subEl=document.getElementById('stream-subjects');
    const carEl=document.getElementById('stream-careers');
    if(streamEl) streamEl.textContent=d.stream||d.recommended_stream||'Science';
    if(descEl)   descEl.textContent=d.description||d.reason||'This stream aligns best with your interests.';
    if(subEl&&d.subjects?.length)             subEl.innerHTML=d.subjects.map(s=>`<li>${s}</li>`).join('');
    if(carEl&&d.career_opportunities?.length) carEl.innerHTML=d.career_opportunities.map(c=>`<span class="tag">${c}</span>`).join('');
  }

  if(nextBtn) nextBtn.addEventListener('click', async ()=>{
    if(answers[current]===undefined){alert('Please select an answer.');return;}
    if(current<questions.length-1){current++;renderQ();}
    else {
      nextBtn.disabled=true;
      nextBtn.innerHTML='<span class="spinner"></span> Analyzing...';
      const res=await api('/select-stream',{answers});
      nextBtn.disabled=false; nextBtn.textContent='Get Result';
      if(res.ok) showResult(res.data);
      else showResult(streamFallback[getStream(answers)]);
    }
  });
  if(prevBtn) prevBtn.addEventListener('click',()=>{if(current>0){current--;renderQ();}});
  renderQ();
}

/* DEGREE FINDER */
async function initDegreeFinder() {
  const searchInput=document.getElementById('degree-search');
  const submitBtn=document.getElementById('degree-search-btn');
  const grid=document.getElementById('degree-grid');
  const fallbackDegrees=[
    {name:'B.Tech (Computer Science)',description:'Bachelor of Technology in Computer Science — software development, algorithms, and computing systems.',duration:'4 Years',fee_range:'₹4–15 Lakhs',entrance_exams:['JEE Main','JEE Advanced','BITSAT']},
    {name:'MBBS',description:'Bachelor of Medicine and Surgery — primary medical degree for becoming a doctor.',duration:'5.5 Years',fee_range:'₹5–80 Lakhs',entrance_exams:['NEET UG']},
    {name:'B.Com (Hons)',description:'Bachelor of Commerce — in-depth knowledge of accounting, finance, and business.',duration:'3 Years',fee_range:'₹1–5 Lakhs',entrance_exams:['CUET','University Exams']},
    {name:'BBA',description:'Bachelor of Business Administration — prepares students for management and entrepreneurship.',duration:'3 Years',fee_range:'₹2–10 Lakhs',entrance_exams:['CUET','IPMAT']},
    {name:'B.Sc. (Physics)',description:'Bachelor of Science in Physics — fundamental principles of matter, energy, and the universe.',duration:'3 Years',fee_range:'₹1–4 Lakhs',entrance_exams:['CUET','University Exams']},
    {name:'B.A. (Psychology)',description:'Bachelor of Arts in Psychology — human behavior, mental processes, and therapy.',duration:'3 Years',fee_range:'₹1–5 Lakhs',entrance_exams:['CUET','University Exams']},
    {name:'LLB',description:'Bachelor of Laws — professional degree required to practice law in India.',duration:'3 Years',fee_range:'₹2–8 Lakhs',entrance_exams:['CLAT','AILET']},
    {name:'B.Arch',description:'Bachelor of Architecture — building design, urban planning, and architectural theory.',duration:'5 Years',fee_range:'₹3–12 Lakhs',entrance_exams:['NATA','JEE Main Paper 2']},
    {name:'BCA',description:'Bachelor of Computer Applications — programming, software development, and IT solutions.',duration:'3 Years',fee_range:'₹1–5 Lakhs',entrance_exams:['CUET','University Exams']},
    {name:'B.Sc. (Nursing)',description:'Bachelor of Science in Nursing — professional nursing and patient care.',duration:'4 Years',fee_range:'₹2–8 Lakhs',entrance_exams:['NEET','State Nursing Entrance']},
    {name:'B.Des (Design)',description:'Bachelor of Design — UI/UX, product design, fashion, and visual communication.',duration:'4 Years',fee_range:'₹3–15 Lakhs',entrance_exams:['NID DAT','NIFT','CEED']},
    {name:'B.Pharm',description:'Bachelor of Pharmacy — pharmaceutical sciences and drug development.',duration:'4 Years',fee_range:'₹2–8 Lakhs',entrance_exams:['GPAT','NEET']}
  ];
  function renderDegrees(degrees){
    if(!grid) return;
    if(!degrees.length){
      grid.innerHTML=`<div style="text-align:center;padding:48px;color:var(--gray-400);grid-column:1/-1"><i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.4"></i><p>No degrees found. Try a different search.</p></div>`;
      return;
    }
    grid.innerHTML=degrees.map(d=>`
      <div class="degree-card">
        <div class="degree-card-name">${d.name||d.degree||d.title||'Degree'}</div>
        <div class="degree-card-desc">${d.description||d.desc||''}</div>
        <div class="degree-meta">
          ${d.duration?`<div class="degree-meta-item"><i class="far fa-clock"></i> ${d.duration}</div>`:''}
          ${d.fee_range||d.fees?`<div class="degree-meta-item"><i class="fas fa-rupee-sign"></i> ${d.fee_range||d.fees}</div>`:''}
          ${d.entrance_exams?.length?`<div class="degree-meta-item"><i class="fas fa-file-alt"></i> ${d.entrance_exams.join(', ')}</div>`:''}
        </div>
      </div>`).join('');
  }
  function filterFallback(q){
    if(!q) return fallbackDegrees;
    const l=q.toLowerCase();
    return fallbackDegrees.filter(d=>d.name.toLowerCase().includes(l)||d.description.toLowerCase().includes(l)||d.entrance_exams.some(e=>e.toLowerCase().includes(l)));
  }
  async function searchDegrees(q){
    if(!grid) return;
    grid.innerHTML=`<div style="text-align:center;padding:40px;grid-column:1/-1"><span class="spinner" style="width:32px;height:32px;border-color:var(--blue-light);border-top-color:var(--blue-mid)"></span></div>`;
    const res=await api('/degree-finder',{query:q||'',subject:q||''});
    if(res.ok){
      const degrees=res.data.degrees||res.data.results||[];
      renderDegrees(degrees.length?degrees:filterFallback(q));
    } else {
      renderDegrees(filterFallback(q));
    }
  }
  searchDegrees('');
  if(submitBtn) submitBtn.addEventListener('click',()=>searchDegrees(searchInput?.value.trim()));
  if(searchInput) searchInput.addEventListener('keypress',e=>{if(e.key==='Enter') searchDegrees(searchInput.value.trim());});
  document.querySelectorAll('.popular-tag').forEach(tag=>{
    tag.addEventListener('click',()=>{
      if(searchInput) searchInput.value=tag.textContent.trim();
      searchDegrees(tag.textContent.trim());
    });
  });
}

/* CHATBOT */
function initChatbot(){
  const messagesEl=document.getElementById('chat-messages');
  const inputEl=document.getElementById('chat-input');
  const sendBtn=document.getElementById('chat-send');
  function appendMsg(text,role='bot'){
    const row=document.createElement('div');
    row.className=`msg-row ${role}`;
    row.innerHTML=`<div class="msg-icon ${role}"><i class="fas fa-${role==='bot'?'robot':'user'}"></i></div><div class="msg-bubble msg-${role}">${text}</div>`;
    messagesEl.appendChild(row);
    messagesEl.scrollTop=messagesEl.scrollHeight;
  }
  function showTyping(){
    const row=document.createElement('div');
    row.className='msg-row bot'; row.id='typing-row';
    row.innerHTML=`<div class="msg-icon bot"><i class="fas fa-robot"></i></div><div class="msg-bubble msg-bot"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    messagesEl.appendChild(row); messagesEl.scrollTop=messagesEl.scrollHeight;
    return row;
  }
  async function sendMessage(){
    const msg=inputEl?.value.trim(); if(!msg) return;
    inputEl.value=''; appendMsg(msg,'user');
    const typingRow=showTyping();
    const res=await api('/career-chat',{question:msg});
    typingRow.remove();
    appendMsg(res.ok?(res.data.answer||res.data.response||res.data.message||'I can help you with that!'):'Sorry, I encountered an error. Please try again.','bot');
  }
  if(sendBtn) sendBtn.addEventListener('click',sendMessage);
  if(inputEl){
    inputEl.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
    inputEl.addEventListener('input',()=>{inputEl.style.height='auto';inputEl.style.height=Math.min(inputEl.scrollHeight,120)+'px';});
  }
  setTimeout(()=>appendMsg('👋 Hello! I\'m your CareerSphere AI Assistant. Ask me anything about careers, streams, entrance exams, or degrees after 10th and 12th!','bot'),500);
}

/* CONTACT */
function initContact(){
  const form=document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const btn=form.querySelector('[type=submit]');
    btn.dataset.original=btn.textContent;
    setLoading(btn,true,'Sending...');
    const res=await api('/contact',{name:form.name?.value.trim(),email:form.email?.value.trim(),subject:form.subject?.value.trim(),message:form.message?.value.trim()});
    setLoading(btn,false);
    if(res.ok){showAlert('contact-alert',"Message sent successfully! We'll get back to you soon.",'success');form.reset();}
    else showAlert('contact-alert',res.error||'Failed to send message. Please try again.','danger');
  });
}

function showToast(msg,type='success',duration=3000){
  document.querySelector('.toast')?.remove();
  const toast=document.createElement('div');
  toast.className=`toast toast-${type}`;
  toast.innerHTML=`<i class="fas fa-${type==='success'?'check-circle':type==='danger'?'exclamation-circle':'info-circle'}"></i> ${msg}`;
  document.body.appendChild(toast);
  requestAnimationFrame(()=>requestAnimationFrame(()=>toast.classList.add('show')));
  setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(),350);},duration);
}

function sendSuggestion(text){
  const inputEl=document.getElementById('chat-input');
  if(inputEl){inputEl.value=text;inputEl.dispatchEvent(new Event('input'));document.getElementById('chat-send')?.click();}
}

/* ============================================
   CAREERSPHERE - Report Page JavaScript
   ============================================ */
'use strict';

/* ── STATIC DATA FALLBACKS ── */
const STREAM_DATA = {
  Science: {
    name: 'Science (PCM)',
    desc: 'Your answers show strong analytical and mathematical ability. Science with Physics, Chemistry & Mathematics opens doors to engineering, technology, and research careers.',
    subjects: ['Physics','Chemistry','Mathematics','Computer Science','English'],
    confidence: 87,
    color: 'blue',
    exams: [
      { icon:'📝', name:'JEE Main',     date:'Jan & Apr 2027', use:'Engineering entry',   color:'#EFF6FF', nameColor:'#1D4ED8', metaColor:'#1e40af' },
      { icon:'🎯', name:'JEE Advanced', date:'May 2027',        use:'IIT admission',       color:'#F5F3FF', nameColor:'#5B21B6', metaColor:'#5B21B6' },
      { icon:'🏆', name:'BITSAT',       date:'May 2027',        use:'BITS Pilani entry',   color:'#ECFDF5', nameColor:'#065F46', metaColor:'#065F46' },
      { icon:'📚', name:'CUET',         date:'May 2027',        use:'Central universities',color:'#FFFBEB', nameColor:'#92400E', metaColor:'#92400E' }
    ],
    actions: {
      m3: ['Choose Science (PCM) stream for Class 11','Start JEE Foundation course in Maths & Physics','Learn Python basics (free on NPTEL)','Register for NTSE examination','Join a study group for competitive exams'],
      y1: ['Score 85%+ in Class 11 board exams','Enrol in JEE coaching (Allen / Vedantu / FIITJEE)','Complete 2 practice test series for JEE','Build a small project using Python or web','Appear for Olympiads — Math, Science, Informatics'],
      y5: ['Target IIT / NIT / BITS for B.Tech CSE','Score 90%+ in Class 12 boards + JEE rank under 5000','Specialise in AI/ML or Data Science in 2nd year','Do internships from 3rd year onwards','Target ₹15+ LPA placement or startup opportunity']
    }
  },
  Commerce: {
    name: 'Commerce',
    desc: 'Your answers show a strong inclination towards business, finance, and management. Commerce stream leads to careers in accounting, banking, entrepreneurship, and economics.',
    subjects: ['Accountancy','Business Studies','Economics','Mathematics','Entrepreneurship'],
    confidence: 84,
    color: 'commerce',
    exams: [
      { icon:'📝', name:'CA Foundation', date:'May & Nov 2027', use:'CA programme entry',  color:'#FFFBEB', nameColor:'#B45309', metaColor:'#92400E' },
      { icon:'🎯', name:'CUET',          date:'May 2027',        use:'University admission',color:'#EFF6FF', nameColor:'#1D4ED8', metaColor:'#1e40af' },
      { icon:'🏆', name:'IPMAT',         date:'May 2027',        use:'IIM Indore BBA',      color:'#ECFDF5', nameColor:'#065F46', metaColor:'#065F46' },
      { icon:'📚', name:'CAT',           date:'Nov 2029',        use:'MBA admission',       color:'#FDF4FF', nameColor:'#7C3AED', metaColor:'#4C1D95' }
    ],
    actions: {
      m3: ['Choose Commerce stream with Mathematics for Class 11','Start reading Economics and Accountancy textbooks early','Learn MS Excel and basic financial modelling','Register for CA Foundation by December','Join business quiz competitions in school'],
      y1: ['Score 85%+ in Class 11 board exams','Enrol in CA Foundation coaching','Complete basic accounting certification online','Read one business book per month','Start tracking stock markets — open a paper trading account'],
      y5: ['Target IIM / SRCC / St. Xaviers for BBA/B.Com','Qualify CA Foundation and Intermediate exams','Target CAT score 95%+ for MBA from IIM','Work in a CA firm or startup finance team','Build expertise in taxation, audit, or investment banking']
    }
  },
  Arts: {
    name: 'Arts',
    desc: 'Your answers show creative and analytical strengths. Arts stream is ideal for careers in law, psychology, journalism, design, social work, and the creative industries.',
    subjects: ['History','Political Science','Psychology','Sociology','Literature','Fine Arts'],
    confidence: 82,
    color: 'arts',
    exams: [
      { icon:'⚖️', name:'CLAT',   date:'Dec 2026',  use:'Law school entry',     color:'#FDF4FF', nameColor:'#7C3AED', metaColor:'#4C1D95' },
      { icon:'📝', name:'CUET',   date:'May 2027',   use:'University admission', color:'#EFF6FF', nameColor:'#1D4ED8', metaColor:'#1e40af' },
      { icon:'🎨', name:'NID DAT',date:'Jan 2027',   use:'Design schools',       color:'#FFF7ED', nameColor:'#C2410C', metaColor:'#9A3412' },
      { icon:'👗', name:'NIFT',   date:'Jan 2027',   use:'Fashion/Design entry', color:'#FDF2F8', nameColor:'#9D174D', metaColor:'#831843' }
    ],
    actions: {
      m3: ['Choose Arts stream with Psychology or Political Science','Start reading newspapers daily — The Hindu or Indian Express','Join your school\'s debate or drama club','Visit a law court or NGO to explore careers first-hand','Begin a journal or blog to improve writing skills'],
      y1: ['Score 85%+ in Class 11 board exams','Start CLAT preparation if interested in law','Study for CUET — target top colleges like LSR, Miranda House','Take free online courses in psychology or sociology','Build a portfolio — writing samples, artwork, or debate recordings'],
      y5: ['Target top Arts colleges — DU, JNU, Symbiosis, Christ University','Choose specialisation — law, psychology, journalism, or design','Complete internships in media, NGOs, or law firms','Pursue LLB / MA / MBA in your chosen field','Build a strong portfolio and professional network']
    }
  }
};

const CAREER_DATA = {
  Science: [
    { title:'Software Engineer',  desc:'Design and build software applications. Highest demand career in India with excellent growth trajectory.', degree:'B.Tech CSE / BCA', exams:['JEE Main','BITSAT'], salary:'₹6–35 LPA', salaryPct:80 },
    { title:'Data Scientist',     desc:'Analyse large datasets to extract insights using Python, ML and statistics. Fastest growing field globally.', degree:'B.Tech CSE / B.Sc. Statistics', exams:['JEE Main','CUET'], salary:'₹8–40 LPA', salaryPct:88 },
    { title:'AI / ML Engineer',   desc:'Build artificial intelligence systems. Future-proof career with global demand and top salaries worldwide.', degree:'B.Tech CSE (AI/ML)', exams:['JEE Main','JEE Advanced'], salary:'₹10–50 LPA', salaryPct:95 }
  ],
  Commerce: [
    { title:'Chartered Accountant', desc:'Manage financial accounts, audit firms, and provide tax advice. Highly respected profession with excellent pay.', degree:'B.Com + CA Programme', exams:['CA Foundation','CUET'], salary:'₹8–40 LPA', salaryPct:85 },
    { title:'Investment Banker',    desc:'Help companies raise capital and manage mergers. High pressure, extremely high reward career in finance.', degree:'BBA Finance / MBA', exams:['CAT','GMAT'], salary:'₹12–60 LPA', salaryPct:95 },
    { title:'Business Analyst',     desc:'Bridge IT and business by identifying needs and recommending data-driven solutions for companies.', degree:'BBA / MBA', exams:['CAT','CUET'], salary:'₹6–28 LPA', salaryPct:72 }
  ],
  Arts: [
    { title:'Lawyer',        desc:'Represent clients in courts, draft legal documents, and advise on legal matters across all areas of law.', degree:'BA LLB / BBA LLB', exams:['CLAT','AILET'], salary:'₹5–30 LPA', salaryPct:70 },
    { title:'Psychologist',  desc:'Study human behaviour and mental processes. Help people overcome emotional and psychological challenges.', degree:'BA/BSc Psychology', exams:['CUET','University Exams'], salary:'₹4–20 LPA', salaryPct:60 },
    { title:'Journalist',    desc:'Research and report news stories across print, digital, radio, or television media platforms.', degree:'BA Journalism / BMC', exams:['CUET','IIMC Entrance'], salary:'₹4–25 LPA', salaryPct:65 }
  ]
};

const SKILL_DATA = {
  Science:  [{ name:'Analytical',  pct:88, color:'#2563eb'},{ name:'Mathematical', pct:82, color:'#2563eb'},{ name:'Technical',   pct:75, color:'#7C3AED'},{ name:'Creative',    pct:60, color:'#D97706'},{ name:'Communication',pct:55,color:'#059669'}],
  Commerce: [{ name:'Analytical',  pct:80, color:'#D97706'},{ name:'Numerical',   pct:85, color:'#D97706'},{ name:'Communication',pct:78,color:'#059669'},{ name:'Leadership',  pct:70, color:'#2563eb'},{ name:'Creative',    pct:60, color:'#7C3AED'}],
  Arts:     [{ name:'Creative',    pct:90, color:'#7C3AED'},{ name:'Communication',pct:85,color:'#059669'},{ name:'Empathy',     pct:80, color:'#ec4899'},{ name:'Analytical',  pct:65, color:'#2563eb'},{ name:'Research',    pct:75, color:'#D97706'}]
};

const QUIZ_QUESTIONS = [
  'Which subject do you enjoy the most?',
  'What type of work excites you?',
  'Which career appeals to you most?',
  'How do you prefer to learn?',
  'Which board result are you planning around?'
];

/* ── MAIN INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  showState('loading');
  const user = JSON.parse(localStorage.getItem('cgs_user') || '{}');
  const token = localStorage.getItem('cgs_token');

  let reportData = null;

  if (token) {
    try {
      const res = await fetch('/reports', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        reportData = data.report || data;
      }
    } catch(e) {}
  }

  // Build report from local data + API data
  const localStream = localStorage.getItem('cs_stream') || null;
  const localAnswers = JSON.parse(localStorage.getItem('cs_quiz_answers') || 'null');
  const localSubject = localStorage.getItem('cs_subject') || null;
  const localBookmarks = JSON.parse(localStorage.getItem('cs_bookmarks') || '[]');

  const stream = reportData?.stream || localStream;

  if (!stream && !reportData && !localSubject) {
    showState('empty');
    return;
  }

  const resolvedStream = stream || 'Science';
  renderReport({ user, reportData, stream: resolvedStream, answers: localAnswers, subject: localSubject, bookmarks: localBookmarks });
  showState('content');
});

/* ── RENDER REPORT ── */
function renderReport({ user, reportData, stream, answers, subject, bookmarks }) {
  const now = new Date();
  const reportId = reportData?.report_id || 'CS-' + Math.floor(10000 + Math.random() * 90000);
  const dateStr = now.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  const year = `Academic Year ${now.getFullYear()}–${(now.getFullYear()+1).toString().slice(2)}`;

  // Header
  setText('rpt-id', reportId);
  setText('rpt-date', dateStr);
  setText('rpt-year', year);
  setText('footer-id', reportId);
  setText('footer-date', dateStr);

  // Student identity
  const name = user.name || reportData?.name || 'Student';
  const email = user.email || reportData?.email || '—';
  const grade = user.grade || reportData?.grade || localStorage.getItem('cs_grade') || 'Class 10';
  const city  = user.city  || reportData?.city  || 'India';
  setText('rpt-name', name);
  setText('rpt-email', email);
  setText('rpt-grade', grade);
  setText('rpt-city', city);
  setText('rpt-joined', user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN',{month:'short',year:'numeric'}) : 'Recently');
  setText('rpt-avatar', name.charAt(0).toUpperCase());
  setText('rpt-short-id', reportId.replace('CS-','').toLowerCase());

  // Stats
  const stats = reportData?.stats || {};
  setStatCount('stat-modules',   stats.modules_used           || countUsedModules());
  setStatCount('stat-quizzes',   stats.quizzes_taken          || (answers ? 1 : 0));
  setStatCount('stat-bookmarks', stats.bookmarks              || bookmarks.length || 0);
  setStatCount('stat-careers',   stats.careers_explored       || (subject ? 4 : 0));

  // Interest profile
  const subjectLabel = subject || reportData?.subject || (stream === 'Commerce' ? 'Accountancy' : stream === 'Arts' ? 'History / Literature' : 'Mathematics');
  const interests = reportData?.interests || localStorage.getItem('cs_interests') || 'Problem solving, logical thinking';
  const skills    = reportData?.skills    || localStorage.getItem('cs_skills')    || 'Analytical, research';
  setText('prof-subject',   subjectLabel);
  setText('prof-interests', interests);
  setText('prof-skills',    skills);
  setText('prof-grade',     grade);

  // Skill bars
  const skillBarsEl = document.getElementById('skill-bars');
  if (skillBarsEl) {
    const skills_list = SKILL_DATA[stream] || SKILL_DATA.Science;
    skillBarsEl.innerHTML = skills_list.map(s => `
      <div class="skill-row">
        <span class="skill-name">${s.name}</span>
        <div class="skill-bar"><div class="skill-fill" style="width:0%;background:${s.color}" data-pct="${s.pct}"></div></div>
        <span class="skill-pct">${s.pct}%</span>
      </div>`).join('');
    // Animate bars after render
    setTimeout(() => {
      document.querySelectorAll('.skill-fill').forEach(el => {
        el.style.width = el.getAttribute('data-pct') + '%';
      });
    }, 300);
  }

  // Stream recommendation
  const sd = STREAM_DATA[stream] || STREAM_DATA.Science;
  const streamCard = document.getElementById('stream-card');
  if (streamCard) {
    streamCard.className = 'stream-card ' + sd.color;
  }
  setText('stream-name', sd.name);
  setText('stream-desc', sd.desc);
  const subjectsEl = document.getElementById('stream-subjects');
  if (subjectsEl) {
    subjectsEl.innerHTML = sd.subjects.map(s => `<span class="stream-subject-tag">${s}</span>`).join('');
  }
  const conf = reportData?.confidence || sd.confidence;
  setTimeout(() => { const cf = document.getElementById('conf-fill'); if(cf) cf.style.width = conf + '%'; }, 400);
  setText('conf-pct', conf + '% — Strong Match');

  // Quiz answers
  const qaEl = document.getElementById('quiz-answers');
  if (qaEl) {
    const ans = answers || reportData?.quiz_answers || null;
    if (ans && ans.length) {
      const opts = {
        Science:  ['Mathematics and Physics','Building and Engineering','Engineer / Scientist','Through experiments and logic','After 12th Science'],
        Commerce: ['Accounts and Economics','Managing businesses and finances','CA / Banker / Economist','Through numbers and data','After 12th Commerce'],
        Arts:     ['History and Literature','Creating and expressing ideas','Artist / Writer / Journalist','Through creativity and stories','After 12th Arts']
      };
      const streamOpts = opts[stream] || opts.Science;
      qaEl.innerHTML = QUIZ_QUESTIONS.map((q, i) => `
        <div class="quiz-answer-row">
          <span class="qa-q">${q}</span>
          <span class="qa-a">${streamOpts[i] || '—'}</span>
        </div>`).join('');
    }
  }

  // Career recommendations
  const careerGrid = document.getElementById('career-grid');
  if (careerGrid) {
    const careers = (reportData?.careers || CAREER_DATA[stream] || CAREER_DATA.Science);
    careerGrid.innerHTML = careers.slice(0,3).map((c, i) => `
      <div class="career-card">
        <div class="career-rank">${i+1}</div>
        <div class="career-title">${c.title || c.name}</div>
        <div class="career-desc">${c.description || c.desc}</div>
        <div class="career-info"><i class="fas fa-graduation-cap" style="color:#2563eb;width:14px"></i><strong>Degree:</strong> ${c.degree || c.recommended_degree || '—'}</div>
        <div class="career-info" style="margin-bottom:4px"><i class="fas fa-file-alt" style="color:#2563eb;width:14px"></i><strong>Exams:</strong></div>
        <div class="exam-tags">${(c.exams || c.entrance_exams || []).map(e => `<span class="exam-tag">${e}</span>`).join('')}</div>
        <div class="salary-label">Salary: ${c.salary || c.salary_range || '—'}</div>
        <div class="salary-bar"><div class="salary-fill" style="width:${c.salaryPct || 70}%"></div></div>
      </div>`).join('');
  }

  // Exam roadmap
  const examEl = document.getElementById('exam-roadmap');
  if (examEl) {
    examEl.innerHTML = sd.exams.map(e => `
      <div class="exam-box" style="background:${e.color}">
        <div class="exam-icon">${e.icon}</div>
        <div class="exam-name" style="color:${e.nameColor}">${e.name}</div>
        <div class="exam-date" style="color:${e.metaColor}">${e.date}</div>
        <div class="exam-use" style="color:${e.metaColor}">${e.use}</div>
      </div>`).join('');
  }

  // Action plan
  renderActionList('action-3m', sd.actions.m3);
  renderActionList('action-1y', sd.actions.y1);
  renderActionList('action-5y', sd.actions.y5);

  // Bookmarked degrees
  const degreeGrid = document.getElementById('degree-grid');
  if (degreeGrid) {
    const savedDegrees = reportData?.bookmarked_degrees || bookmarks;
    if (savedDegrees && savedDegrees.length > 0) {
      degreeGrid.innerHTML = savedDegrees.slice(0, 4).map(d => `
        <div class="degree-info-card">
          <div class="info-card-title"><i class="fas fa-graduation-cap" style="color:#2563eb"></i> ${d.name || d.title || d}</div>
          <div class="info-row"><span class="info-lbl">Duration</span><span class="info-val">${d.duration || '3–4 Years'}</span></div>
          <div class="info-row"><span class="info-lbl">Fee Range</span><span class="info-val">${d.fee_range || d.fees || '₹1–10 Lakhs'}</span></div>
          <div class="info-row"><span class="info-lbl">Entrance Exam</span><span class="info-val">${(d.entrance_exams || d.exams || ['CUET']).join(', ')}</span></div>
        </div>`).join('');
    }
  }
}

/* ── HELPERS ── */
function showState(state) {
  document.getElementById('report-loading')?.classList.add('hidden');
  document.getElementById('report-empty')?.classList.add('hidden');
  document.getElementById('report-content')?.classList.add('hidden');
  if (state === 'loading') document.getElementById('report-loading')?.classList.remove('hidden');
  if (state === 'empty')   document.getElementById('report-empty')?.classList.remove('hidden');
  if (state === 'content') document.getElementById('report-content')?.classList.remove('hidden');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setStatCount(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '0';
  let current = 0;
  const target = parseInt(val) || 0;
  if (target === 0) { el.textContent = '0'; return; }
  const step = Math.ceil(target / 20);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 50);
}

function renderActionList(id, items) {
  const el = document.getElementById(id);
  if (!el || !items) return;
  el.innerHTML = items.map(item => `<li><span>${item}</span></li>`).join('');
}

function countUsedModules() {
  let count = 0;
  if (localStorage.getItem('cs_stream')) count++;
  if (localStorage.getItem('cs_subject')) count++;
  if (localStorage.getItem('cs_bookmarks')) count++;
  return Math.max(count, 1);
}

// Save quiz results when redirected from stream-selector
window.addEventListener('message', (e) => {
  if (e.data?.type === 'stream_result') {
    localStorage.setItem('cs_stream', e.data.stream);
    localStorage.setItem('cs_quiz_answers', JSON.stringify(e.data.answers));
  }
});