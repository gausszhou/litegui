/** Draggable tone-curve widget used by the Adjustments panel. */

export interface CurvesPoint {
  x: number;
  y: number;
}

export interface CurvesReadout {
  points: CurvesPoint[];
  active: CurvesPoint;
}

const PADDING = 10;
const HEIGHT = 132;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

function buildHistogram(bins = 64): number[] {
  const result: number[] = [];
  for (let i = 0; i < bins; i += 1) {
    const a = 0.78 * Math.exp(-((i - 17) ** 2) / 88);
    const b = 0.52 * Math.exp(-((i - 40) ** 2) / 70);
    const c = 0.34 * Math.exp(-((i - 53) ** 2) / 46);
    result.push(clamp(a + b + c + 0.05 + 0.03 * Math.sin(i * 0.8), 0.03, 1));
  }
  return result;
}

/** Fritsch–Carlson monotone cubic interpolation, sampled per pixel column. */
function monotoneSlopes(points: CurvesPoint[]): number[] {
  const n = points.length;
  const delta: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    delta.push((points[i + 1].y - points[i].y) / Math.max(1e-6, points[i + 1].x - points[i].x));
  }
  const slopes: number[] = [delta[0] ?? 0];
  for (let i = 1; i < n - 1; i += 1) {
    if (delta[i - 1] * delta[i] <= 0) {
      slopes.push(0);
    } else {
      slopes.push((delta[i - 1] + delta[i]) / 2);
    }
  }
  slopes.push(delta[n - 2] ?? 0);
  // Enforce monotonicity.
  for (let i = 0; i < n - 1; i += 1) {
    if (Math.abs(delta[i]) < 1e-6) {
      slopes[i] = 0;
      slopes[i + 1] = 0;
      continue;
    }
    const alpha = slopes[i] / delta[i];
    const beta = slopes[i + 1] / delta[i];
    const total = alpha * alpha + beta * beta;
    if (total > 9) {
      const tau = 3 / Math.sqrt(total);
      slopes[i] = tau * alpha * delta[i];
      slopes[i + 1] = tau * beta * delta[i];
    }
  }
  return slopes;
}

export class CurvesPanel {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly histogram = buildHistogram();
  private readonly onChange?: (readout: CurvesReadout) => void;
  private points: CurvesPoint[] = [
    { x: 0, y: 0 },
    { x: 0.25, y: 0.21 },
    { x: 0.58, y: 0.71 },
    { x: 1, y: 1 },
  ];
  private dragging = -1;
  private active = 1;
  private width = 1;
  private dpr = 1;

  constructor(canvas: HTMLCanvasElement, onChange?: (readout: CurvesReadout) => void) {
    this.canvas = canvas;
    this.onChange = onChange;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas context unavailable");
    this.ctx = ctx;
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.bind();
    this.emit();
  }

  getPoints(): CurvesPoint[] {
    return this.points.map((point) => ({ ...point }));
  }

  setPoints(points: CurvesPoint[]): void {
    this.points = points
      .map((point) => ({ x: clamp(point.x, 0, 1), y: clamp(point.y, 0, 1) }))
      .sort((a, b) => a.x - b.x);
    if (this.points.length < 2) this.points = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    this.points[0].x = 0;
    this.points[this.points.length - 1].x = 1;
    this.active = Math.min(this.active, this.points.length - 1);
    this.emit();
    this.draw();
  }

