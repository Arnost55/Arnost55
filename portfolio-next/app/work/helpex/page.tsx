import type { Metadata } from "next";
import { BrainCircuit, CheckCircle2, Database, Laptop, LockKeyhole, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProjectDetail } from "@/components/ProjectDetail";

export const metadata: Metadata = {
  title: "HelpeX — Arnost",
  description: "A permissioned personal AI agent concept designed around human control.",
};

export default function HelpeXPage() {
  return <ProjectDetail
    number="03"
    category="AI system concept"
    title={<>HELP<span>EX</span></>}
    lead="A capable personal agent concept with clear permissions, inspectable memory and people in control."
    overview="HelpeX explores how an assistant can connect tools and devices while keeping consequential actions under human control. Its architecture puts explicit approvals and understandable permissions at the center of the experience."
    points={["Explicit action approvals", "Scoped tool permissions", "Inspectable memory", "A human-first security model"]}
    note="Exploratory platform. This visualization represents an intended architecture, not shipped functionality."
    visual={<div className="agent-map" aria-label="Conceptual HelpeX system architecture"><div className="core"><div className="core-ring"/><BrainCircuit/><small>HELPEX CORE</small><b>Permissioned agent</b><span><CheckCircle2/> Awaiting approval</span></div>{([[Wrench,"TOOLS"],[LockKeyhole,"APPROVALS"],[Database,"MEMORY"],[Laptop,"DEVICES"]] as [LucideIcon,string][]).map(([NodeIcon,label], index) => <div key={label} className={`agent-node node-${index+1}`}><NodeIcon/><small>0{index+1}</small><b>{label}</b></div>)}<i className="agent-line line-1"/><i className="agent-line line-2"/><i className="agent-line line-3"/><i className="agent-line line-4"/><span className="map-label label-one">Every consequential action<br/>passes through a human gate.</span><span className="map-label label-two">CONCEPT ARCHITECTURE / 01</span></div>}
  />;
}
