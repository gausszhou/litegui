/** SVG chart renderer for the chart objects floating over a worksheet. */

import { formatAxis } from "./format";
import { CalcEngine, isError, type Scalar } from "./formula";
import { CHART_PALETTES, type ChartSpec, type Sheet } from "./model";

export interface ChartSeriesData {
  name: string;
  values: Array<number | null>;
}

export interface ChartData {
  categories: string[];
  series: ChartSeriesData[];
}

export interface ChartTheme {
  title: string;
  axis: string;
  grid: string;
  text: string;
  background: string;
}

export const CHART_THEME: ChartTheme = {
  title: "#3b3a39",
  axis: "#bfbfbf",
  grid: "#e5e5e5",
  text: "#6b6b6b",
  background: "#ffffff"
};

export function paletteColors(name: string, count: number): string[] {
  const palette = CHART_PALETTES[name] ?? CHART_PALETTES.office;
  return Array.from({ length: count }, (_, index) => palette[index % palette.length]);
}

export function resolveChartData(spec: ChartSpec, engine: CalcEngine, sheet: Sheet): ChartData {
  const categoryRows = engine.matrixOf(sheet, spec.categories);
  const categories = categoryRows.map(row => scalarText(row[0] ?? ""));
  const series = spec.series.map(entry => {
    const rows = engine.matrixOf(sheet, entry.range);
    return {
      name: entry.name,
      values: rows.map(row => {
        const value = row[0];
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim() !== "") {
          const n = Number(value.replace(/[$,%\s]/g, ""));
          return Number.isFinite(n) ? n : null;
        }
        return null;
      })
    };
  });
  return { categories, series };
}

function scalarText(value: Scalar): string {
  if (isError(value)) return value.error;
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number") return String(Number(value.toFixed(6)));
  return value;
}

function escape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function truncateLabel(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(1, max - 1))}…`;
}

interface Scale {
  min: number;
  max: number;
  step: number;
  ticks: number[];
}

function niceScale(values: number[]): Scale {
  const finite = values.filter(value => Number.isFinite(value));
  let min = Math.min(0, ...finite);
  let max = Math.max(0, ...finite);
  if (min === max) max = min + 1;
  const range = max - min;
  const rough = range / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough || 1));
  const residual = rough / magnitude;
  const step = (residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 2.5 ? 2.5 : residual <= 5 ? 5 : 10) * magnitude;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = niceMin; value <= niceMax + step * 0.5; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }
  return { min: niceMin, max: niceMax, step, ticks };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number): string {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(
    2
  )} Z`;
}

function label(value: number): string {
  return formatAxis(value, true);
}

