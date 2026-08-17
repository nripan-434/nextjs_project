import type { Request, Response } from 'express';
import { prisma, io } from '../server.js';
import type { CreateIdeaDTO, UpdateIdeaDTO, CreateCommentDTO } from '../../types/index.js';

export const createIdea = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const authorId = (req.user as any).id;
        const { title, description, tags, githubRepourl, githubRepoOwner, githubRepoName } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }
        let repourl = githubRepourl;
        let repoowner = githubRepoOwner;
        let repoName = githubRepoName;
        if (githubRepourl) {
            const cleaned = githubRepourl
                .replace('https://github.com/', '')
                .replace('http://github.com/', '')
                .replace(/\/$/, '');

            const parts = cleaned.split('/');
            if (parts.length >= 2) {
                repoowner = parts[0];
                repoName = parts[1];
                repourl = `https://github.com/${repoowner}/${repoName}`;
            }
        }

        const newIdea = await prisma.idea.create({
            data: {
                title,
                description,
                tags: tags || [],
                authorId
            },
            include: {
                author: { select: { username: true, avatar: true } },
                likes: true,
                comments: { include: { user: { select: { username: true, avatar: true } } } }
            }
        });
        let project = null;
        if (repoowner && repoName) {
            project = await prisma.project.create({
                data: {
                    title,
                    description,
                    githubRepoOwner: repoowner,
                    githubRepoName: repoName,
                    githubRepoUrl: repourl,
                    ownerId: authorId,
                    ideaId: newIdea.id,
                    members: {
                        create: {
                            userId: authorId,
                            role: 'OWNER',
                            status: 'ACCEPTED'
                        }
                    }
                }
            });
        }
        return res.status(201).json({
            ...newIdea,
            project
        });
    } catch (error) {
        console.error("Error creating idea:", error);
        return res.status(500).json({ message: "Server error creating idea" });
    }
};

export const getIdeas = async (req: Request, res: Response): Promise<any> => {
    try {
        const ideas = await prisma.idea.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, username: true, avatar: true } },
                project: { select: { id: true, githubRepoOwner: true, githubRepoName: true, githubRepoUrl: true } },
                likes: true,
                comments: {
                    include: { user: { select: { username: true, avatar: true } } },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        return res.status(200).json(ideas);
    } catch (error) {
        console.error("Error fetching ideas:", error);
        return res.status(500).json({ message: "Server error fetching ideas" });
    }
};

// Update an Idea
export const updateIdea = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const authorId = (req.user as any).id;
        const id = req.params.id as string;
        const { title, description, tags } = req.body;

        const existingIdea = await prisma.idea.findUnique({ where: { id } });
        if (!existingIdea) return res.status(404).json({ message: "Idea not found" });
        if (existingIdea.authorId !== authorId) return res.status(403).json({ message: "Unauthorized to edit this idea" });

        const updatedIdea = await prisma.idea.update({
            where: { id },
            data: { title, description, tags },
            include: {
                author: { select: { username: true, avatar: true } }
            }
        });

        return res.status(200).json(updatedIdea);
    } catch (error) {
        console.error("Error updating idea:", error);
        return res.status(500).json({ message: "Server error updating idea" });
    }
};

// Delete an Idea
export const deleteIdea = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const authorId = (req.user as any).id;
        const id = req.params.id as string;

        const existingIdea = await prisma.idea.findUnique({ where: { id } });
        if (!existingIdea) return res.status(404).json({ message: "Idea not found" });
        if (existingIdea.authorId !== authorId) return res.status(403).json({ message: "Unauthorized to delete this idea" });

        await prisma.idea.delete({ where: { id } });

        return res.status(200).json({ message: "Idea deleted successfully" });
    } catch (error) {
        console.error("Error deleting idea:", error);
        return res.status(500).json({ message: "Server error deleting idea" });
    }
};

// Toggle Like
export const toggleLikeIdea = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });
        const userId = (req.user as any).id;
        const ideaId = req.params.id as string;

        const existingLike = await prisma.like.findUnique({
            where: { userId_ideaId: { userId, ideaId } }
        });

        if (existingLike) {
            await prisma.like.delete({ where: { id: existingLike.id } });
            return res.status(200).json({ liked: false, userId });
        } else {
            const newLike = await prisma.like.create({ data: { userId, ideaId } });
            return res.status(200).json({ liked: true, like: newLike });
        }
    } catch (err) {
        console.error("Error toggling like:", err);
        return res.status(500).json({ message: "Error toggling like" });
    }
};

// Add Comment
export const addComment = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });
        const userId = (req.user as any).id;
        const ideaId = req.params.id as string;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: "Comment text is required" });

        const comment = await prisma.comment.create({
            data: { text, userId, ideaId },
            include: { user: { select: { username: true, avatar: true } } }
        });
        return res.status(201).json(comment);
    } catch (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json({ message: "Error adding comment" });
    }
};

// Request Collaboration on an Idea (API #1)
export const requestIdeaCollaboration = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const senderId = (req.user as any).id;
        const ideaId = req.params.id as string;

        // 1. Find target Idea
        const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
        if (!idea) {
            return res.status(404).json({ message: "Idea not found" });
        }

        // 2. Prevent self-collaboration
        if (idea.authorId === senderId) {
            return res.status(400).json({ message: "You cannot request collaboration on your own idea" });
        }

        // 3. Prevent duplicate requests
        const existingRequest = await prisma.collabrationRequest.findUnique({
            where: {
                ideaId_senderId: { ideaId, senderId }
            }
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Collaboration request already sent for this idea" });
        }

        // 4. Save Collaboration Request to PostgreSQL Database
        const collabRequest = await prisma.collabrationRequest.create({
            data: {
                ideaId,
                senderId,
                recieverId: idea.authorId,
                status: 'PENDING'
            },
            include: {
                sender: { select: { id: true, username: true, avatar: true } },
                idea: { select: { id: true, title: true } }
            }
        });

        // 5. Broadcast Real-time Socket Notification to Idea Owner
        io.to(`user_${idea.authorId}`).emit('new_collaborate_notification', {
            id: collabRequest.id,
            senderId: collabRequest.senderId,
            senderName: collabRequest.sender?.username || 'Collaborator',
            senderAvatar: collabRequest.sender?.avatar,
            ideaId: collabRequest.ideaId,
            ideaTitle: collabRequest.idea.title,
            timestamp: collabRequest.createdAt.toISOString()
        });

        return res.status(201).json({
            message: "Collaboration request sent successfully",
            collabRequest
        });
    } catch (err) {
        console.error("Error requesting collaboration:", err);
        return res.status(500).json({ message: "Server error sending collaboration request" });
    }
};