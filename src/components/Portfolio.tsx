import { V10_ACCOUNT_DETAIL } from '../data/accountV10';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  ASSETS,
  CASH,
  CASH_BY_CURRENCY,
  LEGEND_ORDER,
  RESULT_RANGES,
  V10_ALLOCATION,
  V10_ASSETS,
  V10_CASH_ACTIONS,
  V10_ACCOUNT_GROUPS,
  V10_LEGEND_ORDER,
  V10_NAMES,
  type V10Account,
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
import { CashDrawerV10 } from './CashDrawerV10';
import { V10_CASH_DETAIL, type CashKind } from '../data/cashV10';
import {
  ASSET_PROMO,
  clientCash,
  clientGroups,
  clientResult,
  clientView,
  hasScenario,
  type ClientId,
} from '../data/clientsV10';
import { ChevronRight, Menu, Plus } from '../icons/Feather';

type StyleId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'makieta';
/** Makieta nie ma wlasnej palety — korzysta z nr 1, a kolor gasi CSS (--seg-flat).
    Nr 6 rozni sie od nr 4 wylacznie sekcja zdarzen, wiec siega po jego palete
    i jego kolejnosc klas, zamiast duplikowac je w danych. */
/* Nr 9 bada jedno: co sie stanie, gdy Asset Management i gotowka zamienia sie
   kolorami. Podmieniamy id w miejscu odczytu koloru, zamiast dublowac cala
   palete — paleta '4' zostaje nietknieta, a wykres, legenda i karty mowia to
   samo. Kreska na gotowce nie wedruje: to znacznik rodzaju, nie koloru, wiec
   jej odcien przestawiamy tokenami w tokens.css. */
const SWAP = { am: CASH.id, [CASH.id]: 'am' } as Record<string, string>;
const colorId = (id: string, s: StyleId) => (s === '9' ? SWAP[id] ?? id : id);

/* Nr 10 nie wnosi wlasnej palety ani kolejnosci — to nr 2 z inna trescia. */
const paletteOf = (s: StyleId): '1' | '2' | '3' | '4' | '5' =>
  s === 'makieta' ? '1' : s === '10' ? '2'
    : s === '6' || s === '7' || s === '8' || s === '9' ? '4' : s;
/** Kolejnosc pozycji w makiecie jest taka jak w nr 2. */
const orderOf = (s: StyleId): '1' | '2' | '3' | '4' | '5' =>
  s === 'makieta' || s === '10' ? '2'
    : s === '6' || s === '7' || s === '8' || s === '9' ? '4' : s;
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

/** Nazwa klasy; nr 10 uzywa pelnych nazw z wireframe'ow. */
const nameOf = (id: string, styleId: StyleId) =>
  (styleId === '10' && V10_NAMES[id]) || META[id].name;

