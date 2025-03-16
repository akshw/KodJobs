"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { ResumeUploader } from "@/components/resume-uploader"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface UploadResumeButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function UploadResumeButton({ variant = "outline", size = "lg", className }: UploadResumeButtonProps) {
  const [showUploader, setShowUploader] = useState(false)
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])

  const handleClick = () => {
    if (isLoggedIn) {
      setShowUploader(true)
    } else {
      setShowLoginAlert(true)
      setTimeout(() => setShowLoginAlert(false), 5000)
    }
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={handleClick}>
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">Upload Resume</span>
        <FileText className="ml-2 h-4 w-4 relative z-10" />
      </Button>

      {showUploader && isLoggedIn && <ResumeUploader onClose={() => setShowUploader(false)} />}

      {showLoginAlert && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
          <Alert variant="destructive" className="w-80">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please log in to upload your resume</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}

