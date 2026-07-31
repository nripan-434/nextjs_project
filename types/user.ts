export interface User {
  id: string;
  email: string;
  username?: string | null;
  avatar?: string | null;
  githubUrl?: string | null;
  bio?: string | null;
  role?: string | null;
  techStack?: string[];
  isProfileComplete?: boolean;
  createdAt?: string | Date;
}

export interface UpdateProfileDTO {
  bio?: string;
  role?: string;
  githubUrl?: string;
  techStack?: string[];
}
