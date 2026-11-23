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
  colors: Record<'1' | '2' | '3' | '4' | '5', Palette>;
  /** wiersze typu „ile sztuk / data” */
  rows: Metric[];
  /** metryki wynikowe — w stylistyce 1 trafiają do szarego paska */
  highlights: Metric[];
};

export const TOTAL = { amount: '4 218 640', decimals: ',00 PLN' };

export const CURRENCIES = ['Łącznie', 'PLN', 'EUR', 'USD'] as const;

/** Kolejność pozycji w legendzie różni się między stylistykami — tak jak w Figmie. */
export const LEGEND_ORDER: Record<'1' | '2' | '3' | '4' | '5', string[]> = {
  '1': ['corp', 'am', 'fio', 'fiz', 'skarb'],
  '2': ['corp', 'skarb', 'am', 'fio', 'fiz'],
  /* Nr 3 ustawia klasy wedlug temperatury koloru, od najcieplejszej do
     najzimniejszej: zolty, rozowy, fioletowy, szary jako punkt zwrotny,
     blekitny — a gotowka w turkusie i tak zawsze zamyka liste pod kreska.
     W Figmie kolory szly na przemian i wykres sie zlewal. */
  '3': ['fiz', 'am', 'fio', 'skarb', 'corp'],
  /* Kolejnosc z Figmy 983:19119: FIZ przed FIO. */
  '4': ['corp', 'skarb', 'am', 'fiz', 'fio'],
  /* Nr 5 (Figma 997:519): kolejnosc wykresu, FIO znow przed FIZ. */
  '5': ['corp', 'skarb', 'am', 'fio', 'fiz'],
};

