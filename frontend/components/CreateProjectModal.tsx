'use client';

import React, { useState, useEffect } from 'react';
import { X, Code2, Plus, Sparkles, Check, AlertCircle } from 'lucide-react';

const Github = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);
import { useProjectStore } from '@/store/projectStore';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (projectId: string) => void;
  initialData?: {
    title?: string;
    description?: string;
    techStack?: string[];
    ideaId?: string;
  } | null;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess, initialData }: CreateProjectModalProps) {
  const { createProject, fetchUserGithubRepos } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'picker' | 'manual'>('manual');
  const [userRepos, setUserRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [seekingRolesInput, setSeekingRolesInput] = useState('');
  const [seekingRoles, setSeekingRoles] = useState<string[]>([]);
  
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.techStack) setTechStack(initialData.techStack);
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen && activeTab === 'picker' && userRepos.length === 0) {
      loadRepos();
    }
  }, [isOpen, activeTab]);

  const loadRepos = async () => {
    try {
      setLoadingRepos(true);
      setError(null);
      const repos = await fetchUserGithubRepos();
      setUserRepos(repos);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Connect your GitHub account to import repositories directly.');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleSelectRepo = (repo: any) => {
    setRepoOwner(repo.owner);
    setRepoName(repo.name);
    setRepoUrl(repo.htmlUrl);
    if (!title) setTitle(repo.name);
    if (!description && repo.description) setDescription(repo.description);
  };

  const handleAddTech = () => {
    if (techStackInput.trim() && !techStack.includes(techStackInput.trim())) {
      setTechStack([...techStack, techStackInput.trim()]);
      setTechStackInput('');
    }
  };

  const handleRemoveTech = (item: string) => {
    setTechStack(techStack.filter((t) => t !== item));
  };

  const handleAddRole = () => {
    if (seekingRolesInput.trim() && !seekingRoles.includes(seekingRolesInput.trim())) {
      setSeekingRoles([...seekingRoles, seekingRolesInput.trim()]);
      setSeekingRolesInput('');
    }
  };

  const handleRemoveRole = (item: string) => {
    setSeekingRoles(seekingRoles.filter((r) => r !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Parse URL if manually pasted into repoOwner field
    let owner = repoOwner.trim();
    let name = repoName.trim();

    if (owner.includes('github.com/')) {
      const parts = owner.replace('https://github.com/', '').split('/');
      if (parts.length >= 2) {
        owner = parts[0];
        name = parts[1];
      }
    }

    if (!title.trim() || !description.trim() || !owner || !name) {
      setError('Title, description, repository owner, and repository name are required.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await createProject({
        title,
        description,
        techStack,
        seekingRoles,
        githubRepoOwner: owner,
        githubRepoName: name,
        githubRepoUrl: repoUrl || `https://github.com/${owner}/${name}`,
        ideaId: initialData?.ideaId
      });

      onSuccess(result.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create project. Please check repository details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <p className="text-xs text-neutral-400">Import a GitHub repository and find collaborators</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* GitHub Repository Selection Strategy */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              GitHub Repository Connection
            </label>

            <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'manual'
                    ? 'bg-neutral-800 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Manual URL / Name
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('picker')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'picker'
                    ? 'bg-neutral-800 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                Select My Repositories
              </button>
            </div>

            {activeTab === 'manual' ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">GitHub Owner / Username</label>
                  <input
                    type="text"
                    placeholder="e.g. facebook or your-user"
                    value={repoOwner}
                    onChange={(e) => setRepoOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Repository Name</label>
                  <input
                    type="text"
                    placeholder="e.g. react"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                {loadingRepos ? (
                  <div className="text-center py-6 text-xs text-neutral-400">Loading GitHub Repositories...</div>
                ) : userRepos.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-1.5 border border-neutral-800 rounded-xl p-2 bg-neutral-950">
                    {userRepos.map((repo) => {
                      const isSelected = repoOwner === repo.owner && repoName === repo.name;
                      return (
                        <div
                          key={repo.id}
                          onClick={() => handleSelectRepo(repo)}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                              : 'hover:bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Github className="w-4 h-4 shrink-0 text-neutral-400" />
                            <span className="text-xs font-semibold truncate">{repo.fullName}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-5 px-4 text-xs text-neutral-400 border border-neutral-800 rounded-xl bg-neutral-950 flex flex-col items-center gap-2">
                    <span>GitHub account not linked or no repositories found.</span>
                    <a
                      href="http://localhost:5000/auth/github"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Connect GitHub Account
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              placeholder="Project Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="What are you building? What kind of help do you need?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Tech Stack Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Tech Stack
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add technology (e.g. Next.js, Redis)"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs"
                >
                  {tech}
                  <button type="button" onClick={() => handleRemoveTech(tech)}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Seeking Roles Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
              Seeking Collaborator Roles
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add role (e.g. Frontend Developer, UI Designer)"
                value={seekingRolesInput}
                onChange={(e) => setSeekingRolesInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {seekingRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs"
                >
                  {role}
                  <button type="button" onClick={() => handleRemoveRole(role)}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              {submitting ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
