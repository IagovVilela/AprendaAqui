"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Loader2, Shield, Swords, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamEmblem } from "@/components/teams/team-emblem";
import { roleLabel, type TeamPermission, type TeamRoleKey } from "@/lib/team-roles";
import { warStatusLabel, type WarStatusKey } from "@/lib/war-phases";

type TeamSummary = {
  id: string;
  name: string;
  description: string | null;
  emblemSeed: string;
  emblemColor: string;
  joinPolicy: "INVITE_ONLY" | "REQUEST";
  memberCount: number;
  maxMembers: number;
  warPoints: number;
  warsWon: number;
  warsLost: number;
};

type MyTeam = {
  id: string;
  name: string;
  description: string | null;
  emblemSeed: string;
  emblemColor: string;
  maxMembers: number;
  warPoints: number;
  warsWon: number;
  warsLost: number;
  inviteCode: string | null;
  members: {
    id: string;
    role: TeamRoleKey;
    seasonPoints: number;
    user: { id: string; name: string };
  }[];
};

type WarSummary = {
  id: string;
  status: WarStatusKey;
  minParticipants: number;
  challengerScore: number | null;
  opponentScore: number | null;
  challengerTeam: { id: string; name: string; emblemColor: string; emblemSeed: string };
  opponentTeam: { id: string; name: string; emblemColor: string; emblemSeed: string };
};

type MeResponse = {
  team: MyTeam | null;
  viewer?: { userId: string; role: TeamRoleKey; permissions: TeamPermission[] };
  pendingRequests?: { id: string; user: { id: string; name: string } }[];
  wars?: WarSummary[];
};

