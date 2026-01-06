import Card from "../Card";

type QuizDetailsFormProps = {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
};

function QuizDetailsForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange
}: QuizDetailsFormProps) {
  return (
    <Card title="Quiz Details">
      <div className="form-group">
        <label className="form-label">Quiz Title</label>
        <input
          className="study-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a title for your quiz"
        />

        <label className="form-label">Description</label>
        <textarea
          className="study-textarea"
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter a description (optional)"
        />
      </div>
    </Card>
  );
}

export default QuizDetailsForm;
