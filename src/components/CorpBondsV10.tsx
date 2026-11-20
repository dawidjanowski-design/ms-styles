/* Obligacje korporacyjne w stylistyce nr 10 — wireframe B01 (Figma 1121:2941).
   Osobny komponent, a nie rozgalezienia w AssetDetail: ten ekran ma inny
   uklad sekcji i wlasne dane, wiec mieszanie go z poprzednia wersja
   zrobiloby z obu nieczytelna plataninke. */

import { useState } from 'react';
import {
  CORP_CLOSED,
  CORP_CLOSED_NOTE,
  CORP_CLOSED_TOTAL,
  CORP_COLS,
  CORP_FLOWS,
  CORP_FLOWS_FILTERS,
  CORP_FLOWS_NOTE,
  CORP_HEAD,
  CORP_OPS,
  CORP_OPS_FILTERS,
  CORP_OPS_FOOT,
  CORP_ROWS,
  CORP_STRUCTURE_NOTE,
  CORP_SUMMARY,
  CORP_TOTAL,
  CORP_WIDGETS,
  type CorpRow,
  type Metric,
} from '../data/corpV10';
import { CURRENCIES, type Currency } from '../data/currencies';
import { Amount, Pills } from './ui';

/* Kolor klasy bierzemy z palety nr 2 — ten sam, co na wykresie portfela. */
const SEG = '#046816';

function Select({ label }: { label: string }) {
  return (
    <button type="button" className="selectBtn">
      {label}
      <span aria-hidden="true">⌄</span>
    </button>
  );
}

/* Kafelek na przygaszonym tle — ten sam, co „Wynik portfela" na portfelu.
   Zastepuje kreski: blok sam sie odcina, wiec nie trzeba go podkreslac. */
function MetricTile({ metric, small }: { metric: Metric; small?: boolean }) {
  return (
    <div className={`corpTile ${small ? 'corpTile--small' : ''}`}>
      <span className="corpTile__label">{metric.label}</span>
      <span className="corpTile__value">{metric.value}</span>
      {metric.sub && <span className="corpTile__sub">{metric.sub}</span>}
    </div>
  );
}

/* ------------------------------ podsumowanie ------------------------------ */

