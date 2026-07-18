'use client';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Home, Search, RotateCcw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <Container size="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="text-center glass p-12 md:p-16"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: 'linear' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full glass-light mb-6"
          >
            <Search className="h-10 w-10 text-muted" />
          </motion.div>

          <h1 className="text-section text-fg mb-4">Page Not Found</h1>
          <p className="text-lead text-fg-2 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="glass" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted">
            Or{' '}
            <Link to="/#projects" className="text-accent hover:underline">
              browse projects
            </Link>
            {' '}instead.
          </p>
        </motion.div>
      </Container>
    </div>
  );
}