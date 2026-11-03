import { useEffect, useState } from 'react';
import { AppHeader } from './components/ui';
import { PortfolioScreen } from './components/Portfolio';

type StyleId = '1' | '2';
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

  useEffect(() => {
    document.documentElement.setAttribute('data-style', styleId);
    try {
      localStorage.setItem(KEY, styleId);
    } catch {
      /* brak dostępu do storage — ignorujemy */
    }
  }, [styleId]);

  return (
    <>
      <AppHeader />
      <PortfolioScreen styleId={styleId} />

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
