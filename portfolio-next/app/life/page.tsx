import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Cpu, MapPin, Workflow, Braces } from "lucide-react";

export const metadata: Metadata = {
  title: "A Little More About Me — Arnost",
  description: "A more personal look at Arnost, his interests, and what he likes to build.",
};

const interests = [
  { icon: Braces, title: "Making things", text: "I enjoy taking an idea from a rough sketch to something useful people can actually try." },
  { icon: Workflow, title: "Connecting systems", text: "Automation is at its best when it quietly removes friction from everyday work." },
  { icon: Cpu, title: "Exploring what’s next", text: "I’m curious about practical AI, thoughtful interfaces, and tools that give people more control." },
];

export default function LifePage() {
  return <main className="personal-page">
    <header className="personal-header"><Link className="wordmark" href="/"><span>AR</span>NOST</Link><Link href="/#about" className="personal-back"><ArrowLeft size={15}/> Back to portfolio</Link></header>
    <section className="life-intro">
      <div><p className="eyebrow">A LITTLE MORE / 01</p><h1>THE PERSON<br/>BEHIND THE<br/><span>PROJECTS.</span></h1><p className="life-lead">Developer, curious builder, and someone who likes making complicated things feel clear.</p><p className="life-location"><MapPin size={16}/> Based in Slovakia</p></div>
      <div className="life-photo"><Image src="/portrait-white.png" alt="Arnost in a calm portrait" fill sizes="(max-width: 800px) 90vw, 38vw"/></div>
    </section>
    <section className="life-interests"><p className="eyebrow">WHAT I’M INTO</p><div className="interest-grid">{interests.map(({icon: Icon,title,text},i)=><article key={title}><span className="interest-number">0{i+1}</span><Icon size={22}/><h2>{title}</h2><p>{text}</p></article>)}</div></section>
    <section className="life-outro"><p className="eyebrow">THAT’S THE SHORT VERSION</p><h2>ALWAYS OPEN<br/>TO A GOOD <span>IDEA.</span></h2><Link className="personal-cta" href="/connect">Say hello <ArrowUpRight size={16}/></Link></section>
    <footer className="personal-footer"><span>ARΝOST / A LITTLE MORE</span><Link href="/connect">Find me online <ArrowUpRight size={14}/></Link></footer>
  </main>;
}
