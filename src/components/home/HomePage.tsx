import { ArvoLogo } from "../brand/ArvoLogo";
import { faq, finalCta, footer, hero, independence as I, links, method, strategies, nav } from "./content";
import { Faq } from "./Faq";
import { Nav } from "./Nav";
import { Reveal } from "./Reveal";
import { Simulator } from "./Simulator";
import { Strategies } from "./Strategies";
import { Eyebrow, Icon } from "./ui";
import { PerformanceChart } from "@/components/performance-chart";

export function HomePage() {
  return (
    <div className="ah">
      <a className="ah-skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Nav />

      <main id="conteudo">
        {/* 1 · HERO — promessa + simulador (a demonstração do produto) */}
        <section className="ah-hero">
          <div className="ah-wrap ah-hero__grid">
            <div className="ah-hero__copy">
              <Eyebrow>{hero.eyebrow}</Eyebrow>
              <h1 className="ah-h1">
                {hero.title.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </h1>
              <p className="ah-lead">{hero.sub}</p>
              <div className="ah-hero__ctas">
                <a className="ah-btn ah-btn--primary ah-btn--lg" href={links.cadastro}>
                  {hero.cta}
                </a>
                <a className="ah-btn ah-btn--ghost ah-btn--lg" href="#metodo">
                  {hero.secondary}
                </a>
              </div>
              <p className="ah-micro">{hero.micro}</p>
              <ul className="ah-trust">
                {hero.trust.map((t) => (
                  <li key={t.title}>
                    <Icon name={t.icon} size={22} />
                    <span>
                      <strong>{t.title}</strong>
                      {t.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ah-hero__demo">
              <Simulator />
            </div>
          </div>
        </section>

        {/* 2 · MÉTODO — as 4 perguntas e as 4 etapas que as respondem */}
        <section id="metodo" className="ah-section ah-section--paper">
          <div className="ah-wrap ah-split">
            <div className="ah-split__aside">
              <div className="ah-sticky">
                <Eyebrow>{method.eyebrow}</Eyebrow>
                <h2 className="ah-h2">{method.title}</h2>
                <p className="ah-body">{method.sub}</p>
                <a className="ah-btn ah-btn--primary" href={links.cadastro}>
                  {method.cta}
                </a>
              </div>
            </div>
            <ol className="ah-steps">
              {method.steps.map((s) => (
                <li key={s.n} className="ah-step ah-reveal">
                  <span className="ah-step__n">{s.n}</span>
                  <div>
                    <p className="ah-step__q">{s.question}</p>
                    <h3 className="ah-step__t">{s.title}</h3>
                    <p className="ah-step__x">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3 · CARTEIRAS + RESULTADOS — uma seção, com abas e gráfico */}
        <section id="carteiras" className="ah-section">
          <div className="ah-wrap">
            <div className="ah-head ah-reveal">
              <div>
                <Eyebrow>{strategies.eyebrow}</Eyebrow>
                <h2 className="ah-h2">{strategies.title}</h2>
              </div>
              <p className="ah-body">{strategies.sub}</p>
            </div>
            <div className="ah-reveal">
              <Strategies />
            </div>
            <div className="ah-reveal" style={{ marginTop: "40px" }}>
              <PerformanceChart />
            </div>
          </div>
        </section>

        {/* 4 · INDEPENDÊNCIA + FUNDADOR */}
        <section id="independencia" className="ah-section ah-section--paper">
          <div className="ah-wrap ah-indep">
            <div className="ah-indep__copy ah-reveal">
              <Eyebrow>{I.eyebrow}</Eyebrow>
              <h2 className="ah-h2">{I.title}</h2>
              <p className="ah-body">{I.sub}</p>
              <ul className="ah-points">
                {I.points.map((p) => (
                  <li key={p.title}>
                    <span className="ah-points__icon">
                      <Icon name="check" size={18} />
                    </span>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="ah-founder ah-reveal">
              <div className="ah-founder__top">
                <span className="ah-founder__avatar" aria-hidden="true">
                  {I.founder.initials}
                </span>
                <div>
                  <p className="ah-founder__name">{I.founder.name}</p>
                  <p className="ah-founder__role">{I.founder.role}</p>
                </div>
              </div>
              <blockquote className="ah-founder__quote">{I.founder.quote}</blockquote>
              <dl className="ah-founder__stats">
                {I.founder.stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="ah-tags ah-tags--light">
                {I.founder.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </figure>
          </div>
        </section>

        {/* 5 · DÚVIDAS */}
        <section id="duvidas" className="ah-section">
          <div className="ah-wrap ah-split">
            <div className="ah-split__aside">
              <div className="ah-sticky">
                <Eyebrow>{faq.eyebrow}</Eyebrow>
                <h2 className="ah-h2">{faq.title}</h2>
              </div>
            </div>
            <Faq />
          </div>
        </section>

        {/* 6 · CHAMADA FINAL */}
        <section className="ah-final">
          <div className="ah-wrap ah-final__inner">
            <h2 className="ah-h2 ah-h2--light">{finalCta.title}</h2>
            <p className="ah-final__sub">{finalCta.sub}</p>
            <a className="ah-btn ah-btn--light ah-btn--lg" href={links.cadastro}>
              {finalCta.cta}
            </a>
            <p className="ah-micro ah-micro--light">{finalCta.micro}</p>
          </div>
        </section>
      </main>

      <footer className="ah-foot">
        <div className="ah-wrap ah-foot__inner">
          <ArvoLogo height={18} color="var(--ah-az)" />
          <nav className="ah-foot__links" aria-label="Rodapé">
            {nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
            <a href={links.privacidade}>Privacidade</a>
            <a href={links.termos}>Termos</a>
          </nav>
          <p className="ah-foot__legal">
            {footer.company} · {footer.tagline}
          </p>
        </div>
      </footer>
      <Reveal />
    </div>
  );
}
