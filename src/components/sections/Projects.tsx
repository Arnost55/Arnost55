import { ExternalLink, Code, Sparkles } from 'lucide-react';
import { GithubIcon } from '../../components/icons/Github';
import { Section } from '../ui/Section';
import { ProjectCard } from '../projects/ProjectCard';
import { ProjectModal } from '../projects/ProjectModal';
import { projects } from '../../data/projects';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { cn } from '../../utils/cn';

export function Projects() {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [modalIndex, setModalIndex] = useState(0);

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  const openModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setModalIndex(projects.findIndex(p => p.id === project.id));
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const nextProject = () => {
    if (modalIndex < projects.length - 1) {
      setModalIndex(modalIndex + 1);
      setSelectedProject(projects[modalIndex + 1]);
    }
  };

  const previousProject = () => {
    if (modalIndex > 0) {
      setModalIndex(modalIndex - 1);
      setSelectedProject(projects[modalIndex - 1]);
    }
  };

  return (
    <Section id="projects" ref={ref} size="lg" background="default">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
            Featured Projects
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Building at the Intersection of
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Software, Hardware & Content
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            From JARVIS-style automation agents to custom 3D printers and tech content creation.
            Each project represents a problem worth solving.
          </p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
          role="tablist"
          aria-label="Project categories"
        >
          {['all', 'software', 'hardware', 'content'].map((filter) => (
            <button
              key={filter}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950',
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
              )}
              role="tab"
              aria-selected={filter === 'all'}
            >
              {filter === 'all' ? 'All Projects' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </span>
            Featured Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onOpenModal={openModal} />
            ))}
          </div>
        </motion.div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            </span>
            More Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onOpenModal={openModal} />
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/Arnost55"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            <GithubIcon className="h-5 w-5" aria-hidden="true" />
            View All Projects on GitHub
            <ExternalLink className="h-5 w-5" aria-hidden="true" />
          </a>
        </motion.div>

        {/* Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={closeModal}
          onNext={nextProject}
          onPrevious={previousProject}
          hasNext={modalIndex < projects.length - 1}
          hasPrevious={modalIndex > 0}
        />
      </motion.div>
    </Section>
  );
}