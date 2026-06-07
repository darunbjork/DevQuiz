import type { QuizQuestion } from "../types";

export const parseQuizText = (text: string): QuizQuestion[] => {
  const cleanedText = text.trim(); 
  const lines = cleanedText.split('\n'); 
  const questions: QuizQuestion[] = []; 
  let currentQuestion: Partial<QuizQuestion> | null = null; 
  let options: string[] = []; 
  for (const line of lines) {
    const trimmedLine = line.trim(); 
    const questionMatch = trimmedLine.match(/^Q(\d+):\s*(.*)/);
    
    if (questionMatch) {
      if (currentQuestion && currentQuestion.question && options.length === 4) {
        questions.push({
          id: (Date.now() + questions.length).toString(), 
          question: currentQuestion.question,
          options: [...options], 
          correctAnswer: currentQuestion.correctAnswer || 0,
        });
      }

      currentQuestion = { question: questionMatch[2] || "" };
      options = []; 
    }
    else if (trimmedLine.match(/^[A-D]\)\s*(.*)/)) {
      const optionMatch = trimmedLine.match(/^([A-D])\)\s*(.*)/);
      if (optionMatch && currentQuestion) {
        const [, letter, optionText] = optionMatch; 
        const optionIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0); 
        options[optionIndex] = optionText; 
      }
    }
    else if (trimmedLine.startsWith('Correct:')) {
      const correctMatch = trimmedLine.match(/^Correct:\s*([A-D])/);
      if (correctMatch && currentQuestion) {
        const correctLetter = correctMatch[1];
        currentQuestion.correctAnswer = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0); 
      }
    }
  }

  if (currentQuestion && currentQuestion.question && options.length === 4) {
    questions.push({
      id: (Date.now() + questions.length).toString(),
      question: currentQuestion.question,
      options: [...options],
      correctAnswer: currentQuestion.correctAnswer || 0,
    });
  }

  return questions; 
};
