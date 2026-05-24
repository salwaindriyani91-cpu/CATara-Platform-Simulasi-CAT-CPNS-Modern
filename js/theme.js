/* ==================================================
   js/theme.js
   Toggle dark mode / light mode
   ================================================== */

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('tkbCpnsTheme', isDark ? 'dark' : 'light');
  updateThemeButton();
}

function updateThemeButton() {
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  button.textContent = document.body.classList.contains('dark-mode') ? '☀️ Mode Terang' : '🌙 Mode Gelap';
}
