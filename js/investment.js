// ═══════════════════════════════════════════════
// investment.js — 投資提醒
// 期貨即時報價需付費 API，目前顯示換月提醒
// ═══════════════════════════════════════════════

// 計算當月第三個星期三（台灣期貨結算日）
function thirdWednesday(year, month) {
  let count = 0;
  const d = new Date(year, month, 1);
  while (count < 3) {
    if (d.getDay() === 3) count++;
    if (count < 3) d.setDate(d.getDate() + 1);
  }
  return d;
}

function initInvestment() {
  const now = new Date();
  const exp = thirdWednesday(now.getFullYear(), now.getMonth());
  const daysLeft = Math.ceil((exp - now) / 86400000);

  document.getElementById('inv-roll').textContent =
    `${exp.getMonth()+1}/${exp.getDate()}，${daysLeft} 天後`;

  if (daysLeft <= 14) {
    const alertEl = document.getElementById('inv-alert');
    alertEl.style.display = 'inline-flex';
    alertEl.textContent = `⚠️ 換月提醒：距到期 ${daysLeft} 天，請安排換月`;
  }

  // 即時報價需串接付費 API（如 Shioaji / 富途 / 永豐）
  const note = '<span style="font-size:11px;color:var(--text3)">需串接報價 API</span>';
  document.getElementById('inv-mtx').innerHTML = note;
  document.getElementById('inv-tmf').innerHTML = note;
}

initInvestment();
