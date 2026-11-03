/* Ekran „Klasa aktywów · Obligacje korporacyjne" — Figma 909:978.
   Treść przeniesiona z wireframe'u, wartości liczbowe bez zmian.

   Uwaga do danych źródłowych: nagłówek w Figmie mówi 1 854 320,00 PLN,
   a trzy wiersze emitentów sumują się do 1 851 320,00 PLN (różnica 3 000 PLN).
   Zostawione tak, jak w pliku — do decyzji po stronie klienta. */

export type Instrument = {
  id: string;
  name: string;
  sub: string;
  rate: string;
  maturity: string;
  share: string;
  value: string;
};

export type Transaction = {
  date: string;
  type: string;
  instrument: string;
  amount: string;
  /** druga linia pod kwotą, np. „Wynik inwestycji" */
  amountNote?: string;
  status: string;
  account: string;
};

export const DETAIL = {
  title: 'Obligacje korporacyjne',
  amount: '1 854 320',
  amountDecimals: ',00 PLN',
  breadcrumb: ['Portfel', 'Aktywa', 'Obligacje korporacyjne'],
};

/** Etykiety kolumn pokazane tylko przy pierwszym wierszu — tak jak w Figmie. */
export const INSTRUMENT_COLS = ['śr. oprocentowanie', 'najbliższy wykup', 'udział'];

export const TX_TABS = ['Wszystkie', 'Operacje', 'Przepływy', 'Zamknięte pozycje'];

/** Przypisanie typów transakcji do zakładek — wynika wprost z kolumny „Typ transakcji". */
export const TX_TAB_TYPES: Record<string, string[] | null> = {
  Wszystkie: null,
  Operacje: ['Zakup obligacji', 'Sprzedaż obligacji', 'Zapis na obligacje', 'Wykup obligacji'],
  Przepływy: ['Wypłata odsetek'],
  'Zamknięte pozycje': ['Zakończenie inwestycji'],
};

export const TX_PERIODS = ['2026', '2025', '2024'];
export const TX_TYPES = [
  'Wszystkie typy',
  'Zakup obligacji',
  'Sprzedaż obligacji',
  'Zapis na obligacje',
  'Wykup obligacji',
  'Wypłata odsetek',
  'Zakończenie inwestycji',
];

export const TX_COLUMNS = ['Data', 'Typ transakcji', 'Instrument', 'Kwota', 'Status', 'Rachunek'];

export const TRANSACTIONS: Transaction[] = [
  { date: '5.10.2026',  type: 'Sprzedaż obligacji',     instrument: 'VEHIS, seria H',               amount: '41 226,00 PLN',   status: 'W rozliczeniu',      account: 'Rachunek maklerski' },
  { date: '2.10.2026',  type: 'Zapis na obligacje',     instrument: 'Orlen, seria C',               amount: '-50 118,00 PLN',  status: 'Środki zablokowane', account: 'Rachunek maklerski' },
  { date: '30.09.2026', type: 'Wypłata odsetek',        instrument: 'Michael / Ström SA, seria F',  amount: '5 420,00 PLN',    status: 'Rozliczone',         account: 'Rachunek maklerski' },
  { date: '30.09.2026', type: 'Wykup obligacji',        instrument: 'Emitent DEF S.A., seria D',    amount: '200 000,00 PLN',  status: 'Rozliczone',         account: 'Rachunek maklerski' },
  { date: '30.09.2026', type: 'Zakończenie inwestycji', instrument: 'Emitent DEF S.A., seria D',    amount: '12 800,00 PLN',   amountNote: 'Wynik inwestycji', status: 'Zakończona',       account: 'Rachunek maklerski' },
  { date: '30.09.2026', type: 'Wypłata odsetek',        instrument: 'Michael / Ström SA, seria F',  amount: '2 710,00 PLN',    status: 'Rozliczone',         account: 'IKE' },
  { date: '30.09.2026', type: 'Wypłata odsetek',        instrument: 'Nordvik Development, seria B', amount: '1 440,00 PLN',    status: 'Rozliczone',         account: 'XZ' },
  { date: '31.08.2026', type: 'Wypłata odsetek',        instrument: 'Nordvik Development, seria B', amount: '4 140,00 PLN',    status: 'Rozliczone',         account: 'Rachunek maklerski' },
  { date: '10.07.2026', type: 'Sprzedaż obligacji',     instrument: 'Victoria Dom, seria A4',       amount: '121 800,00 PLN',  status: 'Rozliczone',         account: 'Rachunek maklerski' },
  { date: '10.07.2026', type: 'Zakończenie inwestycji', instrument: 'Victoria Dom, seria A4',       amount: '11 400,00 PLN',   amountNote: 'Wynik inwestycji', status: 'Zakończona',       account: 'Rachunek maklerski' },
  { date: '30.06.2026', type: 'Wypłata odsetek',        instrument: 'VEHIS, seria K',               amount: '6 128,00 PLN',    status: 'Rozliczone',         account: 'Rachunek maklerski' },
  { date: '30.06.2026', type: 'Zakończenie inwestycji', instrument: 'Polmax Energia, seria Z',      amount: '2 400,00 PLN',    amountNote: 'Wynik inwestycji', status: 'Zakończona',       account: 'XZ' },
  { date: '12.05.2026', type: 'Zakup obligacji',        instrument: 'Polmax Energia, seria A',      amount: '-150 000,00 PLN', status: 'Rozliczone',         account: 'Rachunek maklerski' },
  { date: '2.04.2026',  type: 'Zakup obligacji',        instrument: 'Victoria Dom, seria B2',       amount: '-280 200,00 PLN', status: 'Rozliczone',         account: 'Rachunek maklerski' },
  { date: '31.03.2026', type: 'Zakończenie inwestycji', instrument: 'VEHIS, seria E',               amount: '4 200,00 PLN',    amountNote: 'Wynik inwestycji', status: 'Zakończona',       account: 'IKE' },
];

export const TX_TOTAL = 68;
