// HTML5 Audio API Engine for 3D Shapes Adventure Memory Songs
// Exclusively plays the five specified MP3 files from the public folder:
// - That's a Cube!.mp3 → Cube
// - Cuboid.mp3 → Cuboid
// - Cylinder.mp3 → Cylinder
// - Cone.mp3 → Cone
// - Pyramid, Pyramid.mp3 → Pyramid

import { ShapeId } from '../types';
import { SHAPES_DATA } from '../data/shapesData';
import { soundManager } from './soundEffects';

export type PlayerState = 'idle' | 'playing' | 'paused' | 'ended';

export interface SongProgress {
  currentLine: number;
  totalLines: number;
  elapsedSeconds: number;
  totalSeconds: number;
  state: PlayerState;
  audioSource?: string;
  filename?: string;
}

export const SHAPE_AUDIO_FILES: Record<ShapeId, string> = {
  cube: "That's a Cube!.mp3",
  cuboid: "Cuboid.mp3",
  cylinder: "Cylinder.mp3",
  cone: "Cone.mp3",
  pyramid: "Pyramid, Pyramid.mp3"
};

class SongEngine {
  private songAudio: HTMLAudioElement | null = null;
  private charAudio: HTMLAudioElement | null = null;

  private currentSongShapeId: ShapeId | null = null;
  private currentCharShapeId: ShapeId | null = null;

  private songState: PlayerState = 'idle';
  private charState: PlayerState = 'idle';

  private onSongProgressCb: ((progress: SongProgress) => void) | null = null;
  private onSongEndCb: (() => void) | null = null;
  private onCharStateCb: ((state: PlayerState) => void) | null = null;

  public getSongAudioSource(shapeId: ShapeId): string {
    const filename = SHAPE_AUDIO_FILES[shapeId];
    return `/audio/${encodeURIComponent(filename)}`;
  }

  public getSongAudioFilename(shapeId: ShapeId): string {
    return SHAPE_AUDIO_FILES[shapeId];
  }

  // --- HTML5 Audio API: MP3 Song Player ---

