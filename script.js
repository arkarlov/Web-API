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
