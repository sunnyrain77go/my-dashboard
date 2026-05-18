// ═══════════════════════════════════════════════
// ai.js — Gemini AI 助理
// ═══════════════════════════════════════════════

async function callGemini(prompt) {
  const key = CONFIG.GEMINI_KEY;
  if (!key || key === '%%GEMINI_API_KEY%%') {
    return '⚠️ Gemini API Key 尚未設定，請確認 GitHub Secret GEMINI_API_KEY 已設定並重新 deploy。';
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await r.json();
  if (data.error) return `⚠️ API 錯誤：${data.error.message}`;
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '無法取得回應';
}

function buildContext() {
  const now = new Date();
  const todayEvts = allEvents.filter(e => isSameDay(e.start, now));
  const evtStr = todayEvts.map(e => `${fmt(e.start)} ${e.title}`).join('、') || '無';
  const mantraText = MANTRAS[mIdx].text;
  return `今天是 ${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}，今日行程：${evtStr}。今日心境標語：「${mantraText}」。`;
}

async function toggleAiSum() {
  const card = document.getElementById('ai-sum-card');
  const isHidden = card.style.display !== 'block';
  card.style.display = isHidden ? 'block' : 'none';

  if (isHidden && card.dataset.loaded !== 'true') {
    card.className = 'ai-sum-card loading';
    card.textContent = '✦ AI 正在整理今日摘要…';
    const ctx = buildContext();
    const text = await callGemini(
      `你是 Judy 的私人助理，請用繁體中文、溫柔簡短的語氣，根據以下資訊給出今日重點提醒（3-4條，每條一行，加上適合的 emoji）：\n${ctx}`
    );
    card.className = 'ai-sum-card';
    card.textContent = text;
    card.dataset.loaded = 'true';
  }
}

async function askAI() {
  const q = document.getElementById('ai-q').value.trim();
  if (!q) return;
  const resp = document.getElementById('ai-resp');
  resp.style.display = 'block';
  resp.textContent = '⏳ 思考中…';
  const ctx = buildContext();
  const text = await callGemini(
    `你是 Judy 的私人助理，請用繁體中文回答。背景資訊：${ctx}\n\n問題：${q}`
  );
  resp.textContent = text;
}
