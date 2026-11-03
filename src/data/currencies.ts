/* Przełącznik walut na ekranie Portfel.

   To NIE jest przeliczanie jednego portfela po kursie. Każda zakładka to
   osobny zestaw rachunków prowadzonych w danej walucie — klient może mieć
   milion złotych na rachunku PLN i jednocześnie tylko obligacje korporacyjne
   za 200 tys. na rachunku EUR. Dlatego każdy widok ma własną sumę, własny
   podział na klasy aktywów, własną gotówkę i własne rachunki.

   „Łącznie" jest jedynym widokiem, który sumuje wszystko do jednej liczby. */

import {
  ACCOUNTS,
  ASSETS,
  CASH,
  CASH_CARDS,
  TOTAL,
  type Account,
  type AssetClass,
} from './portfolio';

export type CashCard = {
  label: string;
  amount: string;
  decimals: string;
  rows: { label: string; value: string }[];
};

export type AllocationRow = {
  id: string;
  share: number;
  value: string;
  /** podpis pod wierszem gotówki */
  sub?: string;
};

export type CurrencyView = {
  /** jednostka dopisywana do kwot, np. ',00 EUR' */
  decimals: string;
  total: string;
  allocation: AllocationRow[];
  cashCards: CashCard[];
  assets: AssetClass[];
  accounts: Account[];
};

