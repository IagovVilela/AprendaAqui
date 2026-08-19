import { MIN_WAR_PARTICIPANTS, WAR_PREPARATION_HOURS } from "@/lib/team-roles";

export type WarStatusKey = "PREPARATION" | "BATTLE" | "FINISHED" | "CANCELLED";

export function warStatusLabel(status: WarStatusKey): string {
  switch (status) {
    case "PREPARATION":
      return "Preparação";
    case "BATTLE":
      return "Batalha";
    case "FINISHED":
      return "Encerrada";
    case "CANCELLED":
      return "Cancelada";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function prepEndsAtFrom(start: Date, hours = WAR_PREPARATION_HOURS): Date {
  return new Date(start.getTime() + hours * 60 * 60 * 1000);
}

export function isPreparationOpen(prepEndsAt: Date, now = new Date()): boolean {
  return now.getTime() < prepEndsAt.getTime();
}

export type WarReadiness = {
  challengerConfirmed: number;
  opponentConfirmed: number;
  minParticipants: number;
  ready: boolean;
  blockedReason: string | null;
};

/** Uma guerra só sai da preparação quando as DUAS equipes atingem o mínimo. */
export function evaluateWarReadiness(
  challengerConfirmed: number,
  opponentConfirmed: number,
  minParticipants = MIN_WAR_PARTICIPANTS
): WarReadiness {
  const challengerOk = challengerConfirmed >= minParticipants;
  const opponentOk = opponentConfirmed >= minParticipants;

  let blockedReason: string | null = null;
  if (!challengerOk && !opponentOk) {
    blockedReason = `As duas equipes precisam de ${minParticipants} participantes confirmados.`;
  } else if (!challengerOk) {
    blockedReason = `A equipe desafiante precisa de ${minParticipants} participantes confirmados.`;
  } else if (!opponentOk) {
    blockedReason = `A equipe desafiada precisa de ${minParticipants} participantes confirmados.`;
  }

  return {
    challengerConfirmed,
    opponentConfirmed,
    minParticipants,
    ready: challengerOk && opponentOk,
    blockedReason,
  };
}

export type WarOutcome = {
  winnerTeamId: string | null;
  challengerScore: number;
  opponentScore: number;
  draw: boolean;
};

export function resolveWar(
  challengerTeamId: string,
  challengerScore: number,
  opponentTeamId: string,
  opponentScore: number
): WarOutcome {
  if (challengerScore === opponentScore) {
    return { winnerTeamId: null, challengerScore, opponentScore, draw: true };
  }

  return {
    winnerTeamId: challengerScore > opponentScore ? challengerTeamId : opponentTeamId,
    challengerScore,
    opponentScore,
    draw: false,
  };
}

export const WAR_POINTS_WIN = 30;
export const WAR_POINTS_DRAW = 10;
export const WAR_POINTS_LOSS = 5;

export function warPointsFor(result: "WIN" | "DRAW" | "LOSS"): number {
  switch (result) {
    case "WIN":
      return WAR_POINTS_WIN;
    case "DRAW":
      return WAR_POINTS_DRAW;
    case "LOSS":
      return WAR_POINTS_LOSS;
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
