/** Video scopes rendered from the current program frame. */
export function drawWaveform(canvas: HTMLCanvasElement, source: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#050805";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(120,200,120,0.13)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, (h / 5) * i);
    ctx.lineTo(w, (h / 5) * i);
    ctx.stroke();
  }
  for (let i = 1; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo((w / 6) * i, 0);
    ctx.lineTo((w / 6) * i, h);
    ctx.stroke();
  }
  const sctx = source.getContext("2d");
  if (!sctx) return;
  const sw = source.width;
  const sh = source.height;
  const data = sctx.getImageData(0, 0, sw, sh).data;
  const step = 3;
  ctx.fillStyle = "rgba(130,235,130,0.55)";
  for (let y = 0; y < sh; y += step) {
    for (let x = 0; x < sw; x += step) {
      const index = (y * sw + x) * 4;
      const luma = data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722;
      const px = (x / sw) * w;
      const py = (1 - luma / 255) * (h - 4) + 2;
      ctx.fillRect(px, py, 1, 1);
    }
  }
  ctx.strokeStyle = "rgba(150,255,150,0.28)";
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
}

export function drawVectorscope(canvas: HTMLCanvasElement, source: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#050805";
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.42;
  ctx.strokeStyle = "rgba(120,200,120,0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.stroke();

  const sctx = source.getContext("2d");
  if (!sctx) return;
  const sw = source.width;
  const sh = source.height;
  const data = sctx.getImageData(0, 0, sw, sh).data;
  const step = 3;
  for (let y = 0; y < sh; y += step) {
    for (let x = 0; x < sw; x += step) {
      const index = (y * sw + x) * 4;
      const r = data[index] / 255;
      const g = data[index + 1] / 255;
      const b = data[index + 2] / 255;
      const cb = -0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 0.5 * r - 0.418688 * g - 0.081312 * b;
      const px = cx + cb * radius * 2.2;
      const py = cy - cr * radius * 2.2;
      if (Math.hypot(px - cx, py - cy) > radius) continue;
      ctx.fillStyle = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},0.58)`;
      ctx.fillRect(px, py, 1, 1);
    }
  }
  ctx.strokeStyle = "rgba(150,255,150,0.3)";
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
}
