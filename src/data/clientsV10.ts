/* Nr 10: przelacznik klientow (prototyp, jak w review 11f). Kazdy klient to
   inny scenariusz portfela — pelny, same obligacje, fundusze z IKE, sama
   gotowka — zeby sprawdzic, jak ekran wyglada, gdy czegos nie ma.
   Dawid Jankowski to dotychczasowe dane; pozostali sa skladani tutaj. */

import { ASSETS, CASH, V10_ACCOUNT_GROUPS, type Metric, type ResultRange, type V10AccountGroup } from './portfolio';
import type { CurrencyView } from './currencies';
import type { CashDetail, CashKind, CashRow } from './cashV10';

export type ClientId = 'dj' | 'ak' | 'mw' | 'zn';

export const CLIENTS: { id: ClientId; name: string; initials: string; note: string }[] = [
  { id: 'dj', name: 'Dawid Jankowski', initials: 'DJ', note: 'Pełny portfel · PLN, EUR, USD' },
  { id: 'ak', name: 'Katarzyna Lewandowska', initials: 'KL', note: 'Tylko obligacje korporacyjne' },
  { id: 'mw', name: 'Tomasz Zieliński', initials: 'TZ', note: 'Fundusze, Asset Management i IKE' },
  { id: 'zn', name: 'Julia Kamińska', initials: 'JK', note: 'Nowy klient · tylko gotówka' },
];

/* Kafelek klasy, ktorej klient nie ma — w miejscu jej karty. */
export const ASSET_PROMO: Record<string, { first: string; rest: string; cta: string }> = {
  corp: { first: 'Nie masz jeszcze obligacji korporacyjnych.', rest: 'Stałe odsetki od spółek wypłacane w ustalonych terminach.', cta: 'Zobacz emisje' },
  skarb: { first: 'Nie masz jeszcze obligacji skarbowych.', rest: 'Emitowane i gwarantowane przez Skarb Państwa.', cta: 'Kup obligacje skarbowe' },
  fiz: { first: 'Nie masz jeszcze funduszy zamkniętych.', rest: 'Dla inwestujących długoterminowo, umorzenia w wyznaczonych oknach.', cta: 'Zobacz ofertę FIZ' },
  fio: { first: 'Nie masz jeszcze funduszy otwartych.', rest: 'Szeroki wybór funduszy, umorzenie w dowolnym dniu roboczym.', cta: 'Wybierz fundusz' },
  am: { first: 'Nie masz jeszcze strategii Asset Management.', rest: 'Portfel prowadzony przez naszych zarządzających.', cta: 'Poznaj strategie' },
};

/* ------------------------------ scenariusze ------------------------------ */

type Acc = { id: string; name: string; number: string; pos: Record<string, number>; limit?: { label: string; value: string; left: string; progress: number } };
type Spec = {
  assets: Record<string, { amount: number; highlights: Metric[]; rows: Metric[] }>;
  cash: { free: number; blocked: number; transit: number };
  groups: Record<string, Acc[]>;
  freeTitles?: Record<string, string>;
  blocked: { acc: string; row: CashRow }[];
  transit: { acc: string; row: CashRow }[];
  result: [string, number, string, number, number, number, number][];
  periods: Record<string, string>;
};

