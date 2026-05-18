// ═══════════════════════════════════════════════
// mantra.js — 心情標語
// ═══════════════════════════════════════════════

const MANTRAS = [
  { text: '這很正常',         sub: '遇到的事、感受到的情緒，都是人生的一部分。\n不需要對自己太苛求。' },
  { text: '我不必在乎',       sub: '別人的眼光、無謂的評價，都不是你的功課。\n你只需要對自己負責。' },
  { text: '我值得平靜富足的人生', sub: '這不是奢求，是你本來就擁有的權利。\n一步一步，穩穩地走向它。' },
];

let mIdx = new Date().getDay() % MANTRAS.length;

function renderMantra() {
  document.getElementById('mantra-text').textContent = MANTRAS[mIdx].text;
  document.getElementById('mantra-sub').textContent  = MANTRAS[mIdx].sub;
  const dots = document.getElementById('mantra-dots');
  dots.innerHTML = '';
  MANTRAS.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'mdot' + (i === mIdx ? ' on' : '');
    d.onclick = e => { e.stopPropagation(); mIdx = i; renderMantra(); };
    dots.appendChild(d);
  });
}

function nextMantra() {
  mIdx = (mIdx + 1) % MANTRAS.length;
  renderMantra();
}

// 初始化
renderMantra();
