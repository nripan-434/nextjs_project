"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Dynamically import PixelBlast to avoid SSR issues with Three.js
const PixelBlast = dynamic(() => import('../../components/PixelBlast'), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-black">

      {/* Background Effect - Non-interactive */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B497CF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples={false}
          liquid={false}
          speed={0.6}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Blur Overlay - Placed between z-0 background and z-10 content */}
      
      <motion.div 
        initial={{ y: -500 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute h-[70vh] border-white border-b-2  opacity-60 inset-0 z-[5] bg-black/20 pointer-events-none"
      />
      <motion.div 
        initial={{ x: -500 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute w-[100vh] h-[85vh]  border-white border-r-2  opacity-80  inset-0 z-[5]  pointer-events-none"
      />

      {/* Static Content / Hero Section - Glassmorphism UI */}
      <div className="absolute top-0 left-0 w-full h-screen z-10 flex justify-center items-center">
        <div className="flex w-full h-full bg-transparent overflow-hidden">

          {/* Left Column - Caption */}
          <div className="flex-1 flex flex-col justify-center p-16 pl-32 text-white font-sans">
            <h1 className="text-[5rem] font-extrabold mb-6 bg-gradient-to-br from-white to-[#B497CF] bg-clip-text text-transparent tracking-[-2px] leading-[1.1]">
              Discover The Future of Engineering.
            </h1>

            <p className="text-xl leading-[1.7] text-white/80 mb-12 max-w-[550px]">
              Join a thriving network of developers. Share insights, build groundbreaking projects, and elevate your technical expertise in a truly modern workspace.
            </p>

            <div className="flex gap-6">
              <Link 
                href="/register" 
                className="bg-[#B497CF] text-[#0d0d12] px-10 py-4 rounded-xl font-bold no-underline text-[1.2rem] transition-all duration-200 ease-in-out shadow-[0_4px_15px_rgba(180,151,207,0.3)] hover:shadow-[0_6px_20px_rgba(180,151,207,0.5)] hover:-translate-y-1"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Column - Floating Images */}
          <div className="flex-1 flex justify-center items-center relative">
            <style>{`
              @keyframes float-complex {
                0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                33% { transform: translateY(-25px) translateX(10px) rotate(2deg); }
                66% { transform: translateY(-10px) translateX(-10px) rotate(-1deg); }
                100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
              }
              @keyframes float-complex-alt {
                0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                33% { transform: translateY(20px) translateX(-15px) rotate(-3deg); }
                66% { transform: translateY(10px) translateX(15px) rotate(2deg); }
                100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
              }
            `}</style>

            <img
              src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800&auto=format&fit=crop"
              alt="Floating Tech Element"
              className="w-[65%] max-w-[350px] h-auto rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 absolute top-[20%] right-[15%] z-[2]"
              style={{ animation: 'float-complex 8s ease-in-out infinite' }}
            />

            <img 
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" 
              alt="Secondary Tech Element"
              className="w-[50%] max-w-[280px] h-auto rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/15 absolute bottom-[15%] left-[20%] z-[1]"
              style={{ animation: 'float-complex-alt 10s ease-in-out infinite' }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}