const SPEC: Record<Exclude<ClientId, 'dj'>, Spec> = {
  ak: {
    assets: {
      corp: {
        amount: 612400,
        highlights: [
          { label: 'Śr. rentowność (ważona)', value: '7,85%' },
          { label: 'Wypłacone odsetki 12M', value: '41 260 PLN' },
          { label: 'Śr. oprocentowanie', value: '7,70%' },
          { label: 'Najbliższy wykup', value: '15.03.2027' },
        ],
        rows: [
          { label: 'Emitenci', value: '4' },
          { label: 'Serie', value: '5' },
        ],
      },
    },
    cash: { free: 38750, blocked: 10024, transit: 0 },
    groups: { maklerskie: [{ id: 'ak-glowny', name: 'Główny', number: '00-00-104211', pos: { corp: 612400, cash: 38750 } }] },
    blocked: [
      { acc: 'ak-glowny', row: { cur: 'PLN', date: '20.11', tag: 'Zapis', title: 'Michael / Ström SA, seria L', sub: '10 000,00 PLN + prowizja 24,00 PLN', amount: '10 024,00 PLN' } },
    ],
    transit: [],
    result: [
      ['12M', 44820, '7,12%', 548900, 100000, 32546, 661174],
      ['24M', 82410, '6,95%', 470000, 150000, 41236, 661174],
      ['Od początku', 118690, '6,88%', 0, 600000, 57516, 661174],
    ],
    periods: { '12M': 'XI 2025 – X 2026', '24M': 'XI 2024 – X 2026', 'Od początku': 'III 2022 – X 2026' },
  },
  mw: {
    assets: {
      fio: {
        amount: 280900,
        highlights: [
          { label: 'Stopa zwrotu 12M', value: '+5,10%' },
          { label: 'Wynik od zakupu', value: '+18 420 PLN' },
        ],
        rows: [
          { label: 'Fundusze', value: '3' },
          { label: 'Ostatnia wycena', value: '30.10.2026' },
        ],
      },
      am: {
        amount: 210000,
        highlights: [
          { label: 'Stopa zwrotu 12M', value: '+5,40%' },
          { label: 'Wynik 12M', value: '+10 760 PLN' },
        ],
        rows: [{ label: 'Strategie', value: '1' }],
      },
    },
    cash: { free: 33400, blocked: 0, transit: 5000 },
    groups: {
      maklerskie: [{ id: 'mw-glowny', name: 'Główny', number: '00-00-211544', pos: { fio: 184600, cash: 21400 } }],
      am: [{ id: 'mw-am', name: 'Strategia zrównoważona', number: '00-00-211870', pos: { am: 210000, cash: 8300 } }],
      emerytalne: [
        {
          id: 'mw-ike',
          name: 'IKE',
          number: '00-00-211902',
          pos: { fio: 96300, cash: 3700 },
          limit: { label: 'Limit wpłat 2026', value: '12 000,00 PLN z 40 000,00 PLN', left: 'pozostało 28 000,00 PLN', progress: 0.3 },
        },
      ],
    },
    freeTitles: { 'mw-am': 'Gotówka w strategii', 'mw-ike': 'Rachunek IKE' },
    blocked: [],
    transit: [
      { acc: 'mw-glowny', row: { cur: 'PLN', date: '20.11', dir: 'in', title: 'Quercus Ochrony Kapitału · umorzenie jednostek', amount: '+ 5 000,00 PLN' } },
    ],
    result: [
      ['12M', 28540, '5,62%', 450000, 80000, 29240, 529300],
      ['24M', 51300, '5,31%', 380000, 140000, 42000, 529300],
      ['Od początku', 79300, '5,12%', 0, 520000, 70000, 529300],
    ],
    periods: { '12M': 'XI 2025 – X 2026', '24M': 'XI 2024 – X 2026', 'Od początku': 'IX 2021 – X 2026' },
  },
  zn: {
    assets: {},
    cash: { free: 20000, blocked: 0, transit: 0 },
    groups: { maklerskie: [{ id: 'zn-glowny', name: 'Główny', number: '00-00-318005', pos: { cash: 20000 } }] },
    blocked: [],
    transit: [],
    result: [
      ['12M', 0, '–', 0, 20000, 0, 20000],
      ['24M', 0, '–', 0, 20000, 0, 20000],
      ['Od początku', 0, '–', 0, 20000, 0, 20000],
    ],
    periods: { '12M': 'XI 2026', '24M': 'XI 2026', 'Od początku': 'XI 2026' },
  },
};

/* --------------------------------- skladanie --------------------------------- */

const fmt = (n: number) => String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const pln = (n: number) => `${fmt(n)},00 PLN`;
const ORDER = ['corp', 'skarb', 'fiz', 'fio', 'am'];
const LABEL: Record<string, string> = {
  corp: 'Obligacje korporacyjne',
  skarb: 'Obligacje skarbowe',
  fiz: 'Fundusze Inwestycyjne Zamknięte',
  fio: 'Fundusze Inwestycyjne Otwarte',
  am: 'Asset Management',
  cash: 'Wolna gotówka',
};
const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

export const hasScenario = (id: ClientId): id is Exclude<ClientId, 'dj'> => id !== 'dj';

