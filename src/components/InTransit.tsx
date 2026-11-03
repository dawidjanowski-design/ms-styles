import { useEffect } from 'react';
import { IN_TRANSIT, TRANSIT_GROUPS } from '../data/inTransit';

/** Panel wysuwany z prawej. Nie dotyka krawędzi — 8 px marginesu dookoła. */
export function InTransitDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawerRoot">
      <div className="drawerBackdrop" onClick={onClose} />

      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={IN_TRANSIT.title}
      >
        <div className="drawer__head">
          <div className="drawer__titleBlock">
            <h2 className="drawer__title">{IN_TRANSIT.title}</h2>
            <span className="drawer__sub">{IN_TRANSIT.sub}</span>
          </div>
          <button type="button" className="drawer__close" aria-label="Zamknij" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="transitTotal">
          <span className="transitTotal__label">{IN_TRANSIT.totalLabel}</span>
          <span className="transitTotal__value">{IN_TRANSIT.total}</span>
          <span className="transitTotal__sub">{IN_TRANSIT.totalSub}</span>
        </div>

        <div className="transitGroups">
          {TRANSIT_GROUPS.map((g) => (
            <section className="transitGroup" key={g.name}>
              <div className="transitGroup__head">
                <div className="transitGroup__titleBlock">
                  <span className="transitGroup__name">{g.name}</span>
                  <span className="transitGroup__sub">{g.sub}</span>
                </div>
                <span className="transitGroup__total">{g.total}</span>
              </div>

              <div className="divider" />

              <div className="transitGroup__rows">
                {g.entries.map((e, i) => (
                  <div className="transitRow" key={i}>
                    <span className="transitRow__date">{e.date}</span>
                    <span className="transitRow__title">{e.title}</span>
                    <span className="transitRow__amount">{e.amount}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="drawer__note">{IN_TRANSIT.footnote}</p>
      </aside>
    </div>
  );
}
