/* ==================================================
   js/dashboard.js
   Badge skor, quick stats, tips harian, progress bar
   ================================================== */

const TIPS = [
  "Membaca soal dengan teliti lebih penting dari menjawab cepat. Kelola waktu dan tetap tenang!",
  "Eliminasi jawaban yang jelas salah terlebih dahulu, lalu pilih yang paling tepat.",
  "Istirahat sejenak antara sesi ujian untuk menjaga konsentrasi dan daya ingat.",
  "Review kembali jawaban yang di-skip sebelum waktu habis. Jangan tinggalkan soal kosong!",
  "Latihan konsisten setiap hari lebih efektif daripada belajar marathon semalam suntuk.",
  "Fokus pada materi yang sering keluar: algoritma, jaringan, dan basis data.",
  "Percaya diri! Kamu sudah belajar keras. Sekarang tinggal buktikan kemampuanmu! 💪"
];

function updateDashboardScoreBadges() {
  let selesai = 0;
  let totalSkor = 0;

  for (let i = 0; i < 4; i++) {
    const badge = document.getElementById('dash-score-' + i);
    const progBar = document.getElementById('sc-prog-' + i);
    if (!badge) continue;

    const s = sessionScores[i];
    if (typeof s === 'number') {
      badge.textContent = '✔ ' + s + '%';
      badge.style.display = 'inline-block';
      badge.className = 'sc-score-badge ' + (s >= 80 ? 'ok' : 'no');
      if (progBar) progBar.style.width = s + '%';
      selesai++;
      totalSkor += s;
    } else {
      badge.style.display = 'none';
      if (progBar) progBar.style.width = '0%';
    }
  }

  /* Quick stats di hero */
  const dqsSelesai = document.getElementById('dqs-selesai');
  const dqsAvg    = document.getElementById('dqs-avg');
  if (dqsSelesai) dqsSelesai.textContent = selesai;
  if (dqsAvg) dqsAvg.textContent = selesai > 0 ? Math.round(totalSkor / selesai) + '%' : '—';

  /* Tips rotasi acak */
  const tipsEl = document.getElementById('dash-tips-text');
  if (tipsEl) tipsEl.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
}
