import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CuteCharacterSvg } from '../CuteCharacterSvg';
import { soundManager } from '../../services/soundEffects';
import { Trophy, Award, RotateCcw, Home, Sparkles, ArrowRight } from 'lucide-react';

interface CelebrationViewProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onChooseAnotherShape: () => void;
  onGoToHub: () => void;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  score,
  totalQuestions,
  onPlayAgain,
  onChooseAnotherShape,
  onGoToHub
}) => {
  useEffect(() => {
    soundManager.playCelebration();

    // Continuous fireworks / confetti burst
    const end = Date.now() + 2500;
    const colors = ['#3B82F6', '#10B981', '#EC4899', '#F59E0B', '#8B5CF6'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [score, totalQuestions]);

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 max-w-5xl mx-auto text-center">
      {/* Trophy Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 mb-4 bg-amber-100 border-2 border-amber-300 rounded-full text-amber-900 text-sm md:text-base font-extrabold shadow-sm">
        <Trophy size={20} className="text-amber-600 animate-bounce" />
        <span>Adventure Completed!</span>
      </div>

      {/* Main Title */}
      <h1 className="text-5xl md:text-7xl font-extrabold font-['Fredoka'] text-slate-800 tracking-tight mb-2">
        YOU DID IT!
      </h1>

      {/* Explorer Honor */}
      <p className="text-2xl md:text-3xl font-extrabold text-amber-600 font-['Fredoka'] mb-4 flex items-center justify-center gap-2">
        <Sparkles size={28} className="text-amber-500" />
        <span>You are now a 3D Shapes Explorer!</span>
        <Sparkles size={28} className="text-amber-500" />
      </p>

      {/* Score Certificate Card */}
      <div className="w-full max-w-xl bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Award size={48} className="text-amber-500" />
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Explorer Score
            </span>
            <div className="text-4xl md:text-5xl font-extrabold font-['Fredoka'] text-slate-800">
              {score} / {totalQuestions}
            </div>
          </div>
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 font-extrabold font-['Fredoka'] text-2xl rounded-2xl">
            {percentage}%
          </div>
        </div>

        <p className="text-sm md:text-base text-slate-600 font-medium mt-3">
          {percentage >= 80
            ? '🌟 Outstanding! You have mastered 3D shapes, faces, edges, and vertices!'
            : '👍 Super effort! You learned so much about 3D shapes! Keep exploring!'}
        </p>
      </div>

      {/* Five Cheering Characters Dancing on Stage */}
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm p-6 rounded-3xl border-2 border-amber-200/90 shadow-xl mb-10">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3">
          All your 3D shape friends are cheering for you!
        </div>
        <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-items-center">
          <div className="flex flex-col items-center">
            <CuteCharacterSvg shapeId="cube" size={110} expression="cheering" />
            <span className="text-xs font-bold text-blue-600 mt-1">Cube</span>
          </div>
          <div className="flex flex-col items-center">
            <CuteCharacterSvg shapeId="cuboid" size={110} expression="dancing" />
            <span className="text-xs font-bold text-emerald-600 mt-1">Cuboid</span>
          </div>
          <div className="flex flex-col items-center">
            <CuteCharacterSvg shapeId="cylinder" size={110} expression="cheering" />
            <span className="text-xs font-bold text-pink-600 mt-1">Cylinder</span>
          </div>
          <div className="flex flex-col items-center">
            <CuteCharacterSvg shapeId="cone" size={110} expression="dancing" />
            <span className="text-xs font-bold text-amber-600 mt-1">Cone</span>
          </div>
          <div className="flex flex-col items-center">
            <CuteCharacterSvg shapeId="pyramid" size={110} expression="cheering" />
            <span className="text-xs font-bold text-purple-600 mt-1">Pyramid</span>
          </div>
        </div>
      </div>

      {/* Three Required Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl">
        <button
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="flex items-center gap-2 px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-['Fredoka'] font-bold text-lg md:text-xl rounded-2xl transition-all shadow-md hover:-translate-y-0.5"
        >
          <RotateCcw size={20} />
          <span>PLAY AGAIN</span>
        </button>

        <button
          onClick={() => {
            soundManager.playCorrect();
            onChooseAnotherShape();
          }}
          className="flex-1 min-w-[220px] flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Fredoka'] font-bold text-xl md:text-2xl rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-103 active:scale-98"
        >
          <span>CHOOSE ANOTHER SHAPE</span>
          <ArrowRight size={24} />
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoToHub();
          }}
          className="flex items-center gap-2 px-6 py-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-['Fredoka'] font-bold text-lg md:text-xl rounded-2xl transition-all shadow-md hover:-translate-y-0.5"
        >
          <Home size={20} />
          <span>SHAPE HUB</span>
        </button>
      </div>
    </div>
  );
};
