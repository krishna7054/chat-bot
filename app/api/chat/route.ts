import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, role } = await req.json();

    const systemPrompt = `
You are a strict technical interviewer for ${role}.

Flow:
- Ask one question
- Wait for answer
- Evaluate
- Ask next

IMPORTANT:
- Do NOT use markdown symbols like *, **, or #
- Keep clean plain text
- Use line breaks for readability
- Questions should be start new line and Questions should be numbered like "Question 1: ..."  

Format:
Score: X/10
Feedback:
- Strengths
- Weaknesses
Ideal Answer:
`;

    const conversation = messages
      .map((m: any) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
      .join(" ");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}
${conversation}`,
    });

    return NextResponse.json({
      reply: response.text || "No response",
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return NextResponse.json({
      reply: "⚠️ Gemini API error. Check server logs.",
    });
  }
}
