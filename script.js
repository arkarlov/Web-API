"use strict";

import { SpeechService, DEFAULT_VOICE } from "./scripts/speech.js";

console.log("Hello Web Speech API");

const speech = new SpeechService({ voiceName: DEFAULT_VOICE });
const speechContainer = document.getElementById("speech-container");
const btn = document.getElementById("button");

btn.onclick = () => {
  speech.cancel();
};

const handleSpeechElement = (event) => {
  const { target } = event;
  target.classList.add("focused");

  speech.speak(target.innerText, () => {
    target.classList.remove("focused");
  });
};

Array.from(speechContainer.children).forEach((child) => {
  child.onclick = handleSpeechElement;
});

console.log("Hello SpeechRecognition");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const resultContainer = document.getElementById("speech-container");
let p = null;

const recognition = new SpeechRecognition();
// const speechRecognitionList = new SpeechGrammarList();

recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = true;

recognition.onstart = () => {
  p = document.createElement("p");
  resultContainer.appendChild(p);
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log(`word: ${transcript}`);
  console.log(`Confidence: ${event.results[0][0].confidence}`);

  if (p) {
    p.textContent = `${transcript.replace(/unicorn/gi, "🦄")}.`;
  }

  if (event.results[0].isFinal) {
    console.log("It's a final result");
    Array.from(speechContainer.children).forEach((child) => {
      child.onclick = handleSpeechElement;
    });
  }
};

recognition.onspeechend = () => {
  console.log("Stop recognition");
  recognition.stop();
};

recognition.onnomatch = (event) => {
  console.log("I didn't recognize that.");
};

document.getElementById("button-recognition").onclick = () => {
  console.log("Start recognition");
  recognition.start();
};
