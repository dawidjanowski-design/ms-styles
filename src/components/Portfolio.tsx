import { useState } from 'react';
import {
  ASSETS,
  CASH,
  LEGEND_ORDER,
  type Account,
  type AssetClass,
  type Palette,
} from '../data/portfolio';
import {
  CURRENCIES,
  VIEWS,
  type AllocationRow,
  type CashCard,
  type Currency,
} from '../data/currencies';
import { Amount, KeyValue, Pills } from './ui';
import { InTransitDrawer } from './InTransit';

type StyleId = '1' | '2' | '3';
/** Makieta nie ma wlasnej palety — korzysta z nr 1, a kolor gasi CSS (--seg-flat). */
const paletteOf = (s: StyleId): '1' | '2' => (s === '2' ? '2' : '1');
/** Kolejnosc pozycji w makiecie jest taka jak w nr 2. */
const orderOf = (s: StyleId): '1' | '2' => (s === '1' ? '1' : '2');
type HoverProps = { hot: string | null; setHot: (id: string | null) => void };

/** Klasy aktywów, które mają już własny ekran szczegółów. */
export const DETAIL_ASSETS = new Set(['corp']);

const dimClass = (id: string, hot: string | null) =>
  hot === null ? '' : hot === id ? 'is-hot' : 'is-dim';

/** Nazwa i paleta po id — wspólne dla wszystkich walut. */
const META: Record<string, { name: string; colors: Record<'1' | '2', Palette> }> = {
  ...Object.fromEntries(ASSETS.map((a) => [a.id, { name: a.name, colors: a.colors }])),
  [CASH.id]: { name: CASH.name, colors: CASH.colors },
};

/** Kolejność pozycji różni się między stylistykami; gotówka zawsze na końcu. */
function ordered(rows: AllocationRow[], styleId: StyleId): AllocationRow[] {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const out: AllocationRow[] = [];
  for (const id of LEGEND_ORDER[orderOf(styleId)]) {
    const row = byId.get(id);
    if (row) out.push(row);
  }
  const cash = byId.get(CASH.id);
  if (cash) out.push(cash);
  return out;
}

const pct = (n: number) => `${n.toFixed(1).replace('.', ',')}%`;

/* ----------------------------- wykres ----------------------------- */

