/* Kafelek metryki z karty podsumowania nr 10 — wspolny dla ekranu obligacji
   korporacyjnych i karty emitenta. Ikona siedzi w okraglym polu po prawej,
   w linii z etykieta, wiec kafelek nie rosnie w pionie. */

import type { Metric, MetricIcon } from '../data/corpV10';
import {
  ArrowDownLeft,
  BarChart2,
  Calendar,
  Flag,
  Layers,
  Percent,
  Repeat,
  Target,
  TrendingUp,
} from '../icons/Feather';

const IKONY: Record<MetricIcon, typeof Target> = {
  rentownosc: Target,
  odsetki: ArrowDownLeft,
  stopa: TrendingUp,
  wynik: BarChart2,
  nominal: Layers,
  oprocentowanie: Percent,
  miesiecznie: Repeat,
  wyplata: Calendar,
  wykup: Flag,
};

export function MetricTile({ m }: { m: Metric }) {
  const Ikona = m.icon ? IKONY[m.icon] : null;
  return (
    <div className="resultStat">
      <div className="resultStat__top">
        <span className="resultStat__label">{m.label}</span>
        {Ikona && (
          <span className={`resultStat__icon ${m.positive ? 'resultStat__icon--pos' : ''}`}>
            <Ikona size={16} />
          </span>
        )}
      </div>
      <span className={`resultStat__value ${m.positive ? 'resultStat__value--pos' : ''}`}>
        {m.value}
      </span>
      {m.sub && <span className="resultStat__sub">{m.sub}</span>}
    </div>
  );
}
