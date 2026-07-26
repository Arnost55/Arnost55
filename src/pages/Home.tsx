import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Skills } from '../components/sections/Skills';
import { Projects } from '../components/sections/Projects';
import { ContentCreation } from '../components/sections/ContentCreation';
import { Education } from '../components/sections/Education';
import { Languages } from '../components/sections/Languages';
import { Contact } from '../components/sections/Contact';
import { CTA } from '../components/sections/CTA';

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <ContentCreation />
      <Education />
      <Languages />
      <Contact />
      <CTA />
    </>
  );
}