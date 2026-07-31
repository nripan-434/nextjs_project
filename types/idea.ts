import type { User } from './user.js';

export interface Like {
  id: string;
  userId: string;
  ideaId: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  user?: Partial<User> | null;
  ideaId: string;
  createdAt: string | Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  authorId: string;
  author?: Partial<User> | null;
  likes?: Like[];
  comments?: Comment[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface CreateIdeaDTO {
  title: string;
  description: string;
  tags?: string[];
}

export interface UpdateIdeaDTO {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface CreateCommentDTO {
  text: string;
}
