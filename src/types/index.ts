export type ProjectCategory = 'software' | 'hardware' | 'content';

export interface Project {
  id: string;
  title: string;
  /** One-line summary, used on cards and modal headers. */
  shortDescription?: string;
  /** Short paragraph used by sections that only need a brief blurb. */
  description?: string;
  /** Long-form description for the project detail view. */
  fullDescription?: string;
  longDescription?: string;
  tags: string[];
  technologies?: string[];
  techStack?: string[];
  image?: string;
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  role: string;
  duration: string;
  category: ProjectCategory;
  highlights?: string[];
  challenges?: string[];
  solutions?: string[];
}

export interface Skill {
  name: string;
  level: number; // 1-5
  proficiency?: number; // 1-5 (alias of `level`)
  category: 'frontend' | 'backend' | 'tools' | 'design' | 'other';
}

export interface SkillItem {
  name: string;
  proficiency: number; // 1-5
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: SkillItem[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights?: string[];
}

export type LanguageLevel = 'native' | 'professional' | 'limited' | 'elementary';

export interface Language {
  language: string;
  proficiency: string;
  level: LanguageLevel;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export type ContentPlatform = 'youtube' | 'instagram' | 'tiktok';

export interface ContentChannel {
  platform: ContentPlatform;
  handle: string;
  url: string;
  subscribers: string;
  description: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: 'github' | 'linkedin' | 'mail' | 'twitter' | 'bluesky';
}