function Summary() {
  const s = CORP_SUMMARY;
  return (
    <section className="corpCard">
      <div className="corpCard__top">
        <div className="corpCard__lead">
          <span className="corpCard__label">{s.label}</span>
          <div className="corpCard__amountRow">
            <Amount int={s.amount} dec={s.decimals} className="corpCard__amount" />
            <span className="corpCard__delta">{s.delta}</span>
          </div>
          <span className="corpCard__share">{s.share}</span>
        </div>
        {/* Liczniki opisuja sklad, nie wynik — stoja z boku kwoty, a nie
            w jednym rzedzie z metrykami. */}
        <dl className="corpFacts">
          {s.counters.map((c) => (
            <div className="corpFact" key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="corpTiles corpTiles--main">
        {s.main.map((m) => (
          <MetricTile key={m.label} metric={m} />
        ))}
      </div>

      <div className="corpTiles corpTiles--extra">
        {s.extra.map((m) => (
          <MetricTile key={m.label} metric={m} small />
        ))}
      </div>
    </section>
  );
}

/* --------------------------- struktura portfela --------------------------- */

function StructureRow({ row, total }: { row: CorpRow; total?: boolean }) {
  return (
    <div className={`corpRow ${total ? 'corpRow--total' : ''}`}>
      <span className="corpRow__issuer">
        {row.issuer}
        {!total && (
          <span className="corpRow__expand" aria-hidden="true">
            rozwiń serie ⌄
          </span>
        )}
      </span>
      <span className="corpRow__cell">{row.series}</span>
      <span className="corpRow__cell corpRow__cell--num">{row.rate}</span>
      <span className="corpRow__cell corpRow__cell--num">{row.maturity}</span>
      <span className="corpRow__cell corpRow__cell--num">
        {row.value}
        {row.valueSub && <span className="corpRow__sub">{row.valueSub}</span>}
      </span>
      <span className="corpRow__share">
        <span className="corpRow__shareValue">{String(row.share).replace('.', ',')}%</span>
        {!total && (
          <span className="corpShare">
            <span className="corpShare__fill" style={{ width: `${row.share}%`, background: SEG }} />
          </span>
        )}
      </span>
    </div>
  );
}

function Structure() {
  const [grouping, setGrouping] = useState('Emitenci');
  const [mode, setMode] = useState('Wartość bieżąca i rentowność');

  return (
    <section className="corpSection">
      <div className="corpSection__head">
        <h2 className="sectionTitle">Struktura portfela</h2>
        <div className="corpSection__actions">
          <Pills items={['Emitenci', 'Serie']} value={grouping} onChange={setGrouping} />
          <button type="button" className="btn btn--small">
            ⤢ Pełna tabela
          </button>
        </div>
      </div>

      <Pills
        items={['Wartość bieżąca i rentowność', 'Wartość nominalna i oprocentowanie']}
        value={mode}
        onChange={setMode}
      />

      <div className="corpTable">
        <div className="corpRow corpRow--head">
          {CORP_COLS.map((c) => (
            <span
              key={c.key}
              className={`corpRow__cell ${
                c.key === 'issuer' ? 'corpRow__issuer' : ''
              } ${c.key === 'share' || c.key === 'rate' || c.key === 'maturity' || c.key === 'value' ? 'corpRow__cell--num' : ''} ${
                c.active ? 'is-active' : ''
              }`}
            >
              {c.label}
              {c.sort && (
                <span className="corpRow__sort" aria-hidden="true">
                  {c.active ? '▾' : '⇅'}
                </span>
              )}
              {c.menu && (
                <span className="corpRow__menu" aria-hidden="true">
                  ⋯
                </span>
              )}
            </span>
          ))}
        </div>
        {CORP_ROWS.map((r) => (
          <StructureRow key={r.id} row={r} />
        ))}
        <StructureRow row={CORP_TOTAL} total />
      </div>

      <p className="corpNote">{CORP_STRUCTURE_NOTE}</p>
    </section>
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

            {w.bars && (
              <div className="corpSpark">
                <div className="corpSpark__bars">
                  {w.bars.heights.map((h, i) => (
                    <span
                      key={i}
                      className="corpSpark__bar"
                      style={{
                        height: `${Math.round(h * 100)}%`,
                        background: i === w.bars!.heights.length - 1 ? SEG : 'var(--progress-track)',
                      }}
                    />
                  ))}
                </div>
                <div className="corpSpark__axis">
                  <span>{w.bars.from}</span>
                  <span>{w.bars.to}</span>
                </div>
              </div>
            )}

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

function Flows() {
  return (
    <section className="corpSection corpSection--card">
      <div className="corpSection__head">
        <div className="corpSection__text">
          <h2 className="sectionTitle">Zapadalność i odsetki</h2>
          <p className="corpSection__sub">Planowane przepływy z portfela obligacji</p>
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
          <span className="corpLegend__dot" style={{ background: 'var(--progress-track)' }} />
          Odsetki
        </span>
      </div>

      <div className="corpFlows">
        {CORP_FLOWS.map((m) => (
          <div className="corpFlow" key={m.label}>
            <div className="corpFlow__stack">
              {m.nominal > 0 && (
                <span
                  className="corpFlow__bar"
                  style={{ height: `${Math.round(m.nominal * 100)}%`, background: SEG }}
                />
              )}
              <span
                className="corpFlow__bar"
                style={{
                  height: `${Math.round(m.interest * 100)}%`,
                  background: 'var(--progress-track)',
                }}
              />
            </div>
            <span className="corpFlow__label">{m.label}</span>
          </div>
        ))}
      </div>

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
          <button type="button" className="btn btn--small">
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
          Zobacz wszystkie w Operacjach<span aria-hidden="true">›</span>
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
            <span className="crumbs__sep" aria-hidden="true">
              ›
            </span>
            <button type="button" className="crumbs__link" onClick={onBack}>
              Aktywa
            </button>
            <span className="crumbs__sep" aria-hidden="true">
              ›
            </span>
            <span className="crumbs__current">{CORP_HEAD.title}</span>
          </nav>

          <div className="corpHead">
            <div className="corpHead__text">
              {/* Chevron przy tytule prowadzi do innych klas aktywow —
                  ten sam wzorzec co przelacznik rachunku. */}
              <h1 className="corpHead__title">
                {CORP_HEAD.title}
                <span className="corpHead__chev" aria-hidden="true">
                  ⌄
                </span>
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

          <Summary />
          <Structure />
          <Widgets />
          <Flows />
          <Closed />
          <Ops />
        </div>
      </div>
    </div>
  );
}
