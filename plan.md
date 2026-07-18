# Portfolio Redesign Plan

## Intent
Design a professional personal portfolio for a student/educator using React/TSX with Vite, implementing the Arc Browser aesthetic (frosted glass, warm gradients, professional typography) while avoiding generic AI aesthetics. The portfolio should leverage existing indigo/slate brand tokens from the Arnost55 project.

## Known Constraints (from memory)
- **Stack**: React + TypeScript + Vite (not pure HTML)
- **Design System**: Arc Browser (active) — frosted glass, warm peach-coral gradients, Inter + Argent CF typography
- **Brand Tokens**: Indigo primary / slate neutrals from existing Tailwind config
- **Audience**: Personal portfolio for student/educator
- **Deployment**: GitHub Pages via existing GitHub Actions workflow
- **Avoid**: AI-default color palettes (indigo/emerald/amber/rose), generic "AI-ish" aesthetics

## Open Questions

### Platform & Architecture
- [ ] Single-page scroll vs. multi-route (separate pages for Projects, About, Contact)?
- [ ] Need a blog/content section?
- [ ] Dark mode toggle required?

### Information Architecture
- [ ] Sections needed: Hero, About, Projects, Skills, Education, Content/Blog, Contact, Footer?
- [ ] Project detail: modal sheet (mobile) + dedicated page (desktop) or single approach?
- [ ] Contact: keep Formspree integration or simplify?

### Visual Adaptation
- [ ] How to blend Arc's peach-coral gradients with existing indigo/slate tokens?
- [ ] Global animated gradient backdrop vs. per-section gradients?
- [ ] Argent CF serif for display headings (marketing moments) or stick with Inter?

### Scope & Polish
- [ ] Animations: page transitions, scroll reveals, micro-interactions?
- [ ] Accessibility: full WCAG AA, reduced motion, focus management?
- [ ] Performance budget: Lighthouse targets?

## Next Steps
1. Answer open questions above
2. Create TodoWrite plan with concrete steps
3. Set up Vite + React + TS project structure
4. Implement design tokens (merge Arc + indigo/slate)
5. Build component library (frosted cards, gradient buttons, glass inputs)
6. Assemble pages/screens
7. Self-check against Arc DESIGN.md + anti-slop checklist
8. Deploy to GitHub Pages

---

## Decisions (Locked)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Single-page scroll** with anchor navigation | Modern, app-like, fits Arc sidebar aesthetic |
| 2 | **Unified project detail** — dedicated route `/project/:id` for all screens | Consistent UX, cleaner code, SEO-friendly |
| 3 | **Keep Formspree** for contact form | Existing integration, proven |
| 4 | **Global animated peach-coral gradient backdrop** | Signature Arc aesthetic, immersive warmth |
| 5 | **Argent CF serif for display headings** (Hero, section titles) | Editorial moments where it shines; Inter for body/UI |
| 6 | **Dark mode toggle required** | User preference, Arc supports both |
| 7 | **Animations that look good** — Framer Motion page transitions, scroll reveals, micro-interactions | Polished, professional feel |
| 8 | **Skip blog/content section** for v1 | Scope control, can add later |
| 9 | **Ship when ready** — no hard deadline | Quality over speed |

---

## Clarifying Questions (Resolved)