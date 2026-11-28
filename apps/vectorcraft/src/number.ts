/** 统一数值精度：默认保留 1 位小数，SVG 输出使用 2 位。 */
export function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
