import React, { useState, useEffect } from 'react';
import { ShapeId, HighlightType } from '../../types';
import { SHAPES_DATA } from '../../data/shapesData';
import { CuteCharacterSvg } from '../CuteCharacterSvg';
import { songEngine, SongProgress, PlayerState, SHAPE_AUDIO_FILES } from '../../services/songEngine';
import { soundManager } from '../../services/soundEffects';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Music,
  ArrowLeft,
  Sparkles,
  Trophy,
  CheckCircle2,
  Layers,
  CircleDot,
  Slash,
  Disc
} from 'lucide-react';

interface CharacterIntroViewProps {
  shapeId: ShapeId;
  onSelectShape?: (id: ShapeId) => void;
  onTakeQuiz: () => void;
  onBackToHub: () => void;
}

export const CharacterIntroView: React.FC<CharacterIntroViewProps> = ({
  shapeId,
  onSelectShape,
  onTakeQuiz,
  onBackToHub
}) => {
  const shape = SHAPES_DATA[shapeId];
  const [highlight, setHighlight] = useState<HighlightType>('all');

  // Characteristics audio player state
  const [charState, setCharState] = useState<PlayerState>('idle');

  // Memory song player state (only plays on clicking 'Sing with Me!')
  const [songProgress, setSongProgress] = useState<SongProgress>({
    currentLine: 0,
    totalLines: shape.memorySong.lines.length,
    elapsedSeconds: 0,
    totalSeconds: 30,
    state: 'idle',
    filename: SHAPE_AUDIO_FILES[shapeId]
  });

  // Stop previous sounds when shape changes or component unmounts (NO auto-play)
  useEffect(() => {
    songEngine.stopSong();
    songEngine.stopCharacteristics();
    setCharState('idle');
    setSongProgress({
      currentLine: 0,
      totalLines: shape.memorySong.lines.length,
      elapsedSeconds: 0,
      totalSeconds: 30,
      state: 'idle',
      filename: SHAPE_AUDIO_FILES[shapeId]
    });
    setHighlight('all');

    return () => {
      songEngine.stopSong();
      songEngine.stopCharacteristics();
    };
  }, [shapeId, shape.memorySong.lines.length]);

  // --- Characteristics Player Handlers ---
  const handlePlayCharacteristics = () => {
    soundManager.playClick();
    songEngine.stopSong();
    setHighlight('all');

    if (charState === 'paused') {
      songEngine.resumeCharacteristics();
    } else {
      songEngine.playCharacteristics(shapeId, (state) => {
        setCharState(state);
      });
    }
  };

  const handlePauseCharacteristics = () => {
    soundManager.playClick();
    songEngine.pauseCharacteristics();
    setCharState('paused');
  };

  const handleReplayCharacteristics = () => {
    soundManager.playClick();
    songEngine.replayCharacteristics(shapeId);
  };

  // --- Memory Song Handlers ---
  const handlePlaySong = () => {
    soundManager.playClick();
    songEngine.stopCharacteristics();
    setCharState('idle');

    if (songProgress.state === 'paused') {
      songEngine.resumeSong();
    } else {
      songEngine.playSong(
        shapeId,
        (progress) => {
          setSongProgress(progress);
        },
        () => {
          setSongProgress((prev) => ({ ...prev, state: 'ended' }));
        }
      );
    }
  };

  const handlePauseSong = () => {
    soundManager.playClick();
    songEngine.pauseSong();
  };

  const handleReplaySong = () => {
    soundManager.playClick();
    songEngine.replaySong(shapeId);
  };

  const handleHighlightSelect = (type: HighlightType) => {
    soundManager.playSparkle();
    setHighlight(type);
  };

  const getBulletIcon = (type: string) => {
    switch (type) {
      case 'faces':
        return <Layers size={22} className="text-blue-500" />;
      case 'vertices':
        return <CircleDot size={22} className="text-amber-500" />;
      case 'edges':
        return <Slash size={22} className="text-emerald-500" />;
      case 'curved':
        return <Disc size={22} className="text-pink-500" />;
      default:
        return <CheckCircle2 size={22} className="text-amber-500" />;
    }
  };

  // Expression for the cute 3D character based on audio state
  const getCharacterExpression = () => {
    if (songProgress.state === 'playing') {
      // Dances and sings when memory song is playing!
      return songProgress.currentLine % 2 === 0 ? 'dancing' : 'talking';
    }
    if (charState === 'playing') {
      return 'talking';
    }
    if (highlight !== 'all' && highlight !== 'none') {
      return 'pointing';
    }
    return 'happy';
  };

  const allShapes: { id: ShapeId; name: string }[] = [
    { id: 'cube', name: 'Cube' },
    { id: 'cuboid', name: 'Cuboid' },
    { id: 'cylinder', name: 'Cylinder' },
    { id: 'cone', name: 'Cone' },
    { id: 'pyramid', name: 'Pyramid' }
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-80px)] px-4 py-5 max-w-6xl mx-auto w-full">
      {/* Top Navigation & Shape Quick Switcher */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={() => {
            soundManager.playNavClick();
            songEngine.stopSong();
            songEngine.stopCharacteristics();
            onBackToHub();
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-['Fredoka'] font-bold text-sm md:text-base rounded-2xl border-2 border-slate-200 shadow-sm transition-all transform hover:-translate-x-1 cursor-pointer"
        >
          <ArrowLeft size={18} className="text-amber-600" />
          <span>← Choose Another Shape</span>
        </button>

        {/* Shape Switcher Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-amber-200 shadow-xs">
          {allShapes.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                soundManager.playNavClick();
                if (onSelectShape) {
                  onSelectShape(s.id);
                } else {
                  onBackToHub();
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-['Fredoka'] text-xs md:text-sm font-bold transition-all cursor-pointer ${
                s.id === shapeId
                  ? 'bg-amber-500 text-white shadow-sm scale-105'
                  : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout: Character Stage (Left) & Learning Content (Right) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        {/* Left Column: 1. Large 3D Shape Character */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl flex flex-col items-center">
            {/* Friendly Greeting Speech Bubble */}
            <div className="relative w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm text-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {shape.name} Says:
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold font-['Fredoka'] text-slate-800 mt-0.5">
                “{shape.greeting}”
              </h2>
              {/* Little triangle arrow under speech bubble */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-50 border-b-2 border-r-2 border-amber-300 rotate-45 transform" />
            </div>

            {/* Cute 3D Shape Character with Friendly Face */}
            <div className="relative py-2 w-full flex items-center justify-center min-h-[260px]">
              <CuteCharacterSvg
                shapeId={shape.id}
                size={270}
                expression={getCharacterExpression()}
                highlight={highlight}
                interactivePoints={true}
                className={`transition-all duration-300 filter drop-shadow-md ${
                  songProgress.state === 'playing' ? 'animate-bounce' : ''
                }`}
              />
            </div>

            {/* Shape Title */}
            <h1 className="text-3xl font-extrabold font-['Fredoka'] text-slate-800 tracking-wide mt-1">
              {shape.name}
            </h1>

            {/* Feature Highlight Selector Buttons */}
            <div className="w-full mt-4 pt-3 border-t border-slate-100 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-2">Tap to highlight features:</span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { type: 'all' as const, label: 'All Parts' },
                  { type: 'faces' as const, label: 'Faces' },
                  { type: 'vertices' as const, label: 'Vertices' },
                  { type: 'edges' as const, label: 'Edges' }
                ].map((btn) => (
                  <button
                    key={btn.type}
                    onClick={() => handleHighlightSelect(btn.type)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      highlight === btn.type
                        ? 'bg-amber-500 text-white shadow-md scale-105'
                        : 'bg-slate-100 hover:bg-amber-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-life Fun Fact */}
            <div className="mt-4 p-3 bg-amber-50/80 rounded-2xl text-xs text-amber-950 font-medium text-center w-full border border-amber-200">
              💡 <span className="font-bold">Real-life:</span> {shape.funFact}
            </div>
          </div>
        </div>

        {/* Right Column: TWO Separate Learning Features (2. Characteristics & 3. Memory Song) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          {/* ========================================================= */}
          {/* 2. CHARACTERISTICS SECTION                                */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border-4 border-amber-200 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold font-['Fredoka'] text-slate-800">
                    Characteristics
                  </h3>
                  <p className="text-xs md:text-sm font-semibold text-slate-500">
                    Direct mathematical features of {shape.name}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                Mathematical Facts
              </span>
            </div>

            {/* Large, Simple Bullet List of Characteristics */}
            <div className="space-y-3 mb-6">
              {shape.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  onClick={() => handleHighlightSelect(bullet.type as HighlightType)}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/70 to-orange-50/50 hover:from-amber-100/80 hover:to-orange-100/60 border-2 border-amber-200 rounded-2xl transition-all cursor-pointer transform hover:-translate-y-0.5 shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 bg-white rounded-xl shadow-2xs">
                      {getBulletIcon(bullet.type)}
                    </div>
                    <div className="text-lg md:text-xl font-bold font-['Fredoka'] text-slate-800">
                      {bullet.count} {bullet.label}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-800 bg-white/90 px-3 py-1 rounded-xl border border-amber-200">
                    Tap to see
                  </span>
                </div>
              ))}
            </div>

            {/* Direct “🎵 Sing with Me!” Button in Characteristics Section */}
            <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/70 border-2 border-amber-300 rounded-2xl p-4 flex flex-col gap-3 mb-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-2xl shadow-sm">
                    <Music size={22} className={songProgress.state === 'playing' ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-extrabold font-['Fredoka'] text-slate-800 flex items-center gap-2">
                      <span>🎵 {shape.memorySong.title}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                        {SHAPE_AUDIO_FILES[shapeId]}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {songProgress.state === 'playing'
                        ? '🎶 Playing MP3 song...'
                        : songProgress.state === 'paused'
                        ? '⏸ Song paused'
                        : 'Tap to sing along and remember characteristics!'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {songProgress.state !== 'playing' ? (
                    <button
                      onClick={handlePlaySong}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-['Fredoka'] font-extrabold text-sm md:text-base rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-103 cursor-pointer"
                    >
                      <Play size={18} fill="currentColor" />
                      <span>🎵 Sing with Me!</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseSong}
                      className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-['Fredoka'] font-extrabold text-sm md:text-base rounded-2xl shadow-md transition-all cursor-pointer"
                    >
                      <Pause size={18} fill="currentColor" />
                      <span>Pause Song</span>
                    </button>
                  )}

                  <button
                    onClick={handleReplaySong}
                    title="Replay song from start"
                    className="p-2.5 bg-white hover:bg-amber-100 text-amber-900 font-bold rounded-2xl border-2 border-amber-300 shadow-2xs transition-all hover:scale-105 cursor-pointer"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>

              {/* Progress Bar when song is active */}
              {(songProgress.state === 'playing' || songProgress.state === 'paused' || songProgress.elapsedSeconds > 0) && (
                <div className="pt-1">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600 font-medium mb-1">
                    <span>
                      {Math.floor(songProgress.elapsedSeconds / 60)}:
                      {String(Math.floor(songProgress.elapsedSeconds % 60)).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-amber-800">
                      Line {songProgress.currentLine + 1} of {shape.memorySong.lines.length}
                    </span>
                    <span>
                      {Math.floor((songProgress.totalSeconds || 30) / 60)}:
                      {String(Math.floor((songProgress.totalSeconds || 30) % 60)).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-amber-200">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-amber-500 h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.min(
                          100,
                          ((songProgress.elapsedSeconds || 0) / (songProgress.totalSeconds || 30)) * 100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Audio Section for Characteristics Narration */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className={`p-3 rounded-2xl ${charState === 'playing' ? 'bg-amber-500 text-white animate-pulse' : 'bg-white text-slate-700 border border-slate-200'}`}>
                  <Volume2 size={24} />
                </div>
                <div>
                  <div className="text-sm md:text-base font-extrabold font-['Fredoka'] text-slate-800">
                    Characteristics Narration
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {charState === 'playing'
                      ? '🔊 Shape is speaking its characteristics...'
                      : charState === 'paused'
                      ? '⏸ Narration paused'
                      : 'Listen in a clear, friendly voice'}
                  </div>
                </div>
              </div>

              {/* Characteristics Controls: Play, Pause, Replay */}
              <div className="flex items-center gap-2 shrink-0">
                {charState !== 'playing' ? (
                  <button
                    onClick={handlePlayCharacteristics}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Fredoka'] font-bold text-sm md:text-base rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-103 cursor-pointer"
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Listen to My Characteristics</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseCharacteristics}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-['Fredoka'] font-bold text-sm md:text-base rounded-2xl shadow-md transition-all cursor-pointer"
                  >
                    <Pause size={18} fill="currentColor" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleReplayCharacteristics}
                  title="Replay characteristics"
                  className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-2xl border-2 border-slate-200 shadow-2xs transition-all hover:scale-105 cursor-pointer"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            {/* Live Narration Transcript Box */}
            <div className="mt-3 px-4 py-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs md:text-sm text-amber-950 font-medium italic text-center">
              “{shape.narrationText}”
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. MEMORY SONG SECTION                                    */}
          {/* ========================================================= */}
          <div className="bg-gradient-to-br from-white to-amber-50/80 rounded-3xl p-6 md:p-7 border-4 border-amber-400 shadow-xl relative overflow-hidden">
            {/* Playful background musical notes decorations */}
            <div className="absolute top-2 right-4 text-amber-200 text-3xl font-mono select-none pointer-events-none opacity-40">
              🎵 🎶 🎵
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-2xl shadow-sm">
                  <Music size={26} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold font-['Fredoka'] text-slate-800 flex items-center gap-2">
                    <span>🎵 Memory Song</span>
                    <Sparkles size={20} className="text-amber-500" />
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-amber-700">
                    A catchy ~{shapeId === 'pyramid' ? '30' : '19'}-second MP3 song to help you remember! ({shape.memorySong.vibe})
                  </p>
                </div>
              </div>

              {/* Audio Source Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  🎧 {SHAPE_AUDIO_FILES[shapeId]}
                </span>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  songProgress.state === 'playing'
                    ? 'bg-rose-100 text-rose-800 animate-pulse border border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {songProgress.state === 'playing' ? '🎶 Playing MP3...' : 'Ready to Play'}
                </span>
              </div>
            </div>

            {/* Song Description Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                Click <span className="font-extrabold text-rose-600">“🎵 Sing with Me!”</span> to play the MP3 song!
              </p>
            </div>

            {/* HTML Audio Player Controls Container */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border-2 border-amber-300 shadow-sm mb-5">
              {/* Play / Pause / Replay Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                {/* Main "🎵 Sing with Me!" or "Pause" Button */}
                {songProgress.state !== 'playing' ? (
                  <button
                    onClick={handlePlaySong}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-3.5 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white font-['Fredoka'] font-extrabold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    <Music size={22} className="animate-spin" />
                    <span>🎵 Sing with Me!</span>
                    <Play size={20} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    onClick={handlePauseSong}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-3.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-['Fredoka'] font-extrabold text-lg md:text-xl rounded-2xl shadow-md transition-all cursor-pointer"
                  >
                    <Pause size={22} fill="currentColor" />
                    <span>Pause Song</span>
                  </button>
                )}

                {/* Replay Button */}
                <button
                  onClick={handleReplaySong}
                  className="flex items-center gap-2 py-3.5 px-5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-['Fredoka'] font-bold text-sm md:text-base rounded-2xl transition-all shadow-xs hover:scale-103 cursor-pointer"
                  title="Replay from beginning"
                >
                  <RotateCcw size={18} />
                  <span>Replay</span>
                </button>
              </div>

              {/* Audio Progress Bar & Track Info */}
              <div className="px-1 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 font-medium mb-1.5">
                  <span>
                    {Math.floor(songProgress.elapsedSeconds / 60)}:
                    {String(Math.floor(songProgress.elapsedSeconds % 60)).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-sans text-slate-600 font-semibold truncate max-w-[200px]">
                    {SHAPE_AUDIO_FILES[shapeId]}
                  </span>
                  <span>
                    {Math.floor((songProgress.totalSeconds || 30) / 60)}:
                    {String(Math.floor((songProgress.totalSeconds || 30) % 60)).padStart(2, '0')}
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-amber-500 h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${Math.min(
                        100,
                        ((songProgress.elapsedSeconds || 0) / (songProgress.totalSeconds || 30)) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Sing-Along Karaoke Lyrics Box */}
            <div className="bg-amber-50/90 rounded-2xl p-5 border-2 border-amber-300 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
                <span>🎤 Lyrics (Sing Along!):</span>
                <span>
                  {songProgress.state === 'playing' ? `Line ${songProgress.currentLine + 1} of ${shape.memorySong.lines.length}` : 'Press “Sing With Me!” to start'}
                </span>
              </div>

              {/* Two columns of lyrics on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-center md:text-left">
                {shape.memorySong.lines.map((line, idx) => {
                  const isActive = songProgress.state === 'playing' && songProgress.currentLine === idx;
                  const isPast = songProgress.state === 'playing' && songProgress.currentLine > idx;

                  return (
                    <div
                      key={idx}
                      className={`py-2 px-3.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
                        isActive
                          ? 'bg-amber-500 text-white font-extrabold text-base md:text-lg shadow-md scale-102 ring-2 ring-amber-300'
                          : isPast
                          ? 'bg-white/60 text-slate-500 font-semibold text-sm'
                          : 'bg-white/80 text-slate-700 font-bold text-sm md:text-base'
                      }`}
                    >
                      <span className="font-['Fredoka'] leading-snug">
                        {isActive && '⭐ '} {line}
                      </span>
                      {isActive && (
                        <span className="text-yellow-200 animate-bounce text-sm">🎵</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-amber-200/80 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-amber-500 h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((songProgress.currentLine + 1) / shape.memorySong.lines.length) * 100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Footer: Bonus Quiz and Hub Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={() => {
                soundManager.playNavClick();
                songEngine.stopSong();
                songEngine.stopCharacteristics();
                onBackToHub();
              }}
              className="flex items-center gap-2 py-3 px-5 bg-white hover:bg-slate-100 text-slate-700 font-['Fredoka'] font-bold text-base rounded-2xl border-2 border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span>Choose Another Shape</span>
            </button>

            <button
              onClick={() => {
                soundManager.playCorrect();
                songEngine.stopSong();
                songEngine.stopCharacteristics();
                onTakeQuiz();
              }}
              className="flex items-center gap-2 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-['Fredoka'] font-bold text-base md:text-lg rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-103 cursor-pointer"
            >
              <Trophy size={20} className="text-yellow-200" />
              <span>Ready for the 3D Shapes Quiz?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
