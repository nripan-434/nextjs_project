import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';

export function OnboardingModal() {
  const { user, updateProfile } = useUserStore();
  const [role, setRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  // If there's no user, or their profile is already complete, don't show the modal.
  if (!user || user.isProfileComplete) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();             
    setLoading(true);
    try {
      // Convert comma separated string to array and trim
      const stackArray = techStack.split(',').map(item => item.trim()).filter(Boolean);
      await updateProfile({ role, techStack: stackArray, bio });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-[60px]" />
        
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Welcome to DevSaaS! 🚀</h2>
        <p className="text-neutral-400 text-sm mb-6 relative z-10">Let's set up your developer profile so we can match you with the best projects and teams.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div>
            <label className="text-xs font-medium text-neutral-400 mb-1 block">What is your primary role?</label>
            <input 
              type="text" 
              placeholder="e.g. Frontend Developer, Student..." 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400 mb-1 block">Tech Stack (comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. React, Python, PostgreSQL" 
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-400 mb-1 block">Short Bio</label>
            <textarea 
              placeholder="I am looking to collaborate on..." 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500/50 transition min-h-[80px]"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50"
          >
            {loading ? 'Saving Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
