/* Nr 10: szuflady kart gotowki (review po feedbacku, wersja 11f).
   Rachunki nazwane jak w zakladce Rachunki nr 10. Sumy zgadzaja sie z kartami:
   253 118 / 50 118 / 45 118 PLN. */

export type CashKind = 'Wolna gotówka' | 'Gotówka zablokowana' | 'Środki w drodze';
export type CashCur = 'PLN' | 'EUR' | 'USD';

export type CashRow = {
  cur: CashCur;
  title: string;
  amount: string;
  date?: string;
  /** przychodzace / wychodzace — tylko srodki w drodze */
  dir?: 'in' | 'out';
  /** rodzaj blokady — tylko gotowka zablokowana */
  tag?: string;
  /** dopisek: prowizja albo rownowartosc w PLN */
  sub?: string;
};

export type CashAccount = {
  /** id rachunku z V10_ACCOUNT_GROUPS — klik prowadzi do ekranu rachunku */
  id: string;
  name: string;
  number: string;
  rows: CashRow[];
};

export type CashDetail = { sub: string; note?: string; accounts: CashAccount[] };

const STAN = 'stan na 20.11.2026, 12:04';

export const V10_CASH_DETAIL: Record<CashKind, CashDetail> = {
  'Wolna gotówka': {
    sub: `Dostępna do nowych zleceń i przelewów · ${STAN}`,
    note: 'Kwoty w EUR i USD przeliczone na PLN po kursie średnim NBP (EUR 4,25 · USD 3,95).',
    accounts: [
      {
        id: 'glowny',
        name: 'Główny',
        number: '00-00-006858',
        rows: [
          { cur: 'PLN', title: 'Rachunek główny', amount: '77 394,00 PLN' },
          { cur: 'EUR', title: 'Subkonto EUR', amount: '12 000,00 EUR', sub: '51 000,00 PLN' },
          { cur: 'USD', title: 'Subkonto USD', amount: '3 000,00 USD', sub: '11 850,00 PLN' },
        ],
      },
      { id: 'ike', name: 'IKE', number: '00-00-007431', rows: [{ cur: 'PLN', title: 'Rachunek IKE', amount: '46 237,00 PLN' }] },
      { id: 'oki', name: 'OKI', number: '00-00-009120', rows: [{ cur: 'PLN', title: 'Rachunek OKI', amount: '30 000,00 PLN' }] },
      { id: 'emisje', name: 'Na emisje', number: '00-00-007432', rows: [{ cur: 'PLN', title: 'Rachunek maklerski', amount: '22 491,00 PLN' }] },
      {
        id: 'am-konserwatywna',
        name: 'Strategia konserwatywna',
        number: '00-00-008801',
        rows: [{ cur: 'PLN', title: 'Gotówka w strategii', amount: '14 146,00 PLN' }],
      },
    ],
  },
  'Gotówka zablokowana': {
    sub: `3 blokady · ${STAN}`,
    note: 'Zablokowane środki nie są dostępne do nowych dyspozycji. Po realizacji lub anulowaniu zlecenia niewykorzystana kwota wróci do wolnej gotówki.',
    accounts: [
      {
        id: 'glowny',
        name: 'Główny',
        number: '00-00-006858',
        rows: [
          { cur: 'PLN', date: '17.11', tag: 'Zlecenie kupna', title: 'Dekpol S.A., seria D', sub: '30 000,00 PLN + prowizja 70,00 PLN', amount: '30 070,00 PLN' },
        ],
      },
      {
        id: 'ike',
        name: 'IKE',
        number: '00-00-007431',
        rows: [
          { cur: 'PLN', date: '19.11', tag: 'Zlecenie nabycia', title: 'Quercus Ochrony Kapitału', sub: 'jednostki FIO, bez prowizji', amount: '12 000,00 PLN' },
        ],
      },
      {
        id: 'emisje',
        name: 'Na emisje',
        number: '00-00-007432',
        rows: [
          { cur: 'PLN', date: '13.11', tag: 'Zapis', title: 'Nordvik Development S.A., seria C', sub: '8 000,00 PLN + prowizja 48,00 PLN', amount: '8 048,00 PLN' },
        ],
      },
    ],
  },
  'Środki w drodze': {
    sub: `8 transakcji w rozliczeniu · ${STAN}`,
    note: 'Środki w drodze nie są dostępne do nowych dyspozycji. Przychodzące pojawią się jako wolna gotówka, wychodzące jako instrumenty — po rozliczeniu transakcji.',
    accounts: [
      {
        id: 'glowny',
        name: 'Główny',
        number: '00-00-006858',
        rows: [
          { cur: 'PLN', date: '18.11', dir: 'in', title: 'VEHIS, seria M · sprzedaż obligacji', amount: '+ 26 500,00 PLN' },
          { cur: 'PLN', date: '19.11', dir: 'out', title: 'Michael / Ström SA, seria K · opłacenie zapisu', amount: '− 15 000,00 PLN' },
          { cur: 'EUR', date: '19.11', dir: 'in', title: 'Rockbridge FIZ · wykup certyfikatów', amount: '+ 6 500,00 EUR', sub: '28 076,00 PLN' },
          /* Wychodzace EUR: per saldo w drodze dalej 3 500 EUR (15 118 PLN), jak na karcie. */
          { cur: 'EUR', date: '20.11', dir: 'out', title: 'Cavatina Holding, seria P2026B · kupno obligacji', amount: '− 3 000,00 EUR', sub: '12 958,00 PLN' },
        ],
      },
      {
        id: 'ike',
        name: 'IKE',
        number: '00-00-007431',
        rows: [
          { cur: 'PLN', date: '18.11', dir: 'in', title: 'Skarb Państwa, seria DS1033 · sprzedaż obligacji', amount: '+ 50 000,00 PLN' },
          { cur: 'PLN', date: '19.11', dir: 'out', title: 'Skarb Państwa, seria PS0531 · kupno obligacji', amount: '− 13 500,00 PLN' },
        ],
      },
      {
        id: 'emisje',
        name: 'Na emisje',
        number: '00-00-007432',
        rows: [{ cur: 'PLN', date: '13.11', dir: 'out', title: 'Nordvik Development S.A., seria C · opłacenie zapisu', amount: '− 8 000,00 PLN' }],
      },
      {
        id: 'am-konserwatywna',
        name: 'Strategia konserwatywna',
        number: '00-00-008801',
        rows: [{ cur: 'PLN', date: '20.11', dir: 'out', title: 'Alokacja środków w strategii', amount: '− 10 000,00 PLN' }],
      },
    ],
  },
};
