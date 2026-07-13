import type { Request, Response } from 'express';
import { prisma } from '../server.js';

// Create a new Idea (Post)
export const createIdea = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const authorId = (req.user as any).id;
        const { title, description, tags } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
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

        return res.status(201).json(newIdea);
    } catch (error) {
        console.error("Error creating idea:", error);
        return res.status(500).json({ message: "Server error creating idea" });
    }
};

// Get all Ideas (Feed)
export const getIdeas = async (req: Request, res: Response): Promise<any> => {
    try {
        const ideas = await prisma.idea.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { username: true, avatar: true } },
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
        const { id } = req.params;
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
        const { id } = req.params;

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
        const { id: ideaId } = req.params;

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
    } catch(err) {
        console.error("Error toggling like:", err);
        return res.status(500).json({ message: "Error toggling like" });
    }
};

// Add Comment
export const addComment = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authenticated" });
        const userId = (req.user as any).id;
        const { id: ideaId } = req.params;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: "Comment text is required" });

        const comment = await prisma.comment.create({
            data: { text, userId, ideaId },
            include: { user: { select: { username: true, avatar: true } } }
        });
        return res.status(201).json(comment);
    } catch(err) {
        console.error("Error adding comment:", err);
        return res.status(500).json({ message: "Error adding comment" });
    }
};