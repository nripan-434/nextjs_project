import type { Request, Response } from 'express';
import { prisma } from '../server.js';
import {
  fetchRepoDetails,
  fetchRepoCommits,
  fetchRepoIssues,
  getUserRepos,
  addCollaboratorToRepo
} from '../services/githubService.js';

/**
 * Create a new Project and link it to a GitHub Repository
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      title,
      description,
      techStack = [],
      seekingRoles = [],
      githubRepoOwner,
      githubRepoName,
      githubRepoUrl,
      ideaId
    } = req.body;

    if (!title || !description || !githubRepoOwner || !githubRepoName) {
      return res.status(400).json({ message: 'Title, description, owner, and repository name are required.' });
    }

    const repoUrl = githubRepoUrl || `https://github.com/${githubRepoOwner}/${githubRepoName}`;
    const userAccessToken = (req.user as any)?.githubAccessToken;
    const repoDetails = await fetchRepoDetails(githubRepoOwner, githubRepoName, userAccessToken);

    if (!repoDetails) {
      return res.status(400).json({
        message: `Could not find GitHub repository '${githubRepoOwner}/${githubRepoName}'. Please check the owner and repository name.`
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        seekingRoles,
        githubRepoOwner,
        githubRepoName,
        githubRepoUrl: repoUrl,
        ownerId: userId,
        ideaId: ideaId || null,
        members: {
          create: {
            userId: userId,
            role: 'OWNER',
            status: 'ACCEPTED'
          }
        }
      },
      include: {
        owner: {
          select: { id: true, username: true, email: true, avatar: true, githubUsername: true }
        },
        members: true
      }
    });

    return res.status(201).json({
      message: 'Project created and linked to GitHub successfully',
      project
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return res.status(500).json({ message: 'Internal server error while creating project' });
  }
};

/**
 * List all projects with owner details and member counts
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { id: true, username: true, avatar: true, githubUsername: true }
        },
        members: {
          include: {
            user: { select: { id: true, username: true, avatar: true } }
          }
        }
      }
    });

    return res.status(200).json({ projects });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ message: 'Internal server error while fetching projects' });
  }
};

/**
 * Get Project Workspace Details combined with Live GitHub Metrics & Commits
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, username: true, email: true, avatar: true, githubUsername: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true, githubUsername: true, email: true }
            }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userAccessToken = (req.user as any)?.githubAccessToken;
    const [stats, recentCommits, openIssues] = await Promise.all([
      fetchRepoDetails(project.githubRepoOwner, project.githubRepoName, userAccessToken),
      fetchRepoCommits(project.githubRepoOwner, project.githubRepoName, userAccessToken),
      fetchRepoIssues(project.githubRepoOwner, project.githubRepoName, userAccessToken)
    ]);

    return res.status(200).json({
      project,
      githubData: {
        stats: stats || {
          name: project.githubRepoName,
          fullName: `${project.githubRepoOwner}/${project.githubRepoName}`,
          description: project.description,
          stars: 0,
          forks: 0,
          openIssuesCount: 0,
          language: null,
          defaultBranch: 'main',
          htmlUrl: project.githubRepoUrl
        },
        recentCommits,
        openIssues
      }
    });
  } catch (error: any) {
    console.error('Error fetching project workspace:', error);
    return res.status(500).json({ message: 'Internal server error fetching project workspace' });
  }
};

/**
 * Fetch authenticated user's GitHub Repositories for selection
 */
export const getUserGithubRepos = async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.githubAccessToken;
    if (!accessToken) {
      return res.status(400).json({
        message: 'GitHub account not linked. Please connect your GitHub account via OAuth.'
      });
    }

    const repos = await getUserRepos(accessToken);
    return res.status(200).json({ repos });
  } catch (error: any) {
    console.error('Error fetching user GitHub repos:', error);
    return res.status(500).json({ message: 'Internal server error fetching GitHub repositories' });
  }
};

/**
 * Request to Join a Project as a Collaborator
 */
export const requestToJoinProject = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projectId = req.params.id as string;
    const { role = 'CONTRIBUTOR' } = req.body;

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId }
      }
    });

    if (existingMember) {
      return res.status(400).json({
        message: `Membership request already exists with status: ${existingMember.status}`
      });
    }

    const membership = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
        status: 'PENDING'
      },
      include: {
        user: { select: { id: true, username: true, avatar: true, githubUsername: true } }
      }
    });

    return res.status(201).json({
      message: 'Join request sent successfully',
      membership
    });
  } catch (error: any) {
    console.error('Error requesting to join project:', error);
    return res.status(500).json({ message: 'Internal server error joining project' });
  }
};

/**
 * Manage Project Member Join Requests (ACCEPT / REJECT)
 */
export const manageMemberStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const projectId = req.params.id as string;
    const memberId = req.params.memberId as string;
    const { action } = req.body;

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      return res.status(400).json({ message: "Action must be 'ACCEPT' or 'REJECT'" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { owner: true }
    });

    if (!project || project.ownerId !== userId) {
      return res.status(403).json({ message: 'Only project owners can manage join requests.' });
    }

    const member = await prisma.projectMember.findUnique({
      where: { id: memberId },
      include: {
        user: { select: { id: true, username: true, avatar: true, githubUsername: true } }
      }
    });

    if (!member || member.projectId !== projectId) {
      return res.status(404).json({ message: 'Member request not found.' });
    }

    if (action === 'REJECT') {
      await prisma.projectMember.delete({ where: { id: memberId } });
      return res.status(200).json({ message: 'Member request rejected.' });
    }

    const updatedMember = await prisma.projectMember.update({
      where: { id: memberId },
      data: { status: 'ACCEPTED' },
      include: {
        user: { select: { id: true, username: true, avatar: true, githubUsername: true } }
      }
    });

    let githubInviteSent = false;
    const ownerAccessToken = (req.user as any)?.githubAccessToken;
    if (ownerAccessToken && member.user?.githubUsername) {
      const inviteResult = await addCollaboratorToRepo(
        project.githubRepoOwner,
        project.githubRepoName,
        member.user.githubUsername,
        ownerAccessToken
      );
      githubInviteSent = inviteResult.success;
    }

    return res.status(200).json({
      message: 'Member request accepted successfully',
      githubInviteSent,
      member: updatedMember
    });
  } catch (error: any) {
    console.error('Error managing member status:', error);
    return res.status(500).json({ message: 'Internal server error managing member request' });
  }
};
