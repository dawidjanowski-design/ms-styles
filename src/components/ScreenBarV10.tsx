import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu } from '../icons/Feather';

/* Nr 10: pasek ekranu przy przewijaniu. Naglowek aplikacji odjezdza do gory,
   na jego miejsce wjezdza nizszy pasek z przyciskiem Menu i nazwa ekranu.
   Sterowanie ekranu (waluty, rachunki) nie ma tu kopii — ten sam element
   przykleja sie w pasku po prawej (hook ponizej). Menu przywraca naglowek nad
   paskiem; przewiniecie w dol chowa go z powrotem. */
function ScreenBar({
  title,
  menuOpen,
  onMenu,
  onClose,
}: {
  title: string;
  menuOpen: boolean;
  onMenu: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!menuOpen) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last + 24) onClose();
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen, onClose]);
  return (
    <div className={`screenBar ${menuOpen ? 'screenBar--below' : ''}`} role="region" aria-label="Pasek ekranu">
      <div className="screenBar__inner">
        <button type="button" className="screenBar__menu" aria-expanded={menuOpen} onClick={onMenu}>
          <Menu size={16} />
          <span>Menu</span>
        </button>
        <span className="screenBar__title">{title}</span>
      </div>
    </div>
  );
}

/* Holder (ref) zostaje w tresci i trzyma miejsce; jego pierwsze dziecko
   przechodzi na position: fixed, gdy dojedzie do krawedzi, i stoi w pasku
   po prawej, w tej samej pozycji w poziomie. */
export function useScreenBarV10(enabled: boolean, title: string, deps: unknown[] = []) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!compact) setMenuOpen(false);
  }, [compact]);

  useEffect(() => {
    const holder = holderRef.current;
    const el = holder?.firstElementChild as HTMLElement | null;
    if (!enabled || !holder || !el) return;
    const HEADER = 68;
    const BAR = 60;
    let docked = false;
    const undock = () => {
      el.style.position = '';
      el.style.top = '';
      el.style.left = '';
      holder.style.minHeight = '';
      holder.style.minWidth = '';
      docked = false;
    };
    const update = () => {
      const h = holder.getBoundingClientRect();
      setCompact(h.top < HEADER);
      const target = (menuOpen ? HEADER : 0) + (BAR - el.offsetHeight) / 2;
      if (h.top <= target) {
        if (!docked) {
          holder.style.minHeight = `${el.offsetHeight}px`;
          holder.style.minWidth = `${el.offsetWidth}px`;
        }
        docked = true;
        el.style.position = 'fixed';
        el.style.top = `${target}px`;
        el.style.left = `${h.right - el.offsetWidth}px`;
      } else if (docked) undock();
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      undock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, menuOpen, ...deps]);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    if (compact && !menuOpen) root.setAttribute('data-compact', '');
    else root.removeAttribute('data-compact');
    return () => root.removeAttribute('data-compact');
  }, [enabled, compact, menuOpen]);

  const bar =
    enabled && compact
      ? createPortal(
          <ScreenBar
            title={title}
            menuOpen={menuOpen}
            onMenu={() => setMenuOpen((o) => !o)}
            onClose={() => setMenuOpen(false)}
          />,
          document.body
        )
      : null;

  return { holderRef, bar };
}
