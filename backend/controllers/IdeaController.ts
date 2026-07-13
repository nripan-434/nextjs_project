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
                author: {
                    select: { username: true, avatar: true }
                }
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
                author: {
                    select: { username: true, avatar: true }
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