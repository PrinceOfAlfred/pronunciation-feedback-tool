import "../styles/Results.scss";

export const Results = ({ results }) => {
  const { transcript, speechace_score, feedback } = results;

  return (
    <div className="results-container">
      <h3>Scores</h3>
      <div className="scores">
        <div className="score-item">
          <span className="score-label">Pronunciation:</span>
          <span className="score-value">
            {speechace_score.pronunciation}/100
          </span>
        </div>
        <div className="score-item">
          <span className="score-label">Fluency:</span>
          <span className="score-value">{speechace_score.fluency}/100</span>
        </div>
        <div className="score-item">
          <span className="score-label">Overall:</span>
          <span className="score-value">{speechace_score.overall}/100</span>
        </div>
      </div>

      <h3>Transcript: </h3>
      <div className="feedback">
        <p>{transcript}</p>
      </div>

      <h3>Feedback:</h3>
      <div className="feedback">
        {feedback.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
};
