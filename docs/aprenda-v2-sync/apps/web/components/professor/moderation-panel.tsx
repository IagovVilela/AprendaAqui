"use client";

import { useCallback, useEffect, useState } from "react";
import { Flag, Loader2, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Severity = "BLOCK" | "REVIEW";
type Category = "PROFANITY" | "SLUR" | "SEXUAL" | "IMPERSONATION" | "SPAM";
type EventKind = "NAME_BLOCKED" | "NAME_FLAGGED" | "FORCED_RENAME" | "USER_REPORT";

type ModerationEvent = {
  id: string;
  kind: EventKind;
  field: "USER_NAME" | "TEAM_NAME" | "TEAM_DESCRIPTION";
  attemptedValue: string;
  matchedTerm: string | null;
  severity: Severity | null;
  category: Category | null;
  note: string | null;
  createdAt: string;
  subjectUser: { id: string; name: string; email: string } | null;
  reporter: { id: string; name: string } | null;
};

type ModerationTerm = {
  id: string;
  term: string;
  severity: Severity;
  category: Category;
  matchMode: "TOKEN" | "CONTAINS";
  active: boolean;
};

function kindLabel(kind: EventKind): string {
  switch (kind) {
    case "NAME_BLOCKED":
      return "Bloqueado no cadastro";
    case "NAME_FLAGGED":
      return "Passou, mas suspeito";
    case "FORCED_RENAME":
      return "Renomeado pelo professor";
    case "USER_REPORT":
      return "Denúncia de aluno";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function categoryLabel(category: Category | null): string {
  switch (category) {
    case "PROFANITY":
      return "Palavrão";
    case "SLUR":
      return "Ofensa a grupo";
    case "SEXUAL":
      return "Sexual";
    case "IMPERSONATION":
      return "Falsa identidade";
    case "SPAM":
      return "Spam";
    case null:
      return "—";
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

export function ModerationPanel() {
  const [events, setEvents] = useState<ModerationEvent[]>([]);
  const [terms, setTerms] = useState<ModerationTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [severity, setSeverity] = useState<Severity>("BLOCK");

  const load = useCallback(async () => {
    const [eventsRes, termsRes] = await Promise.all([
      fetch("/api/moderation/events"),
      fetch("/api/moderation/terms"),
    ]);

    if (eventsRes.ok) {
      const data = (await eventsRes.json()) as { events: ModerationEvent[] };
      setEvents(data.events);
    }
    if (termsRes.ok) {
      const data = (await termsRes.json()) as { terms: ModerationTerm[] };
      setTerms(data.terms);
    }
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  async function send(url: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Não foi possível concluir a ação");
        return false;
      }
      await load();
      return true;
    } finally {
      setBusy(false);
    }
  }

  async function forceRename(event: ModerationEvent) {
    if (!event.subjectUser) return;
    const suggested = `Aluno ${event.subjectUser.id.slice(-4).toUpperCase()}`;
    const newName = window.prompt(
      `Novo nome para ${event.subjectUser.name}:`,
      suggested
    );
    if (!newName) return;
    await send("/api/moderation/rename", "POST", {
      userId: event.subjectUser.id,
      newName,
    });
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-navy/50">
        <Loader2 className="h-5 w-5 animate-spin" />
        Carregando moderação...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="inline-flex items-center gap-2 text-sm font-bold text-primary">
          <ShieldAlert className="h-4 w-4" />
          Moderação
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-navy">Nomes e denúncias</h1>
        <p className="mt-1 text-navy/60">
          Nomes com palavrão já são barrados no cadastro. Aqui ficam os casos duvidosos e as
          denúncias.
        </p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
        <h2 className="text-lg font-extrabold text-navy">Fila de revisão</h2>
        {events.length === 0 ? (
          <p className="mt-3 text-navy/50">Nada pendente.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {events.map((event) => (
              <li key={event.id} className="rounded-2xl border border-navy/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-extrabold text-navy break-words">
                      &ldquo;{event.attemptedValue}&rdquo;
                    </p>
                    <p className="mt-1 text-sm text-navy/60">
                      {kindLabel(event.kind)} · {categoryLabel(event.category)}
                      {event.matchedTerm ? ` · termo: ${event.matchedTerm}` : ""}
                      {event.subjectUser ? ` · ${event.subjectUser.email}` : ""}
                    </p>
                    {event.reporter ? (
                      <p className="mt-1 inline-flex items-center gap-1 text-sm text-navy/50">
                        <Flag className="h-3 w-3" />
                        denunciado por {event.reporter.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    {event.subjectUser ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={busy}
                        onClick={() => forceRename(event)}
                      >
                        Renomear
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      disabled={busy}
                      onClick={() => send("/api/moderation/events", "PATCH", { id: event.id })}
                    >
                      Arquivar
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
        <h2 className="text-lg font-extrabold text-navy">Termos bloqueados</h2>
        <p className="mt-1 text-sm text-navy/60">
          A lista padrão já vem no sistema. Adicione aqui apenas o que aparecer de novo — vale sem
          precisar de deploy.
        </p>

        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const created = await send("/api/moderation/terms", "POST", {
              term: newTerm,
              severity,
            });
            if (created) setNewTerm("");
          }}
        >
          <input
            value={newTerm}
            onChange={(event) => setNewTerm(event.target.value)}
            placeholder="novo termo"
            className="min-w-[200px] flex-1 rounded-xl border border-navy/10 px-4 py-2 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value === "REVIEW" ? "REVIEW" : "BLOCK")}
            className="rounded-xl border border-navy/10 px-3 py-2 font-semibold text-navy"
          >
            <option value="BLOCK">Bloquear</option>
            <option value="REVIEW">Só revisar</option>
          </select>
          <Button type="submit" size="sm" disabled={busy || newTerm.trim().length < 2}>
            Adicionar
          </Button>
        </form>

        <ul className="mt-4 flex flex-wrap gap-2">
          {terms
            .filter((term) => term.active)
            .map((term) => (
              <li
                key={term.id}
                className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-3 py-1.5 text-sm font-bold text-navy"
              >
                {term.term}
                <span className="text-navy/40">
                  {term.severity === "BLOCK" ? "bloqueia" : "revisa"}
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => send("/api/moderation/terms", "DELETE", { id: term.id })}
                  aria-label={`Remover ${term.term}`}
                  className="text-navy/40 transition-colors hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
