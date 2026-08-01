import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

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

export const fetchProjects = async () => {
  const response = await api.get('/projects');
  return response.data.projects as ProjectData[];
};

export const fetchProjectById = async (id: string) => {
  const response = await api.get(`/projects/${id}`);
  return response.data as { project: ProjectData; githubData: LiveGitHubData };
};

export const fetchUserGithubRepos = async () => {
  const response = await api.get('/projects/my-github-repos');
  return response.data.repos;
};

export const createProject = async (data: {
  title: string;
  description: string;
  techStack: string[];
  seekingRoles: string[];
  githubRepoOwner: string;
  githubRepoName: string;
  githubRepoUrl?: string;
  ideaId?: string;
}) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const requestToJoinProject = async (projectId: string, role = 'CONTRIBUTOR') => {
  const response = await api.post(`/projects/${projectId}/join`, { role });
  return response.data;
};

export const manageMemberStatus = async (
  projectId: string,
  memberId: string,
  action: 'ACCEPT' | 'REJECT'
) => {
  const response = await api.patch(`/projects/${projectId}/members/${memberId}`, { action });
  return response.data;
};
