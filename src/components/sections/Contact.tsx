import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { GithubIcon } from '../../components/icons/Github';
import { LinkedinIcon } from '../../components/icons/Linkedin';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { personalInfo } from '../../data/personal';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitContactForm } from '../../utils/formspree';
import { CheckCircle, XCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('loading');
    setStatusMessage('');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('message', data.message);

      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus('success');
        setStatusMessage(result.message);
        reset();
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <Section id="contact" size="lg" background="default">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Open to freelance projects, collaborations, speaking opportunities, or just a friendly chat about tech.
            I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="elevated" padding="lg" className="h-full sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Contact Information</h3>

              <div className="space-y-6 mb-8">
                {[
                  { icon: Mail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
                  { icon: Phone, label: 'Phone', value: personalInfo.phone, href: `tel:${(personalInfo.phone ?? '').replace(/\s/g, '')}` },
                  { icon: MapPin, label: 'Location', value: personalInfo.location, href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-slate-900 dark:text-slate-100">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">Connect Socially</h4>
                <div className="flex gap-4">
                  {[
                    { icon: GithubIcon, href: personalInfo.github, label: 'GitHub' },
                    { icon: LinkedinIcon, href: personalInfo.linkedin, label: 'LinkedIn' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick CTA Card */}
            <Card variant="outlined" padding="lg" className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800">
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Prefer a direct conversation? I&apos;m available for:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    'Freelance Projects',
                    'Collaborations',
                    'Speaking Engagements',
                    'Mentorship',
                    'Open Source',
                  ].map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Send a Message</h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>
                <Input
                  label="Subject"
                  placeholder="What&apos;s this about?"
                  {...register('subject')}
                  error={errors.subject?.message}
                />
                <Textarea
                  label="Message"
                  placeholder="Tell me about your project, idea, or just say hi..."
                  rows={5}
                  {...register('message')}
                  error={errors.message?.message}
                />

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
                    role="alert"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" aria-hidden="true" />
                    <p className="text-emerald-800 dark:text-emerald-200 font-medium">{statusMessage}</p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 flex items-center gap-3"
                    role="alert"
                  >
                    <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0" aria-hidden="true" />
                    <p className="text-rose-800 dark:text-rose-200 font-medium">{statusMessage}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting || submitStatus === 'loading'}
                  disabled={isSubmitting || submitStatus === 'loading'}
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                  {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}