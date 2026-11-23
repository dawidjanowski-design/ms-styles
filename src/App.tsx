import { useEffect, useState } from 'react';
import { AppHeader } from './components/ui';
import { PortfolioScreen } from './components/Portfolio';
import { AssetDetailScreen } from './components/AssetDetail';
import { CorpBondsV10 } from './components/CorpBondsV10';
import { IssuerV10 } from './components/IssuerV10';
import { SeriesV10 } from './components/SeriesV10';
import { AccountV10 } from './components/AccountV10';
import { DashboardScreen } from './components/Dashboard';
import { IssuerScreen, SeriesScreen } from './components/Issuer';
import { AccountScreen } from './components/Account';
import { CURRENCIES, type Currency } from './data/currencies';

type StyleId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'makieta';
const STYLES: { id: StyleId; label: string }[] = [
  { id: '1', label: 'nr 1' },
  { id: '2', label: 'nr 2' },
  { id: '3', label: 'nr 3' },
  { id: '4', label: 'nr 4' },
  { id: '5', label: 'nr 5' },
  { id: '6', label: 'nr 6' },
  { id: '7', label: 'nr 7' },
  { id: '8', label: 'nr 8' },
  { id: '9', label: 'nr 9' },
  { id: '10', label: 'nr 10' },
  { id: 'makieta', label: 'Makieta' },
];
const IDS = STYLES.map((s) => s.id) as string[];
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
      return saved && IDS.includes(saved) ? (saved as StyleId) : '1';
    } catch {
      return '1';
    }
  });
  const [screen, setScreen] = useState<Screen>({ name: 'pulpit' });
  /* Waluta jest wspolna dla Portfela i ekranu klasy aktywow — wejscie w
     obligacje z widoku EUR ma pokazac obligacje w EUR, a nie zaczynac od nowa. */
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  useEffect(() => {
    document.documentElement.setAttribute('data-style', styleId);
    /* Nr 3 i nr 4 dziela uklad i typografie — CSS pyta o rodzine, zeby nie
       powielac kazdej reguly pod dwa numery. Nr 5 wraca do jednej karty
       ekranu zamiast pasm, wiec jest rodzina sama dla siebie. */
    document.documentElement.setAttribute(
      'data-family',
      styleId === '3' || styleId === '4' || styleId === '6' || styleId === '7' ||
      styleId === '8' || styleId === '9'
        ? 'v3'
        : styleId
    );
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
        styleId={styleId}
        onNavigate={(item) => {
          if (item === 'Pulpit') setScreen({ name: 'pulpit' });
          if (item === 'Portfel') setScreen({ name: 'portfel' });
        }}
      />

      {screen.name === 'pulpit' && (
        <DashboardScreen
          styleId={styleId}
          onOpenPortfolio={() => setScreen({ name: 'portfel' })}
          onOpenAsset={(id) => setScreen({ name: 'asset', id })}
        />
      )}
      {screen.name === 'portfel' && (
        <PortfolioScreen
          styleId={styleId}
          currency={currency}
          onCurrencyChange={setCurrency}
          onOpenAsset={(id) => setScreen({ name: 'asset', id })}
          onOpenAccount={(id) => setScreen({ name: 'account', id })}
        />
      )}
      {/* Nr 10 ma wlasny ekran obligacji korporacyjnych — uklad sekcji jest
          inny niz w pozostalych stylistykach. */}
      {screen.name === 'asset' && styleId === '10' && (
        <CorpBondsV10
          currency={currency}
          onCurrencyChange={setCurrency}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenIssuer={(id) => setScreen({ name: 'issuer', id })}
          onOpenSeries={(id) => setScreen({ name: 'series', id })}
        />
      )}
      {screen.name === 'asset' && styleId !== '10' && (
        <AssetDetailScreen
          styleId={styleId}
          currency={currency}
          onCurrencyChange={setCurrency}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenIssuer={(id) => setScreen({ name: 'issuer', id })}
          onOpenSeries={(id) => setScreen({ name: 'series', id })}
        />
      )}
      {/* Nr 10: karta rachunku z wireframe'u 1130:27. */}
      {screen.name === 'account' && styleId === '10' && (
        <AccountV10
          id={screen.id}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenIssuer={(id) => setScreen({ name: 'issuer', id })}
          onOpenSeries={(id) => setScreen({ name: 'series', id })}
        />
      )}
      {screen.name === 'account' && styleId !== '10' && (
        <AccountScreen styleId={styleId} onBack={() => setScreen({ name: 'portfel' })} />
      )}
      {/* Nr 10: karta emitenta z wireframe'u 1121:4248. */}
      {screen.name === 'issuer' && styleId === '10' && (
        <IssuerV10
          issuer={screen.id}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenAsset={() => setScreen({ name: 'asset', id: 'corp' })}
          onOpenSeries={(id) => setScreen({ name: 'series', id })}
        />
      )}
      {/* Nr 10: karta serii z wireframe'u 1121:4573. */}
      {screen.name === 'series' && styleId === '10' && (
        <SeriesV10
          id={screen.id}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenAsset={() => setScreen({ name: 'asset', id: 'corp' })}
          onOpenIssuer={(id) => setScreen({ name: 'issuer', id })}
        />
      )}
      {screen.name === 'issuer' && styleId !== '10' && (
        <IssuerScreen
          styleId={styleId}
          onBack={() => setScreen({ name: 'portfel' })}
          onOpenAsset={() => setScreen({ name: 'asset', id: 'corp' })}
          onOpenSeries={(id) => setScreen({ name: 'series', id })}
        />
      )}
      {screen.name === 'series' && styleId !== '10' && (
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
