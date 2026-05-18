// ═══════════════════════════════════════════════
// config.js — 設定檔
// GEMINI_KEY 會由 GitHub Actions 在 deploy 時注入
// 請勿在此直接填入真實 API Key
// ═══════════════════════════════════════════════

const CONFIG = {
  GEMINI_KEY: '%%GEMINI_API_KEY%%',   // GitHub Secret: GEMINI_API_KEY
  SHEET_ID:   '1FoVJ-HnzY9mTmZpZpECzugYBRQpc4HOywnV5n5UhoXE',
  USER_NAME:  'Judy',
};
