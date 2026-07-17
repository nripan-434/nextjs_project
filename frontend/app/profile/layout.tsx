import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and edit your user profile on Idea Board.',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
