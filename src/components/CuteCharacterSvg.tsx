import React, { useEffect, useState } from 'react';
import { ShapeId, HighlightType } from '../types';

interface CuteCharacterSvgProps {
  shapeId: ShapeId;
  size?: number | string;
  expression?: 'happy' | 'waving' | 'cheering' | 'talking' | 'pointing' | 'dancing';
  highlight?: HighlightType;
  interactivePoints?: boolean;
  onPointClick?: (type: 'face' | 'edge' | 'vertex', index: number) => void;
  className?: string;
}

export const CuteCharacterSvg: React.FC<CuteCharacterSvgProps> = ({
  shapeId,
  size = 280,
  expression = 'happy',
  highlight = 'none',
  interactivePoints = false,
  onPointClick,
  className = ''
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [talkFrame, setTalkFrame] = useState(0);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Talk animation mouth cycle
  useEffect(() => {
    if (expression === 'talking') {
      const talkInterval = setInterval(() => {
        setTalkFrame((prev) => (prev + 1) % 4);
      }, 150);
      return () => clearInterval(talkInterval);
    }
  }, [expression]);

  const isHighlighted = (type: HighlightType) => {
    if (highlight === 'all') return true;
    if (highlight === type) return true;
    if (highlight === 'faces' && type === 'curved') return true;
    return false;
  };

  // Render Cute Eyes
  const renderEyes = (cx1: number, cy1: number, cx2: number, cy2: number, r: number = 8) => {
    if (isBlinking) {
      return (
        <g className="transition-all duration-100">
          <path d={`M ${cx1 - r} ${cy1} Q ${cx1} ${cy1 - r * 0.7} ${cx1 + r} ${cy1}`} stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d={`M ${cx2 - r} ${cy2} Q ${cx2} ${cy2 - r * 0.7} ${cx2 + r} ${cy2}`} stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>
      );
    }

    const eyeScaleY = expression === 'cheering' || expression === 'dancing' ? 0.8 : 1;

    return (
      <g className="transition-all duration-200">
        {/* Eye 1 */}
        <ellipse cx={cx1} cy={cy1} rx={r} ry={r * eyeScaleY} fill="#0F172A" />
        <ellipse cx={cx1 - r * 0.3} cy={cy1 - r * 0.3} rx={r * 0.38} ry={r * 0.38} fill="#FFFFFF" />
        <circle cx={cx1 + r * 0.35} cy={cy1 + r * 0.25} r={r * 0.18} fill="#FFFFFF" />

        {/* Eye 2 */}
        <ellipse cx={cx2} cy={cy2} rx={r} ry={r * eyeScaleY} fill="#0F172A" />
        <ellipse cx={cx2 - r * 0.3} cy={cy2 - r * 0.3} rx={r * 0.38} ry={r * 0.38} fill="#FFFFFF" />
        <circle cx={cx2 + r * 0.35} cy={cy2 + r * 0.25} r={r * 0.18} fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx={cx1 - r * 0.8} cy={cy1 + r * 0.9} rx={r * 0.65} ry={r * 0.4} fill="#F43F5E" opacity="0.45" />
        <ellipse cx={cx2 + r * 0.8} cy={cy2 + r * 0.9} rx={r * 0.65} ry={r * 0.4} fill="#F43F5E" opacity="0.45" />
      </g>
    );
  };

  // Render Cute Mouth
  const renderMouth = (cx: number, cy: number, width: number = 22) => {
    if (expression === 'talking') {
      const openHeight = talkFrame % 2 === 0 ? 12 : 6;
      return (
        <path
          d={`M ${cx - width / 2} ${cy} Q ${cx} ${cy + openHeight * 1.5} ${cx + width / 2} ${cy} Z`}
          fill="#E11D48"
          stroke="#0F172A"
          strokeWidth="2.5"
          className="transition-all duration-75"
        />
      );
    }

    if (expression === 'cheering' || expression === 'dancing') {
      return (
        <g>
          <path
            d={`M ${cx - width / 2} ${cy} Q ${cx} ${cy + 16} ${cx + width / 2} ${cy} Z`}
            fill="#E11D48"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Cute Tongue */}
          <path
            d={`M ${cx - 5} ${cy + 8} Q ${cx} ${cy + 13} ${cx + 5} ${cy + 8} Z`}
            fill="#FDA4AF"
          />
        </g>
      );
    }

    // Default friendly smile
    return (
      <path
        d={`M ${cx - width / 2} ${cy} Q ${cx} ${cy + 10} ${cx + width / 2} ${cy}`}
        fill="none"
        stroke="#0F172A"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    );
  };

  // Render Cute Arms & Hands
  const renderArms = (leftJoint: [number, number], rightJoint: [number, number]) => {
    const isWaving = expression === 'waving';
    const isCheering = expression === 'cheering' || expression === 'dancing';
    const isPointing = expression === 'pointing';

    // Left Arm
    const leftArmD = isCheering
      ? `M ${leftJoint[0]} ${leftJoint[1]} Q ${leftJoint[0] - 25} ${leftJoint[1] - 30} ${leftJoint[0] - 32} ${leftJoint[1] - 40}`
      : `M ${leftJoint[0]} ${leftJoint[1]} Q ${leftJoint[0] - 22} ${leftJoint[1] + 10} ${leftJoint[0] - 28} ${leftJoint[1] + 25}`;

    // Right Arm (Waving or Pointing)
    const rightArmD = isWaving
      ? `M ${rightJoint[0]} ${rightJoint[1]} Q ${rightJoint[0] + 20} ${rightJoint[1] - 20} ${rightJoint[0] + 32} ${rightJoint[1] - 38}`
      : isPointing
      ? `M ${rightJoint[0]} ${rightJoint[1]} Q ${rightJoint[0] + 28} ${rightJoint[1] - 12} ${rightJoint[0] + 42} ${rightJoint[1] - 18}`
      : isCheering
      ? `M ${rightJoint[0]} ${rightJoint[1]} Q ${rightJoint[0] + 25} ${rightJoint[1] - 30} ${rightJoint[0] + 32} ${rightJoint[1] - 40}`
      : `M ${rightJoint[0]} ${rightJoint[1]} Q ${rightJoint[0] + 22} ${rightJoint[1] + 10} ${rightJoint[0] + 28} ${rightJoint[1] + 25}`;

    return (
      <g>
        {/* Left Arm & Hand */}
        <path d={leftArmD} stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <circle
          cx={isCheering ? leftJoint[0] - 32 : leftJoint[0] - 28}
          cy={isCheering ? leftJoint[1] - 40 : leftJoint[1] + 25}
          r="7"
          fill="#FDE047"
          stroke="#1E293B"
          strokeWidth="2.5"
        />

        {/* Right Arm & Hand */}
        <path d={rightArmD} stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <circle
          cx={
            isWaving
              ? rightJoint[0] + 32
              : isPointing
              ? rightJoint[0] + 42
              : isCheering
              ? rightJoint[0] + 32
              : rightJoint[0] + 28
          }
          cy={
            isWaving
              ? rightJoint[1] - 38
              : isPointing
              ? rightJoint[1] - 18
              : isCheering
              ? rightJoint[1] - 40
              : rightJoint[1] + 25
          }
          r="7"
          fill="#FDE047"
          stroke="#1E293B"
          strokeWidth="2.5"
        />
      </g>
    );
  };

  // Render Cute Legs & Shoes
  const renderLegs = (lx: number, ly: number, rx: number, ry: number) => {
    return (
      <g>
        {/* Left Leg & Shoe */}
        <line x1={lx} y1={ly} x2={lx} y2={ly + 24} stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" />
        <ellipse cx={lx - 4} cy={ly + 27} rx="12" ry="7" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.5" />
        <ellipse cx={lx - 6} cy={ly + 25} rx="4" ry="2" fill="#FFFFFF" opacity="0.6" />

        {/* Right Leg & Shoe */}
        <line x1={rx} y1={ry} x2={rx} y2={ry + 24} stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" />
        <ellipse cx={rx + 4} cy={ry + 27} rx="12" ry="7" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.5" />
        <ellipse cx={rx + 2} cy={ry + 25} rx="4" ry="2" fill="#FFFFFF" opacity="0.6" />
      </g>
    );
  };

  // Render Vertex Markers (when vertices highlighted)
  const renderVertex = (x: number, y: number, label: string | number, idx: number) => {
    const active = isHighlighted('vertices');
    return (
      <g
        key={`v-${idx}`}
        className={`transition-all duration-300 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}
        onClick={() => interactivePoints && onPointClick && onPointClick('vertex', idx)}
        style={{ cursor: interactivePoints ? 'pointer' : 'default' }}
      >
        <circle cx={x} cy={y} r="14" fill="#FBBF24" opacity="0.35" className="animate-ping" />
        <circle cx={x} cy={y} r="10" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
        <text x={x} y={y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="Fredoka, sans-serif">
          {label}
        </text>
      </g>
    );
  };

  // Render Edge Overlay (when edges highlighted)
  const renderEdge = (x1: number, y1: number, x2: number, y2: number, idx: number) => {
    const active = isHighlighted('edges');
    return (
      <g key={`e-${idx}`} className={`transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10B981" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      </g>
    );
  };

  // Bounce class for cheering/dancing
  const bounceClass =
    expression === 'cheering' || expression === 'dancing'
      ? 'animate-bounce'
      : expression === 'waving'
      ? 'transition-transform hover:-translate-y-2'
      : '';

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${bounceClass} ${className}`}>
      <svg
        viewBox="0 0 320 320"
        width={size}
        height={size}
        className="overflow-visible filter drop-shadow-lg"
      >
        <defs>
          <linearGradient id="cubeGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="cubeGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="cubeGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="cuboidGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="cuboidGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="cuboidGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          <linearGradient id="cylGradBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="cylGradTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="pyrGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="pyrGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
        </defs>

        {/* --- SHAPE SPECIFIC RENDERING --- */}

        {/* 1. CUBE */}
        {shapeId === 'cube' && (
          <g>
            {/* Legs */}
            {renderLegs(120, 230, 200, 230)}

            {/* Base shadow */}
            <ellipse cx="160" cy="245" rx="80" ry="18" fill="#CBD5E1" opacity="0.6" />

            {/* Arms */}
            {renderArms([78, 175], [242, 175])}

            {/* 3D Isometric Cube geometry */}
            {/* Flat Square Face 1 */}
            <polygon
              points="160,50 240,95 160,140 80,95"
              fill={isHighlighted('faces') ? '#FDE047' : 'url(#cubeGradTop)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Right Face */}
            <polygon
              points="160,140 240,95 240,195 160,240"
              fill={isHighlighted('faces') ? '#FBBF24' : 'url(#cubeGradRight)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Front Left Face (Cute Character Face) */}
            <polygon
              points="80,95 160,140 160,240 80,195"
              fill={isHighlighted('faces') ? '#FEF08A' : 'url(#cubeGradFront)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Character Face on Front Left */}
            <g transform="translate(10, 10)">
              {renderEyes(100, 150, 136, 168, 8)}
              {renderMouth(118, 182, 22)}
            </g>

            {/* Edges Highlight */}
            {renderEdge(80, 95, 160, 50, 1)}
            {renderEdge(160, 50, 240, 95, 2)}
            {renderEdge(240, 95, 160, 140, 3)}
            {renderEdge(160, 140, 80, 95, 4)}
            {renderEdge(80, 95, 80, 195, 5)}
            {renderEdge(160, 140, 160, 240, 6)}
            {renderEdge(240, 95, 240, 195, 7)}
            {renderEdge(80, 195, 160, 240, 8)}
            {renderEdge(160, 240, 240, 195, 9)}

            {/* Vertices Highlight (8 vertices) */}
            {renderVertex(160, 50, '1', 0)}
            {renderVertex(240, 95, '2', 1)}
            {renderVertex(160, 140, '3', 2)}
            {renderVertex(80, 95, '4', 3)}
            {renderVertex(80, 195, '5', 4)}
            {renderVertex(160, 240, '6', 5)}
            {renderVertex(240, 195, '7', 6)}
            {renderVertex(160, 180, '8', 7)}
          </g>
        )}

        {/* 2. CUBOID (4 Flat Rectangular Faces + 2 Flat Square Faces) */}
        {shapeId === 'cuboid' && (
          <g>
            {/* Legs */}
            {renderLegs(115, 238, 205, 238)}

            {/* Shadow */}
            <ellipse cx="160" cy="248" rx="85" ry="18" fill="#CBD5E1" opacity="0.6" />

            {/* Arms */}
            {renderArms([80, 155], [240, 155])}

            {/* Flat Square Face 1 (End Cap Square) */}
            <polygon
              points="160,40 230,75 160,110 90,75"
              fill={isHighlighted('faces') ? '#FDE047' : '#F59E0B'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Side Flat Rectangular Face (Tall Rectangle) */}
            <polygon
              points="160,110 230,75 230,210 160,245"
              fill={isHighlighted('faces') ? '#34D399' : 'url(#cuboidGradRight)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Front Flat Rectangular Face (Tall Rectangle with Character Face) */}
            <polygon
              points="90,75 160,110 160,245 90,210"
              fill={isHighlighted('faces') ? '#10B981' : 'url(#cuboidGradFront)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Character Face on Front Rectangular Surface */}
            <g transform="translate(5, 12)">
              {renderEyes(106, 140, 142, 158, 8)}
              {renderMouth(124, 180, 22)}
            </g>

            {/* Edges Highlight (12 Straight Edges) */}
            {renderEdge(90, 75, 160, 40, 1)}
            {renderEdge(160, 40, 230, 75, 2)}
            {renderEdge(230, 75, 160, 110, 3)}
            {renderEdge(160, 110, 90, 75, 4)}
            {renderEdge(90, 75, 90, 210, 5)}
            {renderEdge(160, 110, 160, 245, 6)}
            {renderEdge(230, 75, 230, 210, 7)}
            {renderEdge(90, 210, 160, 245, 8)}
            {renderEdge(160, 245, 230, 210, 9)}

            {/* Vertices (8 Vertices) */}
            {renderVertex(160, 40, '1', 0)}
            {renderVertex(230, 75, '2', 1)}
            {renderVertex(160, 110, '3', 2)}
            {renderVertex(90, 75, '4', 3)}
            {renderVertex(90, 210, '5', 4)}
            {renderVertex(160, 245, '6', 5)}
            {renderVertex(230, 210, '7', 6)}
            {renderVertex(160, 175, '8', 7)}
          </g>
        )}

        {/* 3. CYLINDER */}
        {shapeId === 'cylinder' && (
          <g>
            {/* Legs */}
            {renderLegs(125, 228, 195, 228)}

            {/* Shadow */}
            <ellipse cx="160" cy="242" rx="75" ry="18" fill="#CBD5E1" opacity="0.6" />

            {/* Arms */}
            {renderArms([92, 155], [228, 155])}

            {/* Cylinder Body */}
            <rect
              x="95"
              y="90"
              width="130"
              height="125"
              fill={isHighlighted('curved') ? '#FDE047' : 'url(#cylGradBody)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />
            {/* Bottom Ellipse */}
            <ellipse
              cx="160"
              cy="215"
              rx="65"
              ry="22"
              fill={isHighlighted('faces') ? '#FBBF24' : 'url(#cylGradBody)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />
            {/* Bottom Edge highlight */}
            {isHighlighted('edges') && (
              <path d="M 95 215 A 65 22 0 0 0 225 215" stroke="#10B981" strokeWidth="7" fill="none" strokeLinecap="round" />
            )}

            {/* Character Face on Body */}
            {renderEyes(138, 150, 182, 150, 8)}
            {renderMouth(160, 175, 24)}

            {/* Top Flat Circle Face */}
            <ellipse
              cx="160"
              cy="90"
              rx="65"
              ry="22"
              fill={isHighlighted('faces') ? '#FDE047' : 'url(#cylGradTop)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />
            {/* Top Edge highlight */}
            {isHighlighted('edges') && (
              <ellipse cx="160" cy="90" rx="65" ry="22" stroke="#10B981" strokeWidth="7" fill="none" />
            )}
          </g>
        )}

        {/* 4. CONE */}
        {shapeId === 'cone' && (
          <g>
            {/* Legs */}
            {renderLegs(125, 230, 195, 230)}

            {/* Shadow */}
            <ellipse cx="160" cy="242" rx="75" ry="18" fill="#CBD5E1" opacity="0.6" />

            {/* Arms */}
            {renderArms([100, 180], [220, 180])}

            {/* Cone Body (Apex 160,50 down to curved base) */}
            <path
              d="M 160 50 L 95 210 A 65 22 0 0 0 225 210 Z"
              fill={isHighlighted('curved') ? '#FDE047' : 'url(#coneGrad)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Bottom Flat Circle Base */}
            <ellipse
              cx="160"
              cy="210"
              rx="65"
              ry="22"
              fill={isHighlighted('faces') ? '#FBBF24' : '#D97706'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Character Face on Cone Body */}
            {renderEyes(142, 160, 178, 160, 8)}
            {renderMouth(160, 182, 22)}

            {/* 1 Vertex at Apex (Top) */}
            {renderVertex(160, 50, '1', 0)}
          </g>
        )}

        {/* 5. PYRAMID */}
        {shapeId === 'pyramid' && (
          <g>
            {/* Legs */}
            {renderLegs(125, 232, 195, 232)}

            {/* Shadow */}
            <ellipse cx="160" cy="245" rx="85" ry="18" fill="#CBD5E1" opacity="0.6" />

            {/* Arms */}
            {renderArms([80, 180], [240, 180])}

            {/* Base indicator (visible flat square base outline) */}
            <polygon
              points="160,230 85,200 160,180 235,200"
              fill={isHighlighted('faces') ? '#FDE047' : '#5B21B6'}
              stroke="#1E293B"
              strokeWidth="2.5"
              opacity="0.8"
            />

            {/* Left Triangular Face */}
            <polygon
              points="160,50 85,200 160,230"
              fill={isHighlighted('faces') ? '#FEF08A' : 'url(#pyrGradLeft)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Right Triangular Face */}
            <polygon
              points="160,50 160,230 235,200"
              fill={isHighlighted('faces') ? '#FBBF24' : 'url(#pyrGradRight)'}
              stroke="#1E293B"
              strokeWidth="3.5"
              className="transition-colors duration-300"
            />

            {/* Character Face in center */}
            {renderEyes(142, 160, 178, 160, 8)}
            {renderMouth(160, 184, 22)}

            {/* Edges Highlight (8 edges) */}
            {renderEdge(160, 50, 85, 200, 1)}
            {renderEdge(160, 50, 160, 230, 2)}
            {renderEdge(160, 50, 235, 200, 3)}
            {renderEdge(85, 200, 160, 230, 4)}
            {renderEdge(160, 230, 235, 200, 5)}
            {renderEdge(235, 200, 160, 180, 6)}
            {renderEdge(160, 180, 85, 200, 7)}
            {renderEdge(160, 50, 160, 180, 8)}

            {/* Vertices Highlight (5 vertices: 1 apex + 4 base corners) */}
            {renderVertex(160, 50, '1', 0)}
            {renderVertex(85, 200, '2', 1)}
            {renderVertex(160, 230, '3', 2)}
            {renderVertex(235, 200, '4', 3)}
            {renderVertex(160, 180, '5', 4)}
          </g>
        )}
      </svg>
    </div>
  );
};
