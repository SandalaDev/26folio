"use client";

import * as React from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * InterestsModal — "The way I am" (12-ui-element-map.md §3 About #2a-i).
 * Restructured (EPIC-014/TASK-059) around the owner's content blueprint
 * (2026-07-06): a grid of clickable topic chips, each revealing a short,
 * specific paragraph, rather than category cards with placeholder images.
 */
const TOPICS = [
  {
    label: "The Design Gene",
    text: "I still catch myself kerning restaurant menus in my head. That's Fireworks in 2002 talking: the habit of noticing when spacing is a half-pixel off, when a font pairing fights itself, when a layout almost breathes but doesn't. Two decades later it hasn't faded, it's just aimed at interfaces now instead of flyers.",
  },
  {
    label: "The Systems Brain",
    text: "I diagram before I build, always. Years of tracing fault paths through a radio network taught me that the failure you didn't map is the one that finds you at 2am. So before a line of code exists, I want the whole system on a whiteboard: what talks to what, what breaks first, what the fallback is.",
  },
  {
    label: "What I Read, Watch, and Play",
    text: "Sci-fi that treats technology as a character, not a prop. Films where the direction is doing more work than the script tells you. Strategy games where the fun is the systems underneath, not the combat on top. If a story or a game respects my intelligence, I'm in for the long haul.",
  },
  {
    label: "Off the Clock",
    text: "Most of what I do outside of work is still, honestly, building something. A side project, a home network experiment, a piece of Scrumtrulescent. The line between hobby and craft blurred a long time ago, and I've stopped trying to redraw it.",
  },
  {
    label: "The Tools I Love",
    text: "Payload CMS, because it treats content like a real data model instead of an afterthought. A whiteboard, because half my thinking happens before a keyboard is involved. And a terminal I've spent years customizing to the point where using someone else's machine feels like wearing another person's glasses.",
  },
  {
    label: "Zambia and Home",
    text: "I build from Zambia, not despite it. The infrastructure work that shaped how I think about uptime happened on towers here, in places the grid doesn't reach. Working with someone local means working with someone who has actually stood at the edge of the network and watched it fail.",
  },
] as const;

function InterestsModal() {
  const [active, setActive] = React.useState<string>(TOPICS[0].label);
  const activeTopic = TOPICS.find((topic) => topic.label === active) ?? TOPICS[0];

  return (
    <DialogContent className="max-w-[min(90vw,36rem)]">
      <DialogHeader>
        <DialogTitle>The way I am</DialogTitle>
        <DialogDescription>
          The nerdiness, the design obsession, and everything I do when I&apos;m
          not shipping.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((topic) => (
          <button
            key={topic.label}
            type="button"
            onClick={() => setActive(topic.label)}
            aria-pressed={active === topic.label}
            className={`eyebrow border px-3 py-1.5 transition-colors ${
              active === topic.label
                ? "border-rose bg-rose/10 text-rose"
                : "border-border text-muted hover:text-ink"
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>
      <p className="text-muted">{activeTopic.text}</p>
    </DialogContent>
  );
}

export { InterestsModal };
