import type { ReactNode, Ref } from 'react';
import { Rings } from './Rings';

// Full-width gradient band with the page title; the logo's rings sit faintly at the far edge.
export function PageHeader({ title, aside, intro, headingRef }: {
  title: string;
  aside?: ReactNode;
  intro?: string;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  return (
    <div className="relative overflow-hidden bg-band">
      <Rings className="pointer-events-none absolute -end-24 -top-28 size-80 text-blue/15 md:-end-16 md:size-[26rem]" gap={0} />
      <div className="wrap relative pb-8 pt-10 md:pb-10 md:pt-14">
        <div className="flex items-end justify-between gap-4">
          <h1 ref={headingRef} tabIndex={headingRef ? -1 : undefined} className="display text-3xl font-semibold outline-none md:text-5xl">{title}</h1>
          {aside && <span className="eyebrow shrink-0 whitespace-nowrap">{aside}</span>}
        </div>
        {intro && <p className="mt-3 max-w-xl text-muted md:text-lg">{intro}</p>}
        <span aria-hidden="true" className="mt-5 block h-[3px] w-16 rounded-full bg-brand-stripe" />
      </div>
    </div>
  );
}
