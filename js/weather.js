// ═══════════════════════════════════════════════
// weather.js — 天氣（Open-Meteo，台北）
// ═══════════════════════════════════════════════

const WMO_TEXT = {
  0:'晴天', 1:'大致晴', 2:'部分多雲', 3:'陰天',
  45:'霧', 48:'結冰霧',
  51:'毛毛雨', 53:'中等毛毛雨', 55:'濃毛毛雨',
  61:'小雨', 63:'中雨', 65:'大雨',
  80:'陣雨', 81:'中陣雨', 82:'強陣雨',
  95:'雷陣雨', 96:'雷陣雨夾冰雹',
};
const WMO_ICON = {
  0:'☀️', 1:'🌤️', 2:'⛅', 3:'☁️',
  45:'🌫️', 48:'🌫️',
  51:'🌦️', 53:'🌦️', 55:'🌧️',
  61:'🌧️', 63:'🌧️', 65:'🌧️',
  80:'🌦️', 81:'🌧️', 82:'⛈️',
  95:'⛈️', 96:'⛈️',
};

async function loadWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=25.04&longitude=121.51'
      + '&current=temperature_2m,weathercode,precipitation_probability,relativehumidity_2m'
      + '&timezone=Asia%2FTaipei';
    const r = await fetch(url);
    const data = await r.json();
    const c = data.current;
    const code = c.weathercode;
    const temp = Math.round(c.temperature_2m);
    const rain = c.precipitation_probability;
    const hum  = c.relativehumidity_2m;

    document.getElementById('wx-icon').textContent = WMO_ICON[code] || '🌡️';
    document.getElementById('wx-temp').textContent = `${temp}°C`;
    document.getElementById('wx-desc').textContent =
      `台北・${WMO_TEXT[code]||'未知'}\n降雨機率 ${rain}%・濕度 ${hum}%`;

    const packs = [];
    if (rain > 40)  packs.push(['☂ 雨傘', 'p-slate']);
    if (temp > 28)  packs.push(['防曬乳',  'p-amber']);
    if (hum  > 70)  packs.push(['水壺',    'p-teal']);
    if (temp < 20)  packs.push(['外套',    'p-slate']);
    packs.push(['環保袋', 'p-teal']);

    document.getElementById('pack-row').innerHTML =
      packs.map(([t, cls]) => `<span class="pill ${cls}">${t}</span>`).join('');
  } catch (e) {
    document.getElementById('wx-desc').textContent = '天氣資料暫時無法讀取';
  }
}

loadWeather();
