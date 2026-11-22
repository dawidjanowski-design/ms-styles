/* Obligacje korporacyjne — tresc z wireframe'u B01 (Figma 1121:2941).
   Osobny plik, bo ten ekran ma wlasny komplet danych i nie dzieli ich
   z portfelem: tam klasa jest jednym wierszem, tu rozpisuje sie na
   emitentow, serie, przeplywy i operacje. */

/** `positive` — kwota wyniku na plusie, rysowana zielenia klasy. */
export type Metric = { label: string; value: string; sub?: string; positive?: boolean };

export const CORP_HEAD = {
  title: 'Obligacje korporacyjne',
  sub: '7 emitentów · 9 serii · 4 rachunki',
  scope: 'Wszystkie rachunki',
};

/* ------------------------------ serie i emitenci ------------------------------
   Jedno zrodlo liczb dla calej sekcji: wiersze serii. Emitenci, sumy,
   srednie wazone i udzialy licza sie z nich w komponencie, wiec przelacznik
   walut, grupowania i metryki nie moga sie rozjechac z tabela. */

export type Serie = {
  id: string;
  ticker: string;
  name: string;
  issuer: string;
  /** waluta rozliczenia serii */
  cur: 'PLN' | 'EUR';
  count: number;
  /** rentownosc do wykupu, % */
  rate: number;
  /** biezace oprocentowanie (kupon), % */
  coupon: number;
  maturity: string;
  /** wartosci w PLN — po przeliczeniu, jesli seria jest w EUR */
  value: number;
  nominal: number;
  interest12m: number;
  result12m: number;
  /** wartosci w walucie serii, gdy ta nie jest zlotowka */
  curValue?: number;
  curNominal?: number;
  curInterest12m?: number;
  curResult12m?: number;
  /** podstawa oprocentowania, np. „WIBOR 3M + 4,10” */
  base?: string;
  /** najblizsza wyplata odsetek */
  nextCoupon?: string;
  /** rozbicie serii na rachunki — sztuki i wartosc na kazdym */
  accounts?: { account: string; count: number; value: number }[];
};

export const CORP_SERIES: Serie[] = [
  {
    id: 'vhi1128', ticker: 'VHI1128', name: 'seria M', issuer: 'VEHIS', cur: 'PLN', count: 400, rate: 7.85, coupon: 7.9, maturity: '14.11.2028', value: 400000, nominal: 396000, interest12m: 8400, result12m: 14200,
    base: 'WIBOR 3M + 4,10', nextCoupon: '31.12.2026',
    accounts: [
      { account: 'Maklerski ·6858', count: 180, value: 180000 },
      { account: 'OKI ·9120', count: 120, value: 120000 },
      { account: 'IKE ·7431', count: 60, value: 60000 },
      { account: 'Maklerski ·7432', count: 40, value: 40000 },
    ],
  },
  {
    id: 'vhi0627', ticker: 'VHI0627', name: 'seria K', issuer: 'VEHIS', cur: 'PLN', count: 320, rate: 7.95, coupon: 8.0, maturity: '09.06.2027', value: 320000, nominal: 318000, interest12m: 6900, result12m: 11800,
    base: 'WIBOR 3M + 4,20', nextCoupon: '31.12.2026',
    accounts: [{ account: 'Maklerski ·6858', count: 320, value: 320000 }],
  },
  { id: 'nrd0528', ticker: 'NRD0528', name: 'seria B', issuer: 'Nordvik Development', cur: 'PLN', count: 280, rate: 7.3, coupon: 7.35, maturity: '22.05.2028', value: 280000, nominal: 280000, interest12m: 5900, result12m: 9600 },
  { id: 'cvh1226', ticker: 'CVH1226', name: 'seria P2026B', issuer: 'Cavatina Holding', cur: 'EUR', count: 44, rate: 6.8, coupon: 6.7, maturity: '18.12.2026', value: 200000, nominal: 198400, interest12m: 2600, result12m: 5200, curValue: 43330, curNominal: 43000, curInterest12m: 563, curResult12m: 1126 },
  /* Kupon 7,10% = WIBOR 3M 3,90% + marza 3,20 p.p. (karta serii, wireframe 1121:4573). */
  {
    id: 'vid0928', ticker: 'VID0928', name: 'seria B2', issuer: 'Victoria Dom', cur: 'PLN', count: 195, rate: 7.1, coupon: 7.1, maturity: '30.09.2028', value: 194922, nominal: 192000, interest12m: 4200, result12m: 7400,
    base: 'WIBOR 3M + 3,20', nextCoupon: '31.12.2026',
    accounts: [
      { account: 'Maklerski ·6858', count: 55, value: 54922 },
      { account: 'IKE ·7431', count: 140, value: 140000 },
    ],
  },
  { id: 'prg0527', ticker: 'PRG0527', name: 'seria E2', issuer: 'PragmaGO', cur: 'PLN', count: 165, rate: 7.7, coupon: 7.75, maturity: '14.05.2027', value: 165000, nominal: 168000, interest12m: 3200, result12m: 5100 },
  { id: 'dek0228', ticker: 'DEK0228', name: 'seria C', issuer: 'Dekpol', cur: 'PLN', count: 100, rate: 7.4, coupon: 7.45, maturity: '28.02.2028', value: 100000, nominal: 100000, interest12m: 1800, result12m: 3400 },
  { id: 'dek0929', ticker: 'DEK0929', name: 'seria D', issuer: 'Dekpol', cur: 'PLN', count: 80, rate: 7.5, coupon: 7.55, maturity: '14.09.2029', value: 80000, nominal: 79000, interest12m: 1540, result12m: 3040 },
  { id: 'plm0129', ticker: 'PLM0129', name: 'seria A', issuer: 'Polmax Energia', cur: 'PLN', count: 53, rate: 6.9, coupon: 6.95, maturity: '17.01.2029', value: 53000, nominal: 48000, interest12m: 1200, result12m: 2800 },
];

