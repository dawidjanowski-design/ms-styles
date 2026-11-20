/* Obligacje korporacyjne — tresc z wireframe'u B01 (Figma 1121:2941).
   Osobny plik, bo ten ekran ma wlasny komplet danych i nie dzieli ich
   z portfelem: tam klasa jest jednym wierszem, tu rozpisuje sie na
   emitentow, serie, przeplywy i operacje. */

export type Metric = { label: string; value: string; sub?: string };

export const CORP_HEAD = {
  title: 'Obligacje korporacyjne',
  sub: '7 emitentów · 9 serii · 4 rachunki',
  scope: 'Wszystkie rachunki',
};

export const CORP_SUMMARY = {
  label: 'Wartość bieżąca',
  amount: '1 792 922',
  decimals: ',00 PLN',
  delta: '+8,0%',
  share: '42,5% wartości całego portfela',
  /* Cztery metryki, ktore odpowiadaja na pytanie „ile to zarabia" */
  main: [
    { label: 'Śr. rentowność (ważona)', value: '7,48%', sub: 'do wykupu, w skali roku' },
    { label: 'Wypłacone odsetki 12M', value: '48 220,00 PLN', sub: 'ostatnie 12 miesięcy' },
    { label: 'Stopa zwrotu 12M', value: '7,10%', sub: 'IRR, w skali roku' },
    { label: 'Wynik 12M', value: '+62 540,00 PLN', sub: 'nominalnie, po prowizjach' },
  ] as Metric[],
  /* Trzy metryki opisujace sam portfel, nie jego wynik */
  extra: [
    { label: 'Wartość nominalna', value: '1 779 400,00 PLN' },
    { label: 'Śr. oprocentowanie (ważone)', value: '7,52%' },
    { label: 'Śr. odsetki miesięczne', value: '11 620,00 PLN' },
  ] as Metric[],
  counters: [
    { label: 'Emitenci', value: '7' },
    { label: 'Serie', value: '9' },
    { label: 'Najbliższy wykup', value: '18.12.2026' },
    { label: 'Najbliższa wypłata odsetek', value: '31.12.2026' },
  ] as Metric[],
};

export type CorpRow = {
  id: string;
  issuer: string;
  series: string;
  rate: string;
  maturity: string;
  value: string;
  /** druga linia w kolumnie wartosci — kwota w walucie instrumentu */
  valueSub?: string;
  share: number;
};

export const CORP_ROWS: CorpRow[] = [
  { id: 'vehis', issuer: 'VEHIS', series: '2 serie', rate: '7,92%', maturity: '09.06.2027', value: '720 000,00 PLN', share: 40.2 },
  { id: 'nordvik', issuer: 'Nordvik Development', series: '1 seria', rate: '7,30%', maturity: '22.05.2028', value: '280 000,00 PLN', share: 15.6 },
  { id: 'cavatina', issuer: 'Cavatina Holding', series: '1 seria', rate: '6,80%', maturity: '18.12.2026', value: '≈ 200 000,00 PLN', valueSub: '43 330,00 EUR', share: 11.2 },
  { id: 'victoria', issuer: 'Victoria Dom', series: '1 seria', rate: '7,10%', maturity: '30.09.2028', value: '194 922,00 PLN', share: 10.9 },
  { id: 'dekpol', issuer: 'Dekpol', series: '2 serie', rate: '7,45%', maturity: '28.02.2028', value: '180 000,00 PLN', share: 10.0 },
  { id: 'pragmago', issuer: 'PragmaGO', series: '1 seria', rate: '7,70%', maturity: '14.05.2027', value: '165 000,00 PLN', share: 9.2 },
  { id: 'polmax', issuer: 'Polmax Energia', series: '1 seria', rate: '6,90%', maturity: '17.01.2029', value: '53 000,00 PLN', share: 2.9 },
];

export const CORP_TOTAL: CorpRow = {
  id: 'razem',
  issuer: 'Razem · 7 emitentów',
  series: '9 serii',
  rate: '7,48%',
  maturity: '18.12.2026',
  value: '1 792 922,00 PLN',
  share: 100,
};

/* Kolumna wartosci ma wlasne menu zamiast ikony sortowania: pod trzema
   kropkami siedzi zmiana metryki na wartosc nominalna. */
