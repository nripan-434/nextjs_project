import type { ReactNode } from 'react';

type GlassContainerProps = {
  children: ReactNode;
  className?: string;
};

export function GlassContainer({ children, className = '' }: GlassContainerProps) {
  return (
    <div className={`rounded-[2rem] border border-white/12 bg-slate-950/45 p-5 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur-2xl ${className}`.trim()}>
      {children}
    </div>
  );
}
