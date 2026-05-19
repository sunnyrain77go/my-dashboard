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

// ── 月曆（4週，從今天所在週開始）──
function renderMonthCalendar() {
  const wrap = document.getElementById('month-cal');
  if (!wrap) return;
  wrap.innerHTML = '';

  const today = new Date();
  today.setHours(0,0,0,0);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay());

  // 標頭
  const header = document.createElement('div');
  header.className = 'cal-head';
  ['日','一','二','三','四','五','六'].forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'cal-dname';
    cell.textContent = `週${d}`;
    header.appendChild(cell);
  });
  wrap.appendChild(header);

  // 格線
  const grid = document.createElement('div');
  grid.className = 'cal-grid';

  for (let i = 0; i < 28; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const isToday = isSameDay(d, today);
    const isPast  = d < today && !isToday;

    const evts = allEvents
      .filter(e => isSameDay(e.start, d))
      .sort((a, b) => a.start - b.start);

    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (isPast ? ' past' : '') + (isToday ? ' today' : '');

    const num = document.createElement('div');
    num.className = 'cal-datenum';
    num.textContent = d.getDate() === 1 ? `${d.getMonth()+1}/1` : d.getDate();
    cell.appendChild(num);

    evts.slice(0, 2).forEach(e => {
      const ev = document.createElement('div');
      ev.className = `cal-ev cal-ev-${e.color}`;
      ev.title = e.title;
      ev.textContent = (fmt(e.start) ? fmt(e.start) + ' ' : '') + e.title;
      cell.appendChild(ev);
    });

    if (evts.length > 2) {
      const more = document.createElement('div');
      more.className = 'cal-more';
      more.textContent = `+${evts.length - 2} 項`;
      cell.appendChild(more);
    }

    grid.appendChild(cell);
  }
  wrap.appendChild(grid);
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
  renderMonthCalendar();
}

loadCalendar();
