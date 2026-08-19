import type { AvatarSlot } from "./avatar-config";

export type AvatarRarity = "common" | "rare" | "epic" | "legendary";

export type AvatarItem = {
  key: string;
  name: string;
  description: string;
  slot: AvatarSlot;
  priceGems: number;
  rarity: AvatarRarity;
  previewColor: string;
  free?: boolean;
};

export const SKIN_TONES = [
  { key: "ivory", name: "Marfim", hex: "#f3d1b8" },
  { key: "peach", name: "Pêssego", hex: "#e8b894" },
  { key: "gold", name: "Dourado", hex: "#c68642" },
  { key: "amber", name: "Âmbar", hex: "#8d5524" },
  { key: "bronze", name: "Bronze", hex: "#5c3317" },
  { key: "espresso", name: "Expresso", hex: "#3b2214" },
] as const;

export const FREE_HAIR_COLORS = [
  { key: "black", name: "Preto", hex: "#1a1210" },
  { key: "brown", name: "Castanho", hex: "#2c1810" },
  { key: "chocolate", name: "Chocolate", hex: "#5a3214" },
  { key: "blonde", name: "Loiro", hex: "#d4a017" },
  { key: "copper", name: "Cobre", hex: "#a84c1a" },
  { key: "gray", name: "Grisalho", hex: "#8a8a8a" },
] as const;

export const NEON_HAIR_COLORS = [
  { key: "lime", name: "Lima", hex: "#58CC02" },
  { key: "cyan", name: "Ciano", hex: "#22d3ee" },
  { key: "magenta", name: "Magenta", hex: "#e879f9" },
  { key: "violet", name: "Violeta", hex: "#8b5cf6" },
] as const;

export const PASTEL_HAIR_COLORS = [
  { key: "pink", name: "Rosa", hex: "#f9a8d4" },
  { key: "mint", name: "Menta", hex: "#6ee7b7" },
  { key: "sky", name: "Céu", hex: "#93c5fd" },
  { key: "lavender", name: "Lavanda", hex: "#c4b5fd" },
] as const;

export const SHIRT_COLORS = [
  { key: "brand", name: "Verde Aprenda", hex: "#58CC02" },
  { key: "navy", name: "Marinho", hex: "#1C1F4A" },
  { key: "sky", name: "Azul", hex: "#3b82f6" },
  { key: "orange", name: "Laranja", hex: "#fb923c" },
  { key: "red", name: "Vermelho", hex: "#ef4444" },
  { key: "white", name: "Branco", hex: "#f8fafc" },
] as const;

export const PANTS_COLORS = [
  { key: "navy", name: "Marinho", hex: "#1C1F4A" },
  { key: "denim", name: "Jeans", hex: "#334155" },
  { key: "black", name: "Preto", hex: "#111827" },
  { key: "brown", name: "Marrom", hex: "#7c4a2d" },
] as const;

