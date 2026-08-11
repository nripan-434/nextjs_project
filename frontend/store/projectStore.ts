import { create } from 'zustand';
import { api } from '@/utils/axios';

export interface ProjectMember {
  id: string;
  role: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  joinedAt: string;
  user: {
    id: string;
    username: string | null;
    avatar: string | null;
    githubUsername: string | null;
    email: string;
  };
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  seekingRoles: string[];
  githubRepoOwner: string;
  githubRepoName: string;
  githubRepoUrl: string;
  createdAt: string;
  owner: {
    id: string;
    username: string | null;
    email: string;
    avatar: string | null;
    githubUsername: string | null;
  };
  members: ProjectMember[];
}

export interface LiveGitHubData {
  stats: {
    name: string;
    fullName: string;
    description: string | null;
    stars: number;
    forks: number;
    openIssuesCount: number;
    language: string | null;
    defaultBranch: string;
    htmlUrl: string;
  };
  recentCommits: Array<{
    sha: string;
    message: string;
    authorName: string;
    authorAvatar: string | null;
    date: string;
    url: string;
  }>;
  openIssues: Array<{
    id: number;
    number: number;
    title: string;
    authorUsername: string;
    commentsCount: number;
    createdAt: string;
    url: string;
  }>;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  techStack: string[];
  seekingRoles: string[];
  githubRepoOwner: string;
  githubRepoName: string;
  githubRepoUrl?: string;
  ideaId?: string;
}

interface ProjectState {
  projects: ProjectData[];
  currentProject: ProjectData | null;
  liveGithubData: LiveGitHubData | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  fetchUserGithubRepos: () => Promise<any[]>;
  createProject: (data: CreateProjectInput) => Promise<ProjectData>;
  requestToJoinProject: (projectId: string, role?: string) => Promise<void>;
  manageMemberStatus: (projectId: string, memberId: string, action: 'ACCEPT' | 'REJECT') => Promise<{ message: string; githubInviteSent?: boolean }>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  liveGithubData: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/projects');
      set({ projects: response.data.projects, isLoading: false });
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
      set({ error: err.response?.data?.message || 'Failed to fetch projects', isLoading: false });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/projects/${id}`);
      set({
        currentProject: response.data.project,
        liveGithubData: response.data.githubData,
        isLoading: false
      });
    } catch (err: any) {
      console.error('Failed to fetch project workspace:', err);
      set({ error: err.response?.data?.message || 'Failed to fetch project workspace', isLoading: false });
    }
  },

  fetchUserGithubRepos: async () => {
    try {
      const response = await api.get('/projects/my-github-repos');
      return response.data.repos || [];
    } catch (err: any) {
      const msg = err.response?.data?.message || 'GitHub account not linked.';
      set({ error: msg });
      return [];
    }
  },

  createProject: async (data: CreateProjectInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/projects', data);
      const newProject = response.data.project;
      set((state) => ({
        projects: [newProject, ...state.projects],
        isLoading: false
      }));
      return newProject;
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to create project' });
      throw err;
    }
  },

  requestToJoinProject: async (projectId: string, role = 'CONTRIBUTOR') => {
    try {
      await api.post(`/projects/${projectId}/join`, { role });
      await get().fetchProjectById(projectId);
    } catch (err: any) {
      console.error('Failed to request join project:', err);
      throw err;
    }
  },

  manageMemberStatus: async (projectId: string, memberId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      const response = await api.patch(`/projects/${projectId}/members/${memberId}`, { action });
      await get().fetchProjectById(projectId);
      return response.data;
    } catch (err: any) {
      console.error('Failed to manage member status:', err);
      throw err;
    }
  }
}));
