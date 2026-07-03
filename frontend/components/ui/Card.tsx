import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-3xl border border-white/12 bg-white/8 p-6 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur-2xl ${className}`.trim()}>
      {children}
    </div>
  );
}
