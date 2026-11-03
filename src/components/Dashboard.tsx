import { useRef, useState } from 'react';
import { DASHBOARD, EVENTS, OFFERS, type Offer } from '../data/dashboard';
import { VIEWS } from '../data/currencies';
import { AllocationChart, Legend } from './Portfolio';
import { Amount } from './ui';

type StyleId = '1' | '2';

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article className="offerCard">
      <div className="offerCard__top">
        <span className="offerCard__kind">{offer.kind}</span>
        <span className="offerCard__issuer">
          {offer.logo ? (
            <img
              className="offerCard__logo"
              src={offer.logo.src}
              width={offer.logo.width}
              height={offer.logo.height}
              alt={offer.issuer}
            />
          ) : (
            offer.issuer
          )}
        </span>
      </div>
      <div className="offerCard__bottom">
        <span className="offerCard__rate">{offer.rate}</span>
        <span className="offerCard__note">{offer.note}</span>
      </div>
    </article>
  );
}

export function DashboardScreen({
  styleId,
  onOpenPortfolio,
}: {
  styleId: StyleId;
  onOpenPortfolio: () => void;
}) {
  const [hot, setHot] = useState<string | null>(null);
  /* Pulpit pokazuje zawsze widok „Łącznie" — przelacznik walut jest w Portfelu. */
  const total = VIEWS['Łącznie'];
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <section className="summary">
            <div className="dashHead">
              <div className="summary__titleBlock">
                <span className="dashHead__label">{DASHBOARD.label}</span>
                <Amount int={total.total} dec={total.decimals} />
              </div>
              <button type="button" className="btnGhost btnGhost--lg" onClick={onOpenPortfolio}>
                {DASHBOARD.action}
                <span aria-hidden="true">›</span>
              </button>
            </div>
            <div className="dashChart">
              <AllocationChart
                rows={total.allocation}
                styleId={styleId}
                hot={hot}
                setHot={setHot}
              />
            </div>
            <Legend rows={total.allocation} styleId={styleId} hot={hot} setHot={setHot} />
          </section>

          <section className="offers">
            <div className="offers__head">
              <h2 className="sectionTitle">Emisje i oferty</h2>
              <div className="offers__nav">
                <button
                  type="button"
                  className="iconBtn"
                  aria-label="Poprzednie oferty"
                  onClick={() => scroll(-1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="iconBtn"
                  aria-label="Następne oferty"
                  onClick={() => scroll(1)}
                >
                  ›
                </button>
              </div>
            </div>
            <div className="offers__track" ref={track}>
              {OFFERS.map((o) => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          </section>

          <section className="events">
            <h2 className="sectionTitle">Nadchodzące zdarzenia</h2>
            <div className="eventsCard">
              {EVENTS.map((e, i) => (
                <button type="button" className="eventRow" key={i}>
                  <span className="eventRow__date">{e.date}</span>
                  <span className="eventRow__type">{e.type}</span>
                  <span className="eventRow__instrument">{e.instrument}</span>
                  <span className="eventRow__amount">{e.amount}</span>
                  <span className="eventRow__chev" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