export function AllocationChart({
  rows,
  styleId,
  hot,
  setHot,
}: { rows: AllocationRow[]; styleId: StyleId } & HoverProps) {
  const segments = ordered(rows, styleId);
  const total = segments.reduce((sum, s) => sum + s.share, 0);

  return (
    <div className="chart" onMouseLeave={() => setHot(null)}>
      {segments.map((s) => {
        const c = META[s.id].colors[paletteOf(styleId)];
        return (
          <button
            key={s.id}
            type="button"
            className={`chartSeg ${s.id === CASH.id ? 'chartSeg--cash' : ''} ${dimClass(s.id, hot)}`}
            style={{
              flex: `${s.share / total} 1 0`,
              ['--seg' as string]: c.chart,
              ['--seg-foot' as string]: c.chartFoot ?? c.chart,
            }}
            onMouseEnter={() => setHot(s.id)}
            onFocus={() => setHot(s.id)}
            onBlur={() => setHot(null)}
            aria-label={`${META[s.id].name}: ${pct(s.share)}`}
          >
            <span className="chartSeg__body" />
            <span className="chartSeg__foot" />
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------- legenda ----------------------------- */

function LegendRow({
  id,
  color,
  name,
  share,
  value,
  hot,
  setHot,
  onOpen,
}: {
  id: string;
  color: string;
  name: string;
  share: string;
  value: string;
  onOpen?: () => void;
} & HoverProps) {
  return (
    <button
      type="button"
      className={`legendRow ${dimClass(id, hot)}`}
      style={{ ['--seg' as string]: color, cursor: onOpen ? 'pointer' : 'default' }}
      onClick={onOpen}
      onMouseEnter={() => setHot(id)}
      onMouseLeave={() => setHot(null)}
      onFocus={() => setHot(id)}
      onBlur={() => setHot(null)}
    >
      <span className="legendRow__dot" />
      <span className="legendRow__name">{name}</span>
      <span className="legendRow__share">{share}</span>
      <span className="legendRow__value">{value}</span>
    </button>
  );
}

export function Legend({
  rows,
  styleId,
  hot,
  setHot,
  onOpenAsset,
}: {
  rows: AllocationRow[];
  styleId: StyleId;
  onOpenAsset?: (id: string) => void;
} & HoverProps) {
  const all = ordered(rows, styleId);
  const cash = all.find((r) => r.id === CASH.id);
  const assets = all.filter((r) => r.id !== CASH.id);

  const row = (r: AllocationRow) => (
    <LegendRow
      key={r.id}
      id={r.id}
      color={META[r.id].colors[paletteOf(styleId)].legend}
      name={META[r.id].name}
      share={pct(r.share)}
      value={r.value}
      hot={hot}
      setHot={setHot}
      onOpen={onOpenAsset && DETAIL_ASSETS.has(r.id) ? () => onOpenAsset(r.id) : undefined}
    />
  );

  return (
    <div className="legend">
      <div className="legend__rows">{assets.map(row)}</div>

      {cash && (
        <div className="legend__cash">
          <div className="legend__cashInner">
            {row(cash)}
            {cash.sub && (
              <div className={`legend__cashSub ${dimClass(CASH.id, hot)}`}>{cash.sub}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- gotówka ----------------------------- */

/* Karta z zerowym saldem nie niesie zadnej informacji — w widoku EUR czy USD
   byly to dwa puste prostokaty obok jednej realnej kwoty. */
const isEmpty = (c: CashCard) => c.amount.replace(/\s/g, '') === '0';

function CashOverview({
  cards,
  onOpenTransit,
}: {
  cards: CashCard[];
  onOpenTransit?: () => void;
}) {
  const visible = cards.filter((c) => !isEmpty(c));
  if (visible.length === 0) return null;

  return (
    <section className="cash">
      <h2 className="sectionTitle">Gotówka i środki rozliczeniowe</h2>
      <div className="cash__grid">
        {visible.map((card, i) => {
          const link = onOpenTransit && card.label === 'Środki w drodze';
          return (
          <article
            className={`cashCard ${link ? 'cashCard--link' : ''}`}
            key={i}
            onClick={link ? onOpenTransit : undefined}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="cashCard__head">
                <span className="cashCard__label" style={{ flex: 1 }}>
                  {card.label}
                </span>
                {link && (
                  <span className="cashCard__chev" aria-hidden="true">
                    ›
                  </span>
                )}
              </span>
              <Amount int={card.amount} dec={card.decimals} className="cashCard__amount" />
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {card.rows.map((r) => (
                <KeyValue key={r.label} label={r.label} value={r.value} />
              ))}
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------- karty aktywów ----------------------------- */

function AssetCard({
  asset,
  styleId,
  onOpen,
}: {
  asset: AssetClass;
  styleId: StyleId;
  onOpen?: () => void;
}) {
  const makieta = styleId === '3';
  const strip = styleId !== '2';
  const rows = makieta ? [] : strip ? asset.rows : [...asset.highlights, ...asset.rows];
  const stripItems = makieta ? [...asset.rows, ...asset.highlights] : asset.highlights;

  return (
    <article
      className={`assetCard ${onOpen ? 'assetCard--link' : ''}`}
      style={{ ['--seg' as string]: asset.colors[paletteOf(styleId)].card }}
      onClick={onOpen}
    >
      <div className="assetCard__head">
        <div className="assetCard__title">
          {styleId === '2' && <span className="assetCard__bar" />}
          <span className="assetCard__name">{asset.name}</span>
          {styleId !== '2' && <span className="assetCard__dot" />}
        </div>
        <Amount
          int={makieta ? `≈ ${asset.amount}` : asset.amount}
          dec={asset.amountDecimals}
          className="assetCard__amount"
        />
      </div>

      {!makieta && <div className="divider" />}

      {rows.length > 0 && (
        <div className="assetCard__rows">
          {rows.map((r) => (
            <KeyValue key={r.label} label={r.label} value={r.value} px={strip ? 20 : 0} />
          ))}
        </div>
      )}

      {strip && stripItems.length > 0 && (
        <div className="strip">
          {stripItems.map((h) => (
            <div className="strip__item" key={h.label}>
              <span className="strip__label">{h.label}</span>
              <span className="strip__value">{h.value}</span>
            </div>
          ))}
        </div>
      )}

      {makieta && (
        <div className="assetCard__more">
          <span className="acctCard__action">
            Zobacz szczegóły<span aria-hidden="true">›</span>
          </span>
        </div>
      )}
    </article>
  );
}

/* ----------------------------- rachunki ----------------------------- */

function AccountCard({
  account,
  styleId,
  onOpen,
}: {
  account: Account;
  styleId: StyleId;
  onOpen?: () => void;
}) {
  return (
    <article className="acctCard" style={{ ['--seg' as string]: account.marker?.[paletteOf(styleId)] }}>
      <div className="acctCard__head">
        <div className="acctCard__top">
          <div className="acctCard__title">
            <span className="acctCard__dot" />
            <span className="acctCard__name">{account.name}</span>
            <span className="acctCard__number">· {account.number}</span>
          </div>
          <Amount
            int={account.amount}
            dec={account.amountDecimals}
            className="acctCard__amount"
          />
        </div>
      </div>

      {account.strip && (
        <div className="acctCard__limit">
          <span className="acctCard__limitLabel">{account.strip.label}</span>
          <div className="acctCard__limitTop">
            <span className="acctCard__limitValue">{account.strip.value}</span>
            {account.strip.progress !== undefined && (
              <span className="acctCard__limitPct">
                {Math.round(account.strip.progress * 100)}% wykorzystane
              </span>
            )}
          </div>
          {account.strip.progress !== undefined && (
            <div className="acctCard__limitTrack">
              <div
                className="acctCard__limitFill"
                style={{ width: `${account.strip.progress * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {account.rows.length > 0 && (
        <>
          <div className="divider" />
          <div className="acctCard__rows">
            {account.rows.map((r) => (
              <button type="button" className="acctRow" key={r.label}>
                <span className="acctRow__label">{r.label}</span>
                <span className="acctRow__value">{r.value}</span>
                <span className="acctRow__chev">›</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="acctCard__foot">
        <button type="button" className="acctCard__action" onClick={onOpen}>
          {account.action}
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </article>
  );
}

/* ----------------------------- ekran ----------------------------- */

export function PortfolioScreen({
  styleId,
  currency,
  onCurrencyChange,
  onOpenAsset,
  onOpenAccount,
}: {
  styleId: StyleId;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenAsset: (id: string) => void;
  onOpenAccount: (id: string) => void;
}) {
  const [view, setView] = useState<string>('Aktywa');
  const [hot, setHot] = useState<string | null>(null);
  /* Panel srodkow w drodze dziala tylko w stylistykach nr 1 i nr 2. */
  const [transit, setTransit] = useState(false);

  const data = VIEWS[currency];
  const title = <h1 className="pageTitle">Portfel</h1>;

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <section className="summary" style={{ paddingTop: 'var(--summary-pt)' }}>
            <div className="summary__top">
              <div className="summary__titleBlock">
                {title}
                <div className="summary__head">
                  <Amount int={data.total} dec={data.decimals} />
                  <Pills
                    items={CURRENCIES}
                    value={currency}
                    onChange={(v) => onCurrencyChange(v as Currency)}
                    locked={styleId === '3'}
                  />
                </div>
              </div>
              <AllocationChart
                rows={data.allocation}
                styleId={styleId}
                hot={hot}
                setHot={setHot}
              />
            </div>
            <Legend
              rows={data.allocation}
              styleId={styleId}
              hot={hot}
              setHot={setHot}
              onOpenAsset={onOpenAsset}
            />
          </section>

          <CashOverview
            cards={data.cashCards}
            /* Panel pokazuje rozbicie calosci, wiec otwieramy go tylko w widoku
                laczynm — w PLN/EUR/USD jego liczby by nie pasowaly. */
            onOpenTransit={
              styleId !== '3' && currency === 'Łącznie' ? () => setTransit(true) : undefined
            }
          />

          <section className="assets">
            <div className="assets__head">
              <h2 className="sectionTitle">
                {view === 'Aktywa' ? 'Struktura aktywów' : 'Struktura rachunków'}
              </h2>
              <Pills
                items={['Aktywa', 'Rachunki']}
                value={view}
                onChange={setView}
                locked={styleId === '3'}
              />
            </div>
            <div className="assets__list">
              {view === 'Aktywa'
                ? data.assets.map((a) => (
                    <AssetCard
                      key={a.id}
                      asset={a}
                      styleId={styleId}
                      onOpen={DETAIL_ASSETS.has(a.id) ? () => onOpenAsset(a.id) : undefined}
                    />
                  ))
                : data.accounts.map((a) => (
                    <AccountCard
                      key={a.id}
                      account={a}
                      styleId={styleId}
                      /* Ekran rachunku istnieje na razie tylko dla IKE i tylko
                         w widoku lacznym, gdzie liczby sie zgadzaja. */
                      onOpen={
                        styleId !== '3' && a.id === 'ike' && currency === 'Łącznie'
                          ? () => onOpenAccount(a.id)
                          : undefined
                      }
                    />
                  ))}
            </div>
          </section>
        </div>
      </div>

      <InTransitDrawer open={transit} onClose={() => setTransit(false)} />
    </div>
  );
}
