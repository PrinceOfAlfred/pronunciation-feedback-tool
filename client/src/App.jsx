import { Header } from "./components/Header";
import { Instructions } from "./components/Instructions";
import { AudioRecorder } from "./components/AudioRecorder";
import { Results } from "./components/Results";

function App() {
  return (
    <div>
      <Header />
      <Instructions />
      <AudioRecorder />
      <Results />
    </div>
  );
}

export default App;
