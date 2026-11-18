// Peças visuais pequenas usadas em toda a página.

/** Marcador diagonal: barra no ângulo das pernas do Λ e do V (24,7°). */
export function Diag({ className = "" }: { className?: string }) {
  return (
    <svg className={`ah-diag ${className}`} viewBox="0 0 10.4 14" width="10.4" height="14" aria-hidden="true">
      <path d="M0 14 H4 L10.4 0 H6.4 Z" fill="currentColor" />
    </svg>
  );
}

export function Eyebrow({ children, tone = "ve" }: { children: React.ReactNode; tone?: "ve" | "light" }) {
  return (
    <p className={`ah-eyebrow ah-eyebrow--${tone}`}>
      <Diag />
      <span>{children}</span>
    </p>
  );
}

const paths: Record<string, React.ReactNode> = {
  fee: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5 L11 15.5 L16.5 9" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9 L12 4 L21 9" />
      <path d="M5 10 V17 M9.5 10 V17 M14.5 10 V17 M19 10 V17" />
      <path d="M3 20 H21" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 L7 21 L12 18.5 L17 21 L15.5 13.5" />
    </>
  ),
  check: <path d="M5 12.5 L10 17.5 L19 7" />,
  plus: <path d="M12 5 V19 M5 12 H19" />,
  arrow: <path d="M5 12 H19 M13 6 L19 12 L13 18" />,
  menu: <path d="M4 7 H20 M4 12 H20 M4 17 H20" />,
  close: <path d="M6 6 L18 18 M18 6 L6 18" />,
};

export function Icon({ name, size = 24, className = "" }: { name: keyof typeof paths | string; size?: number; className?: string }) {
  return (
    <svg
      className={`ah-icon ${className}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="miter"
      strokeLinecap="butt"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export const brl = (v: number, digits = 0) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: digits, maximumFractionDigits: digits });

export const pct = (v: number) => `${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