export function TeamsPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse>({ team: null });
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const permissions = useMemo(
    () => new Set(me.viewer?.permissions ?? []),
    [me.viewer?.permissions]
  );

  const load = useCallback(async () => {
    const [meRes, listRes] = await Promise.all([fetch("/api/teams/me"), fetch("/api/teams")]);
    const meData = (await meRes.json()) as MeResponse;
    const listData = (await listRes.json()) as { teams: TeamSummary[] };
    setMe(meRes.ok ? meData : { team: null });
    setTeams(listData.teams ?? []);
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  async function post(url: string, body?: unknown, method: "POST" | "PATCH" | "DELETE" = "POST") {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Não foi possível concluir a ação");
        return null;
      }
      await load();
      return data;
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-navy/50">
        <Loader2 className="h-5 w-5 animate-spin" />
        Carregando equipes...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="inline-flex items-center gap-2 text-sm font-bold text-primary">
          <Swords className="h-4 w-4" />
          Equipes
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-navy">
          {me.team ? me.team.name : "Entre em uma equipe"}
        </h1>
        <p className="mt-1 text-navy/60">
          Dispute desafios internos e guerras contra outras equipes usando o que você já estudou.
        </p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {me.team ? (
        <MyTeamView
          team={me.team}
          viewerId={me.viewer?.userId ?? ""}
          role={me.viewer?.role ?? "MEMBER"}
          permissions={permissions}
          pendingRequests={me.pendingRequests ?? []}
          wars={me.wars ?? []}
          busy={busy}
          onAction={post}
          onOpenRoom={(code) => router.push(`/quiz/${code}`)}
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          <form
            className="card-elevation rounded-3xl border border-navy/5 bg-white p-6"
            onSubmit={async (event) => {
              event.preventDefault();
              await post("/api/teams", { name: newName });
              setNewName("");
            }}
          >
            <h2 className="text-lg font-extrabold text-navy">Criar equipe</h2>
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Nome da equipe"
              className="mt-3 w-full rounded-xl border border-navy/10 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" className="mt-4 w-full" disabled={busy || newName.length < 3}>
              Criar
            </Button>
          </form>

          <form
            className="card-elevation rounded-3xl border border-navy/5 bg-white p-6"
            onSubmit={async (event) => {
              event.preventDefault();
              await post("/api/teams/join", { code: joinCode });
              setJoinCode("");
            }}
          >
            <h2 className="text-lg font-extrabold text-navy">Entrar com código</h2>
            <input
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              placeholder="Ex.: K7MPQR2X"
              className="mt-3 w-full rounded-xl border border-navy/10 px-4 py-3 font-mono tracking-widest outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" className="mt-4 w-full" disabled={busy || joinCode.length < 4}>
              Entrar
            </Button>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-lg font-extrabold text-navy">Ranking de equipes</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {teams.map((team, index) => (
            <article
              key={team.id}
              className="card-elevation flex items-center gap-4 rounded-3xl border border-navy/5 bg-white p-4"
            >
              <span className="w-6 text-center font-extrabold text-navy/40">{index + 1}</span>
              <TeamEmblem seed={team.emblemSeed} color={team.emblemColor} size={44} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-extrabold text-navy">{team.name}</h3>
                <p className="text-sm text-navy/60">
                  {team.memberCount}/{team.maxMembers} membros · {team.warPoints} pts ·{" "}
                  {team.warsWon}V {team.warsLost}D
                </p>
              </div>
              {!me.team ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={busy || team.joinPolicy === "INVITE_ONLY"}
                  onClick={() => post("/api/teams/join", { teamId: team.id })}
                >
                  {team.joinPolicy === "INVITE_ONLY" ? "Só convite" : "Pedir entrada"}
                </Button>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

type MyTeamViewProps = {
  team: MyTeam;
  viewerId: string;
  role: TeamRoleKey;
  permissions: Set<TeamPermission>;
  pendingRequests: { id: string; user: { id: string; name: string } }[];
  wars: WarSummary[];
  busy: boolean;
  onAction: (
    url: string,
    body?: unknown,
    method?: "POST" | "PATCH" | "DELETE"
  ) => Promise<Record<string, unknown> | null>;
  onOpenRoom: (code: string) => void;
};

function MyTeamView({
  team,
  viewerId,
  role,
  permissions,
  pendingRequests,
  wars,
  busy,
  onAction,
  onOpenRoom,
}: MyTeamViewProps) {
  return (
    <div className="space-y-5">
      <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
        <div className="flex flex-wrap items-center gap-4">
          <TeamEmblem seed={team.emblemSeed} color={team.emblemColor} size={64} />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold text-navy">{team.name}</h2>
            <p className="text-sm text-navy/60">
              {team.members.length}/{team.maxMembers} membros · {team.warPoints} pontos de guerra ·{" "}
              {team.warsWon}V {team.warsLost}D · você é {roleLabel(role)}
            </p>
          </div>
          {team.inviteCode ? (
            <span className="rounded-full bg-navy/5 px-4 py-2 font-mono font-bold tracking-widest text-navy">
              {team.inviteCode}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {permissions.has("battle.startInternal") ? (
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={async () => {
                const data = await onAction("/api/quiz/sessions", { trackId: null });
                const session = data?.session as { code?: string } | undefined;
                if (session?.code) onOpenRoom(session.code);
              }}
            >
              <Swords className="h-4 w-4" />
              Desafio interno
            </Button>
          ) : null}
          {permissions.has("team.edit") ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => onAction("/api/teams/invites")}
            >
              Gerar novo código
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => onAction("/api/teams/leave")}
          >
            Sair da equipe
          </Button>
        </div>
      </section>

      {pendingRequests.length > 0 ? (
        <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
          <h3 className="text-lg font-extrabold text-navy">Solicitações pendentes</h3>
          <ul className="mt-3 space-y-2">
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between rounded-2xl border border-navy/10 px-4 py-3"
              >
                <span className="font-bold text-navy">{request.user.name}</span>
                <span className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={busy}
                    onClick={() =>
                      onAction("/api/teams/requests", {
                        requestId: request.id,
                        decision: "ACCEPT",
                      })
                    }
                  >
                    Aceitar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() =>
                      onAction("/api/teams/requests", {
                        requestId: request.id,
                        decision: "REJECT",
                      })
                    }
                  >
                    Recusar
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-navy">
          <Users className="h-5 w-5" />
          Ranking interno
        </h3>
        <ol className="mt-3 space-y-2">
          {team.members.map((member, index) => (
            <li
              key={member.id}
              className="flex items-center justify-between rounded-2xl border border-navy/10 px-4 py-3"
            >
              <span className="flex items-center gap-3 font-bold text-navy">
                <span className="w-6 text-navy/40">{index + 1}</span>
                {member.user.name}
                {member.role === "OWNER" ? <Crown className="h-4 w-4 text-amber-500" /> : null}
                {member.role === "ADMIN" ? <Shield className="h-4 w-4 text-blue-500" /> : null}
              </span>
              <span className="flex items-center gap-3">
                <span className="font-extrabold text-primary">{member.seasonPoints}</span>
                {permissions.has("members.promote") && member.user.id !== viewerId ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() =>
                      onAction(
                        "/api/teams/members",
                        {
                          userId: member.user.id,
                          role: member.role === "ADMIN" ? "MEMBER" : "ADMIN",
                        },
                        "PATCH"
                      )
                    }
                  >
                    {member.role === "ADMIN" ? "Rebaixar" : "Promover"}
                  </Button>
                ) : null}
                {permissions.has("members.kick") &&
                member.user.id !== viewerId &&
                member.role !== "OWNER" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() =>
                      onAction("/api/teams/members", { userId: member.user.id }, "DELETE")
                    }
                  >
                    Expulsar
                  </Button>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {wars.length > 0 ? (
        <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
          <h3 className="text-lg font-extrabold text-navy">Guerras</h3>
          <ul className="mt-3 space-y-2">
            {wars.map((war) => (
              <li
                key={war.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 px-4 py-3"
              >
                <span className="font-bold text-navy">
                  {war.challengerTeam.name} vs {war.opponentTeam.name}
                </span>
                <span className="text-sm font-bold text-navy/60">
                  {warStatusLabel(war.status)}
                  {war.challengerScore !== null && war.opponentScore !== null
                    ? ` · ${war.challengerScore} x ${war.opponentScore}`
                    : ""}
                </span>
                {war.status === "PREPARATION" ? (
                  <span className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy}
                      onClick={() => onAction(`/api/wars/${war.id}`, { action: "CONFIRM" })}
                    >
                      Confirmar presença
                    </Button>
                    {permissions.has("war.declare") ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={busy}
                        onClick={async () => {
                          const data = await onAction(`/api/wars/${war.id}`, { action: "START" });
                          const code = data?.code;
                          if (typeof code === "string") onOpenRoom(code);
                        }}
                      >
                        Iniciar batalha
                      </Button>
                    ) : null}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
