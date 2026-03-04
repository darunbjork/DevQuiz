import type { Quiz } from "../types";
// import { API_BASE_URL } from "../config/api"; // Not needed as apiClient handles base URL
import { apiClient } from './apiClient'; // Import apiClient

export const generateQuizFromNotes = async (
  studyNote: string,
  topic: string,
  difficulty: string,
  numQuestions: number,
  // Removed token parameter
): Promise<{
  quiz?: Quiz;
  error?: string;
}> => {
  try {
    const response = await apiClient.fetchWithAuth('/api/quizzes/generate', { // Use apiClient
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Removed Authorization header
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
