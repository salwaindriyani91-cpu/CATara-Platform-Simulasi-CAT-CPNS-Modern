/* ==================================================
   js/storage.js
   Simpan dan muat progres dari localStorage
   ================================================== */

function loadProgress() {
  try {
    const raw = localStorage.getItem(getStorageKey(activeSession));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && Number.isInteger(data.current) && data.current >= 0) return data;
  } catch (err) {}
  return null;
}

function saveProgress() {
  const payload = { current, score, wrong, answered, flags };
  localStorage.setItem(getStorageKey(activeSession), JSON.stringify(payload));
}

function clearProgress() {
  localStorage.removeItem(getStorageKey(activeSession));
}

/* Simpan skor sesi yang sudah selesai */
function saveSessionScore(sid, pct) {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    const scores = raw ? JSON.parse(raw) : {};
    scores[sid] = pct;
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    sessionScores = scores;
  } catch (err) {}
}

/* Muat semua skor sesi */
function loadAllScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    sessionScores = raw ? JSON.parse(raw) : {};
  } catch (err) {
    sessionScores = {};
  }
}

/* Hapus semua skor (reset total) */
function clearAllScores() {
  localStorage.removeItem(SCORES_KEY);
  sessionScores = {};
}
