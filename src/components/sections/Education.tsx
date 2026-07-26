import { GraduationCap, MapPin, Calendar, Award, Sparkles } from 'lucide-react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { education } from '../../data/education';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export function Education() {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });

  return (
    <Section id="education" size="lg" background="muted">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
              Education & Growth
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Learning Journey
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Formal education combined with self-directed learning and hands-on project experience.
              Always building, always learning.
            </p>
          </div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-blue-500 to-emerald-500" aria-hidden="true" />

            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                className="relative pl-20 pb-12 last:pb-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-1 w-10 h-10 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 border-4 border-white dark:border-slate-950 shadow-lg" aria-hidden="true" />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-900" aria-hidden="true" />
                </div>

                {/* Card */}
                <Card variant="elevated" padding="lg" hover className="relative">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          {edu.field}
                        </span>
                        {index === 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{edu.institution}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-2">{edu.degree}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          {edu.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                          {edu.startDate} – {edu.endDate}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{edu.description}</p>
                      )}
                      {edu.highlights && edu.highlights.length > 0 && (
                        <ul className="space-y-1">
                          {edu.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0">→</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Continuous Learning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: Award, title: 'Self-Directed Learning', desc: 'Continuously exploring new technologies through hands-on projects', color: 'text-amber-600 dark:text-amber-400' },
              { icon: Sparkles, title: 'Hack Club Community', desc: 'Active participant in global student hacker community', color: 'text-purple-600 dark:text-purple-400' },
              { icon: Calendar, title: 'Open Source', desc: 'Contributing to and learning from open-source projects', color: 'text-rose-600 dark:text-rose-400' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              >
                <Card variant="outlined" padding="lg" hover className="h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                    <item.icon className={`h-7 w-7 ${item.color}`} aria-hidden="true" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}