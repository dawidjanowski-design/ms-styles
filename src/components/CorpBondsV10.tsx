/* Obligacje korporacyjne w stylistyce nr 10 — wireframe B01 (Figma 1121:2941).
   Osobny komponent, a nie rozgalezienia w AssetDetail: ten ekran ma inny
   uklad sekcji i wlasne dane, wiec mieszanie go z poprzednia wersja
   zrobiloby z obu nieczytelna plataninke. */

import { useState, type ReactNode } from 'react';
import {
  CORP_CLOSED,
  CORP_CLOSED_NOTE,
  CORP_CLOSED_TOTAL,
  CORP_FLOWS,
  CORP_FLOWS_FILTERS,
  CORP_FLOWS_NOTE,
  CORP_HEAD,
  CORP_OPS,
  CORP_OPS_FILTERS,
  CORP_OPS_FOOT,
  CORP_STRUCTURE_NOTE,
  CORP_STRUCTURE_SUB,
  CORP_WIDGETS,
  type Metric,
  type Widget,
} from '../data/corpV10';
import {
  jednostka,
  kwota,
  podsumowanie,
  procent,
  wiersze,
  type Wiersz,
} from '../data/corpMath';
import { CURRENCIES, type Currency } from '../data/currencies';
import { Amount, Pills } from './ui';
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Maximize2,
  MoreHorizontal,
  SortNone,
} from '../icons/Feather';

/* Kolor klasy z palety nr 2 — ten sam, co na wykresie portfela. Odsetki
   to jego rozcienczona wersja, a nie szarosc: oba slupki mowia o tej samej
   klasie, roznia sie rodzajem przeplywu. */
const SEG = 'var(--c-corp)';
const SEG_SOFT = 'var(--c-corp-soft)';

/* Jeden wykres, slupki jeden na drugim: odsetki u dolu, wykup nad nimi.
   Odsetki sa o dwa rzedy wielkosci mniejsze od wykupow, wiec dostaja
   minimalna wysokosc — inaczej w miesiacu bez wykupu nie byloby czego
   ogladac. Dokladne kwoty czyta dymek. */
const OS_MAX = 900000;
const MIN_ODS = 9;

function Select({ label }: { label: string }) {
  return (
    <button type="button" className="selectBtn">
      {label}
      <ChevronDown size={14} className="icon--muted" />
    </button>
  );
}

/* ------------------------------ podsumowanie ------------------------------ */

/* Ten sam uklad, co karta „Wynik portfela" na portfelu: liczba wiodaca
   z pigulka i odnosnikiem u gory, pod kreska rowne kafelki metryk, na
   koncu przypis. Jeden wzorzec na oba ekrany. */
function Summary({ currency }: { currency: Currency }) {
  const p = podsumowanie(currency);
  const j = jednostka(currency);
  const [calosc, dec] = kwota(p.value, currency).split(',');

  /* Wszystkie kafelki sa jednakowe — ta sama ramka, ten sam stopien,
     ta sama budowa etykieta/wartosc. Rozni je wylacznie tresc. */
  const stats: Metric[] = [
    { label: 'Śr. rentowność (ważona)', value: procent(p.rate) },
    { label: 'Wypłacone odsetki 12M', value: kwota(p.odsetki, currency) },
    { label: 'Wynik 12M', value: `+${kwota(p.wynik, currency)}` },
    { label: 'Wartość nominalna', value: kwota(p.nominal, currency) },
    { label: 'Śr. oprocentowanie (ważone)', value: procent(p.coupon) },
    { label: 'Śr. odsetki miesięczne', value: kwota(p.odsetkiMiesiecznie, currency) },
  ];

  return (
    <section className="resultCard">
      <div className="resultCard__top">
        <div className="resultCard__lead">
          <span className="resultCard__caption">Wartość bieżąca</span>
          <div className="resultCard__amountRow">
            <Amount int={calosc} dec={`,${dec}`} className="resultCard__amount" />
            <span className="resultCard__rate">
              Stopa zwrotu 12M: <strong>{procent(p.stopa)}</strong>
            </span>
          </div>
        </div>
        <span className="resultCard__link">
          Pogłębiona analiza wyniku
          <ChevronRight size={14} />
        </span>
      </div>

      <div className="divider" />

      <div className="resultCard__stats resultCard__stats--3">
        {stats.map((m) => (
          <div className="resultStat" key={m.label}>
            <span className="resultStat__label">{m.label}</span>
            <span className="resultStat__value">{m.value}</span>
          </div>
        ))}
      </div>

      <span className="resultCard__note">
        {currency === 'Łącznie'
          ? '42,5% wartości całego portfela · wycena z 30.10.2026'
          : `wszystkie pozycje w ${j} · wycena z 30.10.2026`}
      </span>
    </section>
  );
}