export function renderChartSvg(spec: ChartSpec, data: ChartData, width: number, height: number): string {
  const palette = paletteColors(spec.palette, Math.max(data.series.length, data.categories.length, 2));
  const pad = 12;
  let top = pad;
  let titleMarkup = "";
  if (spec.title.trim()) {
    titleMarkup = `<text x="${width / 2}" y="${top + 12}" text-anchor="middle" font-size="13" font-weight="600" fill="${
      CHART_THEME.title
    }" font-family="inherit">${escape(spec.title)}</text>`;
    top += 30;
  }
  const legend = spec.legend;
  const legendItems =
    spec.type === "pie" || spec.type === "doughnut"
      ? data.categories.map((name, index) => ({ name, color: palette[index % palette.length] }))
      : data.series.map((entry, index) => ({ name: entry.name, color: palette[index % palette.length] }));

  const legendRight = legend === "right" && legendItems.length > 0;
  const legendBottom = legend === "bottom" && legendItems.length > 0;
  const legendTop = legend === "top" && legendItems.length > 0;
  const legendWidth = legendRight ? 86 : 0;
  if (legendTop) top += 22;

  const plotLeft = 58;
  const plotRight = width - pad - legendWidth;
  const plotTop = top + 8;
  const bottomRoom = legendBottom ? 46 : 22;
  const plotBottom = height - bottomRoom;
  const plotWidth = Math.max(40, plotRight - plotLeft);
  const plotHeight = Math.max(40, plotBottom - plotTop);

  let chartMarkup = "";
  let legendMarkup = "";

  if (spec.type === "pie" || spec.type === "doughnut") {
    const total = data.series[0]?.values.reduce<number>((sum, value) => sum + Math.max(0, value ?? 0), 0) ?? 0;
    const cx = plotLeft + plotWidth / 2;
    const cy = plotTop + plotHeight / 2;
    const radius = Math.min(plotWidth, plotHeight) * (legendRight ? 0.42 : 0.38);
    const inner = spec.type === "doughnut" ? radius * 0.55 : 0;
    let angle = -Math.PI / 2;
    data.categories.forEach((_name, index) => {
      const value = Math.max(0, data.series[0]?.values[index] ?? 0);
      if (!total || value <= 0) return;
      const sweep = (value / total) * Math.PI * 2;
      const end = angle + sweep;
      const color = palette[index % palette.length];
      if (inner > 0) {
        const outer = arcPath(cx, cy, radius, angle, end);
        const innerArc = arcPath(cx, cy, inner, end, angle);
        chartMarkup += `<path d="${outer} ${innerArc}" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>`;
      } else {
        chartMarkup += `<path d="${arcPath(
          cx,
          cy,
          radius,
          angle,
          end
        )}" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>`;
      }
      if (spec.dataLabels && sweep > 0.35) {
        const mid = angle + sweep / 2;
        const lx = cx + ((radius + inner) / 2) * Math.cos(mid);
        const ly = cy + ((radius + inner) / 2) * Math.sin(mid);
        const pct = Math.round((value / total) * 100);
        chartMarkup += `<text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(
          1
        )}" text-anchor="middle" font-size="9.5" fill="#ffffff" font-weight="600">${pct}%</text>`;
      }
      angle = end;
    });
    if (legendRight) {
      legendMarkup = legendBlock(legendItems, plotRight + 14, plotTop + 4, "vertical");
    } else if (legendBottom) {
      legendMarkup = legendBlock(legendItems, width / 2, height - 11, "horizontal");
    }
  } else {
    const values = data.series.flatMap(entry => entry.values.filter((value): value is number => value !== null));
    const scale = niceScale(values);
    const horizontal = spec.type === "bar";
    if (horizontal) {
      const groupHeight = plotHeight / Math.max(1, data.categories.length);
      const barHeight = Math.max(4, (groupHeight * 0.62) / Math.max(1, data.series.length));
      scale.ticks.forEach(tick => {
        const x = plotLeft + ((tick - scale.min) / (scale.max - scale.min || 1)) * plotWidth;
        chartMarkup += `<line x1="${x}" y1="${plotTop}" x2="${x}" y2="${plotBottom}" stroke="${CHART_THEME.grid}" stroke-width="1"/>`;
        chartMarkup += `<text x="${x}" y="${plotBottom + 14}" text-anchor="middle" font-size="9.5" fill="${
          CHART_THEME.text
        }">${escape(label(tick))}</text>`;
      });
      data.categories.forEach((name, categoryIndex) => {
        const groupY = plotTop + categoryIndex * groupHeight;
        chartMarkup += `<text x="${plotLeft - 8}" y="${
          groupY + groupHeight / 2 + 3
        }" text-anchor="end" font-size="9.5" fill="${CHART_THEME.text}">${escape(truncateLabel(name, 12))}</text>`;
        data.series.forEach((entry, seriesIndex) => {
          const value = entry.values[categoryIndex];
          if (value === null) return;
          const widthPx = (Math.abs(value) / (scale.max - scale.min || 1)) * plotWidth;
          const x = value >= 0 ? plotLeft : plotLeft - widthPx;
          const y = groupY + (groupHeight - barHeight * data.series.length) / 2 + seriesIndex * barHeight;
          chartMarkup += `<rect x="${x}" y="${y}" width="${Math.max(1, widthPx)}" height="${Math.max(
            2,
            barHeight - 1.5
          )}" fill="${palette[seriesIndex % palette.length]}" rx="1"/>`;
        });
      });
      chartMarkup += `<line x1="${plotLeft}" y1="${plotTop}" x2="${plotLeft}" y2="${plotBottom}" stroke="${CHART_THEME.axis}"/>`;
    } else {
      scale.ticks.forEach(tick => {
        const y = plotBottom - ((tick - scale.min) / (scale.max - scale.min || 1)) * plotHeight;
        if (spec.gridlines)
          chartMarkup += `<line x1="${plotLeft}" y1="${y}" x2="${plotRight}" y2="${y}" stroke="${CHART_THEME.grid}" stroke-width="1"/>`;
        chartMarkup += `<text x="${plotLeft - 8}" y="${y + 3}" text-anchor="end" font-size="9.5" fill="${
          CHART_THEME.text
        }">${escape(label(tick))}</text>`;
      });
      const count = Math.max(1, data.categories.length);
      const band = plotWidth / count;
      const pointX = (index: number) =>
        plotLeft +
        band * index +
        (spec.type === "column" ? band / 2 : band * 0.08 + (band * 0.84 * index) / Math.max(1, count - 1));
      data.categories.forEach((name, index) => {
        const x =
          spec.type === "column"
            ? plotLeft + band * index + band / 2
            : plotLeft + (band * 0.84 * index) / Math.max(1, count - 1) + band * 0.08;
        if (data.categories.length <= 10 || index % 2 === 0) {
          chartMarkup += `<text x="${x}" y="${plotBottom + 14}" text-anchor="middle" font-size="9.5" fill="${
            CHART_THEME.text
          }">${escape(truncateLabel(name, 11))}</text>`;
        }
      });
      if (spec.type === "column") {
        const groupWidth = band * 0.68;
        const barWidth = Math.max(2, groupWidth / Math.max(1, data.series.length) - 2);
        data.series.forEach((entry, seriesIndex) => {
          entry.values.forEach((value, index) => {
            if (value === null) return;
            const zeroY = plotBottom - ((0 - scale.min) / (scale.max - scale.min || 1)) * plotHeight;
            const y = plotBottom - ((value - scale.min) / (scale.max - scale.min || 1)) * plotHeight;
            const x = plotLeft + band * index + (band - groupWidth) / 2 + seriesIndex * (barWidth + 2);
            const heightPx = Math.abs(zeroY - y);
            chartMarkup += `<rect x="${x}" y="${Math.min(y, zeroY)}" width="${barWidth}" height="${Math.max(
              1,
              heightPx
            )}" fill="${palette[seriesIndex % palette.length]}" rx="1"/>`;
          });
        });
      } else if (spec.type === "line" || spec.type === "scatter") {
        data.series.forEach((entry, seriesIndex) => {
          const points = entry.values
            .map((value, index) =>
              value === null
                ? null
                : {
                    x: pointX(index),
                    y: plotBottom - ((value - scale.min) / (scale.max - scale.min || 1)) * plotHeight
                  }
            )
            .filter((point): point is { x: number; y: number } => point !== null);
          if (spec.type === "line" && points.length > 1) {
            chartMarkup += `<polyline fill="none" stroke="${
              palette[seriesIndex % palette.length]
            }" stroke-width="2" points="${points
              .map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
              .join(" ")}"/>`;
          }
          for (const point of points) {
            chartMarkup += `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="2.6" fill="${
              palette[seriesIndex % palette.length]
            }" stroke="#ffffff" stroke-width="1"/>`;
          }
          if (spec.dataLabels) {
            for (const [index, point] of points.entries()) {
              const value = entry.values[index];
              if (value === null) continue;
              chartMarkup += `<text x="${point.x}" y="${point.y - 7}" text-anchor="middle" font-size="9" fill="${
                CHART_THEME.text
              }">${value.toLocaleString("en-US")}</text>`;
            }
          }
        });
      } else if (spec.type === "area") {
        data.series.forEach((entry, seriesIndex) => {
          const points = entry.values.map((value, index) =>
            value === null
              ? null
              : { x: pointX(index), y: plotBottom - ((value - scale.min) / (scale.max - scale.min || 1)) * plotHeight }
          );
          const valid = points.filter((point): point is { x: number; y: number } => point !== null);
          if (!valid.length) return;
          const baseline = plotBottom - ((0 - scale.min) / (scale.max - scale.min || 1)) * plotHeight;
          const path = `M ${valid[0].x} ${baseline} ${valid
            .map(point => `L ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
            .join(" ")} L ${valid[valid.length - 1].x} ${baseline} Z`;
          chartMarkup += `<path d="${path}" fill="${
            palette[seriesIndex % palette.length]
          }" fill-opacity="0.28" stroke="${palette[seriesIndex % palette.length]}" stroke-width="2"/>`;
        });
      }
      chartMarkup += `<line x1="${plotLeft}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="${CHART_THEME.axis}"/>`;
      chartMarkup += `<line x1="${plotLeft}" y1="${plotTop}" x2="${plotLeft}" y2="${plotBottom}" stroke="${CHART_THEME.axis}"/>`;
      if (spec.dataLabels && spec.type === "column") {
        data.series.forEach((entry, seriesIndex) => {
          entry.values.forEach((value, index) => {
            if (value === null) return;
            const y = plotBottom - ((value - scale.min) / (scale.max - scale.min || 1)) * plotHeight;
            const x = plotLeft + band * index + band / 2 + (seriesIndex - (data.series.length - 1) / 2) * 12;
            chartMarkup += `<text x="${x}" y="${y - 5}" text-anchor="middle" font-size="8.5" fill="${
              CHART_THEME.text
            }">${formatAxis(value)}</text>`;
          });
        });
      }
    }
    if (legendRight) {
      legendMarkup = legendBlock(legendItems, plotRight + 14, plotTop + 4, "vertical");
    } else if (legendBottom) {
      legendMarkup = legendBlock(legendItems, width / 2, height - 11, "horizontal");
    }
  }

  if (legendTop) {
    legendMarkup = legendBlock(legendItems, width / 2, top - 6, "horizontal");
  }

  return `<svg class="gc-chart-svg" width="${Math.max(20, width)}" height="${Math.max(
    20,
    height
  )}" viewBox="0 0 ${Math.max(20, width)} ${Math.max(
    20,
    height
  )}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escape(spec.title || "Chart")}">
    <rect x="0" y="0" width="${width}" height="${height}" fill="${CHART_THEME.background}"/>
    ${titleMarkup}
    ${chartMarkup}
    ${legendMarkup}
  </svg>`;
}

