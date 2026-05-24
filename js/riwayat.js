/* ==================================================
   js/riwayat.js
   Riwayat Pengerjaan — simpan & tampilkan history sesi
   ================================================== */

const RIWAYAT_KEY = 'tkbCpnsRiwayat_v1';

/* ── Simpan 1 entry ke riwayat ─────────────────── */
function saveRiwayat(sid, benar, salah, score, totalSoal) {
  const entry = { sid, benar, salah, score, totalSoal, ts: Date.now() };
  let list = loadRiwayatRaw();
  list.unshift(entry);
  if (list.length > 50) list = list.slice(0, 50);
  try { localStorage.setItem(RIWAYAT_KEY, JSON.stringify(list)); } catch(e){}
}

function loadRiwayatRaw() {
  try {
    const raw = localStorage.getItem(RIWAYAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function clearRiwayat() {
  localStorage.removeItem(RIWAYAT_KEY);
}

/* ── Format tanggal ─────────────────────────────── */
function fmtDate(ts) {
  const d = new Date(ts);
  const pad = n => String(n).padStart(2,'0');
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ── Tampilkan halaman Riwayat ──────────────────── */
function showRiwayat() {
  // Sembunyikan semua halaman konten tapi JANGAN sembunyikan quiz-wrapper
  // supaya user bisa balik ke soal kalau mau
  const dash = document.getElementById('dashboard-page');
  dash.classList.remove('show');
  setTimeout(() => { dash.classList.remove('visible'); dash.style.display = 'none'; }, 380);

  const rw = document.getElementById('riwayat-page');
  rw.style.display = 'block';
  requestAnimationFrame(() => rw.classList.add('visible','show'));

  // Quiz wrapper disembunyikan saat buka riwayat dari dalam quiz? Tidak!
  // Quiz tetap di background — user bisa balik via tombol nav
  // Tapi kalau dari dashboard, quiz sudah none, tidak masalah

  setNavActive('riwayat');
  renderRiwayat();
}

function hideRiwayat() {
  const rw = document.getElementById('riwayat-page');
  rw.classList.remove('show');
  setTimeout(() => { rw.classList.remove('visible'); rw.style.display = 'none'; }, 380);
}

/* ── Render isi riwayat ─────────────────────────── */
function renderRiwayat() {
  const list = loadRiwayatRaw();
  const sesiNames = [
    'Sesi 1 — Materi Dasar',
    'Sesi 2 — Materi Lanjutan',
    'Sesi 3 — Spesialisasi',
    'Sesi 4 — Tingkat Lanjut'
  ];
  const barColors = [
    'linear-gradient(90deg,#6366f1,#8b5cf6)',
    'linear-gradient(90deg,#10b981,#059669)',
    'linear-gradient(90deg,#f59e0b,#f97316)',
    'linear-gradient(90deg,#8b5cf6,#ec4899)'
  ];

  /* ── Hitung aggregat TERBARU per sesi → total dari 120 soal ── */
  const latestPerSesi = {};
  for (const e of list) {
    if (latestPerSesi[e.sid] === undefined) latestPerSesi[e.sid] = e;
  }

  let totalBenar = 0, totalSalah = 0, sesiSelesai = 0, sumPct = 0;
  for (const sid in latestPerSesi) {
    const e = latestPerSesi[sid];
    totalBenar += e.benar;
    totalSalah += e.salah;
    sesiSelesai++;
    sumPct += e.score;
  }
  const avgOverall = sesiSelesai > 0 ? Math.round(sumPct / sesiSelesai) : 0;
  const totalDikerjakan = totalBenar + totalSalah;

  /* ── Update summary hero cards ─── */
  document.getElementById('rw-sum-benar').textContent  = sesiSelesai > 0 ? totalBenar : '—';
  document.getElementById('rw-sum-salah').textContent  = sesiSelesai > 0 ? totalSalah : '—';
  document.getElementById('rw-sum-total').textContent  = sesiSelesai > 0 ? totalDikerjakan + '/120' : '—';
  document.getElementById('rw-sum-avg').textContent    = sesiSelesai > 0 ? avgOverall + '%' : '—';

  /* ── Rekap semua sesi (4 sesi) di bagian atas ── */
  const rekapEl = document.getElementById('rw-rekap');
  if (sesiSelesai > 0) {
    const rekapRows = [0,1,2,3].map(i => {
      const e = latestPerSesi[i];
      if (!e) return `
        <div class="rw-rekap-row belum">
          <span class="rw-rekap-name">${sesiNames[i]}</span>
          <span class="rw-rekap-badge belum">Belum dikerjakan</span>
        </div>`;
      const cls = e.score >= 80 ? 'ok' : 'no';
      return `
        <div class="rw-rekap-row">
          <span class="rw-rekap-name">${sesiNames[i]}</span>
          <span class="rw-rekap-stat">✅ ${e.benar} &nbsp;❌ ${e.salah}</span>
          <span class="rw-rekap-score ${cls}">${e.score}%</span>
        </div>`;
    }).join('');

    let verdictHtml = '';
    if (sesiSelesai === 4) {
      const lolos = avgOverall >= 80;
      verdictHtml = `
        <div class="rw-verdict ${lolos ? 'lolos' : 'gagal'}">
          ${lolos
            ? '🎉 SELAMAT! Rata-rata ≥ 80% — Siap ke tahap seleksi berikutnya!'
            : '💪 Semangat! Rata-rata di bawah 80% — Pelajari materi yang salah dan coba lagi!'}
        </div>`;
    }

    rekapEl.style.display = 'block';
    rekapEl.innerHTML = `
      <div class="rw-section-label">Rekap Semua Sesi (dari 120 Soal)</div>
      <div class="rw-rekap-card">
        ${rekapRows}
        <div class="rw-rekap-divider"></div>
        <div class="rw-rekap-total">
          <span>Total Benar</span><span class="green">${totalBenar} soal</span>
        </div>
        <div class="rw-rekap-total">
          <span>Total Salah</span><span class="red">${totalSalah} soal</span>
        </div>
        <div class="rw-rekap-total big">
          <span>Nilai Rata-rata</span><span class="gold">${avgOverall}%</span>
        </div>
        ${verdictHtml}
      </div>`;
  } else {
    rekapEl.style.display = 'none';
    rekapEl.innerHTML = '';
  }

  /* ── Render daftar semua pengerjaan ─── */
  const listEl = document.getElementById('rw-list');
  if (list.length === 0) {
    listEl.innerHTML = `
      <div class="rw-empty">
        <div class="rw-empty-icon">📋</div>
        <div class="rw-empty-title">Belum Ada Riwayat</div>
        <div class="rw-empty-sub">Selesaikan minimal satu sesi ujian untuk melihat riwayat pengerjaanmu di sini.</div>
      </div>`;
    return;
  }

  listEl.innerHTML = list.map((e, idx) => {
    const pct = e.score;
    let gradeClass, gradeTxt, badgeClass;
    if (pct >= 85)      { gradeClass='grade-a'; gradeTxt='🏆 Sangat Memuaskan'; badgeClass='a'; }
    else if (pct >= 70) { gradeClass='grade-b'; gradeTxt='✅ Baik';              badgeClass='b'; }
    else if (pct >= 55) { gradeClass='grade-c'; gradeTxt='⚠️ Cukup';             badgeClass='c'; }
    else                { gradeClass='grade-d'; gradeTxt='📚 Perlu Belajar';     badgeClass='d'; }

    const scoreClass = pct >= 80 ? 'ok' : 'no';
    const color = barColors[e.sid % 4];

    return `
      <div class="rw-entry ${gradeClass}" style="animation-delay:${Math.min(idx,8)*0.05}s">
        <div class="rw-entry-header">
          <div class="rw-entry-num">${idx+1}</div>
          <div class="rw-entry-title">
            <h3>${sesiNames[e.sid]}</h3>
            <p>${e.totalSoal} soal dikerjakan</p>
          </div>
          <div class="rw-entry-score ${scoreClass}">${pct}%</div>
        </div>

        <div class="rw-entry-stats">
          <div class="rw-es-item">
            <div class="rw-es-val c">${e.benar}</div>
            <div class="rw-es-lbl">✅ Benar</div>
          </div>
          <div class="rw-es-item">
            <div class="rw-es-val w">${e.salah}</div>
            <div class="rw-es-lbl">❌ Salah</div>
          </div>
          <div class="rw-es-item">
            <div class="rw-es-val s">${pct}%</div>
            <div class="rw-es-lbl">📊 Nilai</div>
          </div>
        </div>

        <div class="rw-entry-bar-wrap">
          <div class="rw-entry-bar" style="width:${pct}%; background:${color}"></div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px;">
          <span class="rw-grade-badge ${badgeClass}">${gradeTxt}</span>
          <span class="rw-entry-time">🕐 ${fmtDate(e.ts)}</span>
        </div>
      </div>`;
  }).join('');
}

/* ── Nav active state ────────────────────────────── */
function setNavActive(which) {
  const btnDash = document.getElementById('topnav-dashboard');
  const btnRw   = document.getElementById('topnav-riwayat');
  if (btnDash) btnDash.classList.toggle('active', which === 'dashboard');
  if (btnRw)   btnRw.classList.toggle('active',   which === 'riwayat');
}

/* ── Reset riwayat ───────────────────────────────── */
function doResetRiwayat() {
  if (!confirm('Hapus semua riwayat pengerjaan? Aksi ini tidak bisa dibatalkan.')) return;
  clearRiwayat();
  renderRiwayat();
}
