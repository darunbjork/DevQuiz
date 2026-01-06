import Card from "../Card";
import Button from "../Button";

const QuizNotFound = () => (
  <div className="takequiz-container">
    <Card>
      <p style={{ textAlign: "center", padding: "32px 0", fontSize: "18px" }}>
        Quiz not found
      </p>
      <div style={{ textAlign: "center" }}>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    </Card>
  </div>
);

export default QuizNotFound;
