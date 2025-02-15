# Pronunciation Feedback Tool Documentation

## Table of Contents
- [Overview](https://github.com/PrinceOfAlfred/pronunciation-feedback-tool/new/main?filename=README.md#overview)
- [Technical Architecture](https://github.com/PrinceOfAlfred/pronunciation-feedback-tool/new/main?filename=README.md#technical-architecture)
- [Challenges & Solutions](https://github.com/PrinceOfAlfred/pronunciation-feedback-tool/new/main?filename=README.md#challenges--solutions)
- [User Experience](https://github.com/PrinceOfAlfred/pronunciation-feedback-tool/new/main?filename=README.md#user-experience)
- [Setup & Deployment](https://github.com/PrinceOfAlfred/pronunciation-feedback-tool/new/main?filename=README.md#setup--deployment)


### Overview
The Pronunciation Feedback Tool is a web application that allows users to practice their spoken English by recording an audio of their speech or word, which will transcribe it and provide feedback on pronunciation. 
The tool offers clear and actionable feedback that helps users improve their spoken English, offering the following features:

- Real-time speech analysis
- AI-powered feedback
- Phoneme-level analysis of the speech/word

> Experience the web application [here](https://pronunciation-feedback-tool.vercel.app)


---
### Technical Architecture
#### LLM Integration
- Model: GPT-4o
- Purpose: Phoneme anlysis and pronunciation feedback generation

```
const SYSTEM_PROMPT = ` You are an expert in providing pronunciation and fluency feedback to people learning English.
  You will be given a transcript and pronunciation scores for each word, syllable, and phoneme in an English speech. The goal is to provide feedback on the pronunciation and fluency of the speaker's text or speech.
  The feedback should identify errors and provide guidance for improvement (e.g., "Try pronouncing 'schedule' as 'sked-jool'").
  The feedback should be clear and actionable, helping users improve their spoken English.
  Here is the transcript and pronunciation scores for the speech:

  The "word_score_list" node contains pronunciation scores and metrics for each word, syllable, and phoneme within the utterance - use that to provide feedback on pronunciation.
  The "speechace_score" node contains an overall score on a scale of 0 to 100, in addition to subscores for: Fluency, Pronunciation, Grammar, Vocabulary, Coherence.
  The "transcript" node contains the speech-to-text transcript of what the user has said.

  Use the above information to provide detailed feedback on the speaker's pronunciation and fluency. 
  Format your response in the following JSON format: { "feedback": "..." }
`;
```


#### Scoring System
The application implements a scoring system using a combination of the OpenAI and Speechace APIs:
| **Component** | **Description** | **Implementation** |
| -------------  | -------------  | -------------------|
| Fluency & Coherence | Speech flow, logical connection	 | Speechace API timing analysis
| Pronunciation | Phoneme-level accuracy	| Speechace API analysis
| Overall | Speechace band score	| Weighted combination


#### API Integration
1. **Speechace API v9**: Primary speech analysis and transcription.
2. **OpenAI API**: Secondary pronunciation analysys and feedback generation.

```
const API_CONFIG = {
  speechace: {
    version: 'v9',
    baseURL: 'https://api.speechace.co/api/scoring/speech/v9/json',
    timeout: 30000
  },
  openai: {
    model: 'gpt-4o',
    temperature: 0.7
  }
};
```
---

### Challenges & Solutions
#### 1. Performance Optimisation
- **Challenge**: Long processing times for speech analysis.
- **Solution**: Implemented compression and caching in the backend.

#### 2. API Reliability
- **Challenge**: Intermittent Speechace API availability.
- **Solution**: Implemented a retry mechanism.

#### 3. Miscellaneous low-level tasks
- **Challenge**: Encountered several tedious tasks that slowed down progress.
- **Solution**: Delegated low-level thinking to an AI Assistant (DeepSeek for reasoning tasks & Claude for code evaluation)

---

### User Experience
#### Loading States
- Visual feedback during analysis
- Progress indicators

#### Error Handling
- User-friendly error messages
- Retry options
- Clear instructions

---

### Setup & Deployment
#### Prerequisites
- Node.js >= 14
- npm >= 6
- [OpenAI API Key](https://platform.openai.com/)
- [Speechace API key](https://www.speechace.com/)

#### Installation
```
# Clone repository
git clone https://github.com/PrinceOfAlfred/pronunciation-feedback-tool.git

# Install client dependencies
cd frontend
npm install

# Install server dependencies
cd backend
npm install
```

#### Environment Variables
```
# in the backend directory
OPENAI_API_KEY=your_openai_key
SPEECHACE_KEY=your_speechace_key
PORT=5000
NODE_ENV=development
```

#### Development
```
# Start frontend
cd frontend
npm run dev

# Start backend
cd backend
npm start
```

---

### Future Improvements
- Parallel API processing
- Enhanced caching strategies
