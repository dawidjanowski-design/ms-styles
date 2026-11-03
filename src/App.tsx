import { useEffect, useState } from 'react';
import { AppHeader } from './components/ui';
import { PortfolioScreen } from './components/Portfolio';
import { AssetDetailScreen } from './components/AssetDetail';
import { DashboardScreen } from './components/Dashboard';
import { IssuerScreen, SeriesScreen } from './components/Issuer';
import { AccountScreen } from './components/Account';

type StyleId = '1' | '2' | '3';
const STYLES: { id: StyleId; label: string }[] = [
  { id: '1', label: 'nr 1' },
  { id: '2', label: 'nr 2' },
  { id: '3', label: 'Makieta' },
];
/** Pulpit, portfel i klasa aktywów (obligacje korporacyjne). */
type Screen =
  | { name: 'pulpit' }
  | { name: 'portfel' }
  | { name: 'asset'; id: string }
  | { name: 'issuer'; id: string }
  | { name: 'series'; id: string }
  | { name: 'account'; id: string };

const KEY = 'ms-style';

export default function App() {
  const [styleId, setStyleId] = useState<StyleId>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved === '2' || saved === '3' ? saved : '1';
    } catch {
      return '1';
    }
  });
  const [screen, setScreen] = useState<Screen>({ name: 'pulpit' });

  useEffect(() => {
    document.documentElement.setAttribute('data-style', styleId);
    try {
      localStorage.setItem(KEY, styleId);
    } catch {
      /* brak dostępu do storage — ignorujemy */
    }
  }, [styleId]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  return (
    <>
      <AppHeader
        active={screen.name === 'pulpit' ? 'Pulpit' : 'Portfel'}
        onNavigate={(item) => {
          if (item === 'Pulpit') setScreen({ name: 'pulpit' });
          if (item === 'Portfel') setScreen({ name: 'portfel' });
        }}
      />

      {screen.name === 'pulpit' && (
        <DashboardScreen
          styleId={styleId}
          onOpenPortfolio={() => setScreen({ name: 'portfel' })}
        />
      )}
      {screen.name === 'portfel' && (
        <PortfolioScreen
          styleId={styleId}
          onOpenAsset={(id) => setScreen({ name: 'asset', id })}
          onOpenAccount={(id) => setScreen({ name: 'account', id })}
        />
      )}
      {screen.name === 'asset' && (
        <AssetDetailScreen
          styleId={styleId}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenIssuer={(id) => setScreen({ name: 'issuer', id })}
          onOpenSeries={(id) => setScreen({ name: 'series', id })}
        />
      )}
      {screen.name === 'account' && (
        <AccountScreen styleId={styleId} onBack={() => setScreen({ name: 'portfel' })} />
      )}
      {screen.name === 'issuer' && (
        <IssuerScreen
          styleId={styleId}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenAsset={() => setScreen({ name: 'asset', id: 'corp' })}
          onOpenSeries={(id) => setScreen({ name: 'series', id })}
        />
      )}
      {screen.name === 'series' && (
        <SeriesScreen
          styleId={styleId}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenAsset={() => setScreen({ name: 'asset', id: 'corp' })}
          onOpenIssuer={() => setScreen({ name: 'issuer', id: 'ms' })}
        />
      )}

      <div className="styleSwitch" role="group" aria-label="Wybór stylistyki">
        <span>Stylistyka</span>
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={styleId === s.id}
            onClick={() => setStyleId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </>
  );
}
