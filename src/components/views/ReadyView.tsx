import React, { useState } from 'react';
import { CuteCharacterSvg } from '../CuteCharacterSvg';
import { soundManager } from '../../services/soundEffects';
import { ArrowRight, Layers, Slash, CircleDot } from 'lucide-react';

interface ReadyViewProps {
  onLetsGo: () => void;
}

export const ReadyView: React.FC<ReadyViewProps> = ({ onLetsGo }) => {
  const [activeConcept, setActiveConcept] = useState<'faces' | 'edges' | 'vertices'>('faces');

  const concepts = [
    {
      id: 'faces' as const,
      title: 'FACES',
      icon: Layers,
      color: 'bg-blue-500 text-white',
      border: 'border-blue-400',
      tagline: 'Flat or Curved Surfaces',
      desc: 'A face is an individual surface of a 3D shape. Some shapes have flat faces (like a cube), and some have curved faces (like a cylinder)!'
    },
    {
      id: 'edges' as const,
      title: 'EDGES',
      icon: Slash,
      color: 'bg-emerald-500 text-white',
      border: 'border-emerald-400',
      tagline: 'Where Two Faces Meet',
      desc: 'An edge is the line segment where two faces join together. Edges can be straight (like on a cube) or curved (like the circular rim of a cylinder)!'
    },
    {
      id: 'vertices' as const,
      title: 'VERTICES',
      icon: CircleDot,
      color: 'bg-amber-500 text-white',
      border: 'border-amber-400',
      tagline: 'Sharp Corner Points',
      desc: 'A vertex (plural: vertices) is a sharp pointy corner point (vertices are always sharp points, never curved!). A cone has 1 sharp vertex at its apex.'
    }
  ];

  const handleConceptClick = (id: 'faces' | 'edges' | 'vertices') => {
    soundManager.playSparkle();
    setActiveConcept(id);
  };

  const handleLetsGoClick = () => {
    soundManager.playCorrect();
    onLetsGo();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 max-w-5xl mx-auto text-center">
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold font-['Fredoka',sans-serif] text-slate-800 tracking-tight mb-2">
        ARE YOU READY?
      </h1>

      <p className="text-xl md:text-2xl font-bold text-amber-700 font-['Quicksand'] mb-6">
        Let’s learn about the characteristics of 3D shapes!
      </p>

      {/* Cheering Characters Strip */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 overflow-x-auto py-2">
        <CuteCharacterSvg shapeId="cube" size={110} expression="cheering" />
        <CuteCharacterSvg shapeId="cuboid" size={110} expression="dancing" />
        <CuteCharacterSvg shapeId="cylinder" size={110} expression="cheering" />
        <CuteCharacterSvg shapeId="cone" size={110} expression="cheering" />
        <CuteCharacterSvg shapeId="pyramid" size={110} expression="dancing" />
      </div>

      {/* Interactive Characteristic Cards (Faces, Edges, Vertices) */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {concepts.map((concept) => {
          const Icon = concept.icon;
          const isSelected = activeConcept === concept.id;
          return (
            <div
              key={concept.id}
              onClick={() => handleConceptClick(concept.id)}
              className={`p-5 rounded-3xl border-3 cursor-pointer text-left transition-all transform hover:-translate-y-1 ${
                isSelected
                  ? `bg-white shadow-xl ${concept.border} ring-4 ring-amber-200`
                  : 'bg-white/70 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 rounded-2xl ${concept.color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold font-['Fredoka'] text-slate-800">
                    {concept.title}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{concept.tagline}</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mt-2">
                {concept.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Demonstration Stage for selected concept */}
      <div className="w-full max-w-3xl bg-amber-100/70 border-2 border-amber-300 rounded-3xl p-4 md:p-6 mb-8 flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="text-left max-w-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Interactive Spotlight
          </span>
          <h4 className="text-2xl font-bold font-['Fredoka'] text-slate-800 capitalize">
            Discovering {activeConcept}!
          </h4>
          <p className="text-sm text-slate-700 mt-1">
            Watch Cube highlight its {activeConcept}! Cube has 6 faces, 12 edges, and 8 vertices.
          </p>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm">
          <CuteCharacterSvg
            shapeId="cube"
            size={180}
            highlight={activeConcept}
            expression="pointing"
          />
        </div>
      </div>

      {/* Large LET’S GO! Button */}
      <button
        onClick={handleLetsGoClick}
        className="group relative inline-flex items-center gap-3 px-10 md:px-14 py-4 md:py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-['Fredoka'] font-bold text-2xl md:text-3xl rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
      >
        <span>LET’S GO!</span>
        <ArrowRight size={32} className="transition-transform group-hover:translate-x-1.5" />
      </button>
    </div>
  );
};
