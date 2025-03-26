"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  X,
  Check,
  AlertCircle,
  Loader2,
  FileUp,
  File,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadResumeToS3 } from "@/lib/resume-service";

interface ResumeUploaderProps {
  onClose: () => void;
}

export function ResumeUploader({ onClose }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        validateAndSetFile(e.target.files[0]);
      }
    },
    []
  );

  const validateAndSetFile = (file: File) => {
    // Reset states
    setError("");
    setUploadProgress(0);
    setUploadComplete(false);

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setFile(file);
  };

  const handleUpload = useCallback(() => {
    if (!file) return;

    setIsUploading(true);
    setError("");
    setUploadProgress(10); // Start with initial progress

    // Actual upload to S3
    uploadResumeToS3(file)
      .then(() => {
        setUploadProgress(100);
        setIsUploading(false);
        setUploadComplete(true);
        setUploadedFiles((prev) => [...prev, file.name]);
      })
      .catch((err) => {
        console.error("Upload error:", err);
        setError(err.message || "Failed to upload resume");
        setIsUploading(false);
      });

    // Simulate progress while waiting
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
  }, [file]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetUpload = useCallback(() => {
    setFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setError("");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Your Resume</DialogTitle>
          <DialogDescription>
            Upload your resume to help us match you with the perfect job
            opportunities.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="animate-shake">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!file ? (
          <div
            className={cn(
              "h-40 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300",
              isDragging
                ? "border-yellow-500 bg-yellow-50"
                : "border-dashed hover:border-yellow-300 hover:bg-yellow-50/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              aria-label="Upload resume file"
            />
            <div className="text-center">
              <FileUp className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm font-medium">
                Drag & drop your resume here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetUpload}
                disabled={isUploading}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-medium">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <Progress
                  value={uploadProgress}
                  className="h-2"
                  aria-label="Upload progress"
                />
              </div>
            )}

            {uploadComplete && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Resume uploaded successfully!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Previously uploaded resumes:
            </h4>
            <ul className="space-y-2 text-sm">
              {uploadedFiles.map((fileName, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-yellow-500" />
                  <span className="truncate">{fileName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading || uploadComplete}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : uploadComplete ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Uploaded
              </>
            ) : (
              "Upload Resume"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
