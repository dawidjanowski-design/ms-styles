/* Ikony Feather (feathericons.com, MIT) — geometria przepisana 1:1 z plikow
   SVG z repozytorium, bez przerysowywania. Siatka 24x24, obrys 2, konce
   i zlaczenia zaokraglone; kolor dziedziczy z `currentColor`, wiec ikona
   bierze kolor tekstu obok siebie.

   Trzymam je w pliku zamiast paczki z npm, bo prototyp nie ma innych
   zaleznosci poza Reactem i nie ma po co dokladac kolejnej dla dziesieciu
   ksztaltow. Dodanie `feather-icons` jest zmiana jednego importu. */

type Props = {
  /** rozmiar w px — domyslnie 16, czyli wielkosc tekstu 13 px obok */
  size?: number;
  /** grubosc obrysu; przy malych rozmiarach 1.75 czyta sie lepiej niz 2 */
  stroke?: number;
  className?: string;
};

function Svg({
  size = 16,
  stroke = 1.75,
  className = '',
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const ChevronDown = (p: Props) => (
  <Svg {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Svg>
);

export const ChevronRight = (p: Props) => (
  <Svg {...p}>
    <polyline points="9 18 15 12 9 6" />
  </Svg>
);

export const ChevronUp = (p: Props) => (
  <Svg {...p}>
    <polyline points="18 15 12 9 6 15" />
  </Svg>
);

export const Check = (p: Props) => (
  <Svg {...p}>
    <polyline points="20 6 9 17 4 12" />
  </Svg>
);

export const Plus = (p: Props) => (
  <Svg {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

export const AlertTriangle = (p: Props) => (
  <Svg {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

export const MoreHorizontal = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </Svg>
);

export const Maximize2 = (p: Props) => (
  <Svg {...p}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </Svg>
);

export const TrendingUp = (p: Props) => (
  <Svg {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </Svg>
);

export const Target = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </Svg>
);

export const ArrowDownLeft = (p: Props) => (
  <Svg {...p}>
    <line x1="17" y1="7" x2="7" y2="17" />
    <polyline points="17 17 7 17 7 7" />
  </Svg>
);

export const BarChart2 = (p: Props) => (
  <Svg {...p}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </Svg>
);

export const Layers = (p: Props) => (
  <Svg {...p}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </Svg>
);

export const Percent = (p: Props) => (
  <Svg {...p}>
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </Svg>
);

export const Calendar = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

export const Flag = (p: Props) => (
  <Svg {...p}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </Svg>
);

export const Repeat = (p: Props) => (
  <Svg {...p}>
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </Svg>
);

export const Info = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
);

export const Download = (p: Props) => (
  <Svg {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);

export const ArrowRight = (p: Props) => (
  <Svg {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Svg>
);

/* Znacznik sortowania: dwa chevrony Feathera zlozone w jednym polu.
   Kolumna nieposortowana pokazuje oba przygaszone, posortowana — sam
   kierunek, pelnym kolorem. */
export const SortNone = ({ size = 16, stroke = 1.75, className = '' }: Props) => (
  <svg
    className={`icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="7 10 12 5 17 10" />
    <polyline points="7 14 12 19 17 14" />
  </svg>
);
