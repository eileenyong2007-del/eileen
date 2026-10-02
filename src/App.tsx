import React, { useState } from 'react';
import { AppView, ShapeId } from './types';
import { Navbar } from './components/Navbar';
import { WelcomeView } from './components/views/WelcomeView';
import { ReadyView } from './components/views/ReadyView';
import { ShapeHubView } from './components/views/ShapeHubView';
import { CharacterIntroView } from './components/views/CharacterIntroView';
import { QuizView } from './components/views/QuizView';
import { CelebrationView } from './components/views/CelebrationView';
import { soundManager } from './services/soundEffects';

import { songEngine } from './services/songEngine';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [selectedShapeId, setSelectedShapeId] = useState<ShapeId | null>('cube');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizTotal, setQuizTotal] = useState<number>(0);

  // Stop active sounds on view navigation
  const stopAllAudio = () => {
    soundManager.stopSpeaking();
    songEngine.stopSong();
    songEngine.stopCharacteristics();
  };

  // Navigation handlers
  const handleStartAdventure = () => {
    stopAllAudio();
    setCurrentView('ready');
  };

  const handleLetsGo = () => {
    stopAllAudio();
    setCurrentView('hub');
  };

  const handleSelectShape = (shapeId: ShapeId) => {
    stopAllAudio();
    setSelectedShapeId(shapeId);
    setCurrentView('intro');
  };

  const handleTakeQuiz = () => {
    stopAllAudio();
    setSelectedShapeId(null);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (score: number, total: number) => {
    stopAllAudio();
    setQuizScore(score);
    setQuizTotal(total);
    setCurrentView('celebration');
  };

  const handleBackToHub = () => {
    stopAllAudio();
    setCurrentView('hub');
  };

  const handleGoToHome = () => {
    stopAllAudio();
    setCurrentView('welcome');
  };

  const handlePlayAgain = () => {
    stopAllAudio();
    setCurrentView('quiz');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-amber-50/50 to-orange-50/40 text-slate-800">
      {/* Top App Navigation */}
      <Navbar
        currentView={currentView}
        selectedShapeId={selectedShapeId}
        onNavigateHub={handleBackToHub}
        onNavigateHome={handleGoToHome}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full relative">
        {currentView === 'welcome' && (
          <WelcomeView onStart={handleStartAdventure} />
        )}

        {currentView === 'ready' && (
          <ReadyView onLetsGo={handleLetsGo} />
        )}

        {currentView === 'hub' && (
          <ShapeHubView
            onSelectShape={handleSelectShape}
            onChallengeAll={handleTakeQuiz}
          />
        )}

        {currentView === 'intro' && selectedShapeId && (
          <CharacterIntroView
            shapeId={selectedShapeId}
            onSelectShape={handleSelectShape}
            onTakeQuiz={handleTakeQuiz}
            onBackToHub={handleBackToHub}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            onQuizComplete={handleQuizComplete}
            onBackToHub={handleBackToHub}
          />
        )}

        {currentView === 'celebration' && (
          <CelebrationView
            score={quizScore}
            totalQuestions={quizTotal}
            onPlayAgain={handlePlayAgain}
            onChooseAnotherShape={handleBackToHub}
            onGoToHub={handleBackToHub}
          />
        )}
      </main>
    </div>
  );
}
