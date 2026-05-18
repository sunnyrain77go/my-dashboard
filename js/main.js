// ═══════════════════════════════════════════════
// main.js — 初始化 / 打招呼 / 設定面板
// ═══════════════════════════════════════════════

// ── 打招呼 & 日期 ──
(function initGreeting() {
  const now = new Date();
  const dayNames = ['日','一','二','三','四','五','六'];
  document.querySelector('.greeting-name').innerHTML =
    `${getGreeting()}，<em>${CONFIG.USER_NAME}</em> ✦`;
  document.getElementById('date-str').textContent =
    `${now.getFullYear()} 年 ${now.getMonth()+1} 月 ${now.getDate()} 日　星期${dayNames[now.getDay()]}`;
})();

// ── 設定面板 ──
function toggleSettings() {
  const p = document.getElementById('settings-panel');
  p.style.display = p.style.display !== 'block' ? 'block' : 'none';
}

function saveSettings() {
  // 設定面板僅供說明用途（Key 由 GitHub Secret 注入）
  document.getElementById('settings-panel').style.display = 'none';
  alert('設定已關閉。如需修改 API Key，請更新 GitHub Secret 並重新 deploy。');
}
