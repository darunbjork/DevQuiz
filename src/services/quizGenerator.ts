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

    // This is where we send our request to the Google Gemini AI.
    // We use the `fetch` function to make a web request.
    // `method: "POST"` means we are sending data to the AI.
    // `headers` tell the AI that we are sending data in JSON format.
    // `body` contains the actual message (the detailedPrompt) we want the AI to process,
    // formatted as JSON.
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: detailedPrompt }] }],
      }),
    });

    if (!response.ok) throw new Error("Failed to generate quiz");

    const data = await response.json();
 
    // After the AI responds, we need to get the actual text of its answer.
    // The AI's response comes in a structured format, so we look inside
    // `data.candidates` (which are potential responses), then `content` (the main part of the response),
    // then `parts` (different sections of the content), and finally `text` (the actual quiz text).
    const aiResponse = data.candidates[0].content.parts[0].text;

    // console.log("AI Response:", aiResponse);

    // Now that we have the raw text response from the AI, we need to turn it
    // into a usable list of quiz questions.
    // The `parseQuizText` function takes the AI's text and converts it
    // into a structured format that our application can use.
    const parsed = parseQuizText(aiResponse);
    console.log("Parsed questions:", parsed);

    // If `parsed.length` is 0, it means that our `parseQuizText` function
    // couldn't find any valid questions in the AI's response, or the AI
    // didn't provide any questions that matched our expected format.
    if (parsed.length === 0) {
      return { questions: [], error: "Failed to parse AI response" };
    }

    return { questions: parsed };
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { questions: [], error: "Failed to generate quiz" };
  }
};
