import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
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

  const auth = useAuth();
  const navigate = useNavigate();

  const handleGenerateQuiz = async (notes: string) => {
    setLoading(true);
    setStudyNote(notes); // Update studyNote state here
    setQuizQuestions([]);

    const result = await generateQuizFromNotes(notes);

    if (result.error) {
      toast.error(result.error);
    } else if (result.questions.length > 0) {
      setQuizQuestions(result.questions);
      
      const firstWords = notes.split(" ").slice(0, 5).join(" ");
      setQuizTitle(`AI Quiz: ${firstWords}...`);
      setQuizDescription(`AI-generated quiz based on: ${firstWords}...`);
      
      toast.success(`Generated ${result.questions.length} questions!`);
    }

    setLoading(false);
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) return toast.error("Please enter a quiz title");
    if (quizQuestions.length === 0) return toast.error("No questions to save");

    const quizData: NewQuiz = {
      title: quizTitle,
      description: quizDescription,
      questions: quizQuestions.map((q) => ({
        id: q.id,
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

      <StudyNotesInput 
        onGenerate={handleGenerateQuiz}
        loading={loading}
        initialNotes={studyNote}
      />

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
