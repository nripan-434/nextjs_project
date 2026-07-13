"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function ProfilePage() {
  const { user, fetchUser, isLoading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-orange-500 gap-4">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 font-medium tracking-widest text-sm uppercase">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-orange-500/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 mt-10">
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-full border-4 border-neutral-800 object-cover shadow-lg" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center font-bold text-white text-5xl shadow-lg border-4 border-neutral-800">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="bg-orange-500/20 text-orange-500 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                {user.role || 'Member'}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex-1 w-full space-y-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-1">{user.username}</h1>
                <p className="text-neutral-400 text-sm">{user.email}</p>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">About Me</h3>
                <p className="text-gray-300 text-sm leading-relaxed bg-neutral-900/50 p-4 rounded-xl border border-neutral-800/50">
                  {user.bio || "This user hasn't written a bio yet. They prefer their code to do the talking."}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Tech Stack</h3>
                {user.techStack && user.techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.techStack.map((tech) => (
                      <span key={tech} className="bg-neutral-800 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-700/50 shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm italic">No technologies listed.</p>
                )}
              </div>

              {/* Links */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Links</h3>
                {user.githubUrl ? (
                  <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition text-sm font-medium bg-orange-400/10 px-4 py-2 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    GitHub Profile
                  </a>
                ) : (
                  <p className="text-neutral-500 text-sm italic">No external links provided.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
