"use client";

import { useState, useEffect } from "react";
import { FileText, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResumeUploader } from "@/components/resume-uploader";

interface ProfileData {
  email: string;
  name: string;
  age: number;
  resumeUrl: string;
}

interface Match {
  id: number;
  score: number;
  match: boolean;
  requirement: string | null;
  employer: {
    email: string;
    companyName: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [matchesData, setMatchesData] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResumeUploader, setShowResumeUploader] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    return !!token;
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data: ProfileData = await response.json();
      setProfileData(data);
    } catch (err) {
      setError("Failed to load profile data");
      console.error(err);
    }
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/user/matches`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();

      // Handle different possible response structures
      if (Array.isArray(data)) {
        setMatchesData(data);
      } else if (data && Array.isArray(data.matches)) {
        setMatchesData(data.matches);
      } else if (data && Array.isArray(data.data)) {
        setMatchesData(data.data);
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!checkAuth()) {
        setError("Your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        await fetchProfile();
        await fetchMatches();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-red-500 font-medium text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
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
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a
              href="#"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Profile
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300"></span>
            </a>
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

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <Button
                variant="default"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Edit Profile
              </Button>
            </div>

            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <User className="mr-2 text-yellow-500" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">
                      Name
                    </label>
                    <p className="font-medium text-gray-800">
                      {profileData?.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">
                      Email
                    </label>
                    <p className="font-medium text-gray-800">
                      {profileData?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">
                      Age
                    </label>
                    <p className="font-medium text-gray-800">
                      {profileData?.age}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Matches */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <Briefcase className="mr-2 text-yellow-500" />
                  Job Matches
                </h2>
                {matchesData && matchesData.length > 0 ? (
                  <div className="space-y-4">
                    {matchesData.map((match) => (
                      <div
                        key={match.id}
                        className="border rounded-lg p-4 bg-white shadow-sm"
                      >
                        <div className="flex items-start">
                          <Briefcase className="text-yellow-500 flex-shrink-0 mr-4 h-6 w-6" />
                          <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">
                                {match.employer.companyName}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  match.match
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {match.match ? "Matched" : "Potential Match"}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Employer:</span>{" "}
                                {match.employer.email}
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Match Score:
                                </span>{" "}
                                {match.score}/10
                              </div>
                            </div>
                            {match.requirement && (
                              <div className="mt-2 text-sm">
                                <span className="text-gray-500">
                                  Requirement:
                                </span>{" "}
                                {match.requirement}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">
                      No job matches available
                    </p>
                    <Button
                      variant="default"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={fetchMatches}
                    >
                      Find Matches
                    </Button>
                  </div>
                )}
              </div>

              {/* Resume Section */}

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <FileText className="mr-2 text-yellow-500" />
                  Resume
                </h2>
                {profileData?.resumeUrl ? (
                  <a
                    href={profileData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <FileText className="mr-2" />
                    View Resume
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">No resume uploaded</p>
                    <Button
                      variant="default"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => setShowResumeUploader(true)}
                    >
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
