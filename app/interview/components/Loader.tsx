export default function Loader() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-[var(--muted)] shadow-[0_12px_28px_rgba(88,61,31,0.08)] backdrop-blur">
      <div className="flex gap-1">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[var(--accent)]" />
      </div>
      <span>Interviewer is thinking...</span>
    </div>
  );
}
