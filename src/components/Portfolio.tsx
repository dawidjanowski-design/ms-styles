import { useState, type ReactNode } from 'react';
import {
  ASSETS,
  CASH,
  CASH_BY_CURRENCY,
  LEGEND_ORDER,
  type Account,
  type AssetClass,
  type Metric,
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

type StyleId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'makieta';
/** Makieta nie ma wlasnej palety — korzysta z nr 1, a kolor gasi CSS (--seg-flat).
    Nr 6 rozni sie od nr 4 wylacznie sekcja zdarzen, wiec siega po jego palete
    i jego kolejnosc klas, zamiast duplikowac je w danych. */
const paletteOf = (s: StyleId): '1' | '2' | '3' | '4' | '5' =>
  s === 'makieta' ? '1' : s === '6' || s === '7' || s === '8' ? '4' : s;
/** Kolejnosc pozycji w makiecie jest taka jak w nr 2. */
const orderOf = (s: StyleId): '1' | '2' | '3' | '4' | '5' =>
  s === 'makieta' ? '2' : s === '6' || s === '7' || s === '8' ? '4' : s;
type HoverProps = { hot: string | null; setHot: (id: string | null) => void };

/** Klasy aktywów, które mają już własny ekran szczegółów. */
export const DETAIL_ASSETS = new Set(['corp']);

const dimClass = (id: string, hot: string | null) =>
  hot === null ? '' : hot === id ? 'is-hot' : 'is-dim';

/** Nazwa i paleta po id — wspólne dla wszystkich walut. */
export const META: Record<
  string,
  { name: string; colors: Record<'1' | '2' | '3' | '4' | '5', Palette> }
> = {
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
    <div className="chart">
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
  dot = true,
}: {
  id: string;
  color: string;
  name: string;
  share: string;
  value: string;
  onOpen?: () => void;
  /** pozycje gotowki w nr 5 stoja bez kropki, kolumna sama mowi, czym sa */
  dot?: boolean;
} & HoverProps) {
  return (
    <button
      type="button"
      className={`legendRow ${dimClass(id, hot)}`}
      style={{ ['--seg' as string]: color, cursor: onOpen ? 'pointer' : 'default' }}
      onClick={onOpen}
      onMouseEnter={() => setHot(id)}
      onFocus={() => setHot(id)}
      onBlur={() => setHot(null)}
    >
      {dot && <span className="legendRow__dot" />}
      <span className="legendRow__name">{name}</span>
      <span className="legendRow__share">{share}</span>
      <span className="legendRow__value">{value}</span>
    </button>
  );
}

/* Kotwica obejmuje sam wiersz, bez podlinii — inaczej dymek odjezdzalby
   od kwoty o wysokosc tekstu pod spodem. */
