"use client";

function cleanText(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .trim();
}

function parseFeedback(text: string) {
  const cleaned = cleanText(text);

  const scoreMatch = cleaned.match(/Score:\s*(\d+)/i);
  const strengthsMatch = cleaned.match(
    /Strengths:([\s\S]*?)(Weaknesses:|Ideal Answer:|$)/i
  );
  const weaknessesMatch = cleaned.match(
    /Weaknesses:([\s\S]*?)(Ideal Answer:|$)/i
  );
  const idealMatch = cleaned.split(/Ideal Answer:/i)[1];

  return {
    score: scoreMatch ? Number(scoreMatch[1]) : null,
    strengths: strengthsMatch?.[1]?.trim(),
    weaknesses: weaknessesMatch?.[1]?.trim(),
    ideal: idealMatch?.trim(),
  };
}

export default function FeedbackCard({ text }: { text: string }) {
  const { score, strengths, weaknesses, ideal } = parseFeedback(text);

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/70 bg-[rgba(255,250,244,0.88)] shadow-[0_22px_48px_rgba(88,61,31,0.12)] backdrop-blur">
      <div className="flex items-center justify-between gap-4 border-b border-[rgba(88,61,31,0.08)] px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Review
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--foreground)] sm:text-xl">
            Answer Feedback
          </h3>
        </div>
        {score !== null && (
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              score >= 7
                ? "bg-emerald-100 text-emerald-700"
                : score >= 4
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700"
            }`}
          >
            {score}/10
          </span>
        )}
      </div>

      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
        {strengths && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
            <p className="text-sm font-semibold text-emerald-700">Strengths</p>
            <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
              {strengths}
            </p>
          </div>
        )}

        {weaknesses && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
            <p className="text-sm font-semibold text-rose-700">Weaknesses</p>
            <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
              {weaknesses}
            </p>
          </div>
        )}

        {ideal && (
          <div className="rounded-2xl border border-[rgba(88,61,31,0.08)] bg-white/80 p-4 lg:col-span-2">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Ideal Answer
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">
              {ideal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
