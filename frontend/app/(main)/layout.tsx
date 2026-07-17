import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Discover the latest ideas from the developer community.',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ background: '#0d0d12', minHeight: '100vh', margin: 0, padding: 0 }}>
   <Navbar/> {children}<Footer/>
    </div>;
}