import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  getUserGithubRepos,
  requestToJoinProject,
  manageMemberStatus
} from '../controllers/ProjectController.js';

const router = Router();

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (req.user || req.isAuthenticated?.()) {
    return next();
  }
  return res.status(401).json({ message: 'Authentication required' });
};

// Project Endpoints
router.get('/', getProjects);
router.post('/', requireAuth, createProject);
router.get('/my-github-repos', requireAuth, getUserGithubRepos);
router.get('/:id', getProjectById);
router.post('/:id/join', requireAuth, requestToJoinProject);
router.patch('/:id/members/:memberId', requireAuth, manageMemberStatus);

export default router;
