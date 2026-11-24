import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from '../icons/Feather';
import { Amount, Pills } from './ui';
import { V10_CASH_DETAIL, type CashKind, type CashRow } from '../data/cashV10';

/* Nr 10: szuflada karty gotowki. Mechanika z review (wersja 11f): suma na
   gorze, pod nia rachunki z pozycjami, przy wolnej gotowce grupy walutowe.
   Waluta wybrana na Portfelu zaweza zawartosc. Styl nasz — tokeny nr 10. */

const CURS = ['PLN', 'EUR', 'USD'] as const;

const parse = (t?: string) => {
  const m = /([\d ]+),(\d{2})/.exec(t ?? '');
  if (!m) return 0;
  const v = parseFloat(m[1].replace(/\s/g, '') + '.' + m[2]);
  return /^\s*[−-]/.test(t ?? '') ? -v : v;
};
const fmt = (v: number, cur: string, signed = false) => {
  const r = Math.round(Math.abs(v) * 100);
  const int = String(Math.floor(r / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const dec = String(r % 100).padStart(2, '0');
  return `${signed ? (v < 0 ? '− ' : '+ ') : ''}${int},${dec} ${cur}`;
};
/* W widoku lacznym wszystko w PLN: pozycje walutowe licza sie po rownowartosci. */
const inPln = (r: CashRow) => (r.cur === 'PLN' ? parse(r.amount) : Math.sign(parse(r.amount)) * parse(r.sub));
const odmiana = (n: number) => (n === 1 ? 'rachunek' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'rachunki' : 'rachunków');

export function CashDrawerV10({
  kind,
  currency,
  onClose,
  onOpenAccount,
  canOpen,
}: {
  kind: CashKind | null;
  currency: string;
  onClose: () => void;
  onOpenAccount: (id: string) => void;
  canOpen: (id: string) => boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  /* Srodki w drodze: delikatny filtr kierunku — naleznosci (przychodzace)
     i zobowiazania (wychodzace). */
  const [dir, setDir] = useState<string>('Wszystkie');
  useEffect(() => setDir('Wszystkie'), [kind]);
  useEffect(() => {
    if (!kind) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>('.drawer__close')?.focus(), 30);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      prev?.focus?.();
    };
  }, [kind, onClose]);
  if (!kind) return null;

  const d = V10_CASH_DETAIL[kind];
  const all = currency === 'Łącznie';
  const signed = kind === 'Środki w drodze';
  const showFilter = signed && d.accounts.some((a) => a.rows.some((r) => all || r.cur === currency));
  const accounts = d.accounts
    .map((a) => ({
      ...a,
      rows: a.rows.filter(
        (r) =>
          (all || r.cur === currency) &&
          (dir === 'Wszystkie' || r.dir === (dir === 'Należności' ? 'in' : 'out'))
      ),
    }))
    .filter((a) => a.rows.length);
  const unit = all ? 'PLN' : currency;
  const sumOf = (rows: CashRow[]) => rows.reduce((t, r) => t + (all ? inPln(r) : parse(r.amount)), 0);
  const total = accounts.reduce((t, a) => t + sumOf(a.rows), 0);
  const [int, dec] = (() => {
    const s = fmt(total, unit, signed && total !== 0);
    const i = s.lastIndexOf(',');
    return [s.slice(0, i), s.slice(i)];
  })();
  const byCur = CURS.map((c) => ({
    cur: c,
    rows: accounts.flatMap((a) => a.rows.filter((r) => r.cur === c).map((r) => ({ a, r }))),
  })).filter((g) => g.rows.length);

  const go = (id: string) => (canOpen(id) ? () => onOpenAccount(id) : undefined);

  return (
    <div className="drawerRoot">
      <div className="drawerBackdrop" onClick={onClose} />
      <aside className="drawer cdr" role="dialog" aria-modal="true" aria-labelledby="cdrTitle" ref={ref}>
        <div className="drawer__head">
          <div className="drawer__titleBlock">
            <h2 className="drawer__title" id="cdrTitle">
              {kind}
            </h2>
            <span className="drawer__sub">{d.sub}</span>
          </div>
          <button type="button" className="drawer__close" aria-label="Zamknij" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cdr__sum">
          <span className="cdr__sumLabel">
            {dir === 'Należności' ? 'Należności' : dir === 'Zobowiązania' ? 'Zobowiązania' : 'Łącznie'}
            {all ? '' : ` w ${currency}`}
          </span>
          <Amount int={int} dec={dec} />
          {all && byCur.length > 1 && kind !== 'Wolna gotówka' && (
            <div className="cdr__break">
              {byCur.map((g) => (
                <div className="cdr__breakRow" key={g.cur}>
                  <span>{g.cur}</span>
                  <span className="cdr__breakVal">
                    {fmt(g.rows.reduce((t, x) => t + parse(x.r.amount), 0), g.cur, signed)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showFilter && (
          <div className="cdr__filter">
            <Pills items={['Wszystkie', 'Należności', 'Zobowiązania']} value={dir} onChange={setDir} />
          </div>
        )}

        {accounts.length === 0 && (
          <p className="drawer__note">
            {dir === 'Wszystkie' ? 'Brak pozycji w tej walucie.' : `Brak ${dir === 'Należności' ? 'należności' : 'zobowiązań'} w rozliczeniu.`}
          </p>
        )}

        {/* Wolna gotowka: grupy walutowe, w kazdej rachunki z saldem. */}
        {kind === 'Wolna gotówka' &&
          byCur.map((g) => {
            const pln = g.cur === 'PLN' ? 0 : g.rows.reduce((t, x) => t + parse(x.r.sub), 0);
            return (
              <section className="cdr__group" key={g.cur}>
                <div className="cdr__gHead">
                  <div className="cdr__gTitle">
                    <span className="cdr__gName">{g.cur}</span>
                    <span className="cdr__gMeta">
                      {g.rows.length} {odmiana(g.rows.length)}
                      {pln ? ` · równowartość ${fmt(pln, 'PLN')}` : ''}
                    </span>
                  </div>
                  <span className="cdr__gTotal">{fmt(g.rows.reduce((t, x) => t + parse(x.r.amount), 0), g.cur)}</span>
                </div>
                <div className="cdr__rows">
                  {g.rows.map(({ a, r }) => {
                    const open = go(a.id);
                    return (
                      <div
                        className={`cdr__row ${open ? 'cdr__row--link' : ''}`}
                        key={a.id + r.cur}
                        role={open ? 'link' : undefined}
                        tabIndex={open ? 0 : undefined}
                        onClick={open}
                        onKeyDown={open ? (e) => e.key === 'Enter' && open() : undefined}
                      >
                        <div className="cdr__rowMain">
                          <span className="cdr__rowTitle">{a.name}</span>
                          <span className="cdr__rowMeta">
                            {a.number}
                            {r.cur === 'PLN' ? '' : `/${r.cur}`}
                          </span>
                        </div>
                        <span className="cdr__rowAmt">{r.amount}</span>
                        {open && <ChevronRight size={16} className="cdr__chev" />}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

        {/* Zablokowana i w drodze: rachunki, pod kazdym jego pozycje. */}
        {kind !== 'Wolna gotówka' &&
          accounts.map((a) => {
            const open = go(a.id);
            return (
              <section className="cdr__group" key={a.id}>
                <div
                  className={`cdr__gHead ${open ? 'cdr__gHead--link' : ''}`}
                  role={open ? 'link' : undefined}
                  tabIndex={open ? 0 : undefined}
                  onClick={open}
                  onKeyDown={open ? (e) => e.key === 'Enter' && open() : undefined}
                >
                  <div className="cdr__gTitle">
                    <span className="cdr__gName">{a.name}</span>
                    <span className="cdr__gMeta">{a.number}</span>
                  </div>
                  <span className="cdr__gTotal">{fmt(sumOf(a.rows), unit, signed)}</span>
                  {open && <ChevronRight size={16} className="cdr__chev" />}
                </div>
                <ul className="cdr__rows">
                  {a.rows.map((r, i) => {
                    const [head, ...rest] = r.title.split(' · ');
                    const what = rest.join(' · ');
                    const meta = [r.tag, what && what[0].toUpperCase() + what.slice(1), r.date, r.sub && (r.cur === 'PLN' ? r.sub : `równowartość ${r.sub}`)]
                      .filter(Boolean)
                      .join(' · ');
                    return (
                      <li className={`cdr__row ${r.dir ? `cdr__row--${r.dir}` : ''}`} key={i}>
                        {r.dir && (
                          <span className="cdr__dir" aria-label={r.dir === 'in' ? 'Przychodzące' : 'Wychodzące'}>
                            {r.dir === 'in' ? '↓' : '↑'}
                          </span>
                        )}
                        <div className="cdr__rowMain">
                          <span className="cdr__rowTitle">{head}</span>
                          {meta && <span className="cdr__rowMeta">{meta}</span>}
                        </div>
                        <span className="cdr__rowAmt">{r.amount}</span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

        {d.note && (all || kind !== 'Wolna gotówka') && <p className="drawer__note cdr__note">{d.note}</p>}
      </aside>
    </div>
  );
}
