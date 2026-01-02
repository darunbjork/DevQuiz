import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import type { NewQuiz, QuizQuestion } from "../types";
import Card from "../components/Card";
import Button from "../components/Button";
import "./CreateQuiz.css";

function CreateQuiz() {
  const [quizData, setQuizData] = useState<NewQuiz>({
    title: "",
    description: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<
    Omit<QuizQuestion, "id">
  >({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  const auth = useAuth();
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (currentQuestion.options.some((opt) => !opt.trim())) {
      toast.error("Please fill all options");
      return;
    }

    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion, id: Date.now() }],
    }));

    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
  };

  const handleCreateQuiz = () => {
    if (!quizData.title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (!quizData.description.trim()) {
      toast.error("Please enter a quiz description");
      return;
    }

    if (quizData.questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    auth.addCreatedQuiz(quizData);
    toast.success("Quiz created successfully!");
    navigate("/profile");
  };

  return (
    <div className="createquiz-container fade-in">
      <h1 className="createquiz-title">Create New Quiz</h1>

      {/* QUIZ DETAILS */}
      <Card title="Quiz Details">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="input-field"
            value={quizData.title}
            onChange={(e) =>
              setQuizData({ ...quizData, title: e.target.value })
            }
            placeholder="Enter quiz title"
          />

          <label className="form-label">Description</label>
          <textarea
            className="textarea-field"
            rows={3}
            value={quizData.description}
            onChange={(e) =>
              setQuizData({ ...quizData, description: e.target.value })
            }
            placeholder="Enter quiz description"
          />
        </div>
      </Card>

      {/* ADD QUESTION */}
      <Card title="Add Question">
        <div className="form-group">
          <label className="form-label">Question</label>
          <input
            type="text"
            className="input-field"
            value={currentQuestion.question}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                question: e.target.value,
              })
            }
            placeholder="Enter question"
          />

          <label className="form-label">Options</label>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                type="text"
                className="input-field"
                value={option}
                onChange={(e) => {
                  const newOptions = [...currentQuestion.options];
                  newOptions[index] = e.target.value;
                  setCurrentQuestion({
                    ...currentQuestion,
                    options: newOptions,
                  });
                }}
                placeholder={`Option ${index + 1}`}
              />

              <input
                type="radio"
                className="option-radio"
                name="correctAnswer"
                checked={currentQuestion.correctAnswer === index}
                onChange={() =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    correctAnswer: index,
                  })
                }
              />
            </div>
          ))}

          <Button onClick={handleAddQuestion}>Add Question</Button>
        </div>
      </Card>

      {/* PREVIEW */}
      <Card title="Questions Preview">
        {quizData.questions.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
            No questions added yet
          </p>
        ) : (
          <ul className="preview-list">
            {quizData.questions.map((q, index) => (
              <li key={index} className="preview-item">
                <p className="preview-question">
                  {index + 1}. {q.question}
                </p>

                <ul>
                  {q.options.map((opt, optIndex) => (
                    <li
                      key={optIndex}
                      className={
                        optIndex === q.correctAnswer
                          ? "preview-option correct"
                          : "preview-option"
                      }
                    >
                      {optIndex + 1}. {opt}{" "}
                      {optIndex === q.correctAnswer && "✓"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* BUTTONS */}
      <div className="createquiz-buttons">
        <Button variant="secondary" onClick={() => navigate("/profile")}>
          Cancel
        </Button>

        <Button
          onClick={handleCreateQuiz}
          disabled={quizData.questions.length === 0}
        >
          Create Quiz ({quizData.questions.length} questions)
        </Button>
      </div>
    </div>
  );
}

export default CreateQuiz;