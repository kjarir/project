export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  owner: {
    login: string;
    avatarUrl: string;
  };
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
  defaultBranch: string;
}

export interface RepositoryFile {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  accessToken: string;
}

export interface DocSite {
  id: string;
  repositoryId: number;
  repositoryName: string;
  repositoryOwner: string;
  siteName: string;
  siteUrl: string;
  createdAt: string;
  updatedAt: string;
  visitCount: number;
  theme: string;
}