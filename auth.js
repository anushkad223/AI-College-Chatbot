/* ════════════════════════════════════════
   auth.js — PallottiBot Login/Register Gate
   SELF-CONTAINED: CSS injected automatically
   Just add ONE line before index.js:
   <script src="auth.js"></script>
════════════════════════════════════════ */

// ─── INJECT CSS INLINE ───
(function injectAuthCSS() {
  const style = document.createElement('style');
  style.textContent = `
    #auth-overlay {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      background: rgba(7,14,28,0.88);
      backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    #auth-overlay.active { opacity: 1; pointer-events: all; }

    .auth-card {
      background: linear-gradient(160deg, #0d1b2e 0%, #112347 100%);
      border: 1px solid rgba(200,148,31,0.4);
      border-radius: 22px; width: 100%; max-width: 420px; margin: 16px;
      padding: 36px 32px 30px; position: relative;
      box-shadow: 0 40px 90px rgba(0,0,0,0.7), 0 0 80px rgba(200,148,31,0.06);
      transform: translateY(24px) scale(0.96);
      transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    #auth-overlay.active .auth-card { transform: translateY(0) scale(1); }

    .auth-close-btn {
      position: absolute !important; top: 14px !important; right: 14px !important;
      width: 32px !important; height: 32px !important;
      background: rgba(255,255,255,0.07) !important;
      border: 1px solid rgba(255,255,255,0.14) !important;
      color: rgba(255,255,255,0.5) !important; border-radius: 8px !important;
      font-size: 15px !important; cursor: pointer !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      transition: all 0.2s !important; line-height: 1 !important; padding: 0 !important;
      font-family: inherit !important;
    }
    .auth-close-btn:hover { background: rgba(255,255,255,0.14) !important; color: white !important; }

    .auth-logo-row { display: flex; align-items: center; gap: 13px; margin-bottom: 20px; }
    .auth-bot-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #c8941f, #7a5000);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', serif; font-size: 21px; font-weight: 700; color: #0b1d3a;
      border: 2px solid rgba(200,148,31,0.55); flex-shrink: 0;
      box-shadow: 0 0 20px rgba(200,148,31,0.3);
    }
    .auth-logo-info h3 {
      font-family: 'Cormorant Garamond', serif !important; font-size: 18px !important;
      font-weight: 700 !important; color: #e8b84b !important;
      line-height: 1.1 !important; margin: 0 0 2px !important; padding: 0 !important;
    }
    .auth-logo-info p {
      font-size: 11px !important; color: rgba(255,255,255,0.3) !important;
      margin: 0 !important; padding: 0 !important;
    }

    .auth-headline {
      font-family: 'Cormorant Garamond', serif !important; font-size: 26px !important;
      font-weight: 700 !important; color: #ffffff !important;
      margin: 0 0 5px !important; padding: 0 !important; line-height: 1.2 !important;
    }
    .auth-sub-text {
      font-size: 12.5px !important; color: rgba(255,255,255,0.38) !important;
      margin: 0 0 22px !important; line-height: 1.6 !important; padding: 0 !important;
    }

    .auth-tabs-row {
      display: flex; gap: 5px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 11px; padding: 4px; margin-bottom: 22px;
    }
    .auth-tab-btn {
      flex: 1 !important; padding: 9px 0 !important;
      background: transparent !important; border: none !important;
      color: rgba(255,255,255,0.38) !important;
      font-family: 'Outfit', sans-serif !important; font-size: 13px !important;
      font-weight: 500 !important; border-radius: 8px !important;
      cursor: pointer !important; transition: all 0.22s !important;
    }
    .auth-tab-btn.active {
      background: linear-gradient(135deg, #c8941f, #8b6000) !important;
      color: white !important; font-weight: 600 !important;
      box-shadow: 0 3px 14px rgba(200,148,31,0.4) !important;
    }
    .auth-tab-btn:not(.active):hover {
      color: rgba(255,255,255,0.65) !important;
      background: rgba(255,255,255,0.06) !important;
    }

    .auth-fields { display: flex; flex-direction: column; gap: 14px; }
    .auth-field-group { display: flex; flex-direction: column; gap: 6px; }
    .auth-field-group label {
      font-size: 11px !important; font-weight: 600 !important;
      color: rgba(255,255,255,0.4) !important; letter-spacing: 0.08em !important;
      text-transform: uppercase !important; margin: 0 !important; padding: 0 !important;
    }
    .auth-field-group input {
      background: rgba(255,255,255,0.06) !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 10px !important; padding: 11px 14px !important;
      color: white !important; font-family: 'Outfit', sans-serif !important;
      font-size: 13.5px !important; outline: none !important;
      transition: border 0.2s, background 0.2s !important;
      width: 100% !important; box-sizing: border-box !important;
    }
    .auth-field-group input::placeholder { color: rgba(255,255,255,0.2) !important; }
    .auth-field-group input:focus {
      border-color: #c8941f !important; background: rgba(200,148,31,0.06) !important;
    }

    .auth-msg-box {
      font-size: 12.5px; text-align: center; padding: 9px 12px;
      border-radius: 9px; display: none; margin-top: 2px;
      font-family: 'Outfit', sans-serif;
    }
    .auth-msg-box.error {
      display: block; background: rgba(255,80,80,0.1);
      border: 1px solid rgba(255,80,80,0.3); color: #ff9090;
    }
    .auth-msg-box.success {
      display: block; background: rgba(94,224,94,0.1);
      border: 1px solid rgba(94,224,94,0.3); color: #7ee87e;
    }

    .auth-submit-btn {
      width: 100% !important; padding: 13px !important;
      background: linear-gradient(135deg, #c8941f, #8b6000) !important;
      border: none !important; border-radius: 11px !important;
      color: white !important; font-family: 'Outfit', sans-serif !important;
      font-size: 14px !important; font-weight: 600 !important;
      cursor: pointer !important; transition: all 0.25s !important;
      box-shadow: 0 4px 20px rgba(200,148,31,0.32) !important;
      letter-spacing: 0.02em !important; margin-top: 4px !important;
    }
    .auth-submit-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 7px 28px rgba(200,148,31,0.48) !important;
    }
    .auth-submit-btn:active { transform: translateY(0) !important; }
    .auth-submit-btn.secondary {
      background: rgba(255,255,255,0.07) !important;
      box-shadow: none !important; border: 1px solid rgba(255,255,255,0.14) !important;
      color: rgba(255,255,255,0.6) !important; font-weight: 500 !important;
    }
    .auth-submit-btn.secondary:hover {
      background: rgba(255,255,255,0.12) !important;
      transform: translateY(-1px) !important; box-shadow: none !important;
    }

    .auth-divider-line {
      display: flex; align-items: center; gap: 10px;
      font-size: 11px; color: rgba(255,255,255,0.18);
      margin: 4px 0; font-family: 'Outfit', sans-serif;
    }
    .auth-divider-line::before, .auth-divider-line::after {
      content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.09);
    }

    #chat-user-bar {
      display: none; align-items: center; justify-content: space-between;
      padding: 7px 16px; background: rgba(200,148,31,0.09);
      border-bottom: 1px solid rgba(200,148,31,0.22); font-size: 12px;
    }
    #chat-user-bar.visible { display: flex; }
    .bar-greeting { color: rgba(255,255,255,0.5); font-family: 'Outfit', sans-serif; }
    .bar-greeting b { color: #e8b84b; }
    .bar-logout-btn {
      background: transparent !important; border: 1px solid rgba(255,255,255,0.15) !important;
      color: rgba(255,255,255,0.38) !important; border-radius: 6px !important;
      padding: 3px 10px !important; font-size: 11px !important;
      cursor: pointer !important; font-family: 'Outfit', sans-serif !important;
      transition: all 0.2s !important;
    }
    .bar-logout-btn:hover {
      border-color: rgba(255,80,80,0.4) !important; color: #ff8080 !important;
      background: rgba(255,80,80,0.06) !important;
    }

    #chat-locked-banner {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 10px; padding: 28px 20px 20px; text-align: center;
    }
    .lock-icon-big { font-size: 38px; }
    .lock-title {
      font-family: 'Cormorant Garamond', serif !important; font-size: 20px !important;
      font-weight: 700 !important; color: #e8b84b !important; margin: 0 !important;
    }
    .lock-desc {
      font-size: 12.5px !important; color: rgba(255,255,255,0.35) !important;
      line-height: 1.65 !important; margin: 0 !important; font-family: 'Outfit', sans-serif !important;
    }
    .lock-open-btn {
      margin-top: 6px !important; padding: 11px 28px !important;
      background: linear-gradient(135deg, #c8941f, #8b6000) !important;
      border: none !important; border-radius: 11px !important;
      color: white !important; font-family: 'Outfit', sans-serif !important;
      font-size: 13px !important; font-weight: 600 !important;
      cursor: pointer !important; transition: all 0.22s !important;
      box-shadow: 0 4px 16px rgba(200,148,31,0.35) !important;
      letter-spacing: 0.02em !important;
    }
    .lock-open-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 22px rgba(200,148,31,0.48) !important;
    }

    .chat-input-locked {
      opacity: 0.3 !important; user-select: none !important;
    }
  `;
  document.head.appendChild(style);
})();

