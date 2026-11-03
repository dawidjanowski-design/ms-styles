import { useState } from 'react';
import {
  ACCOUNTS,
  ASSETS,
  CASH,
  CASH_CARDS,
  CURRENCIES,
  LEGEND_ORDER,
  TOTAL,
  type Account,
  type AssetClass,
} from '../data/portfolio';
import { Amount, KeyValue, Pills } from './ui';

type StyleId = '1' | '2';
type HoverProps = { hot: string | null; setHot: (id: string | null) => void };

/* Klasy aktywów, które mają już własny ekran szczegółów. */
export const DETAIL_ASSETS = new Set(['corp']);

const dimClass = (id: string, hot: string | null) =>
  hot === null ? '' : hot === id ? 'is-hot' : 'is-dim';

/* ----------------------------- wykres ----------------------------- */

function AllocationChart({ styleId, hot, setHot }: { styleId: StyleId } & HoverProps) {
  const byId = new Map(ASSETS.map((a) => [a.id, a]));
  const segments = [
    ...LEGEND_ORDER[styleId].map((id) => {
      const a = byId.get(id) as AssetClass;
      return { id: a.id, name: a.name, share: a.share, c: a.colors[styleId] };
    }),
    { id: CASH.id, name: CASH.name, share: CASH.share, c: CASH.colors[styleId] },
  ];
  const total = segments.reduce((sum, s) => sum + s.share, 0);

  return (
    <div className="chart" onMouseLeave={() => setHot(null)}>
      {segments.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`chartSeg ${s.id === 'cash' ? 'chartSeg--cash' : ''} ${dimClass(s.id, hot)}`}
          style={{
            flex: `${s.share / total} 1 0`,
            ['--seg' as string]: s.c.chart,
            ['--seg-foot' as string]: s.c.chartFoot ?? s.c.chart,
          }}
          onMouseEnter={() => setHot(s.id)}
          onFocus={() => setHot(s.id)}
          onBlur={() => setHot(null)}
          aria-label={`${s.name}: ${s.share}%`}
        >
          <span className="chartSeg__body" />
          <span className="chartSeg__foot" />
        </button>
      ))}
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

function Legend({ styleId, hot, setHot, onOpenAsset }: { styleId: StyleId; onOpenAsset: (id: string) => void } & HoverProps) {
  const order = LEGEND_ORDER[styleId];
  const byId = new Map(ASSETS.map((a) => [a.id, a]));

  return (
    <div className="legend">
      <div className="legend__rows">
      {order.map((id) => {
        const a = byId.get(id) as AssetClass;
        return (
          <LegendRow
            key={id}
            id={a.id}
            color={a.colors[styleId].legend}
            name={a.name}
            share={`${a.share.toFixed(1).replace('.', ',')}%`}
            value={a.legendValue}
            hot={hot}
            setHot={setHot}
            onOpen={DETAIL_ASSETS.has(a.id) ? () => onOpenAsset(a.id) : undefined}
          />
        );
      })}
      </div>

      <div className="legend__cash">
        <div className="legend__cashInner">
          <LegendRow
            id={CASH.id}
            color={CASH.colors[styleId].legend}
            name={CASH.name}
            share={`${CASH.share.toFixed(1).replace('.', ',')}%`}
            value={CASH.legendValue}
            hot={hot}
            setHot={setHot}
          />
          <div className={`legend__cashSub ${dimClass(CASH.id, hot)}`}>{CASH.sub}</div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- gotówka ----------------------------- */

function CashOverview() {
  return (
    <section className="cash">
      <h2 className="sectionTitle">Gotówka i środki rozliczeniowe</h2>
      <div className="cash__grid">
        {CASH_CARDS.map((card, i) => (
          <article className="cashCard" key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="cashCard__label">{card.label}</span>
              <Amount int={card.amount} dec={card.decimals} className="cashCard__amount" />
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {card.rows.map((r) => (
                <KeyValue key={r.label} label={r.label} value={r.value} />
              ))}
            </div>
          </article>
        ))}
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
  const strip = styleId === '1';
  const rows = strip ? asset.rows : [...asset.highlights, ...asset.rows];

  return (
    <article
      className={`assetCard ${onOpen ? 'assetCard--link' : ''}`}
      style={{ ['--seg' as string]: asset.colors[styleId].card }}
      onClick={onOpen}
    >
      <div className="assetCard__head">
        <div className="assetCard__title">
          {styleId === '2' && <span className="assetCard__bar" />}
          <span className="assetCard__name">{asset.name}</span>
          {styleId === '1' && <span className="assetCard__dot" />}
        </div>
        <Amount int={asset.amount} dec={asset.amountDecimals} className="assetCard__amount" />
      </div>

      <div className="divider" />

      <div className="assetCard__rows">
        {rows.map((r) => (
          <KeyValue key={r.label} label={r.label} value={r.value} px={strip ? 20 : 0} />
        ))}
      </div>

      {strip && asset.highlights.length > 0 && (
        <div className="strip">
          {asset.highlights.map((h) => (
            <div className="strip__item" key={h.label}>
              <span className="strip__label">{h.label}</span>
              <span className="strip__value">{h.value}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

/* ----------------------------- rachunki ----------------------------- */

function AccountCard({ account, styleId }: { account: Account; styleId: StyleId }) {
  return (
    <article
      className="acctCard"
      style={{ ['--seg' as string]: account.marker[styleId] }}
    >
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
          {account.rowsLabel && (
            <div className="acctCard__rowsLabel">{account.rowsLabel}</div>
          )}
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
        <button type="button" className="acctCard__action">
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
  onOpenAsset,
}: {
  styleId: StyleId;
  onOpenAsset: (id: string) => void;
}) {
  const [currency, setCurrency] = useState<string>('Łącznie');
  const [view, setView] = useState<string>('Aktywa');
  const [hot, setHot] = useState<string | null>(null);

  const titleInSummary = styleId === '1';
  const title = <h1 className="pageTitle">Portfel</h1>;

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          {!titleInSummary && title}

          <section className="summary" style={{ paddingTop: 'var(--summary-pt)' }}>
            <div className="summary__top">
              <div className="summary__titleBlock">
                {titleInSummary && title}
                <div className="summary__head">
                  <Amount int={TOTAL.amount} dec={TOTAL.decimals} />
                  <Pills items={CURRENCIES} value={currency} onChange={setCurrency} />
                </div>
              </div>
              <AllocationChart styleId={styleId} hot={hot} setHot={setHot} />
            </div>
            <Legend styleId={styleId} hot={hot} setHot={setHot} onOpenAsset={onOpenAsset} />
          </section>

          <CashOverview />

          <section className="assets">
            <div className="assets__head">
              <h2 className="sectionTitle">
                {view === 'Aktywa' ? 'Struktura aktywów' : 'Struktura rachunków'}
              </h2>
              <Pills items={['Aktywa', 'Rachunki']} value={view} onChange={setView} />
            </div>
            <div className="assets__list">
              {view === 'Aktywa'
                ? ASSETS.map((a) => (
                    <AssetCard
                      key={a.id}
                      asset={a}
                      styleId={styleId}
                      onOpen={DETAIL_ASSETS.has(a.id) ? () => onOpenAsset(a.id) : undefined}
                    />
                  ))
                : ACCOUNTS.map((a) => (
                    <AccountCard key={a.id} account={a} styleId={styleId} />
                  ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
