import type { Metadata } from "next";
import { CalendarDays, ChevronRight, Instagram, Linkedin, Sparkles } from "lucide-react";
import { ProjectDetail } from "@/components/ProjectDetail";

export const metadata: Metadata = {
  title: "SocialFlow — Arnost",
  description: "A concept for a focused social-media planning and publishing workspace.",
};

export default function SocialFlowPage() {
  return <ProjectDetail
    number="02"
    category="Product concept"
    title={<>SOCIAL<br /><span>FLOW</span></>}
    lead="A calmer workspace for turning social content ideas into a clear publishing rhythm."
    overview="SocialFlow is a product concept for creators who want to plan, shape and organize content across channels. The interface brings the calendar, creation flow and audience signals into one focused place."
    points={["AI-assisted content ideation", "Multi-platform planning", "A focused publishing workflow", "Audience growth at a glance"]}
    note="Product in development. The interface shown is an illustrative concept."
    visual={<div className="dashboard"><aside><b><i>SF</i> SocialFlow</b><nav><span className="active">◫ Overview</span><span>◇ Create</span><span>□ Calendar</span><span>⌁ Analytics</span></nav><div className="avatar">A</div></aside><div className="dash-main"><header><span>Good morning, Arnost.</span><button><Sparkles size={14} /> Create post</button></header><div className="metrics"><article><small>Posts this month</small><b>24</b><em>+18%</em></article><article><small>Total reach</small><b>48.2K</b><em>+32%</em></article><article><small>Engagement</small><b>8.4%</b><em>+2.1%</em></article></div><div className="chart-card"><span>Audience growth</span><div className="chart"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></div><div className="floating-card card-one"><CalendarDays /><span><small>NEXT UP</small><b>Product launch</b></span><ChevronRight /></div><div className="floating-card card-two"><span className="platforms"><Instagram/><Linkedin/></span><span><small>CONNECTED</small><b>3 channels</b></span></div></div>}
  />;
}
