/* Karta rachunku w stylistyce nr 10 — tresc z wireframe'u 1130:27 (rachunek
   Glowny). Sumy grup zgadzaja sie z pozycjami rachunku w Portfelu nr 10
   (V10_ACCOUNT_GROUPS): obligacje korporacyjne 1 063 200, skarbowe 316 398,
   FIZ 421 864, FIO 420 610, wolna gotowka 140 366 — razem 2 362 438 PLN. */

export type CashCurrency = { cur: string; amount: string; pln?: string };

export type AccountCashBox = {
  label: string;
  amount: string;
  decimals: string;
  currencies: CashCurrency[];
  note: string;
};

export type AccountPosition = {
  name: string;
  sub: string;
  value: string;
  /** emitent albo seria z wlasna karta w nr 10 */
  link?: { kind: 'issuer' | 'series'; id: string };
};

export type AccountPositionGroup = {
  /** klasa aktywow — kolor kropki z palety nr 2 (META) */
  asset: string;
  name: string;
  total: string;
  positions: AccountPosition[];
};

export type AccountTx = {
  date: string;
  type: string;
  instrument: string;
  amount: string;
  /** wplyw na rachunek — zielona kwota */
  inflow?: boolean;
  status: string;
  tone?: 'partial';
  kind: 'operacja' | 'przeplyw';
  /** transakcja, ktora zamknela pozycje (sprzedaz / odkupienie calosci) */
  closes?: boolean;
};

export type V10AccountDetail = {
  id: string;
  name: string;
  kind: string;
  number: string;
  amount: string;
  decimals: string;
  cash: AccountCashBox[];
  groups: AccountPositionGroup[];
  transactions: AccountTx[];
};

export const V10_ACCOUNT_DETAIL: Record<string, V10AccountDetail> = {
  glowny: {
    id: 'glowny',
    name: 'Główny',
    kind: 'Rachunek maklerski',
    number: '00-00-006858',
    amount: '2 362 438',
    decimals: ',00 PLN',
    cash: [
      {
        label: 'Wolna gotówka',
        amount: '140 366',
        decimals: ',00 PLN',
        currencies: [
          { cur: 'PLN', amount: '130 166,00' },
          { cur: 'EUR', amount: '2 400,00', pln: '≈ 10 200,00 PLN' },
          { cur: 'USD', amount: '—' },
        ],
        note: 'Dostępne na zlecenia GPW · 130 166,00 PLN',
      },
      {
        label: 'Gotówka zablokowana',
        amount: '12 480',
        decimals: ',00 PLN',
        currencies: [
          { cur: 'PLN', amount: '12 480,00' },
          { cur: 'EUR', amount: '—' },
          { cur: 'USD', amount: '—' },
        ],
        note: 'Zapis na emisję Nordvik Development C · blokada do 23.11.2026',
      },
    ],
    groups: [
      {
        asset: 'corp',
        name: 'Obligacje korporacyjne',
        total: '1 063 200,00 PLN',
        positions: [
          { name: 'Dekpol', sub: '2 serie · C, D', value: '180 000,00 PLN' },
          {
            name: 'VEHIS',
            sub: '1 seria · K',
            value: '320 000,00 PLN',
            link: { kind: 'issuer', id: 'VEHIS' },
          },
          {
            name: 'Victoria Dom',
            sub: '1 seria · B2',
            value: '280 200,00 PLN',
            link: { kind: 'series', id: 'vid0928' },
          },
          { name: 'Nordvik Development', sub: '1 seria · B', value: '230 000,00 PLN' },
          { name: 'Polmax Energia', sub: '1 seria · A', value: '53 000,00 PLN' },
        ],
      },
      {
        /* Makieta pomija skarbowe, ale bez nich grupy nie sumuja sie do
           wartosci rachunku — kwota z pozycji rachunku w Portfelu. */
        asset: 'skarb',
        name: 'Obligacje skarbowe',
        total: '316 398,00 PLN',
        positions: [{ name: 'Skarb Państwa', sub: '2 serie · DS1033, WZ1131', value: '316 398,00 PLN' }],
      },
      {
        asset: 'fiz',
        name: 'Fundusze Inwestycyjne Zamknięte',
        total: '421 864,00 PLN',
        positions: [
          { name: 'Fundusz Obligacji Korporacyjnych FIZ', sub: '120 × 1 432,20 PLN', value: '171 864,00 PLN' },
          { name: 'Fundusz Obligacji Korporacyjnych II FIZ', sub: '100 × 1 000,00 PLN', value: '100 000,00 PLN' },
          { name: 'Fundusz Obligacji Dużych Spółek FIZ', sub: '50 × 1 000,00 PLN', value: '50 000,00 PLN' },
          { name: 'Fundusz Obligacji Strategicznych FIZ', sub: '80 × 1 250,00 PLN', value: '100 000,00 PLN' },
        ],
      },
      {
        asset: 'fio',
        name: 'Fundusze Inwestycyjne Otwarte',
        total: '420 610,00 PLN',
        positions: [
          {
            name: 'Generali Obligacji Uniwersalny (Esaliens Parasol FIO)',
            sub: '4 206,10 × 100,00 PLN',
            value: '420 610,00 PLN',
          },
        ],
      },
    ],
    transactions: [
      { date: '05.10.2026', type: 'Sprzedaż obligacji', instrument: 'VEHIS, seria M', amount: '+41 226,00 PLN', inflow: true, status: 'W rozliczeniu', tone: 'partial', kind: 'operacja' },
      { date: '02.10.2026', type: 'Zapis na obligacje', instrument: 'Dekpol, seria C', amount: '−50 118,00 PLN', status: 'Środki zablokowane', tone: 'partial', kind: 'operacja' },
      { date: '15.09.2026', type: 'Nabycie jednostek', instrument: 'Generali Obligacji Uniwersalny (Esaliens Parasol FIO)', amount: '−50 000,00 PLN', status: 'Rozliczone', kind: 'operacja' },
      { date: '20.08.2026', type: 'Nabycie certyfikatów', instrument: 'Fundusz Obligacji Strategicznych FIZ', amount: '−100 000,00 PLN', status: 'Rozliczone', kind: 'operacja' },
      { date: '10.07.2026', type: 'Sprzedaż obligacji', instrument: 'Victoria Dom, seria A4', amount: '+121 800,00 PLN', inflow: true, status: 'Rozliczone', kind: 'operacja', closes: true },
      { date: '18.06.2026', type: 'Odkupienie jednostek', instrument: 'Skarbiec Konserwatywny (Skarbiec FIO)', amount: '+83 720,00 PLN', inflow: true, status: 'Rozliczone', kind: 'operacja', closes: true },
      { date: '12.05.2026', type: 'Zakup obligacji', instrument: 'Polmax Energia, seria A', amount: '−150 000,00 PLN', status: 'Rozliczone', kind: 'operacja' },
      { date: '02.04.2026', type: 'Zakup obligacji', instrument: 'Victoria Dom, seria B2', amount: '−280 200,00 PLN', status: 'Rozliczone', kind: 'operacja' },
    ],
  },
};

export const V10_TX_TABS = ['Wszystkie', 'Operacje', 'Przepływy', 'Zamknięte pozycje'] as const;
