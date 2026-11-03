/* Panel „Środki w drodze" — Figma 733:825.
   Otwiera się po kliknięciu trzeciej karty w sekcji „Gotówka i środki
   rozliczeniowe". Treść przeniesiona z wireframe'u bez zmian. */

export type TransitEntry = {
  date: string;
  title: string;
  amount: string;
};

export type TransitGroup = {
  name: string;
  sub: string;
  total: string;
  entries: TransitEntry[];
};

export const IN_TRANSIT = {
  title: 'Środki w drodze',
  sub: '8 transakcji · stan na 26.10.2026, 12:04',
  totalLabel: 'Łącznie',
  total: '45 118,00 PLN',
  totalSub: 'w tym 30 000,00 PLN · 3 500,00 EUR',
  footnote:
    'Środki w drodze nie są dostępne do nowych dyspozycji. Pojawią się jako wolna gotówka albo jako instrumenty po rozliczeniu.',
};

export const TRANSIT_GROUPS: TransitGroup[] = [
  {
    name: 'Obligacje',
    sub: 'Opłacenie zapisu · 2 transakcje',
    total: '− 20 000,00 PLN',
    entries: [
      { date: '24.10', title: 'Michael / Ström SA, seria K · zapis', amount: '− 15 000,00 PLN' },
      { date: '25.10', title: 'Victoria Dom, seria C1 · zapis', amount: '− 5 000,00 PLN' },
    ],
  },
  {
    name: 'Fundusze zamknięte (FIZ)',
    sub: 'Żądanie wykupu · 2 transakcje',
    total: '+ 18 618,00 PLN',
    entries: [
      { date: '22.10', title: 'M/S Obligacji Korporacyjnych FIZ · wykup', amount: '+ 15 118,00 PLN' },
      { date: '23.10', title: 'Rockbridge FIZ · wykup', amount: '+ 3 500,00 EUR' },
    ],
  },
  {
    name: 'Fundusze otwarte (FIO)',
    sub: 'Nabycie i umorzenie · 3 transakcje',
    total: '+ 36 500,00 PLN',
    entries: [
      { date: '23.10', title: 'Quercus Obligacji Skarbowych · umorzenie', amount: '+ 50 000,00 PLN' },
      { date: '24.10', title: 'Schroder ISF Global Equity · nabycie', amount: '− 13 500,00 PLN' },
    ],
  },
  {
    name: 'Asset Management',
    sub: 'Alokacja środków · 1 transakcja',
    total: '− 10 000,00 PLN',
    entries: [
      { date: '25.10', title: 'Strategia Dochodowa · alokacja na 12 funduszy', amount: '− 10 000,00 PLN' },
    ],
  },
];
