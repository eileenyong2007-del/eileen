import React, { useState } from 'react';
import { CuteCharacterSvg } from '../CuteCharacterSvg';
import { soundManager } from '../../services/soundEffects';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface WelcomeViewProps {
  onStart: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  const characters = [
    {
      id: 'cube' as const,
      name: 'Cube',
      color: 'text-blue-600',
      bgTag: 'bg-blue-100 text-blue-800',
      exp: 'waving' as const,
      animClass: 'animate-bounce-gentle',
      greeting: "I'm Cube! Let's fold!"
    },
    {
      id: 'cuboid' as const,
      name: 'Cuboid',
      color: 'text-emerald-600',
      bgTag: 'bg-emerald-100 text-emerald-800',
      exp: 'happy' as const,
      animClass: 'animate-float-sway',
      greeting: "I'm Cuboid! Look at my faces!"
    },
    {
      id: 'cylinder' as const,
      name: 'Cylinder',
      color: 'text-pink-600',
      bgTag: 'bg-pink-100 text-pink-800',
      exp: 'cheering' as const,
      animClass: 'animate-wobble-happy',
      greeting: "I roll smoothly!"
    },
    {
      id: 'cone' as const,
      name: 'Cone',
      color: 'text-amber-600',
      bgTag: 'bg-amber-100 text-amber-800',
      exp: 'waving' as const,
      animClass: 'animate-spring-jump',
      greeting: "I have 1 sharp apex vertex!"
    },
    {
      id: 'pyramid' as const,
      name: 'Pyramid',
      color: 'text-purple-600',
      bgTag: 'bg-purple-100 text-purple-800',
      exp: 'dancing' as const,
      animClass: 'animate-dance-sway',
      greeting: "Check out my triangles!"
    },
  ];

  const handleStartClick = () => {
    soundManager.initContext();
    soundManager.playCorrect();
    soundManager.playSparkle();
    soundManager.startBackgroundMusic();
    onStart();
  };

  const handleCharClick = (char: typeof characters[0]) => {
    soundManager.playShapeSelect(char.id);
    setActiveSpeech(char.greeting);
    setTimeout(() => {
      setActiveSpeech((cur) => (cur === char.greeting ? null : cur));
    }, 2400);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 max-w-5xl mx-auto text-center">
      {/* Decorative Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-amber-100 border border-amber-300 rounded-full text-amber-800 text-xs md:text-sm font-bold shadow-xs">
        <Sparkles size={16} className="text-amber-500 animate-spin" />
        <span>Welcome Primary Explorers!</span>
        <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
      </div>

      {/* Main Title */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-['Fredoka',sans-serif] text-slate-800 tracking-tight mb-3">
        3D SHAPES ADVENTURE!
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-2xl font-bold text-amber-700 font-['Quicksand'] mb-6 max-w-2xl">
        Meet, explore and play with 3D shapes! Tap any shape to hear them say hello!
      </p>

      {/* Speech prompt bubble if clicked */}
      <div className="min-h-[2.5rem] mb-2 flex items-center justify-center">
        {activeSpeech ? (
          <div className="px-5 py-2 bg-amber-500 text-white font-['Fredoka'] text-base md:text-lg rounded-2xl shadow-md animate-bounce">
            💬 {activeSpeech}
          </div>
        ) : (
          <span className="text-xs md:text-sm text-slate-500 font-semibold bg-white/70 px-4 py-1 rounded-full border border-slate-200">
            ✨ All 5 shapes are dancing! Click us to say hi!
          </span>
        )}
      </div>

      {/* All Five Cute Shape Characters Stage - ALL MOVING & CRYSTAL CLEAR */}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-3 border-amber-300 shadow-2xl mb-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/60 via-orange-50/40 to-blue-50/60 pointer-events-none" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 items-stretch justify-items-center relative z-10">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`flex flex-col items-center justify-between bg-white/95 rounded-3xl p-3 sm:p-4 border-2 border-amber-200/90 shadow-md hover:shadow-xl hover:border-amber-400 transition-all cursor-pointer ${char.animClass} hover:scale-105 active:scale-95 w-full`}
              onClick={() => handleCharClick(char)}
              title={`Tap to talk to ${char.name}!`}
            >
              <div className="relative w-full flex items-center justify-center py-1 min-h-[175px]">
                <CuteCharacterSvg
                  shapeId={char.id}
                  size={175}
                  expression={char.exp}
                  className="filter drop-shadow-md"
                />
              </div>
              <span className={`mt-2 font-['Fredoka'] font-extrabold text-2xl md:text-3xl tracking-wide ${char.color}`}>
                {char.name}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full mt-1 ${char.bgTag} shadow-xs`}>
                Tap me!
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Large START ADVENTURE Button */}
      <button
        onClick={handleStartClick}
        className="group relative inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Fredoka'] font-bold text-2xl md:text-3xl rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span>START ADVENTURE!</span>
        <ArrowRight size={32} className="transition-transform group-hover:translate-x-1.5" />
      </button>

      <p className="mt-5 text-xs md:text-sm text-slate-500 font-medium">
        Designed for Primary School Students • Fun & Interactive 3D Shapes Learning
      </p>
    </div>
  );
};

