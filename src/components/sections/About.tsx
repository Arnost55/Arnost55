import { CheckCircle, Target, Zap, Brain, Heart, Globe } from 'lucide-react';
import { Section } from '../ui/Section';
import { personalInfo } from '../../data/personal';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const stats = [
  { value: '3+', label: 'Major Projects', icon: Target, color: 'text-indigo-600 dark:text-indigo-400' },
  { value: '5+', label: 'Tech Domains', icon: Brain, color: 'text-emerald-600 dark:text-emerald-400' },
  { value: '2+', label: 'Years Content', icon: Globe, color: 'text-amber-600 dark:text-amber-400' },
  { value: '∞', label: 'Curiosity', icon: Heart, color: 'text-rose-600 dark:text-rose-400' },
];

const highlights = [
  {
    icon: Zap,
    title: 'Bias Toward Action',
    description: 'Don\'t just plan—build. From 3D printers to automation agents, I learn by doing and ship real projects.',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: Brain,
    title: 'Full-Stack Fluency',
    description: 'Comfortable across the entire stack: Rust, TypeScript, React, Docker, Kubernetes, databases, and hardware.',
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: Globe,
    title: 'Technical Communication',
    description: 'Bridge complex tech and general audiences through arni_pictures_tech across YouTube, Instagram, TikTok.',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Target,
    title: 'Problem-First Mindset',
    description: 'Start with the problem worth solving, then choose the right tools. Technology serves the solution.',
    color: 'text-rose-600 dark:text-rose-400',
  },
  {
    icon: CheckCircle,
    title: 'Open Source Spirit',
    description: 'Active in Hack Club, contributing to community projects, and sharing knowledge through content.',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Heart,
    title: 'Continuous Growth',
    description: 'Currently advancing at SPŠ Halova 16 while building HelpeX, creating content, and exploring new tech.',
    color: 'text-purple-600 dark:text-purple-400',
  },
];

export function About() {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });

  return (
    <Section id="about" size="lg" background="muted">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
              About Me
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Building at the intersection of{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
                software, hardware & content
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-current to-current/50 flex items-center justify-center mb-4" style={{ backgroundColor: highlight.color.replace('text-', '').replace('dark:text-', '') }}>
                  <highlight.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{highlight.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}