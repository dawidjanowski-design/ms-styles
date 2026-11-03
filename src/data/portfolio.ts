export type Metric = { label: string; value: string };

export type AssetClass = {
  id: string;
  name: string;
  /** udział w portfelu, % */
  share: number;
  amount: string;
  amountDecimals: string;
  /** krótka wartość w legendzie */
  legendValue: string;
  colorVar: string;
  /** wiersze typu „ile sztuk / data” */
  rows: Metric[];
  /** metryki wynikowe — w stylistyce 1 trafiają do szarego paska */
  highlights: Metric[];
};

export const TOTAL = { amount: '4 218 640', decimals: ',00 PLN' };

export const CURRENCIES = ['Łącznie', 'PLN', 'EUR', 'USD'] as const;

/** Kolejność pozycji w legendzie różni się między stylistykami — tak jak w Figmie. */
export const LEGEND_ORDER: Record<'1' | '2', string[]> = {
  '1': ['corp', 'am', 'fio', 'fiz', 'skarb'],
  '2': ['corp', 'skarb', 'am', 'fio', 'fiz'],
};

export const ASSETS: AssetClass[] = [
  {
    id: 'corp',
    name: 'Obligacje korporacyjne',
    share: 42.5,
    amount: '1 792 922',
    amountDecimals: ',00 PLN',
    legendValue: '1 792 922 PLN',
    colorVar: '--c-corp',
    rows: [
      { label: 'Emitent', value: '1' },
      { label: 'Serie', value: '2' },
    ],
    highlights: [
      { label: 'Śr. rentowność (ważona)', value: '5,24%' },
      { label: 'Wypłacone odsetki 12M', value: '5 240 PLN' },
      { label: 'Śr. oprocentowanie', value: '5,10%' },
      { label: 'Najbliższy wykup', value: '25.03.2027' },
    ],
  },
  {
    id: 'skarb',
    name: 'Obligacje skarbowe',
    share: 7.5,
    amount: '316 398',
    amountDecimals: ',00 PLN',
    legendValue: '316 398 PLN',
    colorVar: '--c-skarb',
    rows: [
      { label: 'Emitent', value: '1' },
      { label: 'Serie', value: '2' },
    ],
    highlights: [
      { label: 'Wypłacone odsetki 12M', value: '5 240 PLN' },
      { label: 'Śr. rentowność (ważona)', value: '5,24%' },
      { label: 'Śr. oprocentowanie', value: '5,10%' },
      { label: 'Najbliższy wykup', value: '25.03.2027' },
    ],
  },
  {
    id: 'am',
    name: 'Asset Management',
    share: 20.0,
    amount: '843 728',
    amountDecimals: ',00 PLN',
    legendValue: '843 728 PLN',
    colorVar: '--c-am',
    rows: [
      { label: 'Strategie', value: '4' },
      { label: 'Rachunki', value: '4' },
    ],
    highlights: [{ label: 'Stopa zwrotu', value: '+6,10%' }],
  },
  {
    id: 'fio',
    name: 'Fundusze otwarte (FIO)',
    share: 14.0,
    amount: '590 610',
    amountDecimals: ',00 PLN',
    legendValue: '590 610 PLN',
    colorVar: '--c-fio',
    rows: [
      { label: 'Fundusze', value: '4' },
      { label: 'Ostatnia wycena', value: '30.10.2026' },
    ],
    highlights: [
      { label: 'Stopa zwrotu 12M', value: '+4,82%' },
      { label: 'Wynik od zakupu', value: '+24 180 PLN' },
    ],
  },
  {
    id: 'fiz',
    name: 'Fundusze zamknięte (FIZ)',
    share: 7.7,
    amount: '421 864',
    amountDecimals: ',00 PLN',
    legendValue: '421 864 PLN',
    colorVar: '--c-fiz',
    rows: [
      { label: 'Fundusze', value: '4' },
      { label: 'Najbliższe okno umorzenia', value: '31.12.2026' },
    ],
    highlights: [
      { label: 'Stopa zwrotu 12M', value: '+4,82%' },
      { label: 'Wynik od zakupu', value: '+24 180 PLN' },
    ],
  },
];

export const CASH = {
  id: 'cash',
  name: 'Gotówka',
  share: 8.3,
  legendValue: '≈ 348 354 PLN',
  sub: 'Wolna 253 118 PLN · Zablokowana 50 118 PLN · W drodze 45 118 PLN',
  colorVar: '--c-cash',
};

export const CASH_CARDS = [
  {
    label: 'Wolna gotówka',
    amount: '253 118',
    decimals: ',00 PLN',
    rows: [
      { label: 'PLN', value: '190 118,00' },
      { label: 'EUR', value: '12 000,00' },
      { label: 'USD', value: '3 000,00' },
    ],
  },
  {
    label: 'Wolna gotówka',
    amount: '50 118',
    decimals: ',00 PLN',
    rows: [
      { label: 'PLN', value: '50 118,00' },
      { label: 'EUR', value: '-' },
      { label: 'USD', value: '-' },
    ],
  },
  {
    label: 'Wolna gotówka',
    amount: '45 118',
    decimals: ',00 PLN',
    rows: [
      { label: 'PLN', value: '30 000,00' },
      { label: 'EUR', value: '3 500,00' },
      { label: 'USD', value: '-' },
    ],
  },
];

export const NAV = ['Pulpit', 'Portfel', 'Operacje', 'Dokumenty', 'Oferty'];