/** Kolejność pozycji różni się między stylistykami; gotówka zawsze na końcu. */
function ordered(rows: AllocationRow[], styleId: StyleId): AllocationRow[] {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const out: AllocationRow[] = [];
  const kolejnosc = styleId === '10' ? V10_LEGEND_ORDER : LEGEND_ORDER[orderOf(styleId)];
  for (const id of kolejnosc) {
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
  /* Klasy z zerem (eksperyment nr 10, EUR) sa tylko w legendzie, nie na wykresie. */
  const segments = ordered(rows, styleId).filter((s) => s.share > 0);
  const total = segments.reduce((sum, s) => sum + s.share, 0);

  return (
    <div className="chart">
      {segments.map((s) => {
        const c = META[colorId(s.id, styleId)].colors[paletteOf(styleId)];
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
      className={`legendRow ${dimClass(id, hot)} ${share === '0,0%' || share === '0%' ? 'legendRow--zero' : ''}`}
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
      color={META[colorId(r.id, styleId)].colors[paletteOf(styleId)].legend}
      name={nameOf(r.id, styleId)}
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
  actions = false,
  keepEmpty = false,
  onOpenCash,
}: {
  cards: CashCard[];
  onOpenTransit?: () => void;
  /** nr 10: kazda karta otwiera swoja szuflade */
  onOpenCash?: (label: string) => void;
  /** nr 5 (Figma 997:519) pisze puste saldo jako 0,00, a nie myslnikiem */
  zeroAsNumber?: boolean;
  /** nr 10: wplata, wyplata i transfer stoja przy gotowce, a nie w menu */
  actions?: boolean;
  /** eksperyment nr 10 (EUR): puste karty zostaja, zeby sekcja nie miala dziury */
  keepEmpty?: boolean;
}) {
  const visible = keepEmpty ? cards : cards.filter((c) => !isEmpty(c));
  if (visible.length === 0) return null;

  return (
    <section className="cash">
      {actions ? (
        <div className="cash__head">
          <h2 className="sectionTitle">Gotówka i środki rozliczeniowe</h2>
          <div className="cash__actions">
            {V10_CASH_ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                className={`btn ${a.ghost ? 'btn--ghost' : ''} ${a.primary ? 'btn--primary' : ''}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h2 className="sectionTitle">Gotówka i środki rozliczeniowe</h2>
      )}
      <div className="cash__grid">
        {visible.map((card, i) => {
          const cashLink = onOpenCash && !isEmpty(card);
          const open = cashLink
            ? () => onOpenCash(card.label)
            : onOpenTransit && card.label === 'Środki w drodze'
              ? onOpenTransit
              : undefined;
          const link = !!open;
          return (
          <article
            className={`cashCard ${link ? 'cashCard--link' : ''} ${
              keepEmpty && isEmpty(card) ? 'cashCard--empty' : ''
            }`}
            key={i}
            role={cashLink ? 'button' : undefined}
            tabIndex={cashLink ? 0 : undefined}
            onClick={open}
            onKeyDown={cashLink ? (e) => e.key === 'Enter' && open?.() : undefined}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="cashCard__head">
                <span className="cashCard__label" style={{ flex: 1 }}>
                  {card.label}
                </span>
                {/* Nr 10: szewron (Feather, 18 px) na kazdej karcie gotowki —
                    znak „›" byl za maly i stal tylko przy srodkach w drodze. */}
                {actions ? (
                  <ChevronRight size={18} className="cashCard__chevIcon" />
                ) : (
                  link && (
                    <span className="cashCard__chev" aria-hidden="true">
                      ›
                    </span>
                  )
                )}
              </span>
              <Amount int={card.amount} dec={card.decimals} className="cashCard__amount" />
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Nr 10: bez wiersza USD w kartach gotowki. */}
              {card.rows.filter((r) => !(actions && r.label === 'USD')).map((r) => (
                <KeyValue
                  key={r.label}
                  label={r.label}
                  value={
                    keepEmpty && isEmpty(card)
                      ? '—'
                      : zeroAsNumber && r.value === '-'
                        ? '0,00'
                        : r.value
                  }
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

/* ------------------------ nr 10: rachunki (wireframe P02) ------------------------ */

/* Kwota pozycji jako liczba — do ustalenia, ktora klasa na rachunku wazy
   najwiecej, a wiec jaki kolor dostaje marker karty. */
const kwotaPLN = (v: string) => Number(v.replace(/[^\d]/g, '')) / 100;

/* Waluty rachunku: z pozycji gotowki w szufladach (cashV10); bez danych — PLN. */
function walutyRachunku(id: string) {
  const c = new Set<string>();
  Object.values(V10_CASH_DETAIL).forEach((d) =>
    d.accounts.filter((a) => a.id === id).forEach((a) => a.rows.forEach((r) => c.add(r.cur)))
  );
  return ['PLN', 'EUR', 'USD'].filter((x) => c.has(x) || (x === 'PLN' && c.size === 0));
}

function V10AccountCard({
  account,
  styleId,
  onOpen,
}: {
  account: V10Account;
  styleId: StyleId;
  onOpen?: () => void;
}) {
  /* Kolor karty bierze klasa, ktora wazy na tym rachunku najwiecej — marker
     ma cos znaczyc, a rachunki nr 10 nie maja wlasnej palety. */
  const dominanta = [...account.positions].sort((a, b) => kwotaPLN(b.value) - kwotaPLN(a.value))[0];
  const seg = dominanta
    ? META[colorId(dominanta.asset, styleId)].colors[paletteOf(styleId)].card
    : undefined;

  return (
    <article
      className={`acctCard acctV10 ${onOpen ? 'acctCard--link' : ''}`}
      style={{ ['--seg' as string]: seg }}
      role={onOpen ? 'link' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={onOpen ? (e) => e.key === 'Enter' && onOpen() : undefined}
    >
      {/* Uklad z review 11f: nazwa, pod nia numer, waluty rachunku po prawej,
          nizej kwota. */}
      <div className="acctV10__head">
        <div className="acctV10__titleBlock">
          <span className="acctV10__name">{account.name}</span>
          <span className="acctV10__number">{account.number}</span>
        </div>
        <span className="acctV10__cur">{walutyRachunku(account.id).join(' · ')}</span>
      </div>
      <Amount int={account.amount} dec={account.decimals} className="acctCard__amount" />

      {/* Struktura rachunku jako kreski — te same, co stopki slupkow na
          wykresie portfela: kolor klasy z palety nr 2, dlugosc z kwoty
          pozycji, wiec kreski i metryki pod spodem mowia to samo. */}
      <div className="v10Lines" aria-hidden="true">
        {account.positions.map((p) => {
          const c = META[colorId(p.asset, styleId)].colors[paletteOf(styleId)];
          return (
            <span
              key={p.asset}
              className="v10Lines__seg"
              style={{ flexGrow: kwotaPLN(p.value), background: c.chartFoot ?? c.chart }}
            />
          );
        })}
      </div>

      {account.limit && (
        <div className="acctCard__limit">
          <span className="acctCard__limitLabel">{account.limit.label}</span>
          <div className="acctCard__limitTop">
            <span className="acctCard__limitValue">{account.limit.value}</span>
            <span className="acctCard__limitPct">
              {Math.round(account.limit.progress * 100)}% wykorzystane
            </span>
          </div>
          <div className="acctCard__limitTrack">
            <div
              className="acctCard__limitFill"
              style={{ width: `${account.limit.progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Pozycje jako kafelki — ten sam wzorzec, co po drugiej stronie
          przelacznika, w karcie klasy aktywow. Gotowka nie miesza sie z
          instrumentami: stoi zawsze na dole karty, za kreska (review 11f). */}
      {(() => {
        const pozycja = (p: (typeof account.positions)[number]) => (
          <div className="acctV10__row" key={p.asset}>
            <span
              className="acctV10__mark"
              style={{ background: META[colorId(p.asset, styleId)].colors[paletteOf(styleId)].card }}
            />
            {/* Pelne nazwy klas jak w legendzie wykresu (V10_NAMES). */}
            <span className="acctV10__label">{p.asset === 'cash' ? p.label : nameOf(p.asset, styleId)}</span>
            <span className="acctV10__value">{p.value}</span>
          </div>
        );
        const inne = account.positions.filter((p) => p.asset !== 'cash');
        const gotowka = account.positions.find((p) => p.asset === 'cash');
        return (
          <>
            {inne.length > 0 && <div className="acctV10__rows">{inne.map(pozycja)}</div>}
            {gotowka && <div className="acctCard__cash">{pozycja(gotowka)}</div>}
          </>
        );
      })()}

    </article>
  );
}

/* Kafelek dzialania zajmuje kolejna komorke siatki — miejsce na rachunek,
   ktorego jeszcze nie ma, ma stac tam, gdzie by ten rachunek stanal.
   „Dodaj" i „Otworz" zostaja rozne: kolejny rachunek maklerski mozna miec,
   IKZE albo sie ma, albo nie. */
function V10AddTile({ title, sub }: { title: string; sub: string }) {
  return (
    <button type="button" className="v10Add">
      <span className="v10Add__plus">
        <Plus size={18} />
      </span>
      <span className="v10Add__title">{title}</span>
      <span className="v10Add__sub">{sub}</span>
    </button>
  );
}

function AccountsV10({
  styleId,
  onOpenAccount,
  groups = V10_ACCOUNT_GROUPS,
}: {
  styleId: StyleId;
  onOpenAccount: (id: string) => void;
  groups?: typeof V10_ACCOUNT_GROUPS;
}) {
  return (
    <div className="v10Groups">
      {groups.map((g) => (
        <section className="v10Group" key={g.id}>
          <div className="v10Group__head">
            <div className="v10Group__text">
              <h3 className="v10Group__title">{g.title}</h3>
              <p className="v10Group__sub">{g.sub}</p>
            </div>
          </div>
          <div className="v10Group__grid">
            {g.accounts.map((a) => (
              <V10AccountCard
                key={a.id}
                account={a}
                styleId={styleId}
                /* Karta rachunku nr 10 istnieje na razie tylko dla Glownego. */
                onOpen={V10_ACCOUNT_DETAIL[a.id] ? () => onOpenAccount(a.id) : undefined}
              />
            ))}
            {g.add && <V10AddTile title={g.add.title} sub={g.add.sub} />}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ----------------------------- wynik portfela ----------------------------- */

/* Sekcja z wireframe'u P01. Zakres zmienia wszystko w karcie naraz — kwote,
   stope zwrotu, cztery kafelki i okres w stopce — wiec trzymam go w jednym
   stanie, a nie w czterech. */
function ResultSection({ ranges = RESULT_RANGES }: { ranges?: typeof RESULT_RANGES }) {
  const [range, setRange] = useState(ranges[0].id);
  const data = ranges.find((r) => r.id === range) ?? ranges[0];

  return (
    <section className="result">
      <div className="result__head">
        <div className="result__titleRow">
          <h2 className="sectionTitle">Wynik portfela</h2>
          <span className="result__period">{data.note.split('okres ')[1] ?? ''}</span>
        </div>
        <Pills items={ranges.map((r) => r.id)} value={range} onChange={setRange} />
      </div>
      {/* Uklad z review 11f: po lewej wynik i XIRR, po prawej rachunek zmiany
          wartosci portfela — od wartosci poczatkowej do koncowej. */}
      <article className="resultCard rp">
        <div className="rp__lead">
          <span className="rp__label">Wynik inwestycyjny</span>
          <Amount int={data.amount} dec={data.decimals} className="rp__amount" />
          <span className="rp__rateLabel">Roczna stopa zwrotu (XIRR)</span>
          <span className={`rp__rate ${/^\d/.test(data.rate) && data.rate !== '0,00%' ? 'rp__rate--pos' : ''}`}>
            {/^\d/.test(data.rate) ? `+${data.rate}` : data.rate}
          </span>
          <button type="button" className="btn btn--ghost rp__btn">
            Pogłębiona analiza wyniku
            <ChevronRight size={16} className="rp__btnChev" />
          </button>
        </div>
        <div className="rp__change">
          <div className="rp__changeHead">
            <span className="rp__label">Zmiana wartości portfela</span>
            <span className="rp__cur">PLN</span>
          </div>
          <dl className="rp__rows">
            {[
              ...data.stats.filter((x) => x.label !== 'Wartość końcowa'),
              { label: 'Wynik inwestycyjny', value: `${data.amount},00` },
            ].map((x) => (
              <div className="rp__row" key={x.label}>
                <dt>{x.label}</dt>
                <dd>{x.value.replace(/ PLN$/, '')}</dd>
              </div>
            ))}
          </dl>
          <div className="rp__row rp__row--total">
            <span>Wartość końcowa</span>
            <span>{(data.stats.find((x) => x.label === 'Wartość końcowa')?.value ?? '').replace(/ PLN$/, '')}</span>
          </div>
        </div>
      </article>
    </section>
  );
}

/* ----------------------------- karty aktywów ----------------------------- */

const isDate = (m: Metric) => /^\d{2}\.\d{2}\.\d{4}$/.test(m.value);

/* Nr 10 (review 11f): przy wynikach i stopach zwrotu strzalka zamiast znaku
   +/−. Trojkat w gore zielony, w dol czerwony; liczba zostaje w kolorze tekstu. */
function TrendValue({ value, on }: { value: string; on: boolean }) {
  const m = on ? /^\s*([+−-])\s*(.*)$/.exec(value) : null;
  if (!m) return <>{value}</>;
  const up = m[1] === '+';
  return (
    <span className={`trend trend--${up ? 'up' : 'down'}`}>
      <svg className="trend__icon" width={10} height={10} viewBox="0 0 10 10" role="img" aria-label={up ? 'wzrost' : 'spadek'}>
        <path d={up ? 'M5 1.5 9 7.5H1z' : 'M5 8.5 1 2.5h8z'} fill="currentColor" />
      </svg>
      {m[2]}
    </span>
  );
}

function AssetCard({
  asset,
  styleId,
  onOpen,
  plain = false,
}: {
  asset: AssetClass;
  styleId: StyleId;
  onOpen?: () => void;
  /** scenariusz klienta: bez walut i tyldy z danych Dawida */
  plain?: boolean;
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
  /* Nr 10 czyta metryki z wireframe'u: Wynik 12M i stopa zwrotu 12M z przodu,
     liczniki pod kreska. Pozostale stylistyki zostaja przy swoich danych. */
  const v10 = styleId === '10' && !plain ? V10_ASSETS[asset.id] : undefined;
  /* Metryki w nr 10 te same co w nr 2 — z wireframe'u zostaje tylko naglowek
     karty (waluty, tylda przy kwocie). */
  /* Nr 10: na kartach obligacji bez „Najbliższy wykup” — data jest na ekranie
     szczegolow, karta zostaje przy wynikach. */
  const highlights =
    styleId === '10' ? asset.highlights.filter((m) => m.label !== 'Najbliższy wykup') : asset.highlights;
  const footRows = asset.rows;
  const dates = v5 ? asset.highlights.filter(isDate) : [];
  const results = asset.highlights.filter((m) => !dates.includes(m));
  const rows = makieta ? [] : v5 ? [...asset.rows, ...dates] : [...highlights, ...footRows];
  /* Wyrozniona metryka ma sens dopiero przy trzech i wiecej wynikach. Przy
     dwoch rozpychala karte w pionie, zamiast postawic je obok siebie. */
  const lead = highlights.length >= 3
    ? highlights[0]
    : null;
  const grid = lead ? highlights.slice(1) : highlights;
  const stripItems = makieta ? [...asset.rows, ...asset.highlights] : results;

  return (
    <article
      className={`assetCard ${onOpen ? 'assetCard--link' : ''}`}
      style={{ ['--seg' as string]: META[colorId(asset.id, styleId)].colors[paletteOf(styleId)].card }}
      onClick={onOpen}
    >
      <div className="assetCard__head">
        <div className="assetCard__title">
          {bar && <span className="assetCard__bar" />}
          <span className="assetCard__name">{nameOf(asset.id, styleId)}</span>
          {!bar && <span className="assetCard__dot" />}
          {v10?.currencies && <span className="assetCard__cur">{v10.currencies}</span>}
        </div>
        <Amount
          int={makieta || v10?.approx ? `≈ ${asset.amount}` : asset.amount}
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
              <span className="metricLead__value">
                <TrendValue value={lead.value} on={styleId === '10'} />
              </span>
            </div>
          )}
          {grid.length > 0 && (
            <div className="metrics">
              {grid.map((r) => (
                <div className="metric" key={r.label}>
                  <span className="metric__label">{r.label}</span>
                  <span className="metric__value">
                    <TrendValue value={r.value} on={styleId === '10'} />
                  </span>
                </div>
              ))}
            </div>
          )}
          {footRows.length > 0 && (
            <div className="metricFoot">
              {footRows.map((r) => (
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
/* Nad slupkiem jest tyle miejsca, co szerokosc slupka — pelna kwota sie nie
   miesci, wiec w spoczynku idzie skrot, a dokladna liczba czeka na hover. */
const shortPln = (v: number) => {
  if (v >= 1e6) return (v / 1e6).toFixed(2).replace('.', ',') + ' mln';
  if (v >= 1e4) return Math.round(v / 1e3).toLocaleString('pl-PL') + ' tys.';
  return Math.round(v).toLocaleString('pl-PL');
};

type Slice = {
  label: string; short: string; pct: number; value: string; brief: string;
  /** Kolory bierzemy z glownego wykresu struktury, nie z markera karty:
      pastelowe wypelnienie, nasycona stopka, nasycona kropka w legendzie. */
  fill: string; foot: string; dot: string; cash: boolean;
};
/* Udzialy licze wzgledem sumy pozycji, nie podanej sumy rachunku — inaczej
   paski dwoch rachunkow nie dobijalyby do 100% i wygladaly na blad renderu. */
function slices(account: Account, styleId: StyleId): Slice[] {
  const palette = paletteOf(styleId);
  const vals = account.rows.map((r) => toNum(r.value));
  const sum = vals.reduce((a, b) => a + b, 0) || 1;
  return account.rows.map((r, i) => {
    const id = CLASS_OF[r.label] ?? '';
    const c = META[colorId(id, styleId)]?.colors[palette];
    return {
      label: r.label,
      short: SHORT_OF[r.label] ?? r.label,
      pct: (vals[i] / sum) * 100,
      value: r.value,
      brief: shortPln(vals[i]),
      fill: c?.chart ?? 'var(--muted)',
      foot: c?.chartFoot ?? c?.chart ?? 'var(--muted)',
      dot: c?.legend ?? 'var(--muted)',
      cash: id === CASH.id,
    };
  });
}

/** Nr 7: pierscien jak na wykresie struktury, tylko dla jednego rachunku. */
function AcctRing({ account, styleId }: { account: Account; styleId: StyleId }) {
  const seg = slices(account, styleId);
  /* Luk = pastelowe cialo plus nasycony rant na zewnatrz: ten sam uklad,
     co cialo i stopka segmentu na wykresie struktury. Sam pastel na 11 px
     gubil sie na bieli, bo nie ma go co trzymac. */
  const RB = 25, RR = 31.6;
  const CB = 2 * Math.PI * RB;
  const CR = 2 * Math.PI * RR;
  let off = 0;
  return (
    <div className="acctRing">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="36" cy="36" r={RB} fill="none" stroke="var(--progress-track)" strokeWidth="11" />
        {seg.map((x) => {
          const f = x.pct / 100;
          const el = (
            <g className="acctRing__arc" key={x.label}>
              <circle
                cx="36" cy="36" r={RB} fill="none" stroke={x.fill} strokeWidth="11"
                strokeDasharray={`${CB * f} ${CB * (1 - f)}`}
                strokeDashoffset={-CB * off}
                transform="rotate(-90 36 36)"
              />
              <circle
                className="acctRing__rim"
                cx="36" cy="36" r={RR} fill="none" stroke={x.foot} strokeWidth="2.4"
                strokeDasharray={`${CR * f} ${CR * (1 - f)}`}
                strokeDashoffset={-CR * off}
                transform="rotate(-90 36 36)"
              />
            </g>
          );
          off += f;
          return el;
        })}
      </svg>
      <div className="acctRing__legend">
        {seg.map((x) => (
          <span className="acctRing__item" key={x.label}>
            <span className="acctRing__dot" style={{ background: x.dot }} />
            <span className="acctRing__label">{x.label}</span>
            <span className="acctRing__val">
              <span className="acctRing__amount">{x.value}</span>
              <span className="acctRing__pct">{fmtPct(x.pct)}</span>
            </span>
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
        <span className={`acctCol ${x.cash ? 'acctCol--cash' : ''}`} key={x.label}>
          <span className="acctCol__cap">
            <span className="acctCol__brief">{x.brief}</span>
            <span className="acctCol__detail">
              {fmtPct(x.pct)} · {x.value}
            </span>
          </span>
          <span
            className="acctCol__bar"
            style={{
              height: Math.max(6, (x.pct / max) * 64),
              ['--fill' as string]: x.fill,
              ['--foot' as string]: x.foot,
            }}
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
  const ring = styleId === '7' || styleId === '9';
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
        {/* Nr 7 i nr 8: limit wplat idzie na prawo od kwoty, jako sama
            informacja. Pasek postepu powtarzal to, co mowi tekst, a pod
            pierscieniem i slupkami robil drugi wykres w tej samej karcie. */}
        {(ring || cols) && account.strip && (
          <div className="acctCard__limitSide">
            <span className="acctCard__limitLabel">{account.strip.label}</span>
            <span className="acctCard__limitValue">{account.strip.value}</span>
          </div>
        )}
      </div>

      {!ring && !cols && account.strip && (
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

/* Nr 10: kafelek klasy, ktorej klient nie ma — ten sam przerywany kafelek
   co „Dodaj kolejny rachunek” w widoku Rachunki, w miejscu karty klasy. */
function AssetAddTile({ id, styleId }: { id: string; styleId: StyleId }) {
  const p = ASSET_PROMO[id];
  return <V10AddTile title={nameOf(id, styleId)} sub={`${p.first} ${p.rest}`} />;
}

/* Nr 10: pasek ekranu przy przewijaniu. Naglowek aplikacji odjezdza do gory,
   na jego miejsce wjezdza nizszy pasek z przyciskiem Menu i nazwa ekranu.
   Przelacznik walut nie ma tu kopii — ten sam element z podsumowania
   przykleja sie w pasku (patrz efekt w PortfolioScreen). Menu przywraca
   naglowek nad paskiem; przewiniecie w dol chowa go z powrotem. */
function ScreenBarV10({
  title,
  menuOpen,
  onMenu,
  onClose,
}: {
  title: string;
  menuOpen: boolean;
  onMenu: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!menuOpen) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last + 24) onClose();
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen, onClose]);
  return (
    <div className={`screenBar ${menuOpen ? 'screenBar--below' : ''}`} role="region" aria-label="Pasek ekranu">
      <div className="screenBar__inner">
        <button type="button" className="screenBar__menu" aria-expanded={menuOpen} onClick={onMenu}>
          <Menu size={16} />
          <span>Menu</span>
        </button>
        <span className="screenBar__title">{title}</span>
      </div>
    </div>
  );
}

export function PortfolioScreen({
  styleId,
  currency,
  onCurrencyChange,
  onOpenAsset,
  onOpenAccount,
  client = 'dj',
}: {
  styleId: StyleId;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenAsset: (id: string) => void;
  onOpenAccount: (id: string) => void;
  /** nr 10: scenariusz z przelacznika klientow */
  client?: ClientId;
}) {
  const [view, setView] = useState<string>('Aktywa');
  /* Inny klient niz Dawid = scenariusz z clientsV10: tylko PLN, bez ekranow
     szczegolow (te sa narysowane na danych Dawida). */
  const scen = styleId === '10' && hasScenario(client) ? client : null;
  const [hot, setHot] = useState<string | null>(null);
  /* Nr 10: przewijanie. Gdy przelacznik walut z podsumowania dojedzie do
     krawedzi, naglowek odjezdza, wjezdza pasek ekranu, a sam przelacznik
     przechodzi na position: fixed i zostaje w pasku po prawej. */
  const pillsRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!compact) setMenuOpen(false);
  }, [compact]);
  useEffect(() => {
    const pills = pillsRef.current?.querySelector<HTMLElement>('.pills');
    const holder = pillsRef.current;
    if (styleId !== '10' || !pills || !holder) return;
    const HEADER = 68;
    const BAR = 60;
    let docked = false;
    const undock = () => {
      pills.style.position = '';
      pills.style.top = '';
      pills.style.left = '';
      holder.style.minHeight = '';
      docked = false;
    };
    const update = () => {
      const h = holder.getBoundingClientRect();
      setCompact(h.top < HEADER);
      const target = (menuOpen ? HEADER : 0) + (BAR - pills.offsetHeight) / 2;
      if (h.top <= target) {
        if (!docked) holder.style.minHeight = `${pills.offsetHeight}px`;
        docked = true;
        pills.style.position = 'fixed';
        pills.style.top = `${target}px`;
        pills.style.left = `${h.right - pills.offsetWidth}px`;
      } else if (docked) undock();
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      undock();
    };
  }, [styleId, menuOpen, currency]);
  useEffect(() => {
    if (styleId !== '10') return;
    const root = document.documentElement;
    if (compact && !menuOpen) root.setAttribute('data-compact', '');
    else root.removeAttribute('data-compact');
    return () => root.removeAttribute('data-compact');
  }, [styleId, compact, menuOpen]);
  /* Panel srodkow w drodze dziala tylko w stylistykach nr 1 i nr 2. */
  const [transit, setTransit] = useState(false);
  /* Nr 10: otwarta szuflada karty gotowki. */
  const [cashKind, setCashKind] = useState<CashKind | null>(null);

  const data = scen ? clientView(scen) : VIEWS[currency];
  const currencies = scen ? (['Łącznie', 'PLN'] as const) : CURRENCIES;
  const openAsset = scen ? undefined : onOpenAsset;
  /* Nr 10 bierze udzialy i wiersz gotowki wprost z wireframe'u — ale tylko
     w widoku lacznym, bo tylko ten wireframe opisuje. W PLN/EUR/USD zostaja
     dane wspolne dla wszystkich stylistyk. */
  /* Nr 10 nie pokazuje podpisu pod gotowka w legendzie (we wszystkich
     walutach) — rozbicie jest w kartach gotowki tuz pod wykresem. */
  const allocation0 = (
    styleId === '10' && currency === 'Łącznie' && !scen ? V10_ALLOCATION : data.allocation
  ).map((r) => (styleId === '10' ? { ...r, sub: undefined } : r));
  /* Eksperyment nr 10 (EUR): legenda wypisuje wszystkie klasy, tez te,
     ktorych w tej walucie nie ma — z zerem, jak puste karty gotowki. */
  const allocation =
    styleId === '10' && currency === 'EUR'
      ? [
          ...allocation0,
          ...V10_LEGEND_ORDER.filter((id) => !allocation0.some((r) => r.id === id)).map(
            (id) => ({ id, share: 0, value: '0 EUR' })
          ),
        ]
      : allocation0;
  const title = <h1 className="pageTitle">Portfel</h1>;
  /* Panel pokazuje rozbicie calosci, wiec otwieramy go tylko w widoku
     lacznym — w PLN/EUR/USD jego liczby by nie pasowaly. */
  const transitHandler =
    styleId !== 'makieta' && currency === 'Łącznie' ? () => setTransit(true) : undefined;

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content content--airy">
          {/* Reset podswietlenia dopiero po wyjsciu z calego bloku. Gdyby
              zerowal go kazdy element z osobna, przejazd myszka przez odstep
              miedzy wierszami na moment wracalby do stanu domyslnego. */}
          {styleId === '10' &&
            compact &&
            createPortal(
              <ScreenBarV10
                title="Portfel"
                menuOpen={menuOpen}
                onMenu={() => setMenuOpen((o) => !o)}
                onClose={() => setMenuOpen(false)}
              />,
              document.body
            )}
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
                  <div className="summary__pills" ref={pillsRef}>
                    <Pills
                      items={currencies}
                      value={currency}
                      onChange={(v) => onCurrencyChange(v as Currency)}
                      locked={styleId === 'makieta'}
                    />
                  </div>
                </div>
              </div>
              <AllocationChart
                rows={allocation}
                styleId={styleId}
                hot={hot}
                setHot={setHot}
              />
            </div>
            <Legend
              rows={allocation}
              styleId={styleId}
              hot={hot}
              setHot={setHot}
              onOpenAsset={openAsset}
              cashCards={data.cashCards}
              total={data.total}
            />
          </section>

          <CashOverview
            cards={data.cashCards}
            onOpenTransit={transitHandler}
            onOpenCash={styleId === '10' ? (l) => setCashKind(l as CashKind) : undefined}
            zeroAsNumber={styleId === '5'}
            actions={styleId === '10'}
            /* Nr 10: wszystkie trzy karty zostaja w kazdej walucie i u kazdego
               klienta — pusta jest przygaszona, z kreska zamiast kwot. */
            keepEmpty={styleId === '10'}
          />

          {/* Wireframe stawia wynik miedzy gotowka a struktura: najpierw
              „ile mam pod reka”, potem „ile na tym zarobilem”, na koncu
              „z czego to sie sklada”. */}
          {styleId === '10' && (
            <ResultSection key={client} ranges={scen ? clientResult(scen) : undefined} />
          )}

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
            <div
              className={`assets__list ${
                /* Nr 10: karty klas na siatce nr 2 (odstepy, paddingi, metryki) —
                   tresc i kolejnosc zostaja z wireframe'u nr 10. */
                styleId === '10' && view === 'Rachunki' ? 'assets__list--plain' : ''
              }`}
            >
              {view === 'Rachunki' && styleId === '10' ? (
                /* Nr 10 grupuje rachunki typem, zgodnie z wireframem P02:
                   plaska lista nie pokazywala, ze kazdy typ rzadzi sie
                   innymi zasadami. */
                <AccountsV10
                  styleId={styleId}
                  onOpenAccount={onOpenAccount}
                  groups={scen ? clientGroups(scen) : undefined}
                />
              ) : view === 'Aktywa' ? (
                <>
                  {data.assets.map((a) => (
                    <AssetCard
                      key={a.id}
                      asset={a}
                      styleId={styleId}
                      plain={!!scen}
                      onOpen={openAsset && DETAIL_ASSETS.has(a.id) ? () => openAsset(a.id) : undefined}
                    />
                  ))}
                  {/* Nr 10: klasy, ktorych klient nie ma — kafelek zamiast karty. */}
                  {styleId === '10' &&
                    currency === 'Łącznie' &&
                    V10_LEGEND_ORDER.filter((id) => !data.assets.some((a) => a.id === id)).map((id) => (
                      <AssetAddTile key={`add-${id}`} id={id} styleId={styleId} />
                    ))}
                </>
              ) : (
                data.accounts.map((a) => (
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
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <InTransitDrawer open={transit} onClose={() => setTransit(false)} />
      {styleId === '10' && (
        <CashDrawerV10
          kind={cashKind}
          currency={currency}
          onClose={() => setCashKind(null)}
          onOpenAccount={(id) => {
            setCashKind(null);
            onOpenAccount(id);
          }}
          canOpen={(id) => !scen && !!V10_ACCOUNT_DETAIL[id]}
          detail={scen ? clientCash(scen) : undefined}
        />
      )}
    </div>
  );
}
