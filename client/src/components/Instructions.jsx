import "../styles/Instructions.scss";

export const Instructions = () => {
  return (
    <div>
      <h2>Instructions</h2>
      <p>
        This is an AI tool that allows you to practice your spoken English.
        It'll transcribe your speech and provide you with clear and actionable
        feedback on your pronunciation and fluency - helping you improve your
        English.
      </p>
      <h4>Here's how to use it:</h4>
      <p>
        Click on the "Start Recording" button to record your speech (or word).
        Once you're done, click the "Stop Recording button to send your speech
        (or word) over for analysis.
      </p>
      <p>
        Once, we're done analysing it, we'll send you detailed feedback that'll
        help you improve your pronunciations.{" "}
        <b>
          Please note that the longer your audio, the longer the analysis will
          be.
        </b>
      </p>
    </div>
  );
};
