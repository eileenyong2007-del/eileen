// Web Audio API Sound Effects, Ambient Background Sound & Speech Synthesis Engine
// Tuned specially for primary school educational games: joyful, bouncy, bright and cheerful!

interface NoteStep {
  note: number;      // Main lead chime frequency (Hz)
  duration: number;  // Duration in ms
  bass?: number;     // Bass note frequency (Hz)
  perc?: boolean;    // Add cheerful woodblock percussion tap
  harmony?: number;  // Optional harmony note (Hz)
}

class SoundManager {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isSfxMuted: boolean = false;
  private isVoiceEnabled: boolean = true;
  private isMusicPlaying: boolean = false;
  private musicTimerId: number | null = null;
  private musicStep: number = 0;
  private musicListeners: ((active: boolean) => void)[] = [];

  public addMusicListener(cb: (active: boolean) => void): () => void {
    this.musicListeners.push(cb);
    return () => {
      this.musicListeners = this.musicListeners.filter((l) => l !== cb);
    };
  }

  private notifyMusicListeners() {
    this.musicListeners.forEach((l) => l(this.isMusicPlaying));
  }

  // Cheerful, upbeat, bouncy primary school adventure tune (125 BPM, bright C-Major marimba & walking bass)
  private readonly bgMelody: NoteStep[] = [
    // Phrase 1: Bouncy ascending arpeggio ("Here we go!")
    { note: 523.25, duration: 240, bass: 130.81, perc: true },  // C5 + C3
    { note: 659.25, duration: 240 },                            // E5
    { note: 783.99, duration: 240, bass: 196.00, perc: true },  // G5 + G3
    { note: 1046.50, duration: 400, harmony: 659.25 },          // C6 + E5
    { note: 880.00, duration: 240, bass: 146.83, perc: true },  // A5 + D3
    { note: 783.99, duration: 240 },                            // G5
    { note: 659.25, duration: 380, bass: 164.81 },              // E5 + E3

    // Phrase 2: Playful hopping skip
    { note: 587.33, duration: 240, bass: 146.83, perc: true },  // D5 + D3
    { note: 659.25, duration: 240 },                            // E5
    { note: 698.46, duration: 240, bass: 174.61, perc: true },  // F5 + F3
    { note: 880.00, duration: 380, harmony: 523.25 },          // A5 + C5
    { note: 783.99, duration: 240, bass: 196.00, perc: true },  // G5 + G3
    { note: 659.25, duration: 240 },                            // E5
    { note: 587.33, duration: 380, bass: 130.81 },              // D5 + C3

    // Phrase 3: Excited leap ("Look at this shape!")
    { note: 659.25, duration: 240, bass: 130.81, perc: true },  // E5 + C3
    { note: 783.99, duration: 240 },                            // G5
    { note: 1046.50, duration: 240, bass: 164.81, perc: true }, // C6 + E3
    { note: 1174.66, duration: 240 },                           // D6
    { note: 1318.51, duration: 420, bass: 146.83, harmony: 783.99, perc: true }, // E6 + A3
    { note: 1174.66, duration: 240 },                           // D6
    { note: 1046.50, duration: 380, bass: 196.00 },             // C6 + G3

    // Phrase 4: Happy bouncing resolution
    { note: 880.00, duration: 240, bass: 174.61, perc: true },  // A5 + F3
    { note: 1046.50, duration: 240 },                           // C6
    { note: 783.99, duration: 240, bass: 196.00, perc: true },  // G5 + G3
    { note: 659.25, duration: 240 },                            // E5
    { note: 587.33, duration: 240, bass: 146.83, perc: true },  // D5 + D3
    { note: 783.99, duration: 240, bass: 196.00 },              // G5 + G3
    { note: 523.25, duration: 520, bass: 130.81, harmony: 659.25, perc: true }, // C5 + E5 + C3
    { note: 0, duration: 220 }                                  // Tiny bouncy breath
  ];

  public initContext(): AudioContext | null {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.isSfxMuted ? 0 : 0.9;
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.70; // Bright, joyful volume for children
        this.musicGain.connect(this.masterGain);
      } catch (e) {
        console.warn('AudioContext creation error:', e);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch((e) => console.warn('AudioContext resume failed:', e));
    }

