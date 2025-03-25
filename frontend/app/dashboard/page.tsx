"use client";

import { useState, useEffect } from "react";
import { JobDashboard } from "@/components/job-dashboard";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ResumeUploader } from "@/components/resume-uploader";
import Link from "next/link";

export default function DashboardPage() {
  const [showResumeUploader, setShowResumeUploader] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold">
                <span className="text-black group-hover:animate-text-gradient transition-all duration-300">
                  Kod
                </span>
                <span className="text-yellow-500 group-hover:animate-text-gradient transition-all duration-300">
                  Jobs
                </span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300"></span>
            </a>
            <Link
              href="/profile"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Profile
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="group overflow-hidden relative"
              onClick={() => setShowResumeUploader(true)}
              disabled={!isLoggedIn}
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Upload Resume
              </span>
              <FileText className="ml-2 h-4 w-4 relative z-10" />
              <span className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-800 font-medium text-sm"></span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <JobDashboard />
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KodJobs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {showResumeUploader && (
        <ResumeUploader onClose={() => setShowResumeUploader(false)} />
      )}
    </div>
  );
}
