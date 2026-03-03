// src/lib/tools/compass/wheelGeometry.ts
// SVG arc helpers for the Coffee Compass wheel

/** Convert polar coords (0°=top, CW) to SVG cartesian */
export function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

/** Donut arc path: clockwise from startDeg to endDeg at innerR / outerR */
export function arcPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number
): string {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const s1 = polar(cx, cy, innerR, startDeg);
  const e1 = polar(cx, cy, innerR, endDeg);
  const s2 = polar(cx, cy, outerR, startDeg);
  const e2 = polar(cx, cy, outerR, endDeg);
  return [
    `M ${s1.x.toFixed(2)} ${s1.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 1 ${e1.x.toFixed(2)} ${e1.y.toFixed(2)}`,
    `L ${e2.x.toFixed(2)} ${e2.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 0 ${s2.x.toFixed(2)} ${s2.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/** Midpoint angle of a segment in SVG space */
export function midAngle(center: number, span: number) {
  return center;
}

/** Text transform: radially oriented inside a segment, always readable */
export function textTransform(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): string {
  const p = polar(cx, cy, r, angleDeg);
  // Flip text in the bottom half so it's always readable
  const flip = angleDeg > 90 && angleDeg <= 270;
  const rot = flip ? angleDeg + 180 : angleDeg;
  return `rotate(${rot}, ${p.x.toFixed(2)}, ${p.y.toFixed(2)})`;
}
