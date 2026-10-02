import os
import sys
import math
import struct
import wave
import urllib.request
import urllib.parse
import subprocess

SAMPLE_RATE = 44100
OUT_DIR = "public/audio"
os.makedirs(OUT_DIR, exist_ok=True)
TEMP_DIR = "/tmp/audio_gen"
os.makedirs(TEMP_DIR, exist_ok=True)

def get_note_freq(note_name):
    notes = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4,
             'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9,
             'A#': 10, 'Bb': 10, 'B': 11}
    letter = note_name[:-1]
    octave = int(note_name[-1])
    semitone = notes[letter] + (octave - 4) * 12
    return 440.0 * (2.0 ** ((semitone - 9) / 12.0))

class MusicSynthesizer:
    def __init__(self, bpm=124, total_bars=10):
        self.bpm = bpm
        self.beat_duration = 60.0 / bpm
        self.bar_duration = self.beat_duration * 4.0
        self.total_duration = self.bar_duration * total_bars
        self.total_samples = int(self.total_duration * SAMPLE_RATE)
        self.buffer = [0.0] * self.total_samples

    def add_note(self, freq, start_time, duration, volume=0.25, instrument='xylophone'):
        start_idx = int(start_time * SAMPLE_RATE)
        num_samples = int(duration * SAMPLE_RATE)
        end_idx = min(self.total_samples, start_idx + num_samples)

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            rel_t = (i - start_idx) / num_samples

            if instrument == 'xylophone':
                env = math.exp(-rel_t * 5.5)
                sig = (math.sin(2 * math.pi * freq * t) * 0.65 +
                       math.sin(2 * math.pi * freq * 2.0 * t) * 0.25 +
                       math.sin(2 * math.pi * freq * 3.0 * t) * 0.10)
                if t < 0.015:
                    sig += math.sin(2 * math.pi * 1400 * t) * 0.3 * (1.0 - t / 0.015)
                self.buffer[i] += sig * env * volume

            elif instrument == 'piano':
                env = math.exp(-rel_t * 3.0)
                sig = (math.sin(2 * math.pi * freq * t) * 0.7 +
                       math.sin(2 * math.pi * freq * 2.0 * t) * 0.2 +
                       math.sin(2 * math.pi * freq * 3.0 * t) * 0.1)
                self.buffer[i] += sig * env * volume

            elif instrument == 'bass':
                env = math.exp(-rel_t * 3.8)
                sig = (math.sin(2 * math.pi * freq * t) * 0.85 +
                       math.sin(2 * math.pi * freq * 2.0 * t) * 0.15)
                self.buffer[i] += sig * env * volume

    def add_chord(self, note_names, start_time, duration, volume=0.18):
        for n in note_names:
            freq = get_note_freq(n)
            self.add_note(freq, start_time, duration, volume, instrument='piano')

    def add_drum(self, drum_type, start_time, volume=0.3):
        start_idx = int(start_time * SAMPLE_RATE)
        dur = 0.05 if drum_type in ('woodblock', 'hihat') else 0.14
        num_samples = int(dur * SAMPLE_RATE)
        end_idx = min(self.total_samples, start_idx + num_samples)

        for i in range(start_idx, end_idx):
            t = (i - start_idx) / SAMPLE_RATE
            rel_t = (i - start_idx) / num_samples

            if drum_type == 'kick':
                env = math.exp(-rel_t * 8.0)
                f = 130.0 * math.exp(-rel_t * 9.0) + 48.0
                sig = math.sin(2 * math.pi * f * t)
                self.buffer[i] += sig * env * volume

            elif drum_type == 'woodblock':
                env = math.exp(-rel_t * 14.0)
                sig = math.sin(2 * math.pi * 960.0 * t) * 0.7 + math.sin(2 * math.pi * 1520.0 * t) * 0.3
                self.buffer[i] += sig * env * volume

            elif drum_type == 'hihat':
                env = math.exp(-rel_t * 18.0)
                noise = ((i * 1103515245 + 12345) & 0x7FFFFFFF) / 0x7FFFFFFF * 2.0 - 1.0
                self.buffer[i] += noise * env * volume

    def export_wav(self, filename):
        max_val = max(abs(s) for s in self.buffer) if self.buffer else 1.0
        scale = 26000.0 / max(1.0, max_val)
        with wave.open(filename, 'w') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(SAMPLE_RATE)
            raw = bytearray()
            for s in self.buffer:
                val = int(s * scale)
                val = max(-32767, min(32767, val))
                raw.extend(struct.pack('<h', val))
            wf.writeframes(raw)

