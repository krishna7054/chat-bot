"use client";

import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import FeedbackCard from "./FeedbackCard";
import Loader from "./Loader";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  type: "question" | "answer" | "feedback";
};

const TOTAL_QUESTIONS = 5;

export default function ChatWindow({ role }: { role: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [time, setTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    startInterview();

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startInterview = async () => {
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [], role }),
    });

    const data = await res.json();

    setMessages([
      {
        role: "assistant",
        content: data.question,
        type: "question",
      },
    ]);
    setLoading(false);
  };

  const extractScore = (text: string) => {
    const match = text.match(/Score:\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading || isComplete) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedInput,
      type: "answer",
    };
    const conversation = [
      ...messages.filter((message) => message.type !== "feedback"),
      userMessage,
    ];

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: conversation, role }),
    });

    const data = await res.json();
    const score = extractScore(data.feedback || "");

    if (score !== null) {
      setScores((prev) => [...prev, score]);
    }

    setMessages((current) => {
      const nextMessages: ChatMessage[] = [
        ...current,
        {
          role: "assistant",
          content: data.feedback,
          type: "feedback",
        },
      ];

      if (!data.done && data.nextQuestion) {
        nextMessages.push({
          role: "assistant",
          content: data.nextQuestion,
          type: "question",
        });
      }

      return nextMessages;
    });

    setIsComplete(Boolean(data.done));
    setLoading(false);
  };

  const averageScore =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : "-";
  const answeredQuestions = scores.length;
  const progress = Math.min((answeredQuestions / TOTAL_QUESTIONS) * 100, 100);
  const latestQuestion = [...messages]
    .reverse()
    .find((message) => message.type === "question")?.content;

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <main className="min-h-screen px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-7xl gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="order-2 lg:order-1 lg:sticky lg:top-6 lg:self-start">
          <div className="flex flex-col rounded-[28px] border border-white/60 bg-[rgba(255,248,240,0.76)] p-4 shadow-[0_24px_80px_rgba(88,61,31,0.14)] backdrop-blur-xl sm:p-5">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Live Session
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {roleLabel} Interview
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Answer each question, review the feedback, and continue to the next one.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Time
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  {formatTime(time)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Avg Score
                </p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  {averageScore}
                </p>
              </div>
              <div className="col-span-2 rounded-2xl border border-white/70 bg-white/75 p-4 sm:col-span-1 lg:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Progress
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[rgba(88,61,31,0.08)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(135deg,#d0894f,#8f4f19)] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  {answeredQuestions} of {TOTAL_QUESTIONS} answers reviewed
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-[rgba(255,255,255,0.72)] p-4 shadow-[0_12px_28px_rgba(88,61,31,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Current Prompt
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                {latestQuestion || "Preparing your first interview question..."}
              </p>
            </div>
          </div>
          </div>
        </aside>

        <section className="order-1 flex min-h-[70vh] flex-col overflow-hidden rounded-[30px] border border-white/60 bg-[rgba(255,251,245,0.78)] shadow-[0_24px_80px_rgba(88,61,31,0.14)] backdrop-blur-xl lg:order-2">
          <div className="border-b border-[rgba(88,61,31,0.08)] px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  Interview Room
                </p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                  Practice with focused, step-by-step feedback
                </h2>
              </div>
              <div className="rounded-full border border-[rgba(183,110,50,0.18)] bg-[rgba(183,110,50,0.08)] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
                {isComplete ? "Session complete" : "Session in progress"}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:gap-5">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.type === "feedback" ? (
                    <FeedbackCard text={msg.content} />
                  ) : (
                    <MessageBubble msg={msg} />
                  )}
                </div>
              ))}

              {loading && <Loader />}
            </div>
          </div>

          <div className="border-t border-[rgba(88,61,31,0.08)] bg-white/50 px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-[26px] border border-white/70 bg-white/80 p-3 shadow-[0_12px_28px_rgba(88,61,31,0.08)] sm:flex-row sm:items-end sm:p-4">
              <div className="flex-1">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Your Answer
                </label>
                <input
                  className="w-full rounded-2xl border border-[rgba(88,61,31,0.08)] bg-[rgba(255,251,245,0.92)] px-4 py-3 text-[15px] text-[var(--foreground)] outline-none transition focus:border-[rgba(183,110,50,0.35)] focus:ring-4 focus:ring-[rgba(183,110,50,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  placeholder={
                    isComplete ? "Interview complete" : "Type your answer and press Enter"
                  }
                  disabled={isComplete || loading}
                />
              </div>
              <button
                onClick={sendMessage}
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#c67a3f,#8f4f19)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(143,79,25,0.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(143,79,25,0.34)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[140px]"
                disabled={isComplete || loading}
              >
                {isComplete ? "Completed" : "Send Answer"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
