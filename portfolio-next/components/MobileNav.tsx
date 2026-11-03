"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#top", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/life", label: "Life" },
  { href: "/connect", label: "Connect" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLAnchorElement>("a"));
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggleRef.current?.focus(); }
        else if (!event.shiftKey && document.activeElement === toggleRef.current) { event.preventDefault(); first.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggleRef.current?.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouch;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return <>
    <button ref={toggleRef} type="button" className="mobile-menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>
      {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
    </button>
    <nav ref={panelRef} id="mobile-navigation" className="mobile-menu-panel" data-open={open} aria-label="Mobile navigation" aria-hidden={!open} inert={!open}>
      {links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
      <span className="mobile-menu-caption">ARNOŠT / PORTFOLIO 2026</span>
    </nav>
  </>;
}
