// The logo's signature: two thin concentric rings, open at the bottom where the name sits.
// Angles in degrees, 0 = top, clockwise. Stroke stays crisp at any size.
const arc = (r: number, from: number, to: number) => {
  const p = (a: number) => [50 + r * Math.sin((a * Math.PI) / 180), 50 - r * Math.cos((a * Math.PI) / 180)];
  const [x1, y1] = p(from);
  const [x2, y2] = p(to);
  const sweep = (to - from + 360) % 360;
  return `M${x1} ${y1}A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

export function Rings({ className = '', gap = 64, strokeWidth = 1.5 }: { className?: string; gap?: number; strokeWidth?: number }) {
  const from = 180 + gap / 2;
  const to = 180 - gap / 2;
  const s = { strokeWidth, vectorEffect: 'non-scaling-stroke' } as const;
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      {gap === 0 ? (
        <>
          <circle cx="50" cy="50" r="49" {...s} />
          <circle cx="50" cy="50" r="45.5" {...s} />
        </>
      ) : (
        <>
          <path d={arc(49, from, to)} {...s} />
          <path d={arc(45.5, from + 4, to - 4)} {...s} />
        </>
      )}
    </svg>
  );
}
