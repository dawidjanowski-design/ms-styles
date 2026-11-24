/* Karta rachunku w stylistyce nr 10 — tresc z wireframe'u 1130:27.
   Sklada sie z tych samych klockow co reszta nr 10: naglowek ekranu jak na
   obligacjach, sekcje z tytulem i kontrolkami nad karta, tabele na cala
   szerokosc karty, kolory klas z palety nr 2. */

import { useMemo, useState } from 'react';
import { V10_ACCOUNT_DETAIL, V10_TX_TABS, type AccountCashBox } from '../data/accountV10';
import { META } from './Portfolio';
import { Amount, Pills } from './ui';
import { ChevronDown, ChevronRight, Search } from '../icons/Feather';

function Select({ label }: { label: string }) {
  return (
    <button type="button" className="selectBtn">
      {label}
      <ChevronDown size={14} className="icon--muted" />
    </button>
  );
}

function CashBox({ box }: { box: AccountCashBox }) {
  return (
    <div className="acctBox">
      <div className="acctBox__head">
        <span className="acctBox__label">{box.label}</span>
        <ChevronRight size={16} className="icon--muted" />
      </div>
      <Amount int={box.amount} dec={box.decimals} className="acctBox__amount" />
      <div className="acctBox__curs">
        {box.currencies.map((c) => (
          <div className="acctBox__cur" key={c.cur}>
            <span className="acctBox__code">{c.cur}</span>
            <span className={`acctBox__val ${c.amount === '—' ? 'is-empty' : ''}`}>{c.amount}</span>
            <span className="acctBox__pln">{c.pln}</span>
          </div>
        ))}
      </div>
      <p className="acctBox__note">{box.note}</p>
    </div>
  );
}

