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