export const CURRENCIES = ['Łącznie', 'PLN', 'EUR', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Kopia klasy aktywów z podmienionymi kwotami — kolory i nazwa zostają. */
const as = (id: string, over: Partial<AssetClass>): AssetClass => {
  const base = ASSETS.find((a) => a.id === id);
  if (!base) throw new Error(`Nieznana klasa aktywów: ${id}`);
  return { ...base, ...over };
};

/* W widoku jednowalutowym kolumna PLN/EUR/USD nie niesie nic poza myslnikami,
   wiec karty gotowki pokazuja rozbicie na rachunki. */
const onAccount = (name: string, value: string) => [{ label: name, value }];

/* ------------------------------- PLN ------------------------------- */

const PLN_ASSETS: AssetClass[] = [
  as('corp', { share: 39.6, amount: '1 420 000', legendValue: '1 420 000 PLN' }),
  as('skarb', { share: 8.8 }),
  as('am', { share: 23.5 }),
  as('fio', { share: 16.5 }),
  as('fiz', { share: 6.2, amount: '221 864', legendValue: '221 864 PLN' }),
];

const PLN_ACCOUNTS: Account[] = [
  {
    id: 'maklerski',
    marker: { '1': '#042468', '2': '#046816' },
    name: 'Rachunek maklerski',
    number: '00-00-006858',
    amount: '2 200 000',
    amountDecimals: ',00 PLN',
    rowsLabel: 'Pozycje',
    rows: [
      { label: 'Obligacje korporacyjne', value: '1 420 000,00 PLN' },
      { label: 'Obligacje skarbowe', value: '316 398,00 PLN' },
      { label: 'Fundusze zamknięte (FIZ)', value: '221 864,00 PLN' },
      { label: 'Fundusze otwarte (FIO)', value: '190 610,00 PLN' },
      { label: 'Wolne środki', value: '51 128,00 PLN' },
    ],
    action: 'Zobacz szczegóły',
  },
  {
    id: 'ike',
    marker: { '1': '#ef4444', '2': '#11aebd' },
    name: 'IKE',
    number: '00-00-007431',
    amount: '400 000',
    amountDecimals: ',00 PLN',
    strip: { label: 'Limit wpłat 2026', value: '30 000 PLN z 40 000 PLN', progress: 0.75 },
    rowsLabel: 'Papiery',
    rows: [{ label: 'Fundusze otwarte (FIO)', value: '400 000,00 PLN' }],
    action: 'Zobacz szczegóły',
  },
  {
    id: 'am',
    marker: { '1': '#9ec421', '2': '#9ec421' },
    name: 'AM strategia konserwatywna',
    number: '00-00-008801',
    amount: '843 728',
    amountDecimals: ',00 PLN',
    rows: [],
    action: 'Zobacz szczegóły',
  },
  {
    id: 'zony',
    marker: { '1': '#0a21c8', '2': '#0a21c8' },
    name: 'Rachunek żony',
    number: '00-00-009120',
    amount: '142 692',
    amountDecimals: ',00 PLN',
    rowsLabel: 'Pozycje',
    rows: [{ label: 'Wolne środki', value: '142 692,00 PLN' }],
    action: 'Zobacz szczegóły',
  },
];

/* ------------------------------- EUR ------------------------------- */

const EUR_ASSETS: AssetClass[] = [
  as('corp', {
    share: 80.5,
    amount: '200 000',
    amountDecimals: ',00 EUR',
    legendValue: '200 000 EUR',
    rows: [
      { label: 'Emitent', value: '1' },
      { label: 'Serie', value: '1' },
    ],
    highlights: [
      { label: 'Śr. rentowność (ważona)', value: '5,10%' },
      { label: 'Wypłacone odsetki 12M', value: '9 800 EUR' },
      { label: 'Śr. oprocentowanie', value: '4,90%' },
      { label: 'Najbliższy wykup', value: '12.09.2028' },
    ],
  }),
  as('fiz', {
    share: 14.7,
    amount: '36 400',
    amountDecimals: ',00 EUR',
    legendValue: '36 400 EUR',
    rows: [
      { label: 'Fundusze', value: '1' },
      { label: 'Najbliższe okno umorzenia', value: '31.12.2026' },
    ],
    highlights: [
      { label: 'Stopa zwrotu 12M', value: '+3,40%' },
      { label: 'Wynik od zakupu', value: '+1 180 EUR' },
    ],
  }),
];

const EUR_ACCOUNTS: Account[] = [
  {
    id: 'maklerski-eur',
    marker: { '1': '#042468', '2': '#046816' },
    name: 'Rachunek maklerski EUR',
    number: '00-00-006858/EUR',
    amount: '248 400',
    amountDecimals: ',00 EUR',
    rowsLabel: 'Pozycje',
    rows: [
      { label: 'Obligacje korporacyjne', value: '200 000,00 EUR' },
      { label: 'Fundusze zamknięte (FIZ)', value: '36 400,00 EUR' },
      { label: 'Wolne środki', value: '12 000,00 EUR' },
    ],
    action: 'Zobacz szczegóły',
  },
];

/* ------------------------------- USD ------------------------------- */

const USD_ASSETS: AssetClass[] = [
  as('corp', {
    share: 78.7,
    amount: '48 000',
    amountDecimals: ',00 USD',
    legendValue: '48 000 USD',
    rows: [
      { label: 'Emitent', value: '1' },
      { label: 'Serie', value: '1' },
    ],
    highlights: [
      { label: 'Śr. rentowność (ważona)', value: '6,20%' },
      { label: 'Wypłacone odsetki 12M', value: '2 980 USD' },
      { label: 'Śr. oprocentowanie', value: '6,00%' },
      { label: 'Najbliższy wykup', value: '30.06.2029' },
    ],
  }),
];

const USD_ACCOUNTS: Account[] = [
  {
    id: 'maklerski-usd',
    marker: { '1': '#042468', '2': '#046816' },
    name: 'Rachunek maklerski USD',
    number: '00-00-006858/USD',
    amount: '61 000',
    amountDecimals: ',00 USD',
    rowsLabel: 'Pozycje',
    rows: [
      { label: 'Obligacje korporacyjne', value: '48 000,00 USD' },
      { label: 'Wolne środki', value: '13 000,00 USD' },
    ],
    action: 'Zobacz szczegóły',
  },
];

/* ------------------------------ widoki ------------------------------ */

export const VIEWS: Record<Currency, CurrencyView> = {
  Łącznie: {
    total: TOTAL.amount,
    decimals: TOTAL.decimals,
    allocation: [
      ...ASSETS.map((a) => ({ id: a.id, share: a.share, value: a.legendValue })),
      { id: CASH.id, share: CASH.share, value: CASH.legendValue, sub: CASH.sub },
    ],
    cashCards: CASH_CARDS,
    assets: ASSETS,
    accounts: ACCOUNTS,
  },

  PLN: {
    total: '3 586 420',
    decimals: ',00 PLN',
    allocation: [
      ...PLN_ASSETS.map((a) => ({ id: a.id, share: a.share, value: a.legendValue })),
      {
        id: 'cash',
        share: 5.4,
        value: '193 820 PLN',
        sub: 'Wolna 150 000 PLN · Zablokowana 25 000 PLN · W drodze 18 820 PLN',
      },
    ],
    cashCards: [
      {
        label: 'Wolna gotówka',
        amount: '150 000',
        decimals: ',00 PLN',
        rows: [
          { label: 'Rachunek maklerski', value: '40 000,00' },
          { label: 'Rachunek żony', value: '110 000,00' },
        ],
      },
      {
        label: 'Gotówka zablokowana',
        amount: '25 000',
        decimals: ',00 PLN',
        rows: [
          { label: 'Rachunek maklerski', value: '11 128,00' },
          { label: 'Rachunek żony', value: '13 872,00' },
        ],
      },
      {
        label: 'Środki w drodze',
        amount: '18 820',
        decimals: ',00 PLN',
        rows: [
          { label: 'Rachunek maklerski', value: '0,00' },
          { label: 'Rachunek żony', value: '18 820,00' },
        ],
      },
    ],
    assets: PLN_ASSETS,
    accounts: PLN_ACCOUNTS,
  },

  EUR: {
    total: '248 400',
    decimals: ',00 EUR',
    allocation: [
      ...EUR_ASSETS.map((a) => ({ id: a.id, share: a.share, value: a.legendValue })),
      { id: 'cash', share: 4.8, value: '12 000 EUR', sub: 'Wolna 12 000 EUR' },
    ],
    cashCards: [
      { label: 'Wolna gotówka', amount: '12 000', decimals: ',00 EUR', rows: onAccount('Rachunek maklerski EUR', '12 000,00') },
      { label: 'Gotówka zablokowana', amount: '0', decimals: ',00 EUR', rows: onAccount('Rachunek maklerski EUR', '0,00') },
      { label: 'Środki w drodze', amount: '0', decimals: ',00 EUR', rows: onAccount('Rachunek maklerski EUR', '0,00') },
    ],
    assets: EUR_ASSETS,
    accounts: EUR_ACCOUNTS,
  },

  USD: {
    total: '61 000',
    decimals: ',00 USD',
    allocation: [
      ...USD_ASSETS.map((a) => ({ id: a.id, share: a.share, value: a.legendValue })),
      { id: 'cash', share: 21.3, value: '13 000 USD', sub: 'Wolna 13 000 USD' },
    ],
    cashCards: [
      { label: 'Wolna gotówka', amount: '13 000', decimals: ',00 USD', rows: onAccount('Rachunek maklerski USD', '13 000,00') },
      { label: 'Gotówka zablokowana', amount: '0', decimals: ',00 USD', rows: onAccount('Rachunek maklerski USD', '0,00') },
      { label: 'Środki w drodze', amount: '0', decimals: ',00 USD', rows: onAccount('Rachunek maklerski USD', '0,00') },
    ],
    assets: USD_ASSETS,
    accounts: USD_ACCOUNTS,
  },
};
