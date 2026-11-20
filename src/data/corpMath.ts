/* Liczydlo ekranu obligacji. Komponent nie trzyma zadnych gotowych sum —
   wszystko wyliczamy z wierszy serii, zeby przelacznik walut, grupowania
   i metryki nigdy nie rozjechaly sie z tabela pod spodem. */

import { CORP_CLOSED_INTEREST, CORP_IRR, CORP_SERIES, type Serie } from './corpV10';
import type { Currency } from './currencies';

/** Pole liczbowe serii — w walucie widoku, nie zawsze w zlotych. */
type Pole = 'value' | 'nominal' | 'interest12m' | 'result12m';

/* W widoku jednowalutowym pokazujemy kwoty w tej walucie, a nie ich
   przeliczenie: klient trzyma tam EUR i chce widziec EUR. */
const w = (s: Serie, pole: Pole, waluta: Currency): number => {
  if (waluta === 'Łącznie' || s.cur === 'PLN') return s[pole];
  const po = (
    { value: 'curValue', nominal: 'curNominal', interest12m: 'curInterest12m', result12m: 'curResult12m' } as const
  )[pole];
  return s[po] ?? s[pole];
};

export const jednostka = (waluta: Currency) => (waluta === 'Łącznie' ? 'PLN' : waluta);

/** Serie widoczne w danej walucie. „Łącznie" pokazuje wszystko. */
export const serieW = (waluta: Currency): Serie[] =>
  waluta === 'Łącznie' ? CORP_SERIES : CORP_SERIES.filter((s) => s.cur === waluta);

export const kwota = (v: number, waluta: Currency) =>
  `${Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')},00 ${jednostka(waluta)}`;

export const procent = (v: number) => `${v.toFixed(2).replace('.', ',')}%`;

const suma = (lista: Serie[], pole: Pole, waluta: Currency) =>
  lista.reduce((a, s) => a + w(s, pole, waluta), 0);

/* Srednia wazona wartoscia pozycji, nie zwykla — seria za 400 tys. wazy
   osiem razy tyle, co seria za 53 tys. */
const wazona = (lista: Serie[], pole: 'rate' | 'coupon', waluta: Currency) => {
  const v = suma(lista, 'value', waluta);
  if (!v) return 0;
  return lista.reduce((a, s) => a + s[pole] * w(s, 'value', waluta), 0) / v;
};

const najblizszy = (lista: Serie[]) =>
  [...lista]
    .map((s) => s.maturity)
    .sort((a, b) => {
      const d = (x: string) => x.split('.').reverse().join('');
      return d(a).localeCompare(d(b));
    })[0] ?? '—';

export type Wiersz = {
  id: string;
  /** glowna etykieta wiersza */
  title: string;
  /** druga linia: emitent przy seriach, liczba serii przy emitentach */
  sub?: string;
  /** druga kolumna: liczba serii albo sztuk */
  count: string;
  countNum: number;
  rate: number;
  maturity: string;
  value: number;
  nominal: number;
  /** kwota w walucie serii, gdy widok jest laczny a seria w EUR */
  curValue?: string;
};

export function wiersze(waluta: Currency, grupowanie: string): Wiersz[] {
  const lista = serieW(waluta);

  if (grupowanie === 'Serie') {
    return lista.map((s) => ({
      id: s.id,
      title: `${s.ticker} · ${s.name}`,
      sub: s.issuer,
      count: String(s.count),
      countNum: s.count,
      rate: s.rate,
      maturity: s.maturity,
      value: w(s, 'value', waluta),
      nominal: w(s, 'nominal', waluta),
      curValue:
        waluta === 'Łącznie' && s.cur === 'EUR' && s.curValue
          ? kwota(s.curValue, 'EUR')
          : undefined,
    }));
  }

  const emitenci = [...new Set(lista.map((s) => s.issuer))];
  return emitenci.map((issuer) => {
    const serie = lista.filter((s) => s.issuer === issuer);
    return {
      id: issuer,
      title: issuer,
      count: `${serie.length} ${serie.length === 1 ? 'seria' : 'serie'}`,
      countNum: serie.length,
      rate: wazona(serie, 'rate', waluta),
      maturity: najblizszy(serie),
      value: suma(serie, 'value', waluta),
      nominal: suma(serie, 'nominal', waluta),
      curValue:
        waluta === 'Łącznie' && serie.length === 1 && serie[0].cur === 'EUR' && serie[0].curValue
          ? kwota(serie[0].curValue, 'EUR')
          : undefined,
    };
  });
}

export function podsumowanie(waluta: Currency) {
  const lista = serieW(waluta);
  const value = suma(lista, 'value', waluta);
  const nominal = suma(lista, 'nominal', waluta);
  const odsetki = suma(lista, 'interest12m', waluta);
  const wynik = suma(lista, 'result12m', waluta);
  const emitenci = new Set(lista.map((s) => s.issuer)).size;

  /* Odsetki z pozycji zamknietych doliczamy tylko w widoku lacznym —
     tamte serie byly zlotowe. */
  const odsetkiRazem = waluta === 'Łącznie' ? odsetki + CORP_CLOSED_INTEREST : odsetki;

  return {
    pusto: lista.length === 0,
    value,
    nominal,
    emitenci,
    serie: lista.length,
    sztuk: lista.reduce((a, s) => a + s.count, 0),
    rate: wazona(lista, 'rate', waluta),
    coupon: wazona(lista, 'coupon', waluta),
    odsetki: odsetkiRazem,
    odsetkiZamkniete: waluta === 'Łącznie' ? CORP_CLOSED_INTEREST : 0,
    odsetkiMiesiecznie: odsetki / 12,
    wynik,
    stopa: CORP_IRR[waluta] ?? 0,
    najblizszyWykup: najblizszy(lista),
  };
}
