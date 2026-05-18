// ═══════════════════════════════════════════════
// config.js — 設定檔
// GEMINI_KEY 與 SHEET_ID 會由 GitHub Actions 在 deploy 時注入
// 請勿在此直接填入真實 API Key / Sheet ID
// ═══════════════════════════════════════════════

const CONFIG = {
  GEMINI_KEY: '%%GEMINI_API_KEY%%',   // GitHub Secret: GEMINI_API_KEY
  SHEET_ID:   '%%SHEET_ID%%',         // GitHub Secret: SHEET_ID
  USER_NAME:  'Judy',
};
