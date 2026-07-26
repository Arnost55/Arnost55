import { ArrowRight, Mail, Code, Cpu, Film, Zap } from 'lucide-react';
import { GithubIcon } from '../../components/icons/Github';
import { LinkedinIcon } from '../../components/icons/Linkedin';
import { personalInfo } from '../../data/personal';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const socialLinks = [
  { name: 'GitHub', href: personalInfo.github, icon: GithubIcon, ariaLabel: 'GitHub' },
  { name: 'LinkedIn', href: personalInfo.linkedin, icon: LinkedinIcon, ariaLabel: 'LinkedIn' },
  { name: 'Email', href: `mailto:${personalInfo.email}`, icon: Mail, ariaLabel: 'Email' },
];

const highlights = [
  { icon: Code, label: 'Full-Stack Developer', color: 'text-indigo-600 dark:text-indigo-400' },
  { icon: Cpu, label: 'Hardware Engineer', color: 'text-emerald-600 dark:text-emerald-400' },
  { icon: Film, label: 'Tech Content Creator', color: 'text-amber-600 dark:text-amber-400' },
  { icon: Zap, label: 'Open Source Contributor', color: 'text-rose-600 dark:text-rose-400' },
];

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent dark:from-indigo-900/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\' fill=\'%239C92AC\' fill-opacity=\'0.4\'/%3E%3C/g%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-200 dark:border-indigo-800">
                Hey there! 👋
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">I'm Arnošt</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Arnošt Dobrucký
              </span>
            </motion.h1>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-medium mb-6"
            >
              Full-Stack Developer & Tech Content Creator
            </motion.p>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-xl"
            >
              {personalInfo.summary}
            </motion.p>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {highlights.map((highlight, index) => (
                <motion.span
                  key={highlight.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border',
                    'bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm',
                    'border-slate-200 dark:border-slate-700 shadow-sm',
                    highlight.color
                  )}
                >
                  <highlight.icon className="h-4 w-4" aria-hidden="true" />
                  {highlight.label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 transition-colors"
              >
                View Projects
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                Get In Touch
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex items-center gap-6"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-3 rounded-xl transition-all duration-200',
                    'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm',
                    'border border-slate-200 dark:border-slate-800',
                    'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400',
                    'hover:border-indigo-500/50 dark:hover:border-indigo-500/50',
                    'hover:shadow-lg hover:-translate-y-1'
                  )}
                  aria-label={social.ariaLabel}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Floating Cards */}
              <div className="absolute inset-0" aria-hidden="true">
                {[
                  { top: '10%', left: '10%', label: 'Rust', color: 'bg-orange-500', icon: Cpu },
                  { top: '15%', right: '10%', label: 'TypeScript', color: 'bg-blue-500', icon: Code },
                  { bottom: '20%', left: '15%', label: 'Kubernetes', color: 'bg-indigo-500', icon: Cpu },
                  { bottom: '10%', right: '15%', label: '3D Printing', color: 'bg-emerald-500', icon: Film },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                    className="absolute p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl"
                    style={
                      item.top
                        ? item.right
                          ? { top: item.top, left: item.left, right: item.right }
                          : { top: item.top, left: item.left }
                        : item.right
                        ? { bottom: item.bottom, left: item.left, right: item.right }
                        : { bottom: item.bottom, left: item.left }
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${item.color}`}>
                        <item.icon className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{item.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Central Globe/Code Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                  {/* Outer Ring */}
                  <svg className="absolute inset-0" viewBox="0 0 200 200" aria-hidden="true">
                    <defs>
                      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#ringGradient)"
                      strokeWidth="2"
                      strokeDasharray="565.48"
                      strokeDashoffset="0"
                      className="animate-spin-slow"
                    />
                  </svg>

                  {/* Inner Ring */}
                  <svg className="absolute inset-0" viewBox="0 0 200 200" aria-hidden="true">
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1"
                      strokeDasharray="439.82"
                      strokeDashoffset="0"
                      opacity="0.3"
                      className="animate-spin-reverse-slower"
                    />
                  </svg>

                  {/* Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center shadow-2xl">
                      <Code className="h-12 w-12 sm:h-16 sm:w-16 text-white" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0" aria-hidden="true">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                        className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                        style={{
                          top: `${15 + Math.random() * 70}%`,
                          left: `${15 + Math.random() * 70}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-slate-400"
          aria-hidden="true"
        >
          <span className="text-xs font-medium uppercase tracking-wider">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-slate-300 dark:border-slate-600 rounded-full flex justify-center pt-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}