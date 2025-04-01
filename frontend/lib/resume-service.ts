"use client";

export interface ResumeFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url?: string;
}

const STORAGE_KEY = "kodjobs_resumes";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateResumeFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF or Word document.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File is too large. Maximum size is 10MB.",
    };
  }

  return { valid: true };
}

export async function saveResumeFile(file: File): Promise<ResumeFile> {
  try {
    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Create a resume file object
    const resumeFile: ResumeFile = {
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString(),
      // In a real app, this would be a URL to the uploaded file
      url: URL.createObjectURL(file),
    };

    // Get existing resumes
    const existingResumes = getResumes();

    // Add new resume
    const updatedResumes = [...existingResumes, resumeFile];

    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes));

    return resumeFile;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw error;
  }
}

/**
 * Gets all resumes from storage
 * @returns An array of resume files
 */
export function getResumes(): ResumeFile[] {
  try {
    const resumesJson = localStorage.getItem(STORAGE_KEY);
    return resumesJson ? JSON.parse(resumesJson) : [];
  } catch (error) {
    console.error("Error retrieving resumes:", error);
    return [];
  }
}

/**
 * Gets a resume by ID
 * @param id The ID of the resume to get
 * @returns The resume file or undefined if not found
 */
export function getResumeById(id: string): ResumeFile | undefined {
  try {
    const resumes = getResumes();
    return resumes.find((resume) => resume.id === id);
  } catch (error) {
    console.error("Error retrieving resume:", error);
    return undefined;
  }
}

/**
 * Deletes a resume by ID
 * @param id The ID of the resume to delete
 * @returns A boolean indicating success
 */
export function deleteResume(id: string): boolean {
  try {
    const resumes = getResumes();
    const updatedResumes = resumes.filter((resume) => resume.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes));
    return true;
  } catch (error) {
    console.error("Error deleting resume:", error);
    return false;
  }
}

/**
 * Generates a unique ID
 * @returns A unique ID string
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Uploads a resume to S3 using the backend's pre-signed URL
 */
export async function uploadResumeToS3(file: File): Promise<ResumeFile> {
  try {
    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const token = localStorage.getItem("token");

    try {
      // First get the pre-signed URL
      const response = await fetch(`${API_URL}/api/user/upload`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const { uploadUrl, key } = await response.json();
      console.log("Pre-signed URL received:", uploadUrl);

      // Upload to S3 with modified headers
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/pdf",
          // Remove any CORS headers as they're not needed for S3
        },
        body: file,
        mode: "cors", // Explicitly set CORS mode
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload to S3");
      }

      // Create resume file record
      const resumeFile: ResumeFile = {
        id: generateId(),
        name: key, // Use the key from backend
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        url: uploadUrl.split("?")[0], // Base S3 URL without query params
      };

      // Save to local storage
      const existingResumes = getResumes();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...existingResumes, resumeFile])
      );

      return resumeFile;
    } catch (fetchError) {
      console.error("Network error:", fetchError);
      throw new Error(
        `Upload failed: ${
          fetchError instanceof Error ? fetchError.message : "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
}
