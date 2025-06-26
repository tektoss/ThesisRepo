// Research Paper Types
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  institution?: string;
  country: string;
  subject: string;
  level: string;
  type: string;
  file_path: string;
  user_id: string;
  submitted: string;
  downloads?: number;
  views?: number;
  created_at?: string;
  updated_at?: string;
}

// Form Data Types
export interface PaperFormData {
  title: string;
  authors: string;
  subject: string;
  level: string;
  country: string;
  institution: string;
  abstract: string;
  type: string;
  file: File | null;
}

// Filter Types
export interface FilterOptions {
  country: string;
  subject: string;
  level: string;
  type: string;
  date: string;
  institution: string;
}

// Pagination Types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  error?: string;
}

// Search Parameters
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  subject?: string;
  level?: string;
  type?: string;
  sortBy?: 'newest' | 'oldest' | 'title' | 'relevance';
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  institution?: string;
  country?: string;
}

// Authentication Types
export interface AuthResponse {
  userId: string;
  token?: string;
}

// File Upload Types
export interface FileUploadResponse {
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  progress?: number;
}

// Component Props Types
export interface SearchSectionProps {
  setFilteredPapers: (papers: ResearchPaper[] | ((prev: ResearchPaper[]) => ResearchPaper[])) => void;
  setShowAdvanced: (show: boolean) => void;
  showAdvanced: boolean;
  allPapers: ResearchPaper[];
}

export interface AdvancedFiltersProps {
  setFilteredPapers: (papers: ResearchPaper[]) => void;
}

export interface PaperListProps {
  papers: ResearchPaper[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  papersPerPage: number;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export interface UploadModalProps {
  onClose: () => void;
}

// Constants
export const SUBJECT_OPTIONS = [
  { value: 'agri', label: 'Agriculture' },
  { value: 'cs', label: 'Computer Science' },
  { value: 'econ', label: 'Economics' },
  { value: 'edu', label: 'Education' },
  { value: 'env', label: 'Environmental Science' },
  { value: 'med', label: 'Medicine & Health' },
  { value: 'math', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'soc', label: 'Social Sciences' },
] as const;

export const LEVEL_OPTIONS = [
  { value: 'high-school', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'community', label: 'Community-Based (Non-Formal)' },
] as const;

export const SUBMISSION_TYPE_OPTIONS = [
  { value: 'article', label: 'Journal Article' },
  { value: 'conference_paper', label: 'Conference Paper' },
  { value: 'book', label: 'Book' },
  { value: 'book_chapter', label: 'Book Chapter' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'dissertation', label: 'Dissertation' },
  { value: 'technical_report', label: 'Technical Report' },
  { value: 'working_paper', label: 'Working Paper' },
  { value: 'preprint', label: 'Preprint' },
  { value: 'review_article', label: 'Review Article' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'letter', label: 'Letter' },
  { value: 'patent', label: 'Patent' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'poster', label: 'Poster' },
  { value: 'dataset', label: 'Dataset' },
  { value: 'software', label: 'Software' },
  { value: 'community_report', label: 'Community Report' },
  { value: 'other', label: 'Other' },
] as const;

export const COUNTRY_OPTIONS = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'India', label: 'India' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Peru', label: 'Peru' },
] as const;

// File validation constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];
export const ALLOWED_FILE_EXTENSIONS = ['.pdf']; 