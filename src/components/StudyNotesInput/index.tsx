import { useState } from "react";
import Button from "../Button";
import Card from "../Card";

type StudyNotesInputProps = {
  onGenerate: (notes: string) => void;
  loading: boolean;
  initialNotes?: string;
};

function StudyNotesInput({ onGenerate, loading, initialNotes = "" }: StudyNotesInputProps) {
  const [studyNote, setStudyNote] = useState(initialNotes);

  const handleGenerate = () => {
    onGenerate(studyNote);
  };

  return (
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
        <Button onClick={handleGenerate} disabled={loading || !studyNote.trim()}>
          {loading ? "Generating..." : "Generate Quiz with AI"}
        </Button>
      </div>
    </Card>
  );
}

export default StudyNotesInput;
