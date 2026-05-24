/* ==================================================
   js/state.js
   Variabel global untuk seluruh aplikasi
   ================================================== */

let activeSession = 0;
let current = 0, score = 0, wrong = 0;
let answered = [], flags = {}, expVisible = false, selectedAnswer = null;

/* Simpan skor per sesi: { 0: 75, 1: 90, ... } */
let sessionScores = {};

const STORAGE_KEY_PREFIX = 'tkbCpnsLengkap_v1_sesi';
const SCORES_KEY = 'tkbCpnsAllScores_v1';

function getStorageKey(sid) { return STORAGE_KEY_PREFIX + sid; }
