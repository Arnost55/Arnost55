import { ExternalLink, Code, Cpu, Film, Star } from 'lucide-react';
import { GithubIcon } from '../../components/icons/Github';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { type Project } from '../../types';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenModal: (project: Project) => void;
}

const categoryIcons = {
  software: Code,
  hardware: Cpu,
  content: Film,
};

const categoryLabels = {
  software: 'Software',
  hardware: 'Hardware',
  content: 'Content',
};

const categoryColors = {
  software: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  hardware: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  content: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
};

export function ProjectCard({ project, index, onOpenModal }: ProjectCardProps) {
  const CategoryIcon = categoryIcons[project.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        variant="elevated"
        padding="none"
        hover
        className="overflow-hidden h-full flex flex-col"
        onClick={() => onOpenModal(project)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(project);
          }
        }}
        aria-label={`View ${project.title} project details`}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
          <img
            src={project.image}
            alt={`${project.title} project preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Placeholder fallback */}
          <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-500">
            <CategoryIcon className="h-16 w-16 text-white/50" aria-hidden="true" />
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={cn('px-3 py-1 rounded-full text-xs font-medium', categoryColors[project.category])}>
              {categoryLabels[project.category]}
            </span>
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Star className="h-3 w-3" aria-hidden="true" />
                Featured
              </span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2">
            <Button
              size="sm"
              variant="primary"
              className="flex-1"
              onClick={(e) => { e.stopPropagation(); onOpenModal(project); }}
            >
              View Details
            </Button>
            {project.githubUrl && (
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/90 dark:bg-slate-900/90"
                onClick={(e) => { e.stopPropagation(); window.open(project.githubUrl!, '_blank', 'noopener,noreferrer'); }}
                aria-label={`View ${project.title} on GitHub`}
              >
                <GithubIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            {project.liveUrl && (
              <Button
                size="sm"
                variant="ghost"
                className="bg-white/90 dark:bg-slate-900/90"
                onClick={(e) => { e.stopPropagation(); window.open(project.liveUrl!, '_blank', 'noopener,noreferrer'); }}
                aria-label={`View ${project.title} live demo`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{project.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">{project.shortDescription}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 6 && (
              <span className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium">
                +{project.techStack.length - 6} more
              </span>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-1.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            {project.highlights.slice(0, 3).map((highlight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                <span className="line-clamp-1">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}