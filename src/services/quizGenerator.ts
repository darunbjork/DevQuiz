import type { QuizQuestion } from "../types";
import { parseQuizText } from "../utils/quizParser";

export const generateQuizFromNotes = async (studyNote: string): Promise<{
  questions: QuizQuestion[];
  error?: string;
}> => {
  const detailedPrompt = `You are an AI that generates multiple-choice quiz questions.

Create EXACTLY 5 questions based on the study notes below.

FORMAT THE OUTPUT EXACTLY LIKE THIS:

Q1: [Your first question here]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [A/B/C/D]

Q2: [Your second question here]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [A/B/C/D]

IMPORTANT RULES:
1. Each question MUST have exactly 4 options: A), B), C), D)
2. Each option must start with the letter and parenthesis (A), B), etc.)
3. The correct answer must be on its own line starting with "Correct: "
4. Do NOT add explanations, markdown, or extra text
5. Make sure each question has meaningful, complete text after "Q1:"

STUDY NOTES:
${studyNote}`;

  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: detailedPrompt }] }],
      }),
    });

    if (!response.ok) throw new Error("Failed to generate quiz");

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    console.log("AI Response:", aiResponse);

    const parsed = parseQuizText(aiResponse);
    console.log("Parsed questions:", parsed);

    if (parsed.length === 0) {
      return { questions: [], error: "Failed to parse AI response" };
    }

    return { questions: parsed };
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { questions: [], error: "Failed to generate quiz" };
  }
};
