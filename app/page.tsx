"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const roles = [
  {
    value: "frontend",
    label: "Frontend",
    description: "React, UI architecture, browser behavior, and performance",
  },
  {
    value: "backend",
    label: "Backend",
    description: "APIs, databases, scaling, security, and system design",
  },
  {
    value: "dsa",
    label: "DSA",
    description: "Problem solving, data structures, algorithms, and tradeoffs",
  },
];

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState("frontend");

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
        <section className="grid w-full gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/50 bg-[rgba(255,251,245,0.72)] p-6 shadow-[0_24px_80px_rgba(88,61,31,0.14)] backdrop-blur-xl sm:p-8 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(183,110,50,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.35),transparent_100%)]" />
            <div className="relative space-y-8">
              <div className="inline-flex items-center rounded-full border border-[rgba(88,61,31,0.12)] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">
                Interview Copilot
              </div>

              <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight text-(--foreground) sm:text-5xl lg:text-6xl">
                  Practice interviews in a space that feels focused and premium.
                </h1>
                <p className="max-w-xl text-base leading-7 text-(--muted) sm:text-lg">
                  Pick a role, answer one question at a time, and get structured
                  feedback before moving to the next one.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="text-sm font-medium text-(--foreground)">
                    One question at a time
                  </p>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">
                    Clear flow without clutter or mixed responses.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="text-sm font-medium text-(--foreground)">
                    Instant feedback
                  </p>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">
                    Score, strengths, weaknesses, and ideal answer after each turn.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/60 p-4">
                  <p className="text-sm font-medium text-(--foreground)">
                    Works everywhere
                  </p>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">
                    Responsive layouts for mobile, tablet, laptop, and desktop.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/50 bg-[rgba(255,248,240,0.88)] p-6 shadow-[0_24px_80px_rgba(88,61,31,0.14)] backdrop-blur-xl sm:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--muted)">
                  Start Session
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-(--foreground)">
                  Choose your interview track
                </h2>
              </div>

              <div className="space-y-3">
                {roles.map((item) => {
                  const isActive = role === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setRole(item.value)}
                      className={`cursor-pointer w-full rounded-2xl border px-4 py-4 text-left transition duration-200 ${
                        isActive
                          ? "border-[rgba(183,110,50,0.35)] bg-[rgba(183,110,50,0.12)] shadow-[0_16px_36px_rgba(183,110,50,0.14)]"
                          : "border-[rgba(88,61,31,0.08)] bg-white/75 hover:border-[rgba(183,110,50,0.2)] hover:bg-white"
                      }`}
                    >
                      <p className="text-base font-semibold text-(--foreground)">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-(--muted)">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#c67a3f,#8f4f19)] px-5 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(143,79,25,0.3)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(143,79,25,0.34)] cursor-pointer"
                onClick={() => router.push(`/interview?role=${role}`)}
              >
                Start Interview
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
