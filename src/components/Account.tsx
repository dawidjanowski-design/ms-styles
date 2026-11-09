import {
  ACCOUNT,
  ACCOUNT_CASH,
  ACCOUNT_GROUPS,
  ACCOUNT_LIMIT,
  ACCOUNT_TRANSACTIONS,
} from '../data/account';
import { Amount } from './ui';
import { Transactions } from './Transactions';

type StyleId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | 'makieta';

export function AccountScreen({
  styleId,
  onBack,
}: {
  styleId: StyleId;
  onBack: () => void;
}) {
  return (
    <div className="screenOuter">
      <div className="screen">
        <div className="content">
          <div className="crumbRow">
            <nav className="crumbs" aria-label="Ścieżka nawigacji">
              <button type="button" className="crumbs__link" onClick={onBack}>
                Portfel
              </button>
              <span className="crumbs__sep" aria-hidden="true">
                ›
              </span>
              <button type="button" className="crumbs__link" onClick={onBack}>
                Rachunki
              </button>
              <span className="crumbs__sep" aria-hidden="true">
                ›
              </span>
              <span className="crumbs__current">IKE</span>
            </nav>
          </div>

          <section className="detailHead">
            <div className="acctHead">
              <span className="acctHead__number">{ACCOUNT.number}</span>
              <h1 className="detailTitle">{ACCOUNT.title}</h1>
            </div>
            <div className="detailValue">
              <span className="detailValue__label">{ACCOUNT.valueLabel}</span>
              <Amount int={ACCOUNT.value} dec={ACCOUNT.valueDecimals} />
            </div>
          </section>

          <section className="panel panel--tight">
            <div className="acctCash">
              {ACCOUNT_CASH.map((c) => (
                <div className="acctCash__item" key={c.label}>
                  <span className="acctCash__label">{c.label}</span>
                  <span className="acctCash__value">{c.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel panel--tight">
            <div className="limitCard">
              <div className="limitCard__row">
                <div className="limitCard__labelBlock">
                  <span className="limitCard__label">{ACCOUNT_LIMIT.label}</span>
                  <span className="limitCard__sub">{ACCOUNT_LIMIT.sub}</span>
                </div>
                <div className="limitCard__valueBlock">
                  <span className="limitCard__value">{ACCOUNT_LIMIT.value}</span>
                  <span className="limitCard__left">{ACCOUNT_LIMIT.left}</span>
                </div>
              </div>
              <div className="acctCard__limitTrack">
                <div
                  className="acctCard__limitFill"
                  style={{ width: `${ACCOUNT_LIMIT.progress * 100}%` }}
                />
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 className="sectionTitle">Aktywa na rachunku</h2>
              <span className="badge">
                {ACCOUNT_GROUPS.reduce((n, g) => n + g.positions.length, 0)} pozycje
              </span>
            </div>

            <div className="posGroups">
              {ACCOUNT_GROUPS.map((g) => (
                <div className="posGroup" key={g.name}>
                  <div className="posGroup__head">
                    <span className="posGroup__name">{g.name}</span>
                    <span className="posGroup__total">{g.total}</span>
                  </div>
                  {g.positions.map((p) => (
                    <div className="posRow" key={p.name}>
                      <span className="posRow__titleBlock">
                        <span className="posRow__name">{p.name}</span>
                        {p.sub && <span className="posRow__sub">{p.sub}</span>}
                      </span>
                      <span className="posRow__value">{p.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <Transactions
            rows={ACCOUNT_TRANSACTIONS}
            countNoun="zdarzenia"
            account="none"
            locked={styleId === 'makieta'}
          />
        </div>
      </div>
    </div>
  );
}
