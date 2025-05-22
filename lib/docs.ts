// This file will handle documentation generation and rendering

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

// Mock function to get user doc sites
// In a real app, this would query the database
export const getUserDocSites = async (userId: string): Promise<DocSite[]> => {
  // For demo purposes, return mock doc sites
  return [
    {
      id: '1',
      repositoryId: 1,
      repositoryName: 'project-docs',
      repositoryOwner: 'johndoe',
      siteName: 'Project Documentation',
      siteUrl: '/preview/johndoe/project-docs',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-03T00:00:00Z',
      visitCount: 120,
      theme: 'default',
    },
    {
      id: '2',
      repositoryId: 2,
      repositoryName: 'api-docs',
      repositoryOwner: 'johndoe',
      siteName: 'API Documentation',
      siteUrl: '/preview/johndoe/api-docs',
      createdAt: '2023-02-02T00:00:00Z',
      updatedAt: '2023-02-03T00:00:00Z',
      visitCount: 85,
      theme: 'dark',
    },
  ];
};

// Mock function to create a new doc site
// In a real app, this would insert into the database
export const createDocSite = async (
  userId: string,
  repositoryId: number,
  repositoryName: string,
  repositoryOwner: string,
  siteName: string,
  theme: string = 'default'
): Promise<DocSite> => {
  // For demo purposes, return a mock doc site
  return {
    id: Date.now().toString(),
    repositoryId,
    repositoryName,
    repositoryOwner,
    siteName,
    siteUrl: `/preview/${repositoryOwner}/${repositoryName}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    visitCount: 0,
    theme,
  };
};

// Mock function to delete a doc site
// In a real app, this would delete from the database
export const deleteDocSite = async (docSiteId: string): Promise<boolean> => {
  // For demo purposes, return success
  return true;
};

// Mock function to increment the visit count
// In a real app, this would update the database
export const incrementVisitCount = async (docSiteId: string): Promise<number> => {
  // For demo purposes, return a mock count
  return 121;
};

// Available themes for documentation sites
export const availableThemes = [
  { id: 'default', name: 'Default', description: 'Clean, minimal design' },
  { id: 'dark', name: 'Dark', description: 'Dark theme with syntax highlighting' },
  { id: 'docs', name: 'Documentation', description: 'Focused on readability' },
  { id: 'retro', name: 'Retro', description: 'Classic documentation style' },
];