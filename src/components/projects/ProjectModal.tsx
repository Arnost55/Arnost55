import { ExternalLink, X, ChevronLeft, ChevronRight, Code, Cpu, Film, Star } from 'lucide-react';
import { GithubIcon } from '../../components/icons/Github';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { type Project } from '../../types';
import { cn } from '../../utils/cn';
import { useState } from 'react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
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
  software: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  hardware: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  content: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export function ProjectModal({ project, onClose, onNext, onPrevious, hasNext, hasPrevious }: ProjectModalProps) {
  if (!project) return null;

  const CategoryIcon = categoryIcons[project.category];
  const categoryColor = categoryColors[project.category];
  const categoryLabel = categoryLabels[project.category];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && hasNext) onNext?.();
    if (e.key === 'ArrowLeft' && hasPrevious) onPrevious?.();
    if (e.key === 'Escape') onClose();
  };

  return (
    <Modal
      isOpen={!!project}
      onClose={onClose}
      size="xl"
      closeOnEscape
      onKeyDown={handleKeyDown}
    >
      <div className="max-h-[85vh] overflow-y-auto">
        {/* Project Images/Gallery */}
        <div className="relative aspect-video rounded-t-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          {project.images && project.images.length > 1 ? (
            <ProjectImageGallery images={project.images} />
          ) : (
            <img
              src={project.image}
              alt={`${project.title} project preview`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={cn('px-3 py-1 rounded-full text-xs font-medium', categoryColor)}>
              <CategoryIcon className="h-3 w-3 mr-1" aria-hidden="true" />
              {categoryLabel}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1">
                <Star className="h-3 w-3" aria-hidden="true" />
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {project.title}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">{project.shortDescription}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">About This Project</h3>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
              {(project.fullDescription ?? '').split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {(project.highlights ?? []).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Key Highlights</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {(project.highlights ?? []).map((highlight: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {(project.techStack ?? []).map((tech: string) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            {project.githubUrl && (
              <Button
                variant="primary"
                onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
                leftIcon={<GithubIcon className="h-4 w-4" />}
              >
                View on GitHub
              </Button>
            )}
            {project.liveUrl && (
              <Button
                variant="secondary"
                onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
                leftIcon={<ExternalLink className="h-4 w-4" />}
              >
                Live Demo
              </Button>
            )}
          </div>

          {/* Navigation */}
          {(hasPrevious || hasNext) && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={!hasPrevious}
                leftIcon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Use ← → keys to navigate
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onNext}
                disabled={!hasNext}
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function ProjectImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full h-full">
      <img
        src={images[currentIndex]}
        alt={`Project image ${currentIndex + 1} of ${images.length}`}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={() => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-white dark:bg-slate-900'
                    : 'bg-white/50 dark:bg-slate-900/50 hover:bg-white/75 dark:hover:bg-slate-900/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}