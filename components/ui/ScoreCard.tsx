import { ReactNode } from 'react';

interface ScoreCardProps {
  label: string;
  score: number;
  icon?: ReactNode;
}

export function ScoreCard({ label, score, icon }: ScoreCardProps) {
  let badgeColor = 'bg-[var(--color-fail)]';
  if (score >= 70) badgeColor = 'bg-[var(--color-pass)]';
  else if (score >= 40) badgeColor = 'bg-[var(--color-warn)]';

  return (
    <div className="flex flex-col rounded-[2rem] border-2 border-[var(--color-border)] bg-[var(--color-card)] p-4 md:p-6 transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-4">
        {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
        <span className="text-sm font-bold tracking-wider uppercase">{label}</span>
      </div>
      <div className="mt-auto flex items-end justify-between">
        <span className="text-3xl md:text-4xl font-black font-bricolage text-[var(--color-text-primary)] leading-none">{score}</span>
        <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${badgeColor}`}>
          {score >= 70 ? 'GOOD' : score >= 40 ? 'WARN' : 'POOR'}
        </span>
      </div>
    </div>
  );
}
