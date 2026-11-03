"use client";
import { BrainCircuit, CheckCircle2, Database, Laptop, LockKeyhole, Wrench } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
const nodes = [[Wrench,"TOOLS"],[LockKeyhole,"APPROVALS"],[Database,"MEMORY"],[Laptop,"DEVICES"]] as const;

export function HelpeX() {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top 70%", end: "bottom 30%", scrub: .7 } });
    tl.fromTo(".project-number, .helpex-copy .eyebrow", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .05 }, 0)
      .fromTo(".agent-map", { rotate: -8, scale: .8, opacity: .2 }, { rotate: 0, scale: 1, opacity: 1 }, 0)
      .fromTo(".agent-line", { scaleX: 0 }, { scaleX: 1, stagger: .06 }, .05)
      .fromTo(".agent-node", { scale: .72, opacity: .15 }, { scale: 1, opacity: 1, stagger: .08 }, .08)
      .fromTo(".core-ring", { rotate: -80, scale: .7 }, { rotate: 45, scale: 1.08 }, 0)
      .fromTo(".helpex-copy", { y: 90, opacity: .3 }, { y: -30, opacity: 1 }, 0)
      .fromTo(".helpex-copy h2 span", { opacity: .15 }, { opacity: 1 }, .16)
      .fromTo(".helpex-copy li", { x: 28, opacity: 0 }, { x: 0, opacity: 1, stagger: .05 }, .22);
  }, { scope: section });

  return <section ref={section} className="project helpex-project">
    <div className="project-number">03</div><div className="project-rule" />
    <div className="agent-map" aria-label="Conceptual HelpeX system architecture">
      <div className="core"><div className="core-ring"/><BrainCircuit/><small>HELPEX CORE</small><b>Permissioned agent</b><span><CheckCircle2/> Awaiting approval</span></div>
      {nodes.map(([Icon,label], index)=><div key={label} className={`agent-node node-${index+1}`}><Icon/><small>0{index+1}</small><b>{label}</b></div>)}
      {nodes.map(([,label], index)=><i key={label} className={`agent-line line-${index+1}`}/>) }
      <span className="map-label label-one">Every consequential action<br/>passes through a human gate.</span><span className="map-label label-two">CONCEPT ARCHITECTURE / 01</span>
    </div>
    <div className="helpex-copy project-copy"><p className="eyebrow">SELECTED WORK / AI SYSTEM</p><h2>HELP<span>EX</span></h2><p>A permissioned personal AI agent concept: capable enough to connect tools and devices, constrained enough to keep people in control.</p><ul><li>Explicit action approvals</li><li>Scoped tool permissions</li><li>Inspectable memory</li><li>Human-first security model</li></ul><small>Exploratory platform — visualization represents the intended architecture, not shipped functionality.</small><Link className="project-detail-link" href="/work/helpex">Explore project <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
