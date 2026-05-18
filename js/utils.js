// ═══════════════════════════════════════════════
// utils.js — 共用工具函式
// ═══════════════════════════════════════════════

const DAYS = ['日','一','二','三','四','五','六'];

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? '早安' : h < 17 ? '午安' : '晚安';
}

function fmt(date) {
  if (!date) return '';
  return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}

function fmtDate(str) {
  if (!str) return '';
  if (typeof str === 'string' && str.startsWith('Date(')) {
    const p = str.slice(5,-1).split(',').map(Number);
    return `${p[1]+1}/${p[2]}`;
  }
  if (typeof str === 'string' && str.includes('/')) {
    const p = str.split(' ')[0].split('/');
    return `${p[1]}/${p[2]}`;
  }
  const d = new Date(str);
  if (!isNaN(d)) return `${d.getMonth()+1}/${d.getDate()}`;
  return str;
}

function isDatePast(str) {
  if (!str) return false;
  let d;
  if (typeof str === 'string' && str.startsWith('Date(')) {
    const p = str.slice(5,-1).split(',').map(Number);
    d = new Date(p[0], p[1], p[2]);
  } else {
    d = new Date(str.split(' ')[0].replace(/\//g, '-'));
  }
  if (isNaN(d)) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  return d < today;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

// 解析各種日期格式（gviz Date()、中文上午/下午、ISO）
function parseDateTime(str) {
  if (!str) return null;
  if (typeof str === 'string' && str.startsWith('Date(')) {
    const parts = str.slice(5,-1).split(',').map(Number);
    return new Date(parts[0], parts[1], parts[2], parts[3]||0, parts[4]||0);
  }
  if (typeof str === 'string' && (str.includes('上午') || str.includes('下午'))) {
    const isPM = str.includes('下午');
    const clean = str.replace('上午','').replace('下午','').trim();
    const parts = clean.split(' ');
    const [y,m,d] = parts[0].split('/').map(Number);
    const [hh, mm] = (parts[1]||'0:00').split(':').map(Number);
    let hour = hh;
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return new Date(y, m-1, d, hour, mm||0);
  }
  if (typeof str === 'number') return new Date(str);
  return new Date(str);
}

// 讀取 Google Sheets（公開，gviz JSON）
async function fetchSheet(sheetName) {
  const id = CONFIG.SHEET_ID;
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const r = await fetch(url);
  const text = await r.text();
  const json = JSON.parse(text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\)/)[1]);
  const used = new Set();
  const cols = json.table.cols.map((c, i) => {
    // Some sheets return empty labels; fall back to column id (A/B/C...) or index key.
    const base = (c.label && String(c.label).trim()) || c.id || `col_${i}`;
    let key = base;
    let n = 1;
    while (used.has(key)) {
      key = `${base}_${n++}`;
    }
    used.add(key);
    return key;
  });
  return json.table.rows.map(row => {
    const obj = {};
    row.c.forEach((cell, i) => { obj[cols[i]] = cell ? cell.v : ''; });
    return obj;
  });
}
