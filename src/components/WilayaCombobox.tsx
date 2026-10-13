import { useEffect, useId, useState } from 'react';
import { useLang } from '../state/lang';
import { ChevronIcon } from './icons';

export type Wilaya = { code: string; fr: string; ar: string; communes: { fr: string; ar: string }[] };

// Search ignores case, French accents, Arabic diacritics and hamza/ta-marbuta variants.
const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ًͯ-ْ]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// ARIA 1.2 editable combobox with a listbox popup. Matches by number ("25") or name in either script.
export function WilayaCombobox({ id, wilayas, value, onChange, onBlur, invalid, describedBy }: {
  id: string;
  wilayas: Wilaya[];
  value: string;
  onChange: (code: string) => void;
  onBlur: () => void;
  invalid: boolean;
  describedBy?: string;
}) {
  const { t, lang } = useLang();
  const listId = useId();
  const selected = wilayas.find((w) => w.code === value);
  const label = (w: Wilaya) => `${w.code} · ${w[lang]}`;
  const [query, setQuery] = useState(selected ? label(selected) : '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Show the committed choice (in the current language). A cleared choice keeps what the user is typing.
  useEffect(() => {
    if (selected) setQuery(label(selected));
  }, [value, lang]);

  const q = norm(query);
  const matches = !q || (selected && query === label(selected))
    ? wilayas
    : wilayas.filter((w) => /^\d+$/.test(q) ? w.code.startsWith(q) || String(Number(w.code)).startsWith(q) : norm(w.fr).includes(q) || norm(w.ar).includes(q));

  const optionId = (w: Wilaya) => `${listId}-${w.code}`;
  useEffect(() => {
    if (open && matches[active]) document.getElementById(optionId(matches[active]))?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const commit = (w: Wilaya) => {
    onChange(w.code);
    setQuery(label(w));
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && open && matches[active]) {
      e.preventDefault();
      commit(matches[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery(selected ? label(selected) : '');
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? optionId(matches[active]) : undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        autoComplete="off"
        placeholder={t.checkout.wilayaPlaceholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
          if (value) onChange(''); // editing the text drops the previous choice (and its commune)
        }}
        onFocus={(e) => e.target.select()}
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setOpen(false);
          // Unambiguous text counts as a choice; anything else snaps back.
          if (!selected && matches.length === 1 && q) commit(matches[0]);
          else setQuery(selected ? label(selected) : '');
          onBlur();
        }}
        className="field pe-11"
      />
      <ChevronIcon className={`pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      {open && (
        <ul id={listId} role="listbox" aria-label={t.checkout.wilaya}
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded border border-line-strong bg-paper py-1">
          {matches.length ? matches.map((w, i) => (
            <li key={w.code} id={optionId(w)} role="option" aria-selected={w.code === value}
              onMouseDown={(e) => { e.preventDefault(); commit(w); }}
              onMouseMove={() => setActive(i)}
              className={`flex min-h-11 cursor-pointer items-center gap-3 px-3 ${i === active ? 'bg-blue-tint' : ''} ${w.code === value ? 'font-medium text-blue' : ''}`}>
              <span className="tnum w-6 text-sm text-muted">{w.code}</span>
              {w[lang]}
            </li>
          )) : (
            <li className="px-3 py-3 text-muted">{t.checkout.noResults}</li>
          )}
        </ul>
      )}
    </div>
  );
}
