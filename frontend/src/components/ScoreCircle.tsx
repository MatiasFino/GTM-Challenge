import React from 'react';

interface ScoreCircleProps {
  score: number;
  size?: number;
}

export default function ScoreCircle({ score, size = 120 }: ScoreCircleProps) {
  const radius = (size - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-red-500";
  let glowClass = "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]";
  if (score >= 70) {
    colorClass = "text-green-500";
    glowClass = "drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]";
  } else if (score >= 40) {
    colorClass = "text-yellow-400";
    glowClass = "drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
  }

  return (
    <div className="relative flex items-center justify-center transition-all duration-1000" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="absolute transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-navy-700"
        />
        {/* Foreground Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClass} ${glowClass} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      {/* Score Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Fit</span>
      </div>
    </div>
  );
}
