import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

function Layout() {
  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100 antialiased">
      <div className="aurora-backdrop" aria-hidden="true" />
      <div className="relative z-10">
        <Header />
        <main id="main-content" className="pt-16">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;