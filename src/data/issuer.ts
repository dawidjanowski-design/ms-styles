/* Ekran emitenta (Figma 722:5483) i ekran serii (Figma 722:4654).
   Wchodzi się w nie z listy na ekranie klasy aktywów: klik w emitenta albo
   w serię. Treść przeniesiona z wireframe'ów bez zmian. */

import type { Transaction } from './corpBonds';

export type InfoRow = {
  label: string;
  /** druga linia pod etykietą, np. „metodyka w uzgodnieniu" */
  sub?: string;
  value: string;
};

export type Series = {
  id: string;
  name: string;
  sub: string;
  rate: string;
  maturity: string;
  value: string;
};

/* ----------------------------- emitent ----------------------------- */

export const ISSUER = {
  id: 'ms',
  name: 'Michael / Ström SA',
  valueLabel: 'Wartość w portfelu',
  value: '600 000',
  valueDecimals: ',00 PLN',
};

export const ISSUER_SUMMARY: InfoRow[] = [
  { label: 'Liczba serii', value: '3' },
  { label: 'Wartość nominalna', value: '600 000,00 PLN' },
  { label: 'Średnie oprocentowanie (ważone)', value: '7,65%' },
  { label: 'Najbliższa wypłata odsetek', value: '31.12.2026' },
  { label: 'Najbliższy wykup', value: '14.03.2028' },
  { label: 'Wypłacone odsetki — łącznie', value: '28 640,00 PLN' },
  { label: 'Udział w klasie aktywów', value: '28,4%' },
];

export const ISSUER_SERIES: Series[] = [
  {
    id: 'f',
    name: 'seria F',
    sub: 'rynek pierwotny · 260 szt.',
    rate: 'WIBOR 3M + 3,90 · 7,60%',
    maturity: '14.03.2028',
    value: '260 000,00 PLN',
  },
  {
    id: 'g',
    name: 'seria G',
    sub: 'rynek pierwotny · 200 szt.',
    rate: 'WIBOR 3M + 3,95 · 7,65%',
    maturity: '30.09.2028',
    value: '200 000,00 PLN',
  },
  {
    id: 'h',
    name: 'seria H',
    sub: 'rynek wtórny · Catalyst · 140 szt.',
    rate: 'WIBOR 3M + 3,80 · 7,70%',
    maturity: '11.04.2029',
    value: '140 000,00 PLN',
  },
];

export const SERIES_COLUMNS = ['Seria', 'Oprocentowanie', 'Wykup', 'Wartość'];

/* ------------------------------ seria ------------------------------ */

export const SERIES_DETAIL = {
  name: 'Michael / Ström SA, seria F',
  valueLabel: 'Wartość w portfelu',
  value: '260 000',
  valueDecimals: ',00 PLN',
  more: 'Pokaż więcej',
  less: 'Pokaż mniej',
};

export type ParamGroup = { label: string; rows: InfoRow[] };

/* Pierwsza grupa jest widoczna zawsze, pozostale odslania „Pokaz wiecej"
   (Figma 722:4837 — stan rozwiniety). */
export const SERIES_GROUPS: ParamGroup[] = [
  {
    label: 'Twoja pozycja',
    rows: [
      { label: 'Liczba obligacji', value: '260 szt.' },
      { label: 'Nominał jednostki', value: '1 000,00 PLN' },
      { label: 'Wartość nominalna', value: '260 000,00 PLN' },
      { label: 'Koszt nabycia', sub: '2 transakcje — 12.05.2025, 02.04.2026', value: '258 400,00 PLN' },
      { label: 'Wartość bieżąca', value: '260 000,00 PLN' },
      { label: 'Wypłacone odsetki', value: '14 820,00 PLN' },
      { label: 'Zysk / strata', sub: 'metodyka w uzgodnieniu', value: '—' },
      { label: 'Stopa zwrotu', sub: 'metodyka w uzgodnieniu', value: '—' },
      { label: 'Rachunek', value: 'Rachunek maklerski' },
    ],
  },
  {
    label: 'Oprocentowanie',
    rows: [
      { label: 'Konstrukcja', value: 'WIBOR 3M + 3,90 p.p.' },
      { label: 'Oprocentowanie bieżące', value: '7,60%' },
      { label: 'Częstotliwość wypłat', value: 'kwartalnie' },
      { label: 'Najbliższa wypłata odsetek', value: '31.12.2026' },
    ],
  },
  {
    label: 'Papier',
    rows: [
      { label: 'Typ instrumentu', value: 'Obligacja korporacyjna' },
      { label: 'Emitent', value: 'Michael / Ström SA' },
      { label: 'Seria', value: 'F' },
      { label: 'ISIN', value: 'PLMSTRM00123' },
      { label: 'Rynek', value: 'pierwotny' },
      { label: 'Data emisji', value: '14.03.2025' },
      { label: 'Data wykupu', value: '14.03.2028' },
    ],
  },
];

/* Transakcje obu ekranow — te same dwa zdarzenia co w wireframe'ach. */
export const ISSUER_TRANSACTIONS: Transaction[] = [
  {
    date: '30.09.2026',
    type: 'Wypłata odsetek',
    instrument: 'Michael / Ström SA, seria F',
    amount: '5 420,00 PLN',
    status: 'Rozliczone',
    account: 'Rachunek maklerski',
  },
  {
    date: '30.09.2026',
    type: 'Wypłata odsetek',
    instrument: 'Michael / Ström SA, seria F',
    amount: '2 710,00 PLN',
    status: 'Rozliczone',
    account: 'IKE',
  },
];
