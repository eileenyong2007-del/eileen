export type ShapeId = 'cube' | 'cuboid' | 'cylinder' | 'cone' | 'pyramid';

export type AppView = 
  | 'welcome' 
  | 'ready' 
  | 'hub' 
  | 'intro' 
  | 'quiz' 
  | 'celebration';

export type HighlightType = 'all' | 'faces' | 'edges' | 'vertices' | 'curved' | 'none';

export interface ShapeCharacteristic {
  id: 'faces' | 'edges' | 'vertices' | 'curved';
  label: string;
  count: number | string;
  detail: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  visualType?: 'faces' | 'edges' | 'vertices' | 'shape';
}

export interface MemorySongData {
  title: string;
  vibe: string;
  lines: string[];
  fullLyrics: string;
}

export interface BulletCharacteristic {
  count: number | string;
  label: string;
  type: 'faces' | 'edges' | 'vertices' | 'curved';
}

export interface ShapeData {
  id: ShapeId;
  name: string;
  characterTitle: string;
  colorHex: string;
  accentHex: string;
  badgeBg: string;
  badgeText: string;
  greeting: string;
  speechSummary: string;
  narrationText: string;
  bullets: BulletCharacteristic[];
  characteristics: ShapeCharacteristic[];
  memorySong: MemorySongData;
  funFact: string;
}
