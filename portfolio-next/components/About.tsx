"use client";
import Image from "next/image";
import { ArrowUpRight, Braces, Cpu, Workflow } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function About() {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top 78%", end: "bottom 32%", scrub: .7 } });
    tl.fromTo(".about-photo", { opacity: .15, scale: .94 }, { opacity: 1, scale: 1 }, 0)
      .fromTo(".about-photo img", { scale: 1.2, yPercent: 6 }, { scale: 1.08, yPercent: -4 }, 0)
      .fromTo(".about-copy .eyebrow", { y: 26, opacity: 0 }, { y: 0, opacity: 1 }, .05)
      .fromTo(".about-copy h2", { y: 85, opacity: .1 }, { y: 0, opacity: 1 }, .05)
      .fromTo(".about-copy>p:not(.eyebrow)", { y: 42, opacity: 0 }, { y: 0, opacity: 1, stagger: .08 }, .2)
      .fromTo(".discipline-list span", { x: 35, opacity: 0 }, { x: 0, opacity: 1, stagger: .06 }, .32);
  }, { scope: section });
  return <section ref={section} id="about" className="about">
    <div className="about-photo"><Image src="/portrait-white.png" alt="Portrait of Arnost in white LED light" fill sizes="(max-width: 800px) 100vw, 45vw" /></div>
    <div className="about-copy"><p className="eyebrow">04 / ABOUT</p><h2>ENGINEERING<br />WITH <span>INTENT.</span></h2><p className="about-lead">I’m a developer from Slovakia interested in the point where strong visual design meets robust systems thinking.</p><p>I build web applications, automations, and AI-connected products. My approach is practical: understand the real constraint, reduce complexity, and ship something people can trust.</p><div className="discipline-list"><span><Braces/> Web products <ArrowUpRight/></span><span><Workflow/> Automation <ArrowUpRight/></span><span><Cpu/> Applied AI <ArrowUpRight/></span></div></div>
  </section>;
}
