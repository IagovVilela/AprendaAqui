"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export type ScoreboardRow = {
  position: number;
  userId: string;
  teamId: string | null;
  name: string;
  score: number;
  correctCount: number;
  connected: boolean;
};

export type ActiveQuestion = {
  index: number;
  total: number;
  topic: string;
  prompt: string;
  options: string[];
  endsAt: string;
  alreadyAnswered: boolean;
};

export type QuestionResult = {
  index: number;
  correctOption: string;
};

export type WarResult = {
  challengerScore: number;
  opponentScore: number;
  winnerTeamId: string | null;
  draw: boolean;
};

export type QuizPhase = "connecting" | "lobby" | "question" | "intermission" | "finished" | "error";

export type QuizSocketState = {
  phase: QuizPhase;
  isHost: boolean;
  question: ActiveQuestion | null;
  lastResult: QuestionResult | null;
  scoreboard: ScoreboardRow[];
  myScore: number;
  lastPoints: number | null;
  warResult: WarResult | null;
  error: string | null;
};

const INITIAL_STATE: QuizSocketState = {
  phase: "connecting",
  isHost: false,
  question: null,
  lastResult: null,
  scoreboard: [],
  myScore: 0,
  lastPoints: null,
  warResult: null,
  error: null,
};

function realtimeUrl(): string {
  return process.env.NEXT_PUBLIC_REALTIME_URL ?? "";
}

export function useQuizSocket(code: string) {
  const [state, setState] = useState<QuizSocketState>(INITIAL_STATE);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;
    let socket: Socket | null = null;

    async function connect() {
      const res = await fetch("/api/quiz/realtime-token", { method: "POST" });
      if (!res.ok) {
        if (!cancelled) {
          setState((s) => ({ ...s, phase: "error", error: "Não foi possível autenticar a sala" }));
        }
        return;
      }

      const { token } = (await res.json()) as { token: string };
      if (cancelled) return;

      socket = io(`${realtimeUrl()}/quiz`, {
        auth: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket?.emit("room:join", { code });
      });

      socket.on("room:state", (payload: {
        status: string;
        isHost: boolean;
        myScore: number;
        scoreboard: ScoreboardRow[];
      }) => {
        setState((s) => ({
          ...s,
          phase:
            payload.status === "QUESTION"
              ? "question"
              : payload.status === "INTERMISSION"
                ? "intermission"
                : payload.status === "FINISHED"
                  ? "finished"
                  : "lobby",
          isHost: payload.isHost,
          myScore: payload.myScore,
          scoreboard: payload.scoreboard,
          error: null,
        }));
      });

      socket.on("question:start", (question: ActiveQuestion) => {
        setState((s) => ({
          ...s,
          phase: "question",
          question,
          lastResult: null,
          lastPoints: null,
        }));
      });

      socket.on("question:end", (payload: QuestionResult & { scoreboard: ScoreboardRow[] }) => {
        setState((s) => ({
          ...s,
          phase: "intermission",
          question: null,
          lastResult: { index: payload.index, correctOption: payload.correctOption },
          scoreboard: payload.scoreboard,
        }));
      });

      socket.on("scoreboard", (payload: { scoreboard: ScoreboardRow[] }) => {
        setState((s) => ({ ...s, scoreboard: payload.scoreboard }));
      });

      socket.on("answer:accepted", (payload: { points: number }) => {
        setState((s) => ({
          ...s,
          lastPoints: payload.points,
          myScore: s.myScore + payload.points,
          question: s.question ? { ...s.question, alreadyAnswered: true } : null,
        }));
      });

      socket.on("answer:rejected", (payload: { reason: string }) => {
        setState((s) => ({ ...s, error: payload.reason }));
      });

      socket.on(
        "session:finished",
        (payload: { scoreboard: ScoreboardRow[]; war: WarResult | null }) => {
          setState((s) => ({
            ...s,
            phase: "finished",
            question: null,
            scoreboard: payload.scoreboard,
            warResult: payload.war,
          }));
        }
      );

      socket.on("room:error", (payload: { message: string }) => {
        setState((s) => ({ ...s, phase: "error", error: payload.message }));
      });

      socket.on("connect_error", () => {
        setState((s) => ({ ...s, error: "Conexão instável. Tentando reconectar..." }));
      });
    }

    void connect();

    return () => {
      cancelled = true;
      socket?.disconnect();
      socketRef.current = null;
    };
  }, [code]);

  const submitAnswer = useCallback((displayIndex: number) => {
    socketRef.current?.emit("answer:submit", { displayIndex });
  }, []);

  const startNext = useCallback(() => {
    socketRef.current?.emit("host:next");
  }, []);

  return { state, submitAnswer, startNext };
}
