import express from "express";
import cors from "cors";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import { OpenAI } from "openai";
import dotenv from "dotenv";

// Variables setup
dotenv.config();
const app = express();
const upload = multer();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const port = process.env.PORT || 5000;
const speechaceURL = `https://api.speechace.co/api/scoring/speech/v9/json?key=${process.env.SPEECHACE_KEY}&dialect=en-us`;

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

const allowedOrigins = [
  "https://pronunciation-feedback-tool.vercel.app",
  "http://localhost:5173", // for local development
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

// Add detailed error logging
const handleSpeechaceError = (error) => {
  if (error.response) {
    console.error("Speechace API Error Response:", {
      status: error.response.status,
      data: error.response.data,
    });
    return `Speechace API Error: ${
      error.response.data.message || "Unknown error"
    }`;
  } else if (error.request) {
    console.error("No response from Speechace API:", error.request);
    return "No response from speech analysis service";
  } else {
    console.error("Error setting up request:", error.message);
    return error.message;
  }
};

app.post(
  "/api/analyse-pronunciation",
  upload.single("user_audio_file"),
  async (req, res) => {
    try {
      if (!req.file) {
        throw new Error("No audio file provided");
      }

      // 1. First get Speechace analysis
      const form = new FormData();
      form.append("user_audio_file", req.file.buffer);
      const config = {
        headers: {
          ...form.getHeaders(),
          Accept: "application/json",
          connection: "keep-alive",
        },
        // timeout: 30000, // 30 seconds
      };

      const speechaceResponse = await axios.post(speechaceURL, form, config);
      if (speechaceResponse.data.status !== "success") {
        console.log(
          "Error requesting from Speechace: ",
          speechaceResponse.data
        );
        throw new Error(
          `Speechace analysis failed: ${JSON.stringify(speechaceResponse.data)}`
        );
      }

      // Extract relevant data from Speechace response
      const { transcript, word_score_list, speechace_score } =
        speechaceResponse.data.speech_score;

      // 2. Then send to OpenAI with the transcript
      const openaiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", // use assistant role when using o1-mini
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: JSON.stringify({
              transcript,
              word_score_list,
              speechace_score,
            }),
          },
        ],
        response_format: { type: "json_object" },
      });

      const feedback = JSON.parse(openaiResponse.choices[0].message.content);

      const result = {
        transcript,
        speechace_score,
        feedback: feedback.feedback,
      };
      res.json(result);
    } catch (error) {
      const errorMessage = handleSpeechaceError(error);
      console.error("Error details:", errorMessage);
      res.status(500).json({
        error: errorMessage,
        details: error,
      });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
