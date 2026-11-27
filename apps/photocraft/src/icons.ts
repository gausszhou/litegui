/** Inline SVG icon set for the Photocraft shell. */

const ICONS: Record<string, string> = {
  logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5-6 6-2-2-3 3"/></svg>',
  move: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1.5v13M1.5 8h13"/><path d="M8 1.5L6.2 3.6M8 1.5l1.8 2.1M8 14.5l-1.8-2.1M8 14.5l1.8-2.1M1.5 8l2.1-1.8M1.5 8l2.1 1.8M14.5 8l-2.1-1.8M14.5 8l-2.1 1.8"/></svg>',
  marquee: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-dasharray="2 1.6"><path d="M2.5 2.5h11v11h-11z"/></svg>',
  lasso: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 2c3.3 0 6 1.7 6 3.8S11.3 9.6 8 9.6 2 7.9 2 5.8 4.7 2 8 2z"/><path d="M5.2 9.2c-.7 1.2-.4 2.4.6 3.1 1 .7 1 1.7.2 2.2"/></svg>',
  selectionBrush: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 12c0-4 2-7 5-7 2 0 3 1.4 3 3 0 2.4-2 4-5 4"/><path d="M3 12h10"/><circle cx="11.5" cy="4" r="1"/></svg>',
  crop: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 1v11h11M1 4h11v11"/></svg>',
  eyedropper: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M10 2.5l3.5 3.5M11.6 1l3.4 3.4-1.6 1.6-3.4-3.4z"/><path d="M10 4.6L3.4 11.2 2 14l2.8-1.4 6.6-6.6"/></svg>',
  brush: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M12.5 1.5l2 2-7 7-2.5.5.5-2.5z"/><path d="M6.5 12c0 1.4-.9 2.5-2.2 2.5-.9 0-1.4-.4-1.8-.7.6-.4.8-1 .8-1.8 0-1.2.9-2 2-2 1 0 1.2 1 1.2 2z"/></svg>',
  eraser: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M6 14h8"/><path d="M2.6 9.9l5.3-5.3 4.2 4.2-5.3 5.3H4.6z"/><path d="M7.9 4.6l2.1-2.1 4.2 4.2-2.1 2.1"/></svg>',
  clone: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="11.5" cy="4.5" r="2.5"/><path d="M2 14c0-3 2-5 5-5s5 2 5 5"/><path d="M4 5l3 3"/></svg>',
  heal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 2v12M2 8h12"/><circle cx="8" cy="8" r="5.4"/><path d="M3 3l10 10"/></svg>',
  gradient: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2" y="3" width="12" height="10"/><path d="M2 12h12" stroke-opacity=".7"/><path d="M2 9.5h12" stroke-opacity=".45"/><path d="M2 7h12" stroke-opacity=".2"/></svg>',
  text: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 3h10M8 3v10M5.5 13h5"/></svg>',
  shape: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.5" y="2.5" width="8" height="8"/><circle cx="10.5" cy="10.5" r="3.2"/></svg>',
  zoom: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5L14 14M4.8 7h4.4M7 4.8v4.4"/></svg>',
  hand: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M5 8V4.5a1.2 1.2 0 0 1 2.4 0V7m0-3.2a1.2 1.2 0 0 1 2.4 0V7m0-2.2a1.2 1.2 0 0 1 2.4 0V10c0 2.4-1.7 4-4 4-2.6 0-3.4-1.2-4.4-3L2 8.4a1.2 1.2 0 0 1 2-1.3L5 8.3"/></svg>',
  eye: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M1 8s2.5-4 7-4 7 4 7 4-2.5 4-7 4-7-4-7-4z"/><circle cx="8" cy="8" r="2.1"/></svg>',
  eyeOff: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 2l12 12M6.6 4.3A7.9 7.9 0 0 1 8 4c4.5 0 7 4 7 4a12.6 12.6 0 0 1-2.2 2.5M4.1 5.6C2.2 6.9 1 8 1 8s2.5 4 7 4c.7 0 1.4-.1 2-.3"/></svg>',
  lock: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="3.5" y="7" width="9" height="7"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>',
  layers: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1.6l6 3-6 3-6-3z"/><path d="M2 8.2l6 3 6-3M2 11.4l6 3 6-3"/></svg>',
  plus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 2.5v11M2.5 8h11"/></svg>',
  minus: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2.5 8h11"/></svg>',
  trash: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2.5 4.5h11M6 4.5V2.8h4v1.7M4 4.5l.7 9h6.6l.7-9"/></svg>',
  mask: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2.5" y="3.5" width="11" height="9"/><circle cx="8" cy="8" r="3" fill="currentColor" stroke="none"/></svg>',
  adjust: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="5.4"/><path d="M8 2.6c-2 2-2 8.8 0 10.8 2-2 2-8.8 0-10.8z" fill="currentColor" fill-opacity=".35" stroke="none"/></svg>',
  group: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 4.5h4l1.2 1.5h6.8v7.5H2z"/><path d="M4.5 2.5h9v7"/></svg>',
  channels: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="5.6" cy="6" r="3.2"/><circle cx="10.4" cy="6" r="3.2"/><circle cx="8" cy="10.2" r="3.2"/></svg>',
  paths: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 13C3 7 6 3 13 2"/><circle cx="2" cy="13" r="1.4"/><circle cx="13" cy="2" r="1.4"/></svg>',
  pen: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 1.5l3.5 5.5L8 14.5 4.5 7z"/><path d="M4.5 7h7"/></svg>',
  chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 6l4 4 4-4"/></svg>',
  check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 8.5l3.2 3.2L13 4.5"/></svg>',
  close: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 4l8 8M12 4l-8 8"/></svg>',
  dots: '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3.5" cy="8" r="1.1"/><circle cx="8" cy="8" r="1.1"/><circle cx="12.5" cy="8" r="1.1"/></svg>',
  fit: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4"/></svg>',
  rotate: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M13 8a5 5 0 1 1-1.6-3.7"/><path d="M13.2 2.2v3.4h-3.4"/></svg>',
  info: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="6"/><path d="M8 7v4.5M8 4.6v.2"/></svg>',
};

/** Returns an inline SVG string for the named icon. */
export function icon(name: string, size = 15): string {
  const svg = ICONS[name] ?? ICONS.info;
  return `<span class="pc-icon" style="--pc-icon-size:${size}px">${svg}</span>`;
}

export const iconNames = Object.keys(ICONS);
