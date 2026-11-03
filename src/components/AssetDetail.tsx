import { useState } from 'react';
import {
  ACCOUNT_CHIPS,
  CLASS_METRICS,
  DETAIL,
  DETAIL_CURRENCIES,
  INSTRUMENT_COLS,
  ISSUERS,
  SERIES,
  TRANSACTIONS,
  TX_COLUMNS,
  TX_PERIODS,
  TX_TABS,
  TX_TAB_TYPES,
  TX_TOTAL,
  TX_TYPES,
  type Instrument,
} from '../data/corpBonds';
import { ASSETS } from '../data/portfolio';
import { Amount, Pills } from './ui';

type StyleId = '1' | '2' | '3';

/* ----------------------------- lista instrumentów ----------------------------- */

function InstrumentRow({
  item,
  withLabels,
  color,
}: {
  item: Instrument;
  withLabels: boolean;
  color: string;
}) {
  const cells = [item.rate, item.maturity, item.share];

  return (
    <button type="button" className="instrRow" style={{ ['--seg' as string]: color }}>
      <span className="instrRow__dot" />
      <span className="instrRow__title">
        <span className="instrRow__name">{item.name}</span>
        <span className="instrRow__sub">{item.sub}</span>
      </span>
      <span className="instrRow__cols">
        {cells.map((value, i) => (
          <span className="instrRow__col" key={INSTRUMENT_COLS[i]}>
            {withLabels && <span className="instrRow__colLabel">{INSTRUMENT_COLS[i]}</span>}
            <span className="instrRow__colValue">{value}</span>
          </span>
        ))}
      </span>
      <span className="instrRow__value">{item.value}</span>
      <span className="instrRow__chev" aria-hidden="true">
        ›
      </span>
    </button>
  );
}

/* ----------------------------- tabela transakcji ----------------------------- */

