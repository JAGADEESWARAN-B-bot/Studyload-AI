import React from 'react';
import { WorkloadClassification } from '../types';

interface WorkloadGaugeProps {
  score: number;
  level: WorkloadClassification;
  size?: number;
}

export const WorkloadGauge: React.FC<WorkloadGaugeProps> = ({ score, level, size = 260 }) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Gauge calculations (180 degree semicircle)
  // Angle: 0 score = -180 deg (left), 100 score = 0 deg (right)
  const angle = -180 + (clampedScore / 100) * 180;
  const radius = 95;
  const strokeWidth = 18;
  const center = 130;

  // Level colors
  const levelStyles: Record<WorkloadClassification, { color: string; bg: string; text: string }> = {
    'LOW': { color: '#10b981', bg: '#d1fae5', text: 'text-emerald-700' },
    'MODERATE': { color: '#0284c7', bg: '#e0f2fe', text: 'text-sky-700' },
    'HIGH': { color: '#f59e0b', bg: '#fef3c7', text: 'text-amber-800' },
    'VERY HIGH': { color: '#ef4444', bg: '#fee2e2', text: 'text-rose-700' }
  };

  const currentStyle = levelStyles[level] || levelStyles['MODERATE'];

  // Needle tip coordinates
  const rad = (angle * Math.PI) / 180;
  const needleLength = radius - 15;
  const needleX = center + needleLength * Math.cos(rad);
  const needleY = center + needleLength * Math.sin(rad);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg
        viewBox="0 0 260 160"
        width={size}
        height={(size * 160) / 260}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <path
          d="M 35 130 A 95 95 0 0 1 225 130"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Colored progress arc */}
        {clampedScore > 0 && (
          <path
            d="M 35 130 A 95 95 0 0 1 225 130"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={Math.PI * radius}
            strokeDashoffset={(Math.PI * radius) * (1 - clampedScore / 100)}
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Needle */}
        <line
          x1={center}
          y1={center}
          x2={needleX}
          y2={needleY}
          stroke={currentStyle.color}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />

        {/* Pivot Center Pin */}
        <circle cx={center} cy={center} r="7" fill={currentStyle.color} />
        <circle cx={center} cy={center} r="3" fill="#ffffff" />

        {/* Scale labels */}
        <text x="28" y="150" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">0</text>
        <text x="130" y="28" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">50</text>
        <text x="232" y="150" fontSize="11" fill="#94a3b8" fontWeight="600" textAnchor="middle">100</text>
      </svg>

      {/* Numerical score & badge display */}
      <div className="flex flex-col items-center mt-[-18px]">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold tracking-tight" style={{ color: currentStyle.color }}>
            {clampedScore}
          </span>
          <span className="text-xs font-semibold text-slate-400">/ 100</span>
        </div>

        <span
          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mt-1 ${currentStyle.text}`}
          style={{ backgroundColor: currentStyle.bg }}
        >
          {level} WORKLOAD
        </span>
      </div>
    </div>
  );
};
