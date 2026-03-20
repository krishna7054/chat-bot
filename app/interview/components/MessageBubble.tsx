type MessageBubbleProps = {
  msg: {
    role: "user" | "assistant";
    content: string;
    type?: "question" | "answer" | "feedback";
  };
};

export default function MessageBubble({ msg }: MessageBubbleProps) {
  const isUser = msg.role === "user";
  const clean = msg.content
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-[24px] border px-4 py-3 text-sm shadow-sm sm:max-w-[80%] sm:px-5 sm:py-4 sm:text-[15px] ${
          isUser
            ? "border-[rgba(143,79,25,0.22)] bg-[linear-gradient(135deg,#c67a3f,#9d5922)] text-white shadow-[0_16px_36px_rgba(143,79,25,0.25)]"
            : "border-white/70 bg-white/80 text-[var(--foreground)] shadow-[0_12px_28px_rgba(88,61,31,0.08)] backdrop-blur"
        }`}
      >
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
          {isUser ? "You" : msg.type === "question" ? "Interviewer" : "Assistant"}
        </div>
        <p className="whitespace-pre-line leading-7">{clean}</p>
      </div>
    </div>
  );
}
