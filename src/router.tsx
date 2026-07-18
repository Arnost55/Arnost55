'use client';

import { createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components/Layout';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import NotFound from '@/pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'project/:id', element: <ProjectDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;