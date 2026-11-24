/* Liczydlo ekranu obligacji. Komponent nie trzyma zadnych gotowych sum —
   wszystko wyliczamy z wierszy serii, zeby przelacznik walut, grupowania
   i metryki nigdy nie rozjechaly sie z tabela pod spodem. */

import {
  CORP_CLOSED_INTEREST,
  CORP_IRR,
  CORP_ISSUERS,
  CORP_SERIES,
  CORP_SERIES_DETAIL,
  type Serie,
} from './corpV10';
import type { Currency } from './currencies';

/** Pole liczbowe serii — w walucie widoku, nie zawsze w zlotych. */
type Pole = 'value' | 'nominal' | 'interest12m' | 'result12m';

/* W widoku jednowalutowym pokazujemy kwoty w tej walucie, a nie ich
   przeliczenie: klient trzyma tam EUR i chce widziec EUR. */
export const w = (s: Serie, pole: Pole, waluta: Currency): number => {
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

/* ------------------------------ karta emitenta ------------------------------
   Te same sumy i srednie wazone co na ekranie klasy, tylko zawezone do serii
   jednego emitenta. Udzial liczymy wzgledem calych obligacji korporacyjnych
   w widoku lacznym. */

const najblizszaData = (daty: string[]) =>
  [...daty].sort((a, b) => {
    const d = (x: string) => x.split('.').reverse().join('');
    return d(a).localeCompare(d(b));
  })[0] ?? '—';

export function emitent(issuer: string) {
  const lista = CORP_SERIES.filter((s) => s.issuer === issuer);
  const value = suma(lista, 'value', 'Łącznie');
  const rachunki = new Set(lista.flatMap((s) => (s.accounts ?? []).map((a) => a.account)));
  return {
    serie: lista,
    value,
    nominal: suma(lista, 'nominal', 'Łącznie'),
    udzial: (value / suma(CORP_SERIES, 'value', 'Łącznie')) * 100,
    sztuk: lista.reduce((a, s) => a + s.count, 0),
    rachunki: rachunki.size,
    rate: wazona(lista, 'rate', 'Łącznie'),
    coupon: wazona(lista, 'coupon', 'Łącznie'),
    odsetki: suma(lista, 'interest12m', 'Łącznie'),
    wynik: suma(lista, 'result12m', 'Łącznie'),
    stopa: CORP_ISSUERS[issuer]?.irr ?? 0,
    najblizszyWykup: najblizszy(lista),
    najblizszeOdsetki: najblizszaData(lista.flatMap((s) => (s.nextCoupon ? [s.nextCoupon] : []))),
  };
}

/** 1 rachunek, 2–4 rachunki, 5+ rachunkow — z wyjatkiem 12–14. */
export const odmiana = (n: number, [jeden, kilka, wiele]: [string, string, string]) => {
  if (n === 1) return `${n} ${jeden}`;
  const r10 = n % 10;
  const r100 = n % 100;
  return `${n} ${r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14) ? kilka : wiele}`;
};

/* -------------------------------- karta serii --------------------------------
   Wynik od zakupu = wyplacone odsetki + zmiana wyceny (wartosc biezaca minus
   koszt nabycia) — tak jak opisuje go wiersz na karcie. */
export function seria(id: string) {
  const s = CORP_SERIES.find((x) => x.id === id);
  const d = CORP_SERIES_DETAIL[id];
  if (!s || !d) return null;
  const konta = s.accounts ?? [];
  return {
    s,
    d,
    konta,
    wycena: s.value - d.cost,
    wynik: d.interestSincePurchase + (s.value - d.cost),
  };
}