export const AVATAR_ITEMS: AvatarItem[] = [
  {
    key: "hair-short",
    name: "Cabelo curto",
    description: "Estilo clássico para começar.",
    slot: "hair",
    priceGems: 0,
    rarity: "common",
    previewColor: "#2c1810",
    free: true,
  },
  {
    key: "hair-curly",
    name: "Cabelo cacheado",
    description: "Volumoso e cheio de personalidade.",
    slot: "hair",
    priceGems: 0,
    rarity: "common",
    previewColor: "#5a3214",
    free: true,
  },
  {
    key: "hair-long",
    name: "Cabelo longo",
    description: "Queda suave até os ombros.",
    slot: "hair",
    priceGems: 60,
    rarity: "common",
    previewColor: "#d4a017",
  },
  {
    key: "hair-bun",
    name: "Coque",
    description: "Prático para longas sessões de código.",
    slot: "hair",
    priceGems: 50,
    rarity: "common",
    previewColor: "#2c1810",
  },
  {
    key: "hair-mohawk",
    name: "Moicano",
    description: "Para quem debuga com atitude.",
    slot: "hair",
    priceGems: 90,
    rarity: "rare",
    previewColor: "#58CC02",
  },
  {
    key: "hair-ponytail",
    name: "Rabo de cavalo",
    description: "Esporte e foco no desafio.",
    slot: "hair",
    priceGems: 70,
    rarity: "common",
    previewColor: "#a84c1a",
  },
  {
    key: "hat-beanie",
    name: "Gorro",
    description: "Quentinho para maratonas de lições.",
    slot: "hat",
    priceGems: 80,
    rarity: "common",
    previewColor: "#3b82f6",
  },
  {
    key: "hat-cap",
    name: "Boné",
    description: "Casual, perfeito para o pátio da escola.",
    slot: "hat",
    priceGems: 80,
    rarity: "common",
    previewColor: "#ef4444",
  },
  {
    key: "hat-crown",
    name: "Coroa",
    description: "Para quem chegou ao topo do ranking.",
    slot: "hat",
    priceGems: 280,
    rarity: "legendary",
    previewColor: "#eab308",
  },
  {
    key: "hat-wizard",
    name: "Chapéu de mago",
    description: "Conjura funções sem erro de sintaxe.",
    slot: "hat",
    priceGems: 220,
    rarity: "epic",
    previewColor: "#6d28d9",
  },
  {
    key: "hat-headphones",
    name: "Fone de ouvido",
    description: "Trilha sonora oficial do aprendizado.",
    slot: "hat",
    priceGems: 150,
    rarity: "rare",
    previewColor: "#111827",
  },
  {
    key: "hat-propeller",
    name: "Chapéu hélice",
    description: "Decola rumo à próxima unidade.",
    slot: "hat",
    priceGems: 120,
    rarity: "rare",
    previewColor: "#f97316",
  },
  {
    key: "hat-helmet",
    name: "Capacete espacial",
    description: "Missão: conquistar todas as trilhas.",
    slot: "hat",
    priceGems: 200,
    rarity: "epic",
    previewColor: "#94a3b8",
  },
  {
    key: "glasses-round",
    name: "Óculos redondos",
    description: "Look clássico de quem lê a documentação.",
    slot: "glasses",
    priceGems: 70,
    rarity: "common",
    previewColor: "#1C1F4A",
  },
  {
    key: "glasses-pixel",
    name: "Óculos pixel",
    description: "Visão 8-bits para caçar bugs.",
    slot: "glasses",
    priceGems: 110,
    rarity: "rare",
    previewColor: "#22c55e",
  },
  {
    key: "glasses-visor",
    name: "Visor cyber",
    description: "Interface futurista ativada.",
    slot: "glasses",
    priceGems: 160,
    rarity: "epic",
    previewColor: "#06b6d4",
  },
  {
    key: "glasses-star",
    name: "Óculos estrela",
    description: "Brilho extra na hora do acerto.",
    slot: "glasses",
    priceGems: 90,
    rarity: "rare",
    previewColor: "#eab308",
  },
  {
    key: "face-mask",
    name: "Máscara ninja",
    description: "Modo stealth no ranking semanal.",
    slot: "face",
    priceGems: 100,
    rarity: "rare",
    previewColor: "#111827",
  },
  {
    key: "face-blush",
    name: "Blush",
    description: "Quando o código compila de primeira.",
    slot: "face",
    priceGems: 40,
    rarity: "common",
    previewColor: "#f9a8d4",
  },
  {
    key: "neck-scarf",
    name: "Cachecol",
    description: "Estilo e conforto entre uma lição e outra.",
    slot: "neck",
    priceGems: 90,
    rarity: "common",
    previewColor: "#ef4444",
  },
  {
    key: "neck-bowtie",
    name: "Gravata borboleta",
    description: "Pronto para apresentar o projeto.",
    slot: "neck",
    priceGems: 80,
    rarity: "common",
    previewColor: "#1C1F4A",
  },
  {
    key: "neck-medal",
    name: "Medalha de ouro",
    description: "Símbolo de consistência e streak.",
    slot: "neck",
    priceGems: 240,
    rarity: "legendary",
    previewColor: "#eab308",
  },
  {
    key: "cape-green",
    name: "Capa verde",
    description: "O herói das trilhas Aprenda Aqui.",
    slot: "cape",
    priceGems: 180,
    rarity: "epic",
    previewColor: "#58CC02",
  },
  {
    key: "cape-hero",
    name: "Capa heroica",
    description: "Voa de lição em lição.",
    slot: "cape",
    priceGems: 260,
    rarity: "legendary",
    previewColor: "#dc2626",
  },
  {
    key: "backpack-school",
    name: "Mochila escolar",
    description: "Leva caderno, sonhos e gemas.",
    slot: "backpack",
    priceGems: 110,
    rarity: "common",
    previewColor: "#3b82f6",
  },
  {
    key: "backpack-rocket",
    name: "Mochila foguete",
    description: "XP em velocidade de lançamento.",
    slot: "backpack",
    priceGems: 300,
    rarity: "legendary",
    previewColor: "#f97316",
  },
  {
    key: "hands-laptop",
    name: "Notebook",
    description: "Sempre pronto para a próxima kata.",
    slot: "hands",
    priceGems: 140,
    rarity: "rare",
    previewColor: "#64748b",
  },
  {
    key: "hands-wand",
    name: "Varinha",
    description: "Transforma bugs em features.",
    slot: "hands",
    priceGems: 190,
    rarity: "epic",
    previewColor: "#a855f7",
  },
  {
    key: "pet-cat",
    name: "Gato código",
    description: "Ronrona a cada teste passando.",
    slot: "pet",
    priceGems: 320,
    rarity: "legendary",
    previewColor: "#fb923c",
  },
  {
    key: "pet-bug",
    name: "Bugzinho",
    description: "Desta vez ele está do seu lado.",
    slot: "pet",
    priceGems: 280,
    rarity: "epic",
    previewColor: "#22c55e",
  },
  {
    key: "pet-robot",
    name: "Robô amigo",
    description: "Companheiro de pair programming.",
    slot: "pet",
    priceGems: 350,
    rarity: "legendary",
    previewColor: "#94a3b8",
  },
  {
    key: "palette-neon",
    name: "Paleta neon",
    description: "Desbloqueia cores de cabelo lima, ciano, magenta e violeta.",
    slot: "palette",
    priceGems: 150,
    rarity: "rare",
    previewColor: "#e879f9",
  },
  {
    key: "palette-pastel",
    name: "Paleta pastel",
    description: "Desbloqueia cores de cabelo rosa, menta, céu e lavanda.",
    slot: "palette",
    priceGems: 150,
    rarity: "rare",
    previewColor: "#f9a8d4",
  },
];