export const CORP_COLS = [
  { key: 'issuer', label: 'Emitent', sort: false, menu: false },
  { key: 'series', label: 'Serie', sort: false, menu: false },
  { key: 'rate', label: 'Śr. rentowność', sort: true, menu: false },
  { key: 'maturity', label: 'Najbliższy wykup', sort: true, menu: false },
  { key: 'value', label: 'Wartość bieżąca', sort: false, menu: true },
  { key: 'share', label: 'Udział', sort: true, menu: false, active: true },
];

export const CORP_STRUCTURE_NOTE =
  'Sortujesz klikając w nagłówek kolumny — kolejne kliknięcie odwraca kierunek. ' +
  'Przy kolumnie wartości zamiast sortowania są trzy kropki z dodatkowymi akcjami.';

/* ------------------------------ analiza portfela ------------------------------ */

export type Widget = {
  id: string;
  title: string;
  filters: string[];
  value: string;
  sub: string;
  /** slupki: wysokosc 0-1, podpis pierwszego i ostatniego */
  bars?: { heights: number[]; from: string; to: string };
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
    bars: {
      heights: [0.42, 0.55, 0.38, 0.62, 0.5, 0.72, 0.45, 0.58, 0.8, 0.52, 0.66, 1],
      from: 'XI 2025',
      to: 'X 2026',
    },
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

export type FlowMonth = { label: string; nominal: number; interest: number };

/* Skala jest wspolna dla wszystkich slupkow — inaczej miesiac z jednym
   wykupem wygladalby jak miesiac z trzema. */
export const CORP_FLOWS: FlowMonth[] = [
  { label: 'XI', nominal: 0, interest: 0.06 },
  { label: 'XII', nominal: 0.52, interest: 0.08 },
  { label: 'I', nominal: 0, interest: 0.05 },
  { label: 'II', nominal: 0, interest: 0.07 },
  { label: 'III', nominal: 0, interest: 0.06 },
  { label: 'IV', nominal: 0, interest: 0.08 },
  { label: 'V', nominal: 0, interest: 0.05 },
  { label: 'VI', nominal: 0.4, interest: 0.07 },
  { label: 'VII', nominal: 0, interest: 0.04 },
  { label: 'VIII', nominal: 0, interest: 0.07 },
  { label: 'IX', nominal: 0, interest: 0.06 },
  { label: 'X', nominal: 0, interest: 0.08 },
  { label: 'Później', nominal: 0.82, interest: 0.18 },
];

export const CORP_FLOWS_FILTERS = ['Nominał i odsetki', '12 miesięcy · po miesiącach', 'Kalendarz'];

export const CORP_FLOWS_NOTE =
  'Ostatni słupek zbiera wszystkie przepływy po wybranym horyzoncie. Ogłoszone wcześniejsze ' +
  'wykupy są przeniesione na nowy termin i pomniejszają pozycję w terminie pierwotnym — ' +
  'Victoria Dom, seria B2, wykup częściowy 30% w VI 2027.';

/* ------------------------------ zamkniete pozycje ------------------------------ */

export type ClosedRow = {
  id: string;
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
};

export const CORP_OPS: OpRow[] = [
  { id: 'o1', date: '05.10.2026', type: 'Sprzedaż obligacji', instrument: 'VEHIS, seria M', account: 'Maklerski ·6858', amount: '+41 226,00 PLN', status: 'W rozliczeniu' },
  { id: 'o2', date: '02.10.2026', type: 'Zapis na emisję', instrument: 'Dekpol, seria C', account: 'Maklerski ·7432', amount: '−50 118,00 PLN', negative: true, status: 'Środki zablokowane' },
  { id: 'o3', date: '30.09.2026', type: 'Wypłata odsetek', instrument: 'Nordvik Development, seria B', account: 'Maklerski ·6858', amount: '+5 420,00 PLN', status: 'Rozliczone' },
  { id: 'o4', date: '30.09.2026', type: 'Wykup obligacji', instrument: 'Polmax Energia, seria Z', account: 'Maklerski ·6858', amount: '+60 000,00 PLN', status: 'Rozliczone' },
  { id: 'o5', date: '31.08.2026', type: 'Wypłata odsetek', instrument: 'Victoria Dom, seria B2', account: 'IKE ·7431', amount: '+4 140,00 PLN', status: 'Rozliczone' },
];

export const CORP_OPS_FILTERS = ['Od początku', 'Wszystkie typy'];
export const CORP_OPS_FOOT = 'Wyświetlono 5 z 68 operacji';
