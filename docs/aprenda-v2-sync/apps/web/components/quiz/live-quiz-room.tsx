"use client";

import { useEffect, useState } from "react";
import { Gem, Play, Timer, Trophy, Users, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuizSocket } from "@/lib/use-quiz-socket";

const OPTION_STYLES = [
  "bg-red-500 border-red-700",
  "bg-blue-500 border-blue-700",
  "bg-amber-500 border-amber-700",
  "bg-emerald-500 border-emerald-700",
];

function useCountdown(endsAt: string | undefined) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!endsAt) {
      setRemaining(0);
      return;
    }

    const target = new Date(endsAt).getTime();
    const tick = () => setRemaining(Math.max(0, Math.ceil((target - Date.now()) / 1000)));

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [endsAt]);

  return remaining;
}

export function LiveQuizRoom({ code }: { code: string }) {
  const { state, submitAnswer, startNext } = useQuizSocket(code);
  const remaining = useCountdown(state.question?.endsAt);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-primary">Sala {code}</p>
          <h1 className="text-2xl font-extrabold text-navy">Batalha ao vivo</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-extrabold text-primary">
            <Gem className="h-4 w-4" />
            {state.myScore} pts
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-4 py-2 font-bold text-navy/70">
            <Users className="h-4 w-4" />
            {state.scoreboard.length}
          </span>
        </div>
      </header>

      {state.error ? (
        <p className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          <WifiOff className="h-4 w-4" />
          {state.error}
        </p>
      ) : null}

      {state.phase === "connecting" ? (
        <p className="text-navy/60">Conectando à sala...</p>
      ) : null}

      {state.phase === "lobby" ? (
        <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6 text-center">
          <h2 className="text-xl font-extrabold text-navy">Aguardando início</h2>
          <p className="mt-1 text-navy/60">
            Quem entrar depois ainda consegue participar. Se cair a conexão, você volta com sua
            pontuação.
          </p>
          {state.isHost ? (
            <Button type="button" className="mt-5" onClick={startNext}>
              <Play className="h-4 w-4" />
              Começar
            </Button>
          ) : null}
        </section>
      ) : null}

      {state.phase === "question" && state.question ? (
        <section className="space-y-4">
          <div className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
            <div className="flex items-center justify-between text-sm font-bold text-navy/50">
              <span>
                Pergunta {state.question.index} de {state.question.total}
              </span>
              <span className="inline-flex items-center gap-1 text-primary">
                <Timer className="h-4 w-4" />
                {remaining}s
              </span>
            </div>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">
              {state.question.topic}
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-navy">{state.question.prompt}</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {state.question.options.map((option, index) => (
              <button
                key={`${option}-${index}`}
                type="button"
                disabled={state.question?.alreadyAnswered || remaining === 0}
                onClick={() => submitAnswer(index)}
                className={`rounded-2xl border-b-4 p-5 text-left font-bold text-white transition-transform disabled:opacity-50 ${
                  OPTION_STYLES[index % OPTION_STYLES.length]
                } ${state.question?.alreadyAnswered ? "" : "hover:brightness-110 active:translate-y-1 active:border-b-0"}`}
              >
                {option}
              </button>
            ))}
          </div>

          {state.question.alreadyAnswered ? (
            <p className="text-center text-sm font-bold text-primary">
              Resposta registrada{state.lastPoints !== null ? ` · +${state.lastPoints} pts` : ""}
            </p>
          ) : null}
        </section>
      ) : null}

      {state.phase === "intermission" ? (
        <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
          <h2 className="text-lg font-extrabold text-navy">Placar</h2>
          {state.lastResult ? (
            <p className="mt-1 text-sm font-semibold text-navy/60">
              Resposta certa: <span className="text-primary">{state.lastResult.correctOption}</span>
            </p>
          ) : null}
          <Scoreboard rows={state.scoreboard} />
          {state.isHost ? (
            <Button type="button" className="mt-4" onClick={startNext}>
              Próxima pergunta
            </Button>
          ) : null}
        </section>
      ) : null}

      {state.phase === "finished" ? (
        <section className="card-elevation rounded-3xl border border-navy/5 bg-white p-6">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-navy">
            <Trophy className="h-5 w-5 text-amber-500" />
            Resultado final
          </h2>
          {state.warResult ? (
            <p className="mt-2 font-bold text-navy">
              {state.warResult.draw
                ? "Empate entre as equipes"
                : "Vitória definida pela média das equipes"}{" "}
              — {state.warResult.challengerScore} x {state.warResult.opponentScore}
            </p>
          ) : null}
          <Scoreboard rows={state.scoreboard} />
        </section>
      ) : null}
    </div>
  );
}

function Scoreboard({ rows }: { rows: { position: number; userId: string; name: string; score: number; correctCount: number; connected: boolean }[] }) {
  if (rows.length === 0) {
    return <p className="mt-3 text-navy/50">Ninguém entrou ainda.</p>;
  }

  return (
    <ol className="mt-3 space-y-2">
      {rows.map((row) => (
        <li
          key={row.userId}
          className="flex items-center justify-between rounded-2xl border border-navy/10 px-4 py-3"
        >
          <span className="flex items-center gap-3 font-bold text-navy">
            <span className="w-6 text-navy/40">{row.position}</span>
            {row.name}
            {row.connected ? null : <WifiOff className="h-4 w-4 text-navy/30" />}
          </span>
          <span className="font-extrabold text-primary">{row.score}</span>
        </li>
      ))}
    </ol>
  );
}