const ITEMS_BY_KEY = new Map(AVATAR_ITEMS.map((item) => [item.key, item]));

export function getAvatarItem(key: string): AvatarItem | undefined {
  return ITEMS_BY_KEY.get(key);
}

export function getItemsBySlot(slot: AvatarSlot): AvatarItem[] {
  return AVATAR_ITEMS.filter((item) => item.slot === slot);
}

export function getFreeAvatarItemKeys(): string[] {
  return AVATAR_ITEMS.filter((item) => item.free || item.priceGems === 0).map((item) => item.key);
}

export function isHairColorUnlocked(hex: string, ownedKeys: Set<string>): boolean {
  if (FREE_HAIR_COLORS.some((color) => color.hex === hex)) return true;
  if (ownedKeys.has("palette-neon") && NEON_HAIR_COLORS.some((color) => color.hex === hex)) {
    return true;
  }
  if (ownedKeys.has("palette-pastel") && PASTEL_HAIR_COLORS.some((color) => color.hex === hex)) {
    return true;
  }
  return false;
}

export function isSkinToneAllowed(hex: string): boolean {
  return SKIN_TONES.some((tone) => tone.hex === hex);
}

export function isShirtColorAllowed(hex: string): boolean {
  return SHIRT_COLORS.some((color) => color.hex === hex);
}

export function isPantsColorAllowed(hex: string): boolean {
  return PANTS_COLORS.some((color) => color.hex === hex);
}

export function rarityLabel(rarity: AvatarRarity): string {
  switch (rarity) {
    case "common":
      return "Comum";
    case "rare":
      return "Raro";
    case "epic":
      return "Épico";
    case "legendary":
      return "Lendário";
    default: {
      const _exhaustive: never = rarity;
      return _exhaustive;
    }
  }
}
