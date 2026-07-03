import Link from 'next/link';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const baseClasses =
  'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const variantClasses = {
  primary: 'bg-cyan-400 text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.28)] hover:bg-cyan-300',
  secondary: 'border border-white/15 bg-white/10 text-white backdrop-blur-xl hover:bg-white/15',
  ghost: 'text-slate-300 hover:bg-white/10 hover:text-white',
} as const;

export function Button<T extends ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps<T>) {
  const Component = as ?? 'button';

  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export function ButtonLink({ href, children, variant = 'primary', className = '' }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost'; className?: string }) {
  return (
    <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </Link>
  );
}
