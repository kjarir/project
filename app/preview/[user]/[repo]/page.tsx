'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ChevronRight, File, Folder, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getRepositoryFiles, getFileContent, RepositoryFile } from '@/lib/github'
import { incrementVisitCount } from '@/lib/docs'
import MarkdownRenderer from '@/components/docs/MarkdownRenderer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export default function PreviewPage() {
  const params = useParams()
  const { user, repo } = params as { user: string; repo: string }
  
  const [files, setFiles] = useState<RepositoryFile[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ name: string; path: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentFile, setCurrentFile] = useState<RepositoryFile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock access token for demo purposes
        const accessToken = 'mock-token'
        
        // Fetch files for the current path
        const repoFiles = await getRepositoryFiles(user, repo, currentPath, accessToken)
        setFiles(repoFiles)
        
        // If README.md exists at the current path, select it by default
        const readme = repoFiles.find(file => file.name === 'README.md')
        if (readme) {
          handleFileClick(readme)
        } else if (repoFiles.length > 0 && repoFiles[0].type === 'file') {
          // Otherwise select the first file
          handleFileClick(repoFiles[0])
        }
        
        // Update breadcrumbs
        updateBreadcrumbs()
        
        // Record the visit
        await incrementVisitCount('1') // Mock doc site ID
      } catch (error) {
        console.error('Failed to fetch repository data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [user, repo, currentPath])
  
  const updateBreadcrumbs = () => {
    const paths = currentPath.split('/').filter(Boolean)
    const crumbs = [{ name: repo, path: '' }]
    
    let currentBreadcrumbPath = ''
    paths.forEach(part => {
      currentBreadcrumbPath += `${currentBreadcrumbPath ? '/' : ''}${part}`
      crumbs.push({ name: part, path: currentBreadcrumbPath })
    })
    
    setBreadcrumbs(crumbs)
  }
  
  const handleFileClick = async (file: RepositoryFile) => {
    if (file.type === 'dir') {
      setCurrentPath(file.path)
      setCurrentFile(null)
      setFileContent('')
      return
    }
    
    setIsLoading(true)
    try {
      // Mock access token for demo purposes
      const accessToken = 'mock-token'
      
      const content = await getFileContent(user, repo, file.path, accessToken)
      setFileContent(content)
      setCurrentFile(file)
    } catch (error) {
      console.error('Failed to fetch file content:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path)
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Documentation header */}
      <header className="border-b px-4 py-3 bg-card">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-semibold text-lg truncate">
              {user}/{repo}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <a href={`https://github.com/${user}/${repo}`} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 border-r bg-card overflow-hidden transition-all duration-300 ease-in-out",
          sidebarOpen ? "block" : "hidden md:block"
        )}>
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="mb-4">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 text-sm text-muted-foreground">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={index} className="flex items-center">
                        {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                        <button
                          onClick={() => handleBreadcrumbClick(crumb.path)}
                          className="hover:text-primary truncate max-w-[100px] sm:max-w-none"
                        >
                          {crumb.name}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
              
              <div className="space-y-1">
                {files
                  .sort((a, b) => {
                    // Directories first, then files
                    if (a.type !== b.type) {
                      return a.type === 'dir' ? -1 : 1
                    }
                    // Alphabetical within each type
                    return a.name.localeCompare(b.name)
                  })
                  .map((file) => (
                    <button
                      key={file.path}
                      onClick={() => handleFileClick(file)}
                      className={cn(
                        "flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent",
                        currentFile?.path === file.path && "bg-accent text-accent-foreground"
                      )}
                    >
                      {file.type === 'dir' ? (
                        <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                      ) : (
                        <File className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="truncate">{file.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          </ScrollArea>
        </aside>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : currentFile ? (
              <MarkdownRenderer content={fileContent} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-lg font-medium">Select a file to view its content</h2>
                <p className="text-muted-foreground mt-2">
                  Choose a Markdown file from the sidebar to preview its content
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}