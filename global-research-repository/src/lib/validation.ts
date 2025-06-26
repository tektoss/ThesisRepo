import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES, ALLOWED_FILE_EXTENSIONS } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only PDF files are allowed'
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some(ext => 
    fileName.endsWith(ext)
  );
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'File must have a .pdf extension'
    };
  }

  return { isValid: true };
}

export function validateFormData(data: {
  title: string;
  authors: string;
  abstract: string;
  subject: string;
  level: string;
  country: string;
  type: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) errors.title = 'Title is required';
  else if (data.title.trim().length < 5) errors.title = 'Title must be at least 5 characters';

  if (!data.authors.trim()) errors.authors = 'At least one author is required';
  else if (data.authors.split(',').some(author => !author.trim())) {
    errors.authors = 'Please provide valid author names, separated by commas';
  }

  if (!data.abstract.trim()) errors.abstract = 'Abstract is required';
  else if (data.abstract.trim().length < 50) errors.abstract = 'Abstract must be at least 50 characters';
  else if (data.abstract.trim().length > 2000) errors.abstract = 'Abstract must be less than 2000 characters';
  
  if (!data.subject) errors.subject = 'Subject area is required';
  if (!data.level) errors.level = 'Education level is required';
  if (!data.country) errors.country = 'Country is required';
  if (!data.type) errors.type = 'Type of work is required';

  return errors;
}

export function sanitizeInput(input: string): string {
  // A more permissive sanitizer that only removes script tags
  return input.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
}

export function validateSearchTerm(term: string): ValidationResult {
  if (term.length < 2) {
    return {
      isValid: false,
      error: 'Search term must be at least 2 characters long'
    };
  }

  if (term.length > 100) {
    return {
      isValid: false,
      error: 'Search term must be less than 100 characters'
    };
  }

  return { isValid: true };
} 