import { useRef, useState } from 'react';
import { DASHBOARD, EVENTS, OFFERS, type Offer } from '../data/dashboard';
import { VIEWS } from '../data/currencies';
import { AllocationChart, Legend } from './Portfolio';
import { Amount } from './ui';

type StyleId = '1' | '2' | '3' | '4' | 'makieta';
const isV3 = (s: StyleId) => s === '3' || s === '4';

/* Strzalka 1:1 z Figmy 983:19622: pole 16x16, obrys 1,33 px, zaokraglone
   konce i zlaczenia. Kolor z currentColor, zeby kazda stylistyka trzymala
   swoj odcien i zeby dzialal hover. */
function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M10 12L6 8L10 4' : 'M6 4L10 8L6 12'}
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  onOpenAsset,
}: {
  styleId: StyleId;
  onOpenPortfolio: () => void;
  onOpenAsset: (id: string) => void;
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
          {/* jak na Portfelu: reset dopiero po wyjsciu z calego bloku */}
          <section className="summary" onMouseLeave={() => setHot(null)}>
            <div className="dashHead">
              <div className="summary__titleBlock">
                <span className="dashHead__label">{DASHBOARD.label}</span>
                <Amount int={total.total} dec={total.decimals} />
              </div>
              <button type="button" className="btnAction" onClick={onOpenPortfolio}>
                {DASHBOARD.action}
                <span className="btnAction__chev" aria-hidden="true">
                  ›
                </span>
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
            <Legend
              rows={total.allocation}
              styleId={styleId}
              hot={hot}
              setHot={setHot}
              onOpenAsset={styleId === 'makieta' ? undefined : onOpenAsset}
              cashTooltip={styleId !== 'makieta'}
            />
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
                  <Chevron dir="left" />
                </button>
                <button
                  type="button"
                  className="iconBtn"
                  aria-label="Następne oferty"
                  onClick={() => scroll(1)}
                >
                  <Chevron dir="right" />
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
              {/* Naglowek kolumn ma tylko nr 3 — w nr 1 i nr 2 lista zdarzen
                  zostaje lista, bez ramki tabeli. */}
              {isV3(styleId) && (
                <div className="eventRow eventRow--head" aria-hidden="true">
                  <span className="eventRow__date">Data</span>
                  <span className="eventRow__type">Zdarzenie / instrument</span>
                  <span />
                  <span className="eventRow__amount">Kwota</span>
                  <span />
                </div>
              )}
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
