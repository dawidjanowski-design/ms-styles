import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CORP_ISSUERS, CORP_SERIES_DETAIL, type Serie } from '../data/corpV10';
import { kwota, procent, serieW, w } from '../data/corpMath';
import type { Currency } from '../data/currencies';
import { Pills } from './ui';
import { ChevronDown, X } from '../icons/Feather';

/* Nr 10: „Pełna tabela” struktury obligacji na calym ekranie. Na karcie
   zostaje skrot (emitent albo seria, szesc kolumn); tutaj kazda seria ma
   wszystkie kolumny, a w trybie Emitenci serie stoja pod swoim emitentem
   z podsumowaniem w wierszu grupy. Sortowanie dziala w obrebie grup. */

type Col = {
  id: string;
  label: string;
  num?: boolean;
  get: (s: Serie) => string | number;
  show: (s: Serie) => string;
};

const dataKey = (d: string) => d.split('.').reverse().join('');

export function CorpFullTableV10({
  open,
  currency,
  onClose,
  onOpenIssuer,
  onOpenSeries,
}: {
  open: boolean;
  currency: Currency;
  onClose: () => void;
  onOpenIssuer: (issuer: string) => void;
  onOpenSeries: (id: string) => void;
}) {
  const [grouping, setGrouping] = useState('Emitenci');
  const [sort, setSort] = useState<{ col: string; dir: 1 | -1 }>({ col: 'value', dir: -1 });
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, onClose]);

  const serie = serieW(currency);
  const total = serie.reduce((a, s) => a + w(s, 'value', currency), 0);

  const cols: Col[] = useMemo(
    () => [
      { id: 'name', label: 'Seria', get: (s) => s.ticker, show: (s) => `${s.ticker} · ${s.name}` },
      { id: 'count', label: 'Sztuk', num: true, get: (s) => s.count, show: (s) => String(s.count) },
      { id: 'coupon', label: 'Oprocentowanie', num: true, get: (s) => s.coupon, show: (s) => procent(s.coupon) },
      { id: 'rate', label: 'Rentowność', num: true, get: (s) => s.rate, show: (s) => procent(s.rate) },
      { id: 'next', label: 'Najbl. odsetki', num: true, get: (s) => dataKey(s.nextCoupon ?? '99.99.9999'), show: (s) => s.nextCoupon ?? '—' },
      { id: 'maturity', label: 'Wykup', num: true, get: (s) => dataKey(s.maturity), show: (s) => s.maturity },
      { id: 'nominal', label: 'Wartość nominalna', num: true, get: (s) => w(s, 'nominal', currency), show: (s) => kwota(w(s, 'nominal', currency), currency) },
      { id: 'value', label: 'Wartość bieżąca', num: true, get: (s) => w(s, 'value', currency), show: (s) => kwota(w(s, 'value', currency), currency) },
      { id: 'interest', label: 'Odsetki 12M', num: true, get: (s) => w(s, 'interest12m', currency), show: (s) => kwota(w(s, 'interest12m', currency), currency) },
      { id: 'share', label: 'Udział', num: true, get: (s) => w(s, 'value', currency), show: (s) => (total ? procent((w(s, 'value', currency) / total) * 100) : '—') },
    ],
    [currency, total]
  );

  if (!open) return null;

  const col = cols.find((c) => c.id === sort.col) ?? cols[0];
  const sorted = (list: Serie[]) =>
    [...list].sort((a, b) => {
      const x = col.get(a);
      const y = col.get(b);
      return x === y ? 0 : (x > y ? 1 : -1) * sort.dir;
    });
  const sortuj = (id: string) =>
    setSort((s) => (s.col === id ? { col: id, dir: s.dir === 1 ? -1 : 1 } : { col: id, dir: id === 'name' ? 1 : -1 }));

  const sumOf = (list: Serie[], pole: 'value' | 'nominal' | 'interest12m') =>
    list.reduce((a, s) => a + w(s, pole, currency), 0);
  const wazona = (list: Serie[], pole: 'rate' | 'coupon') => {
    const v = sumOf(list, 'value');
    return v ? list.reduce((a, s) => a + s[pole] * w(s, 'value', currency), 0) / v : 0;
  };
  const najblizsza = (list: Serie[], get: (s: Serie) => string | undefined) =>
    list.map(get).filter(Boolean).sort((a, b) => dataKey(a!).localeCompare(dataKey(b!)))[0] ?? '—';

  /* Wiersz zbiorczy: grupa emitenta albo „Razem”. */
  const agg = (list: Serie[]) => ({
    count: String(list.reduce((a, s) => a + s.count, 0)),
    coupon: procent(wazona(list, 'coupon')),
    rate: procent(wazona(list, 'rate')),
    next: najblizsza(list, (s) => s.nextCoupon),
    maturity: najblizsza(list, (s) => s.maturity),
    nominal: kwota(sumOf(list, 'nominal'), currency),
    value: kwota(sumOf(list, 'value'), currency),
    interest: kwota(sumOf(list, 'interest12m'), currency),
    share: total ? procent((sumOf(list, 'value') / total) * 100) : '—',
  });

  const issuers = [...new Set(serie.map((s) => s.issuer))]
    .map((name) => ({ name, list: serie.filter((s) => s.issuer === name) }))
    .sort((a, b) => {
      if (sort.col === 'name') return a.name.localeCompare(b.name) * sort.dir;
      const x = col.get(sorted(a.list)[0]);
      const y = col.get(sorted(b.list)[0]);
      return sort.col === 'value' || sort.col === 'share'
        ? (sumOf(a.list, 'value') - sumOf(b.list, 'value')) * sort.dir
        : x === y ? 0 : (x > y ? 1 : -1) * sort.dir;
    });

  const seriesRow = (s: Serie, nested: boolean) => {
    const link = Boolean(CORP_SERIES_DETAIL[s.id]);
    const go = () => {
      onClose();
      onOpenSeries(s.id);
    };
    return (
      <div
        className={`ftRow ${nested ? 'ftRow--nested' : ''} ${link ? 'ftRow--link' : ''}`}
        key={s.id}
        role={link ? 'link' : undefined}
        tabIndex={link ? 0 : undefined}
        onClick={link ? go : undefined}
        onKeyDown={link ? (e) => e.key === 'Enter' && go() : undefined}
      >
        <span className="ftRow__name">
          {cols[0].show(s)}
          <span className="ftRow__sub">{nested ? s.base ?? '' : `${s.issuer}${s.base ? ` · ${s.base}` : ''}`}</span>
        </span>
        {cols.slice(1).map((c) => (
          <span className="ftRow__cell is-num" key={c.id}>
            {c.show(s)}
          </span>
        ))}
      </div>
    );
  };

  const aggRow = (key: string, title: string, sub: string, list: Serie[], kind: 'group' | 'total', onOpen?: () => void) => {
    const a = agg(list);
    return (
      <div
        className={`ftRow ftRow--${kind} ${onOpen ? 'ftRow--link' : ''}`}
        key={key}
        role={onOpen ? 'link' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        onClick={onOpen}
        onKeyDown={onOpen ? (e) => e.key === 'Enter' && onOpen() : undefined}
      >
        <span className="ftRow__name">
          {title}
          <span className="ftRow__sub">{sub}</span>
        </span>
        {[a.count, a.coupon, a.rate, a.next, a.maturity, a.nominal, a.value, a.interest, a.share].map((v, i) => (
          <span className="ftRow__cell is-num" key={i}>
            {v}
          </span>
        ))}
      </div>
    );
  };

  return createPortal(
    <div className="ft" role="dialog" aria-modal="true" aria-labelledby="ftTitle">
      <header className="ft__head">
        <div className="ft__titleBlock">
          <h2 className="ft__title" id="ftTitle">
            Struktura portfela
          </h2>
          <span className="ft__sub">
            Obligacje korporacyjne · {issuers.length} emitentów · {serie.length} serii
          </span>
        </div>
        <div className="ft__actions">
          <Pills items={['Emitenci', 'Serie']} value={grouping} onChange={setGrouping} />
          <button type="button" className="ft__close" aria-label="Zamknij pełną tabelę" onClick={onClose} ref={closeRef}>
            <X size={18} />
          </button>
        </div>
      </header>

      <div className="ft__body">
        <div className="corpCard corpShell ft__shell">
          <div className="corpShell__inner">
            <div className="ftTable">
              <div className="ftRow ftRow--head">
                {cols.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={`ftRow__th ${c.num ? 'is-num' : ''} ${sort.col === c.id ? 'is-active' : ''}`}
                    onClick={() => sortuj(c.id)}
                    aria-sort={sort.col === c.id ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}
                  >
                    {c.id === 'name' && grouping === 'Emitenci' ? 'Emitent / seria' : c.label}
                    <ChevronDown size={12} className={`ftRow__sort ${sort.col === c.id && sort.dir === 1 ? 'is-up' : ''}`} />
                  </button>
                ))}
              </div>

              {grouping === 'Serie'
                ? sorted(serie).map((s) => seriesRow(s, false))
                : issuers.map((g) => (
                    <div className="ftGroup" key={g.name}>
                      {aggRow(
                        g.name,
                        g.name,
                        `${g.list.length} ${g.list.length === 1 ? 'seria' : 'serie'}`,
                        g.list,
                        'group',
                        CORP_ISSUERS[g.name]
                          ? () => {
                              onClose();
                              onOpenIssuer(g.name);
                            }
                          : undefined
                      )}
                      {sorted(g.list).map((s) => seriesRow(s, true))}
                    </div>
                  ))}
            </div>
          </div>
          <div className="corpShell__foot">
            <div className="ftTable">
              {aggRow('razem', 'Razem', `${issuers.length} emitentów · ${serie.length} serii`, serie, 'total')}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
