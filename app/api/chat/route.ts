import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MAX_QUESTIONS = 5;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  type?: "question" | "answer" | "feedback";
};

function buildConversation(messages: ChatMessage[]) {
  return messages
    .map((message) => {
      const speaker = message.role === "user" ? "Candidate" : "Interviewer";
      return `${speaker}: ${message.content}`;
    })
    .join("\n");
}

function splitEvaluation(text: string) {
  const cleaned = text.trim();
  const nextQuestionMatch = cleaned.match(/Next Question:\s*([\s\S]*)/i);

  return {
    feedback: cleaned.replace(/Next Question:\s*[\s\S]*/i, "").trim(),
    nextQuestion: nextQuestionMatch?.[1]?.trim() || "",
  };
}

export async function POST(req: Request) {
  try {
    const { messages = [], role } = (await req.json()) as {
      messages: ChatMessage[];
      role: string;
    };

    const interviewMessages = messages.filter(
      (message) => message.type !== "feedback"
    );
    const answerCount = interviewMessages.filter(
      (message) => message.role === "user"
    ).length;

    if (answerCount === 0) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are a strict but helpful technical interviewer for a ${role} role.

Ask exactly one opening interview question.

Rules:
- Return only the question text
- Use plain text only
- Do not use markdown
- Format it exactly like: Question 1: <question>
`,
      });

      return NextResponse.json({
        question: response.text?.trim() || "Question 1: Tell me about yourself.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a strict but helpful technical interviewer for a ${role} role.

There should be a total of ${MAX_QUESTIONS} questions in the interview.
The candidate has already answered ${answerCount} question(s).

Conversation so far:
${buildConversation(interviewMessages)}

Evaluate only the candidate's latest answer to the latest interviewer question.

Return plain text in exactly this format:
Score: X/10
Strengths:
<short strengths>
Weaknesses:
<short weaknesses>
Ideal Answer:
<concise ideal answer>
Next Question:
Question ${answerCount + 1}: <next question>

Rules:
- Do not use markdown
- Do not use bullet symbols
- Keep each section concise
- If the candidate has already answered ${MAX_QUESTIONS} questions, write exactly END OF INTERVIEW after Next Question:
`,
    });

    const { feedback, nextQuestion } = splitEvaluation(response.text || "");
    const done = nextQuestion.toUpperCase() === "END OF INTERVIEW";

    return NextResponse.json({
      feedback:
        feedback ||
        "Score: 0/10\nStrengths:\n\nWeaknesses:\nUnable to evaluate.\nIdeal Answer:\n",
      nextQuestion: done
        ? ""
        : nextQuestion ||
          `Question ${answerCount + 1}: Can you explain your approach in more detail?`,
      done,
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return NextResponse.json({
      question: "Unable to start the interview right now.",
      feedback:
        "Score: 0/10\nStrengths:\n\nWeaknesses:\nThe interview service is unavailable.\nIdeal Answer:\n",
      nextQuestion: "",
      done: true,
    });
  }
}
