/* Karta serii w stylistyce nr 10 — tresc z wireframe'u 1121:4573.
   Uklad jak reszta nr 10: karta podsumowania z kafelkami, sekcje z tytulem
   nad karta i tabelami na cala szerokosc. Obok tresci waska kolumna z tym,
   co dotyczy decyzji: ogloszony wykup, akcje, najblizsze kupony. */

import { useState } from 'react';
import { CORP_ISSUERS, type Metric } from '../data/corpV10';
import { kwota, odmiana, procent, seria } from '../data/corpMath';
import { Amount } from './ui';
import { AlertTriangle, ChevronDown, ChevronRight, ChevronUp } from '../icons/Feather';

const RACHUNKI: [string, string, string] = ['rachunek', 'rachunki', 'rachunków'];

export function SeriesV10({
  id,
  onBack,
  onOpenAsset,
  onOpenIssuer,
}: {
  id: string;
  onBack: () => void;
  onOpenAsset: () => void;
  onOpenIssuer: (issuer: string) => void;
}) {
  const dane = seria(id);
  const [wiecej, setWiecej] = useState(false);
  if (!dane) return null;
  const { s, d, konta, wynik } = dane;
  const [calosc, dec] = kwota(s.value, 'PLN').split(',');
  const kartaEmitenta = Boolean(CORP_ISSUERS[s.issuer]);

  const kafelki: Metric[] = [
    { label: 'Aktualne oprocentowanie', value: procent(s.coupon) },
    { label: 'Wypłata odsetek', value: d.frequency },
    { label: 'Najbliższa wypłata', value: s.nextCoupon ?? '—' },
    { label: 'Termin wykupu', value: s.maturity },
  ];

  const szczegoly = [
    { label: 'Koszt nabycia', note: d.costSub, value: kwota(d.cost, 'PLN') },
    { label: 'Wypłacone odsetki', note: 'od zakupu', value: kwota(d.interestSincePurchase, 'PLN') },
    {
      label: 'Wynik',
      note: 'odsetki + zmiana wyceny',
      value: `${wynik >= 0 ? '+' : ''}${kwota(wynik, 'PLN')}`,
      positive: wynik > 0,
    },
    { label: 'Stopa zwrotu', note: 'IRR, w skali roku', value: procent(d.irr) },
  ];

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
              Aktywa
            </button>
            <ChevronRight size={13} className="crumbs__sep" />
            <button type="button" className="crumbs__link" onClick={onOpenAsset}>
              Obligacje korporacyjne
            </button>
            <ChevronRight size={13} className="crumbs__sep" />
            {kartaEmitenta ? (
              <button type="button" className="crumbs__link" onClick={() => onOpenIssuer(s.issuer)}>
                {s.issuer}
              </button>
            ) : (
              <span className="crumbs__link crumbs__link--static">{s.issuer}</span>
            )}
            <ChevronRight size={13} className="crumbs__sep" />
            <span className="crumbs__current">{s.name}</span>
          </nav>

          <div className="corpHead">
            <div className="corpHead__text">
              <h1 className="corpHead__title">
                {s.issuer} · {s.name}
              </h1>
              <div className="serChips">
                <span className="serChip">
                  Ticker <strong>{s.ticker}</strong>
                  {d.tickerNote && <span className="serChip__note">{d.tickerNote}</span>}
                </span>
                <span className="serChip">
                  ISIN <strong>{d.isin}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="serSplit">
            <div className="serMain">
              <section className="resultCard">
                <div className="resultCard__lead">
                  <span className="resultCard__caption">Wartość bieżąca</span>
                  <div className="resultCard__amountRow">
                    <Amount int={calosc} dec={`,${dec}`} className="resultCard__amount" />
                  </div>
                  <span className="resultCard__note resultCard__note--left">
                    {s.count} szt. · nominał {kwota(d.par, 'PLN')}
                  </span>
                </div>
                <div className="divider" />
                <div className="resultCard__stats">
                  {kafelki.map((m) => (
                    <div className="resultStat" key={m.label}>
                      <span className="resultStat__label">{m.label}</span>
                      <span className="resultStat__value">{m.value}</span>
                      {m.sub && <span className="resultStat__sub">{m.sub}</span>}
                    </div>
                  ))}
                </div>
                <p className="serFormula">{d.formula}</p>
              </section>

              <section className="corpSection">
                <div className="corpSection__head">
                  <div className="corpSection__text">
                    <h2 className="sectionTitle">Gdzie trzymasz tę serię</h2>
                  </div>
                </div>
                <div className="corpCard">
                  <div className="serTable">
                    <div className="serRow serRow--head">
                      <span>Rachunek</span>
                      <span className="is-num">Sztuk</span>
                      <span className="is-num">Wartość pozycji</span>
                    </div>
                    {konta.map((k) => (
                      <div className="serRow" key={k.account}>
                        <span>{k.account}</span>
                        <span className="is-num">{k.count}</span>
                        <span className="is-num">{kwota(k.value, 'PLN')}</span>
                      </div>
                    ))}
                    <div className="serRow serRow--total">
                      <span>Razem · {odmiana(konta.length, RACHUNKI)}</span>
                      <span className="is-num">{s.count}</span>
                      <span className="is-num">{kwota(s.value, 'PLN')}</span>
                    </div>

                    <button
                      type="button"
                      className="serMore"
                      aria-expanded={wiecej}
                      onClick={() => setWiecej((v) => !v)}
                    >
                      <span className="serMore__label">{wiecej ? 'Pokaż mniej' : 'Pokaż więcej'}</span>
                      <span className="serMore__hint">koszt nabycia, wypłacone odsetki, wynik</span>
                      {wiecej ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {wiecej &&
                      szczegoly.map((r) => (
                        <div className="serKv" key={r.label}>
                          <span className="serKv__label">{r.label}</span>
                          <span className="serKv__note">{r.note}</span>
                          <span className={`is-num ${r.positive ? 'is-positive' : ''}`}>{r.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </section>

              <section className="corpSection">
                <div className="corpSection__head">
                  <div className="corpSection__text">
                    <h2 className="sectionTitle">Dane instrumentu</h2>
                  </div>
                </div>
                <div className="corpCard">
                  <div className="serTable">
                    {d.instrument.map((r) => (
                      <div className="serKv" key={r.label}>
                        <span className="serKv__label">{r.label}</span>
                        <span className="serKv__note">{r.note}</span>
                        <span className="is-num">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className="serAside">
              {d.earlyRedemption && (
                <div className="serAlert">
                  <span className="serAlert__title">
                    <AlertTriangle size={16} />
                    Ogłoszono wcześniejszy wykup
                  </span>
                  <span className="serAlert__kind">{d.earlyRedemption.kind}</span>
                  <p className="serAlert__text">
                    {d.earlyRedemption.count} szt. · {kwota(d.earlyRedemption.amount, 'PLN')} zostanie
                    wykupione {d.earlyRedemption.date}. Pozostałe {d.earlyRedemption.remaining} szt.
                    pozostaje do pierwotnego terminu {s.maturity}.
                  </p>
                  <p className="serAlert__text">
                    Zmiana jest już uwzględniona w wykresie zapadalności i w najbliższych zdarzeniach.
                  </p>
                </div>
              )}

              <section className="corpSection">
                <div className="corpSection__head">
                  <h2 className="sectionTitle">Co możesz zrobić</h2>
                </div>
                <div className="corpCard">
                  <div className="serTrade">
                    <div className="serTrade__info">
                      <span className="serTrade__label">Do sprzedaży</span>
                      <span className="serTrade__value">{kwota(s.value, 'PLN')}</span>
                      <span className="serTrade__sub">
                        {s.count} szt. · notowania na {d.instrument.find((r) => r.label === 'Rynek notowań')?.value ?? 'Catalyst'}
                      </span>
                    </div>
                    <button type="button" className="btn serTrade__btn">
                      Sprzedaj na Catalyst
                    </button>
                  </div>
                  <button type="button" className="serLinkRow">
                    <span className="serLinkRow__text">
                      <span className="serLinkRow__title">Dokumenty serii</span>
                      <span className="serLinkRow__sub">
                        Warunki emisji, raporty bieżące i dokument informacyjny
                      </span>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>

              <section className="corpSection">
                <div className="corpSection__head">
                  <h2 className="sectionTitle">Najbliższe wypłaty odsetek</h2>
                </div>
                <div className="corpCard">
                  <div className="serTable">
                    {d.coupons.map((c) => (
                      <div className="serRow serRow--pair" key={c.date}>
                        <span>{c.date}</span>
                        <span className="is-num">{kwota(c.amount, 'PLN')}</span>
                      </div>
                    ))}
                  </div>
                  {d.couponsNote && <p className="corpNote">{d.couponsNote}</p>}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
