/* ==================================================
   js/result.js
   Tampilkan hasil sesi — skor, review jawaban
   ================================================== */

function finishQuiz() {
  const questions = getQuestions();
  const remaining = questions.length - answered.length;
  if (remaining > 0) {
    const ok = confirm(`Masih ada ${remaining} soal belum dijawab. Yakin ingin selesai?`);
    if (!ok) return;
  }
  showResult();
}

function toggleExp() {
  expVisible = !expVisible;
  document.getElementById('explanation').classList.toggle('show', expVisible);
  document.getElementById('btn-exp').textContent = expVisible ? '🙈 Sembunyikan' : '📖 Pembahasan';
}

function nextQuestion() {
  current++;
  saveProgress();
  const questions = getQuestions();
  if (current >= questions.length) showResult();
  else renderQuestion();
}

function showResult() {
  clearProgress();
  document.getElementById('quiz').style.display = 'none';
  const res = document.getElementById('result');
  res.classList.add('show');

  const questions = getQuestions();
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  /* Simpan skor sesi ini */
  saveSessionScore(activeSession, pct);

  /* Simpan ke riwayat pengerjaan */
  saveRiwayat(activeSession, score, wrong, pct, questions.length);

  document.getElementById('score-pct').textContent = pct + '%';  document.getElementById('r-correct').textContent = score;
  document.getElementById('r-wrong').textContent = wrong;
  document.getElementById('r-score').textContent = pct;

  let grade;
  if (pct >= 85) grade = '🏆 Sangat Memuaskan — Siap CPNS!';
  else if (pct >= 70) grade = '✅ Baik — Tetap Tingkatkan!';
  else if (pct >= 55) grade = '⚠️ Cukup — Perlu Penguatan Materi';
  else grade = '📚 Kurang — Pelajari Kembali Materi';
  document.getElementById('result-grade').textContent = grade;

  document.getElementById('review-list').innerHTML = answered.map(a => `
    <div class="review-item">
      <span class="ri-icon">${a.correct ? '✅' : '❌'}</span>
      <span class="ri-num">Soal ${a.q + 1}</span>
      <span class="ri-topic">${questions[a.q].topic}</span>
      <span class="ri-status ${a.correct ? 'ok' : 'no'}">
        ${a.correct ? 'Benar' : 'Salah — Jawaban benar: ' + String.fromCharCode(65 + questions[a.q].ans)}
      </span>
    </div>`).join('');

}

function scrollToReview() {
  document.getElementById('review-section').scrollIntoView({ behavior: 'smooth' });
}

function restart() {
  current = 0; score = 0; wrong = 0; answered = []; flags = {};
  clearProgress();
  document.getElementById('result').classList.remove('show');
  document.getElementById('quiz').style.display = 'block';
  renderQuestion();
}