/* Odsetki z pozycji juz zamknietych nie siedza w zadnej serii, a wchodza do
   sumy wyplaconych odsetek — stad osobna pozycja. */
export const CORP_CLOSED_INTEREST = 12480;

/* IRR liczy sie z przeplywow w czasie, ktorych prototyp nie trzyma —
   zamiast udawac wzor, bierzemy liczbe z makiety. Jedna wartosc na widok
   walutowy, bo kazdy ma inny zestaw serii. */
/* Karta emitenta (wireframe 1121:4248). Branza i IRR to dane, nie wzor —
   IRR z makiety, z tego samego powodu co CORP_IRR nizej. Emitent bez wpisu
   nie ma jeszcze swojej karty, wiec jego wiersz w tabeli nie jest linkiem. */
export const CORP_ISSUERS: Record<string, { sector: string; irr: number }> = {
  VEHIS: { sector: 'leasing i finansowanie pojazdów', irr: 8.41 },
};

export const CORP_IRR: Record<string, number> = {
  'Łącznie': 7.1,
  PLN: 7.02,
  EUR: 6.8,
  USD: 0,
};


export const CORP_STRUCTURE_SUB = 'Przełącznik dotyczy wyłącznie tej sekcji';

export const CORP_STRUCTURE_NOTE =
  'Sortujesz klikając w nagłówek kolumny — kolejne kliknięcie odwraca kierunek. ' +
  'Przy kolumnie wartości zamiast sortowania są trzy kropki z dodatkowymi akcjami ' +
  '(m.in. wartość nominalna).';

/* ------------------------------ analiza portfela ------------------------------ */

export type Widget = {
  id: string;
  title: string;
  filters: string[];
  value: string;
  sub: string;
  /** slupki miesieczne z kwotami — tooltip czyta je wprost */
  bars?: { label: string; value: number; text: string }[];
  /** rozbicie wyniku na skladniki */
  parts?: { label: string; value: string; negative?: boolean }[];
};

