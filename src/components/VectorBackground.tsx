import React from 'react';

export const VectorBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-bg">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="opacity-100"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        
        {/* Main Grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Floor Line */}
        <line x1="0" y1="920" x2="1000" y2="920" stroke="#1e293b" strokeWidth="2" opacity="0.1" />
      </svg>
    </div>
  );
};
