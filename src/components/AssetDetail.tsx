import { useState } from 'react';
import {
  DETAIL,
  INSTRUMENT_COLS,
  TRANSACTIONS,
  TX_TOTAL,
  type Instrument,
} from '../data/corpBonds';
import {
  CORP_VIEWS,
  accountsIn,
  amountParts,
  classMetrics,
  money,
  partsOf,
  pct,
  seriesOf,
} from '../data/corpViews';
import { CURRENCIES, type Currency } from '../data/currencies';
import { ASSETS } from '../data/portfolio';
import { Amount, Pills } from './ui';
import { Transactions } from './Transactions';

type StyleId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'makieta';

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
  currency,
  onCurrencyChange,
  onBack,
  onOpenIssuer,
  onOpenSeries,
}: {
  styleId: StyleId;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onBack: () => void;
  onOpenIssuer: (id: string) => void;
  onOpenSeries: (id: string) => void;
}) {
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
  const locked = styleId === 'makieta';

  const view = CORP_VIEWS[currency];
  const chips = ['Wszystkie', ...accountsIn(view)];
  const metrics = classMetrics(view, accounts);
  const head = amountParts(metrics.total, view.unit);

  /* Udzial liczony wzgledem tego, co aktualnie widac — inaczej po odfiltrowaniu
     rachunku procenty nie sumowalyby sie do stu. */
  const share = (v: number) => (metrics.total ? pct((v / metrics.total) * 100) : '—');

  /* „Emitenci" pokazuje jeden wiersz na emitenta, „Serie" rozbija go na serie
     i dopisuje, z ktorego rachunku pochodzi dana pozycja. */
  const items: Instrument[] = metrics.visible.flatMap(({ issuer, value }) => {
    const parts = partsOf(issuer, accounts);
    const series = seriesOf(issuer, accounts);
    if (grouping === 'Emitenci') {
      return [
        {
          id: issuer.id,
          name: issuer.name,
          sub:
            `${series.length} ${series.length === 1 ? 'seria' : 'serie'} · ` +
            `${series.join(', ')} · ${parts.map((p) => p.account).join(', ')}`,
          rate: pct(issuer.rate),
          maturity: issuer.maturity,
          share: share(value),
          value: money(value, view.unit),
        },
      ];
    }
    return parts.map((p) => ({
      id: `${issuer.id}-${p.account}`,
      name: `${issuer.name}, seria ${p.series.join(', ')}`,
      sub: p.account,
      rate: pct(issuer.rate),
      maturity: issuer.maturity,
      share: share(p.value),
      value: money(p.value, view.unit),
    }));
  });

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
              items={CURRENCIES}
              value={currency}
              onChange={(v) => {
                onCurrencyChange(v as Currency);
                /* Rachunki roznia sie miedzy walutami — stary filtr nie ma
                   tam odpowiednika, wiec wraca do „Wszystkie". */
                setAccounts([]);
              }}
              locked={locked}
            />
          </div>

          {/* Tytul i wartosc w przeciwnych rogach, tak jak na wireframie. */}
          <section className="detailHead">
            <h1 className="detailTitle">{DETAIL.title}</h1>
            <div className="detailValue">
              <span className="detailValue__label">Wartość</span>
              <Amount int={head.int} dec={head.dec} />
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
                  {chips.map((c, i) => {
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
              {metrics.rows.map((m) => (
                <div className="strip__item metricStrip__item" key={m.label}>
                  <span className="strip__label">{m.label}</span>
                  <span className="strip__value">{m.value}</span>
                </div>
              ))}
            </div>

            <div className="instrList">
              {items.length === 0 && (
                <div className="table__empty">Brak pozycji dla wybranych rachunków</div>
              )}
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
