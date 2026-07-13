import { Router } from 'express';
import { createIdea, getIdeas, updateIdea, deleteIdea, toggleLikeIdea, addComment } from '../controllers/IdeaController.js';

const router = Router();

// Create
router.post('/', createIdea);

// Read All
router.get('/', getIdeas);

// Update
router.put('/:id', updateIdea);

// Delete
router.delete('/:id', deleteIdea);

// Interactions
router.post('/:id/like', toggleLikeIdea);
router.post('/:id/comments', addComment);

export default router;
