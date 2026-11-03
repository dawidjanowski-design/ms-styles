import { useState } from 'react';
import {
  ISSUER,
  ISSUER_SERIES,
  ISSUER_SUMMARY,
  ISSUER_TRANSACTIONS,
  SERIES_COLUMNS,
  SERIES_DETAIL,
  SERIES_GROUPS,
  type InfoRow,
} from '../data/issuer';
import { Amount } from './ui';
import { Transactions } from './Transactions';

type StyleId = '1' | '2' | '3';

/* ----------------------------- wspólne części ----------------------------- */

function Crumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav className="crumbs" aria-label="Ścieżka nawigacji">
      {items.map((c, i) => (
        <span key={c.label} style={{ display: 'contents' }}>
          {i > 0 && (
            <span className="crumbs__sep" aria-hidden="true">
              ›
            </span>
          )}
          {c.onClick ? (
            <button type="button" className="crumbs__link" onClick={c.onClick}>
              {c.label}
            </button>
          ) : (
            <span className="crumbs__current">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function ScreenHead({
  title,
  label,
  value,
  decimals,
}: {
  title: string;
  label: string;
  value: string;
  decimals: string;
}) {
  return (
    <section className="detailHead">
      <h1 className="detailTitle">{title}</h1>
      <div className="detailValue">
        <span className="detailValue__label">{label}</span>
        <Amount int={value} dec={decimals} />
      </div>
    </section>
  );
}

/** Lista etykieta / wartość, rozdzielona liniami — serce obu ekranów. */
function InfoList({ rows }: { rows: InfoRow[] }) {
  return (
    <div className="infoList">
      {rows.map((r) => (
        <div className="infoRow" key={r.label}>
          <span className="infoRow__labelBlock">
            <span className="infoRow__label">{r.label}</span>
            {r.sub && <span className="infoRow__sub">{r.sub}</span>}
          </span>
          <span className="infoRow__value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- ekran emitenta ----------------------------- */

export function IssuerScreen({
  styleId,
  onBack,
  onOpenAsset,
  onOpenSeries,
}: {
  styleId: StyleId;
  onBack: () => void;
  onOpenAsset: () => void;
  onOpenSeries: (id: string) => void;
}) {
  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <div className="crumbRow">
            <Crumbs
              items={[
                { label: 'Portfel', onClick: onBack },
                { label: 'Aktywa', onClick: onBack },
                { label: 'Obligacje korporacyjne', onClick: onOpenAsset },
                { label: ISSUER.name },
              ]}
            />
          </div>

          <ScreenHead
            title={ISSUER.name}
            label={ISSUER.valueLabel}
            value={ISSUER.value}
            decimals={ISSUER.valueDecimals}
          />

          <section className="panel">
            <h2 className="sectionTitle">Podsumowanie emitenta</h2>
            <InfoList rows={ISSUER_SUMMARY} />
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="sectionTitle">Serie w portfelu</h2>
              <span className="panel__meta">{ISSUER_SERIES.length} serie</span>
            </div>

            <div className="seriesTable">
              <div className="seriesRow seriesRow--head">
                {SERIES_COLUMNS.map((c, i) => (
                  <span key={c} className={`table__th ${i > 0 ? 'is-right' : ''}`}>
                    {c}
                  </span>
                ))}
                <span />
              </div>

              {ISSUER_SERIES.map((s) => (
                <button
                  type="button"
                  className="seriesRow"
                  key={s.id}
                  onClick={() => onOpenSeries(s.id)}
                >
                  <span className="seriesRow__titleBlock">
                    <span className="seriesRow__name">{s.name}</span>
                    <span className="seriesRow__sub">{s.sub}</span>
                  </span>
                  <span className="seriesRow__cell">{s.rate}</span>
                  <span className="seriesRow__cell">{s.maturity}</span>
                  <span className="seriesRow__value">{s.value}</span>
                  <span className="seriesRow__chev" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </section>

          <Transactions
            rows={ISSUER_TRANSACTIONS}
            countNoun="zdarzenia"
            account="subline"
            locked={styleId === '3'}
          />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- ekran serii ----------------------------- */

export function SeriesScreen({
  styleId,
  onBack,
  onOpenAsset,
  onOpenIssuer,
}: {
  styleId: StyleId;
  onBack: () => void;
  onOpenAsset: () => void;
  onOpenIssuer: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <div className="crumbRow">
            <Crumbs
              items={[
                { label: 'Portfel', onClick: onBack },
                { label: 'Aktywa', onClick: onBack },
                { label: 'Obligacje korporacyjne', onClick: onOpenAsset },
                { label: ISSUER.name, onClick: onOpenIssuer },
                { label: SERIES_DETAIL.name },
              ]}
            />
          </div>

          <ScreenHead
            title={SERIES_DETAIL.name}
            label={SERIES_DETAIL.valueLabel}
            value={SERIES_DETAIL.value}
            decimals={SERIES_DETAIL.valueDecimals}
          />

          <section className="panel">
            <h2 className="sectionTitle">Parametry inwestycji</h2>

            {/* Pierwsza grupa zawsze widoczna, reszta po rozwinieciu. */}
            {(expanded ? SERIES_GROUPS : SERIES_GROUPS.slice(0, 1)).map((g) => (
              <div className="paramGroup" key={g.label}>
                <span className="panel__groupLabel">{g.label}</span>
                <InfoList rows={g.rows} />
              </div>
            ))}

            <div className="panel__footAction">
              <button
                type="button"
                className="btnGhost btnGhost--lg"
                aria-expanded={expanded}
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? SERIES_DETAIL.less : SERIES_DETAIL.more}
              </button>
            </div>
          </section>

          <Transactions
            rows={ISSUER_TRANSACTIONS}
            countNoun="zdarzenia"
            account="subline"
            locked={styleId === '3'}
          />
        </div>
      </div>
    </div>
  );
}
