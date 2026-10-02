"use client";

import { useStore } from "./StoreProvider";
import { Reveal } from "./Reveal";
import { REVIEWS } from "@/lib/i18n";

export function Reviews() {
  const { state, t } = useStore();
  const list = REVIEWS[state.lang];

  return (
    <section id="avis" className="relative mt-14 overflow-hidden bg-night text-cream">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgba(228,85,42,.16), transparent 60%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto w-full max-w-app px-[18px] py-16 md:py-20 lg:px-8">
        <Reveal className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-[3.5px] text-amber">
            {t.reviewKicker}
          </div>
          <h2 className="mt-2 font-display text-[32px] font-semibold leading-tight text-cream md:text-[44px]">
            {t.reviewTitle}
          </h2>
        </Reveal>

        <div className="mx-auto mt-9 grid grid-cols-1 gap-4 md:max-w-5xl md:grid-cols-3">
          {list.map((r, i) => (
            <Reveal
              key={r.who}
              delay={i * 0.08}
              className="flex flex-col rounded-[20px] border border-white/10 bg-night-2 p-6 shadow-card"
            >
              <div className="font-display text-[40px] leading-none text-ember">“</div>
              <p className="-mt-3 flex-1 text-[14px] italic leading-[1.6] text-cream/90">
                {r.text}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12.5px] font-bold text-amber">— {r.who}</span>
                <span className="text-[12px] tracking-[2px] text-amber">★★★★★</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
