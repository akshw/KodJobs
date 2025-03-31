"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Toaster, toast } from "sonner";

interface User {
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
  user: User;
}

interface MatchesResponse {
  matches: Match[];
}

export default function RequirementPage() {
  const [requirement, setRequirement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hire/matches`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data: MatchesResponse = await response.json();
      if (data.matches && data.matches.length > 0) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requirement.trim()) {
      alert("Please enter job requirements before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/hire/require`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          requirement: requirement,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit requirements");
      }

      setRequirement("");
      await fetchMatches();
      toast.success(
        "Requirement Submitted, Matched candidates will appear below"
      );
    } catch (error) {
      console.error("Error submitting requirements:", error);
      toast.error("Failed to submit requirements");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
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
              href="/hire/dashboard"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-yellow-500 transition-colors relative group"
            >
              Requirements
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300"></span>
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="group overflow-hidden relative"
              onClick={() => {
                alert("Please type in the requirements for now");
              }}
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                Upload Requirements
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
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Job Requirements</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="requirements" className="text-sm font-medium">
                  Enter your job requirements
                </label>
                <Textarea
                  id="requirements"
                  placeholder="Enter detailed job requirements..."
                  value={requirement}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setRequirement(e.target.value)
                  }
                  className="min-h-[200px]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Requirements"}
              </Button>
            </form>

            {/* Matches Section */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Matched Candidates</h2>
              {matches.length > 0 ? (
                <div className="space-y-6">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-grow">
                          <p className="font-semibold text-lg">
                            {match.user.name}
                          </p>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <p>
                              <span className="font-medium">Age:</span>{" "}
                              {match.user.age}
                            </p>
                            <p>
                              <span className="font-medium">Email:</span>{" "}
                              <span className="text-gray-600">
                                {match.user.email}
                              </span>
                            </p>
                          </div>
                          {match.requirement && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Requirement:</span>{" "}
                              {match.requirement}
                            </p>
                          )}
                          {/* <div className="mt-4 flex space-x-3">
                            <a
                              href={match.user.resumeUrl}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                            >
                              View Resume
                            </a>
                          </div> */}
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm font-medium">
                          Match Score: {match.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No matches found. Submit requirements to find candidates.
                </p>
              )}
            </div>
          </div>
          <Toaster richColors position="top-center" />
        </div>
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
    </div>
  );
}
