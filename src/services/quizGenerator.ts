import type { Quiz } from "../types";
import { API_BASE_URL } from "../config/api";

export const generateQuizFromNotes = async (
  studyNote: string,
  topic: string,
  difficulty: string,
  numQuestions: number,
  token: string
): Promise<{
  quiz?: Quiz;
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quizzes/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studyNote,
        topic,
        difficulty,
        numQuestions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const quiz = await response.json();
    return { quiz };
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: (error as Error).message || "Failed to generate quiz" };
  }
};
