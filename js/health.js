// ═══════════════════════════════════════════════
// health.js — 保健品提醒 & 飲食提醒
// ═══════════════════════════════════════════════

const SUPPLEMENTS = [
  {
    time: '早上空腹',
    icon: '🌅',
    items: ['膠原蛋白', '穀胱甘肽', 'D3', 'C', 'L-Glutamine'],
  },
  {
    time: '隨餐',
    icon: '🍽️',
    items: ['益生菌', '菊苣纖維', '魚油', '鈣', '鋅', '葉黃素', 'B群', '鐵', '水肌酸'],
  },
  {
    time: '睡前',
    icon: '🌙',
    items: ['鎂', '甘胺酸', '薑黃', '乳香', 'GABA'],
  },
];

const DIET_REMINDERS = [
  { icon: '💧', text: '水：體重 × 40ml / 天' },
  { icon: '🥩', text: '蛋白質：70g / 天' },
  { icon: '🚫', text: '無糖' },
];

// 保健品儲存鍵（記錄今天已服用的）
const SUPP_KEY = 'judy_supp_' + new Date().toDateString();

function initSupplements() {
  const done = JSON.parse(localStorage.getItem(SUPP_KEY) || '[]');
  const el = document.getElementById('supplement-list');

  el.innerHTML = SUPPLEMENTS.map((group, gi) => `
    <div class="supp-group">
      <div class="supp-time">${group.icon} ${group.time}</div>
      <div class="supp-pills">
        ${group.items.map((item, ii) => {
          const key = `${gi}-${ii}`;
          const checked = done.includes(key);
          return `<button type="button" class="supp-pill${checked ? ' taken' : ''}" data-key="${key}">${item}</button>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function bindSupplementClicks() {
  const el = document.getElementById('supplement-list');
  if (!el) return;

  el.addEventListener('click', (event) => {
    const pill = event.target.closest('.supp-pill');
    if (!pill || !el.contains(pill)) return;
    toggleSupp(pill.dataset.key, pill);
  });
}

function toggleSupp(key, el) {
  const done = JSON.parse(localStorage.getItem(SUPP_KEY) || '[]');
  if (done.includes(key)) {
    const idx = done.indexOf(key);
    done.splice(idx, 1);
    el.classList.remove('taken');
  } else {
    done.push(key);
    el.classList.add('taken');
  }
  localStorage.setItem(SUPP_KEY, JSON.stringify(done));
}

function initDiet() {
  document.getElementById('diet-list').innerHTML = DIET_REMINDERS.map(d => `
    <div class="diet-item">
      <span class="diet-icon">${d.icon}</span>
      <span class="diet-text">${d.text}</span>
    </div>
  `).join('');
}

initSupplements();
bindSupplementClicks();
initDiet();
