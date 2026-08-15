import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  getUserGithubRepos,
  requestToJoinProject,
  manageMemberStatus,
  getProjectMessages
} from '../controllers/ProjectController.js';
import { AuthHandler } from '../middlewares/authHandler.js';

const router = Router();

// Project Endpoints
router.get('/', getProjects);
router.post('/', AuthHandler, createProject);
router.get('/my-github-repos', AuthHandler, getUserGithubRepos);
router.get('/:id', getProjectById);
router.get('/:id/messages', getProjectMessages);
router.post('/:id/join', AuthHandler, requestToJoinProject);
router.patch('/:id/members/:memberId', AuthHandler, manageMemberStatus);

export default router;
