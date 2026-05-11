"use client";
import { useState, useEffect } from "react";

const links = [
  { href: "#intro", label: "01 Въведение" },
  { href: "#what-is-rag", label: "02 RAG" },
  { href: "#components", label: "03 Компоненти" },
  { href: "#case-study", label: "04 Лилит" },
  { href: "#playground", label: "05 Pipeline" },
  { href: "#pros-cons", label: "06 Анализ" },
  { href: "#future", label: "07 Бъдеще" },
  { href: "#references", label: "08 Източници" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll("section[id], header[id]");
      let current = "";
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top <= 100) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 h-14 z-50 flex items-center justify-between px-8 border-b border-bl-cyan-ghost bg-bl-paper/90 backdrop-blur-sm">
      <span className="text-bl-cyan text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-meta)" }}>
        RAG · СИСТЕМИ
      </span>

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-bl-ink-4 text-xs tracking-widest uppercase"
        style={{ fontFamily: "var(--font-meta)" }}
      >
        {open ? "CLOSE" : "INDEX"}
      </button>

      <ul
        className={`${
          open ? "flex" : "hidden"
        } md:flex flex-col md:flex-row absolute md:static top-14 left-0 right-0 bg-bl-paper md:bg-transparent border-b md:border-0 border-bl-cyan-ghost p-4 md:p-0 gap-0 md:gap-0`}
      >
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 md:py-1 text-[10px] tracking-[0.12em] uppercase transition-colors ${
                active === l.href.slice(1)
                  ? "text-bl-cyan"
                  : "text-bl-ink-4 hover:text-bl-ink-3"
              }`}
              style={{ fontFamily: "var(--font-meta)" }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
