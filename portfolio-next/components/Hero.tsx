"use client";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });

export function Hero() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const positionKey = "portfolio-scroll-position";
    const savePosition = () => sessionStorage.setItem(positionKey, String(window.scrollY));
    const savedPosition = Number(sessionStorage.getItem(positionKey));
    window.addEventListener("scroll", savePosition, { passive: true });
    const portrait = new window.Image();
    portrait.src = "/portrait-red.png";
    Promise.all([document.fonts.ready, portrait.decode().catch(() => undefined)]).then(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        if (savedPosition > 0) {
          window.scrollTo(0, savedPosition);
        }
      });
    });
    return () => window.removeEventListener("scroll", savePosition);
  }, []);
  useGSAP(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "+=115%", scrub: 0.7, pin: true, pinSpacing: true, invalidateOnRefresh: true } });
      tl.to(".hero-title .line-a", { xPercent: -13 }, 0)
        .to(".hero-title .line-b", { xPercent: 12 }, 0)
        .to(".hero-shade", { opacity: .78 }, 0)
        .to(".hero-meta", { y: -24, opacity: 0 }, 0)
        .to(".hero-title", { scale: .88, opacity: .08 }, .64)
        .to(".hero-reveal", { opacity: 1, y: 0 }, .68);
    });
    mm.add("(max-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });
      tl.to(".hero-shade", { opacity: .72 }, 0)
        .to(".hero-title .line-a", { xPercent: -9 }, 0)
        .to(".hero-title .line-b", { xPercent: 8 }, 0)
        .to(".hero-meta", { y: -28, opacity: 0 }, .08)
        .to(".hero-title", { yPercent: -12, opacity: .2, scale: .94 }, .35);
    });
    return () => mm.revert();
  }, { scope: section });

  return <section ref={section} id="top" className="hero">
    <div className="hero-photo"><Image src="/portrait-red.png" alt="Arnost lit by red LED light" fill priority sizes="100vw" /></div>
    <div className="hero-shade" />
    <div className="hero-grid" aria-hidden="true" />
    <p className="hero-index">PORTFOLIO / 2026</p>
    <h1 className="hero-title"><span className="line-a">I BUILD</span><span className="line-b">WHAT’S <b>NEXT.</b></span></h1>
    <div className="hero-meta"><p>Developer building ambitious<br />software and intelligent systems.</p><span><ArrowDown size={16} /> Scroll to enter</span></div>
    <p className="hero-reveal">DESIGNING THE INTERFACE.<br /><span>ENGINEERING THE SYSTEM.</span></p>
  </section>;
}
