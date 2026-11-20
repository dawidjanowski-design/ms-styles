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
import { META } from './Portfolio';
import { ChevronRight } from '../icons/Feather';
import { CASH, V10_ALLOCATION } from '../data/portfolio';

/* Kolory sa te same co w nr 2 — pulpit nie ma wlasnej palety. Rozni sie
   tylko podzialem: klasy aktywow stoja zbite w jeden blok „Inwestycje”,
   a gotowka odsuwa sie od nich na bok. Portfel pokazuje z czego sklada
   sie portfel, pulpit — ile pracuje, a ile lezy. */
const barwa = (id: string) => META[id].colors['2'];

const KLASY = V10_ALLOCATION.filter((r) => r.id !== CASH.id);
const GOTOWKA = V10_ALLOCATION.find((r) => r.id === CASH.id)!;

function Link({ label }: { label: string }) {
  return (
    <span className="corpLink">
      {label}
      <ChevronRight size={14} />
    </span>
  );
}

/* ------------------------------ podsumowanie ------------------------------ */

function Rzad({ u, klucz }: { u: Udzial; klucz: string[] }) {
  return (
    <div className="pulpitRow">
      <div className="pulpitRow__head">
        {/* Znacznik rzedu niesie kolory tej czesci wykresu, ktorej dotyczy —
            przy inwestycjach jest ich kilka, bo to kilka klas aktywow. */}
        <span className="pulpitRow__key">
          {klucz.map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </span>
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

function Segment({ id, share }: { id: string; share: number }) {
  const c = barwa(id);
  return (
    <div
      className={`chartSeg ${id === CASH.id ? 'chartSeg--cash' : ''}`}
      style={{
        flex: `${share} 1 0`,
        ['--seg' as string]: c.chart,
        ['--seg-foot' as string]: c.chartFoot ?? c.chart,
      }}
      aria-label={`${META[id].name}: ${share}%`}
    >
      <span className="chartSeg__body" />
      <span className="chartSeg__foot" />
    </div>
  );
}

function Suma() {
  const klucze: Record<string, string[]> = {
    inwestycje: KLASY.map((r) => barwa(r.id).legend),
    cash: [barwa(CASH.id).legend],
  };

  return (
    <section className="summary">
      <div className="summary__top">
        <div className="summary__titleBlock">
          <h1 className="pageTitle">{PULPIT_TOTAL.label}</h1>
          <Amount int={PULPIT_TOTAL.amount} dec={PULPIT_TOTAL.decimals} />
        </div>

        {/* Dwa bloki zamiast jednego ciagu: klasy aktywow zbite razem,
            gotowka odsunieta. Przerwa miedzy nimi jest tym, co odroznia
            pulpit od Portfela — kolory zostaja te same. */}
        <div className="pulpitChart">
          <div className="chart" style={{ flexGrow: PULPIT_SPLIT[0].share }}>
            {KLASY.map((r) => (
              <Segment id={r.id} share={r.share} key={r.id} />
            ))}
          </div>
          <div className="chart" style={{ flexGrow: PULPIT_SPLIT[1].share }}>
            <Segment id={GOTOWKA.id} share={GOTOWKA.share} />
          </div>
        </div>
      </div>

      <div className="pulpitLegend">
        {PULPIT_SPLIT.map((u) => (
          <Rzad u={u} klucz={klucze[u.id]} key={u.id} />
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
        <h2 className="sectionTitle">Bieżące zlecenia</h2>
        <Link label="Historia zleceń" />
      </div>

      {/* W waskiej kolumnie tabela na piec kolumn by sie poslepiala, wiec
          zlecenie czyta sie wierszami: co i za ile, potem stan i kiedy. */}
      <div className="ordTable">
        {PULPIT_ORDERS.map((z) => (
          <article className="ordRow" key={z.id}>
            <div className="ordRow__top">
              <span className="ordRow__name">{z.name}</span>
              <span className="ordRow__amount">{z.amount}</span>
            </div>
            <p className="ordRow__sub">{z.sub}</p>
            <div className="ordRow__meta">
              <span className="badge">{z.status}</span>
              <span className="ordRow__type">{z.type}</span>
              <span className="ordRow__date">{z.date}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- zdarzenia ------------------------------- */

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

/** 1 zdarzenie / 2-4 zdarzenia / 5+ zdarzen. */
function licznik(n: number) {
  const d = n % 10;
  const s = n % 100;
  if (n === 1) return '1 zdarzenie';
  if (d >= 2 && d <= 4 && (s < 12 || s > 14)) return `${n} zdarzenia`;
  return `${n} zdarzeń`;
}

function wgMiesiecy() {
  const grupy: { key: string; label: string; items: typeof PULPIT_EVENTS }[] = [];
  for (const e of PULPIT_EVENTS) {
    const [, m, y] = e.date.split('.');
    const key = `${y}-${m}`;
    const last = grupy[grupy.length - 1];
    if (last && last.key === key) last.items.push(e);
    else grupy.push({ key, label: `${MIESIACE[Number(m) - 1]} ${y}`, items: [e] });
  }
  return grupy;
}

/* Zdarzenia w ukladzie z nr 8: jedna karta na miesiac, licznik w naglowku,
   dzien zamiast pelnej daty — w kolumnie obok zlecen pelne daty byly
   powtarzaniem tego samego miesiaca w kazdym wierszu. */
function Zdarzenia() {
  return (
    <section className="corpSection">
      <div className="corpSection__head">
        <h2 className="sectionTitle">Najbliższe zdarzenia</h2>
        <Link label="Wszystkie operacje" />
      </div>

      <div className="evMonths">
        {wgMiesiecy().map((g) => (
          <section className="evMonths__card" key={g.key}>
            <header className="evMonths__head">
              <h3 className="evMonths__title">{g.label}</h3>
              <span className="evMonths__count">{licznik(g.items.length)}</span>
            </header>
            {g.items.map((e) => (
              <div className="evMonths__row" key={e.id}>
                <span className="evMonths__day">{e.date.slice(0, 2)}</span>
                <span className="evMonths__what">
                  <span className="evMonths__type">{e.name}</span>
                  <span className="evMonths__instrument">{e.sub}</span>
                </span>
                <span className="evMonths__amount">
                  {e.amount}
                  <span className="evMonths__account">{e.account}</span>
                </span>
              </div>
            ))}
          </section>
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
              <h1 className="pulpitGreeting">{PULPIT_HEAD.greeting}</h1>
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
          {/* Zlecenia i zdarzenia odpowiadaja na to samo pytanie — co sie
              dzieje z moimi pieniedzmi — wiec stoja obok siebie: po lewej
              to, co sam zlecilem, po prawej to, co przyjdzie samo. */}
          <section className="pulpitSplit">
            <Zlecenia />
            <Zdarzenia />
          </section>
        </div>
      </div>
    </div>
  );
}
