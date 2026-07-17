import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard on Idea Board.',
};

export default function UserHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
