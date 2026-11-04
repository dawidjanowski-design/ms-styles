import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { DASHBOARD, EVENTS, OFFERS, type Offer } from '../data/dashboard';
import { VIEWS } from '../data/currencies';
import { Logo } from '../icons/Logo';
import { AllocationChart, Legend } from './Portfolio';
import { Amount } from './ui';

type StyleId = '1' | '2' | '3';

function IssuerMark({ offer }: { offer: Offer }) {
  if (offer.logo === 'wordmark') return <Logo width={94} />;
  if (offer.logo) {
    return (
      <img
        className="offerCard__logo"
        src={offer.logo.src}
        width={offer.logo.width}
        height={offer.logo.height}
        alt={offer.issuer}
        draggable={false}
      />
    );
  }
  return <>{offer.issuer}</>;
}

function OfferCard({ offer, clone }: { offer: Offer; clone?: boolean }) {
  return (
    <article className="offerCard" aria-hidden={clone || undefined}>
      <div className="offerCard__top">
        <span className="offerCard__kind">{offer.kind}</span>
        <span className="offerCard__issuer">
          <IssuerMark offer={offer} />
        </span>
      </div>
      <div className="offerCard__bottom">
        <span className="offerCard__rate">{offer.rate}</span>
        <span className="offerCard__note">{offer.note}</span>
      </div>
    </article>
  );
}

function OffersHead({ onStep }: { onStep: (dir: -1 | 1) => void }) {
  return (
    <div className="offers__head">
      <h2 className="sectionTitle">Emisje i oferty</h2>
      <div className="offers__nav">
        <button type="button" className="iconBtn" aria-label="Poprzednie oferty" onClick={() => onStep(-1)}>
          ‹
        </button>
        <button type="button" className="iconBtn" aria-label="Następne oferty" onClick={() => onStep(1)}>
          ›
        </button>
      </div>
    </div>
  );
}

/** Szerokość jednej karty razem z odstępem — o tyle przesuwa się tor. */
function cardStep(track: HTMLElement) {
  const card = track.firstElementChild;
  if (!card) return track.clientWidth;
  return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
}

/** Stylistyki nr 2 i makieta: zwykły tor z przewijaniem. */
function OffersScroll() {
  const track = useRef<HTMLDivElement>(null);

  const step = (dir: -1 | 1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * cardStep(el), behavior: 'smooth' });
  };

  return (
    <section className="offers">
      <OffersHead onStep={step} />
      <div className="offers__track" ref={track}>
        {OFFERS.map((o) => (
          <OfferCard key={o.id} offer={o} />
        ))}
      </div>
    </section>
  );
}

const COPIES = 5;
const MID_COPY = Math.floor(COPIES / 2);

/** Stylistyka nr 1: karuzela w pętli. Karty renderujemy w kilku kopiach, a tor
    przesuwamy transformem o --pos kart. Po każdym ruchu po cichu wracamy do
    środkowej kopii, więc w obie strony zawsze jest dokąd jechać. Steruje się
    strzałkami, przeciąganiem (mysz i palec) i poziomym gestem na gładziku. */
function OffersLoop() {
  const n = OFFERS.length;
  const mid = n * MID_COPY;
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pos = useRef(mid);
  const drag = useRef<{ id: number; x: number; dx: number } | null>(null);

  const moveTo = (p: number) => {
    pos.current = p;
    track.current?.style.setProperty('--pos', String(p));
  };

  // ta sama karta, ale w środkowej kopii — skok bez animacji
  const recenter = () => {
    const el = track.current;
    const p = ((((pos.current - mid) % n) + n) % n) + mid;
    if (!el || p === pos.current) return;
    el.style.transition = 'none';
    moveTo(p);
    void el.offsetWidth;
    el.style.transition = '';
  };

  const step = (dir: number) => {
    const next = pos.current + dir;
    if (next < n || next > n * (COPIES - 1)) recenter();
    moveTo(pos.current + dir);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !track.current) return;
    recenter();
    drag.current = { id: e.pointerId, x: e.clientX, dx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    track.current.style.transition = 'none';
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const max = e.currentTarget.clientWidth;
    d.dx = Math.max(-max, Math.min(max, e.clientX - d.x));
    track.current?.style.setProperty('--drag', `${d.dx}px`);
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = track.current;
    if (!d || d.id !== e.pointerId || !el) return;
    drag.current = null;
    el.style.transition = '';
    el.style.setProperty('--drag', '0px');
    const cards = Math.abs(d.dx) < 30 ? 0 : Math.max(1, Math.round(Math.abs(d.dx) / cardStep(el)));
    moveTo(pos.current - Math.sign(d.dx) * cards);
  };

  // Poziomy gest na gładziku: jeden gest (razem z bezwładnością) = jedna karta.
  useEffect(() => {
    const el = view.current;
    if (!el) return;
    let last = 0;
    let acc = 0;
    let fired = false;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (e.timeStamp - last > 200) {
        acc = 0;
        fired = false;
      }
      last = e.timeStamp;
      if (fired) return;
      acc += e.deltaX;
      if (Math.abs(acc) > 30) {
        fired = true;
        step(Math.sign(acc));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section className="offers">
      <OffersHead onStep={step} />
      <div
        className="offers__viewport"
        ref={view}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="offers__track"
          ref={track}
          style={{ ['--pos' as string]: mid }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === 'transform') recenter();
          }}
        >
          {Array.from({ length: COPIES }, (_, c) =>
            OFFERS.map((o) => <OfferCard key={`${c}-${o.id}`} offer={o} clone={c !== MID_COPY} />),
          )}
        </div>
      </div>
    </section>
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
              onOpenAsset={styleId === '3' ? undefined : onOpenAsset}
            />
          </section>

          {styleId === '1' ? <OffersLoop /> : <OffersScroll />}

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
