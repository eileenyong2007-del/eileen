import React from 'react';
import { ShapeId } from '../../types';
import { CuteCharacterSvg } from '../CuteCharacterSvg';
import { soundManager } from '../../services/soundEffects';
import { Trophy, Sparkles, ArrowRight } from 'lucide-react';

interface ShapeHubViewProps {
  onSelectShape: (shapeId: ShapeId) => void;
  onChallengeAll: () => void;
}

export const ShapeHubView: React.FC<ShapeHubViewProps> = ({
  onSelectShape,
  onChallengeAll
}) => {
  const shapesList: {
    id: ShapeId;
    name: string;
    bgHover: string;
    borderCol: string;
    btnCol: string;
  }[] = [
    {
      id: 'cube',
      name: 'CUBE',
      bgHover: 'hover:bg-blue-50/90',
      borderCol: 'border-blue-300',
      btnCol: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'cuboid',
      name: 'CUBOID',
      bgHover: 'hover:bg-emerald-50/90',
      borderCol: 'border-emerald-300',
      btnCol: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: 'cylinder',
      name: 'CYLINDER',
      bgHover: 'hover:bg-pink-50/90',
      borderCol: 'border-pink-300',
      btnCol: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      id: 'cone',
      name: 'CONE',
      bgHover: 'hover:bg-amber-50/90',
      borderCol: 'border-amber-300',
      btnCol: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      id: 'pyramid',
      name: 'PYRAMID',
      bgHover: 'hover:bg-purple-50/90',
      borderCol: 'border-purple-300',
      btnCol: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const handleShapeClick = (shapeId: ShapeId) => {
    soundManager.playShapeSelect(shapeId);
    onSelectShape(shapeId);
  };

  const handleAllClick = () => {
    soundManager.playCorrect();
    onChallengeAll();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 max-w-6xl mx-auto text-center">
      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold font-['Fredoka',sans-serif] text-slate-800 tracking-tight mb-2">
        CHOOSE YOUR 3D SHAPE!
      </h1>

      {/* Instruction */}
      <p className="text-lg md:text-2xl font-bold text-amber-700 font-['Quicksand'] mb-8">
        Which shape would you like to explore?
      </p>

      {/* Five Large Clickable Cute Characters Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {shapesList.map((shape) => (
          <div
            key={shape.id}
            onClick={() => handleShapeClick(shape.id)}
            className={`group bg-white rounded-3xl p-6 border-3 ${shape.borderCol} shadow-lg transition-all transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between ${shape.bgHover}`}
          >
            <div className="relative w-full flex items-center justify-center py-4">
              <CuteCharacterSvg
                shapeId={shape.id}
                size={210}
                expression="waving"
                className="transition-transform group-hover:scale-110"
              />
            </div>

            <div className="w-full mt-2 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold font-['Fredoka'] text-slate-800 tracking-wide mb-1">
                {shape.name}
              </h2>

              <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold text-slate-500">
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg">📐 Characteristics</span>
                <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg">🎵 Memory Song</span>
              </div>

              <button
                className={`w-full py-3.5 text-white font-['Fredoka'] font-bold text-lg md:text-xl rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer ${shape.btnCol}`}
              >
                <span>EXPLORE {shape.name}!</span>
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        ))}

        {/* Special 3D Shapes Master Quiz Card */}
        <div
          onClick={handleAllClick}
          className="group bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 border-3 border-amber-300 shadow-xl transition-all transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer flex flex-col items-center justify-between text-white"
        >
          <div className="w-full flex flex-col items-center justify-center py-6">
            <div className="p-4 bg-white/20 rounded-full mb-3 backdrop-blur-xs">
              <Trophy size={56} className="text-yellow-100 animate-bounce" />
            </div>
            <div className="flex items-center gap-1.5 text-yellow-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Master Explorer Quiz</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-['Fredoka'] tracking-wide">
              3D SHAPES QUIZ!
            </h2>
          </div>

          <div className="w-full text-center">
            <p className="text-xs md:text-sm text-amber-50 font-medium mb-4">
              Test your knowledge on Cube, Cuboid, Cylinder, Cone, and Pyramid faces, edges, and vertices!
            </p>

            <button className="w-full py-3.5 bg-white hover:bg-amber-50 text-amber-900 font-['Fredoka'] font-bold text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Trophy size={20} className="text-amber-600" />
              <span>START 3D SHAPES QUIZ!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