function CashTip({ children }: { children: ReactNode }) {
  return (
    <div className="cashAnchor">
      {children}
      <div className="cashTip" role="tooltip">
        <span className="cashTip__title">{CASH_BY_CURRENCY.title}</span>
        <div className="cashTip__rows">
          {CASH_BY_CURRENCY.rows.map((r) => (
            <div className="cashTip__row" key={r.label}>
              <span className="cashTip__label">{r.label}</span>
              <span className="cashTip__value">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const num = (s: string) => Number(s.replace(/\s/g, ''));
/** ',00 PLN' -> 'PLN' */
const unitOf = (decimals: string) => decimals.replace(/^,\d+\s*/, '');

/** Kolor klasy aktywow do uzycia poza tym plikiem, np. na osi czasu. */
export const assetColor = (id: string, palette: '1' | '2' | '3' | '4' | '5') =>
  META[id]?.colors[palette].card;

export function Legend({
  rows,
  styleId,
  hot,
  setHot,
  onOpenAsset,
  cashTooltip = false,
  cashCards,
  total,
}: {
  rows: AllocationRow[];
  styleId: StyleId;
  onOpenAsset?: (id: string) => void;
  /** dymek z rozbiciem wolnej gotowki na waluty — tylko na pulpicie */
  cashTooltip?: boolean;
  /** karty gotowki i suma widoku, z nich nr 5 sklada kolumne „Gotówka" */
  cashCards?: CashCard[];
  total?: string;
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

  /* Nr 5 (Figma 997:519): dwie kolumny, aktywa i gotowka. Gotowka jest
     rozpisana na te same trzy pozycje, co karty pod spodem, a udzial liczy
     sie od calego portfela, wiec trzy wiersze sumuja sie do segmentu gotowki na
     wykresie. Wszystkie trzy podswietlaja ten jeden segment. */
  if (styleId === '5' && cashCards && total) {
    const parts = cash ? cashCards.filter((c) => !isEmpty(c)) : [];
    return (
      <div className="legend legend--split">
        <div className="legend__col">
          <h3 className="legend__head">Aktywa</h3>
          <div className="legend__rows">{assets.map(row)}</div>
        </div>
        {parts.length > 0 && (
          <div className="legend__col">
            <h3 className="legend__head">Gotówka</h3>
            <div className="legend__rows">
              {parts.map((c) => {
                const r = (
                  <LegendRow
                    key={c.label}
                    id={CASH.id}
                    color={META[CASH.id].colors['5'].legend}
                    name={c.label}
                    share={pct((num(c.amount) / num(total)) * 100)}
                    value={`${c.amount} ${unitOf(c.decimals)}`}
                    hot={hot}
                    setHot={setHot}
                    dot={false}
                  />
                );
                return cashTooltip && c.label === CASH_BY_CURRENCY.title ? (
                  <CashTip key={c.label}>{r}</CashTip>
                ) : (
                  r
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="legend">
      <div className="legend__rows">{assets.map(row)}</div>

      {cash && (
        <div className="legend__cash">
          <div className="legend__cashInner">
            {cashTooltip ? <CashTip>{row(cash)}</CashTip> : <div>{row(cash)}</div>}
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
  zeroAsNumber = false,
}: {
  cards: CashCard[];
  onOpenTransit?: () => void;
  /** nr 5 (Figma 997:519) pisze puste saldo jako 0,00, a nie myslnikiem */
  zeroAsNumber?: boolean;
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
                <KeyValue
                  key={r.label}
                  label={r.label}
                  value={zeroAsNumber && r.value === '-' ? '0,00' : r.value}
                />
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

const isDate = (m: Metric) => /^\d{2}\.\d{2}\.\d{4}$/.test(m.value);

function AssetCard({
  asset,
  styleId,
  onOpen,
}: {
  asset: AssetClass;
  styleId: StyleId;
  onOpen?: () => void;
}) {
  const makieta = styleId === 'makieta';
  /* Kafelki w kazdej stylistyce poza makieta i nr 5: etykieta stoi nad
     wartoscia, zamiast po drugiej stronie karty. Znacznik klasy to osobna
     sprawa: kreska przed nazwa w nr 2, nr 3, nr 4 i nr 6, kropka po nazwie
     w nr 1, nr 5 i w makiecie. */
  const bar = styleId !== '1' && styleId !== '5' && styleId !== 'makieta';
  /* Nr 5 (Figma 997:519) zostaje przy budowie z dawnego nr 1: wiersze
     i szary pasek metryk. Data nie jest wynikiem, wiec „Najbliższy wykup"
     schodzi z paska do wierszy, a w pasku zostaja same liczby. */
  const v5 = styleId === '5';
  const tiles = !makieta && !v5;
  const strip = makieta || v5;
  const dates = v5 ? asset.highlights.filter(isDate) : [];
  const results = asset.highlights.filter((m) => !dates.includes(m));
  const rows = makieta ? [] : v5 ? [...asset.rows, ...dates] : [...asset.highlights, ...asset.rows];
  /* Wyrozniona metryka ma sens dopiero przy trzech i wiecej wynikach. Przy
     dwoch rozpychala karte w pionie, zamiast postawic je obok siebie. */
  const lead = asset.highlights.length >= 3 ? asset.highlights[0] : null;
  const grid = lead ? asset.highlights.slice(1) : asset.highlights;
  const stripItems = makieta ? [...asset.rows, ...asset.highlights] : results;

  return (
    <article
      className={`assetCard ${onOpen ? 'assetCard--link' : ''}`}
      style={{ ['--seg' as string]: asset.colors[paletteOf(styleId)].card }}
      onClick={onOpen}
    >
      <div className="assetCard__head">
        <div className="assetCard__title">
          {bar && <span className="assetCard__bar" />}
          <span className="assetCard__name">{asset.name}</span>
          {!bar && <span className="assetCard__dot" />}
        </div>
        <Amount
          int={makieta ? `≈ ${asset.amount}` : asset.amount}
          dec={asset.amountDecimals}
          className="assetCard__amount"
        />
      </div>

      {!makieta && <div className="divider" />}

      {tiles ? (
        /* Hierarchia zamiast listy etykieta-wartosc. Dane same sie dziela:
           highlights to wyniki, rows to liczniki w rodzaju „Emitent 1".
           Pierwszy wynik idzie na gore duzym stopniem, reszta w siatce,
           a liczniki schodza do cichej stopki. W liscie wartosc stala po
           drugiej stronie karty, metr od swojej etykiety. */
        <>
          {lead && (
            <div className="metricLead">
              <span className="metric__label">{lead.label}</span>
              <span className="metricLead__value">{lead.value}</span>
            </div>
          )}
          {grid.length > 0 && (
            <div className="metrics">
              {grid.map((r) => (
                <div className="metric" key={r.label}>
                  <span className="metric__label">{r.label}</span>
                  <span className="metric__value">{r.value}</span>
                </div>
              ))}
            </div>
          )}
          {asset.rows.length > 0 && (
            <div className="metricFoot">
              {asset.rows.map((r) => (
                <span className="metricFoot__item" key={r.label}>
                  {r.label}
                  <strong>{r.value}</strong>
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        rows.length > 0 && (
          <div className="assetCard__rows">
            {rows.map((r) => (
              <KeyValue key={r.label} label={r.label} value={r.value} px={strip ? 20 : 0} />
            ))}
          </div>
        )
      )}

      {strip && stripItems.length > 0 && (
        <div className={`strip ${stripItems.length > 2 ? 'strip--dense' : ''}`}>
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


/* Pozycje rachunku nosza nazwe klasy, nie jej id — mapujemy raz, zeby
   pierscien i slupki braly te sama palete, co wykres struktury portfela. */
const CLASS_OF: Record<string, string> = {
  'Obligacje korporacyjne': 'corp',
  Obligacje: 'corp',
  'Obligacje skarbowe': 'skarb',
  'Fundusze zamknięte (FIZ)': 'fiz',
  'Fundusze otwarte (FIO)': 'fio',
  'Wolne środki': 'cash',
};
const SHORT_OF: Record<string, string> = {
  'Obligacje korporacyjne': 'Korporacyjne',
  'Obligacje skarbowe': 'Skarbowe',
  'Fundusze zamknięte (FIZ)': 'FIZ',
  'Fundusze otwarte (FIO)': 'FIO',
  'Wolne środki': 'Wolne',
};
const toNum = (v: string) =>
  Number(v.replace(/\s|\u00a0/g, '').replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
const fmtPct = (v: number) =>
  (v >= 10 ? Math.round(v) : v.toFixed(1).replace('.', ',')) + '%';

type Slice = { label: string; short: string; color: string; pct: number };
/* Udzialy licze wzgledem sumy pozycji, nie podanej sumy rachunku — inaczej
   paski dwoch rachunkow nie dobijalyby do 100% i wygladaly na blad renderu. */
function slices(account: Account, styleId: StyleId): Slice[] {
  const palette = paletteOf(styleId);
  const vals = account.rows.map((r) => toNum(r.value));
  const sum = vals.reduce((a, b) => a + b, 0) || 1;
  return account.rows.map((r, i) => ({
    label: r.label,
    short: SHORT_OF[r.label] ?? r.label,
    color: assetColor(CLASS_OF[r.label] ?? '', palette) ?? 'var(--muted)',
    pct: (vals[i] / sum) * 100,
  }));
}

/** Nr 7: pierscien jak na wykresie struktury, tylko dla jednego rachunku. */
function AcctRing({ account, styleId }: { account: Account; styleId: StyleId }) {
  const seg = slices(account, styleId);
  const C = 2 * Math.PI * 26;
  let off = 0;
  return (
    <div className="acctRing">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="36" cy="36" r="26" fill="none" stroke="var(--progress-track)" strokeWidth="11" />
        {seg.map((x) => {
          const len = (C * x.pct) / 100;
          const el = (
            <circle
              key={x.label}
              cx="36"
              cy="36"
              r="26"
              fill="none"
              stroke={x.color}
              strokeWidth="11"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-off}
              transform="rotate(-90 36 36)"
            />
          );
          off += len;
          return el;
        })}
      </svg>
      <div className="acctRing__legend">
        {seg.map((x) => (
          <span className="acctRing__item" key={x.label}>
            <span className="acctRing__dot" style={{ background: x.color }} />
            <span className="acctRing__label">{x.label}</span>
            <span className="acctRing__pct">{fmtPct(x.pct)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Nr 8: wysokosc slupka to udzial — klasy porownuja sie miedzy soba. */
function AcctCols({ account, styleId }: { account: Account; styleId: StyleId }) {
  const seg = slices(account, styleId);
  const max = Math.max(...seg.map((x) => x.pct), 1);
  return (
    <div className="acctCols">
      {seg.map((x) => (
        <span className="acctCol" key={x.label}>
          <span className="acctCol__pct">{fmtPct(x.pct)}</span>
          <span
            className="acctCol__bar"
            style={{ height: Math.max(4, (x.pct / max) * 64), background: x.color }}
          />
          <span className="acctCol__label">{x.short}</span>
        </span>
      ))}
    </div>
  );
}

function AccountCard({
  account,
  styleId,
  onOpen,
}: {
  account: Account;
  styleId: StyleId;
  onOpen?: () => void;
}) {
  const makieta = styleId === 'makieta';
  const ring = styleId === '7';
  const cols = styleId === '8';

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
        {/* Nr 8: limit wplat idzie na prawo od kwoty, jako sama informacja.
            Pasek postepu powtarzal to, co mowi tekst, a pod slupkami klas
            robil drugi wykres w tej samej karcie. */}
        {cols && account.strip && (
          <div className="acctCard__limitSide">
            <span className="acctCard__limitLabel">{account.strip.label}</span>
            <span className="acctCard__limitValue">{account.strip.value}</span>
          </div>
        )}
      </div>

      {!cols && account.strip && (
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
          {ring ? (
            <AcctRing account={account} styleId={styleId} />
          ) : cols ? (
            <AcctCols account={account} styleId={styleId} />
          ) : !makieta ? (
            /* Ten sam wzorzec, co po drugiej stronie przelacznika: pozycje
               rachunku jako kafelki. */
            <div className="metrics">
              {account.rows.map((r) => (
                <div className="metric" key={r.label}>
                  <span className="metric__label">{r.label}</span>
                  <span className="metric__value">{r.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="acctCard__rows">
              {account.rows.map((r) => (
                <button type="button" className="acctRow" key={r.label}>
                  <span className="acctRow__label">{r.label}</span>
                  <span className="acctRow__value">{r.value}</span>
                  <span className="acctRow__chev">›</span>
                </button>
              ))}
            </div>
          )}
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
  /* Panel pokazuje rozbicie calosci, wiec otwieramy go tylko w widoku
     lacznym — w PLN/EUR/USD jego liczby by nie pasowaly. */
  const transitHandler =
    styleId !== 'makieta' && currency === 'Łącznie' ? () => setTransit(true) : undefined;

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          {/* Reset podswietlenia dopiero po wyjsciu z calego bloku. Gdyby
              zerowal go kazdy element z osobna, przejazd myszka przez odstep
              miedzy wierszami na moment wracalby do stanu domyslnego. */}
          <section
            className="summary"
            style={{ paddingTop: 'var(--summary-pt)' }}
            onMouseLeave={() => setHot(null)}
          >
            <div className="summary__top">
              <div className="summary__titleBlock">
                {title}
                <div className="summary__head">
                  <Amount int={data.total} dec={data.decimals} />
                  <Pills
                    items={CURRENCIES}
                    value={currency}
                    onChange={(v) => onCurrencyChange(v as Currency)}
                    locked={styleId === 'makieta'}
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
              cashCards={data.cashCards}
              total={data.total}
            />
          </section>

          <CashOverview
            cards={data.cashCards}
            onOpenTransit={transitHandler}
            zeroAsNumber={styleId === '5'}
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
                locked={styleId === 'makieta'}
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
                        styleId !== 'makieta' && a.id === 'ike' && currency === 'Łącznie'
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
