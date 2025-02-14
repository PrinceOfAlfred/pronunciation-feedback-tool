import { useState } from "react";
import { Header } from "./components/Header";
import { Instructions } from "./components/Instructions";
import { AudioRecorder } from "./components/AudioRecorder";
import { Results } from "./components/Results";

import "./styles/global.scss";

function App() {
  const [results, setResults] = useState(null);

  const handleAnalysisComplete = (data) => {
    console.log(data);
    setResults(data);
  };

  return (
    <div className="app-container">
      <Header />
      <Instructions />
      <AudioRecorder onAnalysisComplete={handleAnalysisComplete} />
      {results ? <Results results={results} /> : null}
    </div>
  );
}

export default App;
