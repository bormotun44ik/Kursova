"use client";
import { useState, useEffect } from "react";

const links = [
  { href: "#intro", label: "Въведение" },
  { href: "#what-is-rag", label: "Какво е RAG" },
  { href: "#components", label: "Компоненти" },
  { href: "#case-study", label: "Практика" },
  { href: "#playground", label: "Демо" },
  { href: "#pros-cons", label: "Анализ" },
  { href: "#future", label: "Бъдеще" },
  { href: "#references", label: "Източници" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll("section[id], header[id]");
      let current = "";
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top <= 120) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-6 md:px-8 border-b border-border backdrop-blur-xl transition-colors ${
        scrolled ? "bg-bg/95" : "bg-bg/80"
      }`}
    >
      <span className="text-accent font-bold text-lg tracking-tight">
        RAG системи
      </span>

      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1.5 p-1"
        aria-label="Меню"
      >
        <span className="w-6 h-0.5 bg-text-muted rounded" />
        <span className="w-6 h-0.5 bg-text-muted rounded" />
        <span className="w-6 h-0.5 bg-text-muted rounded" />
      </button>

      <ul
        className={`${
          open ? "flex" : "hidden"
        } md:flex flex-col md:flex-row absolute md:static top-16 left-0 right-0 bg-bg md:bg-transparent border-b md:border-0 border-border p-4 md:p-0 gap-1 md:gap-1`}
      >
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                active === l.href.slice(1)
                  ? "text-text bg-surface"
                  : "text-text-muted hover:text-text hover:bg-surface"
              }`}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
