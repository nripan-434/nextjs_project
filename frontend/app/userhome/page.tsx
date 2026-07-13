"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { OnboardingModal } from '@/components/ui/OnboardingModal';

import { api } from '@/utils/axios';

export default function HomePage() {
  const { user, fetchUser, logout, isLoading } = useUserStore();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    const fetchIdeas = async () => {
      try {
        const res = await api.get('/ideas');
        setIdeas(res.data);
      } catch (err) {
        console.error("Failed to fetch ideas", err);
      }
    };
    fetchIdeas();
  }, [fetchUser]);

  const handlePostIdea = async () => {
    if (!newTitle || !newDesc) return;
    setIsPosting(true);
    try {
      const tagsArray = newTags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.post('/ideas', { title: newTitle, description: newDesc, tags: tagsArray });
      setIdeas([res.data, ...ideas]);
      setNewTitle('');
      setNewDesc('');
      setNewTags('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      await api.delete(`/ideas/${id}`);
      setIdeas(ideas.filter(idea => idea.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-orange-500 gap-4">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 font-medium tracking-widest text-sm uppercase">Loading DevSaaS...</p>
      </div>
    );
  }

  if (!user) return null; // Prevents flashing the dashboard before the redirect executes

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-orange-500/30 flex flex-col">
      <Navbar />
      <OnboardingModal />
      <div className="max-w-[1400px] w-full mx-auto flex justify-center gap-6 p-4 flex-1">
        
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[250px] shrink-0 sticky top-4 h-[calc(100vh-2rem)]">
          <div className="flex items-center gap-3 mb-8 px-2">
            {user?.avatar ? (
               <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <span className="text-white font-bold tracking-wide">
              {isLoading ? "Loading..." : (user?.username || "Guest")}
            </span>
          </div>

          <nav className="flex flex-col gap-1 flex-grow">
            <NavItem icon={HomeIcon} label="Idea Feed" active />
            <NavItem icon={CodeIcon} label="My Workspaces" />
            <NavItem icon={MessageIcon} label="Messages" badge={3} />
            <NavItem icon={BookmarkIcon} label="Saved Ideas" />
            
            <div className="h-px bg-neutral-800 my-4"></div>
            
            <NavItem icon={BellIcon} label="Notifications" />
            <NavItem icon={SettingsIcon} label="Settings" />
            
            {user && (
              <div onClick={logout} className="mt-2 text-red-400 hover:text-red-300">
                <NavItem icon={MoreIcon} label="Log Out" />
              </div>
            )}
          </nav>
        </aside>

        {/* MIDDLE FEED */}
        <main className="flex-1 max-w-[650px] flex flex-col gap-6">
          {/* New Post Box */}
          <div className="bg-[#121212] rounded-2xl p-4 border border-neutral-800/60 shadow-lg flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Idea Title..." 
              value={newTitle} onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-transparent text-gray-200 placeholder-neutral-500 outline-none text-lg font-medium px-2"
            />
            <textarea
              placeholder="Describe your project idea, goals, or what you're looking for..."
              value={newDesc} onChange={e => setNewDesc(e.target.value)}
              className="w-full bg-transparent text-neutral-400 placeholder-neutral-600 outline-none text-sm px-2 resize-none min-h-[60px]"
            />
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. React, Supabase)"
              value={newTags} onChange={e => setNewTags(e.target.value)}
              className="w-full bg-transparent text-orange-400 placeholder-neutral-600 outline-none text-xs px-2"
            />
            <div className="flex justify-between items-center border-t border-neutral-800/60 pt-3 px-2">
              <div className="flex gap-4 text-neutral-500">
              </div>
              <button onClick={handlePostIdea} disabled={!newTitle || !newDesc || isPosting} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50">
                {isPosting ? 'Posting...' : 'Post Idea'} <SendIcon />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-neutral-800/60 pb-px mt-2">
            <button className="text-gray-200 font-medium pb-3 border-b-2 border-orange-500 flex items-center gap-2 text-sm px-2">
              <FlameIcon className="text-orange-500" /> Latest Ideas
            </button>
            <button className="text-neutral-500 font-medium pb-3 hover:text-gray-300 transition text-sm flex items-center gap-2 px-2">
              <TrendingIcon /> Top Voted
            </button>
            <button className="text-neutral-500 font-medium pb-3 hover:text-gray-300 transition text-sm flex items-center gap-2 px-2">
              <UsersIcon /> Looking for Devs
            </button>
          </div>

          {/* Dynamic Feed Mapping */}
          <div className="flex flex-col gap-6">
            {ideas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} onDelete={handleDeleteIdea} currentUserId={user?.id} />
            ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:flex flex-col w-[300px] shrink-0 sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar gap-8 pl-4">
          
          {/* Active Workspaces */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-[#121212] border border-indigo-500/20 rounded-2xl p-5 relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-indigo-500/20 p-1.5 rounded-lg">
                <CodeIcon className="text-indigo-400 w-4 h-4" />
              </div>
              <h3 className="text-white font-medium text-sm">Active Workspace</h3>
            </div>
            <p className="text-neutral-400 text-xs mb-4 leading-relaxed">You have a live collaboration session running.</p>
            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition shadow-lg shadow-indigo-500/20">
              Rejoin Session
            </button>
          </div>

          {/* Trending Tech */}
          <div>
            <h3 className="text-gray-200 font-medium mb-4 text-sm">Trending Stacks</h3>
            <div className="flex flex-wrap gap-2">
              {['react', 'nextjs', 'docker', 'websockets', 'webrtc', 'prisma', 'yjs'].map(tag => (
                <span key={tag} className="bg-neutral-800/60 hover:bg-neutral-700 cursor-pointer text-neutral-400 text-xs px-3 py-1.5 rounded-lg transition">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

// --- Dynamic Components ---

function IdeaCard({ idea, onDelete, currentUserId }: { idea: any, onDelete: (id: string) => void, currentUserId?: string }) {
  const authorName = idea.author?.username || 'Unknown Developer';
  return (
    <div className="bg-[#121212] rounded-2xl p-5 border border-neutral-800/60 hover:border-neutral-700 transition relative group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {idea.author?.avatar ? (
            <img src={idea.author.avatar} alt={authorName} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h4 className="text-gray-200 font-medium text-sm">{authorName}</h4>
            <p className="text-neutral-500 text-xs mt-0.5">{new Date(idea.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {idea.authorId === currentUserId && (
          <button onClick={() => onDelete(idea.id)} className="text-red-500/50 hover:text-red-500 text-xs transition px-2 py-1 bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100">Delete</button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
         <span className="text-orange-400 bg-orange-400/10 p-1 rounded">
            <DocumentIcon />
         </span>
         <h3 className="text-white font-medium text-[16px]">{idea.title}</h3>
      </div>
      
      <p className="text-neutral-400 text-[14px] mb-5 leading-relaxed whitespace-pre-wrap">
        {idea.description}
      </p>

      <div className="flex gap-2 mb-5">
        {idea.tags && idea.tags.map((tag: string) => (
          <span key={tag} className="text-xs text-neutral-500 hover:text-orange-500 cursor-pointer bg-neutral-900 px-2 py-1 rounded">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-neutral-800/60 pt-4 mt-2">
        <div className="flex gap-6 text-neutral-500 text-xs font-medium">
          <button className="flex items-center gap-2 hover:text-orange-500"><HeartIcon className="text-orange-500/80" /> {idea.likes}</button>
          <button className="flex items-center gap-2 hover:text-gray-300"><CommentIcon /> 0</button>
        </div>
        <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2">
          Collaborate <CodeIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function NavItem({ icon: Icon, label, active, badge }: any) {
  return (
    <div className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${active ? 'bg-orange-500/10 text-orange-500' : 'text-neutral-400 hover:text-gray-200 hover:bg-neutral-800/50'}`}>
      <div className="flex items-center gap-3">
        <Icon className={active ? 'text-orange-500 w-5 h-5' : 'text-neutral-500 w-5 h-5'} />
        <span className="text-[14px] font-medium">{label}</span>
      </div>
      {badge && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
  );
}

// --- Icons ---
const HomeIcon = ({className}: any) => <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const UsersIcon = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MessageIcon = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
const BookmarkIcon = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
const MoreIcon = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;
const BellIcon = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const SettingsIcon = ({className}: any) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LinkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const SendIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const HeartIcon = ({className}: any) => <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const FlameIcon = ({className}: any) => <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>;
const TrendingIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const DocumentIcon = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const CommentIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ShareIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const CodeIcon = ({className}: any) => <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
