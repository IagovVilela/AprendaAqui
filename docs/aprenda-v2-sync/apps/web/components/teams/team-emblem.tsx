type TeamEmblemProps = {
  seed: string;
  color: string;
  size?: number;
  className?: string;
};

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash;
}

/** Emblema determinístico: mesma seed gera sempre o mesmo desenho, sem upload de imagem. */
export function TeamEmblem({ seed, color, size = 48, className }: TeamEmblemProps) {
  const hash = hashSeed(seed);
  const shape = hash % 4;
  const initials = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "AA";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label={`Emblema da equipe ${seed}`}
    >
      <defs>
        <linearGradient id={`grad-${hash}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#1C1F4A" />
        </linearGradient>
      </defs>
      {shape === 0 ? <rect width="48" height="48" rx="14" fill={`url(#grad-${hash})`} /> : null}
      {shape === 1 ? <circle cx="24" cy="24" r="23" fill={`url(#grad-${hash})`} /> : null}
      {shape === 2 ? (
        <path d="M24 1 L46 10 V26 Q46 40 24 47 Q2 40 2 26 V10 Z" fill={`url(#grad-${hash})`} />
      ) : null}
      {shape === 3 ? (
        <polygon points="24,2 45,14 45,34 24,46 3,34 3,14" fill={`url(#grad-${hash})`} />
      ) : null}
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        fill="#ffffff"
        fontFamily="system-ui, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}
