export type QuizDifficultyKey = "EASY" | "MEDIUM" | "HARD";

/** Piso do enunciado: quem acerta leva no mínimo metade da base, mesmo respondendo no limite. */
export const MIN_SCORE_RATIO = 0.5;

export function basePointsFor(difficulty: QuizDifficultyKey): number {
  switch (difficulty) {
    case "EASY":
      return 600;
    case "MEDIUM":
      return 800;
    case "HARD":
      return 1000;
    default: {
      const _exhaustive: never = difficulty;
      return _exhaustive;
    }
  }
}

export type ScoreInput = {
  correct: boolean;
  responseMs: number;
  timeLimitSec: number;
  difficulty: QuizDifficultyKey;
};

/**
 * Pontos = base x (0.5 + 0.5 x tempoRestante/tempoLimite).
 * Erro vale 0. Resposta fora da janela vale 0 (validada antes, no servidor).
 */
export function computePoints({
  correct,
  responseMs,
  timeLimitSec,
  difficulty,
}: ScoreInput): number {
  if (!correct) return 0;

  const limitMs = Math.max(1, timeLimitSec * 1000);
  const clamped = Math.min(Math.max(responseMs, 0), limitMs);
  const speedRatio = 1 - clamped / limitMs;
  const base = basePointsFor(difficulty);

  return Math.round(base * (MIN_SCORE_RATIO + (1 - MIN_SCORE_RATIO) * speedRatio));
}

export type TeamAggregateInput = {
  scores: number[];
  minParticipants: number;
};

export type TeamAggregate = {
  average: number;
  participants: number;
  eligible: boolean;
};

/**
 * Placar da equipe é a MÉDIA de quem respondeu, não a soma.
 * Soma premiaria equipe grande; média sem piso premiaria equipe que manda só o melhor aluno.
 */
export function aggregateTeamScore({
  scores,
  minParticipants,
}: TeamAggregateInput): TeamAggregate {
  const participants = scores.length;
  if (participants === 0) {
    return { average: 0, participants: 0, eligible: false };
  }

  const total = scores.reduce((sum, value) => sum + value, 0);

  return {
    average: Math.round(total / participants),
    participants,
    eligible: participants >= minParticipants,
  };
}

/** Permutação determinística por (participante, pergunta): o embaralhamento é reproduzível no servidor. */
export function shuffleIndexes(length: number, seed: number): number[] {
  const indexes = Array.from({ length }, (_, i) => i);
  let state = seed >>> 0 || 1;

  for (let i = length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    const tmp = indexes[i];
    indexes[i] = indexes[j];
    indexes[j] = tmp;
  }

  return indexes;
}

export function seedFor(optionSeed: number, questionId: string): number {
  let hash = optionSeed >>> 0;
  for (let i = 0; i < questionId.length; i += 1) {
    hash = (hash * 31 + questionId.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

/** Converte o índice que o participante viu na tela para o índice real da pergunta. */
export function displayIndexToRealIndex(
  displayIndex: number,
  optionCount: number,
  seed: number
): number | null {
  if (displayIndex < 0 || displayIndex >= optionCount) return null;
  return shuffleIndexes(optionCount, seed)[displayIndex] ?? null;
}

export function applyShuffle<T>(options: T[], seed: number): T[] {
  return shuffleIndexes(options.length, seed).map((realIndex) => options[realIndex]);
}
