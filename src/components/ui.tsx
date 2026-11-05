import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Logo, BellIcon, BellIconRound } from '../icons/Logo';
import { NAV } from '../data/portfolio';

/* Kwota przewija sie jak licznik: znak, ktory sie zmienil, wyjezdza w gore,
   a nowy wjezdza z dolu. Znaki bez zmiany stoja w miejscu, wiec przy zmianie
   waluty rusza sie tylko to, co faktycznie jest inne.
   Szerokosc trzymaja cyfry tabelaryczne — bez tego kwota by drgala. */
function Roll({ text }: { text: string }) {
  const [state, setState] = useState({ text, prev: text, gen: 0 });

  if (state.text !== text) {
    setState((s) => ({ text, prev: s.text, gen: s.gen + 1 }));
  }

  /* Po animacji wychodzace znaki musza zniknac z DOM-u, inaczej kwota
     kopiuje sie jako przeplatanka starej i nowej wartosci. */
  useEffect(() => {
    if (state.prev === state.text) return;
    const t = window.setTimeout(() => setState((s) => ({ ...s, prev: s.text })), 650);
    return () => window.clearTimeout(t);
  }, [state.prev, state.text]);

  const chars = [...text];
  const prevChars = [...state.prev];

  return (
    <>
      {chars.map((ch, i) => {
        const was = prevChars[i];
        const changed = state.gen > 0 && was !== ch;
        const delay = { animationDelay: `${i * 18}ms` };
        return (
          <span className="roll" key={i}>
            {changed && (
              <span className="roll__out" key={`o${state.gen}`} style={delay} aria-hidden="true">
                {was ?? ''}
              </span>
            )}
            <span
              className={changed ? 'roll__in' : undefined}
              key={changed ? `i${state.gen}` : 'i'}
              style={changed ? delay : undefined}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </>
  );
}

export function Amount({
  int,
  dec,
  className = '',
}: {
  int: string;
  dec: string;
  className?: string;
}) {
  return (
    <div className={`amount ${className}`}>
      <span className="amount__int">
        <Roll text={int} />
      </span>
      <span className="amount__dec">
        <Roll text={dec} />
      </span>
    </div>
  );
}

export function Pills({
  items,
  value,
  onChange,
  /** w makiecie pigułki pokazują układ, ale nie przełączają */
  locked = false,
}: {
  items: readonly string[];
  value: string;
  onChange: (v: string) => void;
  locked?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [glide, setGlide] = useState<{ x: number; w: number } | null>(null);

  // Wskaźnik aktywnej pigułki jedzie pod przyciskami z jednej na drugą.
  // Mierzymy przed malowaniem, więc przy pierwszym renderze stoi już na miejscu.
  useLayoutEffect(() => {
    const track = ref.current;
    const btn = track?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!track || !btn) return;
    const measure = () => {
      const t = track.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      setGlide({ x: b.left - t.left, w: b.width });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [value]);

  return (
    <div className="pills" role="group" ref={ref}>
      {glide && (
        <span
          className="pills__glide"
          aria-hidden="true"
          style={{ width: glide.w, transform: `translateX(${glide.x}px)` }}
        />
      )}
      {items.map((it) => (
        <button
          key={it}
          type="button"
          aria-pressed={it === value}
          aria-disabled={locked || undefined}
          onClick={locked ? undefined : () => onChange(it)}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

export function KeyValue({
  label,
  value,
  px = 0,
}: {
  label: string;
  value: string;
  px?: number;
}) {
  return (
    <div className="kv" style={{ ['--rowPx' as string]: `${px}px` }}>
      <span className="kv__label">{label}</span>
      <span className="kv__value">{value}</span>
    </div>
  );
}

export function AppHeader({
  active = 'Portfel',
  onNavigate,
}: {
  active?: string;
  onNavigate?: (item: string) => void;
} = {}) {
  return (
    <header className="appHeader">
      <div className="appHeader__logo">
        <Logo />
      </div>
      <nav className="appHeader__nav">
        {NAV.map((item, i) => (
          <button
            key={item}
            type="button"
            className={`navItem ${item === active ? 'navItem--active' : ''} ${
              NAV[i + 1] === active ? 'navItem--prev' : ''
            }`}
            onClick={() => onNavigate?.(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="appHeader__right">
        {/* Oba dzwonki i oba awatary sa w DOM-ie, a CSS pokazuje ten, ktory
            nalezy do stylistyki, tak samo jak szare kolko w makiecie. */}
        <button
          type="button"
          className="appHeader__bell appHeader__bell--new"
          aria-label="Powiadomienia — masz nowe"
        >
          <span className="appHeader__bellIcon">
            <BellIcon />
          </span>
          <span className="appHeader__bellIcon appHeader__bellIcon--round">
            <BellIconRound />
          </span>
          <span className="appHeader__dot" aria-hidden="true" />
        </button>
        <div className="appHeader__user">
          <span className="appHeader__userName">Dawid Jankowski</span>
          <span className="appHeader__avatar">
            <img src="avatar.jpg" width={32} height={32} alt="" />
            <span className="appHeader__initials" aria-hidden="true">
              DJ
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
