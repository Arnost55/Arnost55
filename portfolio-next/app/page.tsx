import { ArrowDown, ArrowUpRight, Github, Mail } from "lucide-react";
import { Hero } from "@/components/Hero";
import { SocialFlow } from "@/components/SocialFlow";
import { HelpeX } from "@/components/HelpeX";
import { About } from "@/components/About";
import { SiteMotion } from "@/components/SiteMotion";
import { MobileNav } from "@/components/MobileNav";

export default function Home() {
  return <SiteMotion>
    <a className="skip-link" href="#work">Skip to selected work</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Home"><span>AR</span>NOST</a>
      <nav aria-label="Primary navigation"><a href="#work">Work</a><a href="#about">About</a><a href="/life">Life</a><a href="/connect">Connect</a></nav>
      <a className="availability" href="#contact"><i /> Available for select work</a>
      <MobileNav />
    </header>
    <Hero />
    <section className="manifesto" aria-label="Introduction">
      <p className="eyebrow">01 / INTRODUCTION</p>
      <p className="manifesto-copy">I turn complex ideas into <em>clear, useful systems</em> — from polished interfaces to the intelligence working behind them.</p>
      <div className="manifesto-foot"><span>Based in Slovakia</span><span>Web / AI / Automation</span><ArrowDown size={18} /></div>
    </section>
    <div id="work"><SocialFlow /><HelpeX /></div>
    <About />
    <footer id="contact" className="contact">
      <div className="contact-orbit" aria-hidden="true"><span /></div>
      <p className="eyebrow">05 / START A CONVERSATION</p>
      <h2>LET’S BUILD<br /><span>WHAT’S NEXT.</span></h2>
      <p className="contact-lead">Have an ambitious product, automation, or web experience in mind? Let’s make it real.</p>
      <div className="contact-links">
        <a href="/connect"><Mail size={18} /> Get in touch <ArrowUpRight size={18} /></a>
        <a href="https://github.com/Arnost55" target="_blank" rel="noreferrer"><Github size={18} /> GitHub <ArrowUpRight size={18} /></a>
      </div>
      <div className="footer-line"><span>© 2026 ARΝOST</span><a href="#top">Back to top ↑</a><span>Designed in code</span></div>
      <div className="footer-extras"><a href="/life">A little more about me <ArrowUpRight size={14} /></a><a href="/connect">Socials & contact <ArrowUpRight size={14} /></a></div>
    </footer>
  </SiteMotion>;
}