/* --------------------------- struktura portfela --------------------------- */

type Sort = { col: string; dir: 1 | -1 };

function Structure({ currency }: { currency: Currency }) {
  const [grouping, setGrouping] = useState('Emitenci');
  /* Udzial malejaco to domyslny porzadek: najpierw to, co wazy najwiecej. */
  const [sort, setSort] = useState<Sort>({ col: 'share', dir: -1 });
  /* Kolumna wartosci ma dwie metryki — biezaca i nominalna. */
  const [metric, setMetric] = useState<'value' | 'nominal'>('value');
  const [menu, setMenu] = useState(false);

  const p = podsumowanie(currency);
  const rows = wiersze(currency, grouping);
  const suma = rows.reduce((a, r) => a + r[metric], 0);

  /* Klikniecie w ta sama kolumne odwraca kierunek, w inna — ustawia ja
     malejaco, bo przy liczbach to prawie zawsze oczekiwany pierwszy rzut. */
  const sortuj = (col: string) =>
    setSort((s) => (s.col === col ? { col, dir: s.dir === 1 ? -1 : 1 } : { col, dir: -1 }));

  const klucz = (r: Wiersz): string | number => {
    if (sort.col === 'name') return r.title.toLowerCase();
    if (sort.col === 'count') return r.countNum;
    if (sort.col === 'rate') return r.rate;
    if (sort.col === 'maturity') return r.maturity.split('.').reverse().join('');
    return r[metric];
  };
  const widoczne = [...rows].sort((a, b) => {
    const x = klucz(a);
    const y = klucz(b);
    if (x === y) return 0;
    return (x > y ? 1 : -1) * sort.dir;
  });

  const etykietaWartosci = metric === 'value' ? 'Wartość bieżąca' : 'Wartość nominalna';

  const komorki = (r: Wiersz, total?: boolean) => (
    <div className={`corpRow ${total ? 'corpRow--total' : ''}`} key={r.id}>
      <span className="corpRow__issuer">
        {r.title}
        {r.sub && <span className="corpRow__expand">{r.sub}</span>}
        {!total && !r.sub && (
          <span className="corpRow__expand">
            rozwiń serie
            <ChevronDown size={12} />
          </span>
        )}
      </span>
      <span className="corpRow__cell">{r.count}</span>
      <span className="corpRow__cell corpRow__cell--num">{procent(r.rate)}</span>
      <span className="corpRow__cell corpRow__cell--num">{r.maturity}</span>
      <span className="corpRow__cell corpRow__cell--num">
        {r.curValue ? `≈ ${kwota(r[metric], currency)}` : kwota(r[metric], currency)}
        {r.curValue && <span className="corpRow__sub">{r.curValue}</span>}
      </span>
      <span className="corpRow__share">
        <span className="corpRow__shareValue">
          {suma ? procent((r[metric] / suma) * 100) : '—'}
        </span>
        {!total && (
          <span className="corpShare">
            <span
              className="corpShare__fill"
              style={{ width: `${suma ? (r[metric] / suma) * 100 : 0}%` }}
            />
          </span>
        )}
      </span>
    </div>
  );

  const naglowek = (
    key: string,
    label: string,
    opts: { num?: boolean; sort?: boolean; menu?: boolean } = {}
  ) => {
    const aktywna = sort.col === key;
    return (
      <span
        key={key}
        className={`corpRow__cell ${key === 'name' ? 'corpRow__issuer' : ''} ${
          opts.num ? 'corpRow__cell--num' : ''
        } ${aktywna && opts.sort ? 'is-active' : ''}`}
      >
        {opts.sort ? (
          <button type="button" className="corpSortBtn" onClick={() => sortuj(key)}>
            {label}
            {aktywna ? (
              sort.dir === -1 ? (
                <ChevronDown size={14} className="corpRow__sort is-on" />
              ) : (
                <ChevronUp size={14} className="corpRow__sort is-on" />
              )
            ) : (
              <SortNone size={14} className="corpRow__sort" />
            )}
          </button>
        ) : (
          label
        )}
        {opts.menu && (
          <span className="corpMenu">
            <button
              type="button"
              className="corpMenu__btn"
              aria-label="Dodatkowe akcje kolumny"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
            >
              <MoreHorizontal size={16} className="corpRow__menu" />
            </button>
            {menu && (
              <div className="corpMenu__panel">
                {(['value', 'nominal'] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    className={`corpMenu__item ${metric === m ? 'is-on' : ''}`}
                    onClick={() => {
                      setMetric(m);
                      setMenu(false);
                    }}
                  >
                    {m === 'value' ? 'Pokaż wartość bieżącą' : 'Pokaż wartość nominalną'}
                    {metric === m && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </span>
        )}
      </span>
    );
  };

  return (
    <section className="corpSection corpSection--card">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Struktura portfela</h2>
          <p className="corpSection__sub">
            {p.emitenci} {p.emitenci === 1 ? 'emitent' : 'emitentów'} · {p.serie}{' '}
            {p.serie === 1 ? 'seria' : 'serii'} · {p.sztuk.toLocaleString('pl')} szt. ·{' '}
            {CORP_STRUCTURE_SUB.toLowerCase()}
          </p>
        </div>
        <div className="corpSection__actions">
          <Pills items={['Emitenci', 'Serie']} value={grouping} onChange={setGrouping} />
          <button type="button" className="btn">
            <Maximize2 size={14} />
            Pełna tabela
          </button>
        </div>
      </div>

      {p.pusto ? (
        <p className="corpEmpty">
          Nie masz obligacji korporacyjnych rozliczanych w {jednostka(currency)}.
        </p>
      ) : (
        <>
          <div className="corpTable">
            <div className="corpRow corpRow--head">
              {naglowek('name', grouping === 'Serie' ? 'Seria' : 'Emitent', { sort: true })}
              {naglowek('count', grouping === 'Serie' ? 'Sztuk' : 'Serie', { sort: true })}
              {naglowek('rate', grouping === 'Serie' ? 'Rentowność' : 'Śr. rentowność', {
                num: true,
                sort: true,
              })}
              {naglowek('maturity', grouping === 'Serie' ? 'Wykup' : 'Najbliższy wykup', {
                num: true,
                sort: true,
              })}
              {naglowek('value', etykietaWartosci, { num: true, menu: true })}
              {naglowek('share', 'Udział', { num: true, sort: true })}
            </div>

            {widoczne.map((r) => komorki(r))}

            {komorki(
              {
                id: 'razem',
                title: `Razem · ${p.emitenci} ${p.emitenci === 1 ? 'emitent' : 'emitentów'}`,
                sub: grouping === 'Serie' ? `${p.serie} serii` : undefined,
                count: grouping === 'Serie' ? String(p.sztuk) : `${p.serie} serii`,
                countNum: p.serie,
                rate: p.rate,
                maturity: p.najblizszyWykup,
                value: p.value,
                nominal: p.nominal,
              },
              true
            )}
          </div>

          <p className="corpNote">{CORP_STRUCTURE_NOTE}</p>
        </>
      )}
    </section>
  );
}

/* ----------------------------- wykresy ----------------------------- */

/* Dymek siedzi w kontenerze wykresu i jezdzi za aktywnym slupkiem, zamiast
   podazac za kursorem: przy waskich slupkach trzesie sie duzo mniej, a
   czytelnik i tak patrzy na slupek, nie na kursor. */
function Tooltip({ at, children }: { at: number; children: ReactNode }) {
  return (
    <div
      className="chartTip"
      style={{ left: `${at}%` }}
      role="status"
    >
      {children}
    </div>
  );
}

function InterestChart({ bars }: { bars: NonNullable<Widget['bars']> }) {
  const [hot, setHot] = useState<number | null>(null);
  const max = Math.max(...bars.map((b) => b.value));

  return (
    <div className="corpSpark" onMouseLeave={() => setHot(null)}>
      {hot !== null && (
        <Tooltip at={((hot + 0.5) / bars.length) * 100}>
          <span className="chartTip__title">{bars[hot].label}</span>
          <span className="chartTip__row">
            Wypłacone odsetki<strong>{bars[hot].text}</strong>
          </span>
        </Tooltip>
      )}
      <div className="corpSpark__bars">
        {bars.map((b, i) => (
          <button
            type="button"
            key={b.label}
            className={`corpSpark__slot ${hot === i ? 'is-hot' : ''}`}
            onMouseEnter={() => setHot(i)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
            aria-label={`${b.label}: ${b.text}`}
          >
            <span
              className="corpSpark__bar"
              style={{ height: `${Math.max(8, (b.value / max) * 100)}%` }}
            />
          </button>
        ))}
      </div>
      <div className="corpSpark__axis">
        <span>{bars[0].label}</span>
        <span>{bars[bars.length - 1].label}</span>
      </div>
    </div>
  );
}

const zl = (v: number) =>
  `${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')},00 PLN`;

function FlowsChart() {
  const [hot, setHot] = useState<number | null>(null);

  return (
    <div className="corpFlows" onMouseLeave={() => setHot(null)}>
      {hot !== null && (
        <Tooltip at={((hot + 0.5) / CORP_FLOWS.length) * 100}>
          <span className="chartTip__title">{CORP_FLOWS[hot].full}</span>
          {CORP_FLOWS[hot].nominal > 0 && (
            <span className="chartTip__row">
              <span className="chartTip__dot" style={{ background: SEG }} />
              Wartość nominalna<strong>{zl(CORP_FLOWS[hot].nominal)}</strong>
            </span>
          )}
          <span className="chartTip__row">
            <span className="chartTip__dot" style={{ background: SEG_SOFT }} />
            Odsetki<strong>{zl(CORP_FLOWS[hot].interest)}</strong>
          </span>
          {CORP_FLOWS[hot].note && (
            <span className="chartTip__note">{CORP_FLOWS[hot].note}</span>
          )}
        </Tooltip>
      )}

      {CORP_FLOWS.map((m, i) => (
        <button
          type="button"
          className={`corpFlow ${hot === i ? 'is-hot' : ''}`}
          key={m.label}
          onMouseEnter={() => setHot(i)}
          onFocus={() => setHot(i)}
          onBlur={() => setHot(null)}
          aria-label={`${m.full}: nominał ${zl(m.nominal)}, odsetki ${zl(m.interest)}`}
        >
          <span className="corpFlow__stack">
            {m.nominal > 0 && (
              <span
                className="corpFlow__bar corpFlow__bar--strong"
                style={{ height: `${(m.nominal / OS_MAX) * 100}%` }}
              />
            )}
            <span
              className="corpFlow__bar corpFlow__bar--soft"
              style={{ height: `${MIN_ODS + (m.interest / OS_MAX) * 100}px` }}
            />
          </span>
          <span className="corpFlow__label">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ----------------------------- analiza portfela ----------------------------- */

function Widgets() {
  return (
    <section className="corpSection">
      <div className="corpSection__head">
        <h2 className="sectionTitle">Analiza portfela</h2>
      </div>
      <div className="corpWidgets">
        {CORP_WIDGETS.map((w) => (
          <article className="corpWidget" key={w.id}>
            <h3 className="corpWidget__title">{w.title}</h3>
            <div className="corpWidget__filters">
              {w.filters.map((f) => (
                <Select key={f} label={f} />
              ))}
            </div>
            <div className="corpWidget__value">{w.value}</div>
            <span className="corpWidget__sub">{w.sub}</span>

            {w.bars && <InterestChart bars={w.bars} />}

            {w.parts && (
              <>
                <div className="divider" />
                <div className="corpWidget__parts">
                  {w.parts.map((p) => (
                    <div className="corpPart" key={p.label}>
                      <span className="corpPart__label">{p.label}</span>
                      <span className={`corpPart__value ${p.negative ? 'is-negative' : ''}`}>
                        {p.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- zapadalnosc i odsetki --------------------------- */

function Flows({ currency }: { currency: Currency }) {
  return (
    <section className="corpSection corpSection--card">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Zapadalność i odsetki</h2>
          <p className="corpSection__sub">
            Planowane przepływy z portfela obligacji · najbliższy wykup{' '}
            <strong>{podsumowanie(currency).najblizszyWykup}</strong> · najbliższa wypłata odsetek{' '}
            <strong>31.12.2026</strong>
          </p>
        </div>
        <div className="corpSection__actions">
          {CORP_FLOWS_FILTERS.map((f) => (
            <Select key={f} label={f} />
          ))}
        </div>
      </div>

      <div className="corpLegend">
        <span className="corpLegend__item">
          <span className="corpLegend__dot" style={{ background: SEG }} />
          Wartość nominalna
        </span>
        <span className="corpLegend__item">
          <span className="corpLegend__dot" style={{ background: SEG_SOFT }} />
          Odsetki
        </span>
      </div>

      <FlowsChart />

      <div className="divider" />
      <p className="corpNote">{CORP_FLOWS_NOTE}</p>
    </section>
  );
}

/* ----------------------------- zamkniete pozycje ----------------------------- */

function Closed() {
  return (
    <section className="corpSection corpSection--card">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Zamknięte pozycje</h2>
          <p className="corpSection__sub">
            Serie sprzedane lub wykupione w całości. Wynik obejmuje wszystkie zakupy, dokupienia
            i częściowe sprzedaże na danej pozycji.
          </p>
        </div>
        <Select label="Od początku" />
      </div>

      <div className="closedTable">
        <div className="closedRow closedRow--head">
          <span>Emitent i seria</span>
          <span>Okres inwestycji</span>
          <span>Oprocentowanie</span>
          <span className="is-num">Zainwestowano</span>
          <span className="is-num">Otrzymano</span>
          <span className="is-num">Wynik</span>
          <span className="is-num">Stopa zwrotu</span>
        </div>
        {CORP_CLOSED.map((r) => (
          <div className="closedRow" key={r.id}>
            <span className="closedRow__name">
              {r.name}
              <span className="closedRow__sub">{r.sub}</span>
            </span>
            <span className="closedRow__name">
              {r.period}
              <span className="closedRow__sub">{r.periodSub}</span>
            </span>
            <span className="closedRow__rate">{r.rate}</span>
            <span className="is-num">{r.invested}</span>
            <span className="is-num">{r.received}</span>
            <span className="is-num is-positive">{r.result}</span>
            <span className="is-num">{r.irr}</span>
          </div>
        ))}
        <div className="closedRow closedRow--total">
          <span className="closedRow__name">
            {CORP_CLOSED_TOTAL.name}
            <span className="closedRow__sub">{CORP_CLOSED_TOTAL.sub}</span>
          </span>
          <span />
          <span />
          <span className="is-num">{CORP_CLOSED_TOTAL.invested}</span>
          <span className="is-num">{CORP_CLOSED_TOTAL.received}</span>
          <span className="is-num is-positive">{CORP_CLOSED_TOTAL.result}</span>
          <span className="is-num">{CORP_CLOSED_TOTAL.irr}</span>
        </div>
      </div>

      <p className="corpNote">{CORP_CLOSED_NOTE}</p>
    </section>
  );
}

/* --------------------------------- operacje --------------------------------- */

function Ops() {
  return (
    <section className="corpSection corpSection--card">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Operacje</h2>
          <p className="corpSection__sub">
            Te same typy i filtry co w zakładce Operacje — tu zawężone do obligacji korporacyjnych
          </p>
        </div>
        <div className="corpSection__actions">
          {CORP_OPS_FILTERS.map((f) => (
            <Select key={f} label={f} />
          ))}
          <button type="button" className="btn">
            <Download size={14} />
            Eksport XLS
          </button>
        </div>
      </div>

      <div className="opsTable">
        <div className="opsRow opsRow--head">
          <span>Data</span>
          <span>Typ operacji</span>
          <span>Instrument</span>
          <span className="is-num">Kwota</span>
          <span className="is-num">Status</span>
        </div>
        {CORP_OPS.map((o) => (
          <div className="opsRow" key={o.id}>
            <span>{o.date}</span>
            <span>{o.type}</span>
            <span className="opsRow__name">
              {o.instrument}
              <span className="opsRow__sub">{o.account}</span>
            </span>
            <span className={`is-num ${o.negative ? '' : 'is-positive'}`}>{o.amount}</span>
            <span className="is-num opsRow__status">{o.status}</span>
          </div>
        ))}
      </div>

      <div className="corpSection__foot">
        <span className="corpNote">{CORP_OPS_FOOT}</span>
        <span className="corpLink">
          Zobacz wszystkie w Operacjach
          <ChevronRight size={14} />
        </span>
      </div>
    </section>
  );
}

/* ---------------------------------- ekran ---------------------------------- */

export function CorpBondsV10({
  currency,
  onCurrencyChange,
  onBack,
}: {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onBack: () => void;
}) {
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
            <span className="crumbs__current">{CORP_HEAD.title}</span>
          </nav>

          <div className="corpHead">
            <div className="corpHead__text">
              {/* Chevron przy tytule prowadzi do innych klas aktywow —
                  ten sam wzorzec co przelacznik rachunku. */}
              <h1 className="corpHead__title">
                {CORP_HEAD.title}
                <ChevronDown size={18} className="corpHead__chev" />
              </h1>
              <p className="corpHead__sub">{CORP_HEAD.sub}</p>
            </div>
            <div className="corpHead__scope">
              <Select label={CORP_HEAD.scope} />
              <Pills
                items={CURRENCIES}
                value={currency}
                onChange={(v) => onCurrencyChange(v as Currency)}
              />
            </div>
          </div>

          <Summary currency={currency} />
          <Structure currency={currency} />
          <Widgets />
          <Flows currency={currency} />
          <Closed />
          <Ops />
        </div>
      </div>
    </div>
  );
}
