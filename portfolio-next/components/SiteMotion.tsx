"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SiteMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Keep native touch scrolling on mobile: desktop retains cinematic scrub animations.
    if (matchMedia("(prefers-reduced-motion: reduce), (max-width: 900px), (pointer: coarse)").matches) return;

    gsap.timeline({ scrollTrigger: { trigger: ".manifesto", start: "top 78%", end: "bottom 42%", scrub: 0.65 } })
      .fromTo(".manifesto .eyebrow", { y: 28, opacity: 0 }, { y: 0, opacity: 1 }, 0)
      .fromTo(".manifesto-copy", { y: 90, opacity: 0.12 }, { y: 0, opacity: 1 }, 0)
      .fromTo(".manifesto-copy em", { color: "#0b0b0a" }, { color: "#e32618" }, 0.28)
      .fromTo(".manifesto-foot", { y: 35, opacity: 0 }, { y: 0, opacity: 1 }, 0.38);

    gsap.timeline({ scrollTrigger: { trigger: ".social-project", start: "top 78%", end: "bottom 35%", scrub: 0.65 } })
      .fromTo(".social-project .project-copy", { y: 85, opacity: 0.2 }, { y: 0, opacity: 1 }, 0)
      .fromTo(".social-project .project-copy h2 span", { color: "#f5f4ef" }, { color: "#e32618" }, 0.24)
      .fromTo(".social-project .dashboard", { y: 90, rotateX: 8, scale: 0.94 }, { y: -12, rotateX: 0, scale: 1 }, 0.08);

    gsap.timeline({ scrollTrigger: { trigger: ".helpex-project", start: "top 78%", end: "bottom 35%", scrub: 0.65 } })
      .fromTo(".helpex-project .project-copy", { y: 80, opacity: 0.2 }, { y: 0, opacity: 1 }, 0)
      .fromTo(".helpex-project .project-copy h2 span", { color: "#0a0a0a" }, { color: "#e32618" }, 0.24)
      .fromTo(".helpex-project .agent-map", { y: 65, scale: 0.94, opacity: 0.4 }, { y: 0, scale: 1, opacity: 1 }, 0.08);

    gsap.timeline({ scrollTrigger: { trigger: ".about", start: "top 78%", end: "bottom 35%", scrub: 0.65 } })
      .fromTo(".about-photo img", { scale: 1.08, yPercent: 4 }, { scale: 1, yPercent: -2 }, 0)
      .fromTo(".about-copy", { y: 65, opacity: 0.25 }, { y: 0, opacity: 1 }, 0.08)
      .fromTo(".about-copy h2 span", { color: "#f5f4ef" }, { color: "#e32618" }, 0.24);

    gsap.timeline({ scrollTrigger: { trigger: ".contact", start: "top 78%", end: "bottom bottom", scrub: 0.65 } })
      .fromTo(".contact-orbit", { rotate: -30, scale: 0.72, opacity: 0 }, { rotate: 18, scale: 1, opacity: 1 }, 0)
      .fromTo(".contact .eyebrow", { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, 0.08)
      .fromTo(".contact h2", { y: 100, opacity: 0.08 }, { y: 0, opacity: 1 }, 0.08)
      .fromTo(".contact-lead", { y: 50, opacity: 0 }, { y: 0, opacity: 1 }, 0.25)
      .fromTo(".contact-links a", { y: 32, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08 }, 0.35)
      .fromTo(".footer-line", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, 0.48);
  }, { scope: root });

  return <main ref={root}>
    {children}
  </main>;
}
