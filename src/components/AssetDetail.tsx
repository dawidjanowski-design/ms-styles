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
  TX_TOTAL,
  type Instrument,
} from '../data/corpBonds';
import { ASSETS } from '../data/portfolio';
import { Amount, Pills } from './ui';
import { Transactions } from './Transactions';

type StyleId = '1' | '2' | '3';

/* ----------------------------- lista instrumentów ----------------------------- */

function InstrumentRow({
  item,
  withLabels,
  color,
  onOpen,
}: {
  item: Instrument;
  withLabels: boolean;
  color: string;
  onOpen?: () => void;
}) {
  const cells = [item.rate, item.maturity, item.share];

  return (
    <button
      type="button"
      className="instrRow"
      style={{ ['--seg' as string]: color }}
      onClick={onOpen}
    >
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

/* ----------------------------- ekran ----------------------------- */

export function AssetDetailScreen({
  styleId,
  onBack,
  onOpenIssuer,
  onOpenSeries,
}: {
  styleId: StyleId;
  onBack: () => void;
  onOpenIssuer: (id: string) => void;
  onOpenSeries: (id: string) => void;
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

          {/* Tytul i wartosc w przeciwnych rogach, tak jak na wireframie. */}
          <section className="detailHead">
            <h1 className="detailTitle">{DETAIL.title}</h1>
            <div className="detailValue">
              <span className="detailValue__label">Wartość</span>
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
                <InstrumentRow
                  key={item.id}
                  item={item}
                  withLabels={i === 0}
                  color={color}
                  /* Ekrany emitenta i serii istnieja tylko w stylistykach
                     nr 1 i nr 2 — w makiecie wiersze nigdzie nie prowadza. */
                  onOpen={
                    locked
                      ? undefined
                      : grouping === 'Emitenci'
                        ? () => onOpenIssuer(item.id)
                        : () => onOpenSeries(item.id)
                  }
                />
              ))}
            </div>
          </section>

          <Transactions
            rows={TRANSACTIONS}
            total={TX_TOTAL}
            locked={locked}
          />
        </div>
      </div>
    </div>
  );
}
