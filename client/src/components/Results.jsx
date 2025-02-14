export const Results = ({ results }) => {
  return (
    <div>
      <h2>Results:</h2>
      <p>Transcript: {results?.transcript}</p>
      <p>Pronunciation Score: {results?.speechace_score.pronunciation}</p>
      <p>
        <b>Feedback:</b>
      </p>
      {results?.feedback.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
};
