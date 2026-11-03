export type Metric = { label: string; value: string };

/** Kolory są w Figmie zdefiniowane osobno dla wykresu, legendy i kropki na karcie —
 *  i w stylistyce nr 1 te trzy palety się różnią. Przeniesione dosłownie. */
export type Palette = { chart: string; chartFoot?: string; legend: string; card: string };

export type AssetClass = {
  id: string;
  name: string;
  /** udział w portfelu, % */
  share: number;
  amount: string;
  amountDecimals: string;
  /** krótka wartość w legendzie */
  legendValue: string;
  colors: Record<'1' | '2', Palette>;
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
    colors: { '1': { chart: '#065eec', legend: '#065eec', card: '#042468' }, '2': { chart: '#046816', legend: '#046816', card: '#046816' } },
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
    colors: { '1': { chart: '#e4b212', legend: '#e4b212', card: '#0a21c8' }, '2': { chart: '#0a0ac8', chartFoot: '#0a21c8', legend: '#0a21c8', card: '#0a21c8' } },
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
    colors: { '1': { chart: '#11aebd', legend: '#0a21c8', card: '#0aa6c8' }, '2': { chart: '#b044ef', legend: '#b044ef', card: '#b044ef' } },
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
    colors: { '1': { chart: '#7e2cb1', chartFoot: '#7e22b6', legend: '#0aa6c8', card: '#ef4444' }, '2': { chart: '#11aebd', legend: '#11aebd', card: '#11aebd' } },
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
    colors: { '1': { chart: '#ef7744', legend: '#ef4444', card: '#e4b212' }, '2': { chart: '#e4b212', legend: '#e4b212', card: '#e4b212' } },
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
  colors: {
    '1': { chart: '#9ec421', legend: '#9ec421', card: '#9ec421' },
    '2': { chart: '#9ec421', legend: '#9ec421', card: '#9ec421' },
  },
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
