/* Karta emitenta w stylistyce nr 10 — tresc z wireframe'u 1121:4248.
   Wchodzi sie w nia z tabeli struktury na ekranie obligacji korporacyjnych.
   Uklad i klasy z CorpBondsV10: ta sama karta podsumowania, te same sekcje
   i tabele — zmienia sie tylko zakres danych (jeden emitent). */

import { useRef, useState } from 'react';
import {
  CORP_CLOSED,
  CORP_ISSUERS,
  CORP_OPS,
  CORP_OPS_OLDER,
  CORP_SERIES,
  CORP_SERIES_DETAIL,
  type Metric,
  type Serie,
} from '../data/corpV10';
import { emitent, kwota, odmiana, procent } from '../data/corpMath';
import { Amount } from './ui';
import { ChevronDown, ChevronRight, ChevronUp, Download } from '../icons/Feather';

const RACHUNKI: [string, string, string] = ['rachunek', 'rachunki', 'rachunków'];
const SERIE: [string, string, string] = ['seria', 'serie', 'serii'];

function Select({ label }: { label: string }) {
  return (
    <button type="button" className="selectBtn">
      {label}
      <ChevronDown size={14} className="icon--muted" />
    </button>
  );
}

const poDacie = (x: string) => x.split('.').reverse().join('');

/* ------------------------------ serie w portfelu ------------------------------ */

