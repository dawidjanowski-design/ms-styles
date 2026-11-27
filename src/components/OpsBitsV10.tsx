import { ArrowDownLeft, ArrowUpRight } from '../icons/Feather';

/* Nr 10: wspolne kawalki tabel operacji (obligacje, emitent).
   Typ operacji z ikona kierunku — ta sama, co w szufladzie srodkow w drodze:
   wplyw zielony, wydatek szary. Status jako kolorowa pigulka. */

export function OpType({ type, negative }: { type: string; negative?: boolean }) {
  return (
    <span className="opType">
      <span className={`opType__icon ${negative ? 'opType__icon--out' : 'opType__icon--in'}`} aria-hidden="true">
        {negative ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
      </span>
      {type}
    </span>
  );
}

const TONE: Record<string, 'pending' | 'blocked' | 'done'> = {
  'W rozliczeniu': 'pending',
  'Środki zablokowane': 'blocked',
  Rozliczone: 'done',
};

export function OpStatus({ status }: { status: string }) {
  const tone = TONE[status] ?? 'blocked';
  return (
    <span className={`opStatus opStatus--${tone}`}>
      {tone === 'done' ? (
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="opStatus__dot" aria-hidden="true" />
      )}
      {status}
    </span>
  );
}
