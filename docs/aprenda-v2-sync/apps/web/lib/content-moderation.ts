export type ModerationSeverity = "BLOCK" | "REVIEW";

export type ModerationCategory =
  | "PROFANITY"
  | "SLUR"
  | "SEXUAL"
  | "IMPERSONATION"
  | "SPAM";

/**
 * `token`   — só casa com a palavra inteira. Usado em termos curtos ou que são
 *             sobrenome/palavra comum (ex.: Pinto, Prego), para não gerar falso positivo.
 * `contains` — casa mesmo colado a outras letras. Usado em termos longos, que
 *             dificilmente aparecem dentro de uma palavra legítima.
 */
export type MatchMode = "token" | "contains";

export type BlockedTerm = {
  term: string;
  severity: ModerationSeverity;
  category: ModerationCategory;
  match: MatchMode;
};

/**
 * Palavras legítimas que contêm um termo bloqueado. Verificadas antes do filtro
 * para não barrar nome de gente de verdade nem palavra comum.
 */
export const ALLOWLIST = [
  "assessor",
  "assessora",
  "assessoria",
  "assumpcao",
  "assuncao",
  "bicicleta",
  "buda",
  "cuidado",
  "cuidar",
  "conceicao",
  "escuta",
  "escutar",
  "cutia",
  "cutiara",
  "curitiba",
  "cuiaba",
  "cunha",
  "cunhado",
  "curso",
  "documento",
  "focado",
  "foca",
  "matheus",
  "pipoca",
  "recuperacao",
  "sacola",
  "vacupar",
];

/**
 * Blocklist inicial. O professor pode adicionar/remover termos pelo painel de
 * moderação sem precisar de deploy — estes aqui são apenas o padrão de fábrica.
 */
export const DEFAULT_BLOCKED_TERMS: BlockedTerm[] = [
  { term: "caralho", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "porra", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "merda", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "bosta", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "buceta", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "boceta", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "xoxota", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "piroca", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "rola", severity: "REVIEW", category: "SEXUAL", match: "token" },
  { term: "pinto", severity: "REVIEW", category: "SEXUAL", match: "token" },
  { term: "pau", severity: "REVIEW", category: "SEXUAL", match: "token" },
  { term: "cu", severity: "BLOCK", category: "PROFANITY", match: "token" },
  { term: "cuzao", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "arrombado", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "puta", severity: "BLOCK", category: "PROFANITY", match: "token" },
  { term: "putinha", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "puto", severity: "REVIEW", category: "PROFANITY", match: "token" },
  { term: "vadia", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "vagabunda", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "filhadaputa", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "filhodaputa", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "fdp", severity: "BLOCK", category: "PROFANITY", match: "token" },
  { term: "pqp", severity: "BLOCK", category: "PROFANITY", match: "token" },
  { term: "krl", severity: "BLOCK", category: "PROFANITY", match: "token" },
  { term: "viado", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "veado", severity: "REVIEW", category: "SLUR", match: "token" },
  { term: "bicha", severity: "BLOCK", category: "SLUR", match: "token" },
  { term: "traveco", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "sapatao", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "retardado", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "mongoloide", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "macaco", severity: "REVIEW", category: "SLUR", match: "token" },
  { term: "crioulo", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "preto imundo", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "nazista", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "hitler", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "estupro", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "pedofilo", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "pornhub", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "sexo", severity: "REVIEW", category: "SEXUAL", match: "token" },
  { term: "nudes", severity: "BLOCK", category: "SEXUAL", match: "contains" },
  { term: "fuck", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "shit", severity: "REVIEW", category: "PROFANITY", match: "token" },
  { term: "bitch", severity: "BLOCK", category: "PROFANITY", match: "contains" },
  { term: "nigga", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "faggot", severity: "BLOCK", category: "SLUR", match: "contains" },
  { term: "admin", severity: "BLOCK", category: "IMPERSONATION", match: "token" },
  { term: "administrador", severity: "BLOCK", category: "IMPERSONATION", match: "contains" },
  { term: "moderador", severity: "BLOCK", category: "IMPERSONATION", match: "contains" },
  { term: "suporte oficial", severity: "BLOCK", category: "IMPERSONATION", match: "contains" },
  { term: "aprendaaqui", severity: "REVIEW", category: "IMPERSONATION", match: "contains" },
  { term: "equipe oficial", severity: "BLOCK", category: "IMPERSONATION", match: "contains" },
];

const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "6": "g",
  "7": "t",
  "8": "b",
  "9": "g",
  "@": "a",
  $: "s",
  "!": "i",
  "|": "i",
  "+": "t",
  "(": "c",
  "€": "e",
};

/**
 * Normaliza para comparar: tira acento, converte leetspeak, colapsa letras
 * repetidas ("caraaaalho") e reduz separadores. Sem isso o filtro cai em
 * qualquer variação boba.
 */
