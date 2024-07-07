console.log("Hello Web Speech API");

const DEFAULT_VOICE = "Google UK English Male";

class SpeechService {
  #defaultConfig = {
    lang: "en-GB",
    volume: 1, // 0 (lowest) and 1 (highest)
    rate: 1, // 0.1 (lowest) and 10 (highest)
    pitch: 1, // 0 (lowest) and 2 (highest)
  };

  #synth = window.speechSynthesis;
  #lang = "en-GB";
  #volume = 1;
  #rate = 1;
  #pitch = 1;
  #voice = undefined;
  #voiceList = [];

  constructor({ lang, volume, rate, pitch, voiceName } = {}) {
    this.#lang = lang ?? this.#defaultConfig.lang;
    this.#volume = volume ?? this.#defaultConfig.volume;
    this.#rate = rate ?? this.#defaultConfig.rate;
    this.#pitch = pitch ?? this.#defaultConfig.pitch;

    this.#synth.onvoiceschanged = () => {
      this.#setVoice(voiceName);
    };
  }

  get voice() {
    return this.#voice;
  }

  set voice(name) {
    this.#setVoice(name);
  }

  speak = (text, onEnd) => {
    if (!text) {
      return;
    }
    console.log("speak: ", text);

    this.#synth.cancel();

    const chunks = this.#splitText(text);

    chunks.forEach((chunk, index, arr) => {
      const utterance = this.#createUtterance(chunk);
      utterance.onerror = (event) => {
        console.error(event);
        onEnd && onEnd();
      };

      if (index === arr.length - 1) {
        utterance.onend = onEnd ?? null;
      }

      this.#synth.speak(utterance);
    });
  };

  cancel = () => {
    this.#synth.cancel();
  };

  getVoices = () => {
    return [...this.#voiceList];
  };

  #setVoice = (voiceName) => {
    this.#voiceList = this.#synth.getVoices();

    if (!voiceName) {
      return;
    }

    this.#voice = this.#voiceList.find(
      ({ name, voiceURI }) => name === voiceName || voiceURI === voiceName
    );
  };

  #createUtterance = (text) => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.lang = this.#lang;
    utterance.rate = this.#rate;
    utterance.volume = this.#volume;
    utterance.pitch = this.#pitch;
    utterance.voice = this.#voice;

    return utterance;
  };

  #splitText = (text) => {
    // TODO: enhance splitting text
    const sentences =
      text.match(/[^.!?]+[.!?]/g)?.map((sentence) => sentence.trim()) ?? [];

    return sentences;
  };
}

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
