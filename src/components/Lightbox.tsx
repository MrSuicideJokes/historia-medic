import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { imageSrc } from '../data/products';
import { clampView, IDENTITY, MAX_ZOOM, zoomAt, type View } from '../lib/zoom';
import { useLang } from '../state/lang';
import { ChevronIcon, CloseIcon, MinusIcon, PlusIcon } from './icons';

type Pt = { x: number; y: number };
type Gesture =
  | { kind: 'pan'; start: View; from: Pt; afterPinch: boolean }
  | { kind: 'pinch'; start: View; dist: number; mid: Pt };

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const touchFirst = () => matchMedia('(pointer: coarse)').matches;

// Full-screen photo viewer. Native modal <dialog>: focus stays inside, Esc closes, the page is inert.
// Clicking anywhere outside the photo frame (or ✕) closes. Zoom: pinch, double-tap/double-click,
// wheel, − / + buttons; drag to pan when zoomed; swipe or arrows to change photo.
export function Lightbox({ images, alt, start, onClose }: { images: string[]; alt: string; start: number; onClose: () => void }) {
  const { t, lang } = useLang();
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);
  const [view, setView] = useState<View>(IDENTITY);
  const [smooth, setSmooth] = useState(true); // animate button/double-tap zooms, not finger tracking
  const viewRef = useRef(view);
  viewRef.current = view;
  const pointers = useRef(new Map<number, Pt>());
  const gesture = useRef<Gesture | null>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const multi = images.length > 1;
  const rtl = lang === 'ar';

  const size = () => {
    const r = frame.current!.getBoundingClientRect();
    return { w: r.width, h: r.height };
  };
  // Point relative to the frame centre.
  const local = (p: Pt) => {
    const r = frame.current!.getBoundingClientRect();
    return { x: p.x - r.left - r.width / 2, y: p.y - r.top - r.height / 2 };
  };
  const set = (v: View, animate: boolean) => {
    setSmooth(animate);
    setView(v);
  };

  useEffect(() => {
    const d = dialog.current!;
    d.showModal();
    // Lock page scroll behind the viewer (iOS ignores the inert background otherwise).
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    // Wheel zoom needs a non-passive listener to stop the page from scrolling.
    const el = frame.current!;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      set(zoomAt(viewRef.current, viewRef.current.s * Math.exp(-e.deltaY * 0.002), local({ x: e.clientX, y: e.clientY }), size()), false);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      html.style.overflow = prev;
      if (d.open) d.close();
    };
  }, []);

  const close = () => dialog.current!.close(); // fires onClose via the dialog's close event
  const go = (step: number) => {
    if (!multi) return;
    setIndex((i) => (i + step + images.length) % images.length);
    set(IDENTITY, false);
  };
  const zoomBy = (factor: number) => set(zoomAt(view, view.s * factor, { x: 0, y: 0 }, size()), true);

  const onKeyDown = (e: KeyboardEvent) => {
    const next = rtl ? 'ArrowLeft' : 'ArrowRight';
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === next) go(1);
    else if (e.key === prev) go(-1);
    else if (e.key === '+' || e.key === '=') zoomBy(1.6);
    else if (e.key === '-') zoomBy(1 / 1.6);
    else if (e.key === '0') set(IDENTITY, true);
    else return;
    e.preventDefault();
  };

  // Clicks that land on the dark area (the dialog or its layout wrappers) close the viewer.
  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    if (target === e.currentTarget || target.dataset.backdrop !== undefined) close();
  };

  const startPan = (from: Pt, afterPinch: boolean) => {
    gesture.current = { kind: 'pan', start: viewRef.current, from, afterPinch };
  };

  const onPointerDown = (e: PointerEvent) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId); // keep tracking a finger that slides off the frame
    } catch {
      /* pointer already gone: nothing to capture */
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setSmooth(false);
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      gesture.current = { kind: 'pinch', start: viewRef.current, dist: dist(pts[0], pts[1]), mid: local({ x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }) };
    } else if (pts.length === 1) {
      startPan({ x: e.clientX, y: e.clientY }, false);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    if (g.kind === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const mid = local({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      const v = zoomAt(g.start, (g.start.s * dist(a, b)) / g.dist, g.mid, size());
      setView(clampView({ s: v.s, x: v.x + mid.x - g.mid.x, y: v.y + mid.y - g.mid.y }, size()));
    } else if (g.kind === 'pan' && g.start.s > 1) {
      setView(clampView({ s: g.start.s, x: g.start.x + e.clientX - g.from.x, y: g.start.y + e.clientY - g.from.y }, size()));
    }
  };

  const onPointerUp = (e: PointerEvent, cancelled = false) => {
    if (!pointers.current.delete(e.pointerId)) return;
    const g = gesture.current;
    if (!cancelled && g?.kind === 'pan' && !g.afterPinch) {
      const dx = e.clientX - g.from.x;
      const dy = e.clientY - g.from.y;
      if (g.start.s === 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        // Swipe: towards the start side shows the next photo (left in French, right in Arabic).
        go(dx < 0 !== rtl ? 1 : -1);
      } else if (Math.hypot(dx, dy) < 10) {
        const now = Date.now();
        const last = lastTap.current;
        if (now - last.time < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 30) {
          // Double tap / double click: zoom in on that spot, or back out.
          const v = viewRef.current;
          set(v.s > 1 ? IDENTITY : zoomAt(v, 2.5, local({ x: e.clientX, y: e.clientY }), size()), true);
          lastTap.current = { time: 0, x: 0, y: 0 };
        } else {
          lastTap.current = { time: now, x: e.clientX, y: e.clientY };
        }
      }
    }
    // Lifting one finger of a pinch carries on as a pan with the other.
    const rest = [...pointers.current.values()];
    if (rest.length === 1) startPan(rest[0], true);
    else if (rest.length === 0) gesture.current = null;
  };

  const btn = 'grid size-11 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15 disabled:opacity-35 disabled:hover:bg-transparent';

  return createPortal(
    <dialog ref={dialog} onClose={onClose} onClick={onClick} onKeyDown={onKeyDown} aria-label={alt}
      className="lightbox fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 text-white">
      <div data-backdrop className="flex h-full flex-col items-center justify-center gap-4 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-16">
        <button type="button" onClick={close} aria-label={t.lightbox.close}
          className="absolute end-3 top-[max(0.75rem,env(safe-area-inset-top))] grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
          <CloseIcon width={22} height={22} />
        </button>

        {/* The photo frame: everything inside it is "the photo", so clicks here never close. */}
        <div ref={frame}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={(e) => onPointerUp(e)} onPointerCancel={(e) => onPointerUp(e, true)}
          style={{ backgroundImage: `url(${imageSrc(images[index], 480)})` }}
          className="lightbox-frame relative aspect-square w-[min(94vw,calc(100dvh-14rem))] max-w-[56rem] shrink-0 touch-none select-none overflow-hidden rounded-lg bg-white bg-contain bg-center bg-no-repeat shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)]">
          <img key={images[index]} src={imageSrc(images[index], 960)} alt={multi ? `${alt} (${index + 1}/${images.length})` : alt}
            draggable={false}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`, cursor: view.s > 1 ? 'grab' : 'zoom-in' }}
            className={`size-full object-contain ${smooth ? 'transition-transform duration-200 ease-out' : ''}`} />
        </div>

        {/* Laid out left to right in both languages: the left button always shows the photo to the left. */}
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-1" dir="ltr">
          {multi && (
            <button type="button" className={btn} onClick={() => go(rtl ? 1 : -1)} aria-label={rtl ? t.lightbox.next : t.lightbox.prev}>
              <ChevronIcon className="rotate-90" />
            </button>
          )}
          <button type="button" className={btn} onClick={() => zoomBy(1 / 1.6)} disabled={view.s <= 1} aria-label={t.lightbox.zoomOut}>
            <MinusIcon />
          </button>
          <button type="button" onClick={() => set(IDENTITY, true)} className="tnum min-h-11 min-w-16 rounded-full px-2 text-sm hover:bg-white/15">
            {Math.round(view.s * 100)} %
          </button>
          <button type="button" className={btn} onClick={() => zoomBy(1.6)} disabled={view.s >= MAX_ZOOM} aria-label={t.lightbox.zoomIn}>
            <PlusIcon />
          </button>
          {multi && (
            <button type="button" className={btn} onClick={() => go(rtl ? -1 : 1)} aria-label={rtl ? t.lightbox.prev : t.lightbox.next}>
              <ChevronIcon className="-rotate-90" />
            </button>
          )}
        </div>

        <p data-backdrop className="max-w-[min(94vw,40rem)] text-center text-sm text-white/80">
          <span dir="ltr">{alt}</span>
          {multi && <span className="tnum"> · {index + 1} / {images.length}</span>}
          <span data-backdrop className="mt-1 block text-xs text-white/55">{touchFirst() ? t.lightbox.hintTouch : t.lightbox.hintMouse}</span>
        </p>
      </div>
    </dialog>,
    document.body,
  );
}
