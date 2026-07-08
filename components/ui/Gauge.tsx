"use client";

import { motion } from 'framer-motion';

interface GaugeProps {
  score: number;
  size?: number;
  animated?: boolean;
}

export function Gauge({ score, size = 200, animated = true }: GaugeProps) {
  // Semicircle calculations
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Only half circle
  
  // Calculate offset based on score (0-100)
  const percent = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let color = 'var(--color-fail)';
  if (score >= 70) color = 'var(--color-pass)';
  else if (score >= 40) color = 'var(--color-warn)';

  return (
    <div className="relative flex flex-col items-center justify-center font-bricolage" style={{ width: size, height: size / 2 }}>
      <svg 
        width={size} 
        height={size / 2} 
        viewBox={`0 0 ${size} ${size / 2}`} 
        className="overflow-hidden"
      >
        {/* Background track */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} a ${radius} ${radius} 0 0 1 ${size - strokeWidth} 0`}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.15}
        />
        {/* Animated score arc */}
        <motion.path
          d={`M ${strokeWidth / 2} ${size / 2} a ${radius} ${radius} 0 0 1 ${size - strokeWidth} 0`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      {/* Score Text */}
      <div className="absolute bottom-0 flex flex-col items-center translate-y-[20%]">
        <span className="text-4xl md:text-5xl font-black text-[var(--color-text-primary)] leading-none">
          {score}
        </span>
        <span className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}
