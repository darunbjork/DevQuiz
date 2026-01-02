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
    const questionBlocks = text.split(/(Q\d+:)/).filter(Boolean);
    const pairedBlocks = questionBlocks.reduce((result, _value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, [] as string[][]);

    return pairedBlocks
      .filter((pair) => pair.length === 2 && pair[0].startsWith("Q"))
      .map(([_, qBody], index) => {
        const lines = qBody.split("\n").filter((l) => l.trim() !== "");
        const questionText = lines[0].trim();
        const options: string[] = [];
        let correctAnswerIndex = -1;

        for (const line of lines.slice(1)) {
          if (line.match(/^[A-D]\) /)) {
            options.push(line.substring(3).trim());
          } else if (line.startsWith("Correct: ")) {
            const letter = line.substring("Correct: ".length).trim();
            correctAnswerIndex = letter.charCodeAt(0) - "A".charCodeAt(0);
          }
        }

        return {
          id: Date.now() + index,
          question: questionText,
          options,
          correctAnswer: correctAnswerIndex,
        };
      });
  };

  const handleGenerateQuiz = async () => {
    if (!studyNote.trim()) {
      toast.error("Please enter study notes");
      return;
    }

    setLoading(true);
    setQuizQuestions([]);

    const detailedPrompt = `
  
    You are an AI that generates multiple-choice quiz questions.

Create EXACTLY 5 questions based on the study notes below.

FORMAT THE OUTPUT EXACTLY LIKE THIS:

Q1: Question text here
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Correct: A

Q2: Question text here
A) Option 1
B) Option 2
C) Option 3
D) Option 4
Correct: C

Do NOT add explanations.
Do NOT add markdown.
Do NOT add extra text.

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
      const parsed = parseQuizText(aiResponse);

      if (parsed.length === 0) {
        toast.error("Failed to parse AI response");
        return;
      }

      setQuizQuestions(parsed);

      const firstWords = studyNote.split(" ").slice(0, 5).join(" ");
      setQuizTitle(`AI Quiz: ${firstWords}...`);
      setQuizDescription(`AI-generated quiz based on: ${firstWords}...`);

      toast.success(`Generated ${parsed.length} questions!`);
    } catch (error) {
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

    navigate("/profile");
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
      <Button
        variant="secondary"
        onClick={() => {
          setQuizQuestions([]);
          setQuizTitle("");
          setQuizDescription("");
        }}
      >
        Cancel
      </Button>

      <Button onClick={handleSaveQuiz}>Save AI Quiz</Button>
    </div>
  </>
)}
    </div>
  );
}

export default Study;