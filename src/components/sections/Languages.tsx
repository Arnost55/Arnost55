import { Globe, CheckCircle, MessageSquare, Brain } from 'lucide-react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { languages } from '../../data/languages';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { cn } from '../../utils/cn';

type LanguageLevel = 'native' | 'professional' | 'limited' | 'elementary';

const levelColors: Record<LanguageLevel, string> = {
  native: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  professional: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  limited: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  elementary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
};

const levelLabels: Record<LanguageLevel, string> = {
  native: 'Native / Bilingual',
  professional: 'Professional Proficiency',
  limited: 'Limited Working Proficiency',
  elementary: 'Elementary Proficiency',
};

function LevelIcon({ level, size = 6 }: { level: LanguageLevel; size?: number }) {
  const Icons: Record<LanguageLevel, React.ReactNode> = {
    native: <Globe className={cn(`h-${size} w-${size}`)} aria-hidden="true" />,
    professional: <Brain className={cn(`h-${size} w-${size}`)} aria-hidden="true" />,
    limited: <MessageSquare className={cn(`h-${size} w-${size}`)} aria-hidden="true" />,
    elementary: <CheckCircle className={cn(`h-${size} w-${size}`)} aria-hidden="true" />,
  };
  return Icons[level];
}

export function Languages() {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });

  return (
    <Section id="languages" size="lg" background="muted">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              Languages
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Multilingual Communication
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Fluent in multiple languages, enabling cross-cultural collaboration and global content reach.
            </p>
          </div>

          {/* Language Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {languages.map((lang, index) => (
              <motion.div
                key={lang.language}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              >
                <Card variant="elevated" padding="lg" hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{lang.language}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{levelLabels[lang.level]}</p>
                    </div>
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', levelColors[lang.level])}>
                      <LevelIcon level={lang.level} size={6} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Proficiency</span>
                      <span className={cn('font-medium px-3 py-1 rounded-full text-xs', levelColors[lang.level])}>
                        {lang.proficiency}
                      </span>
                    </div>

                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: getProficiencyWidth(lang.level) }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', levelColors[lang.level].replace('bg-', 'bg-'))}
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {getLanguageDescription(lang.language, lang.level)}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Card variant="outlined" padding="lg" className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-7 w-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">2</div>
              <div className="text-slate-600 dark:text-slate-400">Native Languages</div>
            </Card>
            <Card variant="outlined" padding="lg" className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">1</div>
              <div className="text-slate-600 dark:text-slate-400">Professional</div>
            </Card>
            <Card variant="outlined" padding="lg" className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-7 w-7 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">2</div>
              <div className="text-slate-600 dark:text-slate-400">Learning</div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

function getProficiencyWidth(level: string): string {
  switch (level) {
    case 'native': return '100%';
    case 'professional': return '85%';
    case 'limited': return '60%';
    case 'elementary': return '35%';
    default: return '50%';
  }
}

function getLanguageDescription(language: string, level: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    Slovak: {
      native: 'Native speaker, fully fluent in all contexts',
    },
    Hungarian: {
      native: 'Native speaker, fully fluent in all contexts',
    },
    English: {
      professional: 'Full professional proficiency (B2/C1), technical communication fluent',
    },
    German: {
      limited: 'Limited working proficiency, basic professional communication',
    },
    Spanish: {
      elementary: 'Elementary proficiency, basic conversational ability',
    },
  };
  return descriptions[language]?.[level] || 'Language proficiency';
}