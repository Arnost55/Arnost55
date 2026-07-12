import type { SkillCategory } from '../types';

export const skillCategories: SkillCategory[] = [
  {
    category: 'Languages',
    icon: 'code',
    skills: [
      { name: 'Rust', proficiency: 5 },
      { name: 'TypeScript', proficiency: 5 },
      { name: 'JavaScript', proficiency: 5 },
      { name: 'Python', proficiency: 5 },
      { name: 'Node.js', proficiency: 5 },
    ],
  },
  {
    category: 'Infrastructure & DevOps',
    icon: 'server',
    skills: [
      { name: 'Docker', proficiency: 5 },
      { name: 'Kubernetes', proficiency: 4 },
      { name: 'Proxmox VE', proficiency: 4 },
      { name: 'Linux', proficiency: 5 },
    ],
  },
  {
    category: 'Web & Databases',
    icon: 'database',
    skills: [
      { name: 'Nginx', proficiency: 4 },
      { name: 'Apache', proficiency: 3 },
      { name: 'PostgreSQL', proficiency: 4 },
      { name: 'MariaDB', proficiency: 4 },
    ],
  },
  {
    category: 'Networking & Security',
    icon: 'shield',
    skills: [
      { name: 'VPN', proficiency: 4 },
      { name: 'TLS/SSL', proficiency: 4 },
      { name: 'Mail Servers', proficiency: 3 },
      { name: 'Ethical Hacking', proficiency: 3 },
    ],
  },
  {
    category: 'Hardware & Engineering',
    icon: 'cpu',
    skills: [
      { name: 'PCB Design', proficiency: 4 },
      { name: 'Microelectronics', proficiency: 4 },
      { name: 'ESP32', proficiency: 5 },
      { name: 'Autodesk Fusion 360', proficiency: 4 },
      { name: 'CNC', proficiency: 3 },
    ],
  },
  {
    category: 'Media & Design',
    icon: 'film',
    skills: [
      { name: 'DaVinci Resolve', proficiency: 4 },
      { name: 'Blender', proficiency: 3 },
      { name: 'Technical Documentation', proficiency: 5 },
    ],
  },
];