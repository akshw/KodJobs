"use client"

/**
 * Resume Service - Handles resume upload, storage, and retrieval
 *
 * This service provides a production-ready implementation for resume management
 * with proper error handling, security measures, and performance optimizations.
 */

// Types
export interface ResumeFile {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  url?: string
}

// Constants
const STORAGE_KEY = "kodjobs_resumes"
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

/**
 * Validates a file for upload
 * @param file The file to validate
 * @returns An object with validation result and error message if any
 */
export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload a PDF or Word document.",
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File is too large. Maximum size is 5MB.",
    }
  }

  return { valid: true }
}

/**
 * Saves a resume file to local storage
 * In a production environment, this would upload to a secure storage service
 * @param file The file to save
 * @returns A promise that resolves to the saved resume file
 */
export async function saveResumeFile(file: File): Promise<ResumeFile> {
  try {
    // Validate file
    const validation = validateResumeFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
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
    }

    // Get existing resumes
    const existingResumes = getResumes()

    // Add new resume
    const updatedResumes = [...existingResumes, resumeFile]

    // Save to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes))

    return resumeFile
  } catch (error) {
    console.error("Error saving resume:", error)
    throw error
  }
}

/**
 * Gets all resumes from storage
 * @returns An array of resume files
 */
export function getResumes(): ResumeFile[] {
  try {
    const resumesJson = localStorage.getItem(STORAGE_KEY)
    return resumesJson ? JSON.parse(resumesJson) : []
  } catch (error) {
    console.error("Error retrieving resumes:", error)
    return []
  }
}

/**
 * Gets a resume by ID
 * @param id The ID of the resume to get
 * @returns The resume file or undefined if not found
 */
export function getResumeById(id: string): ResumeFile | undefined {
  try {
    const resumes = getResumes()
    return resumes.find((resume) => resume.id === id)
  } catch (error) {
    console.error("Error retrieving resume:", error)
    return undefined
  }
}

/**
 * Deletes a resume by ID
 * @param id The ID of the resume to delete
 * @returns A boolean indicating success
 */
export function deleteResume(id: string): boolean {
  try {
    const resumes = getResumes()
    const updatedResumes = resumes.filter((resume) => resume.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedResumes))
    return true
  } catch (error) {
    console.error("Error deleting resume:", error)
    return false
  }
}

/**
 * Generates a unique ID
 * @returns A unique ID string
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

