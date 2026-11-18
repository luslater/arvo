"use client";

import { useState } from "react";
import { faq } from "./content";
import { Icon } from "./ui";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="ah-faq__list">
      {faq.items.map((it, k) => {
        const on = open === k;
        return (
          <li key={it.q} className={`ah-faq__item ${on ? "is-open" : ""}`}>
            <h3>
              <button
                className="ah-faq__q"
                aria-expanded={on}
                aria-controls={`faq-${k}`}
                id={`faq-q-${k}`}
                onClick={() => setOpen(on ? null : k)}
              >
                <span>{it.q}</span>
                <Icon name="plus" size={20} className="ah-faq__icon" />
              </button>
            </h3>
            <div id={`faq-${k}`} role="region" aria-labelledby={`faq-q-${k}`} className="ah-faq__a" hidden={!on}>
              <p>{it.a}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
