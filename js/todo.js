// ═══════════════════════════════════════════════
// todo.js — 待辦事項（Google Sheets TODO 分頁）
// ═══════════════════════════════════════════════

const TODO_STORAGE_KEY = 'judy_todo_done';
let doneTodos = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || '[]');

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
    const rows = await fetchSheet('TODO');
    const el = document.getElementById('todo-list');
    if (rows.length === 0) {
      el.innerHTML = '<div class="event-empty">沒有待辦事項 ✓</div>';
      return;
    }
    el.innerHTML = rows.map((r, i) => {
      const isDone    = doneTodos.includes(i) || r['狀態'] === '完成';
      const due       = r['到期日'] ? fmtDate(r['到期日']) : '';
      const isOverdue = due && !isDone && isDatePast(r['到期日']);
      return `
        <div class="todo-item">
          <div class="todo-cb${isDone ? ' on' : ''}" onclick="toggleTodo(${i}, this)"></div>
          <span class="todo-label${isDone ? ' done' : ''}" id="tl-${i}">${r['事項']}</span>
          ${due ? `<span class="todo-due${isOverdue ? ' overdue' : ''}">${due}</span>` : ''}
          <span class="todo-tag ${tagClass(r['標籤'])}">${r['標籤'] || ''}</span>
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