function legendBlock(
  items: Array<{ name: string; color: string }>,
  x: number,
  y: number,
  direction: "vertical" | "horizontal"
): string {
  let markup = "";
  if (direction === "vertical") {
    items.forEach((item, index) => {
      const top = y + index * 15;
      markup += `<rect x="${x}" y="${top}" width="8" height="8" rx="1" fill="${item.color}"/>`;
      markup += `<text x="${x + 13}" y="${top + 7.5}" font-size="9.5" fill="${CHART_THEME.text}">${escape(
        truncateLabel(item.name, 11)
      )}</text>`;
    });
    return markup;
  }
  const total = items.length;
  const itemWidth = Math.min(96, (x * 2 - 40) / Math.max(1, total));
  const start = x - (itemWidth * (total - 1)) / 2;
  items.forEach((item, index) => {
    const left = start + index * itemWidth;
    markup += `<rect x="${left - 10}" y="${y - 8}" width="8" height="8" rx="1" fill="${item.color}"/>`;
    markup += `<text x="${left + 1}" y="${y - 0.5}" font-size="9.5" fill="${CHART_THEME.text}">${escape(
      truncateLabel(item.name, 10)
    )}</text>`;
  });
  return markup;
}

/** Maps a selection rectangle to a sensible chart series layout. */
export function buildChartFromSelection(
  categories: string[],
  series: Array<{ name: string; values: Array<number | null> }>
): ChartData {
  return { categories, series };
}