export const CORP_WIDGETS: Widget[] = [
  {
    id: 'odsetki',
    title: 'Wypłacone odsetki',
    filters: ['12 miesięcy', 'Wszystkie pozycje'],
    value: '48 220,00 PLN',
    sub: 'w tym 12 480,00 PLN z pozycji zamkniętych',
    bars: [
      { label: 'XI 2025', value: 2980, text: '2 980,00 PLN' },
      { label: 'XII 2025', value: 3420, text: '3 420,00 PLN' },
      { label: 'I 2026', value: 2640, text: '2 640,00 PLN' },
      { label: 'II 2026', value: 3880, text: '3 880,00 PLN' },
      { label: 'III 2026', value: 3240, text: '3 240,00 PLN' },
      { label: 'IV 2026', value: 4460, text: '4 460,00 PLN' },
      { label: 'V 2026', value: 2860, text: '2 860,00 PLN' },
      { label: 'VI 2026', value: 3640, text: '3 640,00 PLN' },
      { label: 'VII 2026', value: 5120, text: '5 120,00 PLN' },
      { label: 'VIII 2026', value: 3320, text: '3 320,00 PLN' },
      { label: 'IX 2026', value: 4180, text: '4 180,00 PLN' },
      { label: 'X 2026', value: 8480, text: '8 480,00 PLN' },
    ],
  },
  {
    id: 'irr',
    title: 'Stopa zwrotu (IRR)',
    filters: ['12 miesięcy', 'Aktualnie posiadane'],
    value: '7,10%',
    sub: 'w skali roku · XI 2025 – X 2026',
  },
  {
    id: 'wynik',
    title: 'Wynik portfela',
    filters: ['12 miesięcy'],
    value: '+62 540,00 PLN',
    sub: 'nominalnie, po prowizjach',
    parts: [
      { label: 'Odsetki', value: '+48 220,00 PLN' },
      { label: 'Zmiana wyceny', value: '+18 320,00 PLN' },
      { label: 'Prowizje', value: '−4 000,00 PLN', negative: true },
    ],
  },
];

/* ---------------------------- zapadalnosc i odsetki ---------------------------- */

export type FlowMonth = {
  label: string;
  /** pelny podpis w dymku */
  full: string;
  nominal: number;
  interest: number;
  /** co sie dzieje w tym miesiacu — druga linia dymka */
  note?: string;
};

/* Kwoty, nie ulamki: wysokosc slupka liczy komponent wzgledem najwiekszego
   miesiaca, a dymek pokazuje te same liczby, ktore rysuja wykres. */
export const CORP_FLOWS: FlowMonth[] = [
  { label: 'XI', full: 'listopad 2026', nominal: 0, interest: 4120 },
  { label: 'XII', full: 'grudzień 2026', nominal: 200000, interest: 5240, note: 'Cavatina Holding, seria D — wykup 18.12' },
  { label: 'I', full: 'styczeń 2027', nominal: 0, interest: 3980 },
  { label: 'II', full: 'luty 2027', nominal: 0, interest: 4310 },
  { label: 'III', full: 'marzec 2027', nominal: 0, interest: 4120 },
  { label: 'IV', full: 'kwiecień 2027', nominal: 0, interest: 4480 },
  { label: 'V', full: 'maj 2027', nominal: 0, interest: 3960 },
  { label: 'VI', full: 'czerwiec 2027', nominal: 720000, interest: 5680, note: 'VEHIS, serie K i M — wykup 09.06' },
  { label: 'VII', full: 'lipiec 2027', nominal: 0, interest: 3840 },
  { label: 'VIII', full: 'sierpień 2027', nominal: 0, interest: 4260 },
  { label: 'IX', full: 'wrzesień 2027', nominal: 0, interest: 4010 },
  { label: 'X', full: 'październik 2027', nominal: 0, interest: 4390 },
  { label: 'Później', full: 'po październiku 2027', nominal: 872922, interest: 18640, note: 'Wszystkie przepływy po wybranym horyzoncie' },
];

export const CORP_FLOWS_FILTERS = ['Nominał i odsetki', '12 miesięcy · po miesiącach', 'Kalendarz'];

