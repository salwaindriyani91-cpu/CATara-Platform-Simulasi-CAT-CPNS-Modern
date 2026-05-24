/* ==================================================
   js/auth.js
   Login (username/password + Google OAuth), logout,
   navigasi antar halaman
   ================================================== */

const VALID_USER = 'anggota';
const VALID_PASS = 'cpns';

/* ── Nama user yang sedang login ─────────────────── */
let currentUserName = '';
let currentUserAvatar = '';

/* ── Helper: setelah login berhasil (apapun metodenya) ── */
function onLoginSuccess(name, avatarUrl) {
  currentUserName  = name  || 'Pengguna';
  currentUserAvatar = avatarUrl || '';

  const loginPage = document.getElementById('login-page');
  loginPage.classList.add('hidden');
  setTimeout(() => { loginPage.style.display = 'none'; }, 420);

  // Update sapaan di dashboard
  const welcomeEl = document.getElementById('dash-welcome');
  if (welcomeEl) welcomeEl.textContent = '👋 Selamat Datang, ' + currentUserName + '!';

  // Update avatar di nav bar (jika ada)
  const avatarEl = document.getElementById('topnav-avatar');
  if (avatarEl && avatarUrl) {
    avatarEl.src = avatarUrl;
    avatarEl.style.display = 'inline-block';
  }

  document.getElementById('top-nav-bar').style.display = 'flex';
  showDashboard();
}

/* ── Login username / password ───────────────────── */
function doLogin() {
  const u = document.getElementById('login-user').value.trim().toLowerCase();
  const p = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');
  if (u === VALID_USER && p === VALID_PASS) {
    errEl.classList.remove('show');
    onLoginSuccess('Anggota CPNS', '');
  } else {
    errEl.classList.add('show');
    document.getElementById('login-pass').value = '';
    document.getElementById('login-pass').focus();
  }
}

/* ── Google Login callback (dipanggil oleh GSI) ──── */
function handleGoogleLogin(response) {
  try {
    // Decode JWT payload (tanpa verifikasi — client side only)
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const name    = payload.name  || payload.email || 'Pengguna Google';
    const avatar  = payload.picture || '';
    document.getElementById('login-error').classList.remove('show');
    onLoginSuccess(name, avatar);
  } catch (e) {
    document.getElementById('login-error').classList.add('show');
    document.getElementById('login-error').textContent = '❌ Login Google gagal. Coba lagi.';
  }
}

/* ── Dashboard ───────────────────────────────────── */
function showDashboard() {
  loadAllScores();
  updateDashboardScoreBadges();

  const rw = document.getElementById('riwayat-page');
  rw.classList.remove('show');
  setTimeout(() => { rw.classList.remove('visible'); rw.style.display = 'none'; }, 380);
  document.getElementById('quiz-wrapper').style.display = 'none';
  document.getElementById('result').classList.remove('show');
  document.getElementById('quiz').style.display = 'none';

  const dash = document.getElementById('dashboard-page');
  dash.style.display = 'block';
  dash.scrollTo(0, 0);
  requestAnimationFrame(() => dash.classList.add('visible', 'show'));

  document.getElementById('top-nav-bar').style.display = 'flex';
  setNavActive('dashboard');
}

function hideDashboard() {
  const dash = document.getElementById('dashboard-page');
  dash.classList.remove('show');
  setTimeout(() => { dash.classList.remove('visible'); dash.style.display = 'none'; }, 420);
}

function enterSession(sid) {
  hideDashboard();
  const rw = document.getElementById('riwayat-page');
  rw.classList.remove('show','visible'); rw.style.display = 'none';

  document.getElementById('top-nav-bar').style.display = 'flex';
  setNavActive('');

  document.getElementById('quiz-wrapper').style.display = 'block';
  switchSession(sid);
  setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
}

function backToDashboard() {
  document.getElementById('result').classList.remove('show');
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('intro').style.display = 'block';
  document.getElementById('quiz-wrapper').style.display = 'none';
  showDashboard();
}

function openRiwayatFromQuiz() {
  const dash = document.getElementById('dashboard-page');
  dash.classList.remove('show');
  setTimeout(() => { dash.classList.remove('visible'); dash.style.display = 'none'; }, 380);
  document.getElementById('quiz-wrapper').style.display = 'none';
  showRiwayat();
}

function backToQuiz() {
  hideRiwayat();
  document.getElementById('quiz-wrapper').style.display = 'block';
  setNavActive('');
  setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
}

/* ── Logout ──────────────────────────────────────── */
function doLogout() {
  if (!confirm('Yakin ingin keluar dari sistem ujian?')) return;
  currentUserName   = '';
  currentUserAvatar = '';
  document.getElementById('result').classList.remove('show');
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('quiz-wrapper').style.display = 'none';
  const rw = document.getElementById('riwayat-page');
  rw.classList.remove('show','visible'); rw.style.display = 'none';
  hideDashboard();
  document.getElementById('top-nav-bar').style.display = 'none';

  // Reset login form
  const loginPage = document.getElementById('login-page');
  loginPage.style.display = 'flex';
  loginPage.classList.remove('hidden');
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-error').classList.remove('show');
  document.getElementById('login-error').textContent = '❌ Username atau password salah. Coba lagi.';

  // Reset avatar nav
  const avatarEl = document.getElementById('topnav-avatar');
  if (avatarEl) avatarEl.style.display = 'none';

  // Re-render tombol Google (reset state GSI)
  const gBtn = document.getElementById('google-btn-wrap');
  if (gBtn) gBtn.innerHTML = '';
  if (window.google && google.accounts) {
    google.accounts.id.cancel();
    try {
      google.accounts.id.renderButton(
        document.getElementById('google-btn-wrap'),
        { theme: 'outline', size: 'large', width: '100%', locale: 'id' }
      );
    } catch(e) {}
  }

  document.getElementById('login-user').focus();
}

(function init() {
  document.getElementById('quiz-wrapper').style.display = 'none';
  document.getElementById('top-nav-bar').style.display = 'none';
})();
