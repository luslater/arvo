"use client";

import { useEffect, useState } from "react";
import { ArvoLogo } from "../brand/ArvoLogo";
import { links, nav } from "./content";
import { Icon } from "./ui";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`ah-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="ah-wrap ah-nav__inner">
        <a href="/" className="ah-nav__logo" aria-label="ARVO, página inicial">
          <ArvoLogo height={22} color="var(--ah-az)" />
        </a>
        <nav className="ah-nav__links" aria-label="Principal">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="ah-nav__actions">
          <a className="ah-nav__login" href={links.entrar}>
            Entrar
          </a>
          <a className="ah-btn ah-btn--primary ah-btn--sm" href={links.cadastro}>
            Descobrir meu plano
          </a>
          <button
            className="ah-nav__toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
