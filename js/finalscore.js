/* ==================================================
   js/finalscore.js
   Tampilkan halaman Score Akhir semua sesi
   ================================================== */

function showFinalScore() {
  const page = document.getElementById('finalscore-page');
  page.style.display = 'flex';
  page.classList.add('visible');

  const labels  = ['Sesi 1', 'Sesi 2', 'Sesi 3', 'Sesi 4'];
  const barCls  = ['s1', 's2', 's3', 's4'];
  let totalPct = 0;
  let rows = '';

  for (let i = 0; i < 4; i++) {
    const s   = sessionScores[i] !== undefined ? sessionScores[i] : '-';
    const num = typeof s === 'number' ? s : 0;
    totalPct += num;
    const cls = typeof s === 'number' ? (s >= 80 ? 'ok' : 'no') : '';
    rows += `
      <div class="fs-row">
        <span class="fs-label">${labels[i]}</span>
        <span class="fs-bar-wrap"><span class="fs-bar ${barCls[i]}" style="width:${num}%"></span></span>
        <span class="fs-val ${cls}">${typeof s === 'number' ? s + '%' : '—'}</span>
      </div>`;
  }

  const done  = Object.keys(sessionScores).length;
  const avg   = done > 0 ? Math.round(totalPct / 4) : 0;
  const lolos = avg >= 80;

  document.getElementById('fs-rows').innerHTML = rows;
  document.getElementById('fs-avg').textContent = avg + '%';

  const verdictEl = document.getElementById('fs-verdict');
  if (done === 0) {
    verdictEl.className = 'fs-verdict';
    verdictEl.style.background = 'var(--surface)';
    verdictEl.style.color = 'var(--muted)';
    verdictEl.innerHTML = '📋 Belum ada sesi yang selesai.';
  } else if (lolos) {
    verdictEl.className = 'fs-verdict lolos';
    verdictEl.style = '';
    verdictEl.innerHTML = '🎉 SELAMAT! ANDA LOLOS<br><small>Rata-rata ≥ 80% — Siap ke tahap seleksi CPNS berikutnya!</small>';
  } else {
    verdictEl.className = 'fs-verdict gagal';
    verdictEl.style = '';
    verdictEl.innerHTML = '💪 TERUS SEMANGAT!<br><small>Rata-rata di bawah 80% — Pelajari materi yang salah dan coba lagi!</small>';
  }
}

function closeFinalScore() {
  const page = document.getElementById('finalscore-page');
  page.classList.remove('visible');
  setTimeout(() => { page.style.display = 'none'; }, 350);
}

function resetAllScores() {
  if (!confirm('Reset semua skor? Semua progres sesi akan dihapus.')) return;
  clearAllScores();
  for (let i = 0; i < 4; i++) localStorage.removeItem(getStorageKey(i));
  closeFinalScore();
  backToDashboard();
}
