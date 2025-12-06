"use client";

type FeatureItem = {
  icon: string;
  label: string;
  description: string;
};

type Section =
  | {
      type: "features";
      title: string;
      items: FeatureItem[];
    }
  | {
      type: "cta";
      title: string;
      text: string;
      buttonLabel: string;
    };

export type GeneratedConfig = {
  title: string;
  subtitle: string;
  theme: "dark-gold";
  sections: Section[];
};

export function GeneratedSitePreview({
  config,
}: {
  config: GeneratedConfig | null;
}) {
  // —————————————————————
  // 1) AUCUN SITE ENCORE
  // —————————————————————
  if (!config) {
    return (
      <div className="h-full w-full rounded-2xl border border-yellow-900/60 bg-gradient-to-br from-black via-[#090707] to-[#140d06] shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center text-center px-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-500/70 mb-2">
          Preview du site généré
        </p>
        <h2 className="text-xl md:text-2xl font-semibold text-yellow-100 mb-2">
          Le site apparaitra ici en direct
        </h2>
        <p className="text-xs md:text-sm text-yellow-300/80 max-w-md">
          Écris ton idée de site à gauche puis clique sur{" "}
          <span className="font-semibold">“GÉNÉRER MON SITE”</span>. Cette zone
          affichera une landing complète, style Ultimated / Base44.
        </p>
      </div>
    );
  }

  // —————————————————————
  // 2) SITE GÉNÉRÉ
  // —————————————————————
  return (
    <div className="h-full w-full rounded-2xl border border-yellow-900/70 bg-gradient-to-b from-black via-[#050305] to-[#120a05] shadow-[0_22px_45px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
      {/* BARRE DE NAVIGATION */}
      <div className="border-b border-yellow-900/70 bg-gradient-to-r from-black via-[#1c1307] to-black px-5 md:px-7 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full border border-yellow-500/60 bg-black/60 flex items-center justify-center text-[13px]">
            <span className="text-yellow-300 font-semibold">U</span>
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.25em] text-yellow-500/80">
              Ultimated Site
            </p>
            <p className="text-xs text-yellow-200/80">Preview généré par l&apos;IA</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] text-yellow-200/80">
          <button className="hover:text-yellow-400 transition">Accueil</button>
          <button className="hover:text-yellow-400 transition">
            Fonctionnalités
          </button>
          <button className="hover:text-yellow-400 transition">
            Tarifs
          </button>
          <button className="rounded-full border border-yellow-500/70 px-3 py-1 text-[11px] text-black bg-yellow-400 font-semibold hover:bg-yellow-300 transition">
            Commencer
          </button>
        </div>
      </div>

      {/* CONTENU SCROLLABLE */}
      <div className="flex-1 overflow-auto">
        {/* HERO */}
        <section className="px-6 md:px-10 py-6 md:py-8 border-b border-yellow-900/60 bg-gradient-to-r from-black via-[#1d1307] to-black">
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500/80 mb-2">
              Site généré — Landing luxe
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-yellow-100 leading-snug">
              {config.title}
            </h1>
            <p className="text-xs md:text-sm text-yellow-200/85 mt-3">
              {config.subtitle}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="rounded-xl bg-yellow-400 text-black text-xs md:text-sm font-semibold px-4 py-2 shadow-[0_0_25px_rgba(250,204,21,0.45)] hover:bg-yellow-300 active:scale-[0.97] transition">
                ✨ Découvrir le site
              </button>
              <button className="rounded-xl border border-yellow-700/80 text-yellow-200/90 text-xs md:text-sm px-4 py-2 hover:border-yellow-400 hover:text-yellow-300 transition">
                Voir les sections générées
              </button>
              <span className="text-[11px] text-yellow-400/80 font-mono">
                GPT-5.1 • Ultimated Builder IA
              </span>
            </div>
          </div>
        </section>

        {/* SECTION FEATURES + PRICING */}
        <section className="px-6 md:px-10 py-6 space-y-6">
          {/* FEATURES */}
          {config.sections
            .filter((s) => s.type === "features")
            .map((section, idx) => {
              const s = section as Extract<Section, { type: "features" }>;
              return (
                <div
                  key={`features-${idx}`}
                  className="border border-yellow-900/60 rounded-2xl bg-black/60 px-4 md:px-5 py-4 md:py-5"
                >
                  <h2 className="text-sm md:text-base font-semibold text-yellow-100 mb-3">
                    {s.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {s.items.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-yellow-800/70 bg-gradient-to-b from-black/80 to-[#120a06] px-3 py-3 flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-xs font-semibold text-yellow-100">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-yellow-300/80 mt-1">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* PRICING STYLE SAAS (FAKE MAIS BEAU) */}
          <div className="border border-yellow-900/70 rounded-2xl bg-gradient-to-br from-black via-[#171007] to-black px-4 md:px-5 py-4 md:py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-sm md:text-base font-semibold text-yellow-100">
                  Plans type Ultimated
                </h2>
                <p className="text-[11px] md:text-xs text-yellow-300/80 mt-1 max-w-md">
                  Exemple de section tarifs que ton futur moteur IA pourra
                  générer automatiquement selon ton projet (boutique, SaaS,
                  services, etc.).
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-700/70 px-3 py-1 bg-black/60 text-[11px] text-yellow-300/85">
                <span className="font-semibold">Mensuel</span>
                <span className="text-yellow-500">/</span>
                <span>Annuel (–10%)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-yellow-800/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-yellow-500/80">
                  Signature
                </p>
                <p className="text-lg font-semibold text-yellow-100">$30</p>
                <p className="text-[11px] text-yellow-300/80">
                  Pour un petit site vitrine ou une landing simple.
                </p>
              </div>

              <div className="rounded-xl border border-yellow-500 bg-gradient-to-b from-yellow-400/10 via-black to-black px-3 py-3 flex flex-col gap-1 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-yellow-400">
                  Prestige
                </p>
                <p className="text-lg font-semibold text-yellow-100">$89</p>
                <p className="text-[11px] text-yellow-200/85">
                  Pour une vraie marque en ligne avec plusieurs sections.
                </p>
              </div>

              <div className="rounded-xl border border-yellow-800/70 bg-black/70 px-3 py-3 flex flex-col gap-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-yellow-500/80">
                  Maison
                </p>
                <p className="text-lg font-semibold text-yellow-100">$349</p>
                <p className="text-[11px] text-yellow-300/80">
                  Version complète avec automatisation et intégrations.
                </p>
              </div>
            </div>
          </div>

          {/* CTA FINAL (SECTION CTA DU CONFIG) */}
          {config.sections
            .filter((s) => s.type === "cta")
            .map((section, idx) => {
              const s = section as Extract<Section, { type: "cta" }>;
              return (
                <div
                  key={`cta-${idx}`}
                  className="border border-yellow-900/70 rounded-2xl bg-gradient-to-r from-[#241707] via-black to-[#120806] px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-yellow-100">
                      {s.title}
                    </h3>
                    <p className="text-[11px] md:text-xs text-yellow-200/80 mt-1 max-w-md">
                      {s.text}
                    </p>
                  </div>

                  <button className="self-start md:self-auto rounded-xl px-4 py-2 bg-yellow-400 text-black text-xs font-semibold shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:bg-yellow-300 active:scale-[0.97] transition">
                    {s.buttonLabel}
                  </button>
                </div>
              );
            })}
        </section>
      </div>
    </div>
  );
}
