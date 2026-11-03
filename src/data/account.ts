/* Ekran rachunku IKE — Figma 722:3828.
   Wchodzi się w niego z widoku „Rachunki" na ekranie Portfel.
   Przyciski Aktywa / Transakcje z wireframe'u celowo pominięte. */

import type { Transaction } from './corpBonds';

export type AccountPosition = {
  name: string;
  sub?: string;
  value: string;
};

export type AccountGroup = {
  name: string;
  total: string;
  positions: AccountPosition[];
};

export const ACCOUNT = {
  number: '00-00-007431',
  title: 'Rachunek: IKE',
  valueLabel: 'Wartość rachunku',
  value: '506 237',
  valueDecimals: ',00 PLN',
};

export const ACCOUNT_CASH = [
  { label: 'Wolne środki', value: '46 237,00 PLN' },
  { label: 'Zablokowane', value: '0,00 PLN' },
  { label: 'W drodze', value: '12 000,00 PLN' },
];

export const ACCOUNT_LIMIT = {
  label: 'Limit wpłat w 2026',
  sub: 'Roczny limit dla IKE. Po przekroczeniu dalsze wpłaty nie są możliwe.',
  value: '30 000,00 PLN z 40 000,00 PLN',
  left: 'pozostało 10 000,00 PLN',
  progress: 0.75,
};

/* 340 000 + 120 000 + 46 237 wolnych srodkow = 506 237 — zgadza sie z suma. */
export const ACCOUNT_GROUPS: AccountGroup[] = [
  {
    name: 'Obligacje korporacyjne',
    total: '340 000,00 PLN',
    positions: [
      { name: 'Michael / Ström SA', sub: '1 seria · F', value: '200 000,00 PLN' },
      { name: 'Victoria Dom', sub: '1 seria · B2', value: '140 000,00 PLN' },
    ],
  },
  {
    name: 'Fundusze otwarte (FIO)',
    total: '120 000,00 PLN',
    positions: [
      { name: 'Skarbiec Value (Skarbiec FIO)', sub: '800 jednostek', value: '120 000,00 PLN' },
    ],
  },
];

export const ACCOUNT_TRANSACTIONS: Transaction[] = [
  {
    date: '30.09.2026',
    type: 'Wypłata odsetek',
    instrument: 'Michael / Ström SA, seria F',
    amount: '2 710,00 PLN',
    status: 'Rozliczone',
    account: 'IKE',
  },
  {
    date: '1.07.2026',
    type: 'Nabycie jednostek',
    instrument: 'Skarbiec Value (Skarbiec FIO)',
    amount: '-30 000,00 PLN',
    status: 'Rozliczone',
    account: 'IKE',
  },
  {
    date: '31.03.2026',
    type: 'Zakończenie inwestycji',
    instrument: 'VEHIS, seria E',
    amount: '4 200,00 PLN',
    amountNote: 'Wynik inwestycji',
    status: 'Zakończona',
    account: 'IKE',
  },
];
