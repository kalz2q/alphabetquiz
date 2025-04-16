"use client";

import { useState, useEffect, useCallback } from "react";

// / アラビア文字の基本28文字（ハムザを含む場合は29文字）
export const getRandomAlphabet = (): string => {
  const arabicLetters = [
    "ا",
    "ب",
    "ت",
    "ث",
    "ج",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ك",
    "ل",
    "م",
    "ن",
    "ه",
    "و",
    "ي",
  ];
  const randomIndex = Math.floor(Math.random() * arabicLetters.length);
  return arabicLetters[randomIndex];
};

const AlphabetQuiz = () => {
  const [currentLetter, setCurrentLetter] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [playBeep, setPlayBeep] = useState<boolean>(false);

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
      // const audioContext = new (window.AudioContext ||
      //   (window as any).webkitAudioContext)();
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

  const handleNextLetter = useCallback(() => {
    setRandomLetter();
  }, [setRandomLetter]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!currentLetter) return;

      const pressedKey = e.key.toUpperCase();
      if (pressedKey === currentLetter) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
        setPlayBeep(true);
      }
    },
    [currentLetter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-9xl font-bold my-8 h-32 flex items-center justify-center">
        {currentLetter}
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
