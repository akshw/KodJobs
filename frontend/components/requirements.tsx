"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export function Requirements() {
  const [requirement, setRequirement] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/hire/require", {
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

      // Clear the input after successful submission
      setRequirement("");
      // You can add a success notification here
    } catch (error) {
      console.error("Error submitting requirements:", error);
      // You can add an error notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Requirements"}
          </Button>
        </form>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="group overflow-hidden relative"
        // onClick={() => setShowResumeUploader(true)}
        // disabled={!isLoggedIn}
      >
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
          Upload Requirements
        </span>
        {/* <FileText className="ml-2 h-4 w-4 relative z-10" /> */}
        <span className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
      </Button>
    </div>
  );
}
