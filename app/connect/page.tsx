'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Book, Check, ChevronsUpDown, FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUserRepositories, Repository } from '@/lib/github'
import { createDocSite } from '@/lib/docs'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

export default function ConnectPage() {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [siteName, setSiteName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session?.user && (session.user as any).accessToken) {
          const repos = await getUserRepositories((session.user as any).accessToken)
          setRepositories(repos)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    if (status === 'authenticated') {
      fetchData()
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [session, status, router])

  useEffect(() => {
    if (selectedRepo) {
      setSiteName(selectedRepo.name)
    }
  }, [selectedRepo])

  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    repo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const safeRepositories = Array.from(repositories ?? [])

  const handleCreateSite = async () => {
    if (!session?.user || !selectedRepo || !siteName) return
    setIsCreating(true)
    try {
      await createDocSite(
        (session.user as any).id,
        selectedRepo.id,
        selectedRepo.name,
        selectedRepo.owner.login,
        siteName
      )
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to create documentation site:', error)
      setIsCreating(false)
    }
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Connect Repository</h1>
        <p className="text-muted-foreground mt-2">
          Select a GitHub repository to create a documentation site
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Repository</CardTitle>
          <CardDescription>
            Choose a repository containing Markdown files you want to document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="select" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="select" className="flex-1">Select Repository</TabsTrigger>
              <TabsTrigger value="configure" className="flex-1" disabled={!selectedRepo}>Configure Site</TabsTrigger>
            </TabsList>

            <TabsContent value="select">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search-repo" className="text-sm font-medium">
                    Search Your Repositories
                  </Label>
                  
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between mt-2"
                      >
                        {selectedRepo ? selectedRepo.name : "Select a repository..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 md:w-[500px]">
                      <Command>
                        <CommandInput placeholder="Search repositories..." />
                        <CommandEmpty>No repositories found.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                          {safeRepositories.map((repo) => (
                            <CommandItem
                              key={repo.id}
                              onSelect={() => {
                                setSelectedRepo(repo)
                                setOpen(false)
                              }}
                              className="flex items-center"
                            >
                              <Book className="mr-2 h-4 w-4" />
                              <span className="flex-1 truncate">{repo.fullName}</span>
                              {selectedRepo?.id === repo.id && (
                                <Check className="ml-2 h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedRepo && (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Book className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedRepo.fullName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedRepo.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>⭐ {selectedRepo.stargazersCount} stars</span>
                          <span>🍴 {selectedRepo.forksCount} forks</span>
                          <span>Updated {new Date(selectedRepo.updatedAt ?? '').toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => {}}
                    disabled={!selectedRepo}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="configure">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be displayed as the title of your documentation site.
                  </p>
                </div>

                <div>
                  <Label>Preview URL</Label>
                  <div className="flex items-center mt-1 p-2 bg-muted rounded-md text-sm">
                    <span className="text-muted-foreground">
                      {window.location.origin}/preview/
                      {selectedRepo?.owner.login || 'user'}/
                      {selectedRepo?.name || 'repo'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRepo(null)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateSite}
                    disabled={!siteName || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Create Documentation Site
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}