import { Router } from 'express';
import { createIdea, getIdeas, updateIdea, deleteIdea, toggleLikeIdea, addComment, requestIdeaCollaboration } from '../controllers/IdeaController.js';
import { AuthHandler } from '../middlewares/authHandler.js';

const router = Router();

// Create (Protected)
router.post('/', AuthHandler, createIdea);

// Read All (Public)
router.get('/', getIdeas);

// Update (Protected)
router.put('/:id', AuthHandler, updateIdea);

// Delete (Protected)
router.delete('/:id', AuthHandler, deleteIdea);

// Interactions (Protected)
router.post('/:id/like', AuthHandler, toggleLikeIdea);
router.post('/:id/comments', AuthHandler, addComment);
router.post('/:id/collaborate', AuthHandler, requestIdeaCollaboration);

export default router;
