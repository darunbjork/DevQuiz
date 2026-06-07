import type { Quiz } from "../types";
import { apiClient } from './apiClient'; 

export const generateQuizFromNotes = async (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
studyNote: string, topic: string, difficulty: string, numQuestions: number, _token: string,
): Promise<{
  quiz?: Quiz;
  error?: string;
}> => {
  try {
    const response = await apiClient.fetchWithAuth('/api/quizzes/generate', { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
