/* Pulpit — tresc z wireframe'u PU03 (Figma 1168:27).

   Wykres glowny pulpitu dzieli portfel inaczej niz portfel: nie na klasy
   aktywow, tylko na to, co pracuje, i to, co lezy. Pulpit odpowiada na
   pytanie „czy cos wymaga mojej uwagi", a nie „z czego sklada sie portfel". */

export type Rozbicie = { cur: string; amount: string; pln?: string };

export type Udzial = {
  id: string;
  name: string;
  share: number;
  amount: string;
  decimals: string;
  parts: Rozbicie[];
};

export const PULPIT_HEAD = {
  greeting: 'Dzień dobry, Dawid',
  asOf: 'Stan na 17.11.2026, 18:20',
  actions: [
    { label: 'Wpłać', primary: true },
    { label: 'Wypłać', primary: false },
    { label: 'Transfer', primary: false },
  ],
};

export const PULPIT_TOTAL = {
  label: 'Aktywa łącznie',
  amount: '4 218 640',
  decimals: ',00 PLN',
};

export const PULPIT_SPLIT: Udzial[] = [
  {
    id: 'inwestycje',
    name: 'Inwestycje',
    share: 94,
    amount: '3 965 522,00 PLN',
    decimals: '',
    parts: [
      { cur: 'PLN', amount: '3 484 020,00' },
      { cur: 'EUR', amount: '73 330,00', pln: '≈ 311 652,00 PLN' },
      { cur: 'USD', amount: '43 000,00', pln: '≈ 169 850,00 PLN' },
    ],
  },
  {
    id: 'cash',
    name: 'Wolna gotówka',
    share: 6,
    amount: '253 118,00 PLN',
    decimals: '',
    parts: [
      { cur: 'PLN', amount: '190 268,00' },
      { cur: 'EUR', amount: '12 000,00', pln: '≈ 51 000,00 PLN' },
      { cur: 'USD', amount: '3 000,00', pln: '≈ 11 850,00 PLN' },
    ],
  },
];

/* Zablokowane i w drodze nie wchodza do sumy aktywow — stad osobna linia,
   a nie kolejny segment wykresu. */
export const PULPIT_CASH_NOTE =
  'Poza sumą: zablokowane 50 118,00 PLN i w drodze 45 118,00 PLN.';

export type Oferta = {
  id: string;
  kind: string;
  name: string;
  sub: string;
  rate: string;
  rateSub: string;
  foot: string;
};

export const PULPIT_OFFERS: Oferta[] = [
  { id: 'vehis', kind: 'Emisja publiczna', name: 'VEHIS', sub: 'obligacje serii K', rate: '7,66%', rateSub: 'WIBOR 6M + 3,80 p.p.', foot: 'zapisy do 27.11.2026' },
  { id: 'marvipol', kind: 'Emisja', name: 'Marvipol Development', sub: 'obligacje serii A', rate: '8,16%', rateSub: 'WIBOR 6M + 4,30 p.p.', foot: 'zapisy do 04.12.2026' },
  { id: 'cavatina', kind: 'Emisja publiczna', name: 'Cavatina Holding', sub: 'obligacje serii M', rate: '7,90%', rateSub: 'oprocentowanie stałe', foot: 'zapisy do 11.12.2026' },
  { id: 'am', kind: 'Strategia', name: 'Asset Management', sub: 'strategia konserwatywna', rate: '5,20%', rateSub: 'cel roczny, netto', foot: 'dostępna stale' },
];

export type Zlecenie = {
  id: string;
  status: string;
  name: string;
  sub: string;
  type: string;
  amount: string;
  date: string;
};

export const PULPIT_ORDERS: Zlecenie[] = [
  { id: 'z1', status: 'Aktywne', name: 'Dekpol S.A., seria D', sub: 'Rachunek maklerski · zlecenie z limitem 100,20%', type: 'Kupno', amount: '50 000,00 PLN', date: '17.11.2026' },
  { id: 'z2', status: 'Częściowo zrealizowane', name: 'Victoria Dom, seria B2', sub: 'Rachunek maklerski · zrealizowano 12 z 20 szt.', type: 'Sprzedaż', amount: '21 340,00 PLN', date: '16.11.2026' },
  { id: 'z3', status: 'Aktywne', name: 'Nordvik Development S.A., seria C', sub: 'Rachunek na emisje · zapis na emisję', type: 'Zapis', amount: '8 000,00 PLN', date: '13.11.2026' },
];

export type Zdarzenie = {
  id: string;
  date: string;
  name: string;
  sub: string;
  amount: string;
  account: string;
};

export const PULPIT_EVENTS: Zdarzenie[] = [
  { id: 'e1', date: '18.11.2026', name: 'Rozrachunek sprzedaży', sub: 'Victoria Dom B2 · 12 z 20 szt.', amount: '+12 804,00 PLN', account: 'Główny' },
  { id: 'e2', date: '23.11.2026', name: 'Przydział emisji', sub: 'Nordvik Development C', amount: '8 000,00 PLN', account: 'Na emisje' },
  { id: 'e3', date: '27.11.2026', name: 'Wcześniejszy wykup — całość pozycji', sub: 'Polmax Energia A · termin przesunięty z 20.03.2027', amount: '+53 000,00 PLN', account: 'Główny' },
  { id: 'e4', date: '30.11.2026', name: 'Wypłata odsetek', sub: 'PragmaGO E', amount: '+4 812,00 PLN', account: 'OKI' },
  { id: 'e5', date: '04.12.2026', name: 'Wcześniejszy wykup — 40% pozycji', sub: 'Nordvik Development B · termin przesunięty z 12.06.2027', amount: '+112 000,00 PLN', account: 'Główny' },
  { id: 'e6', date: '10.12.2026', name: 'Wykup, zwrot kapitału', sub: 'Dekpol B', amount: '+180 000,00 PLN', account: 'IKE' },
];