export function normalizeForModeration(input: string): string {
  const withoutAccents = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  let mapped = "";
  for (const char of withoutAccents) {
    mapped += LEET_MAP[char] ?? char;
  }

  return mapped
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Versão sem espaços: pega tentativas como "f i l h o d a p u t a". */
export function collapseSpaces(normalized: string): string {
  return normalized.replace(/\s+/g, "");
}

/** Colapsa letras repetidas: "caraaaalho" e "caralho" viram a mesma coisa. */
export function squeezeRepeats(value: string): string {
  return value.replace(/(.)\1+/g, "$1");
}

export type ModerationVerdict = {
  /** false apenas em BLOCK. REVIEW passa e vai para a fila do professor. */
  allowed: boolean;
  /** true quando algo suspeito foi encontrado, tenha sido bloqueado ou não. */
  flagged: boolean;
  severity: ModerationSeverity | null;
  category: ModerationCategory | null;
  matchedTerm: string | null;
  reason: string | null;
};

const ALLOWED_VERDICT: ModerationVerdict = {
  allowed: true,
  flagged: false,
  severity: null,
  category: null,
  matchedTerm: null,
  reason: null,
};

function reasonFor(category: ModerationCategory): string {
  switch (category) {
    case "PROFANITY":
      return "Esse nome tem palavrão. Escolha outro.";
    case "SLUR":
      return "Esse nome tem termo ofensivo contra pessoas ou grupos. Escolha outro.";
    case "SEXUAL":
      return "Esse nome tem conteúdo sexual. Escolha outro.";
    case "IMPERSONATION":
      return "Esse nome se passa pela equipe do Aprenda Aqui. Escolha outro.";
    case "SPAM":
      return "Esse nome parece divulgação ou spam. Escolha outro.";
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

function isAllowlisted(token: string): boolean {
  return ALLOWLIST.includes(token);
}

export type CheckOptions = {
  terms?: BlockedTerm[];
  minLength?: number;
  maxLength?: number;
};

export function checkDisplayName(
  rawName: string,
  { terms = DEFAULT_BLOCKED_TERMS, minLength = 2, maxLength = 40 }: CheckOptions = {}
): ModerationVerdict {
  const trimmed = rawName.trim();

  function reject(reason: string): ModerationVerdict {
    return {
      allowed: false,
      flagged: true,
      severity: "BLOCK",
      category: "SPAM",
      matchedTerm: null,
      reason,
    };
  }

  if (trimmed.length < minLength) {
    return reject(`O nome precisa de pelo menos ${minLength} caracteres.`);
  }

  if (trimmed.length > maxLength) {
    return reject(`O nome pode ter no máximo ${maxLength} caracteres.`);
  }

  if (!/[a-zA-Z\u00C0-\u024F]/.test(trimmed)) {
    return reject("O nome precisa ter letras.");
  }

  if (/(https?:\/\/|www\.|\.com|\.br\b|@[a-z0-9]+)/i.test(trimmed)) {
    return reject("Não use links ou endereços no nome.");
  }

  const normalized = normalizeForModeration(trimmed);
  const collapsed = collapseSpaces(normalized);
  const tokens = normalized.split(" ").filter((token) => token.length > 0);

  // "c u", "f i l h o d a p u t a": quando quase tudo são letras soltas, o nome
  // sem espaços também é tratado como uma palavra só.
  const isSpacedOut = tokens.length >= 2 && tokens.every((token) => token.length <= 2);
  const candidateTokens = isSpacedOut ? [...tokens, collapsed] : tokens;

  let review: ModerationVerdict | null = null;

  for (const entry of terms) {
    const collapsedTerm = collapseSpaces(normalizeForModeration(entry.term));
    if (collapsedTerm.length === 0) continue;

    const squeezedTerm = squeezeRepeats(collapsedTerm);

    const matchesToken = (token: string) => {
      if (isAllowlisted(token)) return false;
      if (entry.match === "token") {
        return token === collapsedTerm || squeezeRepeats(token) === squeezedTerm;
      }
      return token.includes(collapsedTerm) || squeezeRepeats(token).includes(squeezedTerm);
    };

    let hit = candidateTokens.some(matchesToken);

    // Termos longos também são procurados no nome inteiro sem espaços; em termos
    // curtos isso juntaria duas palavras inocentes e acusaria errado.
    if (!hit && entry.match === "contains" && collapsedTerm.length >= 5) {
      hit =
        collapsed.includes(collapsedTerm) || squeezeRepeats(collapsed).includes(squeezedTerm);
    }

    if (!hit) continue;

    const verdict: ModerationVerdict = {
      allowed: entry.severity !== "BLOCK",
      flagged: true,
      severity: entry.severity,
      category: entry.category,
      matchedTerm: entry.term,
      reason: reasonFor(entry.category),
    };

    if (entry.severity === "BLOCK") {
      return verdict;
    }

    review = review ?? verdict;
  }

  return review ?? ALLOWED_VERDICT;
}

/** Nome de equipe usa o mesmo filtro, com limites próprios. */
export function checkTeamName(rawName: string, terms?: BlockedTerm[]): ModerationVerdict {
  return checkDisplayName(rawName, { terms, minLength: 3, maxLength: 32 });
}

export function checkFreeText(
  rawText: string,
  terms: BlockedTerm[] = DEFAULT_BLOCKED_TERMS
): ModerationVerdict {
  if (rawText.trim().length === 0) return ALLOWED_VERDICT;
  return checkDisplayName(rawText, { terms, minLength: 1, maxLength: 280 });
}
