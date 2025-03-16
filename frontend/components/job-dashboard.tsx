"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Filter,
  Search,
  ChevronRight,
  User,
  FileText,
  LayoutGrid,
  List,
  BookmarkPlus,
  AlertCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ResumeUploader } from "@/components/resume-uploader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  posted: string
  description: string
  skills: string[]
  featured: boolean
  postedBy: string
  postedAt: string
}

type ViewMode = "grid" | "list"

// Enhance the job dashboard with better visual appeal and user experience
export function JobDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showResumeUploader, setShowResumeUploader] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Check login status on component mount
  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  // Sample job data
  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA (Remote)",
      salary: "$120K - $150K",
      type: "Full-time",
      posted: "2 days ago",
      description:
        "We're looking for an experienced React developer to join our team and help build innovative web applications.",
      skills: ["React", "TypeScript", "Node.js", "Redux"],
      featured: true,
      postedBy: "Sarah Johnson",
      postedAt: "2023-03-15 09:30 AM",
    },
    {
      id: "2",
      title: "Frontend Engineer",
      company: "InnovateTech",
      location: "New York, NY (Hybrid)",
      salary: "$100K - $130K",
      type: "Full-time",
      posted: "1 week ago",
      description: "Join our growing team to develop responsive and user-friendly interfaces for our SaaS platform.",
      skills: ["JavaScript", "React", "CSS", "HTML"],
      featured: true,
      postedBy: "Michael Chen",
      postedAt: "2023-03-10 02:15 PM",
    },
    {
      id: "3",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Austin, TX (On-site)",
      salary: "$90K - $120K",
      type: "Full-time",
      posted: "3 days ago",
      description: "Looking for a versatile developer who can work on both frontend and backend technologies.",
      skills: ["JavaScript", "Python", "React", "Django"],
      featured: false,
      postedBy: "Alex Rodriguez",
      postedAt: "2023-03-14 11:45 AM",
    },
    {
      id: "4",
      title: "UI/UX Designer",
      company: "DesignHub",
      location: "Remote",
      salary: "$85K - $110K",
      type: "Contract",
      posted: "5 days ago",
      description: "Create beautiful and intuitive user interfaces for our clients across various industries.",
      skills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
      featured: false,
      postedBy: "Emma Wilson",
      postedAt: "2023-03-12 10:00 AM",
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudSystems",
      location: "Seattle, WA (Hybrid)",
      salary: "$130K - $160K",
      type: "Full-time",
      posted: "1 day ago",
      description: "Help us build and maintain our cloud infrastructure and deployment pipelines.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      featured: true,
      postedBy: "David Park",
      postedAt: "2023-03-16 03:20 PM",
    },
    {
      id: "6",
      title: "Mobile Developer",
      company: "AppWorks",
      location: "Chicago, IL (Remote)",
      salary: "$95K - $125K",
      type: "Full-time",
      posted: "1 week ago",
      description: "Develop cross-platform mobile applications using React Native for our clients.",
      skills: ["React Native", "JavaScript", "iOS", "Android"],
      featured: false,
      postedBy: "Jessica Lee",
      postedAt: "2023-03-10 09:15 AM",
    },
  ]

  // Filter jobs based on search term and active tab
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "featured") return matchesSearch && job.featured
    if (activeTab === "remote") return matchesSearch && job.location.toLowerCase().includes("remote")
    return matchesSearch
  })

  const handleUploadResume = () => {
    if (isLoggedIn) {
      setShowResumeUploader(true)
    } else {
      setShowLoginAlert(true)
      setTimeout(() => setShowLoginAlert(false), 5000)
    }
  }

  return (
    <div className="w-full py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-4 md:space-y-8">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Job Dashboard</h2>
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-9 px-2", viewMode === "grid" && "bg-muted")}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-9 px-2", viewMode === "list" && "bg-muted")}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Browse through our curated list of tech jobs that match your skills and preferences.
            </p>
          </div>

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="pl-10 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search jobs"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-9" onClick={handleUploadResume}>
                <FileText className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="remote">Remote</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobListItem key={job.id} job={job} />
                  ))}
                </div>
              )}
              {filteredJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No jobs found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              {viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobListItem key={job.id} job={job} />
                  ))}
                </div>
              )}
              {filteredJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No featured jobs found</h3>
                  <p className="text-muted-foreground mt-1">Check back later for new opportunities</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="remote" className="mt-6">
              {viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobListItem key={job.id} job={job} />
                  ))}
                </div>
              )}
              {filteredJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No remote jobs found</h3>
                  <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showResumeUploader && <ResumeUploader onClose={() => setShowResumeUploader(false)} />}

      {showLoginAlert && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
          <Alert variant="destructive" className="w-80">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please log in to upload your resume</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

interface JobCardProps {
  job: Job
}

function JobCard({ job }: JobCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg group-hover:text-yellow-500 transition-colors">{job.title}</h3>
            <p className="text-muted-foreground">{job.company}</p>
          </div>
          {job.featured && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Featured</Badge>}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2 text-yellow-500" />
            Posted by: {job.postedBy}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 text-yellow-500" />
            {job.postedAt}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2 text-yellow-500" />
            {job.salary}
          </div>
        </div>

        <p className="text-sm mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="bg-muted/50">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 mt-2">
        <Button className="w-full gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black">
          <span className="relative z-10">Apply Now</span>
          <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Add a new JobListItem component for list view
function JobListItem({ job }: JobCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg group-hover:text-yellow-500 transition-colors">{job.title}</h3>
                {job.featured && <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Featured</Badge>}
              </div>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
            <div className="hidden md:block">
              <Button className="gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black">
                <span className="relative z-10">Apply Now</span>
                <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2 text-yellow-500" />
              Posted by: {job.postedBy}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
              {job.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-2 text-yellow-500" />
              {job.salary}
            </div>
          </div>

          <p className="text-sm mb-3 line-clamp-2">{job.description}</p>

          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="outline" className="bg-muted/50">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="md:hidden mt-3">
          <Button className="w-full gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black">
            <span className="relative z-10">Apply Now</span>
            <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Button>
        </div>
      </div>
    </Card>
  )
}

