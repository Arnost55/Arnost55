"use client";
import { CalendarDays, ChevronRight, Instagram, Linkedin, Sparkles } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SocialFlow() {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top 72%", end: "bottom 35%", scrub: .6 } })
        .fromTo(".project-number, .social-copy .eyebrow", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .05 }, 0)
        .fromTo(".social-copy", { y: 100, opacity: .25 }, { y: -40, opacity: 1 }, 0)
        .fromTo(".social-copy h2 span", { opacity: .15 }, { opacity: 1 }, .12)
        .fromTo(".social-copy li", { x: -28, opacity: 0 }, { x: 0, opacity: 1, stagger: .05 }, .22)
        .fromTo(".dashboard", { y: 160, rotateX: 14, scale: .82 }, { y: -35, rotateX: 0, scale: 1 }, 0)
        .fromTo(".metrics article", { y: 35, opacity: 0 }, { y: 0, opacity: 1, stagger: .05 }, .18)
        .fromTo(".chart i", { scaleY: .08, transformOrigin: "center bottom" }, { scaleY: 1, stagger: .035 }, .22)
        .fromTo(".floating-card", { y: 80, opacity: 0 }, { y: -30, opacity: 1, stagger: .1 }, .15);
    });
    mm.add("(max-width: 768px)", () => {
      gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top 86%", end: "bottom 28%", scrub: .45, invalidateOnRefresh: true } })
        .fromTo(".project-number, .social-copy .eyebrow", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .05 }, 0)
        .fromTo(".social-copy h2", { y: 55, opacity: .12 }, { y: 0, opacity: 1 }, .03)
        .fromTo(".social-copy>p:not(.eyebrow), .social-copy small", { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: .06 }, .12)
        .fromTo(".social-copy li", { x: -22, opacity: 0 }, { x: 0, opacity: 1, stagger: .045 }, .15)
        .fromTo(".dashboard", { y: 95, rotateX: 8, scale: .9, opacity: .25 }, { y: 0, rotateX: 0, scale: 1, opacity: 1 }, .2)
        .fromTo(".metrics article", { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: .04 }, .3)
        .fromTo(".chart i", { scaleY: .08, transformOrigin: "center bottom" }, { scaleY: 1, stagger: .025 }, .34);
    });
    return () => mm.revert();
  }, { scope: section });

  return <section ref={section} className="project social-project">
    <div className="project-number">02</div><div className="project-rule" />
    <div className="social-copy project-copy"><p className="eyebrow">SELECTED WORK / PRODUCT</p><h2>SOCIAL<br /><span>FLOW</span></h2><p>Social-media automation designed to help creators plan, shape, and organize content from one calm workspace.</p><ul><li>AI-assisted content ideation</li><li>Multi-platform planning</li><li>Focused publishing workflow</li></ul><small>Product in development — interface shown is an illustrative concept.</small><Link className="project-detail-link" href="/work/socialflow">Explore project <ChevronRight size={16} /></Link></div>
    <div className="social-visual">
      <div className="dashboard">
        <aside><b><i>SF</i> SocialFlow</b><nav><span className="active">◫ Overview</span><span>◇ Create</span><span>□ Calendar</span><span>⌁ Analytics</span></nav><div className="avatar">A</div></aside>
        <div className="dash-main"><header><span>Good morning, Arnost.</span><button><Sparkles size={14} /> Create post</button></header><div className="metrics"><article><small>Posts this month</small><b>24</b><em>+18%</em></article><article><small>Total reach</small><b>48.2K</b><em>+32%</em></article><article><small>Engagement</small><b>8.4%</b><em>+2.1%</em></article></div><div className="chart-card"><span>Audience growth</span><div className="chart"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></div>
      </div>
      <div className="floating-card card-one"><CalendarDays /><span><small>NEXT UP</small><b>Product launch</b></span><ChevronRight /></div>
      <div className="floating-card card-two"><span className="platforms"><Instagram/><Linkedin/></span><span><small>CONNECTED</small><b>3 channels</b></span></div>
    </div>
  </section>;
}
