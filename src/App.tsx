import { useEffect, useState } from 'react';
import { AppHeader } from './components/ui';
import { PortfolioScreen } from './components/Portfolio';
import { AssetDetailScreen } from './components/AssetDetail';
import { DashboardScreen } from './components/Dashboard';

type StyleId = '1' | '2';
/** Pulpit, portfel i klasa aktywów (obligacje korporacyjne). */
type Screen = { name: 'pulpit' } | { name: 'portfel' } | { name: 'asset'; id: string };

const KEY = 'ms-style';

export default function App() {
  const [styleId, setStyleId] = useState<StyleId>(() => {
    try {
      const saved = localStorage.getItem(KEY);
      return saved === '2' ? '2' : '1';
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
        />
      )}
      {screen.name === 'asset' && (
        <AssetDetailScreen styleId={styleId} onBack={() => setScreen({ name: 'portfel' })} />
      )}

      <div className="styleSwitch" role="group" aria-label="Wybór stylistyki">
        <span>Stylistyka</span>
        {(['1', '2'] as StyleId[]).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={styleId === id}
            onClick={() => setStyleId(id)}
          >
            nr {id}
          </button>
        ))}
      </div>
    </>
  );
}
