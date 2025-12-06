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
  // ————————————————
  // 1) AUCUN SITE GÉNÉRÉ → MODE ATTENTE
  // ————————————————
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
          affichera une version visuelle luxe Ultimated.
        </p>
      </div>
    );
  }

  // ————————————————
  // 2) MODE AVEC SITE GÉNÉRÉ
  // ————————————————
  return (
    <div className="h-full w-full rounded-2xl border border-yellow-900/70 bg-gradient-to-b from-black via-[#050305] to-[#120a05] shadow-[0_22px_45px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
      {/* HERO */}
      <div className="px-6 md:px-8 pt-6 pb-5 border-b border-yellow-900/60 bg-gradient-to-r from-black via-[#1a1307] to-black">
        <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500/80 mb-1">
          Site généré — Aperçu
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-yellow-100">
          {config.title}
        </h2>
        <p className="text-xs md:text-sm text-yellow-200/80 mt-2 max-w-lg">
          {config.subtitle}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/60 border border-yellow-800/70 px-3 py-1 text-[11px] text-yellow-300/90">
          <span className="font-mono">ultimated-shop.vercel.app</span>
          <span className="text-yellow-500">•</span>
          <span>Preview luxe</span>
        </div>
      </div>

      {/* CONTENU SCROLLABLE */}
      <div className="flex-1 overflow-auto px-6 md:px-8 py-5 space-y-6">

        {/* ——————————————————————————————— */}
        {/* SECTION: FEATURES */}
        {/* ——————————————————————————————— */}
        {config.sections.map((section, idx) => {
          if (section.type === "features") {
            return (
              <div
                key={idx}
                className="border border-yellow-900/60 rounded-2xl bg-black/50 px-4 py-4"
              >
                <h3 className="text-sm md:text-base font-semibold text-yellow-100 mb-3">
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-yellow-800/60 bg-gradient-to-b from-black/80 to-[#120a06] px-3 py-3 flex flex-col gap-1"
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
          }

          {/* ——————————————————————————————— */}
          {/* SECTION: CALL TO ACTION */}
          {/* ——————————————————————————————— */}
          if (section.type === "cta") {
            return (
              <div
                key={idx}
                className="border border-yellow-900/70 rounded-2xl bg-gradient-to-r from-[#241707] via-black to-[#120806] px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-yellow-100">
                    {section.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-yellow-200/80 mt-1 max-w-md">
                    {section.text}
                  </p>
                </div>

                <button className="self-start md:self-auto rounded-xl px-4 py-2 bg-yellow-400 text-black text-xs font-semibold shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:bg-yellow-300 active:scale-[0.97] transition">
                  {section.buttonLabel}
                </button>
              </div>
            );
          }

          return null;
        })}

      </div>
    </div>
  );
}
