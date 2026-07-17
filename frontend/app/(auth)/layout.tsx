import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login or create an account for Idea Board.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ background: '#0d0d12', minHeight: '100vh', margin: 0, padding: 0 }}>{children}</div>;
}