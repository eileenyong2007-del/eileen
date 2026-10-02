import { ShapeData, QuizQuestion } from '../types';

export const SHAPES_DATA: Record<string, ShapeData> = {
  cube: {
    id: 'cube',
    name: 'Cube',
    characterTitle: 'Cool Cube',
    colorHex: '#3B82F6',
    accentHex: '#60A5FA',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    greeting: "Hi! I’m a cube!",
    speechSummary: "I have 6 flat square faces, 8 vertices, and 12 straight edges!",
    narrationText: "Hi! I’m a cube. I have 6 flat square faces, 8 vertices, and 12 straight edges!",
    bullets: [
      { count: '6', label: 'flat square faces', type: 'faces' },
      { count: '8', label: 'vertices', type: 'vertices' },
      { count: '12', label: 'straight edges', type: 'edges' }
    ],
    characteristics: [
      {
        id: 'faces',
        label: 'Flat Square Faces',
        count: 6,
        detail: '6 identical flat square faces on all sides.',
        color: 'bg-blue-50 border-blue-400 text-blue-700'
      },
      {
        id: 'vertices',
        label: 'Vertices',
        count: 8,
        detail: '8 corner points where edges meet.',
        color: 'bg-indigo-50 border-indigo-400 text-indigo-700'
      },
      {
        id: 'edges',
        label: 'Straight Edges',
        count: 12,
        detail: '12 straight edges, all equal length.',
        color: 'bg-sky-50 border-sky-400 text-sky-700'
      }
    ],
    memorySong: {
      title: "That's a Cube!",
      vibe: 'Cheerful and bouncy',
      lines: [
        'Cube, Cube, look at me!',
        'Six square faces, 1, 2, 3!',
        '4, 5, 6, six faces, right?',
        'Eight vertices, what a sight!',
        '12 straight edges, count them too!',
        'Six faces, eight vertices,',
        '12 straight edges, that’s a cube!'
      ],
      fullLyrics:
        "Cube, Cube, look at me!\nSix square faces, 1, 2, 3!\n4, 5, 6, six faces, right?\nEight vertices, what a sight!\n12 straight edges, count them too!\nSix faces, eight vertices,\n12 straight edges, that’s a cube!"
    },
    funFact: 'Dice, ice cubes, and gift boxes are real-life cubes!'
  },

  cuboid: {
    id: 'cuboid',
    name: 'Cuboid',
    characterTitle: 'Cheerful Cuboid',
    colorHex: '#10B981',
    accentHex: '#34D399',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    greeting: "Hello! I’m a cuboid!",
    speechSummary: "I have 6 flat faces, 8 vertices, and 12 straight edges!",
    narrationText: "Hello! I’m a cuboid. I have 6 flat faces, 8 vertices, and 12 straight edges!",
    bullets: [
      { count: '6', label: 'flat faces', type: 'faces' },
      { count: '8', label: 'vertices', type: 'vertices' },
      { count: '12', label: 'straight edges', type: 'edges' }
    ],
    characteristics: [
      {
        id: 'faces',
        label: 'Flat Faces',
        count: 6,
        detail: '6 flat faces (4 rectangular faces and 2 square faces).',
        color: 'bg-emerald-50 border-emerald-400 text-emerald-700'
      },
      {
        id: 'vertices',
        label: 'Vertices',
        count: 8,
        detail: '8 corner vertices where straight edges meet.',
        color: 'bg-teal-50 border-teal-400 text-teal-700'
      },
      {
        id: 'edges',
        label: 'Straight Edges',
        count: 12,
        detail: '12 straight edges joining my 6 flat faces.',
        color: 'bg-green-50 border-green-400 text-green-700'
      }
    ],
    memorySong: {
      title: 'Cuboid',
      vibe: 'Friendly and catchy',
      lines: [
        'Cuboid, Cuboid, here we go!',
        'Six flat faces, nice and neat!',
        'Eight vertices, count them all!',
        '12 straight edges standing tall!',
        'Six flat faces, eight vertices,',
        '12 straight edges, sing with me!',
        '6, 8, 12, now you know!',
        'Cuboid, Cuboid, here we go!'
      ],
      fullLyrics:
        "Cuboid, Cuboid, here we go!\nSix flat faces, nice and neat!\nEight vertices, count them all!\n12 straight edges standing tall!\nSix flat faces, eight vertices,\n12 straight edges, sing with me!\n6, 8, 12, now you know!\nCuboid, Cuboid, here we go!"
    },
    funFact: 'Brick blocks, cereal boxes, and books are all cuboids!'
  },

  cylinder: {
    id: 'cylinder',
    name: 'Cylinder',
    characterTitle: 'Playful Cylinder',
    colorHex: '#EC4899',
    accentHex: '#F472B6',
    badgeBg: 'bg-pink-100',
    badgeText: 'text-pink-800',
    greeting: "Hi! I’m a cylinder!",
    speechSummary: "I have 1 curved face and 2 flat faces!",
    narrationText: "Hi! I’m a cylinder. I have 1 curved face and 2 flat faces!",
    bullets: [
      { count: '1', label: 'curved face', type: 'curved' },
      { count: '2', label: 'flat faces', type: 'faces' }
    ],
    characteristics: [
      {
        id: 'curved',
        label: 'Curved Face',
        count: 1,
        detail: '1 smooth curved face wrapping around my body.',
        color: 'bg-pink-50 border-pink-400 text-pink-700'
      },
      {
        id: 'faces',
        label: 'Flat Faces',
        count: 2,
        detail: '2 flat circular faces at top and bottom.',
        color: 'bg-rose-50 border-rose-400 text-rose-700'
      }
    ],
    memorySong: {
      title: 'Cylinder',
      vibe: 'Fun and rhythmic',
      lines: [
        'Cylinder, Cylinder, round and tall!',
        'One curved face goes round and round!',
        'Two flat faces, one on each side!',
        'Look at my shape, what a fun ride!',
        'One curved face, two flat faces,',
        'Round and round in different places!',
        '1, 2, 3, now you know!',
        'Cylinder, Cylinder, let’s go!'
      ],
      fullLyrics:
        "Cylinder, Cylinder, round and tall!\nOne curved face goes round and round!\nTwo flat faces, one on each side!\nLook at my shape, what a fun ride!\nOne curved face, two flat faces,\nRound and round in different places!\n1, 2, 3, now you know!\nCylinder, Cylinder, let’s go!"
    },
    funFact: 'Soda cans, batteries, and drinking glasses are cylinders!'
  },

  cone: {
    id: 'cone',
    name: 'Cone',
    characterTitle: 'Cute Cone',
    colorHex: '#F59E0B',
    accentHex: '#FBBF24',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    greeting: "Hello! I’m a cone!",
    speechSummary: "I have 1 vertex, 1 flat face, and 1 curved face!",
    narrationText: "Hello! I’m a cone. I have 1 vertex, 1 flat face, and 1 curved face!",
    bullets: [
      { count: '1', label: 'vertex', type: 'vertices' },
      { count: '1', label: 'flat face', type: 'faces' },
      { count: '1', label: 'curved face', type: 'curved' }
    ],
    characteristics: [
      {
        id: 'vertices',
        label: 'Vertex',
        count: 1,
        detail: '1 pointy apex vertex at my top.',
        color: 'bg-amber-50 border-amber-400 text-amber-700'
      },
      {
        id: 'faces',
        label: 'Flat Face',
        count: 1,
        detail: '1 flat circular face at my base.',
        color: 'bg-yellow-50 border-yellow-400 text-yellow-700'
      },
      {
        id: 'curved',
        label: 'Curved Face',
        count: 1,
        detail: '1 smooth curved face that slopes up to the vertex.',
        color: 'bg-orange-50 border-orange-400 text-orange-700'
      }
    ],
    memorySong: {
      title: 'Cone',
      vibe: 'Cute and energetic',
      lines: [
        'Cone, Cone, look at me!',
        'One vertex at the top you see!',
        'One flat face, nice and round!',
        'One curved face goes all around!',
        'One vertex, one flat face,',
        'One curved face, that’s my shape!',
        'Pointy top and round below!',
        'Cone, Cone, now you know!'
      ],
      fullLyrics:
        "Cone, Cone, look at me!\nOne vertex at the top you see!\nOne flat face, nice and round!\nOne curved face goes all around!\nOne vertex, one flat face,\nOne curved face, that’s my shape!\nPointy top and round below!\nCone, Cone, now you know!"
    },
    funFact: 'Party hats, traffic cones, and ice cream cones are all cones!'
  },

  pyramid: {
    id: 'pyramid',
    name: 'Pyramid',
    characterTitle: 'Proud Pyramid',
    colorHex: '#8B5CF6',
    accentHex: '#A78BFA',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    greeting: "Hi! I’m a pyramid!",
    speechSummary: "I have 1 flat square face, 5 triangular faces, 5 vertices, and 8 straight edges!",
    narrationText: "Hi! I’m a pyramid. I have 1 flat square face, 5 triangular faces, 5 vertices, and 8 straight edges!",
    bullets: [
      { count: '1', label: 'flat square face', type: 'faces' },
      { count: '5', label: 'triangular faces', type: 'faces' },
      { count: '5', label: 'vertices', type: 'vertices' },
      { count: '8', label: 'straight edges', type: 'edges' }
    ],
    characteristics: [
      {
        id: 'faces',
        label: 'Flat Square Face',
        count: 1,
        detail: '1 flat square face at my bottom base.',
        color: 'bg-violet-50 border-violet-400 text-violet-700'
      },
      {
        id: 'faces',
        label: 'Triangular Faces',
        count: 5,
        detail: 'Triangular faces that meet at the top apex.',
        color: 'bg-purple-50 border-purple-400 text-purple-700'
      },
      {
        id: 'vertices',
        label: 'Vertices',
        count: 5,
        detail: '5 sharp vertices (4 base corners + 1 apex).',
        color: 'bg-indigo-50 border-indigo-400 text-indigo-700'
      },
      {
        id: 'edges',
        label: 'Straight Edges',
        count: 8,
        detail: '8 straight edges joining the faces.',
        color: 'bg-fuchsia-50 border-fuchsia-400 text-fuchsia-700'
      }
    ],
    memorySong: {
      title: 'Pyramid, Pyramid',
      vibe: 'Exciting and easy to remember',
      lines: [
        'Pyramid, Pyramid, look at me!',
        'One square face, can you see?',
        'Five triangular faces too,',
        "Five vertices — that's my clue!",
        'Eight straight edges, count them all!',
        'One, two, three, four, five, six, seven, eight!',
        'One square, five triangles too,',
        'Pyramid, Pyramid — now you know!'
      ],
      fullLyrics:
        "Pyramid, Pyramid, look at me!\nOne square face, can you see?\nFive triangular faces too,\nFive vertices — that's my clue!\n\nEight straight edges, count them all!\nOne, two, three, four, five, six, seven, eight!\nOne square, five triangles too,\nPyramid, Pyramid — now you know!"
    },
    funFact: 'The Great Pyramids in Egypt are famous real-life pyramids!'
  }
};

