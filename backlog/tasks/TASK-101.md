---
id: TASK-101
title: "Draft per-project copy and alt text for owner approval"
status: superseded
priority: P1
risk_level: medium
epic_ref: backlog/epics/EPIC-026.md
progress_weight: 1
files_allowed:
  - src/lib/projects.ts
  - planning/content/
skill_refs: [writing-style, stop-slop]
---

# Task: Draft per-project copy and alt text for owner approval

## Scope

Write the words. Every string on the four project pages and their grid cards, in
drafts the owner then edits or confirms. Per the owner's decision this session:
**the agent drafts from what the assets actually show; the owner approves.**

### What is needed

Per project: card tagline and description, hero discipline tags, `note` block
bodies (the brief, the approach, what was made), and a caption for every
artefact that needs one. Plus the `/work` hero supporting line, which
`TASK-100` deliberately left as a slot.

Plus **alt text for every image**. `10-design-system.md` §9 is explicit:
decorative images take `alt=""`, meaningful images carry real alt text. On these
pages almost every image is meaningful — the artwork *is* the content — so
blanket `alt=""` would make the whole work section invisible to a screen reader.
`TASK-093`'s manifest already describes what each image shows; turn those into
real alt text.

### The hard constraint

**Nothing invented.** No metrics, no outcomes, no testimonials, no client quotes,
no claims about footfall, sales, engagement, or reception. This is both a content
rule (`11-content-strategy.md` §5, and the testimonials-and-metrics half of the §4
rule that this epic explicitly does *not* supersede) and a credibility question:
these pages exist to earn `GOAL-001` inquiries, and one invented statistic would
cost more than every honest sentence gains.

What can be written truthfully is plenty: what the brief appears to have been,
what was designed, which applications were produced, what the design decisions
were and why they work. "A stamp-style mark that survives being printed small on
four different pack formats" is an observation about the artwork. "Increased
shelf visibility by 30%" is a fabrication.

Handle `problem` and `outcome` carefully. Both fields currently hold explicit
draft placeholders that say the owner supplies the real brief. Either write them
as honest observations of the design problem visible in the work, or leave them
for the owner and say so — do not quietly fill them with plausible-sounding
narrative.

### Per-project notes

- **The Flavour Grills Cafe** — the only real client. A restaurant, bar, and
  special-events venue in Zambia; the posters carry live contact details
  (`flavourgrillszambia.com`). Check with the owner before publishing a client's
  phone numbers on a third-party portfolio, even though they appear in artwork the
  client itself distributes. The identity is a navy pot-with-lid mark with coral
  and navy type; the flatlay shows menu folder, business cards, letterhead, spice
  jars, branded coffee pouch, and leather tags.
- **OK Pharmacy** — self-initiated. A teal-to-green wordmark whose `O` is formed
  from a hand making an "OK" gesture, with the tagline "For your wellness". Applied
  to 24-hour signage, retail bag, poster, social, and a website mockup.
- **Provision Finance** — self-initiated. A financial services identity in navy
  and red with a three-bar mark, plus a full homepage design: sunflower-field hero,
  three primary actions (Borrow / Transact / Save), a live foreign-exchange rate
  strip, customer stories. The mockup's own footer text says "A Bank of Zambia
  accredited financial institution" and carries a 2018 date — treat that as
  *content inside a concept mockup*, not as a fact about a real institution, and
  make sure the page cannot be read as claiming a real bank as a client.
- **Gardenfare Foods** — self-initiated. A circular stamp mark with a tree and
  wheat ears, applied across four SKUs: GardenFruit juice, GardenOats, GardenSoy
  milk, GardenSpread peanut butter.

### Process

Apply `writing-style`, then `stop-slop`. Per prior findings on this project the
slop gate needs pre-generated artifacts and counts em-dashes in code comments, so
generate before scoring. The scorer is advisory; the owner's approval is what
matters.

Draft in `planning/content/` first so the owner can read all four side by side in
one place, then land the approved strings in `src/lib/projects.ts`.

## Acceptance Criteria

- [ ] Card tagline and description written for all four projects.
- [ ] `note` block bodies written for all four projects.
- [ ] Every image has alt text, or a stated reason it is decorative.
- [ ] The `/work` hero supporting line is filled.
- [ ] Zero metrics, outcomes, testimonials, or client quotes anywhere.
- [ ] The three self-initiated projects are unambiguously described as
      self-initiated in prose as well as in the card credit.
- [ ] Nothing on the Provision Finance page can be read as claiming a real bank as
      a client.
- [ ] The question of publishing the client's live contact details is raised with
      the owner and answered before those posters ship.
- [ ] `problem` and `outcome` are either honestly written or explicitly left to the
      owner — no plausible-sounding filler.
- [ ] `writing-style` and `stop-slop` applied; scores recorded.
- [ ] Drafts reviewable in `planning/content/` before landing in code.

## Dependency Evidence

- plan: none

## Testing

- recommendation: none
- rationale: Copy correctness is not a testable property; it is a factual and
  editorial judgment that only the owner can make, since only the owner knows what
  actually happened on these engagements. The mechanical parts are covered
  elsewhere: `TASK-105` checks that every image has non-empty alt text where it
  should, and the build catches nothing about prose. The real safeguards here are
  the no-invented-claims criteria above and mandatory owner approval before
  anything ships publicly, which `AGENTS.md` already requires for public claims.

## Notes

Depends on `TASK-093`'s manifest for image descriptions and `TASK-094` for the
fields the copy fills. Best done after `TASK-099` and `TASK-100` so the drafts can
be read in place, at real size, rather than as a list of strings.

Owner approval is mandatory before this ships. It is the one task in the epic
where a confident-sounding wrong sentence does lasting damage.

## Superseded by EPIC-029 (2026-10-09)

EPIC-029 replaces EPIC-026. Work built for this task on the unmerged local
branch `feature/EPIC-026` is salvaged by TASK-130; what remains is re-planned
in EPIC-029.
