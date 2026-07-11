export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface Skill {
  name: string;
  icon?: string;
  proficiency?: number; // 1-5
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  images?: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: 'software' | 'hardware' | 'content';
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  description?: string;
  highlights?: string[];
}

export interface ContentChannel {
  platform: 'youtube' | 'instagram' | 'tiktok';
  handle: string;
  url: string;
  subscribers: string;
  description: string;
  icon: string;
}

export interface Language {
  language: string;
  proficiency: string;
  level: 'native' | 'professional' | 'limited' | 'elementary';
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}