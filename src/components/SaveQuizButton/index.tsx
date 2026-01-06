import Button from "../Button";

type SaveQuizButtonProps = {
  onSave: () => void;
  disabled?: boolean;
  label?: string;
};

function SaveQuizButton({ onSave, disabled = false, label = "Save AI Quiz" }: SaveQuizButtonProps) {
  return (
    <div className="button-row">
      <Button onClick={onSave} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
}

export default SaveQuizButton;
