import { ArrowRight, Code, Cpu, Film } from 'lucide-react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export function CTA() {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });

  return (
    <Section id="cta" ref={ref} size="lg" background="gradient" className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-5xl mx-auto text-center"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
          Ready to Start?
        </span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6"
        >
          Let&apos;s Build Something{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
            Amazing
          </span>
          {' Together'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Whether it&apos;s a full-stack application, hardware project, content collaboration,
          or just a conversation about technology — I&apos;m always excited to connect with
          fellow builders and creators.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="mailto:arnstdobrucky48@gmail.com?subject=Collaboration%20Inquiry"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 transition-colors"
          >
            Start a Project
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            Say Hello
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </motion.div>

        {/* What I'm open to */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid sm:grid-cols-3 gap-6"
        >
          {[
            { icon: Code, title: 'Freelance Projects', desc: 'Full-stack development, APIs, DevOps', color: 'text-indigo-600 dark:text-indigo-400' },
            { icon: Cpu, title: 'Collaborations', desc: 'Open source, hardware, research', color: 'text-emerald-600 dark:text-emerald-400' },
            { icon: Film, title: 'Content & Speaking', desc: 'Technical content, workshops, talks', color: 'text-amber-600 dark:text-amber-400' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              <Card variant="outlined" padding="lg" hover className="h-full border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6" style={{ color: item.color }} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact info reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800"
        >
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            📧 arnstdobrucky48@gmail.com &nbsp;|&nbsp;
            📱 +421 948 085 630 &nbsp;|&nbsp;
            📍 Kajal, Slovakia
          </p>
        </motion.div>
      </motion.div>
    </Section>
  );
}