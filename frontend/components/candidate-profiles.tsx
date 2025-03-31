"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, User, Star, Mail, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface Candidate {
  name: string;
  email: string;
  age: number;
  resumeUrl: string;
  // We'll keep some fields for UI purposes
  title?: string;
  location?: string;
  photo?: string;
}

export function CandidateProfiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${API_URL}/api/hire/candidates`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        // Check if data exists and has the candidates property
        if (data && Array.isArray(data)) {
          // If the response is directly an array
          const enhancedCandidates = data.map((candidate: Candidate) => ({
            ...candidate,
            title: "Job Seeker",
            location: "Location not specified",
            photo: "/placeholder.svg?height=80&width=80",
          }));
          setCandidates(enhancedCandidates);
        } else if (data && Array.isArray(data.candidates)) {
          // If the response has a candidates property
          const enhancedCandidates = data.candidates.map(
            (candidate: Candidate) => ({
              ...candidate,
              title: "Job Seeker",
              location: "Location not specified",
              photo: "/placeholder.svg?height=80&width=80",
            })
          );
          setCandidates(enhancedCandidates);
        } else {
          console.error("Invalid data format received from API");
          setCandidates([]);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filter candidates based on search term and active tab
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="w-full py-8">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-4 md:space-y-8">
          <div className="flex flex-col space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Candidate Profiles
            </h2>
            <p className="text-muted-foreground">
              Browse through potential candidates that match your job
              requirements.
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

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="all">All Candidates</TabsTrigger>
              <TabsTrigger value="top">Top Matches</TabsTrigger>
              <TabsTrigger value="new">Immediately Available</TabsTrigger>
            </TabsList>

            <div className="mt-6 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-5 lg:col-span-4 space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p>Loading candidates...</p>
                  </div>
                ) : (
                  <>
                    {filteredCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.email}
                        candidate={candidate}
                        isSelected={selectedCandidate === candidate.email}
                        onClick={() => setSelectedCandidate(candidate.email)}
                      />
                    ))}
                    {filteredCandidates.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <User className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">
                          No candidates found
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Try adjusting your search
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="md:col-span-7 lg:col-span-8">
                {selectedCandidate ? (
                  <CandidateDetail
                    candidate={
                      candidates.find((c) => c.email === selectedCandidate)!
                    }
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center border rounded-lg bg-muted/10">
                    <User className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">Select a candidate</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      Click on a candidate from the list to view their detailed
                      profile
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onClick: () => void;
}

function CandidateCard({ candidate, isSelected, onClick }: CandidateCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 border-l-4",
        isSelected
          ? "border-l-yellow-500 shadow-md"
          : "border-l-transparent hover:border-l-yellow-200 hover:shadow-md"
      )}
    >
      <CardContent className="p-4">
        <div
          className="flex items-start gap-3 cursor-pointer group"
          onClick={onClick}
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base truncate group-hover:text-yellow-600">
              {candidate.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {candidate.email}
            </p>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              <span>Age: {candidate.age}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-dashed">
          <Button
            variant="default"
            size="sm"
            className="w-full gap-2 text-xs transition-colors bg-black text-white hover:bg-white hover:text-black border-black"
            onClick={(e) => {
              e.stopPropagation();
              if (candidate.resumeUrl) {
                const link = document.createElement("a");
                link.href = candidate.resumeUrl;
                link.download = `${candidate.name.replace(
                  /\s+/g,
                  "_"
                )}_resume.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            disabled={!candidate.resumeUrl}
          >
            <Download className="h-3 w-3" />
            {candidate.resumeUrl
              ? "Download Resume"
              : "Add Requirements and Download Resume"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface CandidateDetailProps {
  candidate: Candidate;
}

function CandidateDetail({ candidate }: CandidateDetailProps) {
  return (
    <div className="border rounded-lg p-6 space-y-6 bg-white shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center text-2xl font-bold text-yellow-700">
          {candidate.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{candidate.name}</h2>
          <p className="text-lg text-muted-foreground">{candidate.email}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-sm text-muted-foreground bg-gray-50 px-3 py-1 rounded-full">
              <User className="h-4 w-4 mr-1 text-yellow-500" />
              Age: {candidate.age}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className={cn(
            "gap-2 border-2 transition-all border-black",
            candidate.resumeUrl
              ? "bg-black text-white hover:bg-white hover:text-black"
              : "opacity-75"
          )}
          onClick={() => {
            if (candidate.resumeUrl) {
              const link = document.createElement("a");
              link.href = candidate.resumeUrl;
              link.download = `${candidate.name.replace(
                /\s+/g,
                "_"
              )}_resume.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
          disabled={!candidate.resumeUrl}
        >
          <Download className="h-4 w-4" />
          {candidate.resumeUrl ? "Download Resume" : "Available Soon"}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          Quick Actions
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="hover:border-yellow-500 hover:text-yellow-600"
          >
            <Mail className="h-4 w-4 mr-1" />
            Contact
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="hover:border-yellow-500 hover:text-yellow-600"
          >
            <Star className="h-4 w-4 mr-1" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
