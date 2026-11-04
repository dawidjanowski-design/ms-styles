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
  } as Record<'1' | '2', Palette>,
};

/* Rozbicie wolnej gotowki na waluty — dymek na legendzie (Figma 613:56579).
   Kwoty te same, co karta „Wolna gotowka" na Portfelu, zeby obie liczby
   mowily to samo. Figma ma tam jeszcze CHF, ale u nas tej waluty nie ma
   nigdzie indziej, wiec nie dokladamy jej tylko w tym jednym miejscu. */
export const CASH_BY_CURRENCY = {
  title: 'Wolna gotówka',
  rows: [
    { label: 'PLN', value: '190 118,00 PLN' },
    { label: 'EUR', value: '12 000,00 EUR' },
    { label: 'USD', value: '3 000,00 USD' },
  ],
};

/* Na wczesniejszym ekranie wszystkie trzy karty mialy ten sam podpis;
   nowszy wireframe 733:825 nazywa je poprawnie i to jego trzymamy. */
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
    label: 'Gotówka zablokowana',
    amount: '50 118',
    decimals: ',00 PLN',
    rows: [
      { label: 'PLN', value: '50 118,00' },
      { label: 'EUR', value: '-' },
      { label: 'USD', value: '-' },
    ],
  },
  {
    label: 'Środki w drodze',
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

/* ------------------------- widok „Rachunki" ------------------------- */

export type AccountRow = { label: string; value: string };

export type Account = {
  id: string;
  name: string;
  number: string;
  amount: string;
  amountDecimals: string;
  rows: AccountRow[];
  /** szary pasek w środku karty — na razie tylko limit wpłat IKE */
  strip?: { label: string; value: string; progress?: number };
  /** kolor znacznika przy nazwie, osobny dla każdej stylistyki */
  marker: Record<'1' | '2', string>;
  action: string;
};

export const ACCOUNTS: Account[] = [
  {
    id: 'maklerski',
    marker: { '1': '#042468', '2': '#046816' },
    name: 'Rachunek maklerski',
    number: '00-00-006858',
    amount: '2 362 438',
    amountDecimals: ',00 PLN',
    rows: [
      { label: 'Obligacje korporacyjne', value: '1 063 802,00 PLN' },
      { label: 'Obligacje skarbowe', value: '316 398,00 PLN' },
      { label: 'Fundusze zamknięte (FIZ)', value: '421 864,00 PLN' },
      { label: 'Fundusze otwarte (FIO)', value: '420 610,00 PLN' },
      { label: 'Wolne środki', value: '48 420,00 PLN' },
    ],
    action: 'Zobacz szczegóły',
  },
  {
    id: 'zony',
    marker: { '1': '#0a21c8', '2': '#0a21c8' },
    name: 'Rachunek żony',
    number: '00-00-009120',
    amount: '180 000',
    amountDecimals: ',00 PLN',
    rows: [
      { label: 'Obligacje korporacyjne', value: '150 000,00 PLN' },
      { label: 'Wolne środki', value: '30 000,00 PLN' },
    ],
    action: 'Zobacz szczegóły',
  },
  {
    id: 'oki',
    marker: { '1': '#0aa6c8', '2': '#b044ef' },
    name: 'OKI',
    number: '00-00-009120',
    amount: '843 728',
    amountDecimals: ',00 PLN',
    rows: [
      { label: 'Obligacje korporacyjne', value: '729 120,00 PLN' },
      { label: 'Wolne środki', value: '114 608,00 PLN' },
    ],
    action: 'Zobacz więcej (12)',
  },
  {
    id: 'ike',
    marker: { '1': '#ef4444', '2': '#11aebd' },
    name: 'IKE',
    number: '00-00-007431',
    amount: '506 237',
    amountDecimals: ',00 PLN',
    strip: { label: 'Limit wpłat 2026', value: '30 000 PLN z 40 000 PLN', progress: 0.75 },
    rows: [
      { label: 'Obligacje', value: '340 000,00 PLN' },
      { label: 'Fundusze otwarte (FIO)', value: '120 000,00 PLN' },
      { label: 'Wolne środki', value: '46 237,00 PLN' },
    ],
    action: 'Zobacz więcej (12)',
  },
  {
    id: 'xz',
    marker: { '1': '#e4b212', '2': '#e4b212' },
    name: 'XZ',
    number: '00-00-007432',
    amount: '337 491',
    amountDecimals: ',00 PLN',
    rows: [
      { label: 'Obligacje', value: '240 000,00 PLN' },
      { label: 'Fundusze otwarte (FIO)', value: '50 000,00 PLN' },
      { label: 'Wolne środki', value: '22 491,00 PLN' },
    ],
    action: 'Zobacz więcej (12)',
  },
  {
    id: 'am',
    marker: { '1': '#9ec421', '2': '#9ec421' },
    name: 'AM strategia konserwatywna',
    number: '00-00-008801',
    amount: '168 746',
    amountDecimals: ',00 PLN',
    rows: [],
    action: 'Zobacz szczegóły',
  },
];
