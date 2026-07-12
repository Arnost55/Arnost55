import type { Education } from '../types';

export const education: Education[] = [
  {
    id: 'sps-halova',
    institution: 'SPŠ Halova 16',
    degree: 'Secondary Vocational Education',
    field: 'Information Technology / Computer Science',
    location: 'Bratislava, Slovakia',
    startDate: 'September 2026',
    endDate: 'Present',
    description: 'Currently studying at SPŠ Halova 16 in Bratislava, focusing on advanced information technology and computer science topics.',
    highlights: [
      'Advanced programming and software development',
      'Network infrastructure and security',
      'Database systems and administration',
      'Project-based learning and competitions',
    ],
  },
  {
    id: 'gymnazium-fandlyho',
    institution: 'Gymnázium Juraja Fándlyho',
    degree: 'Maturita (Secondary School Leaving Certificate)',
    field: 'General Education (Gymnasium)',
    location: 'Šaľa, Slovakia',
    startDate: 'September 2021',
    endDate: 'June 2026',
    description: 'Completed general secondary education with a focus on mathematics, physics, and computer science. Active in technical extracurriculars and competitions.',
    highlights: [
      'Maturita with focus on Mathematics, Physics, Informatics',
      'Active in Hack Club and technical communities',
      'Blueprint 3D Printer project during studies',
      'Technical content creation started here',
    ],
  },
];