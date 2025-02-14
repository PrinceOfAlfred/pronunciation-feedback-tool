import { useEffect } from "react";
import useAudioRecorder from "../hooks/useAudioRecorder";
import "../styles/AudioRecorder.scss";

export const AudioRecorder = ({ onAnalysisComplete }) => {
  const {
    initializeRecorder,
    startRecording,
    stopRecording,
    analyseSpeech,
    isRecording,
    isAnalysing,
    error,
  } = useAudioRecorder();

  useEffect(() => {
    initializeRecorder();
  }, []);

  const handleRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        const results = await analyseSpeech(audioBlob);
        onAnalysisComplete(results);
      }
    } else {
      startRecording();
    }
  };

  return (
    <div className="speech-recorder">
      <button
        onClick={handleRecording}
        disabled={isAnalysing}
        className={`record-button ${isRecording ? "recording" : ""}`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
        {isAnalysing && " (Analyzing...)"}
      </button>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
