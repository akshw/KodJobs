"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase } from "lucide-react";
import Link from "next/link";

interface ProfileData {
  email: string;
  name: string;
  age: number;
  resumeUrl: string;
  matches: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{profileData?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{profileData?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Age</label>
                  <p className="font-medium">{profileData?.age}</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4">Resume</h2>
              {profileData?.resumeUrl ? (
                <a
                  href={profileData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-yellow-500 hover:text-yellow-600"
                >
                  <FileText className="mr-2" />
                  View Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Job Matches</h2>
              {profileData?.matches ? (
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {profileData.matches}
                      </p>
                    </div>
                    <Briefcase className="text-yellow-500 flex-shrink-0 ml-4" />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No job matches found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
