

interface ScoreCircleProps {
  score: number;
  size?: number;
}

export default function ScoreCircle({ score, size = 120 }: ScoreCircleProps) {
  const radius = (size - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "text-red-500";
  if (score >= 70) {
    colorClass = "text-green-500";
  } else if (score >= 40) {
    colorClass = "text-yellow-400";
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
          className={`${colorClass} transition-all duration-1000 ease-out`}
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
