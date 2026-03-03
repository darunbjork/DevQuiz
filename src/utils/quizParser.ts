import type { QuizQuestion } from "../types";

/**
 * Parses raw text input into an array of structured quiz questions.
 * The input text is expected to follow a specific format:
 * Q1: [Question text]
 * A) [Option A]
 * B) [Option B]
 * C) [Option C]
 * D) [Option D]
 * Correct: [A/B/C/D]
 *
 * Each question is identified by "Q<number>:", options by "A) ", "B) ", etc.,
 * and the correct answer by "Correct: [A-D]".
 *
 * @param text - The raw string containing quiz questions in the specified format. This is the complete text response from the AI.
 * @returns An array of `QuizQuestion` objects, each with an ID, question text, options, and correct answer index.
 */
export const parseQuizText = (text: string): QuizQuestion[] => {
  // `(text: string)` means this function expects one input, named `text`, which must be a 'string' (like words or sentences).
  // The `: QuizQuestion[]` after the parentheses means the function will give back (return) a list (array) of 'QuizQuestion' objects.
  const cleanedText = text.trim(); // Remove leading/trailing whitespace from the input text.
  // We split the entire AI response text into individual lines to process them one by one.
  // This does NOT mean 4 options per 5 questions, but rather each line of the AI's output.
  const lines = cleanedText.split('\n'); // Split the cleaned text into individual lines.
  const questions: QuizQuestion[] = []; // Initialize an empty array to store the parsed quiz questions.
  let currentQuestion: Partial<QuizQuestion> | null = null; // Store the question being built. Partial allows properties to be added one by one.
  let options: string[] = []; // Store the options for the current question.

  // Iterate over each line of the input text.
  for (const line of lines) {
    const trimmedLine = line.trim(); // Remove leading/trailing whitespace from the current line.

    // Check if the current line starts a new question (e.g., "Q1: What is...?").
    const questionMatch = trimmedLine.match(/^Q(\d+):\s*(.*)/);
    
    if (questionMatch) {
      // If a previous question was being built and has all its parts, add it to the questions array.
      if (currentQuestion && currentQuestion.question && options.length === 4) {
        questions.push({
          id: (Date.now() + questions.length).toString(), // Assign a unique ID to the question.
          question: currentQuestion.question,
          options: [...options], // Clone the options array.
          correctAnswer: currentQuestion.correctAnswer || 0, // Default to 0 if correct answer not found.
        });
      }

      // Start a new question with the extracted question text.
      currentQuestion = { question: questionMatch[2] || "" };
      options = []; // Reset options for the new question.
    }
    // Check if the current line is an option (e.g., "A) Option text").
    else if (trimmedLine.match(/^[A-D]\)\s*(.*)/)) {
      const optionMatch = trimmedLine.match(/^([A-D])\)\s*(.*)/);
      if (optionMatch && currentQuestion) {
        const [, letter, optionText] = optionMatch; // Extract the option letter and text.
        const optionIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0); // Convert 'A' to 0, 'B' to 1, etc.
        options[optionIndex] = optionText; // Store the option text at its corresponding index.
      }
    }
    // Check if the current line specifies the correct answer (e.g., "Correct: B").
    else if (trimmedLine.startsWith('Correct:')) {
      const correctMatch = trimmedLine.match(/^Correct:\s*([A-D])/);
      if (correctMatch && currentQuestion) {
        const correctLetter = correctMatch[1]; // Extract the correct answer letter.
        currentQuestion.correctAnswer = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0); // Convert 'A' to 0, 'B' to 1, etc.
      }
    }
  }

  // After the loop, add the last question if it was being built and is complete.
  if (currentQuestion && currentQuestion.question && options.length === 4) {
    questions.push({
      id: (Date.now() + questions.length).toString(),
      question: currentQuestion.question,
      options: [...options],
      correctAnswer: currentQuestion.correctAnswer || 0,
    });
  }

  return questions; // Return the array of parsed quiz questions.
};
