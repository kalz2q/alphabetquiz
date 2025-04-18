"use client";

import { useState, useEffect, useCallback } from "react";

// アラビア文字と音声ファイルのマッピング
const arabicLetters = [
  { char: "ا", audio: "alif.mp3" },
  { char: "ب", audio: "baa.mp3" },
  { char: "ت", audio: "taa.mp3" },
  { char: "ث", audio: "thaa.mp3" },
  { char: "ج", audio: "jiim.mp3" },
  { char: "ح", audio: "h_aa.mp3" },
  { char: "خ", audio: "khaa.mp3" },
  { char: "د", audio: "dal.mp3" },
  { char: "ذ", audio: "dhal.mp3" },
  { char: "ر", audio: "raa.mp3" },
  { char: "ز", audio: "zay.mp3" },
  { char: "س", audio: "siin.mp3" },
  { char: "ش", audio: "shiin.mp3" },
  { char: "ص", audio: "s_aad.mp3" },
  { char: "ض", audio: "d_aad.mp3" },
  { char: "ط", audio: "t_aa.mp3" },
  { char: "ظ", audio: "d_haa.mp3" },
  { char: "ع", audio: "ain.mp3" },
  { char: "غ", audio: "ghain.mp3" },
  { char: "ف", audio: "faa.mp3" },
  { char: "ق", audio: "qaaf.mp3" },
  { char: "ك", audio: "kaaf.mp3" },
  { char: "ل", audio: "laam.mp3" },
  { char: "م", audio: "miim.mp3" },
  { char: "ن", audio: "nun.mp3" },
  { char: "ه", audio: "haa.mp3" },
  { char: "و", audio: "waaw.mp3" },
  { char: "ي", audio: "yaa.mp3" },
];

const getRandomAlphabet = (): { char: string; audio: string } => {
  const randomIndex = Math.floor(Math.random() * arabicLetters.length);
  return arabicLetters[randomIndex];
};

const AlphabetQuiz = () => {
  const [currentLetter, setCurrentLetter] = useState<{
    char: string;
    audio: string;
  }>({ char: "", audio: "" });
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [playBeep, setPlayBeep] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const setRandomLetter = useCallback(() => {
    setCurrentLetter(getRandomAlphabet());
    setIsCorrect(null);
  }, []);

  // 初期問題出題
  useEffect(() => {
    setRandomLetter();
  }, [setRandomLetter]);

  // ビープ音再生
  useEffect(() => {
    if (playBeep) {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        setPlayBeep(false);
      }, 300);
    }
  }, [playBeep]);

  // 音声再生
  const playLetterSound = useCallback(() => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(`/${currentLetter.audio}`);
    newAudio.play();
    setAudio(newAudio);
  }, [currentLetter.audio, audio]);

  const handleNextLetter = useCallback(() => {
    setRandomLetter();
  }, [setRandomLetter]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!currentLetter.char) return;

      const pressedKey = e.key.toUpperCase();
      if (pressedKey === currentLetter.char) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
        setPlayBeep(true);
      }
    },
    [currentLetter.char]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (audio) {
        audio.pause();
      }
    };
  }, [handleKeyDown, audio]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="text-9xl font-bold my-8 h-32 flex items-center justify-center cursor-pointer hover:text-blue-500 transition-colors"
        onClick={playLetterSound}
      >
        {currentLetter.char}
      </div>

      {isCorrect !== null && (
        <div
          className={`text-2xl font-bold ${
            isCorrect ? "text-green-500" : "text-red-500"
          }`}
        >
          {isCorrect ? "正解！" : "不正解"}
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleNextLetter}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          次の問題
        </button>
      </div>

      <div className="mt-8 text-gray-600">
        キーボードでアルファベットを入力してください
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">アルファベットクイズ</h1>
      <AlphabetQuiz />
    </main>
  );
}
