

import type { Metadata } from 'next';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | Idea Board',
    default: 'Idea Board - The Developer Community Platform',
  },
  description: 'Share your ideas, get feedback, and collaborate with the developer community.',
  openGraph: {
    title: 'Idea Board',
    description: 'Share your ideas, get feedback, and collaborate with the developer community.',
    siteName: 'Idea Board',
    type: 'website',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="min-h-full flex flex-col">
        <main>
        {children}
        </main>
        </body>
    </html>
  );
}
