import React, { useState, useEffect } from 'react';
import { AppView, ShapeId } from '../types';
import { soundManager } from '../services/soundEffects';
import { SHAPES_DATA } from '../data/shapesData';
import { Volume2, VolumeX, Home, Music } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  selectedShapeId: ShapeId | null;
  onNavigateHub: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  selectedShapeId,
  onNavigateHub,
  onNavigateHome
}) => {
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);

  useEffect(() => {
    setIsVoiceOn(soundManager.isVoiceActive());
    setIsMusicOn(soundManager.isMusicActive());

    const unsubscribe = soundManager.addMusicListener((active) => {
      setIsMusicOn(active);
    });
    return unsubscribe;
  }, []);

  const handleToggleVoice = () => {
    soundManager.playClick();
    const active = soundManager.toggleVoice();
    setIsVoiceOn(active);
  };

  const handleToggleMusic = () => {
    soundManager.playClick();
    const active = soundManager.toggleMusic();
    setIsMusicOn(active);
  };

  const selectedShape = selectedShapeId ? SHAPES_DATA[selectedShapeId] : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200/80 shadow-xs px-4 md:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Title */}
        <button
          onClick={() => {
            soundManager.playNavClick();
            onNavigateHome();
          }}
          className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight text-amber-600 font-['Fredoka',sans-serif] group-hover:text-amber-700 transition-colors">
            3D Shapes Adventure
          </span>
        </button>

        {/* Navigation & Status indicator */}
        <div className="flex items-center gap-2">
          {currentView !== 'welcome' && currentView !== 'ready' && currentView !== 'hub' && (
            <button
              onClick={() => {
                soundManager.playNavClick();
                onNavigateHub();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs md:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Home size={16} className="text-amber-700" />
              <span className="hidden sm:inline">Shape Hub</span>
              <span className="sm:hidden">Hub</span>
            </button>
          )}

          {selectedShape && currentView !== 'hub' && currentView !== 'welcome' && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedShape.colorHex }} />
              <span>Exploring: {selectedShape.name}</span>
            </div>
          )}
        </div>

        {/* Audio Toggles (Background Sound + Voice Narration) */}
        <div className="flex items-center gap-2">
          {/* Background Music Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all shadow-xs ${
              isMusicOn
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white animate-pulse'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
            }`}
            title={isMusicOn ? 'Turn Background Sound Off' : 'Turn Background Sound On'}
          >
            <Music size={15} />
            <span className="whitespace-nowrap">{isMusicOn ? 'Sound: ON' : 'Background Sound'}</span>
          </button>

          {/* Voice Narration Sound Toggle */}
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-colors ${
              isVoiceOn
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
            title={isVoiceOn ? 'Speech Voice: ON' : 'Speech Voice: OFF'}
          >
            {isVoiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="hidden sm:inline">{isVoiceOn ? 'Voice' : 'Muted'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
