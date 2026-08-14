'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  GitFork,
  AlertCircle,
  GitCommit,
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Code2,
  Layers,
  UserPlus,
  Clock,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Download,
  MessageSquare,
  Send
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { socket } from '@/utils/socket';

const Github = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);
import {
  useProjectStore,
  ProjectData,
  LiveGitHubData
} from '@/store/projectStore';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { fetchProjectById, requestToJoinProject, manageMemberStatus, fetchProjectMessages, addMessage, messages } = useProjectStore();
  const { user: currentUser, fetchUser } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [githubData, setGithubData] = useState<LiveGitHubData | null>(null);

  const [activeTab, setActiveTab] = useState<'activity' | 'team' | 'overview' | 'chat'>('activity');
  const [joining, setJoining] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [processingMemberId, setProcessingMemberId] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleCopyCloneCommand = () => {
    if (!projectData) return;
    const cloneUrl = `git clone https://github.com/${projectData.githubRepoOwner}/${projectData.githubRepoName}.git`;
    navigator.clipboard.writeText(cloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (projectId) {
      loadProject();
      fetchProjectMessages(projectId);
      socket.emit('join_project_room', projectId);

      const handleNewMessage = (msg: any) => {
        if (msg.projectId === projectId) {
          addMessage(msg);
        }
      };

      socket.on('new_project_message', handleNewMessage);

      return () => {
        socket.off('new_project_message', handleNewMessage);
      };
    }
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || !currentUser || !projectId) return;

    socket.emit('send_project_message', {
      projectId,
      senderId: currentUser.id,
      content: chatInput.trim()
    });

    setChatInput('');
  };

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchProjectById(projectId);
      const state = useProjectStore.getState();
      setProjectData(state.currentProject);
      setGithubData(state.liveGithubData);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load project workspace.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    try {
      setJoining(true);
      setActionMessage(null);
      await requestToJoinProject(projectId);
      setActionMessage('Join request submitted successfully!');
      await loadProject();
    } catch (err: any) {
      setActionMessage(err?.response?.data?.message || 'Failed to submit join request.');
    } finally {
      setJoining(false);
    }
  };

  const handleMemberAction = async (memberId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      setProcessingMemberId(memberId);
      setActionMessage(null);
      const res = await manageMemberStatus(projectId, memberId, action);
      if (res.githubInviteSent) {
        setActionMessage('Member accepted & GitHub repository invite sent!');
      } else {
        setActionMessage(res.message);
      }
      await loadProject();
    } catch (err: any) {
      setActionMessage(err?.response?.data?.message || 'Failed to manage member status.');
    } finally {
      setProcessingMemberId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-sm text-neutral-400">Loading GitHub Project Workspace...</p>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 max-w-md text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{error || 'Project not found'}</p>
          <button
            onClick={() => router.push('/userhome')}
            className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const stats = githubData?.stats;
  const recentCommits = githubData?.recentCommits || [];
  const openIssues = githubData?.openIssues || [];

  const pendingMembers = projectData.members.filter((m) => m.status === 'PENDING');
  const acceptedMembers = projectData.members.filter((m) => m.status === 'ACCEPTED');

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-purple-500/30">
      
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/userhome')}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <a
              href={projectData.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white rounded-xl border border-neutral-700 transition-colors"
            >
              <Github className="w-4 h-4 text-purple-400" />
              <span>{projectData.githubRepoOwner}/{projectData.githubRepoName}</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>

            <button
              onClick={handleJoinRequest}
              disabled={joining}
              className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{joining ? 'Submitting...' : 'Request to Join'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                {stats?.language || 'Repository'}
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Created {new Date(projectData.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white mb-2">{projectData.title}</h1>
            <p className="text-neutral-300 text-sm max-w-3xl leading-relaxed mb-6">
              {projectData.description}
            </p>

            {/* GitHub Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">{stats?.stars.toLocaleString() || 0}</span>
                <span className="text-xs text-neutral-400">Stars</span>
              </div>

              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">{stats?.forks.toLocaleString() || 0}</span>
                <span className="text-xs text-neutral-400">Forks</span>
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-semibold text-white">{stats?.openIssuesCount.toLocaleString() || 0}</span>
                <span className="text-xs text-neutral-400">Open Issues</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">{acceptedMembers.length}</span>
                <span className="text-xs text-neutral-400">Team Members</span>
              </div>
            </div>

            {/* Quick Code Access & Clone Section */}
            <div className="mt-6 pt-6 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Open Code on GitHub */}
              <a
                href={projectData.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      View Code on GitHub
                    </div>
                    <div className="text-[10px] text-neutral-400">Browse files & branches</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-purple-400 transition-colors" />
              </a>

              {/* 2. Download ZIP */}
              <a
                href={`https://github.com/${projectData.githubRepoOwner}/${projectData.githubRepoName}/archive/refs/heads/${stats?.defaultBranch || 'main'}.zip`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Download ZIP
                    </div>
                    <div className="text-[10px] text-neutral-400">Get latest source archive</div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-indigo-400 transition-colors" />
              </a>

              {/* 3. 1-Click Git Clone */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 flex-shrink-0">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white">Git Clone Command</div>
                    <div className="text-[10px] text-neutral-400 font-mono truncate">
                      git clone https://github.com/{projectData.githubRepoOwner}/{projectData.githubRepoName}.git
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCopyCloneCommand}
                  className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors flex-shrink-0 ml-2"
                  title="Copy git clone command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* GitHub Collaboration Invitation Banner */}
            <div className="mt-4 p-3.5 bg-purple-950/40 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Need write access to push commits? Accept your repository invitation on GitHub!</span>
              </div>
              <a
                href={`https://github.com/${projectData.githubRepoOwner}/${projectData.githubRepoName}/invitations`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <span>Accept GitHub Invite</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {actionMessage && (
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-300 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-800 mb-8 gap-8">
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 relative ${
              activeTab === 'activity'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <GitCommit className="w-4 h-4" />
            Live GitHub Activity
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 relative ${
              activeTab === 'team'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Team & Requests ({pendingMembers.length > 0 ? `${acceptedMembers.length} + ${pendingMembers.length} Pending` : acceptedMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 relative ${
              activeTab === 'overview'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Tech & Requirements
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 relative ${
              activeTab === 'chat'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Team Chat ({messages.length})
          </button>
        </div>

        {/* Tab 4: Real-time Group Chat */}
        {activeTab === 'chat' && (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col h-[550px]">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Collaborator Group Chat
              </h3>
              <span className="text-xs text-neutral-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                🟢 Live Socket.io Room
              </span>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      {msg.sender?.avatar ? (
                        <img src={msg.sender.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {msg.sender?.username?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className={`max-w-md ${isMe ? 'items-end text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-neutral-300">
                            {isMe ? 'You' : msg.sender?.username || 'Collaborator'}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-tr-none'
                              : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700/60'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                  <p>No messages in this workspace yet. Start the conversation!</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="pt-4 border-t border-neutral-800 flex items-center gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message to project collaborators..."
                className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-purple-500 text-white text-xs rounded-2xl px-4 py-3 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-2xl transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 1: Live GitHub Activity */}
        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Commits */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-purple-400" />
                  Recent Commits
                </h3>
                <span className="text-xs text-neutral-500">Live from GitHub</span>
              </div>

              {recentCommits.length > 0 ? (
                <div className="space-y-3">
                  {recentCommits.map((commit) => (
                    <a
                      key={commit.sha}
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 bg-neutral-950 border border-neutral-800/80 hover:border-purple-500/40 rounded-xl transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                          {commit.sha}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {new Date(commit.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-200 font-medium line-clamp-1 group-hover:text-purple-300 transition-colors">
                        {commit.message}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {commit.authorAvatar ? (
                          <img src={commit.authorAvatar} alt="" className="w-4 h-4 rounded-full" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-neutral-400">
                            {commit.authorName.charAt(0)}
                          </div>
                        )}
                        <span className="text-[11px] text-neutral-400">{commit.authorName}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-neutral-500">No recent commit history found.</div>
              )}
            </div>

            {/* Open Issues & Community Tasks */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Open GitHub Issues
                </h3>
                <span className="text-xs text-neutral-500">Live from GitHub</span>
              </div>

              {openIssues.length > 0 ? (
                <div className="space-y-3">
                  {openIssues.map((issue) => (
                    <a
                      key={issue.id}
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 bg-neutral-950 border border-neutral-800/80 hover:border-rose-500/40 rounded-xl transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-rose-400">#{issue.number}</span>
                        <span className="text-[10px] text-neutral-500">
                          {issue.commentsCount} comments
                        </span>
                      </div>
                      <p className="text-xs text-neutral-200 font-medium line-clamp-1 group-hover:text-rose-300 transition-colors">
                        {issue.title}
                      </p>
                      <div className="mt-2 text-[11px] text-neutral-400">
                        Opened by <span className="text-neutral-300 font-medium">@{issue.authorUsername}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-neutral-500">No open issues reported on GitHub.</div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Team & Membership Management */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            
            {/* Pending Requests (Visible to Project Owner / Team) */}
            {pendingMembers.length > 0 && (
              <div className="bg-neutral-900/60 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending Membership Requests ({pendingMembers.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {member.user.avatar ? (
                          <img src={member.user.avatar} alt="" className="w-9 h-9 rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white">
                            {member.user.username?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-white">{member.user.username || member.user.email}</h4>
                          <p className="text-[10px] text-neutral-400">
                            {member.user.githubUsername ? `@${member.user.githubUsername}` : 'No GitHub username linked'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMemberAction(member.id, 'ACCEPT')}
                          disabled={processingMemberId === member.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleMemberAction(member.id, 'REJECT')}
                          disabled={processingMemberId === member.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Team Members */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Accepted Collaborators ({acceptedMembers.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {acceptedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-3"
                  >
                    {member.user.avatar ? (
                      <img src={member.user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300">
                        {member.user.username?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{member.user.username || 'Collaborator'}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          member.role === 'OWNER'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      {member.user.githubUsername && (
                        <a
                          href={`https://github.com/${member.user.githubUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-purple-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Github className="w-3 h-3" />
                          @{member.user.githubUsername}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Tech Stack & Seeking Roles */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                Technologies Used
              </h3>

              <div className="flex flex-wrap gap-2">
                {projectData.techStack.length > 0 ? (
                  projectData.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-500">No specific technologies listed.</span>
                )}
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Seeking Roles
              </h3>

              <div className="flex flex-wrap gap-2">
                {projectData.seekingRoles.length > 0 ? (
                  projectData.seekingRoles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl text-xs font-semibold"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-500">Open to all roles.</span>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
