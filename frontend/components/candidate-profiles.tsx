"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, User, MapPin, Briefcase, Star, Mail, Phone, Download, ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Candidate {
  id: string
  name: string
  title: string
  location: string
  experience: string
  skills: string[]
  education: string
  matchPercentage: number
  about: string
  email: string
  phone: string
  availability: string
  photo: string
}

export function CandidateProfiles() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  // Sample candidate data
  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Senior React Developer",
      location: "San Francisco, CA",
      experience: "7 years",
      skills: ["React", "TypeScript", "Node.js", "Redux", "GraphQL"],
      education: "M.S. Computer Science, Stanford University",
      matchPercentage: 95,
      about:
        "Experienced React developer with a strong background in building scalable web applications. Passionate about clean code and user experience.",
      email: "sarah.j@example.com",
      phone: "(555) 123-4567",
      availability: "Available in 2 weeks",
      photo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "Full Stack Engineer",
      location: "New York, NY",
      experience: "5 years",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
      education: "B.S. Computer Engineering, MIT",
      matchPercentage: 87,
      about:
        "Full stack developer with expertise in MERN stack. Experienced in building and deploying web applications from concept to production.",
      email: "michael.c@example.com",
      phone: "(555) 234-5678",
      availability: "Immediately available",
      photo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "Frontend Developer",
      location: "Austin, TX",
      experience: "3 years",
      skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
      education: "B.A. Design, Rhode Island School of Design",
      matchPercentage: 82,
      about:
        "Frontend developer with a design background. Specializes in creating beautiful, responsive, and accessible user interfaces.",
      email: "emily.r@example.com",
      phone: "(555) 345-6789",
      availability: "Available in 1 month",
      photo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      name: "David Kim",
      title: "DevOps Engineer",
      location: "Seattle, WA",
      experience: "6 years",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
      education: "B.S. Computer Science, University of Washington",
      matchPercentage: 90,
      about:
        "DevOps engineer with extensive experience in cloud infrastructure and automation. Focused on building reliable, scalable, and secure systems.",
      email: "david.k@example.com",
      phone: "(555) 456-7890",
      availability: "Available in 3 weeks",
      photo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "5",
      name: "Jessica Lee",
      title: "UI/UX Designer",
      location: "Los Angeles, CA",
      experience: "4 years",
      skills: ["Figma", "Adobe XD", "UI Design", "Prototyping", "User Research"],
      education: "B.F.A. Graphic Design, California Institute of the Arts",
      matchPercentage: 85,
      about:
        "Creative designer with a focus on user-centered design. Experienced in creating intuitive and engaging digital experiences across various platforms.",
      email: "jessica.l@example.com",
      phone: "(555) 567-8901",
      availability: "Immediately available",
      photo: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "6",
      name: "Alex Thompson",
      title: "Backend Developer",
      location: "Chicago, IL",
      experience: "5 years",
      skills: ["Python", "Django", "PostgreSQL", "API Design", "Docker"],
      education: "M.S. Software Engineering, Northwestern University",
      matchPercentage: 88,
      about:
        "Backend developer specializing in building robust and scalable APIs. Experienced in database design and performance optimization.",
      email: "alex.t@example.com",
      phone: "(555) 678-9012",
      availability: "Available in 2 weeks",
      photo: "/placeholder.svg?height=80&width=80",
    },
  ]

  // Filter candidates based on search term and active tab
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "top") return matchesSearch && candidate.matchPercentage >= 90
    if (activeTab === "new") return matchesSearch && candidate.availability.includes("Immediately")
    return matchesSearch
  })

  return (
    <div className="w-full py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-4 md:space-y-8">
          <div className="flex flex-col space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Candidate Profiles</h2>
            <p className="text-muted-foreground">
              Browse through potential candidates that match your job requirements.
            </p>
          </div>

          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search candidates, skills, or positions..."
                className="pl-10 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Star className="h-4 w-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="all">All Candidates</TabsTrigger>
              <TabsTrigger value="top">Top Matches</TabsTrigger>
              <TabsTrigger value="new">Immediately Available</TabsTrigger>
            </TabsList>

            <div className="mt-6 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-5 lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isSelected={selectedCandidate === candidate.id}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  />
                ))}
                {filteredCandidates.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No candidates found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-7 lg:col-span-8">
                {selectedCandidate ? (
                  <CandidateDetail candidate={candidates.find((c) => c.id === selectedCandidate)!} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center border rounded-lg bg-muted/10">
                    <User className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">Select a candidate</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      Click on a candidate from the list to view their detailed profile
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  onClick: () => void
}

function CandidateCard({ candidate, isSelected, onClick }: CandidateCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer",
        isSelected ? "border-yellow-500 bg-yellow-50/50" : "hover:border-yellow-200",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={candidate.photo || "/placeholder.svg"}
              alt={candidate.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base truncate">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{candidate.location}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge
              className={cn(
                "px-1.5 py-0.5",
                candidate.matchPercentage >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
              )}
            >
              {candidate.matchPercentage}%
            </Badge>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {candidate.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs px-1.5 py-0">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 3 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              +{candidate.skills.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface CandidateDetailProps {
  candidate: Candidate
}

function CandidateDetail({ candidate }: CandidateDetailProps) {
  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={candidate.photo || "/placeholder.svg"}
            alt={candidate.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{candidate.name}</h2>
            <Badge
              className={cn(
                "px-2 py-1",
                candidate.matchPercentage >= 90 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
              )}
            >
              {candidate.matchPercentage}% Match
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">{candidate.title}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {candidate.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-1" />
              {candidate.experience} experience
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-medium mb-2">About</h3>
          <p className="text-sm text-muted-foreground">{candidate.about}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Contact Information</h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{candidate.availability}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <Badge key={skill} className="bg-muted/50">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Education</h3>
        <p className="text-sm">{candidate.education}</p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button className="gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black">
          <span className="relative z-10">Contact Candidate</span>
          <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Resume
        </Button>
      </div>
    </div>
  )
}

