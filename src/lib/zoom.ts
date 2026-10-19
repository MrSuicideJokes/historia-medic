// Zoom/pan state for the photo viewer: image drawn at translate(x, y) scale(s), origin at the
// frame centre. Points are in px relative to that centre.
export type View = { s: number; x: number; y: number };
export type Size = { w: number; h: number };
type Point = { x: number; y: number };

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;
export const IDENTITY: View = { s: 1, x: 0, y: 0 };

// Never let the image leave a gap at the frame edge.
export function clampView(v: View, size: Size): View {
  const mx = ((v.s - 1) * size.w) / 2;
  const my = ((v.s - 1) * size.h) / 2;
  return { s: v.s, x: Math.min(mx, Math.max(-mx, v.x)), y: Math.min(my, Math.max(-my, v.y)) };
}

// Scale to `s` while keeping the image point under `p` exactly where it is.
export function zoomAt(v: View, s: number, p: Point, size: Size): View {
  const ns = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s));
  const k = ns / v.s;
  return clampView({ s: ns, x: p.x - (p.x - v.x) * k, y: p.y - (p.y - v.y) * k }, size);
}
