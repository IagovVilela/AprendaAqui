export type TeamRoleKey = "OWNER" | "ADMIN" | "MEMBER";

export const MAX_TEAM_MEMBERS = 25;
export const MIN_TEAM_MEMBERS_TO_CREATE_WAR = 3;
export const MIN_WAR_PARTICIPANTS = 5;
export const WAR_PREPARATION_HOURS = 24;

export type TeamPermission =
  | "team.edit"
  | "team.dissolve"
  | "team.transferOwnership"
  | "members.approve"
  | "members.kick"
  | "members.promote"
  | "battle.startInternal"
  | "war.declare"
  | "war.cancel";

const OWNER_ONLY: TeamPermission[] = [
  "team.dissolve",
  "team.transferOwnership",
  "members.promote",
];

const ADMIN_PERMISSIONS: TeamPermission[] = [
  "team.edit",
  "members.approve",
  "members.kick",
  "battle.startInternal",
  "war.declare",
  "war.cancel",
];

export function permissionsForRole(role: TeamRoleKey): TeamPermission[] {
  switch (role) {
    case "OWNER":
      return [...ADMIN_PERMISSIONS, ...OWNER_ONLY];
    case "ADMIN":
      return [...ADMIN_PERMISSIONS];
    case "MEMBER":
      return [];
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

export function can(role: TeamRoleKey, permission: TeamPermission): boolean {
  return permissionsForRole(role).includes(permission);
}

export function roleLabel(role: TeamRoleKey): string {
  switch (role) {
    case "OWNER":
      return "Dono";
    case "ADMIN":
      return "Administrador";
    case "MEMBER":
      return "Membro";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

/** Um dono nunca pode ser expulso e ninguém pode agir sobre alguém de papel igual ou superior. */
export function canActOnMember(actorRole: TeamRoleKey, targetRole: TeamRoleKey): boolean {
  if (targetRole === "OWNER") return false;
  if (actorRole === "OWNER") return true;
  if (actorRole === "ADMIN") return targetRole === "MEMBER";
  return false;
}

export function slugifyTeamName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateInviteCode(length = 8): string {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += INVITE_ALPHABET[Math.floor(Math.random() * INVITE_ALPHABET.length)];
  }
  return code;
}
