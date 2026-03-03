import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { mapQuiz } from "../../contexts/AuthContextProvider";
import type { NewQuiz, QuizQuestion } from "../../types";
import { generateQuizFromNotes } from "../../services/quizGenerator";
import StudyNotesInput from "../../components/StudyNotesInput";
import QuizDetailsForm from "../../components/QuizDetailsForm";
import QuizQuestionsDisplay from "../../components/QuizQuestionsDisplay";
import SaveQuizButton from "../../components/SaveQuizButton";
import "./Study.css";

function Study() {
  const [studyNote, setStudyNote] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate"); // Default to intermediate
  const [numQuestions, setNumQuestions] = useState(5); // Default to 5

  const auth = useAuth();
  const navigate = useNavigate();

  const handleGenerateQuiz = async (notes: string) => {
    setLoading(true);
    setStudyNote(notes); // Update studyNote state here
    setQuizQuestions([]);

    if (!auth.token) {
      toast.error("You must be logged in to generate quizzes.");
      setLoading(false);
      return;
    }

    const result = await generateQuizFromNotes(notes, topic, difficulty, numQuestions, auth.token);

    if (result.error) {
      toast.error(result.error);
    } else if (result.quiz) {
      const mapped = mapQuiz({
        ...result.quiz,
        topic: topic || "General",
        difficulty: difficulty || "intermediate",
      });
      setQuizQuestions(mapped.questions);
      setQuizTitle(mapped.title);
      setQuizDescription(mapped.description);
      
      toast.success(`Generated ${mapped.questions.length} questions!`);
    }

    setLoading(false);
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) return toast.error("Please enter a quiz title");
    if (quizQuestions.length === 0) return toast.error("No questions to save");

    const quizData: NewQuiz & { topic?: string; difficulty?: string } = {
      title: quizTitle,
      description: quizDescription,
      topic: topic || "General",
      difficulty: difficulty,
      questions: quizQuestions,
    };

    auth.addCreatedQuiz(quizData);

    setStudyNote("");
    setQuizQuestions([]);
    setQuizTitle("");
    setQuizDescription("");
    setTopic(""); // Clear topic
    setNumQuestions(5); // Reset numQuestions
    setDifficulty("intermediate"); // Reset difficulty

    navigate("/my-quizzes");
  };

  return (
    <div className="study-container fade-in">
      <h1 className="study-title">Study with AI 🤖</h1>

      <StudyNotesInput 
        onGenerate={(notes) => handleGenerateQuiz(notes)}
        loading={loading}
        initialNotes={studyNote}
      />

      <div className="quiz-generation-options">
        <label className="form-label">Topic</label>
        <input
          className="study-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., JavaScript Fundamentals"
        />

        <label className="form-label">Difficulty</label>
        <select
          className="study-input"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label className="form-label">Number of Questions</label>
        <input
          type="number"
          className="study-input"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          min="1"
          max="10"
        />
      </div>

      {quizQuestions.length > 0 && (
        <>
          <QuizDetailsForm 
            title={quizTitle}
            description={quizDescription}
            onTitleChange={setQuizTitle}
            onDescriptionChange={setQuizDescription}
          />

          <QuizQuestionsDisplay questions={quizQuestions} />

          <SaveQuizButton 
            onSave={handleSaveQuiz}
            disabled={!quizTitle.trim() || quizQuestions.length === 0}
          />
        </>
      )}
    </div>
  );
}

export default Study;