export const CORP_FLOWS_NOTE =
  'Ostatni słupek zbiera wszystkie przepływy po wybranym horyzoncie. Ogłoszone wcześniejsze ' +
  'wykupy są przeniesione na nowy termin i pomniejszają pozycję w terminie pierwotnym — ' +
  'Victoria Dom, seria B2, wykup częściowy 30% w VI 2027.';

/* ------------------------------ zamkniete pozycje ------------------------------ */

export type ClosedRow = {
  id: string;
  issuer: string;
  /** seria bez nazwy emitenta — na karcie emitenta nazwa jest w tytule */
  short: string;
  tx: string;
  name: string;
  sub: string;
  period: string;
  periodSub: string;
  rate: string;
  invested: string;
  received: string;
  result: string;
  irr: string;
};

export const CORP_CLOSED: ClosedRow[] = [
  {
    id: 'victoria-a4',
    issuer: 'Victoria Dom',
    short: 'VID0726 · seria A4',
    tx: '3 transakcje',
    name: 'Victoria Dom, seria A4',
    sub: 'VID0726 · 3 transakcje',
    period: '04.2024 – 07.2026',
    periodSub: '2 lata 3 mies.',
    rate: 'WIBOR 3M + 3,10 pp',
    invested: '279 009,00 PLN',
    received: '311 681,00 PLN',
    result: '+32 672,00 PLN',
    irr: '7,02%',
  },
  {
    id: 'polmax-z',
    issuer: 'Polmax Energia',
    short: 'PLM0626 · seria Z',
    tx: '2 transakcje',
    name: 'Polmax Energia, seria Z',
    sub: 'PLM0626 · 2 transakcje',
    period: '01.2023 – 06.2026',
    periodSub: '3 lata 5 mies.',
    rate: 'WIBOR 6M + 2,50 pp',
    invested: '60 000,00 PLN',
    received: '62 400,00 PLN',
    result: '+2 400,00 PLN',
    irr: '6,10%',
  },
  {
    id: 'vehis-e',
    issuer: 'VEHIS',
    short: 'VHI0326 · seria E',
    tx: '4 transakcje',
    name: 'VEHIS, seria E',
    sub: 'VHI0326 · 4 transakcje',
    period: '09.2022 – 03.2026',
    periodSub: '3 lata 6 mies.',
    rate: 'stałe 6,00%',
    invested: '100 000,00 PLN',
    received: '104 200,00 PLN',
    result: '+4 200,00 PLN',
    irr: '5,84%',
  },
];

export const CORP_CLOSED_TOTAL = {
  name: 'Razem · 3 zamknięte pozycje',
  sub: '9 transakcji',
  invested: '439 009,00 PLN',
  received: '478 281,00 PLN',
  result: '+39 272,00 PLN',
  irr: '6,74%',
};

export const CORP_CLOSED_NOTE =
  'Stopa zwrotu liczona metodą IRR, w skali roku, po prowizjach — to wynik Twojej inwestycji. ' +
  'Oprocentowanie to warunki serii (kupon), nie wynik.';

/* --------------------------------- operacje --------------------------------- */

export type OpRow = {
  id: string;
  date: string;
  type: string;
  instrument: string;
  account: string;
  amount: string;
  negative?: boolean;
  status: string;
  /** seria z CORP_SERIES — po niej karta emitenta zaweza operacje */
  seriesId?: string;
};

