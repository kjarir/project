import { Octokit } from '@octokit/rest'

export interface Repository {
  id: number
  name: string
  fullName: string
  description: string | null
  private: boolean
  owner: {
    login: string
    avatarUrl: string
  }
  stargazersCount: number
  forksCount: number
  updatedAt: string | null
  defaultBranch: string
}

export interface RepositoryFile {
  name: string
  path: string
  sha: string
  type: 'file' | 'dir' | 'submodule' | 'symlink'
  content?: string
  encoding?: string
  size?: number
  url?: string
  git_url?: string | null
  html_url?: string | null
  download_url?: string | null
  _links?: {
    git: string | null
    html: string | null
    self: string
  }
}

export const getUserRepositories = async (accessToken: string): Promise<Repository[]> => {
  const octokit = new Octokit({ auth: accessToken })

  const { data: repos } = await octokit.request('GET /user/repos', {
    sort: 'updated',
    per_page: 100,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    private: repo.private,
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url
    },
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    updatedAt: repo.updated_at,
    defaultBranch: repo.default_branch
  }))
}

export const getRepositoryFiles = async (
  owner: string,
  repo: string,
  path: string = '',
  accessToken: string
): Promise<RepositoryFile[]> => {
  const octokit = new Octokit({ auth: accessToken })

  const { data: files } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return Array.isArray(files) ? files.map(file => ({
    name: file.name,
    path: file.path,
    sha: file.sha,
    type: file.type,
    content: file.type === 'file' ? (file as any).content : undefined,
    encoding: file.type === 'file' ? (file as any).encoding : undefined
  })) : [files].map(file => ({
    name: file.name,
    path: file.path,
    sha: file.sha,
    type: file.type,
    content: file.type === 'file' ? (file as any).content : undefined,
    encoding: file.type === 'file' ? (file as any).encoding : undefined
  }))
}

export const getFileContent = async (
  owner: string,
  repo: string,
  path: string,
  accessToken: string
): Promise<string> => {
  const octokit = new Octokit({ auth: accessToken })

  const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  if ('content' in data && data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }

  throw new Error('Could not fetch file content')
}

export class GitHubError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'GitHubError'
  }
}

export async function getGitHubClient(accessToken: string) {
  if (!accessToken) {
    throw new GitHubError('No access token provided')
  }

  return new Octokit({
    auth: accessToken,
  })
}

export async function getRepositoryContent(accessToken: string, owner: string, repo: string, path: string = '') {
  try {
    const octokit = await getGitHubClient(accessToken)
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    })

    return response.data
  } catch (error: any) {
    if (error.status === 404) {
      throw new GitHubError('Repository or file not found', 404)
    }
    if (error.status === 403) {
      throw new GitHubError('Access denied', 403)
    }
    throw new GitHubError(error.message || 'Failed to fetch repository content')
  }
}

export async function getRepositoryReadme(accessToken: string, owner: string, repo: string) {
  try {
    const octokit = await getGitHubClient(accessToken)
    const response = await octokit.repos.getReadme({
      owner,
      repo,
    })

    return response.data
  } catch (error: any) {
    if (error.status === 404) {
      throw new GitHubError('README not found', 404)
    }
    if (error.status === 403) {
      throw new GitHubError('Access denied', 403)
    }
    throw new GitHubError(error.message || 'Failed to fetch README')
  }
}