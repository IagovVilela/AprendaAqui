import { prisma } from "database";
import {
  DEFAULT_BLOCKED_TERMS,
  checkDisplayName,
  checkTeamName,
  type BlockedTerm,
  type ModerationVerdict,
} from "@/lib/content-moderation";

export type ModerationField = "USER_NAME" | "TEAM_NAME" | "TEAM_DESCRIPTION";

let cachedTerms: { terms: BlockedTerm[]; loadedAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

/**
 * Blocklist = termos padrão do código + termos que o professor cadastrou.
 * Cache curto para não bater no banco a cada tecla digitada no cadastro.
 */
export async function loadTerms(force = false): Promise<BlockedTerm[]> {
  if (!force && cachedTerms && Date.now() - cachedTerms.loadedAt < CACHE_TTL_MS) {
    return cachedTerms.terms;
  }

  const custom = await prisma.moderationTerm.findMany({
    where: { active: true },
    select: { term: true, severity: true, category: true, matchMode: true },
  });

  const terms: BlockedTerm[] = [
    ...DEFAULT_BLOCKED_TERMS,
    ...custom.map((entry) => ({
      term: entry.term,
      severity: entry.severity,
      category: entry.category,
      match: entry.matchMode === "TOKEN" ? ("token" as const) : ("contains" as const),
    })),
  ];

  cachedTerms = { terms, loadedAt: Date.now() };
  return terms;
}

export function invalidateTermsCache(): void {
  cachedTerms = null;
}

export type ModerateInput = {
  value: string;
  field: ModerationField;
  subjectUserId?: string | null;
  teamId?: string | null;
  /** false na validação em tempo real, para não encher a fila enquanto a pessoa digita. */
  log?: boolean;
};

export async function moderateName({
  value,
  field,
  subjectUserId = null,
  teamId = null,
  log = true,
}: ModerateInput): Promise<ModerationVerdict> {
  const terms = await loadTerms();
  const verdict =
    field === "USER_NAME" ? checkDisplayName(value, { terms }) : checkTeamName(value, terms);

  if (log && verdict.flagged) {
    await prisma.moderationEvent.create({
      data: {
        kind: verdict.allowed ? "NAME_FLAGGED" : "NAME_BLOCKED",
        field,
        subjectUserId,
        teamId,
        attemptedValue: value.slice(0, 280),
        matchedTerm: verdict.matchedTerm?.slice(0, 64) ?? null,
        severity: verdict.severity,
        category: verdict.category,
        // Bloqueio já resolveu o problema sozinho: nada entrou no sistema.
        resolved: !verdict.allowed,
      },
    });
  }

  return verdict;
}

export function moderationErrorResponse(verdict: ModerationVerdict) {
  return {
    error: verdict.reason ?? "Escolha outro nome.",
    moderation: { category: verdict.category, severity: verdict.severity },
  };
}
