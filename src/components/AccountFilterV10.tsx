import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from '../icons/Feather';

/* Nr 10: filtr rachunkow — wielokrotny wybor. Na przycisku „Wszystkie
   rachunki”, a po zawezeniu „Rachunki” z czarnym licznikiem wybranych.
   Lista z polami wyboru; na dole „Zaznacz wszystkie” i „Wyczyść”. */

export type AccountOption = { id: string; name: string; number: string; meta?: string };

export function AccountFilterV10({
  options,
  value,
  onChange,
}: {
  options: AccountOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const all = value.length === options.length;

  useEffect(() => {
    if (!open) return;
    const out = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', out);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', out);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  const toggle = (id: string) => {
    const next = value.includes(id) ? value.filter((x) => x !== id) : [...value, id];
    /* Pusty wybor nie ma sensu — odznaczenie ostatniego wraca do wszystkich. */
    onChange(next.length ? options.map((o) => o.id).filter((x) => next.includes(x)) : options.map((o) => o.id));
  };

  return (
    <div className="acctFilter" ref={ref}>
      <button
        type="button"
        className={`selectBtn acctFilter__btn ${all ? '' : 'is-filtered'}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {all ? 'Wszystkie rachunki' : 'Rachunki'}
        {!all && (
          <span className="acctFilter__count" aria-label={`wybrane: ${value.length}`}>
            {value.length}
          </span>
        )}
        <ChevronDown size={14} className="acctFilter__chev" />
      </button>
      {open && (
        <div className="acctFilter__menu" role="group" aria-label="Filtruj po rachunkach">
          {options.map((o) => {
            const on = value.includes(o.id);
            return (
              <label key={o.id} className={`acctFilter__item ${on ? 'is-on' : ''}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(o.id)} />
                <span className="acctFilter__box" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="acctFilter__text">
                  <span className="acctFilter__name">{o.name}</span>
                  <span className="acctFilter__meta">
                    {o.number}
                    {o.meta ? ` · ${o.meta}` : ''}
                  </span>
                </span>
              </label>
            );
          })}
          <div className="acctFilter__foot">
            <button type="button" className="acctFilter__link" onClick={() => onChange(options.map((o) => o.id))} disabled={all}>
              Zaznacz wszystkie
            </button>
            {/* Glowna akcja dropdownu — ten sam grafitowy przycisk co „Wpłać”. */}
            <button type="button" className="btn btn--primary acctFilter__done" onClick={() => setOpen(false)}>
              Gotowe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
