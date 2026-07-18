'use client';

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  GitBranch,
  ExternalLink,
  Calendar,
  Tag,
  Star,
  Code2,
  Database,
  Server,
  Globe,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { Pill } from '@/components/Pill';
import { projects } from '@/data/portfolio';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Container size="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center glass p-12"
          >
            <h1 className="text-h1 text-fg mb-4">Project Not Found</h1>
            <p className="text-fg-2 mb-6">The project you're looking for doesn't exist.</p>
            <Button asChild variant="gradient">
              <Link to="/">← Back to Projects</Link>
            </Button>
          </motion.div>
        </Container>
      </div>
    );
  }

  const iconMap: Record<string, ReactNode> = {
    React: <Code2 className="h-4 w-4" />,
    TypeScript: <Code2 className="h-4 w-4" />,
    'Next.js': <Globe className="h-4 w-4" />,
    'Tailwind CSS': <Code2 className="h-4 w-4" />,
    'Framer Motion': <Star className="h-4 w-4" />,
    'React Native': <Code2 className="h-4 w-4" />,
    Vite: <Code2 className="h-4 w-4" />,
    'Node.js': <Server className="h-4 w-4" />,
    Express: <Server className="h-4 w-4" />,
    PostgreSQL: <Database className="h-4 w-4" />,
    MongoDB: <Database className="h-4 w-4" />,
    Prisma: <Database className="h-4 w-4" />,
    'REST APIs': <Globe className="h-4 w-4" />,
    GraphQL: <Globe className="h-4 w-4" />,
    WebSockets: <Globe className="h-4 w-4" />,
    Git: <Code2 className="h-4 w-4" />,
    'GitHub Actions': <Server className="h-4 w-4" />,
    Docker: <Server className="h-4 w-4" />,
    Vercel: <Globe className="h-4 w-4" />,
    'ESLint/Prettier': <Code2 className="h-4 w-4" />,
    'Jest/Vitest': <Code2 className="h-4 w-4" />,
    Storybook: <Code2 className="h-4 w-4" />,
    Figma: <Star className="h-4 w-4" />,
    'Design Systems': <Star className="h-4 w-4" />,
    'Accessibility (WCAG)': <Star className="h-4 w-4" />,
    'Responsive Design': <Star className="h-4 w-4" />,
    Prototyping: <Star className="h-4 w-4" />,
  };

  return (
    <>
      {/* Back Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-heavy py-3" role="navigation" aria-label="Project navigation">
        <Container size="lg">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-fg-2 hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Portfolio
          </Link>
        </Container>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.slice(0, 4).map((tag) => (
                <Pill key={tag} variant="arc" size="sm">{tag}</Pill>
              ))}
              <Pill variant="brand" size="sm">{project.role}</Pill>
              <Pill variant="arc" size="sm">{project.duration}</Pill>
            </div>
            <h1 className="text-section text-fg mb-4">{project.title}</h1>
            <p className="text-lead text-fg-2 max-w-3xl">{project.description}</p>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <Container size="lg">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {project.longDescription && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-h2 text-fg mb-4">Overview</h2>
                  <div className="glass p-6 md:p-8 text-fg-2 leading-relaxed">
                    <p>{project.longDescription}</p>
                  </div>
                </motion.article>
              )}

              {(project.challenges && project.challenges.length > 0) || (project.solutions && project.solutions.length > 0) ? (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-h2 text-fg mb-6">Challenges & Solutions</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {project.challenges && project.challenges.length > 0 && (
                      <GlassCard variant="light" hover={false}>
                        <h3 className="font-semibold text-fg mb-4 flex items-center gap-2">
                          <span className="text-danger">⚠</span>
                          Challenges
                        </h3>
                        <ul className="space-y-3 text-fg-2">
                          {project.challenges.map((challenge, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-danger mt-1 flex-shrink-0">→</span>
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    )}
                    {project.solutions && project.solutions.length > 0 && (
                      <GlassCard variant="light" hover={false}>
                        <h3 className="font-semibold text-fg mb-4 flex items-center gap-2">
                          <span className="text-success">✓</span>
                          Solutions
                        </h3>
                        <ul className="space-y-3 text-fg-2">
                          {project.solutions.map((solution, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-success mt-1 flex-shrink-0">→</span>
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    )}
                  </div>
                </motion.article>
              ) : null}

              {/* Technologies */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-h2 text-fg mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <Button key={tech} variant="glass" size="sm" className="gap-2">
                      {iconMap[tech] || <Code2 className="h-4 w-4" />}
                      {tech}
                    </Button>
                  ))}
                </div>
              </motion.article>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Links */}
              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard hover={false}>
                  <h3 className="font-semibold text-fg mb-4">Links</h3>
                  <div className="space-y-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 glass-light rounded-xl hover:glass-hover transition-colors group"
                      >
                        <GitBranch className="h-5 w-5 text-fg-2 group-hover:text-accent transition-colors" />
                        <div>
                          <p className="font-medium text-fg text-sm">GitHub Repository</p>
                          <p className="text-xs text-muted truncate max-w-[180px]">{project.githubUrl}</p>
                        </div>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 glass-light rounded-xl hover:glass-hover transition-colors group"
                      >
                        <ExternalLink className="h-5 w-5 text-fg-2 group-hover:text-accent transition-colors" />
                        <div>
                          <p className="font-medium text-fg text-sm">Live Demo</p>
                          <p className="text-xs text-muted truncate max-w-[180px]">{project.liveUrl}</p>
                        </div>
                      </a>
                    )}
                  </div>
                </GlassCard>
              </motion.aside>

              {/* Meta Info */}
              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard hover={false}>
                  <h3 className="font-semibold text-fg mb-4">Project Info</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-fg-2 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-muted">Duration</dt>
                        <dd className="text-fg">{project.duration}</dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag className="h-4 w-4 text-fg-2 flex-shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-muted">Role</dt>
                        <dd className="text-fg">{project.role}</dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-accent flex-shrink-0" aria-hidden="true" />
                      <div>
                        <dt className="text-muted">Featured</dt>
                        <dd className="text-fg">{project.featured ? 'Yes' : 'No'}</dd>
                      </div>
                    </div>
                  </dl>
                </GlassCard>
              </motion.aside>

              {/* Tags */}
              <motion.aside
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard hover={false}>
                  <h3 className="font-semibold text-fg mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Pill key={tag} variant="arc" size="sm">{tag}</Pill>
                    ))}
                  </div>
                </GlassCard>
              </motion.aside>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <Section padding="xl" className="relative">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-section text-fg mb-4">Like This Project?</h2>
            <p className="text-lead text-fg-2 mb-8">
              Let's build something amazing together. I'm always open to new
              opportunities and collaborations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <a href="/#contact">Get in Touch</a>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/">← View All Projects</Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    </>
  );
}