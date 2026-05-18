// ═══════════════════════════════════════════════
// calendar.js — 行事曆（Google Sheets Calendar 分頁）
// ═══════════════════════════════════════════════

let allEvents = [];

const DEFAULT_EVENTS = [
  { cal:'未讀取', title:'行事曆尚未讀取', start: new Date(), end: null, desc:'請確認 Google Sheet 是否公開', color:'gray' },
  { cal:'未讀取', title:'（範例）下午會議', start: (() => { const d = new Date(); d.setHours(14,0,0,0); return d; })(), end: null, desc:'', color:'gray' },
];

function calColor(calName) {
  const map = { '工作':'teal', '個人':'coral', '投資':'purple', 'House':'coral', 'Account':'teal' };
  for (const [k, v] of Object.entries(map)) {
    if (calName.includes(k)) return v;
  }
  // 根據名稱雜湊決定顏色，同一個日曆名稱永遠同色
  const colors = ['teal','coral','purple','gray'];
  const hash = calName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function renderTodayEvents() {
  const today = new Date();
  const evts = allEvents
    .filter(e => isSameDay(e.start, today))
    .sort((a, b) => a.start - b.start);

  const el = document.getElementById('today-events');
  if (evts.length === 0) {
    el.innerHTML = '<div class="event-empty">今天沒有行程 🎉</div>';
    return;
  }
  el.innerHTML = evts.map(e => `
    <div class="event-item">
      <div class="event-time">${fmt(e.start)}</div>
      <div class="event-bar bar-${e.color}"></div>
      <div class="event-body">
        <div class="event-title">${e.title}</div>
        ${e.desc ? `<div class="event-loc">${e.desc}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function renderWeekGrid() {
  const grid = document.getElementById('week-grid');
  grid.innerHTML = '';
  const today = new Date();
  today.setHours(0,0,0,0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isToday = i === 0;
    const evts = allEvents
      .filter(e => isSameDay(e.start, d))
      .sort((a, b) => a.start - b.start);

    const col = document.createElement('div');
    col.className = 'week-col';
    const dayName = DAYS[d.getDay()];
    const dateNum = d.getDate();

    col.innerHTML = `
      <div class="week-hdr">
        <div class="week-dname">週${dayName}</div>
        <div class="week-dnum${isToday ? ' today' : ''}">
          ${isToday ? `<div>${dateNum}</div>` : dateNum}
        </div>
      </div>
      ${evts.length === 0
        ? '<div class="week-none">—</div>'
        : evts.map(e =>
            `<div class="week-ev wev-${e.color}" title="${e.title}">
              ${fmt(e.start) ? fmt(e.start) + ' ' : ''}${e.title}
            </div>`
          ).join('')
      }
    `;
    grid.appendChild(col);
  }
}

async function loadCalendar() {
  try {
    const rows = await fetchSheet('Calendar');
    const parsed = rows
      .filter(r => r['行程標題'] && r['開始時間'])
      .map(r => ({
        cal:   r['日曆名稱'] || '',
        title: r['行程標題'],
        start: parseDateTime(r['開始時間']),
        end:   parseDateTime(r['結束時間']),
        desc:  r['行程描述'] || '',
        color: calColor(r['日曆名稱'] || ''),
      }))
      .filter(e => e.start && !isNaN(e.start.getTime()));

    allEvents = parsed.length > 0 ? parsed : DEFAULT_EVENTS;
  } catch (e) {
    allEvents = DEFAULT_EVENTS;
  }
  renderTodayEvents();
  renderWeekGrid();
}

loadCalendar();
