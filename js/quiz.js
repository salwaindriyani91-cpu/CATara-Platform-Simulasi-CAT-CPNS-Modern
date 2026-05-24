/* ==================================================
   js/quiz.js
   Logika ujian — render soal, pilih jawaban, koreksi, lanjut
   ================================================== */

function startQuiz() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';
  renderQuestion();
}

function getQuestions() { return sessionData[activeSession].questions; }

function updateStats() {
  const qs = getQuestions();
  document.getElementById('s-current').textContent = current + 1;
  document.getElementById('s-correct').textContent = score;
  document.getElementById('s-wrong').textContent = wrong;
  document.getElementById('s-average').textContent = answered.length ? Math.round((score / answered.length) * 100) + '%' : '0%';
  document.getElementById('s-remain').textContent = qs.length - current;
}

function getAnswerRecord(index) {
  return answered.find(a => a.q === index) || null;
}

function renderQuestion() {
  expVisible = false;
  const questions = getQuestions();
  const q = questions[current];
  const existingAnswer = getAnswerRecord(current);
  updateStats();
  document.getElementById('progress').style.width = ((current / questions.length) * 100) + '%';
  const pct = Math.round((current / questions.length) * 100);
  const pp = document.getElementById('progress-pct');
  if (pp) pp.textContent = pct + '%';
  selectedAnswer = null;

  const optHtml = q.opts.map((o, i) => `
    <button type="button" class="opt" id="opt-${i}" onclick="selectAnswer(${i})">
      <span class="opt-key">${String.fromCharCode(65+i)}</span>
      <span>${o}</span>
    </button>`).join('');

  document.getElementById('question-area').innerHTML = `
    <div class="question-card">
      <div class="q-meta">
        <span class="q-num">SOAL ${current + 1} / ${questions.length}</span>
        <span class="q-topic">${q.topic}</span>
      </div>
      <div class="q-text">${q.text}</div>
      <div class="options">${optHtml}</div>
      <div class="instruction" id="instruction">Pilih satu jawaban, lalu tekan ⚠️ Koreksi Jawaban untuk menilai dan melihat pembahasan.</div>
      <div class="explanation" id="explanation">
        <div class="exp-title">▸ Pembahasan Lengkap</div>
        <div class="exp-text">${q.exp}</div>
      </div>
    </div>`;

  document.querySelectorAll('.opt').forEach((button, idx) => {
    if (existingAnswer) {
      button.disabled = true;
      if (idx === existingAnswer.selected) {
        button.classList.add('selected');
        button.classList.add(existingAnswer.correct ? 'correct' : 'wrong');
      }
      if (idx === q.ans) button.classList.add('correct');
    }
  });

  document.getElementById('btn-next').textContent = current === questions.length - 1 ? 'Selesai →' : 'Lanjut →';

  if (existingAnswer) {
    document.getElementById('btn-check').textContent = '✅ Sudah Dijawab';
    document.getElementById('btn-check').disabled = true;
    document.getElementById('btn-next').disabled = false;
    document.getElementById('btn-exp').style.display = 'inline-flex';
    document.getElementById('explanation').classList.add('show');
    document.getElementById('btn-exp').textContent = '🙈 Sembunyikan';
    document.getElementById('instruction').textContent = 'Soal ini sudah dijawab. Lanjutkan soal berikutnya atau tinjau pembahasan.';
  } else {
    document.getElementById('btn-check').textContent = '⚠️ Koreksi Jawaban';
    document.getElementById('btn-check').disabled = true;
    document.getElementById('btn-next').disabled = true;
    document.getElementById('btn-exp').style.display = 'none';
    document.getElementById('explanation').classList.remove('show');
    document.getElementById('instruction').textContent = 'Pilih satu jawaban, lalu tekan ⚠️ Koreksi Jawaban untuk menilai dan melihat pembahasan.';
  }
}

function selectAnswer(idx) {
  if (answered.some(a => a.q === current)) return;
  selectedAnswer = idx;
  document.querySelectorAll('.opt').forEach(o => o.classList.remove('selected'));
  const button = document.getElementById('opt-' + idx);
  if (button) button.classList.add('selected');
  document.getElementById('btn-check').disabled = false;
  document.getElementById('btn-next').disabled = true;
  document.getElementById('btn-exp').style.display = 'none';
  document.getElementById('explanation').classList.remove('show');
  document.getElementById('instruction').textContent = 'Jawaban dipilih. Tekan ⚠️ Koreksi Jawaban untuk melihat benar/salah dan pembahasan.';
}

function checkAnswer() {
  if (selectedAnswer === null) {
    document.getElementById('instruction').textContent = 'Silakan pilih dulu satu jawaban sebelum menekan Koreksi Jawaban.';
    return;
  }
  const questions = getQuestions();
  const q = questions[current];
  const isCorrect = selectedAnswer === q.ans;

  document.querySelectorAll('.opt').forEach(o => o.disabled = true);
  const selectedBtn = document.getElementById('opt-' + selectedAnswer);
  if (selectedBtn) selectedBtn.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) {
    const correctBtn = document.getElementById('opt-' + q.ans);
    if (correctBtn) correctBtn.classList.add('correct');
  }

  if (isCorrect) score++; else wrong++;
  const existing = answered.find(a => a.q === current);
  if (existing) {
    existing.selected = selectedAnswer;
    existing.correct = isCorrect;
  } else {
    answered.push({ q: current, selected: selectedAnswer, correct: isCorrect });
  }

  updateStats();
  saveProgress();

  document.getElementById('btn-check').disabled = true;
  document.getElementById('btn-check').textContent = '✅ Koreksi Selesai';
  document.getElementById('btn-next').disabled = false;
  document.getElementById('btn-exp').style.display = 'inline-flex';
  document.getElementById('explanation').classList.add('show');
  document.getElementById('btn-exp').textContent = '🙈 Sembunyikan';
  document.getElementById('instruction').textContent = 'Pembahasan sudah tersedia di bawah.';
  expVisible = true;
}