  public playSong(
    shapeId: ShapeId,
    onProgress?: (progress: SongProgress) => void,
    onEnd?: () => void
  ) {
    this.stopCharacteristics();
    soundManager.stopBackgroundMusic();

    const audioSource = this.getSongAudioSource(shapeId);

    // Initialize or switch track
    if (this.currentSongShapeId !== shapeId || !this.songAudio) {
      if (this.songAudio) {
        this.songAudio.pause();
        this.songAudio.src = '';
        this.songAudio = null;
      }

      this.currentSongShapeId = shapeId;
      this.songAudio = new Audio(audioSource);
      this.songAudio.preload = 'auto';

      this.songAudio.ontimeupdate = () => {
        this.handleSongTimeUpdate();
      };

      this.songAudio.onended = () => {
        this.songState = 'ended';
        this.emitSongProgress();
        if (this.onSongEndCb) {
          this.onSongEndCb();
        }
      };

      this.songAudio.onerror = (e) => {
        console.warn(`Audio playback error from ${audioSource}:`, e);
        // Fallback to direct filename without /audio/ prefix
        const directSource = `/${encodeURIComponent(SHAPE_AUDIO_FILES[shapeId])}`;
        if (this.songAudio && this.songAudio.src !== directSource) {
          this.songAudio.src = directSource;
          this.songAudio.play().catch(console.warn);
        } else {
          this.songState = 'ended';
          this.emitSongProgress();
        }
      };
    }

    this.onSongProgressCb = onProgress || null;
    this.onSongEndCb = onEnd || null;
    this.songState = 'playing';

    const playPromise = this.songAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play error / browser gesture requirement:', err);
      });
    }

    this.emitSongProgress();
  }

  public pauseSong() {
    if (!this.songAudio || this.songState !== 'playing') return;
    this.songAudio.pause();
    this.songState = 'paused';
    this.emitSongProgress();
  }

  public resumeSong() {
    if (!this.songAudio || this.songState !== 'paused') return;
    this.songState = 'playing';
    this.songAudio.play().catch((err) => console.warn('Resume play error:', err));
    this.emitSongProgress();
  }

  public replaySong(shapeId?: ShapeId) {
    const target = shapeId || this.currentSongShapeId || 'cube';
    if (this.songAudio && this.currentSongShapeId === target) {
      this.songAudio.currentTime = 0;
      this.songState = 'playing';
      this.songAudio.play().catch((err) => console.warn('Replay error:', err));
      this.emitSongProgress();
    } else {
      this.playSong(target, this.onSongProgressCb || undefined, this.onSongEndCb || undefined);
    }
  }

  public stopSong() {
    if (this.songAudio) {
      this.songAudio.pause();
      this.songAudio.currentTime = 0;
    }
    this.songState = 'idle';
    this.emitSongProgress();
  }

  public getSongState(): PlayerState {
    return this.songState;
  }

  public getCurrentAudioElement(): HTMLAudioElement | null {
    return this.songAudio;
  }

  private calculateLineIndex(currentTime: number, totalLines: number): number {
    if (totalLines <= 0) return 0;
    const dur = this.songAudio && !isNaN(this.songAudio.duration) && this.songAudio.duration > 5
      ? this.songAudio.duration
      : 30.0;

    const intro = 1.0;
    if (currentTime < intro) return 0;

    const activeTime = currentTime - intro;
    const perLine = (dur - intro) / totalLines;
    const idx = Math.floor(activeTime / perLine);
    return Math.max(0, Math.min(totalLines - 1, idx));
  }

  private handleSongTimeUpdate() {
    if (!this.songAudio || !this.currentSongShapeId) return;

    const currentTime = this.songAudio.currentTime;
    const lines = SHAPES_DATA[this.currentSongShapeId]?.memorySong.lines || [];
    const totalLines = lines.length;
    const lineIdx = this.calculateLineIndex(currentTime, totalLines);
    const defaultDur = 30.0;

    if (this.onSongProgressCb) {
      this.onSongProgressCb({
        currentLine: lineIdx,
        totalLines,
        elapsedSeconds: Math.round(currentTime * 10) / 10,
        totalSeconds: Math.round((this.songAudio.duration || defaultDur) * 10) / 10,
        state: this.songState,
        audioSource: this.getSongAudioSource(this.currentSongShapeId),
        filename: this.getSongAudioFilename(this.currentSongShapeId)
      });
    }
  }

  private emitSongProgress() {
    if (!this.onSongProgressCb || !this.currentSongShapeId) return;
    const lines = SHAPES_DATA[this.currentSongShapeId]?.memorySong.lines || [];
    const currentTime = this.songAudio ? this.songAudio.currentTime : 0;
    const defaultDur = 30.0;
    const totalDuration = this.songAudio && !isNaN(this.songAudio.duration) ? this.songAudio.duration : defaultDur;
    const lineIdx = this.calculateLineIndex(currentTime, lines.length);

    this.onSongProgressCb({
      currentLine: lineIdx,
      totalLines: lines.length,
      elapsedSeconds: Math.round(currentTime * 10) / 10,
      totalSeconds: Math.round(totalDuration * 10) / 10,
      state: this.songState,
      audioSource: this.getSongAudioSource(this.currentSongShapeId),
      filename: this.getSongAudioFilename(this.currentSongShapeId)
    });
  }

  // --- Characteristics Audio Player ---

  public playCharacteristics(
    shapeId: ShapeId,
    onStateChange?: (state: PlayerState) => void
  ) {
    this.stopSong();
    soundManager.stopBackgroundMusic();

    if (this.currentCharShapeId !== shapeId || !this.charAudio) {
      if (this.charAudio) {
        this.charAudio.pause();
        this.charAudio = null;
      }

      this.currentCharShapeId = shapeId;
      const audioPath = `/audio/${shapeId}_characteristics.mp3`;
      this.charAudio = new Audio(audioPath);
      this.charAudio.preload = 'auto';

      this.charAudio.onended = () => {
        this.charState = 'ended';
        this.notifyCharState();
      };

      this.charAudio.onerror = (e) => {
        console.warn('Characteristics audio load error:', e);
        this.charState = 'ended';
        this.notifyCharState();
      };
    }

    this.onCharStateCb = onStateChange || null;
    this.charState = 'playing';
    this.notifyCharState();

    this.charAudio.play().catch((err) => {
      console.warn('Char audio play prevented:', err);
    });
  }

  public pauseCharacteristics() {
    if (!this.charAudio || this.charState !== 'playing') return;
    this.charAudio.pause();
    this.charState = 'paused';
    this.notifyCharState();
  }

  public resumeCharacteristics() {
    if (!this.charAudio || this.charState !== 'paused') return;
    this.charState = 'playing';
    this.charAudio.play().catch((err) => console.warn('Char resume error:', err));
    this.notifyCharState();
  }

  public replayCharacteristics(shapeId?: ShapeId) {
    const target = shapeId || this.currentCharShapeId || 'cube';
    if (this.charAudio && this.currentCharShapeId === target) {
      this.charAudio.currentTime = 0;
      this.charState = 'playing';
      this.charAudio.play().catch((err) => console.warn('Char replay error:', err));
      this.notifyCharState();
    } else {
      this.playCharacteristics(target, this.onCharStateCb || undefined);
    }
  }

  public stopCharacteristics() {
    if (this.charAudio) {
      this.charAudio.pause();
      this.charAudio.currentTime = 0;
    }
    this.charState = 'idle';
    this.notifyCharState();
  }

  public getCharState(): PlayerState {
    return this.charState;
  }

  private notifyCharState() {
    if (this.onCharStateCb) {
      this.onCharStateCb(this.charState);
    }
  }
}

export const songEngine = new SongEngine();
