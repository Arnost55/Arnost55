import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type ProjectDetailProps = {
  number: string;
  category: string;
  title: React.ReactNode;
  lead: string;
  overview: string;
  points: string[];
  note: string;
  visual: React.ReactNode;
};

export function ProjectDetail({ number, category, title, lead, overview, points, note, visual }: ProjectDetailProps) {
  return <main className="detail-page">
    <header className="detail-header">
      <Link className="wordmark" href="/"><span>AR</span>NOST</Link>
      <Link className="detail-back" href="/#work"><ArrowLeft size={14} /> All selected work</Link>
    </header>
    <article className="detail-content">
      <p className="eyebrow">{number} / {category}</p>
      <h1>{title}</h1>
      <p className="detail-lead">{lead}</p>
      <div className="detail-columns">
        <section><h2>Overview</h2><p>{overview}</p></section>
        <section><h2>Focus areas</h2><ul>{points.map((point) => <li key={point}>{point}</li>)}</ul></section>
      </div>
      <div className="detail-visual">{visual}</div>
      <p className="detail-note">{note}</p>
    </article>
    <footer className="detail-footer"><span>ARΝOST / SELECTED WORK</span><Link href="/#contact">Start a conversation <ArrowUpRight size={14} /></Link></footer>
  </main>;
}
