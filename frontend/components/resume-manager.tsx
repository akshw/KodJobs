"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { FileText, Trash2, Download, Calendar, FileUp } from "lucide-react"
import { ResumeUploader } from "@/components/resume-uploader"
import { getResumes, deleteResume, type ResumeFile } from "@/lib/resume-service"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function ResumeManager() {
  const [showUploader, setShowUploader] = useState(false)
  const [resumes, setResumes] = useState<ResumeFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Load resumes on component mount
  useEffect(() => {
    try {
      const loadedResumes = getResumes()
      setResumes(loadedResumes)
    } catch (error) {
      console.error("Error loading resumes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh resumes after upload
  const handleUploaderClose = () => {
    setShowUploader(false)
    setResumes(getResumes())
  }

  // Handle resume deletion
  const handleDeleteResume = (id: string) => {
    if (deleteConfirm === id) {
      deleteResume(id)
      setResumes(getResumes())
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Resumes</h2>
        <Button onClick={() => setShowUploader(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <FileUp className="h-4 w-4 mr-2" />
          Upload New Resume
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                    <span className="truncate">{resume.name}</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  {formatFileSize(resume.size)} • {resume.type.split("/")[1].toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Uploaded {formatDistanceToNow(new Date(resume.uploadDate), { addSuffix: true })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resume.url && window.open(resume.url, "_blank")}
                  disabled={!resume.url}
                >
                  <Download className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant={deleteConfirm === resume.id ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleDeleteResume(resume.id)}
                  className={cn(deleteConfirm === resume.id && "animate-pulse")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteConfirm === resume.id ? "Confirm" : "Delete"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No resumes uploaded yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Upload your resume to help us match you with the perfect job opportunities
            </p>
            <Button onClick={() => setShowUploader(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <FileUp className="h-4 w-4 mr-2" />
              Upload Resume
            </Button>
          </CardContent>
        </Card>
      )}

      {showUploader && <ResumeUploader onClose={handleUploaderClose} />}
    </div>
  )
}