export function clientView(id: Exclude<ClientId, 'dj'>): CurrencyView {
  const c = SPEC[id];
  const cashT = c.cash.free + c.cash.blocked + c.cash.transit;
  const invest = Object.values(c.assets).reduce((t, a) => t + a.amount, 0);
  const total = invest + cashT;
  const present = ORDER.filter((k) => c.assets[k]);
  const card = (label: string, v: number) => ({
    label,
    amount: fmt(v),
    decimals: ',00 PLN',
    rows: [{ label: 'PLN', value: v ? `${fmt(v)},00` : '-' }],
  });
  return {
    total: fmt(total),
    decimals: ',00 PLN',
    allocation: [
      ...present.map((k) => ({ id: k, share: (c.assets[k].amount / total) * 100, value: `${fmt(c.assets[k].amount)} PLN` })),
      { id: CASH.id, share: (cashT / total) * 100, value: `${fmt(cashT)} PLN` },
    ],
    cashCards: [card('Wolna gotówka', c.cash.free), card('Gotówka zablokowana', c.cash.blocked), card('Środki w drodze', c.cash.transit)],
    assets: present.map((k) => {
      const base = ASSETS.find((a) => a.id === k)!;
      const o = c.assets[k];
      return { ...base, amount: fmt(o.amount), amountDecimals: ',00 PLN', legendValue: `${fmt(o.amount)} PLN`, highlights: o.highlights, rows: o.rows };
    }),
    accounts: [],
  };
}

/* Grupy rachunkow: tytuly, opisy i kafelki „dodaj” z danych Dawida,
   rachunki z scenariusza. Pusta grupa bez kafelka znika. */
export function clientGroups(id: Exclude<ClientId, 'dj'>): V10AccountGroup[] {
  const c = SPEC[id];
  const BADGE: Record<string, string> = { maklerskie: 'maklerski', am: 'AM', oki: 'nazwa stała' };
  return V10_ACCOUNT_GROUPS.map((g) => ({
    ...g,
    accounts: (c.groups[g.id] ?? []).map((a) => {
      const t = sum(a.pos);
      return {
        id: a.id,
        name: a.name,
        badge: BADGE[g.id],
        number: a.number,
        amount: fmt(t),
        decimals: ',00 PLN',
        limit: a.limit,
        positions: Object.entries(a.pos).map(([k, v]) => ({ asset: k, label: LABEL[k], value: pln(v) })),
      };
    }),
  })).filter((g) => g.accounts.length || g.add);
}

export function clientResult(id: Exclude<ClientId, 'dj'>): ResultRange[] {
  const CAPTION: Record<string, string> = {
    '12M': 'Wynik za ostatnie 12 miesięcy',
    '24M': 'Wynik za ostatnie 24 miesiące',
    'Od początku': 'Wynik od początku inwestowania',
  };
  return SPEC[id].result.map(([r, amount, rate, start, inn, out, end]) => ({
    id: r,
    caption: CAPTION[r],
    amount: amount ? `+${fmt(amount)}` : '0',
    decimals: ',00 PLN',
    rate,
    stats: [
      { label: 'Wartość początkowa', value: pln(start) },
      { label: 'Wpłaty', value: `+${pln(inn)}` },
      { label: 'Wypłaty', value: out ? `−${pln(out)}` : '0,00 PLN' },
      { label: 'Wartość końcowa', value: pln(end) },
    ],
    note: `XIRR, w skali roku · okres ${SPEC[id].periods[r]}`,
  }));
}

export function clientCash(id: Exclude<ClientId, 'dj'>): Record<CashKind, CashDetail> {
  const c = SPEC[id];
  const accs = Object.values(c.groups).flat();
  const acc = (aid: string) => accs.find((a) => a.id === aid)!;
  const STAN = 'stan na 20.11.2026, 12:04';
  const list = (items: { acc: string; row: CashRow }[]) =>
    items.map(({ acc: aid, row }) => ({ id: aid, name: acc(aid).name, number: acc(aid).number, rows: [row] }));
  return {
    'Wolna gotówka': {
      sub: `Dostępna do nowych zleceń i przelewów · ${STAN}`,
      accounts: accs
        .filter((a) => a.pos.cash)
        .map((a) => ({ id: a.id, name: a.name, number: a.number, rows: [{ cur: 'PLN', title: c.freeTitles?.[a.id] ?? 'Rachunek główny', amount: pln(a.pos.cash) }] })),
    },
    'Gotówka zablokowana': {
      sub: c.blocked.length ? `${c.blocked.length} blokada · ${STAN}` : `Brak blokad · ${STAN}`,
      note: 'Zablokowane środki nie są dostępne do nowych dyspozycji. Po realizacji lub anulowaniu zlecenia niewykorzystana kwota wróci do wolnej gotówki.',
      accounts: list(c.blocked),
    },
    'Środki w drodze': {
      sub: c.transit.length ? `${c.transit.length} transakcja w rozliczeniu · ${STAN}` : `Brak transakcji · ${STAN}`,
      note: 'Środki w drodze nie są dostępne do nowych dyspozycji. Przychodzące pojawią się jako wolna gotówka po rozliczeniu transakcji.',
      accounts: list(c.transit),
    },
  };
}
