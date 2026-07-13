import { Router } from 'express';
import { createIdea, getIdeas, updateIdea, deleteIdea } from '../controllers/IdeaController.js';

const router = Router();

// Create
router.post('/', createIdea);

// Read All
router.get('/', getIdeas);

// Update
router.put('/:id', updateIdea);

// Delete
router.delete('/:id', deleteIdea);

export default router;