export const ASSETS: AssetClass[] = [
  {
    id: 'corp',
    name: 'Obligacje korporacyjne',
    share: 42.5,
    amount: '1 792 922',
    amountDecimals: ',00 PLN',
    legendValue: '1 792 922 PLN',
    colors: { '1': { chart: '#065eec', legend: '#065eec', card: '#042468' }, '2': { chart: '#046816', legend: '#046816', card: '#046816' }, '3': { chart: '#c2e6ee', chartFoot: '#78d2e5', legend: '#78d2e5', card: '#78d2e5' }, '4': { chart: '#dbecef', chartFoot: '#11aebd', legend: '#11aebd', card: '#11aebd' } , '5': { chart: '#401cff', legend: '#5f39be', card: '#401cff' } },
    /* Wczesniej karta miala skopiowane metryki obligacji skarbowych (Emitent 1,
       Serie 2, 5,24%). Liczby z podsumowania ekranu obligacji korporacyjnych
       (corpMath, widok laczny): 7 emitentow, 9 serii, rentownosc 7,50%. */
    rows: [
      { label: 'Emitenci', value: '7' },
      { label: 'Serie', value: '9' },
    ],
    highlights: [
      { label: 'Śr. rentowność (ważona)', value: '7,50%' },
      { label: 'Wypłacone odsetki 12M', value: '48 220 PLN' },
      { label: 'Śr. oprocentowanie', value: '7,53%' },
      { label: 'Najbliższy wykup', value: '18.12.2026' },
    ],
  },
  {
    id: 'skarb',
    name: 'Obligacje skarbowe',
    share: 7.5,
    amount: '316 398',
    amountDecimals: ',00 PLN',
    legendValue: '316 398 PLN',
    colors: { '1': { chart: '#e4b212', legend: '#e4b212', card: '#0a21c8' }, '2': { chart: '#0a0ac8', chartFoot: '#0a21c8', legend: '#0a21c8', card: '#0a21c8' }, '3': { chart: '#a8aaa8', chartFoot: '#383a36', legend: '#383a36', card: '#383a36' }, '4': { chart: '#dfdbef', chartFoot: '#1357b7', legend: '#3b7ddb', card: '#3b7ddb' } , '5': { chart: '#065eec', legend: '#065eec', card: '#065eec' } },
    rows: [
      { label: 'Emitent', value: '1' },
      { label: 'Serie', value: '2' },
    ],
    /* Rentownosc przed odsetkami, tak jak przy obligacjach korporacyjnych —
       obie karty obligacji prowadza teraz ta sama metryka. W Figmie kolejnosc
       byla odwrotna, co przy wyroznionej pierwszej metryce zaczelo razic. */
    highlights: [
      { label: 'Śr. rentowność (ważona)', value: '5,24%' },
      { label: 'Wypłacone odsetki 12M', value: '5 240 PLN' },
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
    colors: { '1': { chart: '#11aebd', legend: '#0a21c8', card: '#0aa6c8' }, '2': { chart: '#b044ef', legend: '#b044ef', card: '#b044ef' }, '3': { chart: '#f7bfcc', chartFoot: '#fb6f90', legend: '#fb6f90', card: '#fb6f90' }, '4': { chart: '#f7bfcc', chartFoot: '#f65279', legend: '#fb6f90', card: '#fb6f90' } , '5': { chart: 'rgba(17, 174, 189, 0.53)', chartFoot: '#00a69b', legend: '#0aa6c8', card: '#00a69b' } },
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
    colors: { '1': { chart: '#7e2cb1', chartFoot: '#7e22b6', legend: '#0aa6c8', card: '#ef4444' }, '2': { chart: '#11aebd', legend: '#11aebd', card: '#11aebd' }, '3': { chart: '#dad3fe', chartFoot: '#9b8cfa', legend: '#9b8cfa', card: '#9b8cfa' }, '4': { chart: '#f2ecde', chartFoot: '#e4b212', legend: '#e4b212', card: '#e4b212' } , '5': { chart: '#ef7744', legend: '#cf522e', card: '#ef7744' } },
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
    colors: { '1': { chart: '#ef7744', legend: '#ef4444', card: '#e4b212' }, '2': { chart: '#e4b212', legend: '#e4b212', card: '#e4b212' }, '3': { chart: '#f9eaa7', chartFoot: '#ffdb32', legend: '#ffdb32', card: '#ffdb32' }, '4': { chart: '#f1def2', chartFoot: '#9712e4', legend: '#9712e4', card: '#9712e4' } , '5': { chart: '#e4b212', legend: '#e4b212', card: '#e4b212' } },
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
    '3': { chart: '#a3d2ce', chartFoot: '#2fa39b', legend: '#2fa39b', card: '#2fa39b' },
    '4': { chart: '#e9f0cf', chartFoot: '#8aaf12', legend: '#2fa39b', card: '#2fa39b' },
    '5': { chart: '#eaf0d0', chartFoot: '#9ec421', legend: '#9ec421', card: '#9ec421' },
  } as Record<'1' | '2' | '3' | '4' | '5', Palette>,
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
/** Nr 10: cztery pozycje — dokumenty wypadaja z glownej nawigacji. */
export const V10_NAV = ['Pulpit', 'Portfel', 'Operacje', 'Oferta'];

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
  marker: Record<'1' | '2' | '3' | '4' | '5', string>;
  action: string;
};

export const ACCOUNTS: Account[] = [
  {
    id: 'maklerski',
    marker: { '1': '#042468', '2': '#046816', '3': '#78d2e5', '4': '#11aebd', '5': '#401cff' },
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
    marker: { '1': '#0a21c8', '2': '#0a21c8', '3': '#383a36', '4': '#3b7ddb', '5': '#065eec' },
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
    marker: { '1': '#0aa6c8', '2': '#b044ef', '3': '#fb6f90', '4': '#fb6f90', '5': '#00a69b' },
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
    marker: { '1': '#ef4444', '2': '#11aebd', '3': '#9b8cfa', '4': '#e4b212', '5': '#ef7744' },
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
    marker: { '1': '#e4b212', '2': '#e4b212', '3': '#ffdb32', '4': '#9712e4', '5': '#e4b212' },
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
    marker: { '1': '#9ec421', '2': '#9ec421', '3': '#2fa39b', '4': '#2fa39b', '5': '#9ec421' },
    name: 'AM strategia konserwatywna',
    number: '00-00-008801',
    amount: '168 746',
    amountDecimals: ',00 PLN',
    rows: [],
    action: 'Zobacz szczegóły',
  },
];

/* ====================== STYLISTYKA 10 — UI PORTFELA ======================
   Tresc przeniesiona z wireframe'ow (Figma, strona „↳ ・Portfel v2”, ekran
   P01). Zadna z tych wartosci nie zastepuje danych pozostalych stylistyk —
   nr 10 czyta je zamiast ASSETS.highlights/rows i dokłada sekcje wyniku. */

export type ResultRange = {
  id: string;
  /** naglowek nad kwota, np. „Wynik za ostatnie 12 miesiecy” */
  caption: string;
  amount: string;
  decimals: string;
  /** stopa zwrotu w zielonej pigulce */
  rate: string;
  /** cztery kafelki pod kreska */
  stats: Metric[];
  /** metoda i okres, drobnym drukiem w stopce karty */
  note: string;
};

export const RESULT_RANGES: ResultRange[] = [
  {
    id: '12M',
    caption: 'Wynik za ostatnie 12 miesięcy',
    amount: '+185 300',
    decimals: ',00 PLN',
    rate: '5,05%',
    stats: [
      { label: 'Wartość początkowa', value: '3 884 180,00 PLN' },
      { label: 'Wpłaty', value: '+420 000,00 PLN' },
      { label: 'Wypłaty', value: '−270 840,00 PLN' },
      { label: 'Wartość końcowa', value: '4 218 640,00 PLN' },
    ],
    note: 'XIRR, w skali roku · okres XI 2025 – X 2026',
  },
  {
    id: '24M',
    caption: 'Wynik za ostatnie 24 miesiące',
    amount: '+341 920',
    decimals: ',00 PLN',
    rate: '4,78%',
    stats: [
      { label: 'Wartość początkowa', value: '3 410 500,00 PLN' },
      { label: 'Wpłaty', value: '+760 000,00 PLN' },
      { label: 'Wypłaty', value: '−293 780,00 PLN' },
      { label: 'Wartość końcowa', value: '4 218 640,00 PLN' },
    ],
    note: 'XIRR, w skali roku · okres XI 2024 – X 2026',
  },
  {
    id: 'Od początku',
    caption: 'Wynik od początku inwestowania',
    amount: '+862 140',
    decimals: ',00 PLN',
    rate: '5,41%',
    stats: [
      { label: 'Wartość początkowa', value: '0,00 PLN' },
      { label: 'Wpłaty', value: '+4 120 000,00 PLN' },
      { label: 'Wypłaty', value: '−763 500,00 PLN' },
      { label: 'Wartość końcowa', value: '4 218 640,00 PLN' },
    ],
    note: 'XIRR, w skali roku · okres VI 2019 – X 2026',
  },
];

/** Dwie pierwsze metryki sa na kazdej karcie te same — dopiero po nich ida
 *  metryki wlasciwe dla klasy. Dzieki temu klasy daja sie porownac wzrokiem,
 *  bez czytania etykiet. Liczniki (`rows`) schodza pod kreske: opisuja
 *  pozycje, nie wynik. */
export const V10_ASSETS: Record<
  string,
  { currencies?: string; approx?: boolean; highlights: Metric[]; rows: Metric[] }
> = {
  corp: {
    currencies: 'PLN · EUR',
    highlights: [
      { label: 'Wynik 12M', value: '+62 540,00 PLN' },
      { label: 'Stopa zwrotu 12M', value: '7,10%' },
      { label: 'Wypłacone odsetki 12M', value: '42 980,00 PLN' },
      { label: 'Śr. rentowność (ważona)', value: '7,62%' },
      { label: 'Śr. oprocentowanie', value: '7,49%' },
    ],
    rows: [
      { label: 'Emitenci', value: '7' },
      { label: 'Serie', value: '9' },
      { label: 'Najbliższy wykup', value: '18.12.2026' },
    ],
  },
  skarb: {
    highlights: [
      { label: 'Wynik 12M', value: '+11 420,00 PLN' },
      { label: 'Stopa zwrotu 12M', value: '4,72%' },
      { label: 'Wypłacone odsetki 12M', value: '5 240,00 PLN' },
      { label: 'Śr. rentowność (ważona)', value: '5,24%' },
      { label: 'Śr. oprocentowanie', value: '5,10%' },
    ],
    rows: [
      { label: 'Emitenci', value: '1' },
      { label: 'Serie', value: '2' },
      { label: 'Najbliższy wykup', value: '25.03.2027' },
    ],
  },
  am: {
    currencies: 'PLN · EUR',
    /* Czesc strategii jest prowadzona w EUR, wiec zlotowa suma jest
       przeliczeniem po kursie dnia — stad tylda przed kwota. */
    approx: true,
    highlights: [
      { label: 'Wynik 12M', value: '+58 520,00 PLN' },
      { label: 'Stopa zwrotu 12M', value: '6,10%' },
    ],
    rows: [
      { label: 'Strategie', value: '4' },
      { label: 'Rachunki', value: '4' },
      { label: 'Ostatnia wycena', value: '28.10.2026' },
    ],
  },
  fio: {
    highlights: [
      { label: 'Wynik 12M', value: '+24 180,00 PLN' },
      { label: 'Stopa zwrotu 12M', value: '4,28%' },
    ],
    rows: [
      { label: 'Fundusze', value: '4' },
      { label: 'Ostatnia wycena', value: '30.10.2026' },
    ],
  },
  fiz: {
    highlights: [
      { label: 'Wynik 12M', value: '+28 640,00 PLN' },
      { label: 'Stopa zwrotu 12M', value: '7,02%' },
    ],
    rows: [
      { label: 'Fundusze', value: '4' },
      { label: 'Certyfikaty', value: '120' },
      { label: 'Najbliższe okno umorzenia', value: '20.12.2026' },
    ],
  },
};

/** Notka pod siatka kart — tlumaczy, dlaczego kazda karta zaczyna sie tak
 *  samo. Bez niej uklad wyglada na przypadkowy. */
export const V10_ASSETS_NOTE =
  'Wynik 12M i stopa zwrotu 12M stoją na każdej karcie w tych samych dwóch pierwszych miejscach, ' +
  'żeby klasy dało się porównać. Liczba emitentów, serii i najbliższe zdarzenia zeszły do dolnej ' +
  'belki — opisują pozycję, nie wynik.';

/** Akcje gotowkowe z wireframe'u. Wplata i wyplata to zwykle przyciski,
 *  przeniesienie miedzy wlasnymi rachunkami schodzi do ghosta. */
export const V10_CASH_ACTIONS: { label: string; ghost: boolean }[] = [
  { label: 'Wpłać', ghost: false },
  { label: 'Wypłać', ghost: false },
  { label: 'Przenieś między rachunkami', ghost: true },
];

/* Nazwy klas w wireframe'ach sa pelne — „Fundusze Inwestycyjne Zamkniete”,
   nie skrot w nawiasie — a wiersz gotowki mowi wprost o wolnej gotowce,
   bo tylko ona wchodzi do sumy portfela. */
export const V10_NAMES: Record<string, string> = {
  fiz: 'Fundusze Inwestycyjne Zamknięte',
  fio: 'Fundusze Inwestycyjne Otwarte',
  [CASH.id]: 'Gotówka',
};

/** Kolejnosc z wireframe'u: obligacje, fundusze, Asset Management. */
export const V10_LEGEND_ORDER = ['corp', 'skarb', 'fiz', 'fio', 'am'];

/* Gotowka w legendzie to suma trzech kart z sekcji gotowki, jak w nr 2:
   wolna 253 118 + zablokowana 50 118 + w drodze 45 118 = 348 354 PLN.
   Udzialy licza sie z kwot wzgledem sumy wszystkich wierszy (4 313 876 PLN). */
export const V10_ALLOCATION = [
  { id: 'corp', share: 41.6, value: '1 792 922 PLN' },
  { id: 'skarb', share: 7.3, value: '316 398 PLN' },
  { id: 'fiz', share: 9.8, value: '421 864 PLN' },
  { id: 'fio', share: 13.7, value: '590 610 PLN' },
  { id: 'am', share: 19.6, value: '843 728 PLN' },
  { id: CASH.id, share: 8.1, value: '≈ 348 354 PLN', sub: CASH.sub },
];

/* ---------------- nr 10: przelacznik „Rachunki" (wireframe P02) ----------------
   Rachunki sa pogrupowane typem, bo kazdy typ rzadzi sie innymi zasadami:
   maklerskich mozna miec kilka i same nadajesz im nazwy, OKI jest jedno
   i nazwy nie zmienisz, emerytalne maja ustawowe limity. Plaska lista tego
   nie pokazywala. */

export type V10Position = {
  /** id klasy aktywow — stad bierze sie kolor kropki i segmentu paska */
  asset: string;
  label: string;
  value: string;
};

export type V10Account = {
  id: string;
  name: string;
  /** maly znacznik przy nazwie: typ rachunku albo „nazwa stala" */
  badge?: string;
  number: string;
  amount: string;
  decimals: string;
  /** limit wplat — na razie tylko rachunki emerytalne */
  limit?: { label: string; value: string; left: string; progress: number };
  positions: V10Position[];
  /** para etykieta-wartosc w stopce, obok „Zobacz szczegoly" */
  foot?: { label: string; value: string; warn?: boolean };
};

export type V10AccountGroup = {
  id: string;
  title: string;
  sub: string;
  accounts: V10Account[];
  /** kafelek dzialania — kolejna komorka siatki, przerywanym obrysem,
      bo to miejsce na rachunek, ktorego jeszcze nie ma */
  add?: { title: string; sub: string };
};

export const V10_ACCOUNT_GROUPS: V10AccountGroup[] = [
  {
    id: 'maklerskie',
    title: 'Rachunki maklerskie',
    sub: 'Rachunki zwykłe. Własne nazwy ustawisz w ustawieniach rachunku.',
    accounts: [
      {
        id: 'glowny',
        name: 'Główny',
        badge: 'maklerski',
        number: '00-00-006858',
        amount: '2 362 438',
        decimals: ',00 PLN',
        positions: [
          { asset: 'corp', label: 'Obligacje korporacyjne', value: '1 063 200,00 PLN' },
          { asset: 'skarb', label: 'Obligacje skarbowe', value: '316 398,00 PLN' },
          { asset: 'fiz', label: 'Fundusze Inwestycyjne Zamknięte', value: '421 864,00 PLN' },
          { asset: 'fio', label: 'Fundusze Inwestycyjne Otwarte', value: '420 610,00 PLN' },
          { asset: 'cash', label: 'Wolna gotówka', value: '140 366,00 PLN' },
        ],
        foot: { label: 'Rachunek do wypłat', value: 'tak' },
      },
      {
        id: 'emisje',
        name: 'Na emisje',
        badge: 'maklerski',
        number: '00-00-007432',
        amount: '337 491',
        decimals: ',00 PLN',
        positions: [
          { asset: 'corp', label: 'Obligacje korporacyjne', value: '240 000,00 PLN' },
          { asset: 'fio', label: 'Fundusze Inwestycyjne Otwarte', value: '50 000,00 PLN' },
          { asset: 'cash', label: 'Wolna gotówka', value: '47 491,00 PLN' },
        ],
      },
    ],
    add: {
      title: 'Dodaj kolejny rachunek maklerski',
      sub: 'Przyda się, gdy chcesz oddzielić środki na emisje od reszty portfela.',
    },
  },
  {
    id: 'am',
    title: 'Asset Management',
    sub: 'Strategie zarządzane przez zespół. Każda ma własny rachunek i własny skład.',
    accounts: [
      {
        id: 'am-konserwatywna',
        name: 'Strategia konserwatywna',
        badge: 'AM',
        number: '00-00-008801',
        amount: '168 746',
        decimals: ',00 PLN',
        positions: [
          { asset: 'corp', label: 'Obligacje korporacyjne', value: '96 400,00 PLN' },
          { asset: 'fio', label: 'Fundusze Inwestycyjne Otwarte', value: '58 200,00 PLN' },
          { asset: 'cash', label: 'Wolna gotówka', value: '14 146,00 PLN' },
        ],
        foot: { label: 'Ryzyko', value: '2 / 7' },
      },
    ],
    add: {
      title: 'Załóż nową strategię',
      sub: 'Dobierzemy skład do Twojego profilu. Minimalna wpłata zależy od strategii.',
    },
  },
  {
    id: 'oki',
    title: 'OKI',
    sub:
      'Osobiste konto inwestycyjne — bez podatku od zysków kapitałowych. ' +
      'Nadwyżkę gotówki możesz automatycznie przenosić na rachunek maklerski.',
    accounts: [
      {
        id: 'oki',
        name: 'OKI',
        badge: 'nazwa stała',
        number: '00-00-009120',
        amount: '843 728',
        decimals: ',00 PLN',
        positions: [
          { asset: 'corp', label: 'Obligacje korporacyjne', value: '729 120,00 PLN' },
          { asset: 'cash', label: 'Wolna gotówka', value: '114 608,00 PLN' },
        ],
        foot: { label: 'Automatyczny transfer nadwyżki', value: 'włączony', warn: true },
      },
    ],
  },
  {
    id: 'emerytalne',
    title: 'Rachunki emerytalne',
    sub: 'IKE i IKZE. Limity wpłat wynikają z ustawy, nazw tych rachunków nie można zmienić.',
    accounts: [
      {
        id: 'ike',
        name: 'IKE',
        number: '00-00-007431',
        amount: '506 237',
        decimals: ',00 PLN',
        limit: {
          label: 'Limit wpłat 2026',
          value: '30 000,00 PLN z 40 000,00 PLN',
          left: 'pozostało 10 000,00 PLN',
          progress: 0.75,
        },
        positions: [
          { asset: 'corp', label: 'Obligacje korporacyjne', value: '340 000,00 PLN' },
          { asset: 'fio', label: 'Fundusze Inwestycyjne Otwarte', value: '120 000,00 PLN' },
          { asset: 'cash', label: 'Wolna gotówka', value: '46 237,00 PLN' },
        ],
      },
    ],
    add: {
      title: 'Otwórz rachunek IKZE',
      sub: 'Nie masz jeszcze IKZE. Wpłaty odliczysz od podstawy opodatkowania w rocznym PIT.',
    },
  },
];


/* ---------------- nr 10: podzial na pulpicie (wireframe PU03) ----------------
   Pulpit dzieli portfel inaczej niz Portfel: nie na klasy aktywow, tylko na
   to, co pracuje, i to, co lezy. Portfel odpowiada „z czego to sie sklada",
   pulpit — „ile z tego pracuje". Stad dwa segmenty zamiast szesciu. */

export type PulpitWaluta = { cur: string; amount: string; pln?: string };

export const V10_PULPIT_SPLIT: {
  id: string;
  /** klasa aktywow, z ktorej segment bierze kolor palety nr 2 */
  color: string;
  name: string;
  share: number;
  value: string;
  parts: PulpitWaluta[];
}[] = [
  {
    id: 'inwestycje',
    color: 'skarb',
    name: 'Inwestycje',
    share: 94.0,
    value: '3 965 522,00 PLN',
    parts: [
      { cur: 'PLN', amount: '3 484 020,00' },
      { cur: 'EUR', amount: '73 330,00', pln: '≈ 311 652,00 PLN' },
      { cur: 'USD', amount: '43 000,00', pln: '≈ 169 850,00 PLN' },
    ],
  },
  {
    id: CASH.id,
    color: CASH.id,
    name: 'Wolna gotówka',
    share: 6.0,
    value: '253 118,00 PLN',
    parts: [
      { cur: 'PLN', amount: '190 268,00' },
      { cur: 'EUR', amount: '12 000,00', pln: '≈ 51 000,00 PLN' },
      { cur: 'USD', amount: '3 000,00', pln: '≈ 11 850,00 PLN' },
    ],
  },
];