export const SHAPES_CHALLENGE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How many flat square faces does a Cube have?',
    options: ['4 flat square faces', '6 flat square faces', '8 flat square faces', '12 flat square faces'],
    correctIndex: 1,
    hint: 'Think of a game die with dots numbered from 1 to 6!',
    explanation: 'A cube has exactly 6 flat square faces, 8 vertices, and 12 straight edges.',
    visualType: 'faces'
  },
  {
    id: 'q2',
    question: 'How many curved faces and flat faces does a Cylinder have?',
    options: [
      '1 curved face and 2 flat faces',
      '2 curved faces and 1 flat face',
      '0 curved faces and 4 flat faces',
      '3 curved faces and 0 flat faces'
    ],
    correctIndex: 0,
    hint: 'Remember the song: "Two flat faces! One curved face!"',
    explanation: 'A cylinder has 1 curved face and 2 flat circular faces!',
    visualType: 'faces'
  },
  {
    id: 'q3',
    question: 'How many vertices does a Cone have?',
    options: ['0 vertices', '1 vertex', '2 vertices', '4 vertices'],
    correctIndex: 1,
    hint: 'Look at the pointy tip at the top apex!',
    explanation: 'A cone has 1 vertex, 1 flat face, and 1 curved face.',
    visualType: 'vertices'
  },
  {
    id: 'q4',
    question: 'What are the characteristics of a Cuboid?',
    options: [
      '6 flat faces, 8 vertices, and 12 straight edges',
      '4 flat faces, 4 vertices, and 6 straight edges',
      '2 curved faces, 2 vertices, and 4 straight edges',
      '1 flat face and 5 curved faces'
    ],
    correctIndex: 0,
    hint: 'Just like a cube, a cuboid has 6 flat faces, 8 vertices, and 12 straight edges!',
    explanation: 'A cuboid has 6 flat faces, 8 vertices, and 12 straight edges.',
    visualType: 'faces'
  },
  {
    id: 'q5',
    question: 'According to our Pyramid lesson, what characteristics does a Pyramid have?',
    options: [
      '1 flat square face, 5 triangular faces, 1 vertex, and 8 straight edges',
      '6 square faces, 8 vertices, and 12 edges',
      '2 flat circular faces and 1 curved face',
      '0 vertices and 4 curved faces'
    ],
    correctIndex: 0,
    hint: 'Remember the song: "One square! Five triangles! One vertex! Eight edges!"',
    explanation: 'A pyramid has 1 flat square face, 5 triangular faces, 1 vertex, and 8 straight edges.',
    visualType: 'faces'
  }
];

export const ALL_SHAPES_CHALLENGE_QUESTIONS = SHAPES_CHALLENGE_QUESTIONS;