def fetch_tts(text, out_mp3):
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={urllib.parse.quote(text)}&tl=en&client=tw-ob"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp, open(out_mp3, 'wb') as f:
        f.write(resp.read())

def create_characteristics_audio(shape_id, text):
    raw_mp3 = f"{TEMP_DIR}/{shape_id}_char_raw.mp3"
    final_mp3 = f"{OUT_DIR}/{shape_id}_characteristics.mp3"
    print(f"Generating characteristics audio for {shape_id}...")
    fetch_tts(text, raw_mp3)

    # Process voice with bright, friendly child pitch, warm clarity and gentle chime intro
    cmd = [
        "ffmpeg", "-y",
        "-i", raw_mp3,
        "-af", "rubberband=pitch=1.24:tempo=1.02,equalizer=f=3000:t=q:w=1.2:g=3.5,chorus=0.5:0.7:30:0.25:0.18:2,volume=1.4",
        final_mp3
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Created: {final_mp3}")

def build_song(shape_id, intro_text, lines, chords_progression, melody_notes_per_bar):
    print(f"Building Memory Song for {shape_id}...")
    bpm = 124
    synth = MusicSynthesizer(bpm=bpm, total_bars=10)
    bar_dur = synth.bar_duration
    beat_dur = synth.beat_duration

    # 1. Compose the musical backing track
    for bar in range(10):
        bar_start = bar * bar_dur
        chord = chords_progression[bar % len(chords_progression)]

        # Rhythm track: Kick on 1 and 3, Hi-hat on every beat, Woodblock on 2 and 4
        synth.add_drum('kick', bar_start + 0 * beat_dur, volume=0.45)
        synth.add_drum('woodblock', bar_start + 1 * beat_dur, volume=0.35)
        synth.add_drum('kick', bar_start + 2 * beat_dur, volume=0.42)
        synth.add_drum('woodblock', bar_start + 3 * beat_dur, volume=0.35)

        for b in range(4):
            synth.add_drum('hihat', bar_start + b * beat_dur, volume=0.22)
            synth.add_drum('hihat', bar_start + (b + 0.5) * beat_dur, volume=0.15)

        # Harmony chord on beats 1 and 3
        synth.add_chord(chord['notes'], bar_start + 0 * beat_dur, beat_dur * 1.8, volume=0.22)
        synth.add_chord(chord['notes'], bar_start + 2 * beat_dur, beat_dur * 1.8, volume=0.20)

        # Walking bassline on all beats
        synth.add_note(get_note_freq(chord['bass']), bar_start + 0 * beat_dur, beat_dur * 0.85, volume=0.38, instrument='bass')
        synth.add_note(get_note_freq(chord['bass_walk1']), bar_start + 1 * beat_dur, beat_dur * 0.85, volume=0.32, instrument='bass')
        synth.add_note(get_note_freq(chord['bass_walk2']), bar_start + 2 * beat_dur, beat_dur * 0.85, volume=0.35, instrument='bass')
        synth.add_note(get_note_freq(chord['bass_walk3']), bar_start + 3 * beat_dur, beat_dur * 0.85, volume=0.32, instrument='bass')

        # Lead melody (Xylophone) playing the song's tune in sync with vocals!
        bar_melody = melody_notes_per_bar.get(bar, [])
        for note_info in bar_melody:
            # note_info: (rel_beat, note_name, duration_beats)
            rel_beat, n_name, n_dur = note_info
            synth.add_note(get_note_freq(n_name), bar_start + rel_beat * beat_dur, n_dur * beat_dur, volume=0.48, instrument='xylophone')

    backing_wav = f"{TEMP_DIR}/{shape_id}_backing.wav"
    synth.export_wav(backing_wav)

    # 2. Fetch vocal audio for intro and each line
    vocal_parts = []
    # Intro
    intro_mp3 = f"{TEMP_DIR}/{shape_id}_intro.mp3"
    fetch_tts(intro_text, intro_mp3)
    vocal_parts.append((0.15, intro_mp3))

    # 8 lyrics lines (one per bar from bar 1 to 8)
    for idx, line in enumerate(lines):
        line_mp3 = f"{TEMP_DIR}/{shape_id}_line_{idx}.mp3"
        fetch_tts(line, line_mp3)
        # Bar starts at (1 + idx) * bar_dur
        target_time = (1 + idx) * bar_dur + 0.08
        vocal_parts.append((target_time, line_mp3))

    # 3. Time-align and pitch-shift all vocal parts into a single voice track with ffmpeg
    filter_inputs = ["-i", backing_wav]
    filter_complex = []

    for idx, (offset_sec, mp3_path) in enumerate(vocal_parts):
        filter_inputs.extend(["-i", mp3_path])
        input_idx = idx + 1
        # Pitch up to cheerful bright child singing voice
        delay_ms = int(offset_sec * 1000)
        filter_complex.append(
            f"[{input_idx}:a]rubberband=pitch=1.28:tempo=1.05,adelay={delay_ms}|{delay_ms},volume=2.2[v{idx}]"
        )

    # Mix backing track + all vocals together with gentle mastering limiter/equalizer
    all_v_tags = "".join(f"[v{i}]" for i in range(len(vocal_parts)))
    mix_count = 1 + len(vocal_parts)
    filter_complex.append(
        f"[0:a]{all_v_tags}amix=inputs={mix_count}:dropout_transition=2,"
        f"equalizer=f=3200:t=q:w=1.2:g=3.0,alimiter=limit=0.92[outa]"
    )

    filter_str = ";".join(filter_complex)
    final_mp3 = f"{OUT_DIR}/{shape_id}_song.mp3"

    cmd = ["ffmpeg", "-y"] + filter_inputs + [
        "-filter_complex", filter_str,
        "-map", "[outa]",
        "-t", "19.5",
        final_mp3
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Created: {final_mp3} (size: {os.path.getsize(final_mp3)} bytes)")

# ----------------- CHORD PROGRESSIONS & MELODIES -----------------

# C Major joyful progression
chords_C = [
    {'notes': ['C4', 'E4', 'G4'], 'bass': 'C3', 'bass_walk1': 'E3', 'bass_walk2': 'G3', 'bass_walk3': 'E3'},
    {'notes': ['C4', 'E4', 'G4'], 'bass': 'C3', 'bass_walk1': 'E3', 'bass_walk2': 'G3', 'bass_walk3': 'B2'},
    {'notes': ['A3', 'C4', 'E4'], 'bass': 'A2', 'bass_walk1': 'C3', 'bass_walk2': 'E3', 'bass_walk3': 'G2'},
    {'notes': ['F3', 'A3', 'C4'], 'bass': 'F2', 'bass_walk1': 'A2', 'bass_walk2': 'C3', 'bass_walk3': 'D3'},
    {'notes': ['G3', 'B3', 'D4'], 'bass': 'G2', 'bass_walk1': 'B2', 'bass_walk2': 'D3', 'bass_walk3': 'F2'},
    {'notes': ['C4', 'E4', 'G4'], 'bass': 'C3', 'bass_walk1': 'E3', 'bass_walk2': 'G3', 'bass_walk3': 'A2'},
    {'notes': ['F3', 'A3', 'C4'], 'bass': 'F2', 'bass_walk1': 'A2', 'bass_walk2': 'C3', 'bass_walk3': 'E2'},
    {'notes': ['G3', 'B3', 'D4'], 'bass': 'G2', 'bass_walk1': 'B2', 'bass_walk2': 'D3', 'bass_walk3': 'B2'},
    {'notes': ['C4', 'E4', 'G4', 'C5'], 'bass': 'C3', 'bass_walk1': 'G3', 'bass_walk2': 'C3', 'bass_walk3': 'C3'},
    {'notes': ['C4', 'E4', 'G4'], 'bass': 'C3', 'bass_walk1': 'E3', 'bass_walk2': 'G3', 'bass_walk3': 'C3'}
]

# Melodies for each bar (relative beats: 0, 1, 2, 3)
melody_cube = {
    0: [(0, 'C5', 0.8), (1, 'E5', 0.8), (2, 'G5', 0.8), (3, 'C6', 0.8)], # Intro fanfare
    1: [(0, 'G5', 0.7), (1, 'G5', 0.7), (2, 'A5', 0.7), (3, 'G5', 0.9)], # "Six flat square faces!"
    2: [(0, 'E5', 0.7), (1, 'E5', 0.7), (2, 'G5', 0.7), (3, 'E5', 0.9)], # "Eight vertices too!"
    3: [(0, 'D5', 0.7), (1, 'D5', 0.7), (2, 'F5', 0.7), (3, 'E5', 0.9)], # "Twelve straight edges!"
    4: [(0, 'G5', 0.7), (1, 'E5', 0.7), (2, 'D5', 0.7), (3, 'C5', 1.0)], # "That's what a cube can do!"
    5: [(0, 'E5', 0.9), (1, 'G5', 0.9), (2, 'E5', 1.2)],                 # "Six faces!"
    6: [(0, 'D5', 0.9), (1, 'F5', 0.9), (2, 'D5', 1.2)],                 # "Eight vertices!"
    7: [(0, 'E5', 0.9), (1, 'G5', 0.9), (2, 'E5', 1.2)],                 # "Twelve edges!"
    8: [(0, 'C5', 0.7), (1, 'C5', 0.7), (2, 'C5', 0.9), (3, 'C6', 1.2)], # "Cube, cube, cube!"
    9: [(0, 'C6', 1.5), (2, 'G5', 1.5)]                                   # Outro
}

melody_cuboid = {
    0: [(0, 'E5', 0.8), (1, 'G5', 0.8), (2, 'A5', 0.8), (3, 'C6', 0.8)],
    1: [(0, 'G5', 0.7), (1, 'A5', 0.7), (2, 'G5', 0.7), (3, 'E5', 0.9)], # "Six flat faces!"
    2: [(0, 'G5', 0.7), (1, 'E5', 0.7), (2, 'D5', 0.7), (3, 'C5', 0.9)], # "Eight vertices too!"
    3: [(0, 'D5', 0.7), (1, 'E5', 0.7), (2, 'F5', 0.7), (3, 'D5', 0.9)], # "Twelve straight edges!"
    4: [(0, 'E5', 0.7), (1, 'G5', 0.7), (2, 'D5', 0.7), (3, 'C5', 1.0)], # "That's a cuboid for you!"
    5: [(0, 'E5', 0.9), (1, 'G5', 0.9), (2, 'E5', 1.2)],                 # "Six faces!"
    6: [(0, 'D5', 0.9), (1, 'F5', 0.9), (2, 'D5', 1.2)],                 # "Eight vertices!"
    7: [(0, 'E5', 0.9), (1, 'G5', 0.9), (2, 'E5', 1.2)],                 # "Twelve edges!"
    8: [(0, 'C5', 0.7), (1, 'E5', 0.7), (2, 'G5', 0.9), (3, 'C6', 1.2)], # "Cuboid, cuboid, cuboid!"
    9: [(0, 'C6', 1.5), (2, 'G5', 1.5)]
}

melody_cylinder = {
    0: [(0, 'G5', 0.7), (1, 'C6', 0.7), (2, 'E6', 0.7), (3, 'G6', 0.9)],
    1: [(0, 'G5', 0.7), (1, 'E5', 0.7), (2, 'G5', 0.9)],                 # "Two flat faces!"
    2: [(0, 'A5', 0.7), (1, 'G5', 0.7), (2, 'E5', 0.9)],                 # "One curved face!"
    3: [(0, 'F5', 0.7), (1, 'A5', 0.7), (2, 'G5', 0.7), (3, 'E5', 0.8)], # "Round and round,"
    4: [(0, 'D5', 0.7), (1, 'E5', 0.7), (2, 'D5', 0.7), (3, 'C5', 1.0)], # "I'm a cylinder shape!"
    5: [(0, 'E5', 0.9), (1, 'G5', 1.2)],                                 # "Two flat!"
    6: [(0, 'D5', 0.9), (1, 'F5', 1.2)],                                 # "One curved!"
    7: [(0, 'E5', 0.7), (1, 'G5', 0.7), (2, 'A5', 1.2)],                 # "Two and one!"
    8: [(0, 'C5', 0.7), (1, 'E5', 0.7), (2, 'C5', 1.2)],                 # "Cylinder, cylinder!"
    9: [(0, 'C6', 1.5), (2, 'G5', 1.5)]
}

melody_cone = {
    0: [(0, 'C5', 0.7), (1, 'G5', 0.7), (2, 'C6', 0.9), (3, 'E6', 0.9)],
    1: [(0, 'G5', 0.8), (1, 'E5', 1.2)],                                 # "One vertex!"
    2: [(0, 'A5', 0.8), (1, 'F5', 1.2)],                                 # "One flat face!"
    3: [(0, 'G5', 0.8), (1, 'E5', 1.2)],                                 # "One curved face!"
    4: [(0, 'D5', 0.7), (1, 'E5', 0.7), (2, 'D5', 0.7), (3, 'C5', 1.0)], # "That's my cone shape!"
    5: [(0, 'C5', 0.6), (1, 'E5', 0.6), (2, 'G5', 1.2)],                 # "One, one, one!"
    6: [(0, 'A5', 0.7), (1, 'G5', 0.7), (2, 'E5', 1.0)],                 # "Easy to remember!"
    7: [(0, 'F5', 0.7), (1, 'A5', 0.7), (2, 'G5', 1.0)],                 # "One vertex, one flat,"
    8: [(0, 'E5', 0.7), (1, 'D5', 0.7), (2, 'C5', 1.3)],                 # "One curved face!"
    9: [(0, 'C6', 1.5)]
}

melody_pyramid = {
    0: [(0, 'C5', 0.7), (1, 'E5', 0.7), (2, 'G5', 0.7), (3, 'C6', 0.9)],
    1: [(0, 'G5', 0.7), (1, 'G5', 0.7), (2, 'A5', 0.7), (3, 'G5', 0.9)], # "One flat square face!"
    2: [(0, 'E5', 0.7), (1, 'G5', 0.7), (2, 'E5', 0.9)],                 # "Five triangular faces!"
    3: [(0, 'D5', 0.8), (1, 'E5', 1.2)],                                 # "One vertex!"
    4: [(0, 'F5', 0.7), (1, 'E5', 0.7), (2, 'D5', 0.7), (3, 'C5', 1.0)], # "Eight straight edges!"
    5: [(0, 'E5', 0.8), (1, 'G5', 1.2)],                                 # "One square!"
    6: [(0, 'A5', 0.8), (1, 'F5', 1.2)],                                 # "Five triangles!"
    7: [(0, 'G5', 0.8), (1, 'E5', 1.2)],                                 # "One vertex!"
    8: [(0, 'D5', 0.7), (1, 'G5', 0.7), (2, 'C5', 1.3)],                 # "Eight edges! Pyramid, pyramid!"
    9: [(0, 'C6', 1.5)]
}

def main():
    print("--- Starting Generation of All 10 Audio Files ---")

    # 1. Characteristics Audio Files
    chars_data = [
        ("cube", "Hi! I’m a cube. I have 6 flat square faces, 8 vertices, and 12 straight edges!"),
        ("cuboid", "Hello! I’m a cuboid. I have 6 flat faces, 8 vertices, and 12 straight edges!"),
        ("cylinder", "Hi! I’m a cylinder. I have 1 curved face and 2 flat faces!"),
        ("cone", "Hello! I’m a cone. I have 1 vertex, 1 flat face, and 1 curved face!"),
        ("pyramid", "Hi! I’m a pyramid. I have 1 flat square face, 5 triangular faces, 1 vertex, and 8 straight edges!")
    ]

    for s_id, text in chars_data:
        create_characteristics_audio(s_id, text)

    # 2. Songs Audio Files
    songs_data = [
        (
            "cube",
            "Are you ready? 1, 2, 3, sing with Cube!",
            [
                "Six flat square faces!",
                "Eight vertices too!",
                "Twelve straight edges!",
                "That’s what a cube can do!",
                "Six faces!",
                "Eight vertices!",
                "Twelve edges!",
                "Cube, cube, cube!"
            ],
            melody_cube
        ),
        (
            "cuboid",
            "Let's sing with Cheerful Cuboid!",
            [
                "Six flat faces!",
                "Eight vertices too!",
                "Twelve straight edges!",
                "That’s a cuboid for you!",
                "Six faces!",
                "Eight vertices!",
                "Twelve edges!",
                "Cuboid, cuboid, cuboid!"
            ],
            melody_cuboid
        ),
        (
            "cylinder",
            "Roll and sing with Cylinder!",
            [
                "Two flat faces!",
                "One curved face!",
                "Round and round,",
                "I’m a cylinder shape!",
                "Two flat!",
                "One curved!",
                "Two and one!",
                "Cylinder, cylinder!"
            ],
            melody_cylinder
        ),
        (
            "cone",
            "Ready to sing? Here goes Cone!",
            [
                "One vertex!",
                "One flat face!",
                "One curved face!",
                "That’s my cone shape!",
                "One, one, one!",
                "Easy to remember!",
                "One vertex, one flat,",
                "One curved face!"
            ],
            melody_cone
        ),
        (
            "pyramid",
            "Sing along with Proud Pyramid!",
            [
                "One flat square face!",
                "Five triangular faces!",
                "One vertex!",
                "Eight straight edges!",
                "One square!",
                "Five triangles!",
                "One vertex!",
                "Eight edges! Pyramid, pyramid!"
            ],
            melody_pyramid
        )
    ]

    for s_id, intro, lyrics, mel in songs_data:
        build_song(s_id, intro, lyrics, chords_C, mel)

    print("\n--- All 10 Audio Files Generated Successfully! ---")
    subprocess.run(["ls", "-lh", OUT_DIR])

if __name__ == "__main__":
    main()
