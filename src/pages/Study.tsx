import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import type { QuizQuestion, NewQuiz } from "../types";
import Button from "../components/Button";
import Card from "../components/Card";
import "./Study.css";

function Study() {
  const [studyNote, setStudyNote] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const parseQuizText = (text: string): QuizQuestion[] => {
    // First, clean up the text
    const cleanedText = text.trim();

    // Split by "Q\d+:" pattern but keep the delimiter
    const lines = cleanedText.split('\n');
    const questions: QuizQuestion[] = [];
    let currentQuestion: Partial<QuizQuestion> | null = null;
    let options: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check if this line starts a new question
      const questionMatch = trimmedLine.match(/^Q(\d+):\s*(.*)/);
      if (questionMatch) {
        // If we have a previous question being built, add it
        if (currentQuestion && currentQuestion.question && options.length === 4) {
          questions.push({
            id: Date.now() + questions.length,
            question: currentQuestion.question,
            options: [...options],
            correctAnswer: currentQuestion.correctAnswer || 0,
          });
        }

        // Start new question
        currentQuestion = {
          question: questionMatch[2] || "", // Get question text after "Q1:"
        };
        options = [];
      }
      // Check for options A) B) C) D)
      else if (trimmedLine.match(/^[A-D]\)\s*(.*)/)) {
        const optionMatch = trimmedLine.match(/^([A-D])\)\s*(.*)/);
        if (optionMatch && currentQuestion) {
          const [, letter, optionText] = optionMatch;
          const optionIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0);
          options[optionIndex] = optionText;
        }
      }
      // Check for correct answer
      else if (trimmedLine.startsWith('Correct:')) {
        const correctMatch = trimmedLine.match(/^Correct:\s*([A-D])/);
        if (correctMatch && currentQuestion) {
          const correctLetter = correctMatch[1];
          currentQuestion.correctAnswer = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        }
      }
    }

    // Add the last question if it exists
    if (currentQuestion && currentQuestion.question && options.length === 4) {
      questions.push({
        id: Date.now() + questions.length,
        question: currentQuestion.question,
        options: [...options],
        correctAnswer: currentQuestion.correctAnswer || 0,
      });
    }

    return questions;
  };

  const handleGenerateQuiz = async () => {
    if (!studyNote.trim()) {
      toast.error("Please enter study notes");
      return;
    }

    setLoading(true);
    setQuizQuestions([]);

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

      // DEBUG: Log the AI response
      console.log("AI Response:", aiResponse);

      const parsed = parseQuizText(aiResponse);

      // DEBUG: Log parsed questions
      console.log("Parsed questions:", parsed);

      if (parsed.length === 0) {
        toast.error("Failed to parse AI response");
        return;
      }

      // ✅ FIX: Set the quiz questions
      setQuizQuestions(parsed);

      const firstWords = studyNote.split(" ").slice(0, 5).join(" ");
      setQuizTitle(`AI Quiz: ${firstWords}...`);
      setQuizDescription(`AI-generated quiz based on: ${firstWords}...`);

      toast.success(`Generated ${parsed.length} questions!`);
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) return toast.error("Please enter a quiz title");
    if (quizQuestions.length === 0) return toast.error("No questions to save");

    const quizData: NewQuiz = {
      title: quizTitle,
      description: quizDescription,
      questions: quizQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };

    auth.addCreatedQuiz(quizData);

    setStudyNote("");
    setQuizQuestions([]);
    setQuizTitle("");
    setQuizDescription("");

    navigate("/my-quizzes");
  };

  return (
    <div className="study-container fade-in">
      <h1 className="study-title">Study with AI 🤖</h1>

      <Card title="Generate Quiz from Notes">
        <div className="form-group">
          <label className="form-label">Paste your study notes</label>
          <textarea
            className="study-textarea"
            rows={8}
            value={studyNote}
            onChange={(e) => setStudyNote(e.target.value)}
            placeholder="Example: React hooks allow function components..."
          />
          <Button onClick={handleGenerateQuiz} disabled={loading}>
            {loading ? "Generating..." : "Generate Quiz with AI"}
          </Button>
        </div>
      </Card>

      {quizQuestions.length > 0 && (
  <>
    <Card title="Quiz Details">
      <div className="form-group">
        <label className="form-label">Quiz Title</label>
        <input
          className="study-input"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Enter a title for your quiz"
        />

        <label className="form-label">Description</label>
        <textarea
          className="study-textarea"
          rows={2}
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.target.value)}
          placeholder="Enter a description (optional)"
        />
      </div>
    </Card>

    <Card title={`Generated Questions (${quizQuestions.length})`}>
      <div className="form-group">
        {quizQuestions.map((q, index) => (
          <div key={q.id} className="question-card">
            <p className="question-title">
              Q{index + 1}: {q.question}
            </p>

            {q.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={
                  optIndex === q.correctAnswer
                    ? "option-item option-correct"
                    : "option-item"
                }
              >
                {String.fromCharCode(65 + optIndex)}) {option}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>

    <div className="button-row">
      <Button onClick={handleSaveQuiz}>Save AI Quiz</Button>
    </div>
  </>
)}
    </div>
  );
}

export default Study;
