export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  status: ProjectStatus;
  progress: number; // 0-100
  startDate: string; // ISO Date
  lastUpdated: string; // ISO Date
  featured: boolean;
}

export enum ProjectStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ON_HOLD = "ON_HOLD",
  ARCHIVED = "ARCHIVED",
}

export enum ProjectViewMode {
  COMPACT = "COMPACT",
  COMFORTABLE = "COMFORTABLE",
  LIST = "LIST",
}

export type ProjectTab = "overview" | "details" | "links";