  reset(): void {
    this.setPoints([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(40, rect.width);
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(HEIGHT * this.dpr);
    this.canvas.style.height = `${HEIGHT}px`;
    this.draw();
  }

  private plotWidth(): number {
    return Math.max(1, this.width - PADDING * 2);
  }

  private plotHeight(): number {
    return Math.max(1, HEIGHT - PADDING * 2);
  }

  private toCanvas(point: CurvesPoint): { x: number; y: number } {
    return {
      x: PADDING + point.x * this.plotWidth(),
      y: PADDING + (1 - point.y) * this.plotHeight(),
    };
  }

  private toCurve(x: number, y: number): CurvesPoint {
    return {
      x: clamp((x - PADDING) / this.plotWidth(), 0, 1),
      y: clamp(1 - (y - PADDING) / this.plotHeight(), 0, 1),
    };
  }

  private emit(): void {
    const activeIndex = Math.max(0, Math.min(this.active, this.points.length - 1));
    const active = this.points[activeIndex];
    this.canvas.dataset.points = String(this.points.length);
    this.onChange?.({
      points: this.getPoints(),
      active: { ...active },
    });
  }

  private bind(): void {
    const locate = (event: PointerEvent): { x: number; y: number } => {
      const rect = this.canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    this.canvas.addEventListener("pointerdown", (event) => {
      const { x, y } = locate(event);
      const curvePoint = this.toCurve(x, y);
      const threshold = 11;
      let nearest = -1;
      let nearestDistance = threshold;
      this.points.forEach((point, index) => {
        const projected = this.toCanvas(point);
        const distance = Math.hypot(projected.x - x, projected.y - y);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      if (nearest >= 0) {
        this.dragging = nearest;
      } else {
        const insertAt = this.points.findIndex((point) => point.x > curvePoint.x);
        const index = insertAt <= 0 ? this.points.length - 1 : insertAt;
        this.points.splice(index, 0, curvePoint);
        this.points.sort((a, b) => a.x - b.x);
        this.dragging = this.points.findIndex((point) => point.x === curvePoint.x && point.y === curvePoint.y);
        if (this.dragging < 0) this.dragging = this.points.length - 1;
      }
      this.active = Math.max(0, this.dragging);
      this.canvas.setPointerCapture(event.pointerId);
      this.emit();
      this.draw();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (this.dragging < 0) return;
      const { x, y } = locate(event);
      const point = this.points[this.dragging];
      const next = this.toCurve(x, y);
      const isFirst = this.dragging === 0;
      const isLast = this.dragging === this.points.length - 1;
      point.y = next.y;
      if (!isFirst && !isLast) {
        const minX = this.points[this.dragging - 1].x + 0.02;
        const maxX = this.points[this.dragging + 1].x - 0.02;
        point.x = clamp(next.x, minX, maxX);
      } else {
        point.x = isFirst ? 0 : 1;
      }
      this.emit();
      this.draw();
    });

    const stop = (): void => {
      this.dragging = -1;
    };
    this.canvas.addEventListener("pointerup", stop);
    this.canvas.addEventListener("pointercancel", stop);

    this.canvas.addEventListener("dblclick", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const index = this.points.findIndex((point) => {
        const projected = this.toCanvas(point);
        return Math.hypot(projected.x - x, projected.y - y) < 11;
      });
      if (index > 0 && index < this.points.length - 1) {
        this.points.splice(index, 1);
        this.active = Math.min(this.active, this.points.length - 1);
        this.emit();
        this.draw();
      }
    });
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, HEIGHT);

    ctx.fillStyle = "#171717";
    ctx.fillRect(0, 0, this.width, HEIGHT);

    // Histogram backdrop.
    const plotW = this.plotWidth();
    const plotH = this.plotHeight();
    const barWidth = plotW / this.histogram.length;
    for (let i = 0; i < this.histogram.length; i += 1) {
      const height = this.histogram[i] * plotH;
      ctx.fillStyle = "rgba(216, 216, 216, 0.075)";
      ctx.fillRect(PADDING + i * barWidth, PADDING + plotH - height, Math.max(1, barWidth - 0.6), height);
    }

    // Grid.
    ctx.strokeStyle = "#2c2c2c";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i += 1) {
      const x = PADDING + (plotW / 4) * i;
      const y = PADDING + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, PADDING);
      ctx.lineTo(x + 0.5, PADDING + plotH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(PADDING, y + 0.5);
      ctx.lineTo(PADDING + plotW, y + 0.5);
      ctx.stroke();
    }
    ctx.strokeStyle = "#3a3a3a";
    ctx.strokeRect(PADDING + 0.5, PADDING + 0.5, plotW - 1, plotH - 1);

    // Identity diagonal.
    ctx.strokeStyle = "#3f3f3f";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(PADDING, PADDING + plotH);
    ctx.lineTo(PADDING + plotW, PADDING);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tone curve.
    const slopes = monotoneSlopes(this.points);
    ctx.strokeStyle = "#dcdcdc";
    ctx.lineWidth = 1.7;
    ctx.beginPath();
    const samples = Math.max(64, Math.round(plotW));
    for (let i = 0; i <= samples; i += 1) {
      const x = (i / samples) * plotW;
      let segment = this.points.length - 2;
      for (let j = 0; j < this.points.length - 1; j += 1) {
        if (x <= (this.points[j + 1].x - this.points[j].x) * plotW + this.points[j].x * plotW) {
          segment = j;
          break;
        }
      }
      const p0 = this.points[segment];
      const p1 = this.points[segment + 1];
      const span = Math.max(1e-6, p1.x - p0.x);
      const t = clamp((x / plotW - p0.x) / span, 0, 1);
      const t2 = t * t;
      const t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      const value = clamp(
        h00 * p0.y + h10 * span * slopes[segment] + h01 * p1.y + h11 * span * slopes[segment + 1],
        0,
        1,
      );
      const point = this.toCanvas({ x: x / plotW, y: value });
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();

    // Control points.
    this.points.forEach((point, index) => {
      const projected = this.toCanvas(point);
      const radius = index === this.active ? 4.6 : 3.8;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#f2f2f2";
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = index === this.active ? "#6f9bd8" : "#1a1a1a";
      ctx.stroke();
    });
  }
}
