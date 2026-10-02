import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShapeId, QuizQuestion } from '../../types';
import { SHAPES_CHALLENGE_QUESTIONS } from '../../data/shapesData';
import { CuteCharacterSvg } from '../CuteCharacterSvg';
import { soundManager } from '../../services/soundEffects';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, Lightbulb, Trophy } from 'lucide-react';

interface QuizViewProps {
  onQuizComplete: (score: number, total: number) => void;
  onBackToHub: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  onQuizComplete,
  onBackToHub
}) => {
  const questions: QuizQuestion[] = SHAPES_CHALLENGE_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    soundManager.playOptionSelect();
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      soundManager.playCorrect();

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 }
      });
    } else {
      soundManager.playWrong();
      setShowHint(true);
    }
  };

  const handleToggleHint = () => {
    if (!showHint) {
      soundManager.playHint();
    } else {
      soundManager.playClick();
    }
    setShowHint((prev) => !prev);
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Quiz finished!
      onQuizComplete(score, questions.length);
    }
  };

  const handleRetryQuestion = () => {
    soundManager.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  // Cycle through the 5 shape characters
  const displayShapeId: ShapeId = ['cube', 'cuboid', 'cylinder', 'cone', 'pyramid'][currentIndex % 5] as ShapeId;

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-80px)] px-4 py-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToHub();
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs md:text-sm rounded-2xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <span>← Choose A Shape</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs md:text-sm font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
            Score: {score}
          </span>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onBackToHub();
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs md:text-sm rounded-2xl transition-colors cursor-pointer"
        >
          <Home size={16} />
          <span>Shape Hub</span>
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-1">
          <Trophy size={14} className="text-amber-600" />
          <span>3D Shapes Master Challenge</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold font-['Fredoka'] text-slate-800 tracking-tight">
          3D SHAPES QUIZ!
        </h1>
      </div>

      {/* Main Quiz Card */}
      <div className="w-full bg-white rounded-3xl p-6 md:p-8 border-3 border-amber-300 shadow-xl mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Question Text & Options */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-extrabold font-['Fredoka'] text-slate-800 mb-6 leading-snug">
              {currentQ.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                let btnStyle = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-400';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-100 border-rose-500 text-rose-900';
                  } else {
                    btnStyle = 'opacity-50 bg-slate-50 border-slate-200 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-base md:text-lg font-bold font-['Fredoka'] transition-all flex items-center justify-between ${btnStyle} ${
                      !isAnswered ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-extrabold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </div>

                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && !isCorrect && (
                      <XCircle size={24} className="text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint Trigger & Box */}
            <div className="mt-4">
              {!showHint && !isCorrect && (
                <button
                  onClick={handleToggleHint}
                  className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                >
                  <Lightbulb size={16} className="text-amber-600" />
                  <span>Need a hint? Click me!</span>
                </button>
              )}

              {showHint && !isCorrect && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start justify-between gap-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <Lightbulb size={20} className="text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <div className="text-xs font-bold text-amber-800 uppercase">Friendly Hint:</div>
                      <div className="text-sm font-medium text-amber-950 mt-0.5">{currentQ.hint}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleHint}
                    className="text-xs font-bold text-amber-600 hover:text-amber-800 px-2 py-1 rounded-lg hover:bg-amber-100 cursor-pointer"
                  >
                    Hide
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Responsive Character Reaction & Speech */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            {/* Feedback Speech Bubble */}
            <div
              className={`w-full p-4 rounded-2xl border-2 mb-3 shadow-md ${
                !isAnswered
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : isCorrect
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900 animate-bounce'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <h3 className="text-lg md:text-xl font-extrabold font-['Fredoka']">
                {!isAnswered
                  ? '“Can you solve this?”'
                  : isCorrect
                  ? '“🎉 GREAT JOB!”'
                  : '“Almost! Try again!”'}
              </h3>
              {isAnswered && (
                <p className="text-xs md:text-sm font-medium mt-1 leading-snug">
                  {currentQ.explanation}
                </p>
              )}
            </div>

            {/* Shape Mascot Visual */}
            <div className="py-2">
              <CuteCharacterSvg
                shapeId={displayShapeId}
                size={180}
                expression={
                  !isAnswered ? 'happy' : isCorrect ? 'cheering' : 'talking'
                }
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar inside Card */}
        {isAnswered && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {!isCorrect && (
              <button
                onClick={handleRetryQuestion}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Fredoka'] font-bold rounded-2xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw size={18} />
                <span>Try Again</span>
              </button>
            )}

            <button
              onClick={handleNextQuestion}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Fredoka'] font-bold text-lg rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz!'}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