function SeriesTable({
  serie,
  onOpenSeries,
}: {
  serie: Serie[];
  onOpenSeries: (id: string) => void;
}) {
  const e = emitent(serie[0]?.issuer ?? '');
  /* Seria na kilku rachunkach startuje rozwinieta — rozbicie to glowna
     informacja, ktorej nie ma na ekranie klasy. */
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(serie.map((s) => [s.id, (s.accounts?.length ?? 0) > 1]))
  );
  const wiersze = [...serie].sort((a, b) => poDacie(a.maturity).localeCompare(poDacie(b.maturity)));

  return (
    <section className="corpSection">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Serie w portfelu</h2>
        </div>
        <Select label="Wykup rosnąco" />
      </div>
      <div className="corpCard corpShell">
        <div className="corpShell__inner">
        <div className="issTable">
          <div className="issRow issRow--head">
            <span>Seria</span>
            <span className="is-num">Sztuk</span>
            <span className="is-num">Oprocentowanie</span>
            <span className="is-num">Wykup</span>
            <span className="is-num">Wartość pozycji</span>
            <span className="is-num">Rachunki</span>
          </div>

          {wiersze.map((s) => {
            const konta = s.accounts ?? [];
            const wiele = konta.length > 1;
            const rozwiniete = wiele && open[s.id];
            return (
              <div className="issGroup" key={s.id}>
                <div className="issRow">
                  <span className="issRow__name">
                    {CORP_SERIES_DETAIL[s.id] ? (
                      <button type="button" className="issRow__link" onClick={() => onOpenSeries(s.id)}>
                        {s.ticker} · {s.name}
                      </button>
                    ) : (
                      `${s.ticker} · ${s.name}`
                    )}
                    {s.base && <span className="issRow__sub">{s.base}</span>}
                  </span>
                  <span className="is-num">{s.count}</span>
                  <span className="is-num">{procent(s.coupon)}</span>
                  <span className="is-num">{s.maturity}</span>
                  <span className="is-num">{kwota(s.value, 'PLN')}</span>
                  {wiele ? (
                    <button
                      type="button"
                      className="issRow__toggle"
                      aria-expanded={rozwiniete}
                      onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}
                    >
                      {odmiana(konta.length, RACHUNKI)}
                      {rozwiniete ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  ) : (
                    <span className="is-num issRow__muted">{konta[0]?.account ?? '—'}</span>
                  )}
                </div>

                {rozwiniete &&
                  konta.map((k) => (
                    <div className="issRow issRow--account" key={k.account}>
                      <span className="issRow__muted">{k.account}</span>
                      <span className="is-num">{k.count}</span>
                      <span />
                      <span />
                      <span className="is-num">{kwota(k.value, 'PLN')}</span>
                      <span />
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
        </div>
        <div className="corpShell__foot">
        <div className="issTable">
          <div className="issRow issRow--total">
            <span>Razem · {odmiana(serie.length, SERIE)}</span>
            <span className="is-num">{e.sztuk}</span>
            <span className="is-num">{procent(e.coupon)}</span>
            <span className="is-num">{e.najblizszyWykup}</span>
            <span className="is-num">{kwota(e.value, 'PLN')}</span>
            <span className="is-num">{odmiana(e.rachunki, RACHUNKI)}</span>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- ekran ---------------------------------- */

export function IssuerV10({
  issuer,
  onBack,
  onOpenAsset,
  onOpenSeries,
}: {
  issuer: string;
  onBack: () => void;
  onOpenAsset: () => void;
  onOpenSeries: (id: string) => void;
}) {
  const e = emitent(issuer);
  const info = CORP_ISSUERS[issuer];
  const zamkniete = CORP_CLOSED.filter((r) => r.issuer === issuer);
  const idSerii = new Set(CORP_SERIES.filter((s) => s.issuer === issuer).map((s) => s.id));
  const operacje = [...CORP_OPS, ...CORP_OPS_OLDER].filter(
    (o) => o.seriesId && idSerii.has(o.seriesId)
  );
  const zamknieteRef = useRef<HTMLElement>(null);
  const [calosc, dec] = kwota(e.value, 'PLN').split(',');

  /* Ten sam uklad 4 + 4 co podsumowanie obligacji korporacyjnych. */
  const wynikowe: Metric[] = [
    { label: 'Śr. rentowność (ważona)', value: procent(e.rate), sub: 'do wykupu, w skali roku' },
    { label: 'Wypłacone odsetki 12M', value: kwota(e.odsetki, 'PLN'), sub: 'ostatnie 12 miesięcy' },
    { label: 'Stopa zwrotu 12M', value: procent(e.stopa), sub: 'IRR, w skali roku' },
    {
      label: 'Wynik 12M',
      value: `+${kwota(e.wynik, 'PLN')}`,
      sub: 'nominalnie, po prowizjach',
      positive: e.wynik > 0,
    },
  ];
  const warunki: Metric[] = [
    { label: 'Wartość nominalna', value: kwota(e.nominal, 'PLN') },
    { label: 'Śr. oprocentowanie (ważone)', value: procent(e.coupon) },
    { label: 'Najbliższa wypłata odsetek', value: e.najblizszeOdsetki },
    { label: 'Najbliższy wykup', value: e.najblizszyWykup },
  ];

  const kafelek = (m: Metric) => (
    <div className="resultStat" key={m.label}>
      <span className="resultStat__label">{m.label}</span>
      <span className={`resultStat__value ${m.positive ? 'resultStat__value--pos' : ''}`}>
        {m.value}
      </span>
      {m.sub && <span className="resultStat__sub">{m.sub}</span>}
    </div>
  );

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <nav className="crumbs" aria-label="Ścieżka nawigacji">
            <button type="button" className="crumbs__link" onClick={onBack}>
              Portfel
            </button>
            <ChevronRight size={13} className="crumbs__sep" />
            <button type="button" className="crumbs__link" onClick={onBack}>
              Aktywa
            </button>
            <ChevronRight size={13} className="crumbs__sep" />
            <button type="button" className="crumbs__link" onClick={onOpenAsset}>
              Obligacje korporacyjne
            </button>
            <ChevronRight size={13} className="crumbs__sep" />
            <span className="crumbs__current">{issuer}</span>
          </nav>

          <div className="corpHead">
            <div className="corpHead__text">
              <h1 className="corpHead__title">{issuer}</h1>
              <p className="corpHead__sub">
                {odmiana(e.serie.length, SERIE)} · {odmiana(e.rachunki, RACHUNKI)}
                {info && ` · ${info.sector}`}
              </p>
            </div>
            <div className="corpHead__scope">
              <Select label="Wszystkie rachunki" />
            </div>
          </div>

          <section className="resultCard">
            <div className="resultCard__lead">
              <span className="resultCard__caption">Wartość bieżąca</span>
              <div className="resultCard__amountRow">
                <Amount int={calosc} dec={`,${dec}`} className="resultCard__amount" />
                {e.stopa > 0 && (
                  <span className="resultCard__rate">+{procent(e.stopa)}</span>
                )}
              </div>
              <span className="resultCard__note resultCard__note--left">
                {e.udzial.toFixed(1).replace('.', ',')}% obligacji korporacyjnych
              </span>
            </div>

            <div className="divider" />
            <div className="resultCard__stats">{wynikowe.map(kafelek)}</div>
            <div className="resultCard__stats">{warunki.map(kafelek)}</div>

            <div className="divider" />
            <div className="corpCounters">
              <span className="corpCounter">
                Serie<strong>{e.serie.length}</strong>
              </span>
              <span className="corpCounter">
                Sztuk<strong>{e.sztuk}</strong>
              </span>
              <span className="corpCounter">
                Rachunki<strong>{e.rachunki}</strong>
              </span>
              {zamkniete.length > 0 && (
                <button
                  type="button"
                  className="corpLink issHead__closed"
                  onClick={() =>
                    zamknieteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  Zamknięte pozycje u tego emitenta: {zamkniete.length}
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </section>

          <SeriesTable serie={e.serie} onOpenSeries={onOpenSeries} />

          {zamkniete.length > 0 && (
            <section className="corpSection" ref={zamknieteRef}>
              <div className="corpSection__head">
                <div className="corpSection__text">
                  <h2 className="sectionTitle">Zamknięte pozycje u tego emitenta</h2>
                </div>
                <Select label="Od początku" />
              </div>
              <div className="corpCard corpShell">
                <div className="corpShell__inner">
                <div className="closedTable">
                  <div className="closedRow closedRow--issuer closedRow--head">
                    <span>Seria</span>
                    <span className="is-num">Okres inwestycji</span>
                    <span className="is-num">Zainwestowano</span>
                    <span className="is-num">Otrzymano</span>
                    <span className="is-num">Wynik</span>
                    <span className="is-num">Stopa zwrotu</span>
                  </div>
                  {zamkniete.map((r) => (
                    <div className="closedRow closedRow--issuer" key={r.id}>
                      <span className="closedRow__name">
                        {r.short}
                        <span className="closedRow__sub">{r.tx}</span>
                      </span>
                      <span className="closedRow__name is-num">
                        {r.period}
                        <span className="closedRow__sub">{r.periodSub}</span>
                      </span>
                      <span className="is-num">{r.invested}</span>
                      <span className="is-num">{r.received}</span>
                      <span className="is-num is-positive">{r.result}</span>
                      <span className="is-num">{r.irr}</span>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </section>
          )}

          <section className="corpSection">
            <div className="corpSection__head">
              <div className="corpSection__text">
                <h2 className="sectionTitle">Operacje</h2>
                <p className="corpSection__sub">Zawężone do serii tego emitenta</p>
              </div>
              <div className="corpSection__actions">
                <Select label="Od początku" />
                <button type="button" className="btn">
                  <Download size={14} />
                  Eksport XLS
                </button>
              </div>
            </div>
            <div className="corpCard corpShell">
              <div className="corpShell__inner">
              <div className="opsTable">
                <div className="opsRow opsRow--head">
                  <span>Data</span>
                  <span>Typ operacji</span>
                  <span>Instrument</span>
                  <span className="is-num">Kwota</span>
                  <span className="is-num">Status</span>
                </div>
                {operacje.map((o) => {
                  const s = CORP_SERIES.find((x) => x.id === o.seriesId);
                  return (
                    <div className="opsRow" key={o.id}>
                      <span>{o.date}</span>
                      <span>{o.type}</span>
                      <span className="opsRow__name">
                        {s ? `${s.ticker} · ${s.name}` : o.instrument}
                        <span className="opsRow__sub">{o.account}</span>
                      </span>
                      <span className={`is-num ${o.negative ? '' : 'is-positive'}`}>{o.amount}</span>
                      <span className="is-num opsRow__status">{o.status}</span>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
