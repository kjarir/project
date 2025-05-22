'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart, FilePlus, Pencil, RefreshCw, Settings, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from 'next-auth/react'
import { getUserDocSites, deleteDocSite, DocSite } from '@/lib/docs'

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [docSites, setDocSites] = useState<DocSite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session?.user && (session.user as any).id) {
          const sites = await getUserDocSites((session.user as any).id)
          setDocSites(sites)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
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

  const handleDeleteSite = async (siteId: string) => {
    if (confirm('Are you sure you want to delete this documentation site?')) {
      try {
        await deleteDocSite(siteId)
        setDocSites(docSites.filter(site => site.id !== siteId))
      } catch (error) {
        console.error('Failed to delete site:', error)
      }
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your documentation sites
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/connect">
            <FilePlus className="mr-2 h-4 w-4" />
            New Documentation Site
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="sites" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="sites">My Sites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sites">
          {docSites.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Documentation Sites Yet</CardTitle>
                <CardDescription>
                  Create your first documentation site by connecting a GitHub repository.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/connect">
                    <FilePlus className="mr-2 h-4 w-4" />
                    New Documentation Site
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docSites.map((site) => (
                <Card key={site.id}>
                  <CardHeader className="pb-3">
                    <CardTitle>{site.siteName}</CardTitle>
                    <CardDescription>
                      {site.repositoryOwner}/{site.repositoryName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>{site.visitCount} visits</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Last updated: {new Date(site.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild variant="outline" size="sm">
                      <Link href={site.siteUrl}>
                        View Site
                      </Link>
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <RefreshCw className="h-4 w-4" />
                        <span className="sr-only">Refresh</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDeleteSite(site.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View statistics about your documentation sites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed analytics will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">GitHub Connection</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connected as {session.user.name} ({session.user.email})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your email notification preferences
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}