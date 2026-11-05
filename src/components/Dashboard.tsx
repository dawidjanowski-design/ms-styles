import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { DASHBOARD, EVENTS, OFFERS, type Event, type Offer } from '../data/dashboard';
import { VIEWS } from '../data/currencies';
import { Logo } from '../icons/Logo';
import { AllocationChart, Legend, assetColor } from './Portfolio';
import { Amount } from './ui';

type StyleId = '1' | '2' | '3' | '4' | '5' | '6' | 'makieta';
const isV3 = (s: StyleId) => s === '3' || s === '4' || s === '6';
/** Nr 6 rosnie z nr 4, wiec kropki na osi biora jego palete. */
const paletteForTimeline = (s: StyleId): '1' | '2' | '3' | '4' | '5' =>
  s === '1' || s === 'makieta' ? '1' : s === '6' ? '4' : s;

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

/** Zdarzenia pogrupowane miesiacami, z zachowaniem kolejnosci z danych. */
function byMonth(events: Event[]) {
  const groups: { key: string; label: string; items: Event[] }[] = [];
  for (const e of events) {
    const [, m, y] = e.date.split('.');
    const key = `${y}-${m}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(e);
    else groups.push({ key, label: `${MONTHS[Number(m) - 1]} ${y}`, items: [e] });
  }
  return groups;
}

/* Os czasu zamiast tabeli — nr 6. Kropka bierze kolor klasy aktywow, wiec
   zdarzenie od razu wiadomo, czego dotyczy. */
function Timeline({ styleId }: { styleId: StyleId }) {
  const palette = paletteForTimeline(styleId);
  return (
    <div className="timeline">
      {byMonth(EVENTS).map((g) => (
        <section className="timeline__group" key={g.key}>
          <h3 className="timeline__month">{g.label}</h3>
          <ol className="timeline__list">
            {g.items.map((e) => {
              const dot = assetColor(e.asset, palette);
              return (
                <li className="timeline__item" key={e.date + e.type + e.instrument}>
                  <span
                    className="timeline__dot"
                    style={{ background: dot ?? 'var(--muted)' }}
                    aria-hidden="true"
                  />
                  <span className="timeline__day">{e.date.slice(0, 5)}</span>
                  <span className="timeline__type">{e.type}</span>
                  <span className="timeline__instrument">{e.instrument}</span>
                  <span className="timeline__amount">{e.amount}</span>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

/* Strzalka 1:1 z Figmy: pole 16x16, zaokraglone konce i zlaczenia, kolor
   z currentColor, zeby kazda stylistyka trzymala swoj odcien i zeby dzialal
   hover. Obrys 1,33 px w karuzeli ofert (983:19622) i 1,5 px w glownym
   przycisku (986:21678) — w pliku te dwie ikony roznia sie gruboscia. */
function Chevron({ dir, weight = 1.33 }: { dir: 'left' | 'right'; weight?: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M10 12L6 8L10 4' : 'M6 4L10 8L6 12'}
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          <Chevron dir="left" />
        </button>
        <button type="button" className="iconBtn" aria-label="Następne oferty" onClick={() => onStep(1)}>
          <Chevron dir="right" />
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

/** Stylistyki nr 2, nr 3, nr 4 i makieta: zwykły tor z przewijaniem. */
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
                  <Chevron dir="right" weight={1.5} />
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
              cashCards={total.cashCards}
              total={total.total}
            />
          </section>

          {styleId === '1' ? <OffersLoop /> : <OffersScroll />}

          <section className="events">
            <h2 className="sectionTitle">Nadchodzące zdarzenia</h2>
            {/* Nr 6 pokazuje te same zdarzenia jako os czasu, nie tabele. */}
            {styleId === '6' ? (
              <Timeline styleId={styleId} />
            ) : (
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
