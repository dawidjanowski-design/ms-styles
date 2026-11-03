/* Pulpit — Figma 920:7375.
   Z pliku bierzemy wyłącznie treść i układ. Wykres, legenda i kolory
   pochodzą z naszych danych portfela (ASSETS / CASH / LEGEND_ORDER),
   dzięki czemu Pulpit i Portfel pokazują ten sam podział. */

export type Offer = {
  id: string;
  /** klasa aktywów, do której należy oferta */
  asset: string;
  kind: string;
  issuer: string;
  /** plik w public/logos — ścieżka względna, bez przedrostka;
      'wordmark' = wektorowe logo Michael / Ström z nagłówka */
  logo?: { src: string; width: number; height: number } | 'wordmark';
  rate: string;
  note: string;
};

export type Event = {
  date: string;
  type: string;
  instrument: string;
  amount: string;
};

/* Kwota nie jest tutaj — pulpit bierze ją z widoku „Łącznie" w currencies.ts,
   zeby ta sama liczba nie zyla w dwoch miejscach. */
export const DASHBOARD = {
  label: 'Twoje aktywa na wszystkich rachunkach',
  action: 'Przejdź do portfela',
};

export const OFFERS: Offer[] = [
  {
    id: 'vehis-k',
    asset: 'corp',
    kind: 'Emisja Publiczna. Obligacje serii K.',
    issuer: 'VEHIS',
    logo: { src: 'logos/vehis.png', width: 61, height: 10 },
    rate: '7,66%',
    note: '(WIBOR 6M + 3,80 - 4,10 p.p.)',
  },
  {
    id: 'ms-r',
    asset: 'corp',
    kind: 'Emisja Publiczna. Obligacje serii R.',
    issuer: 'Michael / Ström',
    logo: 'wordmark',
    rate: '5,42%',
    note: '(WIBOR 6M + 1,60 p.p.)',
  },
  {
    id: 'victoria-b2',
    asset: 'corp',
    kind: 'Emisja. Obligacje serii B2.',
    issuer: 'Victoria Dom',
    logo: { src: 'logos/victoria-dom.png', width: 79, height: 14 },
    rate: '7,66%',
    note: '(WIBOR 6M + 3,80 - 4,10 p.p.)',
  },
  {
    id: 'am-konserwatywna',
    asset: 'am',
    kind: 'Strategia, konserwatywna',
    issuer: 'Asset Management',
    rate: '5,20%',
    note: '(Cel roczny, netto)',
  },
];

export const EVENTS: Event[] = [
  { date: '30.09.2026', type: 'Wypłata odsetek',             instrument: 'Michael / Ström SA, Seria F',  amount: '8 388,00 PLN' },
  { date: '30.09.2026', type: 'Wykup, zwrot kapitału',       instrument: 'Emitent DEF S.A., Seria D',    amount: '200 000,00 PLN' },
  { date: '30.09.2026', type: 'Kupon, obligacje korporacyjne', instrument: 'Nordvik Development, Seria B', amount: '12 860,00 PLN' },
  { date: '30.09.2026', type: 'Wypłata odsetek',             instrument: 'Nordvik Development, Seria B', amount: '24 000,00 PLN' },
  { date: '30.09.2026', type: 'Wykup, zwrot kapitału',       instrument: 'Polmax Energia, Seria A',      amount: '2 450 000,00 PLN' },
];
