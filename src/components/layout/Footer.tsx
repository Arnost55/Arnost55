import { Mail, Phone, MapPin, Calendar, Code, Heart } from 'lucide-react';
import { GithubIcon } from '../../components/icons/Github';
import { LinkedinIcon } from '../../components/icons/Linkedin';
import { Link } from 'react-router-dom';
import { personalInfo } from '../../data/personal';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', href: personalInfo.github, icon: GithubIcon },
    { name: 'LinkedIn', href: personalInfo.linkedin, icon: LinkedinIcon },
    { name: 'Email', href: `mailto:${personalInfo.email}`, icon: Mail },
    { name: 'Phone', href: `tel:${(personalInfo.phone ?? '').replace(/\s/g, '')}`, icon: Phone },
  ];

  const footerLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Content', href: '#content' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100 mb-4" aria-label="Arnošt Dobrucký - Home">
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">AD</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Full-stack developer & tech content creator from Slovakia. Building things that matter.
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Contact</h3>
            <address className="not-italic space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${personalInfo.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {personalInfo.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${(personalInfo.phone ?? '').replace(/\s/g, '')}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {personalInfo.phone}
                </a>
              </div>
            </address>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Currently</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>Student at SPŠ Halova 16, Bratislava</span>
              </li>
              <li className="flex items-center gap-2">
                <Code className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>Building HelpeX automation agent</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>Creating content for arni_pictures_tech</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <span>Open to freelance & collaboration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {currentYear} Arnošt Dobrucký. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Built with React, TypeScript, Tailwind CSS & Framer Motion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}