    return this.ctx;
  }

  // --- Background Instrumental Sound Engine ---

  public startBackgroundMusic() {
    this.initContext();
    if (!this.ctx) return;

    if (this.musicTimerId !== null) {
      window.clearTimeout(this.musicTimerId);
      this.musicTimerId = null;
    }

    this.isMusicPlaying = true;
    this.notifyMusicListeners();
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(0.70, this.ctx.currentTime);
    }

    const runMusic = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      this.musicStep = 0;
      this.playNextMusicNote();
    };

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(runMusic).catch(runMusic);
    } else {
      runMusic();
    }
  }

  private playNextMusicNote = () => {
    if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

    const item = this.bgMelody[this.musicStep];
    const durationSec = Math.max(0.18, item.duration / 1000);
    const now = this.ctx.currentTime;

    if (item.note > 0) {
      try {
        // 1. Bright Xylophone / Glockenspiel Mallet Strike (Lead)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';

        // Punchy pitch drop at onset simulates a wooden/metal mallet strike
        osc.frequency.setValueAtTime(item.note + 45, now);
        osc.frequency.exponentialRampToValueAtTime(item.note, now + 0.018);

        gain.gain.setValueAtTime(0.48, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.92);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + durationSec);

        // 2. Sweet sparkly overtone harmonic
        const oscHarm = this.ctx.createOscillator();
        const gainHarm = this.ctx.createGain();
        oscHarm.type = 'sine';
        oscHarm.frequency.setValueAtTime(item.harmony || item.note * 2, now);

        gainHarm.gain.setValueAtTime(0.18, now);
        gainHarm.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 0.65);

        oscHarm.connect(gainHarm);
        gainHarm.connect(this.musicGain);

        oscHarm.start(now);
        oscHarm.stop(now + durationSec * 0.7);

        // 3. Cheerful Bouncy Plucked Bass
        if (item.bass) {
          const oscBass = this.ctx.createOscillator();
          const gainBass = this.ctx.createGain();
          oscBass.type = 'sine';
          oscBass.frequency.setValueAtTime(item.bass, now);

          // Punchy bouncy pluck
          gainBass.gain.setValueAtTime(0.38, now);
          gainBass.gain.exponentialRampToValueAtTime(0.001, now + Math.min(0.28, durationSec * 0.8));

          oscBass.connect(gainBass);
          gainBass.connect(this.musicGain);

          oscBass.start(now);
          oscBass.stop(now + durationSec);
        }

        // 4. Subtle cheerful woodblock tap on beats
        if (item.perc) {
          const oscPerc = this.ctx.createOscillator();
          const gainPerc = this.ctx.createGain();
          oscPerc.type = 'triangle';
          oscPerc.frequency.setValueAtTime(860, now);
          oscPerc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

          gainPerc.gain.setValueAtTime(0.14, now);
          gainPerc.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          oscPerc.connect(gainPerc);
          gainPerc.connect(this.musicGain);

          oscPerc.start(now);
          oscPerc.stop(now + 0.04);
        }
      } catch (e) {
        console.warn('Background note error:', e);
      }
    }

    this.musicStep = (this.musicStep + 1) % this.bgMelody.length;
    this.musicTimerId = window.setTimeout(this.playNextMusicNote, item.duration);
  };

  public stopBackgroundMusic() {
    this.isMusicPlaying = false;
    this.notifyMusicListeners();
    if (this.musicTimerId !== null) {
      window.clearTimeout(this.musicTimerId);
      this.musicTimerId = null;
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  public isMusicActive(): boolean {
    return this.isMusicPlaying;
  }

  // --- Cheerful Primary School Sound Effects Library ---

  // Bubbly, friendly "bubble pop" sound for general button clicks
  public playClick() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(1020, now + 0.055);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  // Soft wooden block tap for back and navigation buttons
  public playNavClick() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.035);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  // Cheerful tactile tap for quiz options
  public playOptionSelect() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.04);

      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {}
  }

  // Lightbulb "ping" chime when opening a hint
  public playHint() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [1046.50, 1567.98]; // C6 + G6 bright lightbulb ping
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);

        gain.gain.setValueAtTime(0.35, now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.38);
      });
    } catch {}
  }

  // Unique playful musical signature sound for each shape!
  public playShapeSelect(shapeId: string) {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    try {
      switch (shapeId) {
        case 'cube': {
          // Cool Cube: Crisp, bright double-chime (C5 -> G5)
          const notes = [523.25, 783.99];
          notes.forEach((f, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.07);
            gain.gain.setValueAtTime(0.42, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.24);
          });
          break;
        }

        case 'cuboid': {
          // Clever Cuboid: Joyful 3-step ascending xylophone run (C5 -> E5 -> G5)
          const notes = [523.25, 659.25, 783.99];
          notes.forEach((f, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.06);
            gain.gain.setValueAtTime(0.40, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.27);
          });
          break;
        }

        case 'cylinder': {
          // Cheery Cylinder: Bubbly rolling slide & high pop!
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
          gain.gain.setValueAtTime(0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.20);
          break;
        }

        case 'cone': {
          // Cute Cone: Cheerful bouncy spring-twang & chime!
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(680, now + 0.06);
          osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
          gain.gain.setValueAtTime(0.42, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.24);
          break;
        }

        case 'pyramid': {
          // Playful Pyramid: Mystical Egyptian gem chime arpeggio
          const notes = [587.33, 739.99, 1046.50, 1174.66];
          notes.forEach((f, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.05);
            gain.gain.setValueAtTime(0.36, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.28);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.30);
          });
          break;
        }

        default:
          this.playSparkle();
      }
    } catch {}
  }

  // Cheerful fairy-dust sparkle chime (C6, E6, G6, B6, C7)
  public playSparkle() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const time = now + idx * 0.045;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(time);
        osc.stop(time + 0.25);
      });
    } catch {}
  }

  // Happy celebration fanfare when getting an answer right!
  public playCorrect() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      // Cheerful major arpeggio fanfare (C5, E5, G5, C6) + celebratory harmonic shimmer
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + idx * 0.065;
        const duration = idx === notes.length - 1 ? 0.55 : 0.22;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.50, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);

        // High sparkle chime on the final top note
        if (idx === notes.length - 1) {
          const oscTop = this.ctx!.createOscillator();
          const gainTop = this.ctx!.createGain();
          oscTop.type = 'sine';
          oscTop.frequency.setValueAtTime(1567.98, startTime + 0.05); // G6 chime
          gainTop.gain.setValueAtTime(0.32, startTime + 0.05);
          gainTop.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
          oscTop.connect(gainTop);
          gainTop.connect(this.sfxGain!);
          oscTop.start(startTime + 0.05);
          oscTop.stop(startTime + 0.48);
        }
      });
    } catch {}
  }

  // Gentle, encouraging "oops, try again" bounce (friendly, never harsh for kids)
  public playWrong() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  // Grand celebration jingle for finishing the quiz with flying colors!
  public playCelebration() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99],          // C major
        [587.33, 739.99, 880.00],          // D major
        [659.25, 830.61, 987.77],          // E major
        [783.99, 987.77, 1174.66, 1567.98] // G major bright high flourish
      ];

      const now = this.ctx.currentTime;
      chords.forEach((chord, cIdx) => {
        const time = now + cIdx * 0.15;
        chord.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0.32, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

          osc.connect(gain);
          gain.connect(this.sfxGain!);

          osc.start(time);
          osc.stop(time + 0.48);
        });
      });
    } catch {}
  }

  // Fun cartoon spring / paper fold whoosh
  public playFoldWhoosh() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.28);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.34);
    } catch {}
  }

  public toggleSfx(): boolean {
    this.isSfxMuted = !this.isSfxMuted;
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isSfxMuted ? 0 : 0.9;
    }
    return !this.isSfxMuted;
  }

  public isSfxActive(): boolean {
    return !this.isSfxMuted;
  }

  public toggleVoice(): boolean {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isVoiceEnabled;
  }

  public isVoiceActive(): boolean {
    return this.isVoiceEnabled;
  }

  // Cute child chime arpeggio
  public playCuteChildChirp() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [659.25, 880.00, 1046.50, 1318.51];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + idx * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.38, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(startTime);
        osc.stop(startTime + 0.20);
      });
    } catch {}
  }

  // --- Speech Synthesis Disabled: Using Real MP3 Audio Files Exclusively ---
  public speak(_text: string, onEnd?: () => void) {
    // Pure MP3 audio engine is used; no text-to-speech
    if (onEnd) onEnd();
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundManager();
