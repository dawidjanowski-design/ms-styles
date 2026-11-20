/* Pulpit w stylistyce nr 10 — tresc z wireframe'u PU03 (Figma 1168:27).

   Wykres glowny dzieli portfel inaczej niz ekran Portfela: nie na klasy
   aktywow, tylko na kapital pracujacy i gotowke. Dzieki temu dwa ekrany
   nie powtarzaja tej samej informacji. Uklad, paddingi i kolory sa te same
   co w nr 2 — rozni sie tylko tresc. */

import {
  PULPIT_CASH_NOTE,
  PULPIT_EVENTS,
  PULPIT_HEAD,
  PULPIT_OFFERS,
  PULPIT_ORDERS,
  PULPIT_SPLIT,
  PULPIT_TOTAL,
  type Udzial,
} from '../data/dashboardV10';
import { Amount } from './ui';
import { ChevronRight } from '../icons/Feather';

/* Inwestycje biora kolor wartosci, nie kolor klasy aktywow — pulpit mowi
   „to pracuje”, a nie „to sa obligacje”. Gotowka zostaje przy swoim
   kolorze i kreskowaniu z Portfela, zeby czytalo sie jako to samo. */
const SEG: Record<string, string> = {
  inwestycje: 'var(--value-strong)',
  cash: 'var(--c-cash)',
};

function Link({ label }: { label: string }) {
  return (
    <span className="corpLink">
      {label}
      <ChevronRight size={14} />
    </span>
  );
}

/* ------------------------------ podsumowanie ------------------------------ */

function Rzad({ u }: { u: Udzial }) {
  return (
    <div className="pulpitRow">
      <div className="pulpitRow__head">
        <span className="pulpitRow__dot" style={{ background: SEG[u.id] }} />
        <span className="pulpitRow__name">{u.name}</span>
        <span className="pulpitRow__share">{u.share}%</span>
        <span className="pulpitRow__value">{u.amount}</span>
      </div>

      {/* Waluty jedna pod druga, nie w jednej linii: kazda jest osobna
          pozycja do porownania, a nie przypis do nazwy. */}
      <dl className="pulpitParts">
        {u.parts.map((p) => (
          <div className="pulpitPart" key={p.cur}>
            <dt className="pulpitPart__cur">{p.cur}</dt>
            <dd className="pulpitPart__value">
              {p.amount}
              {p.pln && <span className="pulpitPart__pln">{p.pln}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Suma() {
  const total = PULPIT_SPLIT.reduce((s, u) => s + u.share, 0);

  return (
    <section className="summary">
      <div className="summary__top">
        <div className="summary__titleBlock">
          <span className="pulpitTotal__label">{PULPIT_TOTAL.label}</span>
          <Amount int={PULPIT_TOTAL.amount} dec={PULPIT_TOTAL.decimals} />
        </div>

        <div className="chart">
          {PULPIT_SPLIT.map((u) => (
            <div
              key={u.id}
              className={`chartSeg ${u.id === 'cash' ? 'chartSeg--cash' : ''}`}
              style={{ flex: `${u.share / total} 1 0`, ['--seg' as string]: SEG[u.id] }}
              aria-label={`${u.name}: ${u.share}%`}
            >
              <span className="chartSeg__body" />
              <span className="chartSeg__foot" />
            </div>
          ))}
        </div>
      </div>

      <div className="pulpitLegend">
        {PULPIT_SPLIT.map((u) => (
          <Rzad u={u} key={u.id} />
        ))}
      </div>

      {/* Zablokowane i w drodze nie wchodza do sumy aktywow, wiec stoja
          pod legenda, a nie jako kolejny segment wykresu. */}
      <div className="pulpitFoot">
        <p className="corpNote">{PULPIT_CASH_NOTE}</p>
        <Link label="Gotówka w portfelu" />
      </div>
    </section>
  );
}

/* --------------------------------- oferta --------------------------------- */

function Oferta() {
  return (
    <section className="corpSection">
      <div className="corpSection__head">
        <h2 className="sectionTitle">Emisje i oferta</h2>
        <Link label="Wszystkie oferty" />
      </div>

      <div className="offerGrid">
        {PULPIT_OFFERS.map((o) => (
          <article className="offerBox" key={o.id}>
            <span className="offerBox__kind">{o.kind}</span>
            <div className="offerBox__name">
              {o.name}
              <span className="offerBox__sub">{o.sub}</span>
            </div>
            <div className="offerBox__rateBlock">
              <span className="offerBox__rate">{o.rate}</span>
              <span className="offerBox__rateSub">{o.rateSub}</span>
            </div>
            <div className="divider" />
            <span className="offerBox__foot">
              {o.foot}
              <ChevronRight size={14} className="icon--muted" />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- zlecenia -------------------------------- */

function Zlecenia() {
  return (
    <section className="corpSection corpSection--card">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Bieżące zlecenia</h2>
          <p className="corpSection__sub">3 aktywne zlecenia i zapisy</p>
        </div>
        <Link label="Historia zleceń" />
      </div>

      <div className="opsTable">
        <div className="ordersRow ordersRow--head">
          <span>Status</span>
          <span>Instrument / produkt</span>
          <span>Typ</span>
          <span className="is-num">Kwota</span>
          <span className="is-num">Złożono</span>
        </div>
        {PULPIT_ORDERS.map((z) => (
          <div className="ordersRow" key={z.id}>
            <span>
              <span className="badge">{z.status}</span>
            </span>
            <span className="ordersRow__name">
              {z.name}
              <span className="ordersRow__sub">{z.sub}</span>
            </span>
            <span>{z.type}</span>
            <span className="is-num">{z.amount}</span>
            <span className="is-num">{z.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- zdarzenia ------------------------------- */

function Zdarzenia() {
  return (
    <section className="corpSection corpSection--card">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Najbliższe zdarzenia</h2>
          <p className="corpSection__sub">Najbliższy miesiąc</p>
        </div>
        <Link label="Wszystkie operacje" />
      </div>

      <div className="opsTable">
        <div className="eventsRow eventsRow--head">
          <span>Data</span>
          <span>Zdarzenie / instrument</span>
          <span className="is-num">Kwota</span>
          <span>Rachunek</span>
        </div>
        {PULPIT_EVENTS.map((e) => (
          <div className="eventsRow" key={e.id}>
            <span>{e.date}</span>
            <span className="ordersRow__name">
              {e.name}
              <span className="ordersRow__sub">{e.sub}</span>
            </span>
            <span className="is-num is-positive">{e.amount}</span>
            <span className="eventsRow__account">{e.account}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- ekran ---------------------------------- */

export function DashboardV10() {
  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <div className="corpHead">
            <div className="corpHead__text">
              <h1 className="pageTitle">{PULPIT_HEAD.greeting}</h1>
              <p className="corpHead__sub">{PULPIT_HEAD.asOf}</p>
            </div>
            <div className="corpHead__scope">
              {PULPIT_HEAD.actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className={`btn ${a.primary ? 'btn--primary' : ''}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <Suma />
          <Oferta />
          <Zlecenia />
          <Zdarzenia />
        </div>
      </div>
    </div>
  );
}
