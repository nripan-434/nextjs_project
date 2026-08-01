import axios from 'axios';

interface GitHubRepoStats {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssuesCount: number;
  language: string | null;
  defaultBranch: string;
  htmlUrl: string;
}

interface GitHubCommit {
  sha: string;
  message: string;
  authorName: string;
  authorAvatar: string | null;
  date: string;
  url: string;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  authorUsername: string;
  commentsCount: number;
  createdAt: string;
  url: string;
}

/**
 * Creates standard GitHub API Request Headers
 */
const getHeaders = (accessToken?: string) => {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'NextJS-Express-Collab-Platform'
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
};

/**
 * Fetch overview stats for a GitHub repository
 */
export const fetchRepoDetails = async (
  owner: string,
  repo: string,
  accessToken?: string
): Promise<GitHubRepoStats | null> => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: getHeaders(accessToken)
    });
    const data = response.data;
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssuesCount: data.open_issues_count,
      language: data.language,
      defaultBranch: data.default_branch || 'main',
      htmlUrl: data.html_url
    };
  } catch (error: any) {
    console.error(`Error fetching repo details for ${owner}/${repo}:`, error?.response?.data?.message || error.message);
    return null;
  }
};

/**
 * Fetch recent commits for a repository
 */
export const fetchRepoCommits = async (
  owner: string,
  repo: string,
  accessToken?: string
): Promise<GitHubCommit[]> => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
      headers: getHeaders(accessToken)
    });
    return response.data.map((item: any) => ({
      sha: item.sha.substring(0, 7),
      message: item.commit.message,
      authorName: item.commit.author?.name || item.author?.login || 'Unknown',
      authorAvatar: item.author?.avatar_url || null,
      date: item.commit.author?.date,
      url: item.html_url
    }));
  } catch (error: any) {
    console.error(`Error fetching repo commits for ${owner}/${repo}:`, error?.response?.data?.message || error.message);
    return [];
  }
};

/**
 * Fetch open issues for a repository
 */
export const fetchRepoIssues = async (
  owner: string,
  repo: string,
  accessToken?: string
): Promise<GitHubIssue[]> => {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`, {
      headers: getHeaders(accessToken)
    });
    return response.data.map((item: any) => ({
      id: item.id,
      number: item.number,
      title: item.title,
      authorUsername: item.user?.login || 'Unknown',
      commentsCount: item.comments || 0,
      createdAt: item.created_at,
      url: item.html_url
    }));
  } catch (error: any) {
    console.error(`Error fetching repo issues for ${owner}/${repo}:`, error?.response?.data?.message || error.message);
    return [];
  }
};

/**
 * Fetch repositories owned or accessible by the authenticated user
 */
export const getUserRepos = async (accessToken: string) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=30', {
      headers: getHeaders(accessToken)
    });
    return response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner.login,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      isPrivate: repo.private
    }));
  } catch (error: any) {
    console.error('Error fetching user repositories:', error?.response?.data?.message || error.message);
    return [];
  }
};

/**
 * Invite a collaborator to a GitHub repository
 */
export const addCollaboratorToRepo = async (
  owner: string,
  repo: string,
  githubUsername: string,
  accessToken: string
) => {
  try {
    const response = await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/collaborators/${githubUsername}`,
      { permission: 'push' },
      { headers: getHeaders(accessToken) }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`Error inviting collaborator ${githubUsername}:`, error?.response?.data?.message || error.message);
    return { success: false, error: error?.response?.data?.message || error.message };
  }
};
