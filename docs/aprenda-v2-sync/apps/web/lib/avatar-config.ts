export const AVATAR_SLOTS = [
  "hair",
  "hat",
  "glasses",
  "face",
  "neck",
  "cape",
  "backpack",
  "hands",
  "pet",
  "palette",
] as const;

export type AvatarSlot = (typeof AVATAR_SLOTS)[number];

export type AvatarEquipped = Partial<Record<Exclude<AvatarSlot, "palette">, string>>;

export type AvatarConfig = {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  equipped: AvatarEquipped;
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skinTone: "#c68642",
  hairColor: "#2c1810",
  shirtColor: "#58CC02",
  pantsColor: "#1C1F4A",
  equipped: {
    hair: "hair-short",
  },
};

const HEX_COLOR = /^#([0-9a-fA-F]{6})$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseAvatarConfig(raw: unknown): AvatarConfig {
  if (!isRecord(raw)) {
    return { ...DEFAULT_AVATAR_CONFIG, equipped: { ...DEFAULT_AVATAR_CONFIG.equipped } };
  }

  const equippedRaw = isRecord(raw.equipped) ? raw.equipped : {};
  const equipped: AvatarEquipped = {};

  for (const slot of AVATAR_SLOTS) {
    if (slot === "palette") continue;
    const value = equippedRaw[slot];
    if (typeof value === "string" && value.length > 0) {
      equipped[slot] = value;
    }
  }

  if (!equipped.hair) {
    equipped.hair = DEFAULT_AVATAR_CONFIG.equipped.hair;
  }

  return {
    skinTone:
      typeof raw.skinTone === "string" && HEX_COLOR.test(raw.skinTone)
        ? raw.skinTone
        : DEFAULT_AVATAR_CONFIG.skinTone,
    hairColor:
      typeof raw.hairColor === "string" && HEX_COLOR.test(raw.hairColor)
        ? raw.hairColor
        : DEFAULT_AVATAR_CONFIG.hairColor,
    shirtColor:
      typeof raw.shirtColor === "string" && HEX_COLOR.test(raw.shirtColor)
        ? raw.shirtColor
        : DEFAULT_AVATAR_CONFIG.shirtColor,
    pantsColor:
      typeof raw.pantsColor === "string" && HEX_COLOR.test(raw.pantsColor)
        ? raw.pantsColor
        : DEFAULT_AVATAR_CONFIG.pantsColor,
    equipped,
  };
}

export function slotLabel(slot: AvatarSlot): string {
  switch (slot) {
    case "hair":
      return "Cabelo";
    case "hat":
      return "Chapéu";
    case "glasses":
      return "Óculos";
    case "face":
      return "Rosto";
    case "neck":
      return "Pescoço";
    case "cape":
      return "Capa";
    case "backpack":
      return "Mochila";
    case "hands":
      return "Mãos";
    case "pet":
      return "Mascote";
    case "palette":
      return "Cores";
    default: {
      const _exhaustive: never = slot;
      return _exhaustive;
    }
  }
}
