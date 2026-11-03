import { useState } from 'react';
import {
  TX_PERIODS,
  TX_TABS,
  TX_TAB_TYPES,
  TX_TYPES,
  type Transaction,
} from '../data/corpBonds';
import { Pills } from './ui';

/* Tabela transakcji jest wspolna dla ekranu klasy aktywow, emitenta i serii.
   Rozni je liczba kolumn: na ekranie klasy rachunek ma wlasna kolumne, na
   wezszych ekranach schodzi pod nazwe instrumentu — tak jak w wireframe'ach. */
export function Transactions({
  rows: all,
  countNoun = 'transakcji',
  accountAsSubline = false,
  total,
  locked = false,
}: {
  rows: Transaction[];
  countNoun?: string;
  accountAsSubline?: boolean;
  /** pelna liczba transakcji — stopka z paginacja pojawia sie tylko z nia */
  total?: number;
  locked?: boolean;
}) {
  const [tab, setTab] = useState<string>('Wszystkie');
  const [period, setPeriod] = useState<string>('2026');
  const [type, setType] = useState<string>('Wszystkie typy');
  const [query, setQuery] = useState<string>('');

  const allowed = TX_TAB_TYPES[tab];
  const rows = all.filter((t) => {
    if (allowed && !allowed.includes(t.type)) return false;
    if (!t.date.endsWith(period)) return false;
    if (type !== 'Wszystkie typy' && t.type !== type) return false;
    if (query && !t.instrument.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const columns = accountAsSubline
    ? ['Data', 'Typ transakcji', 'Instrument', 'Kwota', 'Status']
    : ['Data', 'Typ transakcji', 'Instrument', 'Kwota', 'Status', 'Rachunek'];

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="sectionTitle">Transakcje</h2>
        <span className="panel__meta">
          {rows.length} {countNoun}
        </span>
      </div>

      <div className="panel__toolbar">
        <Pills items={TX_TABS} value={tab} onChange={setTab} locked={locked} />
        {total !== undefined && (
          <div className="btnRow">
            <button type="button" className="btnGhost">
              Eksport PDF
            </button>
            <button type="button" className="btnGhost">
              Eksport XLS
            </button>
          </div>
        )}
      </div>

      <div className="filters">
        <label className="field">
          <span className="field__label">Okres</span>
          <select
            className="field__control"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {TX_PERIODS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="field field--wide">
          <span className="field__label">Typ transakcji</span>
          <select className="field__control" value={type} onChange={(e) => setType(e.target.value)}>
            {TX_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field field--widest">
          <span className="field__label">Instrument</span>
          <input
            className="field__control"
            type="search"
            placeholder="Szukaj instrumentu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className={`table ${accountAsSubline ? 'table--narrow' : ''}`}>
        <div className="table__head">
          {columns.map((c) => (
            <span key={c} className={`table__th ${c === 'Kwota' ? 'is-right' : ''}`}>
              {c}
            </span>
          ))}
        </div>

        {rows.length === 0 && <div className="table__empty">Brak transakcji dla tych filtrów</div>}

        {rows.map((t, i) => (
          <div className="table__row" key={i}>
            <span className="table__td table__td--muted">{t.date}</span>
            <span className="table__td">{t.type}</span>
            <span className="table__td">
              {t.instrument}
              {accountAsSubline && <span className="table__note">{t.account}</span>}
            </span>
            <span className="table__td is-right">
              <span className="table__amount">{t.amount}</span>
              {t.amountNote && <span className="table__note">{t.amountNote}</span>}
            </span>
            <span className="table__td">
              <span className="badge">{t.status}</span>
            </span>
            {!accountAsSubline && (
              <span className="table__td table__td--muted">{t.account}</span>
            )}
          </div>
        ))}

        {total !== undefined && (
          <div className="table__foot">
            <button type="button" className="btnGhost">
              Pokaż kolejne 15 transakcji
            </button>
            <span className="table__caption">
              Wyświetlono {rows.length} z {total} transakcji
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