// ─── AUTH STATE ───
const Auth = (() => {
  const KEY = 'pallottibot_user';
  const UKEY = 'pallotti_local_users';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
  return {
    getUser: get,
    setUser: u => localStorage.setItem(KEY, JSON.stringify(u)),
    clearUser: () => localStorage.removeItem(KEY),
    isLoggedIn: () => !!get(),
    getLocalUsers: () => { try { return JSON.parse(localStorage.getItem(UKEY)) || {}; } catch { return {}; } },
    saveLocalUsers: u => localStorage.setItem(UKEY, JSON.stringify(u)),
  };
})();

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  buildModal();
  buildUserBar();
  syncUI();
  patchSendChat();
});

// ─── BUILD MODAL ───
function buildModal() {
  const ov = document.createElement('div');
  ov.id = 'auth-overlay';
  ov.innerHTML = `
    <div class="auth-card">
      <button class="auth-close-btn" onclick="closeAuthModal()">✕</button>
      <div class="auth-logo-row">
        <div class="auth-bot-avatar">P</div>
        <div class="auth-logo-info">
          <h3>PallottiBot AI</h3>
          <p>SVPCET College Assistant</p>
        </div>
      </div>
      <h2 class="auth-headline" id="auth-headline">Welcome back!</h2>
      <p class="auth-sub-text" id="auth-sub">Sign in to chat with PallottiBot and get instant answers about SVPCET.</p>
      <div class="auth-tabs-row">
        <button class="auth-tab-btn active" id="tab-login" onclick="switchAuthTab('login')">🔑 Login</button>
        <button class="auth-tab-btn" id="tab-reg" onclick="switchAuthTab('register')">✨ Register</button>
      </div>
      <div id="login-panel" class="auth-fields">
        <div class="auth-field-group">
          <label>Username</label>
          <input type="text" id="login-user" placeholder="Enter your username" autocomplete="username" />
        </div>
        <div class="auth-field-group">
          <label>Password</label>
          <input type="password" id="login-pass" placeholder="Enter your password" autocomplete="current-password" />
        </div>
        <div class="auth-msg-box" id="login-msg"></div>
        <button class="auth-submit-btn" onclick="handleLogin()">Login to Chat →</button>
        <div class="auth-divider-line">New here?</div>
        <button class="auth-submit-btn secondary" onclick="switchAuthTab('register')">Create Free Account</button>
      </div>
      <div id="reg-panel" class="auth-fields" style="display:none;">
        <div class="auth-field-group">
          <label>Full Name</label>
          <input type="text" id="reg-name" placeholder="Your full name" autocomplete="name" />
        </div>
        <div class="auth-field-group">
          <label>Username</label>
          <input type="text" id="reg-user" placeholder="Choose a username" autocomplete="username" />
        </div>
        <div class="auth-field-group">
          <label>Password</label>
          <input type="password" id="reg-pass" placeholder="Create a password (min 6 chars)" autocomplete="new-password" />
        </div>
        <div class="auth-msg-box" id="reg-msg"></div>
        <button class="auth-submit-btn" onclick="handleRegister()">Create Account →</button>
        <div class="auth-divider-line">Already registered?</div>
        <button class="auth-submit-btn secondary" onclick="switchAuthTab('login')">Back to Login</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) closeAuthModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAuthModal();
    if (e.key === 'Enter' && ov.classList.contains('active')) {
      document.getElementById('login-panel').style.display !== 'none' ? handleLogin() : handleRegister();
    }
  });
}

// ─── BUILD USER BAR ───
function buildUserBar() {
  const hdr = document.querySelector('.chat-header');
  if (!hdr) return;
  const bar = document.createElement('div');
  bar.id = 'chat-user-bar';
  bar.innerHTML = `<span class="bar-greeting">Logged in as <b id="bar-uname"></b></span>
    <button class="bar-logout-btn" onclick="handleLogout()">Logout</button>`;
  hdr.insertAdjacentElement('afterend', bar);
}

// ─── SYNC UI ───
function syncUI() {
  const user = Auth.getUser();
  const bar = document.getElementById('chat-user-bar');
  if (user) {
    unlockChat();
    if (bar) { bar.classList.add('visible'); const n = document.getElementById('bar-uname'); if (n) n.textContent = user.name || user.username; }
  } else {
    lockChat();
    if (bar) bar.classList.remove('visible');
  }
}

// ─── LOCK ───
function lockChat() {
  const ia = document.querySelector('.chat-input-area');
  if (ia) { ia.classList.add('chat-input-locked'); ia.style.pointerEvents = 'all'; ia.onclick = () => { if (!Auth.isLoggedIn()) openAuthModal(); }; }
  const chips = document.getElementById('quickChips');
  if (chips) chips.style.display = 'none';
  if (document.getElementById('chat-locked-banner')) return;
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const b = document.createElement('div');
  b.id = 'chat-locked-banner';
  b.innerHTML = `<div class="lock-icon-big">🔐</div>
    <p class="lock-title">Login Required</p>
    <p class="lock-desc">Please login or register to access<br>PallottiBot and ask your queries.</p>
    <button class="lock-open-btn" onclick="openAuthModal()">🔑 Login / Register</button>`;
  msgs.appendChild(b);
}

// ─── UNLOCK ───
function unlockChat() {
  const ia = document.querySelector('.chat-input-area');
  if (ia) { ia.classList.remove('chat-input-locked'); ia.style.pointerEvents = ''; ia.onclick = null; }
  const b = document.getElementById('chat-locked-banner');
  if (b) b.remove();
  const chips = document.getElementById('quickChips');
  if (chips) chips.style.display = 'flex';
}

// ─── OPEN/CLOSE ───
function openAuthModal() {
  const ov = document.getElementById('auth-overlay');
  if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
  setTimeout(() => {
    const lp = document.getElementById('login-panel');
    const inp = lp && lp.style.display !== 'none' ? document.getElementById('login-user') : document.getElementById('reg-name');
    if (inp) inp.focus();
  }, 220);
}
function closeAuthModal() {
  const ov = document.getElementById('auth-overlay');
  if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
  clearAuthMsgs();
}

// ─── TAB SWITCH ───
function switchAuthTab(tab) {
  clearAuthMsgs();
  const tl = document.getElementById('tab-login'), tr = document.getElementById('tab-reg');
  const lp = document.getElementById('login-panel'), rp = document.getElementById('reg-panel');
  const h = document.getElementById('auth-headline'), s = document.getElementById('auth-sub');
  if (tab === 'login') {
    tl.classList.add('active'); tr.classList.remove('active');
    lp.style.display = 'flex'; rp.style.display = 'none';
    h.textContent = 'Welcome back!';
    s.textContent = 'Sign in to chat with PallottiBot and get instant answers about SVPCET.';
    setTimeout(() => document.getElementById('login-user')?.focus(), 60);
  } else {
    tr.classList.add('active'); tl.classList.remove('active');
    rp.style.display = 'flex'; lp.style.display = 'none';
    h.textContent = 'Create Account';
    s.textContent = 'Register once and access PallottiBot anytime for all your SVPCET queries.';
    setTimeout(() => document.getElementById('reg-name')?.focus(), 60);
  }
}

function showAuthMsg(id, type, text) {
  const el = document.getElementById(id);
  if (el) { el.className = `auth-msg-box ${type}`; el.textContent = text; }
}
function clearAuthMsgs() {
  ['login-msg', 'reg-msg'].forEach(id => { const el = document.getElementById(id); if (el) { el.className = 'auth-msg-box'; el.textContent = ''; } });
}

// ─── LOGIN ───
async function handleLogin() {
  const username = document.getElementById('login-user')?.value.trim();
  const password = document.getElementById('login-pass')?.value;
  if (!username || !password) return showAuthMsg('login-msg', 'error', 'Please fill in all fields.');
  try {
    const res = await fetch('http://127.0.0.1:5000/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (data.status === 'success') {
      Auth.setUser({ username, name: username });
      showAuthMsg('login-msg', 'success', '✅ Login successful! Opening chatbot...');
      setTimeout(() => { closeAuthModal(); syncUI(); }, 900);
    } else { showAuthMsg('login-msg', 'error', data.msg || 'Invalid username or password.'); }
  } catch {
    const users = Auth.getLocalUsers();
    if (users[username] && users[username].password === password) {
      Auth.setUser({ username, name: users[username].name || username });
      showAuthMsg('login-msg', 'success', '✅ Login successful! Opening chatbot...');
      setTimeout(() => { closeAuthModal(); syncUI(); }, 900);
    } else { showAuthMsg('login-msg', 'error', 'Invalid username or password.'); }
  }
}

// ─── REGISTER ───
async function handleRegister() {
  const name = document.getElementById('reg-name')?.value.trim();
  const username = document.getElementById('reg-user')?.value.trim();
  const password = document.getElementById('reg-pass')?.value;
  if (!name || !username || !password) return showAuthMsg('reg-msg', 'error', 'Please fill in all fields.');
  if (username.length < 3) return showAuthMsg('reg-msg', 'error', 'Username must be at least 3 characters.');
  if (password.length < 6) return showAuthMsg('reg-msg', 'error', 'Password must be at least 6 characters.');
  try {
    const res = await fetch('http://127.0.0.1:5000/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (data.status === 'success') {
      Auth.setUser({ username, name });
      showAuthMsg('reg-msg', 'success', '✅ Account created! Opening chatbot...');
      setTimeout(() => { closeAuthModal(); syncUI(); }, 900);
    } else { showAuthMsg('reg-msg', 'error', data.msg || 'Registration failed.'); }
  } catch {
    const users = Auth.getLocalUsers();
    if (users[username]) return showAuthMsg('reg-msg', 'error', 'Username already taken. Try another.');
    users[username] = { password, name };
    Auth.saveLocalUsers(users);
    Auth.setUser({ username, name });
    showAuthMsg('reg-msg', 'success', '✅ Account created! Opening chatbot...');
    setTimeout(() => { closeAuthModal(); syncUI(); }, 900);
  }

}
function openReset() {
  const username = prompt("Enter your username:");
  const newPass = prompt("Enter new password:");

  if (!username || !newPass) {
    alert("❌ All fields required");
    return;
  }

  fetch("http://127.0.0.1:5000/reset_password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      new_password: newPass
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      alert("✅ Password reset successful!");
    } else {
      alert("❌ " + data.msg);
    }
  })
  .catch(() => alert("Server error 😢"));
}

// ─── LOGOUT ───
function handleLogout() {
  Auth.clearUser();
  const msgs = document.getElementById('chat-messages');
  if (msgs) {
    msgs.innerHTML = `<div class="chat-welcome"><h4>👋 Hi there!</h4><p>Ask me anything about SVPCET</p></div>
      <div class="quick-chips" id="quickChips">
        <div class="qchip" onclick="quickSend('Tell me about SVPCET')">🏛️ About</div>
        <div class="qchip" onclick="quickSend('What courses are offered?')">📚 Courses</div>
        <div class="qchip" onclick="quickSend('Admission procedure')">📋 Admissions</div>
        <div class="qchip" onclick="quickSend('Fee structure')">💰 Fees</div>
        <div class="qchip" onclick="quickSend('Placement details')">💼 Placements</div>
        <div class="qchip" onclick="quickSend('Campus facilities')">🏗️ Facilities</div>
        <div class="qchip" onclick="quickSend('Hostel information')">🏠 Hostel</div>
        <div class="qchip" onclick="quickSend('Contact and location')">📍 Contact</div>
      </div>`;
  }
  syncUI();
}

// ─── PATCH SEND FUNCTIONS ───
function patchSendChat() {
  setTimeout(() => {
    if (typeof window.sendChat === 'function') {
      const orig = window.sendChat;
      window.sendChat = function(t) { if (!Auth.isLoggedIn()) { openAuthModal(); return; } return orig.call(this, t); };
    }
    if (typeof window.quickSend === 'function') {
      const origQ = window.quickSend;
      window.quickSend = function(q) { if (!Auth.isLoggedIn()) { openAuthModal(); return; } return origQ.call(this, q); };
    }
  }, 150);
}