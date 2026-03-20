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
    <div className="bg-white border rounded-2xl shadow-md p-4 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">📊 Feedback</h3>
        {score !== null && (
          <span
            className={`px-3 py-1 text-sm rounded-full font-semibold ${
              score >= 7
                ? "bg-green-100 text-green-700"
                : score >= 4
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {score}/10
          </span>
        )}
      </div>

      {/* Strengths */}
      {strengths && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
          <p className="text-green-700 font-medium mb-1">✅ Strengths</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {strengths}
          </p>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
          <p className="text-red-700 font-medium mb-1">❌ Weaknesses</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {weaknesses}
          </p>
        </div>
      )}

      {/* Ideal Answer */}
      {ideal && (
        <div className="bg-gray-50 border p-3 rounded-xl">
          <p className="font-medium mb-2">💡 Ideal Answer</p>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {ideal}
          </p>
        </div>
      )}
    </div>
  );
}