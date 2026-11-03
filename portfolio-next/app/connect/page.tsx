import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Connect — Arnost",
  description: "Contact Arnost and find his public developer profile.",
};

export default function ConnectPage() {
  return <main className="personal-page connect-page">
    <header className="personal-header"><Link className="wordmark" href="/"><span>AR</span>NOST</Link><Link href="/" className="personal-back"><ArrowLeft size={15}/> Back to portfolio</Link></header>
    <section className="connect-content"><p className="eyebrow">LET’S CONNECT / 02</p><h1>GOOD THINGS<br/>START WITH<br/><span>HELLO.</span></h1><p className="life-lead">Have a project, a question, or an interesting idea? You can find me here.</p><div className="connect-options">
      <a href="https://github.com/Arnost55" target="_blank" rel="noreferrer"><Github/><span><small>CODE & PROJECTS</small><b>GitHub / Arnost55</b></span><ArrowUpRight/></a>
      <a href="mailto:hello@example.com"><Mail/><span><small>EMAIL</small><b>Start a conversation</b></span><ArrowUpRight/></a>
    </div><p className="contact-small-note">More social links will appear here when you choose which profiles to share.</p></section>
    <footer className="personal-footer"><span>ARΝOST / CONNECT</span><Link href="/life">A little more about me <ArrowUpRight size={14}/></Link></footer>
  </main>;
}
