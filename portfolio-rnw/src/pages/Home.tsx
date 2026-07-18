'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  GitBranch,
  ExternalLink,
  Mail,
  MessageSquare,
  Share2,
  ChevronDown,
  Code,
  GraduationCap,
  Briefcase,
  Heart,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/Button';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { Pill } from '@/components/Pill';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/Input';
import { projects, skills, education, socialLinks, navLinks } from '@/data/portfolio';
import type { Project, Skill } from '@/types';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  const allSkills = skills;
  const frontendSkills = allSkills.filter((s) => s.category === 'frontend');
  const backendSkills = allSkills.filter((s) => s.category === 'backend');
  const toolsSkills = allSkills.filter((s) => s.category === 'tools');
  const designSkills = allSkills.filter((s) => s.category === 'design');

  return (
    <>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-heavy py-3' : 'py-4'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Container size="lg">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-fg font-semibold text-lg" aria-label="Home">
              <Sparkles className="h-6 w-6 text-accent" aria-hidden="true" />
              <span className="hidden sm:block">Portfolio</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === link.href.slice(1) ? 'text-accent' : 'text-fg-2 hover:text-accent'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="#contact"
                  className="btn-glass text-sm px-4 py-2"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 glass-light rounded-full mb-8"
            >
              <Pill variant="arc" size="sm">Student & Educator</Pill>
              <Pill variant="brand" size="sm">Open to Opportunities</Pill>
            </motion.div>

            <h1 className="text-display text-hero text-fg mb-6 leading-tight">
              Building <span className="text-accent">Accessible</span>, <br />
              <span className="text-brand-500">Delightful</span> Digital Experiences
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lead text-fg-2 mb-10 max-w-2xl mx-auto"
            >
              I'm a Computer Science graduate passionate about creating inclusive,
              performant web applications. Currently exploring the intersection of
              education technology and human-centered design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild>
                <a href="#projects">
                  View Projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <a href="#contact">Get in Touch</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-16 flex items-center justify-center gap-8 text-sm text-muted"
            >
              <a
                href="https://github.com/Arnost55"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <GitBranch className="h-5 w-5" aria-hidden="true" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/arnost55"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
                LinkedIn
              </a>
              <a
                href="mailto:arnika@example.com"
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                Email
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            aria-hidden="true"
          >
            <ChevronDown className="h-6 w-6 text-muted/50" />
          </motion.div>
        </Container>
      </section>

      {/* About Section */}
      <Section id="about" padding="xl" className="relative">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <Pill variant="arc" className="mb-4 inline-block">About Me</Pill>
            <h2 className="text-section text-fg mb-4">Hello, I'm <span className="text-accent">Arnika</span></h2>
            <p className="text-lead text-fg-2">
              A Computer Science graduate and educator passionate about building
              accessible, performant web applications that make a difference.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-h2 text-fg mb-6">My Journey</h3>
              <div className="space-y-6">
                <div className="glass p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <GraduationCap className="h-5 w-5 text-accent" aria-hidden="true" />
                    <span className="font-semibold text-fg">B.S. Computer Science</span>
                  </div>
                  <p className="text-fg-2 text-sm">University of Technology · 2020–2024</p>
                  <p className="text-fg-2 text-sm mt-2">Focused on software engineering, HCI, and educational technology. Graduated with honors (GPA: 3.8/4.0).</p>
                </div>
                <div className="glass p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Code className="h-5 w-5 text-brand-500" aria-hidden="true" />
                    <span className="font-semibold text-fg">UX/UI Design Certificate</span>
                  </div>
                  <p className="text-fg-2 text-sm">Design Institute · 2022–2023</p>
                  <p className="text-fg-2 text-sm mt-2">Intensive program covering user research, interaction design, design systems, and prototyping.</p>
                </div>
                <div className="glass p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="h-5 w-5 text-success" aria-hidden="true" />
                    <span className="font-semibold text-fg">Teaching Assistant</span>
                  </div>
                  <p className="text-fg-2 text-sm">Data Structures & Algorithms · 2022–2024</p>
                  <p className="text-fg-2 text-sm mt=2">Mentored 100+ students, led review sessions, and developed interactive learning materials.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-h2 text-fg mb-6">What I Do</h3>
              <div className="space-y-4">
                {[
                  { icon: Code, title: 'Frontend Development', desc: 'React, TypeScript, Next.js, Tailwind CSS — building responsive, accessible interfaces.' },
                  { icon: GraduationCap, title: 'Educational Technology', desc: 'Creating tools that enhance learning experiences for students and educators.' },
                  { icon: Briefcase, title: 'Full-Stack Engineering', desc: 'Node.js, PostgreSQL, MongoDB — designing scalable backend systems and APIs.' },
                  { icon: Heart, title: 'Design Systems', desc: 'Building cohesive design languages with tokens, components, and documentation.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="glass p-6 flex gap-4"
                  >
                    <div className="p-3 glass-light rounded-xl flex-shrink-0">
                      <item.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-fg mb-1">{item.title}</h4>
                      <p className="text-fg-2 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Projects Section */}
      <Section id="projects" padding="xl" className="relative">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Pill variant="arc" className="mb-4 inline-block">Featured Work</Pill>
            <h2 className="text-section text-fg mb-4">Selected Projects</h2>
            <p className="text-lead text-fg-2 max-w-2xl mx-auto">
              A collection of projects showcasing my journey in frontend development,
              full-stack engineering, and educational technology.
            </p>
          </motion.div>

          {/* Featured Projects */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* Other Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-h2 text-fg mb-8 text-center">More Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index + featuredProjects.length} />
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Skills Section */}
      <Section id="skills" padding="xl">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Pill variant="brand" className="mb-4 inline-block">Technical Skills</Pill>
            <h2 className="text-section text-fg mb-4">Technologies & Tools</h2>
            <p className="text-lead text-fg-2 max-w-2xl mx-auto">
              Proficient in modern web technologies with a focus on type-safe,
              maintainable code and delightful user experiences.
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              { title: 'Frontend', skills: frontendSkills, icon: Code, color: 'text-brand-500' },
              { title: 'Backend', skills: backendSkills, icon: Briefcase, color: 'text-success' },
              { title: 'Tools & DevOps', skills: toolsSkills, icon: Sparkles, color: 'text-arc-peach-500' },
              { title: 'Design', skills: designSkills, icon: Heart, color: 'text-arc-coral-500' },
            ].map((category, catIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className={`h-6 w-6 ${category.color}`} aria-hidden="true" />
                  <h3 className="text-h2 text-fg">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <SkillPill key={skill.name} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Education Section */}
      <Section id="education" padding="xl" className="relative">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Pill variant="arc" className="mb-4 inline-block">Education</Pill>
            <h2 className="text-section text-fg mb-4">Academic Background</h2>
            <p className="text-lead text-fg-2 max-w-2xl mx-auto">
              Formal education and continuous learning that shaped my approach to
              software development and educational technology.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {education.map((edu, index) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass p-6 md:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 glass-light rounded-xl flex-shrink-0">
                    <GraduationCap className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h3 className="text-h2 text-fg">{edu.degree} in {edu.field}</h3>
                      <Pill variant="brand" size="sm">{edu.institution}</Pill>
                    </div>
                    <p className="text-muted text-sm mb-4">{edu.startDate} – {edu.endDate}</p>
                    {edu.description && <p className="text-fg-2 mb-4">{edu.description}</p>}
                    {edu.highlights && (
                      <ul className="space-y-2">
                        {edu.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-fg-2 text-sm">
                            <span className="text-accent mt-0.5">→</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section id="contact" padding="xl">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Pill variant="arc" className="mb-4 inline-block">Get in Touch</Pill>
            <h2 className="text-section text-fg mb-4">Let's Work Together</h2>
            <p className="text-lead text-fg-2 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas, or opportunities
              to be part of your team. Feel free to reach out!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form
                action="https://formspree.io/f/your-form-id"
                method="POST"
                className="glass p-6 md:p-8 space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <Input
                  label="Subject"
                  name="subject"
                  type="text"
                  placeholder="Project inquiry, collaboration, etc."
                  required
                />
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-fg mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="input-glass w-full resize-none"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                <Button type="submit" size="lg" fullWidth>
                  Send Message <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="glass p-6 md:p-8 h-full">
                <h3 className="text-h2 text-fg mb-6">Other Ways to Connect</h3>
                <div className="space-y-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 glass-light rounded-xl hover:glass-hover transition-all duration-200 group"
                    >
                      <div className="p-3 glass rounded-xl group-hover:bg-accent/10 transition-colors">
                        {social.icon === 'github' && <GitBranch className="h-5 w-5 text-fg" />}
                        {social.icon === 'linkedin' && <MessageSquare className="h-5 w-5 text-fg" />}
                        {social.icon === 'mail' && <Mail className="h-5 w-5 text-fg" />}
                        {social.icon === 'twitter' && <Share2 className="h-5 w-5 text-fg" />}
                      </div>
                      <div>
                        <p className="font-medium text-fg">{social.name}</p>
                        <p className="text-sm text-muted truncate max-w-[200px]">{social.url}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <Container size="lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-fg font-semibold">
              <Sparkles className="h-6 w-6 text-accent" aria-hidden="true" />
              <span>Portfolio</span>
            </div>
            <p className="text-sm text-muted text-center md:text-left">
              Built with React, TypeScript, Tailwind CSS & Framer Motion.{' '}
              <span className="text-accent">♥</span> Designed with Arc Browser aesthetic.
            </p>
            <div className="flex items-center gap-6">
              {socialLinks.slice(0, 3).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition-colors"
                  aria-label={social.name}
                >
                  {social.icon === 'github' && <GitBranch className="h-5 w-5" />}
                  {social.icon === 'linkedin' && <MessageSquare className="h-5 w-5" />}
                  {social.icon === 'mail' && <Mail className="h-5 w-5" />}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={`/project/${project.id}`}
        className="block glass-hover group h-full transition-all duration-300"
        aria-label={`View ${project.title} project`}
      >
        {project.image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <div
              className="absolute inset-0 bg-gradient-to-r from-arc-peach-200 via-arc-coral-200 to-brand-200 opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-center justify-center text-fg/50">
              <span className="text-sm font-medium">Project Image</span>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <Pill key={tag} variant="arc" size="sm">{tag}</Pill>
            ))}
            {project.tags.length > 3 && (
              <Pill variant="neutral" size="sm">+{project.tags.length - 3}</Pill>
            )}
          </div>
          <h3 className="text-h2 text-fg mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
          <p className="text-fg-2 text-sm mb-4 line-clamp-2">{project.description}</p>
          <div className="flex items-center justify-between pt-4 border-t border-border-soft">
            <span className="text-sm font-medium text-fg-2">{project.role}</span>
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-light rounded-lg hover:glass-hover transition-colors"
                  aria-label="View on GitHub"
                >
                  <GitBranch className="h-4 w-4 text-fg-2" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-light rounded-lg hover:glass-hover transition-colors"
                  aria-label="View live demo"
                >
                  <ExternalLink className="h-4 w-4 text-fg-2" />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function SkillPill({ skill }: { skill: Skill }) {
  const colorMap = {
    frontend: 'brand',
    backend: 'success',
    tools: 'arc',
    design: 'arc',
    other: 'neutral',
  } as const;

  return (
    <Pill variant={colorMap[skill.category] || 'neutral'} size="md">
      {skill.name}
      {skill.level > 0 && (
        <span className="ml-1 text-xs opacity-70">{'★'.repeat(skill.level)}</span>
      )}
    </Pill>
  );
}

function handleSubmit(_e: React.FormEvent<HTMLFormElement>) {
  // Formspree handles submission
  // Could add toast notification here
}