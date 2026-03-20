"use client";

import { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import FeedbackCard from "./FeedbackCard";
import Loader from "./Loader";

export default function ChatWindow({ role }: { role: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [time, setTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);


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
      body: JSON.stringify({ messages: [], role }),
    });

    const data = await res.json();

    setMessages([{ role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  const extractScore = (text: string) => {
    const match = text.match(/Score:\s*(\d+)/i);
    return match ? Number(match[1]) : null;
  };

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setShowFeedback(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages, role }),
    });

    const data = await res.json();
    const reply = data.reply;

    const score = extractScore(reply);
    if (score) setScores((prev) => [...prev, score]);

    setMessages([...newMessages, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const avg =
    scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : "-";

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between mb-2">
        <span>Role: {role}</span>
        <span>⏱️ {formatTime(time)}</span>
        <span>Avg Score: {avg}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded mb-3">
        <div
          className="bg-green-500 h-2 rounded"
          style={{ width: `${scores.length * 15}%` }}
        />
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <MessageBubble msg={msg} />

            {/* ✅ Only show feedback AFTER user answers */}
            {showFeedback &&
              msg.role === "assistant" &&
              msg.content.includes("Score") && (
                <FeedbackCard text={msg.content} />
              )}
          </div>
        ))}

        {loading && <Loader />}
      </div>

      {/* Input */}
 <div className="flex gap-2 mt-4 bg-white border rounded-xl p-2 shadow-sm">
  <input
    className="flex-1 outline-none px-2"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type your answer..."
  />
  <button
    onClick={sendMessage}
    className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
  >
    Send
  </button>
</div>
    </div>
  );
}
