"use client";

import * as React from "react";
import {
  Browser,
  CloudCheck,
  Code,
  Database,
  PlugsConnected,
  Pulse,
  Queue,
  type Icon,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { stackFlow } from "@/lib/capabilities";
import { prefersReducedMotion } from "@/lib/motion";

const FLOW_ICONS: Record<(typeof stackFlow)[number]["icon"], Icon> = {
  interface: Browser,
  api: Code,
  data: Database,
  jobs: Queue,
  integrations: PlugsConnected,
  observability: Pulse,
  delivery: CloudCheck,
};

function StackFlow() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const track = root.querySelector<HTMLElement>("[data-stack-track]");
      const packet = root.querySelector<HTMLElement>("[data-stack-packet]");
      if (!track || !packet) return;

      const entry = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 74%",
          once: true,
        },
      });

      entry
        .fromTo(
          "[data-stack-line]",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left",
            duration: 1.05,
            ease: "power3.inOut",
          },
        )
        .from(
          "[data-stack-node]",
          {
            autoAlpha: 0,
            y: 26,
            duration: 0.55,
            stagger: 0.065,
            ease: "power3.out",
          },
          0.12,
        );

      gsap.to("[data-stack-icon]", {
        y: -4,
        duration: 1.8,
        stagger: { each: 0.16, from: "center" },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const packetTween = gsap.fromTo(
        packet,
        { x: 0, autoAlpha: 0 },
        {
          x: () => Math.max(0, track.clientWidth - packet.offsetWidth),
          autoAlpha: 1,
          duration: 5.5,
          repeat: -1,
          repeatDelay: 0.45,
          ease: "none",
          paused: true,
          invalidateOnRefresh: true,
        },
      );

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => packetTween.play(),
        onEnterBack: () => packetTween.play(),
        onLeave: () => packetTween.pause(),
        onLeaveBack: () => packetTween.pause(),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="border-border bg-surface relative mt-12 overflow-hidden border p-5 md:p-8"
    >
      <div className="border-border flex flex-col justify-between gap-5 border-b pb-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-rose">How the pieces fit together</p>
          <h3 className="font-display text-ink mt-3 max-w-2xl text-3xl font-semibold">
            One request, seven accountable layers.
          </h3>
        </div>
        <p className="text-soft max-w-sm font-mono text-xs leading-relaxed">
          The signal moves left to right. Each layer changes the request without losing ownership of
          it.
        </p>
      </div>

      <div data-stack-track className="relative mt-8">
        <div
          className="bg-border absolute top-8 right-8 left-8 hidden h-px md:block"
          aria-hidden="true"
        >
          <div data-stack-line className="bg-rose h-px w-full" />
          <div
            data-stack-packet
            className="border-peach bg-background absolute -top-1.5 left-0 h-3 w-3 rotate-45 border shadow-[0_0_16px_rgba(248,183,165,0.55)]"
          />
        </div>

        <ol className="bg-border relative grid gap-px md:grid-cols-7">
          {stackFlow.map((step, index) => {
            const StepIcon = FLOW_ICONS[step.icon];
            return (
              <li
                key={step.label}
                data-stack-node
                className="group bg-background relative flex min-h-44 gap-5 p-5 md:flex-col md:gap-0 md:px-4 md:pt-16 md:pb-5"
              >
                <span
                  data-stack-icon
                  className="border-ink/35 bg-background text-ink flex h-14 w-14 shrink-0 items-center justify-center border md:absolute md:top-1 md:left-4"
                >
                  <StepIcon size={26} weight="thin" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-soft font-mono text-[0.65rem]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink mt-auto pt-4 text-sm leading-snug font-medium">
                    {step.label}
                  </span>
                  <span className="text-muted mt-2 text-xs leading-relaxed">{step.detail}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="measure border-rose text-muted mt-6 border-l pl-5 text-sm">
        The stack changes. The responsibilities do not: sound data models, controlled access,
        reliable integrations, tested workflows, observable production, and client ownership.
      </p>
    </div>
  );
}

export { StackFlow };
