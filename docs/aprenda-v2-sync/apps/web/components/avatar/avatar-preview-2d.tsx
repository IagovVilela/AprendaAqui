import type { AvatarConfig } from "@/lib/avatar-config";

type AvatarPreview2DProps = {
  config: AvatarConfig;
  size?: number;
  className?: string;
};

export function AvatarPreview2D({ config, size = 72, className }: AvatarPreview2DProps) {
  const { skinTone, hairColor, shirtColor, pantsColor, equipped } = config;
  const pet = equipped.pet;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      role="img"
      aria-label="Avatar do usuário"
    >
      <rect width="80" height="80" rx="20" fill="#eef6e6" />
      {equipped.cape ? (
        <path d="M22 38 Q40 70 58 38" fill={equipped.cape === "cape-hero" ? "#dc2626" : "#58CC02"} />
      ) : null}
      <rect x="32" y="52" width="7" height="16" rx="3" fill={pantsColor} />
      <rect x="41" y="52" width="7" height="16" rx="3" fill={pantsColor} />
      <rect x="28" y="34" width="24" height="22" rx="8" fill={shirtColor} />
      <circle cx="40" cy="24" r="12" fill={skinTone} />
      <ellipse cx="40" cy="16" rx="11" ry="7" fill={hairColor} />
      <circle cx="36" cy="24" r="1.6" fill="#111827" />
      <circle cx="44" cy="24" r="1.6" fill="#111827" />
      {equipped.hat === "hat-crown" ? (
        <polygon points="30,14 34,8 40,12 46,8 50,14" fill="#eab308" />
      ) : null}
      {equipped.hat === "hat-beanie" ? <ellipse cx="40" cy="13" rx="11" ry="6" fill="#3b82f6" /> : null}
      {equipped.glasses ? (
        <g stroke="#111827" strokeWidth="1.4" fill="none">
          <circle cx="36" cy="24" r="3.2" />
          <circle cx="44" cy="24" r="3.2" />
        </g>
      ) : null}
      {pet ? <circle cx="62" cy="48" r="6" fill={pet === "pet-cat" ? "#fb923c" : pet === "pet-bug" ? "#22c55e" : "#94a3b8"} /> : null}
    </svg>
  );
}