export const CORP_OPS: OpRow[] = [
  { id: 'o1', date: '05.10.2026', type: 'Sprzedaż obligacji', instrument: 'VEHIS, seria M', account: 'Maklerski ·6858', amount: '+41 226,00 PLN', status: 'W rozliczeniu', seriesId: 'vhi1128' },
  { id: 'o2', date: '02.10.2026', type: 'Zapis na emisję', instrument: 'Dekpol, seria C', account: 'Maklerski ·7432', amount: '−50 118,00 PLN', negative: true, status: 'Środki zablokowane' },
  { id: 'o3', date: '30.09.2026', type: 'Wypłata odsetek', instrument: 'Nordvik Development, seria B', account: 'Maklerski ·6858', amount: '+5 420,00 PLN', status: 'Rozliczone' },
  { id: 'o4', date: '30.09.2026', type: 'Wykup obligacji', instrument: 'Polmax Energia, seria Z', account: 'Maklerski ·6858', amount: '+60 000,00 PLN', status: 'Rozliczone' },
  { id: 'o6', date: '30.09.2026', type: 'Wypłata odsetek', instrument: 'VEHIS, seria M', account: 'OKI ·9120', amount: '+6 128,00 PLN', status: 'Rozliczone', seriesId: 'vhi1128' },
  { id: 'o5', date: '31.08.2026', type: 'Wypłata odsetek', instrument: 'Victoria Dom, seria B2', account: 'IKE ·7431', amount: '+4 140,00 PLN', status: 'Rozliczone' },
];

/* Ekran klasy pokazuje piec najnowszych (CORP_OPS.slice), karta emitenta
   wszystkie swoje — w tym starsze, ktore tu nie wchodza. */
export const CORP_OPS_OLDER: OpRow[] = [
  { id: 'o7', date: '30.06.2026', type: 'Wypłata odsetek', instrument: 'VEHIS, seria K', account: 'Maklerski ·6858', amount: '+6 128,00 PLN', status: 'Rozliczone', seriesId: 'vhi0627' },
];

export const CORP_OPS_FILTERS = ['Od początku', 'Wszystkie typy'];
export const CORP_OPS_FOOT = 'Wyświetlono 5 z 68 operacji';

/* ------------------------------ karta serii ------------------------------
   Tresc z wireframe'u 1121:4573. Seria bez wpisu nie ma jeszcze karty, wiec
   jej wiersz w tabelach nie jest linkiem. Kwoty kuponow to dane (harmonogram
   emitenta), nie wynik liczenia — po wykupie czesciowym spadaja do 137 szt. */
export type SeriesDetail = {
  isin: string;
  tickerNote?: string;
  par: number;
  frequency: string;
  formula: string;
  earlyRedemption?: {
    kind: string;
    count: number;
    amount: number;
    date: string;
    remaining: number;
  };
  cost: number;
  costSub: string;
  interestSincePurchase: number;
  irr: number;
  coupons: { date: string; amount: number }[];
  couponsNote?: string;
  instrument: { label: string; note?: string; value: string }[];
};

export const CORP_SERIES_DETAIL: Record<string, SeriesDetail> = {
  vid0928: {
    isin: 'PLVCTRD00045',
    tickerNote: 'wspólny z serią B3',
    par: 1000,
    frequency: 'kwartalnie',
    formula:
      'WIBOR 3M (3,90%) + marża 3,20 p.p. · kupon ustalany na 3 dni robocze przed okresem odsetkowym',
    earlyRedemption: { kind: 'Wykup częściowy — 30% pozycji', count: 58, amount: 58000, date: '15.06.2027', remaining: 137 },
    cost: 194100,
    costSub: '2 transakcje · 10.2025 i 04.2026',
    interestSincePurchase: 13900,
    irr: 7.02,
    coupons: [
      { date: '31.12.2026', amount: 3460 },
      { date: '31.03.2027', amount: 3460 },
      { date: '30.06.2027', amount: 2420 },
      { date: '30.09.2027', amount: 2420 },
    ],
    couponsNote: 'Od 30.06.2027 kwota jest niższa — 30% nominału zostanie wykupione 15.06.2027.',
    instrument: [
      { label: 'Rynek notowań', value: 'GPW Catalyst' },
      { label: 'Data emisji', value: '30.09.2025' },
      { label: 'Amortyzacja', note: 'nominał spłacany jednorazowo w dniu wykupu', value: 'brak' },
      { label: 'Zabezpieczenie', note: 'hipoteka na nieruchomości gruntowej', value: 'tak' },
      { label: 'Wartość nominalna obligacji', value: '1 000,00 PLN' },
      { label: 'Waluta', value: 'PLN' },
    ],
  },
};