function Transactions() {
  const [tab, setTab] = useState<string>('Wszystkie');
  const [period, setPeriod] = useState<string>('2026');
  const [type, setType] = useState<string>('Wszystkie typy');
  const [query, setQuery] = useState<string>('');

  const allowed = TX_TAB_TYPES[tab];
  const rows = TRANSACTIONS.filter((t) => {
    if (allowed && !allowed.includes(t.type)) return false;
    if (!t.date.endsWith(period)) return false;
    if (type !== 'Wszystkie typy' && t.type !== type) return false;
    if (query && !t.instrument.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="sectionTitle">Transakcje</h2>
        <span className="panel__meta">{rows.length} transakcji</span>
      </div>

      <div className="panel__toolbar">
        <Pills items={TX_TABS} value={tab} onChange={setTab} />
        <div className="btnRow">
          <button type="button" className="btnGhost">
            Eksport PDF
          </button>
          <button type="button" className="btnGhost">
            Eksport XLS
          </button>
        </div>
      </div>

      <div className="filters">
        <label className="field">
          <span className="field__label">Okres</span>
          <select
            className="field__control"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {TX_PERIODS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="field field--wide">
          <span className="field__label">Typ transakcji</span>
          <select
            className="field__control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TX_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field field--widest">
          <span className="field__label">Instrument</span>
          <input
            className="field__control"
            type="search"
            placeholder="Szukaj instrumentu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="table">
        <div className="table__head">
          {TX_COLUMNS.map((c) => (
            <span key={c} className={`table__th ${c === 'Kwota' ? 'is-right' : ''}`}>
              {c}
            </span>
          ))}
        </div>

        {rows.length === 0 && <div className="table__empty">Brak transakcji dla tych filtrów</div>}

        {rows.map((t, i) => (
          <div className="table__row" key={i}>
            <span className="table__td table__td--muted">{t.date}</span>
            <span className="table__td">{t.type}</span>
            <span className="table__td">{t.instrument}</span>
            <span className="table__td is-right">
              <span className="table__amount">{t.amount}</span>
              {t.amountNote && <span className="table__note">{t.amountNote}</span>}
            </span>
            <span className="table__td">
              <span className="badge">{t.status}</span>
            </span>
            <span className="table__td table__td--muted">{t.account}</span>
          </div>
        ))}

        <div className="table__foot">
          <button type="button" className="btnGhost">
            Pokaż kolejne 15 transakcji
          </button>
          <span className="table__caption">
            Wyświetlono {rows.length} z {TX_TOTAL} transakcji
          </span>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- ekran ----------------------------- */

export function AssetDetailScreen({
  styleId,
  onBack,
}: {
  styleId: StyleId;
  onBack: () => void;
}) {
  const [currency, setCurrency] = useState<string>('PLN');
  const [grouping, setGrouping] = useState<string>('Emitenci');
  /* Filtr rachunkow jest wielokrotnego wyboru. Pusty zbior znaczy „Wszystkie",
     dzieki czemu odznaczenie ostatniego rachunku wraca do pelnej listy samo. */
  const [accounts, setAccounts] = useState<string[]>([]);
  const toggleAccount = (name: string) =>
    setAccounts((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );

  /* Makieta nie ma palety — kolor i tak gasi CSS, wiec siegamy po nr 1. */
  const palette = styleId === '2' ? '2' : '1';
  const color = ASSETS.find((a) => a.id === 'corp')?.colors[palette].card ?? 'var(--ink)';
  const locked = styleId === '3';
  const items = grouping === 'Emitenci' ? ISSUERS : SERIES;

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <div className="crumbRow">
            <nav className="crumbs" aria-label="Ścieżka nawigacji">
              <button type="button" className="crumbs__link" onClick={onBack}>
                {DETAIL.breadcrumb[0]}
              </button>
              <span className="crumbs__sep" aria-hidden="true">
                ›
              </span>
              <button type="button" className="crumbs__link" onClick={onBack}>
                {DETAIL.breadcrumb[1]}
              </button>
              <span className="crumbs__sep" aria-hidden="true">
                ›
              </span>
              <span className="crumbs__current">{DETAIL.breadcrumb[2]}</span>
            </nav>
            <Pills
              items={DETAIL_CURRENCIES}
              value={currency}
              onChange={setCurrency}
              locked={locked}
            />
          </div>

          <section className="summary">
            <div className="summary__titleBlock">
              <h1 className="pageTitle">{DETAIL.title}</h1>
              <Amount int={DETAIL.amount} dec={DETAIL.amountDecimals} />
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="sectionTitle">Instrumenty i pozycje</h2>
              <div className="panel__actions">
                <Pills
                  items={['Emitenci', 'Serie']}
                  value={grouping}
                  onChange={setGrouping}
                  locked={locked}
                />
              </div>
            </div>

            {/* Wybor rachunku to ten sam segmentowany przelacznik co reszta
                kontrolek na ekranie — jedna karta, jeden jezyk sterowania.
                W makiecie nie pokazujemy go wcale. */}
            {!locked && (
              <div className="chipGroup">
                <span className="chipGroup__label">Rachunki</span>
                <div className="chips">
                  {ACCOUNT_CHIPS.map((c, i) => {
                    const all = i === 0;
                    const on = all ? accounts.length === 0 : accounts.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        className="chip"
                        aria-pressed={on}
                        onClick={() => (all ? setAccounts([]) : toggleAccount(c))}
                      >
                        {on && <span className="chip__check" aria-hidden="true">✓</span>}
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="metricStrip">
              {CLASS_METRICS.map((m) => (
                <div className="strip__item metricStrip__item" key={m.label}>
                  <span className="strip__label">{m.label}</span>
                  <span className="strip__value">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="instrList">
              {items.map((item, i) => (
                <InstrumentRow key={item.id} item={item} withLabels={i === 0} color={color} />
              ))}
            </div>
          </section>

          <Transactions />
        </div>
      </div>
    </div>
  );
}
