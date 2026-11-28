/**
 * VectorCraft 图标集：全部为 24×24 线性图标，`stroke="currentColor"`。
 * 这样同一份标记既能用于工具栏、面板，也能用于右栏图标条。
 */
const stroke = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

export const icons: Record<string, string> = {
  /* 品牌 */
  logo: `<svg viewBox="0 0 32 32" aria-hidden="true">
    <defs>
      <linearGradient id="vc-logo-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ff8a3d"/><stop offset="0.55" stop-color="#ff4d6d"/><stop offset="1" stop-color="#b93df0"/>
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="30" height="30" rx="8" fill="url(#vc-logo-grad)"/>
    <path d="M9 9.5 16 22l7-12.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="16" cy="7.4" r="2" fill="#fff"/>
  </svg>`,

  /* 工具 */
  select: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.2 18.2 12 12.6 13.4 15.2 20.4 12.6 21.2 10 14.2 5 18.4Z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>`,
  directSelect: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.4 18 12l-5.4 1.3 2.6 6.6-2.8 1.1-2.6-6.7L5 18.2Z" ${stroke}/></svg>`,
  groupSelect: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3 13.4 9.4 9.6 10.5 11.6 15.4 9.4 16.3 7.4 11.4 4 14.3Z" ${stroke}/><path d="M16.5 13.5h4v6h-6v-4" ${stroke}/></svg>`,
  lasso: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 6.4C15.6 4.6 12 4 9.4 5.2 6.4 6.5 4.6 9.6 6 12c1.5 2.6 6 3 8.8 1.6 2-1 3-2.7 2.6-4.3" ${stroke}/><path d="M7.4 14.6c-.9 1.6-.7 3.4.6 4.2 1.2.8 2.8.3 3-1.2" ${stroke}/><path d="M11.6 18.4c.6 1 1.9 1.3 2.6.6" ${stroke}/></svg>`,
  pen: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.6 5.6 9.4-3.1 1.7 1.2 3.5-3.7 1.3-1.2-3.5L7.7 17 6 14.9l3.1-1.9Z" ${stroke}/><circle cx="12" cy="2.6" r="1.5" ${stroke}/></svg>`,
  penAdd: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 4.6 4.6 7.6-2.6 1.4 1 2.9-3 1-1-2.8-3 1.4-1.4-1.7 2.6-1.5Z" ${stroke}/><path d="M18.6 15.6v5.2M16 18.2h5.2" ${stroke}/></svg>`,
  penRemove: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 4.6 4.6 7.6-2.6 1.4 1 2.9-3 1-1-2.8-3 1.4-1.4-1.7 2.6-1.5Z" ${stroke}/><path d="M16 18.2h5.2" ${stroke}/></svg>`,
  anchor: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19 20 5" ${stroke}/><rect x="1.6" y="17.2" width="4.4" height="4.4" rx="0.6" ${stroke}/><rect x="18" y="3.4" width="4.4" height="4.4" rx="0.6" ${stroke}/><path d="M12 9.6 15 12.6 12 15.6 9 12.6Z" ${stroke}/></svg>`,
  type: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.4h16M12 5.4v14.2M8 19.6h8" ${stroke}/></svg>`,
  verticalType: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v16M6 12h12M4 4h4M4 20h4" ${stroke}/><path d="M18 8v8M15.6 10.4 18 8l2.4 2.4" ${stroke}/></svg>`,
  line: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.4 19.6 19.6 4.4" ${stroke}/><circle cx="3.8" cy="20.2" r="1.4" ${stroke}/><circle cx="20.2" cy="3.8" r="1.4" ${stroke}/></svg>`,
  rect: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="4.6" width="17.6" height="14.8" rx="0.8" ${stroke}/></svg>`,
  ellipse: `<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="8.8" ry="7.4" ${stroke}/></svg>`,
  polygon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 20 7.5v9L12 21.2 4 16.5v-9Z" ${stroke}/></svg>`,
  star: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.7 6.1 6.7.7-5 4.5 1.4 6.6L12 17.5l-5.8 3.2 1.4-6.6-5-4.5 6.7-.7Z" ${stroke}/></svg>`,
  brush: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.6 3.4 20.6 9.4 11.4 18.6c-1.4 1.4-4 1.6-5.8.2-.2-2 0-4.4 1.4-5.8Z" ${stroke}/><path d="M13.4 4.6 19.4 10.6" ${stroke}/></svg>`,
  pencil: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15.4 4.2 4.4 4.4L8.6 19.8H4.2v-4.4Z" ${stroke}/><path d="m13.4 6.2 4.4 4.4" ${stroke}/></svg>`,
  smooth: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15c3.6 0 3.6-6 7.2-6S13.8 15 17.4 15" ${stroke}/><path d="M3 9c3.6 0 3.6 4 7.2 4" ${stroke} opacity=".55"/></svg>`,
  shaper: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 8-8" ${stroke}/><path d="M12 4h8v8" ${stroke}/><path d="M20 12a8 8 0 0 1-8 8" ${stroke}/><path d="M12 20H4v-8" ${stroke}/></svg>`,
  pathEraser: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 11 11-4.4 4.4H8.2L4 15.2Z" ${stroke}/><path d="m9 4-5 5 6 6" ${stroke}/></svg>`,
  eraser: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.4 3.6 7 7-9.4 9.4H6.8L3.6 16.8Z" ${stroke}/><path d="m9 8 7 7" ${stroke}/></svg>`,
  scissors: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2.6" ${stroke}/><circle cx="6" cy="6" r="2.6" ${stroke}/><path d="M8.2 7.6 20 18M8.2 16.4 20 6" ${stroke}/></svg>`,
  knife: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 14.8 15 3.4l5.4 5.4L9 20.2H4.4Z" ${stroke}/><path d="M8.4 15.6 13 11" ${stroke}/></svg>`,
  hand: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11.6V6.4a1.6 1.6 0 0 1 3.2 0v4.4-6a1.6 1.6 0 0 1 3.2 0v6-5.2a1.6 1.6 0 0 1 3.2 0v9.6c0 3-2 5.2-5 5.2-2.4 0-3.8-.8-5.2-2.6l-2.8-3.6a1.5 1.5 0 0 1 2.2-2Z" ${stroke}/></svg>`,
  rotate: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 12a7.4 7.4 0 1 1-2.2-5.2" ${stroke}/><path d="M19.6 3.6v4.6h-4.6" ${stroke}/></svg>`,
  zoom: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.4" cy="10.4" r="6.4" ${stroke}/><path d="m15.2 15.2 5 5M10.4 7.6v5.6M7.6 10.4h5.6" ${stroke}/></svg>`,

  /* 顶栏 / 窗口 */
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.6" cy="10.6" r="6.2" ${stroke}/><path d="m15.2 15.2 4.6 4.6" ${stroke}/></svg>`,
  discord: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.6 6.2a15 15 0 0 0-3.8-1.2l-.5 1a13.4 13.4 0 0 0-4.6 0l-.5-1a15 15 0 0 0-3.8 1.2C3.2 9.4 2.6 12.6 3 15.6a15 15 0 0 0 4.6 2.3l.6-1.1c-.7-.3-1.3-.6-1.9-1l.4-.3a10.8 10.8 0 0 0 10.6 0l.4.3c-.6.4-1.2.7-1.9 1l.6 1.1a15 15 0 0 0 4.6-2.3c.5-3.4-.3-6.6-2.4-9.4Z" fill="currentColor"/><circle cx="9.4" cy="12.6" r="1.5" fill="#2a3140"/><circle cx="14.6" cy="12.6" r="1.5" fill="#2a3140"/></svg>`,
  minimize: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" ${stroke}/></svg>`,
  maximize: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.4" y="5.4" width="13.2" height="13.2" rx="1" ${stroke}/></svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" ${stroke}/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9.4 6 5.4 6-5.4" ${stroke}/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.4 5.6 6 6.4-6 6.4" ${stroke}/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.6 5.6-6 6.4 6 6.4" ${stroke}/></svg>`,
  caretUp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14.6 6-5.4 6 5.4" ${stroke}/></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.4" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18.6" cy="12" r="1.5" fill="currentColor"/></svg>`,
  hamburger: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" ${stroke}/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" ${stroke}/></svg>`,
  minus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" ${stroke}/></svg>`,
  trash: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 6.6h14.8M9.4 6.4V4.2h5.2v2.2M6.6 6.6l.9 13.2h9l.9-13.2M10 10.2v6.4M14 10.2v6.4" ${stroke}/></svg>`,

  /* 图层 / 属性 */
  eye: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12Z" ${stroke}/><circle cx="12" cy="12" r="2.8" ${stroke}/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.2 3.4 20.8 21M9.2 6.2A9.8 9.8 0 0 1 12 5.8c6 0 9.4 6.2 9.4 6.2a17 17 0 0 1-3.4 3.9M6.2 7.9A17.5 17.5 0 0 0 2.6 12S6 18.2 12 18.2c1 0 1.9-.2 2.8-.5" ${stroke}/><path d="M9.9 10.2a3 3 0 0 0 4.2 4.2" ${stroke}/></svg>`,
  lock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.2" y="10.2" width="13.6" height="10" rx="1.4" ${stroke}/><path d="M8.2 10V7.8a3.8 3.8 0 0 1 7.6 0V10" ${stroke}/></svg>`,
  unlock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.2" y="10.2" width="13.6" height="10" rx="1.4" ${stroke}/><path d="M8.2 10V7.8a3.8 3.8 0 0 1 7.2-1.6" ${stroke}/></svg>`,
  properties: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.2h9M17 7.2h3M4 12h3M11 12h9M4 16.8h8M16 16.8h4" ${stroke}/><circle cx="15" cy="7.2" r="1.8" ${stroke}/><circle cx="9" cy="12" r="1.8" ${stroke}/><circle cx="14" cy="16.8" r="1.8" ${stroke}/></svg>`,
  layers: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8.6 4.6L12 12.2 3.4 7.6Z" ${stroke}/><path d="m3.4 12.2 8.6 4.6 8.6-4.6M3.4 16.8l8.6 4.6 8.6-4.6" ${stroke}/></svg>`,
  libraries: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="3.6" width="7.4" height="7.4" rx="1" ${stroke}/><rect x="13.2" y="3.6" width="7.4" height="7.4" rx="1" ${stroke}/><rect x="3.4" y="13.2" width="7.4" height="7.4" rx="1" ${stroke}/><circle cx="16.9" cy="16.9" r="3.7" ${stroke}/></svg>`,
  appearance: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4.4" ${stroke}/><path d="M4.4 20.4c1.2-3.4 4-5.2 7.6-5.2s6.4 1.8 7.6 5.2" ${stroke}/></svg>`,
  color: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.4" ${stroke}/><path d="M12 3.6a8.4 8.4 0 0 1 0 16.8Z" fill="currentColor" opacity=".85"/></svg>`,
  gradient: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.4" y="4.4" width="17.2" height="15.2" rx="1" ${stroke}/><path d="M6.6 16.8 13 7.6h4.4l-6.6 9.2Z" fill="currentColor" opacity=".8"/></svg>`,
  opacity: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4 6.8 9a7.2 7.2 0 1 0 10.4 0Z" ${stroke}/><path d="M12 20.2a7.2 7.2 0 0 0 0-11.2Z" fill="currentColor" opacity=".8"/></svg>`,
  transform: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.4" y="4.4" width="15.2" height="15.2" rx="1" stroke-dasharray="2.4 2.4" ${stroke}/><path d="M12 2.6v3.2M12 18.2v3.2M2.6 12h3.2M18.2 12h3.2" ${stroke}/></svg>`,
  symbols: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 3 5.6 6.2.6-4.6 4.2 1.4 6.2L12 16.6 6 19.6l1.4-6.2L2.8 9.2 9 8.6Z" ${stroke}/></svg>`,
  align: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3.6v16.8" ${stroke}/><rect x="8" y="6.2" width="10.4" height="4.2" rx="0.8" ${stroke}/><rect x="8" y="13.6" width="6.4" height="4.2" rx="0.8" ${stroke}/></svg>`,
  pathfinder: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9.6" cy="12" r="6" ${stroke}/><circle cx="14.4" cy="12" r="6" ${stroke}/></svg>`,
  effects: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.2 5.4 5.8.5-4.4 3.9 1.3 5.7L12 15.6l-4.9 2.9 1.3-5.7L4 8.9l5.8-.5Z" ${stroke}/></svg>`,
  artboard: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.6" y="4.2" width="16.8" height="15.6" rx="1" ${stroke}/><path d="M8 4.2v15.6M16 4.2v15.6" ${stroke} opacity=".45"/></svg>`,
  guides: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.4h16M4 17.6h16M6.4 4v16M17.6 4v16" ${stroke} opacity=".55"/><path d="M8.4 11.8h7.2" ${stroke}/></svg>`,
  measure: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 14.2 14.2 3.6l6.2 6.2L9.8 20.4Z" ${stroke}/><path d="m6.4 14.4 2-2M9.6 11.2l2-2M12.8 8l2-2" ${stroke}/></svg>`,
  comment: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.2h16v10.4H12l-4 3.6v-3.6H4Z" ${stroke}/><path d="M8 9.4h8M8 12h5" ${stroke}/></svg>`,
  history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.6v4.6h4.6" ${stroke}/><path d="M4.4 10.2a8 8 0 1 1 1 5.6" ${stroke}/><path d="M12 8v4.6l3 1.8" ${stroke}/></svg>`,
  actions: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.4 2.4-8.6 11.4h6.2l-1.4 7.8 8.6-11.4h-6.2Z" ${stroke}/></svg>`,
  link: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.8a4.2 4.2 0 0 0 6 0l2.4-2.4a4.2 4.2 0 0 0-6-6l-1.2 1.2" ${stroke}/><path d="M14 10.2a4.2 4.2 0 0 0-6 0L5.6 12.6a4.2 4.2 0 0 0 6 6l1.2-1.2" ${stroke}/></svg>`,
  export: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.4V3.6M7.6 8 12 3.6 16.4 8" ${stroke}/><path d="M4.4 14.6v5.8h15.2v-5.8" ${stroke}/></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" ${stroke}/><path d="M19.4 14.6a7.6 7.6 0 0 0 0-5.2l-2-.6-.8-1.9.9-1.9a7.8 7.8 0 0 0-4.5-2.6l-1.3 1.7h-2.1L8.3 2.4a7.8 7.8 0 0 0-4.5 2.6l.9 1.9-.8 1.9-2 .6a7.6 7.6 0 0 0 0 5.2l2 .6.8 1.9-.9 1.9a7.8 7.8 0 0 0 4.5 2.6l1.3-1.7h2.1l1.3 1.7a7.8 7.8 0 0 0 4.5-2.6l-.9-1.9.8-1.9Z" ${stroke}/></svg>`,
  help: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" ${stroke}/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.1 1-1.1 2" ${stroke}/><circle cx="12" cy="16.6" r="0.9" fill="currentColor"/></svg>`,
  info: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6" ${stroke}/><path d="M12 10.6v6" ${stroke}/><circle cx="12" cy="7.6" r="1" fill="currentColor"/></svg>`,
  pointer: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 4.4 17 11l-4.4 1 2 5.2-2.2.8-2-5.2-3.8 3.2Z" ${stroke}/></svg>`,
  target: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.4" ${stroke}/><circle cx="12" cy="12" r="2.4" ${stroke}/><path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3" ${stroke}/></svg>`,
  navPrev: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.4 6-6 6 6 6" ${stroke}/></svg>`,
  navNext: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.6 6 6 6-6 6" ${stroke}/></svg>`,
  fit: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.4V4h5.4M20 9.4V4h-5.4M4 14.6V20h5.4M20 14.6V20h-5.4" ${stroke}/></svg>`,
  copy: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.4" y="8.4" width="11.2" height="11.2" rx="1.2" ${stroke}/><path d="M15.6 5.4H5.4v10.2" ${stroke}/></svg>`,
  duplicate: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.4" y="8.4" width="10.6" height="10.6" rx="1.2" ${stroke}/><path d="M9.4 5.4h8.2a1.4 1.4 0 0 1 1.4 1.4v8.4" ${stroke}/></svg>`,
  fetch: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4v11.2M7.6 10.6 12 15l4.4-4.4" ${stroke}/><path d="M4.4 15.4v5.2h15.2v-5.2" ${stroke}/></svg>`,
  fx: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 20V7.6a2.6 2.6 0 0 1 2.6-2.6h1.6M5 10.4h6.6" ${stroke}/><path d="m14 11.4 4.6 6M18.6 11.4 14 17.4" ${stroke}/></svg>`,
  grid: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.6" y="3.6" width="16.8" height="16.8" rx="1" ${stroke}/><path d="M3.6 9.6h16.8M3.6 15h16.8M9.6 3.6v16.8M15 3.6v16.8" ${stroke} opacity=".6"/></svg>`,
  ruler: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 15.2 15.2 3.4l5.4 5.4L8.8 20.6Z" ${stroke}/><path d="m7 15.4 1.8-1.8M10.4 12l1.8-1.8M13.8 8.6l1.8-1.8" ${stroke}/></svg>`,
  textBox: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.6" y="4.6" width="16.8" height="14.8" rx="1" ${stroke}/><path d="M8.6 9.4h6.8M12 9.4v6.2" ${stroke}/></svg>`,
  transparency: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4Z" ${stroke}/><path d="M4 10h6V4M16 20v-6h4M10 20v-4h-6" ${stroke} opacity=".6"/></svg>`,
  wand: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.4 19.6 11-11M13.8 4.2l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8L9.8 8.2l2.8-1.2Z" ${stroke}/></svg>`
};

export function icon(name: string, size = 16, className = ""): string {
  const svg = icons[name] ?? icons.rect;
  return `<span class="vc-icon${className ? ` ${className}` : ""}" style="width:${size}px;height:${size}px" aria-hidden="true">${svg}</span>`;
}

export type IconName = keyof typeof icons;