export function AccountV10({
  id,
  onBack,
  onOpenIssuer,
  onOpenSeries,
}: {
  id: string;
  onBack: () => void;
  onOpenIssuer: (issuer: string) => void;
  onOpenSeries: (id: string) => void;
}) {
  const a = V10_ACCOUNT_DETAIL[id];
  const [tab, setTab] = useState<string>('Operacje');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    if (!a) return [];
    const q = query.trim().toLowerCase();
    return a.transactions.filter((t) => {
      if (tab === 'Operacje' && t.kind !== 'operacja') return false;
      if (tab === 'Przepływy' && t.kind !== 'przeplyw') return false;
      if (tab === 'Zamknięte pozycje' && !t.closes) return false;
      return !q || t.instrument.toLowerCase().includes(q);
    });
  }, [a, tab, query]);

  if (!a) return null;

  const emitenci = a.groups.find((g) => g.asset === 'corp')?.positions.length ?? 0;
  const fundusze = a.groups
    .filter((g) => g.asset === 'fiz' || g.asset === 'fio')
    .reduce((n, g) => n + g.positions.length, 0);

  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content content--airy">
          <nav className="crumbs" aria-label="Ścieżka nawigacji">
            <button type="button" className="crumbs__link" onClick={onBack}>
              Portfel
            </button>
            <ChevronRight size={13} className="crumbs__sep" />
            <button type="button" className="crumbs__link" onClick={onBack}>
              Rachunki
            </button>
            <ChevronRight size={13} className="crumbs__sep" />
            <span className="crumbs__current">{a.name}</span>
          </nav>

          <div className="corpHead">
            <div className="corpHead__text">
              <button type="button" className="acctSwitch">
                <h1 className="corpHead__title">{a.name}</h1>
                <ChevronDown size={20} className="icon--muted" />
              </button>
              <p className="corpHead__sub">
                {a.kind} · {a.number}
              </p>
            </div>
            <div className="acctValue">
              <span className="acctValue__label">Wartość rachunku</span>
              <Amount int={a.amount} dec={a.decimals} className="acctValue__amount" />
            </div>
          </div>

          <section className="corpSection">
            <div className="corpSection__head">
              <h2 className="sectionTitle">Gotówka na rachunku</h2>
              <div className="corpSection__actions">
                <button type="button" className="btn">
                  Wpłać
                </button>
                <button type="button" className="btn">
                  Wypłać
                </button>
                <button type="button" className="btn btn--ghost">
                  Przenieś
                </button>
              </div>
            </div>
            <div className="acctCashGrid">
              {a.cash.map((b) => (
                <CashBox box={b} key={b.label} />
              ))}
            </div>
          </section>

          <section className="corpSection">
            <div className="corpSection__head">
              <h2 className="sectionTitle">Aktywa na rachunku</h2>
              <span className="acctCount">
                {emitenci} emitentów · {fundusze} funduszy
              </span>
            </div>
            <div className="corpCard">
              <div className="acctAssets">
                {a.groups.map((g) => (
                  <div className="acctGroup" key={g.name}>
                    <div
                      className="acctGroup__head"
                      style={{ ['--seg' as string]: META[g.asset]?.colors['2'].legend }}
                    >
                      <span className="acctGroup__dot" />
                      <span className="acctGroup__name">{g.name}</span>
                      <span className="acctGroup__total">{g.total}</span>
                    </div>
                    {g.positions.map((p) => {
                      const open = p.link
                        ? () => (p.link!.kind === 'issuer' ? onOpenIssuer(p.link!.id) : onOpenSeries(p.link!.id))
                        : undefined;
                      return (
                        <div
                          className={`acctPos ${open ? 'acctPos--link' : ''}`}
                          key={p.name}
                          role={open ? 'link' : undefined}
                          tabIndex={open ? 0 : undefined}
                          onClick={open}
                          onKeyDown={open ? (e) => e.key === 'Enter' && open() : undefined}
                        >
                          <span className="acctPos__text">
                            <span className="acctPos__name">{p.name}</span>
                            <span className="acctPos__sub">{p.sub}</span>
                          </span>
                          <span className="acctPos__value">{p.value}</span>
                          <span className="acctPos__chev">{open && <ChevronRight size={16} />}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="corpSection">
            <div className="corpSection__head">
              <h2 className="sectionTitle">Transakcje</h2>
              <Pills items={V10_TX_TABS} value={tab} onChange={setTab} />
            </div>
            <div className="corpCard">
              <div className="acctFilters">
                <label className="acctField">
                  <span className="acctField__label">Okres</span>
                  <Select label="2026" />
                </label>
                <label className="acctField">
                  <span className="acctField__label">Typ transakcji</span>
                  <Select label="Wszystkie typy" />
                </label>
                <label className="acctField acctField--grow">
                  <span className="acctField__label">Instrument</span>
                  <span className="acctSearch">
                    <Search size={16} className="icon--muted" />
                    <input
                      type="search"
                      placeholder="Szukaj instrumentu"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </span>
                </label>
              </div>

              <div className="opsTable">
                <div className="opsRow opsRow--head acctTx">
                  <span>Data</span>
                  <span>Typ transakcji</span>
                  <span>Instrument</span>
                  <span className="is-num">Kwota</span>
                  <span className="is-num">Status</span>
                </div>
                {rows.map((t) => (
                  <div className="opsRow acctTx" key={t.date + t.instrument}>
                    <span>{t.date}</span>
                    <span>{t.type}</span>
                    <span className="acctTx__instrument">{t.instrument}</span>
                    <span className={`is-num ${t.inflow ? 'is-positive' : ''}`}>{t.amount}</span>
                    <span className="is-num">
                      <span className={`badge ${t.tone ? `badge--${t.tone}` : ''}`}>{t.status}</span>
                    </span>
                  </div>
                ))}
                {rows.length === 0 && (
                  <p className="acctEmpty">Brak transakcji dla wybranych filtrów w 2026.</p>
                )}
              </div>
              <p className="corpNote">
                {rows.length} z {a.transactions.length} transakcji
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
