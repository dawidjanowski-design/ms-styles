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
  /** DD.MM.RRRR */
  date: string;
  type: string;
  instrument: string;
  /** pusta, gdy zdarzenie nie niesie kwoty — np. okno umorzenia */
  amount: string;
  /** klasa aktywow, z ktorej bierze sie kolor kropki na osi czasu */
  asset: string;
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

/* W Figmie wszystkie pięć zdarzeń miało tę samą datę 30.09.2026 — i to datę
   przeszłą, mimo nagłówka „Nadchodzące”. Na osi czasu pięć punktów w jednym
   dniu nie pokazuje niczego, więc daty są wyprowadzone z liczb, które już
   żyją w prototypie: okno umorzenia FIZ i limit wpłat IKE na koniec 2026,
   wykup VEHIS 09.06.2027 z corpViews, odsetki z wypłat 12M poszczególnych
   emitentów. Dzięki temu tabela i oś mówią to samo, co karty na portfelu. */
export const EVENTS: Event[] = [
  { date: '14.11.2026', type: 'Wypłata odsetek', instrument: 'Michael / Ström SA, Seria F', amount: '8 388,00 PLN', asset: 'corp' },
  { date: '28.11.2026', type: 'Kupon, obligacje korporacyjne', instrument: 'VEHIS, Seria K', amount: '12 860,00 PLN', asset: 'corp' },
  { date: '09.12.2026', type: 'Wypłata odsetek', instrument: 'Victoria Dom, Seria B2', amount: '7 100,00 PLN', asset: 'corp' },
  { date: '31.12.2026', type: 'Koniec limitu wpłat IKE', instrument: 'IKE · 00-00-007431', amount: '10 000,00 PLN do wpłaty', asset: 'fio' },
  { date: '31.12.2026', type: 'Okno umorzenia', instrument: 'Fundusze zamknięte (FIZ)', amount: '', asset: 'fiz' },
  { date: '09.06.2027', type: 'Wykup, zwrot kapitału', instrument: 'VEHIS, Seria K', amount: '450 000,00 PLN', asset: 'corp' },
];
