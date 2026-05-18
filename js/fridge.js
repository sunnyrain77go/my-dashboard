// ═══════════════════════════════════════════════
// fridge.js — 冰箱庫存（Google Sheets Fridge 分頁）
// ═══════════════════════════════════════════════

const FS_LABEL = { ok: '充足', low: '快用完', out: '已用完' };
const FS_CLASS = { ok: 'fs-ok', low: 'fs-low', out: 'fs-out' };
const FS_MAP   = { '充足': 'ok', '快用完': 'low', '已用完': 'out' };

const DEFAULT_FRIDGE = [
  { name: '🥛 牛奶',   status: 'low' },
  { name: '🥚 雞蛋',   status: 'low' },
  { name: '🥦 花椰菜', status: 'ok'  },
  { name: '🍗 雞胸肉', status: 'out' },
  { name: '🧀 起司',   status: 'ok'  },
  { name: '🫙 醬油',   status: 'low' },
];

function getFridgeField(row, keys, fallback = '') {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== '' && row[k] != null) {
      return row[k];
    }
  }
  return fallback;
}

function renderFridge(data) {
  document.getElementById('fridge-grid').innerHTML = data.map(f => `
    <div class="fridge-item">
      <span>${f.name}</span>
      <span class="fs ${FS_CLASS[f.status] || 'fs-ok'}">${FS_LABEL[f.status] || f.status}</span>
    </div>
  `).join('');
}

async function loadFridge() {
  try {
    const rows = await fetchSheet('Fridge');
    const data = rows
      .filter(r => {
        const name = getFridgeField(r, ['品項', 'A'], '');
        return name && name !== '品項'; // 排除表頭行
      })
      .map(r => ({
        name:   getFridgeField(r, ['品項', 'A'], ''),
        status: FS_MAP[getFridgeField(r, ['狀態', 'B'], '')] || 'ok',
      }));
    renderFridge(data.length > 0 ? data : DEFAULT_FRIDGE);
  } catch (e) {
    renderFridge(DEFAULT_FRIDGE);
  }
}

loadFridge();
