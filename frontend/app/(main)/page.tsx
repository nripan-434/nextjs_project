"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import PixelBlast to avoid SSR issues with Three.js
const PixelBlast = dynamic(() => import('../../components/PixelBlast'), {
  ssr: false,
});

export default function LandingPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>

      {/* Background Effect - Non-interactive */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
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

      {/* Static Content / Hero Section - Glassmorphism UI */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'transparent',
          overflow: 'hidden'
        }}>

          {/* Left Column - Caption */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '4rem',
            paddingLeft: '8rem',
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <h1 style={{
              fontSize: '5rem',
              fontWeight: 800,
              margin: '0 0 1.5rem 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #B497CF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px',
              lineHeight: 1.1
            }}>
              Discover The Future of Engineering.
            </h1>

            <p style={{
              fontSize: '1.25rem',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '0 0 3rem 0',
              maxWidth: '550px',
            }}>
              Join a thriving network of developers. Share insights, build groundbreaking projects, and elevate your technical expertise in a truly modern workspace.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href="/register" style={{
                backgroundColor: '#B497CF',
                color: '#0d0d12',
                padding: '16px 40px',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1.2rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(180, 151, 207, 0.3)',
                cursor: 'pointer'
              }}>
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Column - Floating Images */}
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
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
              style={{
                width: '65%',
                maxWidth: '350px',
                height: 'auto',
                borderRadius: '16px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                animation: 'float-complex 8s ease-in-out infinite',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'absolute',
                top: '20%',
                right: '15%',
                zIndex: 2
              }}
            />

            <img 
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" 
              alt="Secondary Tech Element"
              style={{
                width: '50%',
                maxWidth: '280px',
                height: 'auto',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                animation: 'float-complex-alt 10s ease-in-out infinite',
                border: '1px solid rgba(255,255,255,0.15)',
                position: 'absolute',
                bottom: '15%',
                left: '20%',
                zIndex: 1
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}