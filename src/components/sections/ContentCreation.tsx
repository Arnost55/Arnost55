import { Play, Users, MessageSquare, TrendingUp, ArrowUpRight, Code, Cpu } from 'lucide-react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { contentChannels } from '../../data/contentCreation';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { cn } from '../../utils/cn';

function PlatformIcon({ platform, size = 6 }: { platform: 'youtube' | 'instagram' | 'tiktok'; size?: number }) {
  const Icons = {
    youtube: (
      <svg className={cn('text-white', `h-${size} w-${size}`)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    instagram: (
      <svg className={cn('text-white', `h-${size} w-${size}`)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-.128-1.283-.14-1.69-.14-4.948 0-3.26.014-3.667.072-4.947.196-4.354 2.618-6.78 6.98-6.98 1.281-.058 1.69-.072 4.948-.072zM12 6.865c-2.858 0-5.173 2.315-5.173 5.165 0 2.858 2.315 5.173 5.173 5.173s5.173-2.315 5.173-5.173c0-2.85-2.315-5.165-5.173-5.165zm0 8.172c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm7.016-5.339c-.739 0-1.339.6-1.339 1.339s.6 1.339 1.339 1.339c.739 0 1.339-.6 1.339-1.339s-.6-1.339-1.339-1.339z" />
      </svg>
    ),
    tiktok: (
      <svg className={cn('text-white', `h-${size} w-${size}`)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm5.521 17.34c-.147.36-.496.603-.877.603h-.057c-.698 0-1.279-.623-1.312-1.322v-4.139h-2.04v4.139c-.04.706-.622 1.33-1.323 1.322h-.057c-.382 0-.731-.242-.878-.603-.147-.361-.034-.794.289-1.014l4.734-3.24c.322-.226.807-.063 1.013.29.204.353.05.786-.29 1.013l-4.734 3.239c-.322.226-.434.66-.289 1.014z" />
      </svg>
    ),
  };
  return Icons[platform];
}

const platformGradients: Record<string, string> = {
  youtube: 'from-red-500 to-red-600',
  instagram: 'from-pink-500 via-purple-500 to-orange-500',
  tiktok: 'from-indigo-500 to-blue-500',
};

export function ContentCreation() {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });

  return (
    <Section id="content" ref={ref} size="lg" background="gradient">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm font-medium mb-4">
            Content Creation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            arni_pictures_tech
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            Communicating complex technical ideas to general audiences across multiple platforms.
            Making technology accessible, one video at a time.
          </p>

          {/* Total Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
                13K+
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Total Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">3</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Active Platforms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">2+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Years Creating</div>
            </div>
          </div>
        </div>

        {/* Platform Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {contentChannels.map((channel, index) => (
            <motion.div
              key={channel.platform}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            >
              <Card
                variant="elevated"
                padding="none"
                hover
                className="overflow-hidden h-full flex flex-col group"
              >
                {/* Platform Header */}
                <div
                  className={cn(
                    'relative h-48 flex items-center justify-center',
                    `bg-gradient-to-br ${platformGradients[channel.platform]}`
                  )}
                >
                  <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
                  <div className="relative z-10">
                    <div className={cn('inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm')}>
                      <PlatformIcon platform={channel.platform} size={8} />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                      <span className={cn('px-4 py-1.5 rounded-full text-sm font-semibold bg-white dark:bg-slate-900 shadow-lg')}>
                        {channel.subscribers}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    @{channel.handle}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-1 leading-relaxed">
                    {channel.description}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 transition-colors flex-1"
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Visit Channel
                      <span className="h-4 w-4">↗</span>
                    </a>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow @${channel.handle} on ${channel.platform}`}
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 transition-colors"
                    >
                      <Users className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Code,
              title: 'Software Engineering',
              desc: 'Tutorials, deep dives, and best practices for full-stack development',
              color: 'text-indigo-600 dark:text-indigo-400',
            },
            {
              icon: Cpu,
              title: 'Hardware & Making',
              desc: '3D printing, PCB design, microcontrollers, and engineering projects',
              color: 'text-emerald-600 dark:text-emerald-400',
            },
            {
              icon: TrendingUp,
              title: 'DevOps & Infrastructure',
              desc: 'Docker, Kubernetes, Linux servers, and cloud-native architectures',
              color: 'text-amber-600 dark:text-amber-400',
            },
          ].map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            >
              <Card variant="outlined" padding="lg" hover className="h-full">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <pillar.icon className={cn('h-6 w-6', pillar.color)} aria-hidden="true" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{pillar.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{pillar.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Card variant="outlined" padding="lg" className="max-w-2xl mx-auto border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Want to Collaborate?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Open to sponsorships, collaborations, and creative partnerships.
              Let's make something great together.
            </p>
            <a
              href="mailto:arnstdobrucky48@gmail.com?subject=Collaboration%20Inquiry"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 transition-colors"
            >
              Get In Touch
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
}