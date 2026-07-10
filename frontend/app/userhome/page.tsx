"use client";
import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';

export default function HomePage() {
  const { user, fetchUser, logout, isLoading } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-orange-500/30">
      <div className="max-w-[1400px] mx-auto flex justify-center gap-6 p-4">
        
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
            <NavItem icon={HomeIcon} label="My Feed" active />
            <NavItem icon={UsersIcon} label="Groups" />
            <NavItem icon={MessageIcon} label="Messages" badge={3} />
            <NavItem icon={BookmarkIcon} label="Bookmarks" />
            <NavItem icon={MoreIcon} label="More" />
            
            <div className="h-px bg-neutral-800 my-4"></div>
            
            <NavItem icon={BellIcon} label="Notifications" />
            <NavItem icon={SettingsIcon} label="Settings" />
            
            {/* Added Logout button controlled by Zustand */}
            {user && (
              <div onClick={logout} className="mt-2 text-red-400 hover:text-red-300">
                <NavItem icon={MoreIcon} label="Log Out" />
              </div>
            )}
          </nav>

          <div className="mt-auto px-2 flex items-center gap-3 cursor-pointer hover:bg-neutral-800/50 p-2 rounded-xl transition">
            <div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden">
               <img src="https://i.pravatar.cc/150?img=11" alt="Robert J." className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium text-gray-200">Robert J.</span>
          </div>
        </aside>

        {/* MIDDLE FEED */}
        <main className="flex-1 max-w-[650px] flex flex-col gap-6">
          {/* New Post Box */}
          <div className="bg-[#121212] rounded-2xl p-4 border border-neutral-800/60">
            <input 
              type="text" 
              placeholder="New Post" 
              className="w-full bg-transparent text-gray-200 placeholder-neutral-600 outline-none text-base mb-4 px-2"
            />
            <div className="flex justify-between items-center border-t border-neutral-800/60 pt-3 px-2">
              <div className="flex gap-4 text-neutral-500">
                <button className="hover:text-gray-300 transition"><CameraIcon /></button>
                <button className="hover:text-gray-300 transition"><VideoIcon /></button>
                <button className="hover:text-gray-300 transition"><LinkIcon /></button>
              </div>
              <button className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-2">
                <SendIcon />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-neutral-800/60 pb-px mt-2">
            <button className="text-gray-200 font-medium pb-3 border-b-2 border-orange-500 flex items-center gap-2 text-sm px-2">
              <HeartIcon className="text-orange-500" /> Following
            </button>
            <button className="text-neutral-500 font-medium pb-3 hover:text-gray-300 transition text-sm flex items-center gap-2 px-2">
              <FlameIcon /> Featured
            </button>
            <button className="text-neutral-500 font-medium pb-3 hover:text-gray-300 transition text-sm flex items-center gap-2 px-2">
              <TrendingIcon /> Rising
            </button>
          </div>

          {/* Post */}
          <div className="bg-[#121212] rounded-2xl p-5 border border-neutral-800/60">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/150?img=12" alt="tnhao2005" className="w-10 h-10 rounded-full" />
                <div>
                  <h4 className="text-gray-200 font-medium text-sm">tnhao2005</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">2 hours ago</p>
                </div>
              </div>
              <button className="text-neutral-500 hover:text-gray-300">...</button>
            </div>

            <div className="flex items-center gap-2 mb-3">
               <span className="text-amber-400 bg-amber-400/10 p-1 rounded">
                  <DocumentIcon />
               </span>
               <h3 className="text-white font-medium text-[15px]">TypeScript useful advanced types</h3>
            </div>
            
            <p className="text-neutral-400 text-[13px] mb-4 leading-relaxed">
              As the title says, here are all the useful types that I'm using every day or create new types on top of them. I thought it might be handy for some people so I just share here and this will be updated moving forward:
            </p>

            {/* Code Block */}
            <div className="bg-[#161616] rounded-xl overflow-hidden border border-neutral-800 text-[13px] font-mono mb-4">
              <div className="bg-[#1a1a1a] px-4 py-2.5 border-b border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                <span>Loop through an tuple array type</span>
                <CopyIcon />
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">
                  <code>
<span className="text-amber-500">type</span> <span className="text-blue-400">ReduceItems</span>&lt;<span className="text-emerald-400">Arr</span> <span className="text-amber-500">extends</span> <span className="text-blue-400">ReadonlyArray</span>&lt;<span className="text-amber-500">any</span>&gt;, <span className="text-emerald-400">Result</span> <span className="text-amber-500">extends</span> <span className="text-amber-500">any</span>[] = []&gt; =
  Arr <span className="text-amber-500">extends</span> [] 
    ? Result
    : Arr <span className="text-amber-500">extends</span> [<span className="text-amber-500">infer</span> H, ...<span className="text-amber-500">infer</span> Tail]
      ? H <span className="text-amber-500">extends</span> &#123; items: <span className="text-blue-400">ReadonlyArray</span>&lt;MenuItem&gt; &#125;
        ? [...Result, ...H[<span className="text-orange-300">"items"</span>], ...<span className="text-blue-400">ReduceItems</span>&lt;Tail&gt;]
        : <span className="text-pink-500">never</span>
      : <span className="text-pink-500">never</span>;
                  </code>
                </pre>
              </div>
              <button className="w-full py-2.5 bg-neutral-900/40 text-neutral-400 text-xs text-center border-t border-neutral-800 font-sans hover:text-white transition">
                Read All →
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="text-xs text-neutral-500 hover:text-orange-500 cursor-pointer">#typescript</span>
            </div>

            <div className="flex gap-6 text-neutral-500 text-xs font-medium border-t border-neutral-800/60 pt-4 mt-2">
              <button className="flex items-center gap-2 hover:text-orange-500"><HeartIcon className="text-orange-500/80" /> 204</button>
              <button className="flex items-center gap-2 hover:text-gray-300"><CommentIcon /> 14</button>
              <button className="flex items-center gap-2 hover:text-gray-300"><ShareIcon /> 10</button>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:flex flex-col w-[300px] shrink-0 sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar gap-8 pl-4">
          
          {/* Pro Banner */}
          <div className="bg-gradient-to-br from-orange-500/10 to-[#121212] border border-orange-500/20 rounded-2xl p-5 relative">
            <button className="absolute top-3 right-3 text-neutral-500 hover:text-white">×</button>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-500/20 p-1.5 rounded-lg">
                <StarIcon className="text-orange-500" />
              </div>
              <h3 className="text-white font-medium text-sm">Introducing Pro</h3>
            </div>
            <p className="text-neutral-400 text-xs mb-4 leading-relaxed">Boost your publishing with our new premium features.</p>
            <div className="flex gap-2">
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-2 rounded-lg transition shadow-lg shadow-orange-500/20">Upgrade Now</button>
              <button className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition">Explore</button>
            </div>
          </div>

          {/* Trending Topics */}
          <div>
            <h3 className="text-gray-200 font-medium mb-4 text-sm">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {['linode', 'avalanche', 'ankr', 'thwwebapps', 'dev', 'polygon', '90daysofdevops'].map(tag => (
                <span key={tag} className="bg-neutral-800/60 hover:bg-neutral-700 cursor-pointer text-neutral-400 text-xs px-3 py-1.5 rounded-lg transition">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Official Channels */}
          <div>
            <h3 className="text-gray-200 font-medium mb-4 flex items-center gap-2 text-sm">
              Official Channels <VerifiedIcon className="text-orange-500 w-4 h-4" />
            </h3>
            <div className="flex flex-col gap-5">
              <ChannelItem name="VS Code" icon={<div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">VS</div>} />
              <ChannelItem name="React" icon={<div className="w-7 h-7 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-[10px]">Re</div>} />
              <ChannelItem name="Shadcn/UI" showFollow icon={<div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-black font-bold text-[10px]">/</div>} />
              <ChannelItem name="ChatGPT" icon={<div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">CG</div>} />
              <ChannelItem name="Tailwind CSS" icon={<div className="w-7 h-7 bg-sky-900 border border-sky-800 rounded-lg flex items-center justify-center text-sky-400 font-bold text-[10px]">TW</div>} />
            </div>
          </div>

          {/* Top Discussions */}
          <div>
             <h3 className="text-gray-200 font-medium mb-4 text-sm">Top Discussions this Week</h3>
             <div className="flex flex-col gap-4 text-xs text-neutral-400">
                <div className="hover:text-gray-200 cursor-pointer transition">
                   <p className="mb-2 leading-relaxed">Why Isn't React Re-rendering When State is Updated with the Same Value?</p>
                   <p className="text-neutral-600">181 comments</p>
                </div>
                <div className="hover:text-gray-200 cursor-pointer transition">
                   <p className="mb-2 leading-relaxed">What are Your Goals for the Week of Nov 20?</p>
                   <p className="text-neutral-600">95 comments</p>
                </div>
             </div>
          </div>
        </aside>
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
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      {badge && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
  );
}

function ChannelItem({ name, icon, showFollow }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-neutral-300 text-[13px] font-medium group-hover:text-white transition cursor-pointer">{name}</span>
      </div>
      {showFollow && (
        <button className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition font-medium">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Follow
        </button>
      )}
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
const CameraIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const VideoIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const LinkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const SendIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const HeartIcon = ({className}: any) => <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const FlameIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>;
const TrendingIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const DocumentIcon = () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const CopyIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CommentIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ShareIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const StarIcon = ({className}: any) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const VerifiedIcon = ({className}: any) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15l-4-4 1.4-1.4 2.6 2.6 6.6-6.6L19 9l-8 8z"/></svg>;
