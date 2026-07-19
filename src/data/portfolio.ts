import type { Project, Skill, Education, SocialLink } from '@/types';

export const projects: Project[] = [
  {
    id: 'portfolio-redesign',
    title: 'Portfolio Redesign',
    description:
      'A modern, accessible portfolio built with React, TypeScript, and Tailwind CSS featuring Arc Browser-inspired design system with frosted glass effects and warm gradients.',
    longDescription:
      'This portfolio redesign showcases a deep integration of the Arc Browser aesthetic — frosted glass surfaces, warm peach-coral gradients, and editorial typography — while maintaining full accessibility compliance and smooth animations via Framer Motion. The project demonstrates modern React patterns including context-based theming, custom hooks for animations, and component composition.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    image: '/projects/portfolio.jpg',
    githubUrl: 'https://github.com/Arnost55/portfolio',
    liveUrl: 'https://arnost55.github.io/portfolio',
    featured: true,
    role: 'Full Stack Developer & Designer',
    duration: '2024',
    category: 'software',
    challenges: [
      'Merging Arc Browser design tokens with existing brand identity',
      'Implementing smooth dark/light mode transitions',
      'Creating performant scroll-triggered animations',
    ],
    solutions: [
      'Built a unified token system using CSS custom properties',
      'Implemented ThemeContext with localStorage persistence and OS preference detection',
      'Used Framer Motion with IntersectionObserver for scroll animations',
    ],
    technologies: [
      'React 18',
      'TypeScript',
      'Tailwind CSS v4',
      'Framer Motion',
      'React Router',
      'Vite',
    ],
  },
  {
    id: 'task-manager',
    title: 'Task Manager Pro',
    description:
      'A collaborative task management application with real-time updates, drag-and-drop boards, and team workspaces.',
    longDescription:
      'Task Manager Pro is a full-stack application featuring real-time collaboration using WebSockets, Kanban-style boards with drag-and-drop functionality, and granular permission controls for team workspaces. Built with a modern tech-built with performance and UX as top priorities.',
    tags: ['React', 'Node.js', 'WebSockets', 'PostgreSQL', 'Prisma'],
    image: '/projects/task-manager.jpg',
    githubUrl: 'https://github.com/Arnost55/task-manager',
    liveUrl: 'https://task-manager-demo.vercel.app',
    featured: true,
    role: 'Full Stack Developer',
    duration: '2023-2024',
    category: 'software',
    challenges: [
      'Real-time synchronization across multiple clients',
      'Optimistic UI updates with conflict resolution',
      'Drag-and-drop with accessibility support',
    ],
    solutions: [
      'Implemented WebSocket-based event system with presence indicators',
      'Used optimistic updates with server reconciliation',
      'Built custom accessible drag-and-drop using native HTML5 API',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'Socket.io',
      'PostgreSQL',
      'Prisma',
      'Tailwind CSS',
    ],
  },
  {
    id: 'learning-platform',
    title: 'EduLearn Platform',
    description:
      'An interactive learning platform for educators with course creation, progress tracking, and assessment tools.',
    longDescription:
      'EduLearn is designed for educators to create and manage interactive courses with multimedia content, quizzes, and student progress analytics. Features include a rich text editor for lesson creation, automated grading, and detailed reporting dashboards.',
    tags: ['React', 'Next.js', 'TypeScript', 'MongoDB', 'NextAuth'],
    image: '/projects/edulearn.jpg',
    githubUrl: 'https://github.com/Arnost55/edulearn',
    liveUrl: 'https://edulearn-demo.vercel.app',
    featured: true,
    role: 'Lead Developer',
    duration: '2023',
    category: 'software',
    challenges: [
      'Complex content authoring with rich media support',
      'Role-based access control for educators/students',
      'Real-time collaborative editing for course content',
    ],
    solutions: [
      'Integrated TipTap editor with custom extensions',
      'Implemented RBAC with NextAuth and Prisma',
      'Used Yjs for conflict-free collaborative editing',
    ],
    technologies: [
      'Next.js 14',
      'React',
      'TypeScript',
      'MongoDB',
      'Prisma',
      'NextAuth',
      'TipTap',
      'Yjs',
      'Tailwind CSS',
    ],
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description:
      'A beautiful weather dashboard with location-based forecasts, historical data visualization, and severe weather alerts.',
    tags: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
    image: '/projects/weather.jpg',
    githubUrl: 'https://github.com/Arnost55/weather-dashboard',
    liveUrl: 'https://weather-dashboard-demo.vercel.app',
    featured: false,
    role: 'Frontend Developer',
    duration: '2023',
    category: 'software',
    technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API', 'Tailwind CSS'],
  },
  {
    id: 'markdown-editor',
    title: 'Markdown Editor',
    description:
      'A distraction-free markdown editor with live preview, syntax highlighting, and export options.',
    tags: ['React', 'TypeScript', 'Monaco Editor', 'Remark'],
    image: '/projects/markdown.jpg',
    githubUrl: 'https://github.com/Arnost55/markdown-editor',
    liveUrl: 'https://markdown-editor-demo.vercel.app',
    featured: false,
    role: 'Frontend Developer',
    duration: '2022',
    category: 'software',
    technologies: ['React', 'TypeScript', 'Monaco Editor', 'Remark', 'Rehype', 'Tailwind CSS'],
  },
  {
    id: 'expense-tracker',
    title: 'Expense Tracker',
    description:
      'Personal finance tracker with categorization, budgets, recurring transactions, and data visualization.',
    tags: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Reanimated'],
    image: '/projects/expense.jpg',
    githubUrl: 'https://github.com/Arnost55/expense-tracker',
    featured: false,
    role: 'Mobile Developer',
    duration: '2022',
    category: 'software',
    technologies: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Reanimated 3', 'NativeWind'],
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 5, category: 'frontend' },
  { name: 'TypeScript', level: 5, category: 'frontend' },
  { name: 'Next.js', level: 4, category: 'frontend' },
  { name: 'Tailwind CSS', level: 5, category: 'frontend' },
  { name: 'Framer Motion', level: 4, category: 'frontend' },
  { name: 'React Native', level: 3, category: 'frontend' },
  { name: 'Vite', level: 4, category: 'frontend' },
  { name: 'HTML/CSS', level: 5, category: 'frontend' },

  // Backend
  { name: 'Node.js', level: 4, category: 'backend' },
  { name: 'Express', level: 4, category: 'backend' },
  { name: 'PostgreSQL', level: 3, category: 'backend' },
  { name: 'MongoDB', level: 3, category: 'backend' },
  { name: 'Prisma', level: 4, category: 'backend' },
  { name: 'REST APIs', level: 4, category: 'backend' },
  { name: 'GraphQL', level: 2, category: 'backend' },
  { name: 'WebSockets', level: 3, category: 'backend' },

  // Tools
  { name: 'Git', level: 5, category: 'tools' },
  { name: 'GitHub Actions', level: 4, category: 'tools' },
  { name: 'Docker', level: 3, category: 'tools' },
  { name: 'Vercel', level: 4, category: 'tools' },
  { name: 'ESLint/Prettier', level: 5, category: 'tools' },
  { name: 'Jest/Vitest', level: 3, category: 'tools' },
  { name: 'Storybook', level: 2, category: 'tools' },

  // Design
  { name: 'Figma', level: 4, category: 'design' },
  { name: 'Design Systems', level: 4, category: 'design' },
  { name: 'Accessibility (WCAG)', level: 4, category: 'design' },
  { name: 'Responsive Design', level: 5, category: 'design' },
  { name: 'Prototyping', level: 4, category: 'design' },
];

export const education: Education[] = [
  {
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2020',
    endDate: '2024',
    description:
      'Focused on software engineering, human-computer interaction, and educational technology.',
    highlights: [
      'Graduated with honors (GPA: 3.8/4.0)',
      'Capstone: Interactive learning platform for STEM education',
      'Teaching Assistant for Data Structures & Algorithms',
      'Research: Accessibility in educational software',
    ],
  },
  {
    institution: 'Design Institute',
    degree: 'Certificate',
    field: 'UX/UI Design',
    startDate: '2022',
    endDate: '2023',
    description:
      'Intensive program covering user research, interaction design, design systems, and prototyping.',
    highlights: [
      'Portfolio project: Redesigned university course registration system',
      'Learned Figma, prototyping, usability testing',
      'Design system creation and documentation',
    ],
  },
];

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/Arnost55', icon: 'github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/arnost55', icon: 'linkedin' },
  { name: 'Email', url: 'mailto:arnika@example.com', icon: 'mail' },
  { name: 'Twitter', url: 'https://twitter.com/arnost55', icon: 'twitter' },
];

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];
