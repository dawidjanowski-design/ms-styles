import { Logo, BellIcon } from '../icons/Logo';
import { NAV } from '../data/portfolio';

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
      <span className="amount__int">{int}</span>
      <span className="amount__dec">{dec}</span>
    </div>
  );
}

export function Pills({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="pills" role="group">
      {items.map((it) => (
        <button
          key={it}
          type="button"
          aria-pressed={it === value}
          onClick={() => onChange(it)}
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
        <button type="button" className="appHeader__bell" aria-label="Powiadomienia">
          <BellIcon />
        </button>
        <div className="appHeader__user">
          <span className="appHeader__userName">Dawid Jankowski</span>
          <span className="appHeader__avatar" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
