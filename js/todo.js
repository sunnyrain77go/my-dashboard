// ═══════════════════════════════════════════════
// todo.js — 待辦事項（Google Sheets TODO 分頁）
// ═══════════════════════════════════════════════

const TODO_STORAGE_KEY = 'judy_todo_done';
let doneTodos = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || '[]');

function getTodoField(row, keys, fallback = '') {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== '' && row[k] != null) {
      return row[k];
    }
  }
  // Handle accidental spaces in sheet headers, e.g. "事項 "
  const trimmedMap = Object.fromEntries(
    Object.keys(row).map(k => [String(k).trim(), row[k]])
  );
  for (const k of keys) {
    const v = trimmedMap[k];
    if (v !== '' && v != null) return v;
  }
  return fallback;
}

function getTodoFieldByIndex(row, index, fallback = '') {
  const values = Object.values(row);
  const v = values[index];
  return v !== '' && v != null ? v : fallback;
}

function tagClass(tag) {
  const map = { '工作':'tt-work', '採買':'tt-buy', '健康':'tt-health', '投資':'tt-inv' };
  return map[tag] || 'tt-other';
}

function renderTodoFallback() {
  document.getElementById('todo-list').innerHTML = `
    <div class="todo-item">
      <div class="todo-cb" onclick="toggleTodo('fb0', this)"></div>
      <span class="todo-label" id="tl-fb0">待辦尚未讀取</span>
      <span class="todo-tag tt-other">未讀取</span>
    </div>
    <div class="todo-item">
      <div class="todo-cb" onclick="toggleTodo('fb1', this)"></div>
      <span class="todo-label" id="tl-fb1">請確認 Google Sheet 是否公開</span>
      <span class="todo-tag tt-other">未讀取</span>
    </div>`;
}

async function loadTodos() {
  try {
    const rows = await fetchSheet('表單回覆 1');
    const el = document.getElementById('todo-list');
    if (rows.length === 0) {
      el.innerHTML = '<div class="event-empty">沒有待辦事項 ✓</div>';
      return;
    }
    el.innerHTML = rows.map((r, i) => {
      const itemText  = getTodoField(r, ['事項', '待辦事項', '任務'], getTodoFieldByIndex(r, 0, '未命名待辦'));
      const tag       = getTodoField(r, ['標籤', '分類', 'Tag'], getTodoFieldByIndex(r, 1, ''));
      const status    = getTodoField(r, ['狀態', 'Status'], getTodoFieldByIndex(r, 2, '待辦'));
      const dueRaw    = getTodoField(r, ['到期日', '截止日', 'Due', '期限'], getTodoFieldByIndex(r, 3, ''));
      const isDone    = doneTodos.includes(i) || status === '完成';
      const due       = dueRaw ? fmtDate(dueRaw) : '';
      const isOverdue = due && !isDone && isDatePast(dueRaw);
      return `
        <div class="todo-item">
          <div class="todo-cb${isDone ? ' on' : ''}" onclick="toggleTodo(${i}, this)"></div>
          <span class="todo-label${isDone ? ' done' : ''}" id="tl-${i}">${itemText}</span>
          ${due ? `<span class="todo-due${isOverdue ? ' overdue' : ''}">${due}</span>` : ''}
          <span class="todo-tag ${tagClass(tag)}">${tag}</span>
        </div>`;
    }).join('');
  } catch (e) {
    renderTodoFallback();
  }
}

function toggleTodo(idx, cb) {
  cb.classList.toggle('on');
  const label = document.getElementById('tl-' + idx);
  if (label) label.classList.toggle('done');
  if (cb.classList.contains('on')) {
    if (!doneTodos.includes(idx)) doneTodos.push(idx);
  } else {
    doneTodos = doneTodos.filter(x => x !== idx);
  }
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(doneTodos));
}

loadTodos();
