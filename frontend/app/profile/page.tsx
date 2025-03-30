"use client";

import { useState, useEffect } from "react";
import { FileText, Briefcase, User } from "lucide-react";
// import { ArrowUpRight } from "lucide-react";
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
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto border border-gray-100">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <Button
                onClick={() =>
                  alert(
                    "This Feature will be made available soon just an /edit endpoint  away"
                  )
                }
                variant="default"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Edit Profile
              </Button>
            </div>

            {/* Personal Information - Enhanced Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8 transition-all hover:shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <User className="mr-2 text-yellow-500 w-5 h-5" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Name
                  </label>
                  <p className="font-medium text-gray-900 text-sm">
                    {profileData?.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="font-medium text-gray-900 text-sm">
                    {profileData?.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Age
                  </label>
                  <p className="font-medium text-gray-900 text-sm">
                    {profileData?.age}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Job Matches Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <Briefcase className="mr-2 text-yellow-500 w-5 h-5" />
                Job Matches
              </h2>
              {matchesData && matchesData.length > 0 ? (
                <div className="space-y-3">
                  {matchesData.map((match) => (
                    <div
                      key={match.id}
                      className="group relative border rounded-xl p-4 bg-white shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <Briefcase className="text-yellow-600 w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {match.employer.companyName}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {match.employer.email}
                              </p>
                            </div>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                match.match
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {match.match ? "Direct Match" : "Potential"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">
                                  Match Score:
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-500"
                                    style={{ width: `${match.score * 10}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                  {match.score}/10
                                </span>
                              </div>
                            </div>
                          </div>
                          {match.requirement && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">
                                  Key Requirement:
                                </span>{" "}
                                {match.requirement}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                  <div className="text-center mb-4">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">
                      No matches yet
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Start by uploading your resume if uploaded sit back and
                      relax
                    </p>
                  </div>
                  {/* <Button
                    variant="default"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={fetchMatches}
                  >
                    Find Matches
                  </Button> */}
                </div>
              )}
            </div>

            {/* Enhanced Resume Section
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <FileText className="mr-2 text-yellow-500 w-5 h-5" />
                Resume
              </h2>
              {profileData?.resumeUrl ? (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      resume.pdf
                    </span>
                  </div>
                  <a
                    href={profileData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-yellow-600 hover:text-yellow-700 flex items-center gap-2"
                  >
                    View Resume
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                  <div className="text-center mb-4">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900">
                      No resume uploaded
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your resume to get better matches
                    </p>
                  </div>
                  <Button
                    variant="default"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => setShowResumeUploader(true)}
                  >
                    Upload Resume
                  </Button>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} KodJobs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
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
