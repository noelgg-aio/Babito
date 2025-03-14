interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

const ProgressCircle = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 10,
  showText = true 
}: ProgressCircleProps) => {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.min(100, Math.max(0, percentage));
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#e5e7eb"
          fill="transparent"
          className="dark:stroke-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="var(--primary-color)"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="progress-circle"
        />
      </svg>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{safePercentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;
