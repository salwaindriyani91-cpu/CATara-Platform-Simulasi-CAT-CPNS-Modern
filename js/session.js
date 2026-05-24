/* ==================================================
   js/session.js
   Inisialisasi, ganti sesi, muat sesi baru
   ================================================== */

window.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('tkbCpnsTheme');
  if (theme === 'dark') document.body.classList.add('dark-mode');
  updateThemeButton();
  loadAllScores();
  loadSession(0);
});

function switchSession(sid) {
  if (activeSession === sid) return;
  saveProgress();
  activeSession = sid;
  loadSession(sid);
}

function loadSession(sid) {
  activeSession = sid;
  const sess = sessionData[sid];
  current = 0; score = 0; wrong = 0; answered = []; flags = {};
  expVisible = false; selectedAnswer = null;

  for (let i = 0; i < 4; i++) {
    document.getElementById('sbtn-' + i).classList.toggle('active', i === sid);
  }

  document.getElementById('header-sesi-label').textContent = sess.sesiLabel;
  document.getElementById('header-desc').textContent = sess.headerDesc;
  document.getElementById('intro-title').textContent = sess.title;
  document.getElementById('intro-desc').textContent = sess.desc;
  document.getElementById('intro-topics-count').textContent = sess.topicsList.length;

  const topicsEl = document.getElementById('intro-topics');
  topicsEl.innerHTML = sess.topicsList.map(t => `<span class="topic-tag">${t}</span>`).join('');

  const saved = loadProgress();
  if (saved) {
    current = saved.current; score = saved.score;
    wrong = saved.wrong; answered = saved.answered || []; flags = saved.flags || {};
    document.getElementById('resume-note').style.display = 'block';
    document.getElementById('start-button').textContent = 'Lanjutkan Ujian →';
  } else {
    document.getElementById('resume-note').style.display = 'none';
    document.getElementById('start-button').textContent = 'Mulai Ujian →';
  }

  updateStats();
  document.getElementById('intro').style.display = 'block';
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('result').classList.remove('show');
}
