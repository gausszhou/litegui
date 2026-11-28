/**
 * LightCraft 图标集：24×24 描边图标，统一 1.6 描边、圆角端点。
 * 全部内联字符串，避免额外网络请求；颜色一律 currentColor。
 */
const PATHS: Record<string, string> = {
  /* ---- 顶栏 ---- */
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  undo: '<path d="M9 7 4 12l5 5"/><path d="M4 12h9a6 6 0 0 1 0 12"/>',
  redo: '<path d="m15 7 5 5-5 5"/><path d="M20 12h-9a6 6 0 0 0 0 12"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  filter: '<path d="M4 6h16l-6 7v5l-4 2v-7z"/>',
  import: '<path d="M12 4v10"/><path d="m8 10 4 4 4-4"/><path d="M5 17v2h14v-2"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.5-1.2 1-1.2 1.9"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  expand: '<path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/>',
  collapse: '<path d="M4 9h5V4M20 9h-5V4M20 15h-5v5M4 15h5v5"/>',
  bell: '<path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5 1.5 5h-15S6 14 6 10Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',

  /* ---- 面板 / 模块 ---- */
  sliders: '<path d="M5 4v6M5 14v6M12 4v10M12 18v2M19 4v2M19 10v10"/><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="16" r="1.8"/><circle cx="19" cy="8" r="1.8"/>',
  masks: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" stroke="none" opacity=".22"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r=".7" fill="currentColor"/>',
  metadata: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 9h5M7.5 12h9M7.5 15h6"/>',
  history: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 5v4h4"/><path d="M12 8v4.5l3 1.7"/>',
  keywords: '<path d="M4 11V5a1 1 0 0 1 1-1h6l8 8-7 7z"/><circle cx="8" cy="8" r="1.4"/>',
  crop: '<path d="M7 3v14a2 2 0 0 0 2 2h12"/><path d="M3 7h14a2 2 0 0 1 2 2v12"/>',
  more: '<circle cx="6" cy="12" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><circle cx="18" cy="12" r="1.1" fill="currentColor"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2M12 18.5v2M4.6 7.8l1.7 1M17.7 15.2l1.7 1M4.6 16.2l1.7-1M17.7 8.8l1.7-1"/>',
  album: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 15.5 8 11l4 4 3-2.5 5.5 4.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
  folder: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
  image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>',
  trash: '<path d="M4.5 7h15"/><path d="M9 7V5h6v2"/><path d="M6.5 7l1 12h9l1-12"/><path d="M10 10.5v5M14 10.5v5"/>',
  eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4.5v4.5h4.5"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 5.5h-9a2 2 0 0 0-2 2v9"/>',
  paste: '<rect x="7.5" y="4.5" width="9" height="3.5" rx="1"/><path d="M6 6.5H5a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 5 19.5h11a1.5 1.5 0 0 0 1.5-1.5V8A1.5 1.5 0 0 0 16 6.5h-1"/>',
  export: '<path d="M12 15V4"/><path d="m8 8 4-4 4 4"/><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>',
  compare: '<path d="M12 4v16"/><path d="M4 7.5A2 2 0 0 1 6 5.5h4v13H6a2 2 0 0 1-2-2z"/><path d="M20 7.5a2 2 0 0 0-2-2h-4v13h4a2 2 0 0 0 2-2z"/>',
  fit: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 4v16" opacity=".45"/>',
  zoomIn: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4M8.5 11h5M11 8.5v5"/>',
  zoomOut: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4M8.5 11h5"/>',
  chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
  chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
  chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
  chevronUp: '<path d="m6 14.5 6-6 6 6"/>',
  sort: '<path d="M7 4v16M7 20l-3-3M7 20l3-3"/><path d="M14 7h6M14 12h5M14 17h4"/>',

  /* ---- 评分 / 旗标 ---- */
  star: '<path d="m12 4.4 2.35 4.9 5.15.72-3.75 3.65.9 5.2L12 16.4l-4.65 2.47.9-5.2L4.5 10.02l5.15-.72z"/>',
  starFill: '<path d="m12 4.4 2.35 4.9 5.15.72-3.75 3.65.9 5.2L12 16.4l-4.65 2.47.9-5.2L4.5 10.02l5.15-.72z" fill="currentColor"/>',
  flagPick: '<path d="M6 20V4.5h12l-3 5 3 5H6"/>',
  flagReject: '<path d="M6 20V4.5h12l-3 5 3 5H6" opacity=".55"/><path d="m9 8.5 6 5M15 8.5l-6 5"/>',
  flagNone: '<path d="M6 20V4.5h12l-3 5 3 5H6" opacity=".35"/>',

  /* ---- 视图切换 ---- */
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
  gridSmall: '<rect x="4" y="4" width="4" height="4" rx=".8"/><rect x="10" y="4" width="4" height="4" rx=".8"/><rect x="16" y="4" width="4" height="4" rx=".8"/><rect x="4" y="10" width="4" height="4" rx=".8"/><rect x="10" y="10" width="4" height="4" rx=".8"/><rect x="16" y="10" width="4" height="4" rx=".8"/><rect x="4" y="16" width="4" height="4" rx=".8"/><rect x="10" y="16" width="4" height="4" rx=".8"/><rect x="16" y="16" width="4" height="4" rx=".8"/>',
  list: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  single: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.4"/>',

  /* ---- 显影控制 ---- */
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/>',
  curve: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M5 17c3.5-1 4-4 6.5-4S16 15 19 7"/><circle cx="5" cy="17" r="1.3" fill="currentColor"/><circle cx="19" cy="7" r="1.3" fill="currentColor"/>',
  pipette: '<path d="m13.5 6.5 4 4"/><path d="M4.5 19.5 5 16l8.5-8.5a2.1 2.1 0 0 1 3 3L8 19l-3.5.5Z"/>',
  auto: '<path d="M12 3.5v3M12 17.5v3M4 12h3M17 12h3M6.2 6.2l2 2M15.8 15.8l2 2M17.8 6.2l-2 2M8.2 15.8l-2 2"/>',
  bw: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
  maskLinear: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 15.5h17" opacity=".6"/><path d="M3.5 11h17" opacity=".3"/>',
  maskRadial: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><ellipse cx="12" cy="12" rx="6" ry="4.5"/>',
  maskSubject: '<circle cx="12" cy="8" r="3.2"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/>',
  maskSky: '<path d="M4 16.5h16"/><path d="M8 9.5a4 4 0 0 1 8 0"/><path d="M6.5 12.5h11"/>',
  maskBrush: '<path d="M5 19c2.5.5 3.5-1 4-3l2-6"/><path d="m11 10 3.5-6 5 3-5.5 7z"/>',
  maskRange: '<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="8" cy="7" r="1.6" fill="currentColor"/><circle cx="15" cy="12" r="1.6" fill="currentColor"/><circle cx="10" cy="17" r="1.6" fill="currentColor"/>',
  invert: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 20 20 4v16z" fill="currentColor" stroke="none" opacity=".28"/>',
  dot: '<circle cx="12" cy="12" r="3"/>'
};

export type IconName = keyof typeof PATHS;

export function icon(name: string, size = 16, className = "lc-icon"): string {
  const path = PATHS[name] ?? PATHS.dot;
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}

/** 常用的星标串（0..5），用于图库与胶片条的角标。 */
export function starStrip(value: number, size = 10): string {
  if (value <= 0) return "";
  let html = '<span class="lc-stars">';
  for (let i = 0; i < 5; i++) {
    const name = i < value ? "starFill" : "star";
    html += `<span class="lc-star${i < value ? " is-on" : ""}">${icon(name, size, "lc-icon")}</span>`;
  }
  html += "</span>";
  return html;
}
