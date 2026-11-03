/* Ekran obligacji korporacyjnych — dane per waluta, z rozbiciem na rachunki.

   Przełącznik walut działa tu tak samo jak na Portfelu: każda waluta to
   osobny zestaw rachunków, nie przeliczenie. Chipy rachunków faktycznie
   filtrują — po zmianie wyboru przeliczają się suma w nagłówku, pasek
   metryk i lista emitentów.

   Liczby wiążą się z resztą prototypu: suma w widoku „Łącznie" to
   1 792 922,00 PLN, czyli tyle, ile pokazuje karta obligacji na Portfelu,
   a część na IKE w widoku PLN to 340 000,00 PLN — dokładnie tyle, co na
   ekranie rachunku IKE. W Figmie nagłówek mówił 1 854 320,00 PLN przy
   wierszach sumujących się do 1 851 320,00 PLN; żadna z tych liczb nie
   wiązała się z niczym innym w pliku. */

/* Seria siedzi przy czesci, nie przy emitencie — inaczej po odfiltrowaniu
   rachunku wiersz nadal chwalilby sie seriami, ktorych tam nie ma. */
export type AccountPart = { account: string; value: number; series: string[] };

export type CorpIssuer = {
  id: string;
  name: string;
  /** oprocentowanie w procentach, np. 7.65 */
  rate: number;
  /** najbliższy wykup, DD.MM.RRRR */
  maturity: string;
  /** wypłacone odsetki za 12 miesięcy */
  interest12m: number;
  parts: AccountPart[];
};

export type CorpView = {
  unit: string;
  issuers: CorpIssuer[];
};

const MAKLERSKI = 'Rachunek maklerski';

export const CORP_VIEWS: Record<string, CorpView> = {
  Łącznie: {
    unit: 'PLN',
    issuers: [
      {
        id: 'ms',
        name: 'Michael / Ström SA',
        rate: 7.65,
        maturity: '14.03.2028',
        interest12m: 28640,
        parts: [
          { account: MAKLERSKI, value: 400000, series: ['F', 'G'] },
          { account: 'OKI', value: 200000, series: ['H'] },
        ],
      },
      {
        id: 'vehis',
        name: 'VEHIS',
        rate: 7.9,
        maturity: '09.06.2027',
        interest12m: 12480,
        parts: [
          { account: MAKLERSKI, value: 450000, series: ['K'] },
          { account: 'OKI', value: 250000, series: ['M'] },
        ],
      },
      {
        id: 'victoria',
        name: 'Victoria Dom',
        rate: 7.1,
        maturity: '30.09.2029',
        interest12m: 7100,
        parts: [
          { account: MAKLERSKI, value: 213802, series: ['B2'] },
          { account: 'OKI', value: 279120, series: ['B2'] },
        ],
      },
    ],
  },

  PLN: {
    unit: 'PLN',
    issuers: [
      {
        id: 'ms',
        name: 'Michael / Ström SA',
        rate: 7.65,
        maturity: '14.03.2028',
        interest12m: 24200,
        parts: [
          { account: MAKLERSKI, value: 400000, series: ['G'] },
          { account: 'IKE', value: 200000, series: ['F'] },
        ],
      },
      {
        id: 'vehis',
        name: 'VEHIS',
        rate: 7.9,
        maturity: '09.06.2027',
        interest12m: 9800,
        parts: [{ account: MAKLERSKI, value: 400000, series: ['K'] }],
      },
      {
        id: 'victoria',
        name: 'Victoria Dom',
        rate: 7.1,
        maturity: '30.09.2029',
        interest12m: 6200,
        parts: [
          { account: MAKLERSKI, value: 280000, series: ['B2'] },
          { account: 'IKE', value: 140000, series: ['B2'] },
        ],
      },
    ],
  },

  EUR: {
    unit: 'EUR',
    issuers: [
      {
        id: 'ms',
        name: 'Michael / Ström SA',
        rate: 5.1,
        maturity: '12.09.2028',
        interest12m: 9800,
        parts: [{ account: 'Rachunek maklerski EUR', value: 200000, series: ['R'] }],
      },
    ],
  },

  USD: {
    unit: 'USD',
    issuers: [
      {
        id: 'vehis',
        name: 'VEHIS',
        rate: 6.2,
        maturity: '30.06.2029',
        interest12m: 2980,
        parts: [{ account: 'Rachunek maklerski USD', value: 48000, series: ['U1'] }],
      },
    ],
  },
};

/* ------------------------------ liczenie ------------------------------ */

/* toLocaleString nie grupuje czterocyfrowych liczb po polsku (9800, nie 9 800),
   wiec spacje wstawiamy sami. */
export const groupDigits = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const money = (n: number, unit: string) => `${groupDigits(n)},00 ${unit}`;

export const amountParts = (n: number, unit: string) => ({
  int: groupDigits(n),
  dec: `,00 ${unit}`,
});

export const pct = (n: number) => `${n.toFixed(2).replace('.', ',')}%`;

/** Części emitenta leżące na wybranych rachunkach. */
export const partsOf = (issuer: CorpIssuer, accounts: string[]) =>
  issuer.parts.filter((p) => accounts.length === 0 || accounts.includes(p.account));

export const issuerValue = (issuer: CorpIssuer, accounts: string[]) =>
  partsOf(issuer, accounts).reduce((sum, p) => sum + p.value, 0);

/** Serie widoczne po filtrze — bez powtórzeń. */
export const seriesOf = (issuer: CorpIssuer, accounts: string[]) => [
  ...new Set(partsOf(issuer, accounts).flatMap((p) => p.series)),
];

/** Rachunki występujące w danej walucie — chip pojawia się tylko wtedy,
    gdy naprawdę coś na nim leży. */
export const accountsIn = (view: CorpView) => {
  const names: string[] = [];
  for (const i of view.issuers) {
    for (const p of i.parts) if (!names.includes(p.account)) names.push(p.account);
  }
  return names;
};

const toDate = (s: string) => {
  const [d, m, y] = s.split('.').map(Number);
  return new Date(y, m - 1, d).getTime();
};

/** Pasek metryk liczony z aktualnego filtra, a nie wpisany na sztywno. */
export function classMetrics(view: CorpView, accounts: string[]) {
  const visible = view.issuers
    .map((i) => ({ issuer: i, value: issuerValue(i, accounts) }))
    .filter((x) => x.value > 0);

  const total = visible.reduce((s, x) => s + x.value, 0);
  const seriesCount = visible.reduce((s, x) => s + seriesOf(x.issuer, accounts).length, 0);
  const weighted = total
    ? visible.reduce((s, x) => s + x.issuer.rate * x.value, 0) / total
    : 0;
  const interest = visible.reduce(
    (s, x) => s + Math.round((x.issuer.interest12m * x.value) / (x.issuer.parts.reduce((a, p) => a + p.value, 0) || 1)),
    0
  );
  const nearest = visible
    .map((x) => x.issuer.maturity)
    .sort((a, b) => toDate(a) - toDate(b))[0];

  return {
    visible,
    total,
    rows: [
      { label: 'Emitenci', value: String(visible.length) },
      { label: 'Serie', value: String(seriesCount) },
      { label: 'Śr. rentowność (ważona)', value: pct(weighted) },
      { label: 'Wypłacone odsetki 12M', value: money(interest, view.unit) },
      { label: 'Najbliższy wykup', value: nearest ?? '—' },
    ],
  };
}
