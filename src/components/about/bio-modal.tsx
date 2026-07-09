import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * BioModal — "Who I am" (12-ui-element-map.md §3 About #2a-ii). Six-section
 * biography from the owner's content blueprint (EPIC-014/TASK-058,
 * 2026-07-06): opening hook, design roots, telecom chapter, the turn, how I
 * work, the close.
 */
function BioModal() {
  return (
    <DialogContent className="max-w-[min(90vw,40rem)]">
      <DialogHeader>
        <DialogTitle>Who I am</DialogTitle>
        <DialogDescription>
          From cell towers to codebases: the full story.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-5 text-muted">
        <p>
          Before I ever deployed an app, I deployed hardware. Cell towers in
          places where the sun does the work a data center&apos;s cooling
          system does everywhere else, where a generator failure at 2am is
          not an abstraction: it is a village without signal until someone
          drives out and fixes it. I learned what mission-critical costs
          before I ever wrote a line of code, and that&apos;s the lens I
          bring to every product I build now.
        </p>
        <p>
          In 2002, long before &quot;UI/UX&quot; was a job title, I was
          already obsessing over pixels in Macromedia Fireworks. That habit
          turned into a decades-long side practice: brands, print, client
          websites, built for real people who needed them to look right and
          work. For years I shipped client sites with whatever the best
          no-code tool of the era offered: Adobe Muse, then Elementor, then
          Webflow. Design was never a line on my résumé. It was just the
          thing I couldn&apos;t stop doing, chapter after chapter, tool after
          tool.
        </p>
        <p>
          I entered telecom with my hands, not a title: an artisan on site
          crews before I held any engineering credential. The climb went from
          there. Field Operations Engineer, working radio access networks,
          microwave links, fiber backhaul, and hybrid DC, solar, and
          generator power. Then QA Engineer at the largest telecom
          infrastructure provider in the country. Then Huawei, where I
          helped deliver a 1,000-tower turnkey off-grid solar project,
          state-backed, and was promoted mid-project to Implementation
          Manager, running the remaining 500-plus towers to completion. When
          a tower goes dark, there is no error log to read. There is a
          drive, a diagnosis, and a fix that has to hold, because a real
          community is waiting on the other side of it. That is where I
          learned redundancy and quality assurance as disciplines, not
          checkboxes.
        </p>
        <p>
          Every website builder I ever loved eventually told me no. Some
          layout, some interaction, some piece of logic the platform simply
          would not allow. Learning to code in 2021 wasn&apos;t a career
          move at first, it was the decision to stop negotiating with my
          tools. Then I found Payload CMS, and the whole thing clicked:
          finally able to build the custom, content-first applications
          I&apos;d been trying to build through builders for years. Nothing
          I&apos;ve done before uses all of me the way this does. The
          systems brain, the design eye, and the plain nerdiness are all
          load-bearing here, at the same time, for the first time.
        </p>
        <p>
          When I say end-to-end, I mean it literally: raw business
          requirements, strategy, business logic, UI/UX, system design,
          development, deployment, running in production. One person,
          accountable for all of it. That&apos;s not a boast about working
          alone, it&apos;s a statement about where the responsibility sits.
          No handoffs to lose your idea in, no &quot;that&apos;s the other
          team&apos;s bug.&quot; On a team, this range shows up differently:
          I&apos;m the developer who understands why the ticket exists, not
          just how to close it.
        </p>
        <p>
          If you&apos;re building something and want a partner who thinks
          past the ticket, I&apos;d like to hear about it. And if
          you&apos;re a team that values people who&apos;ve shipped in the
          physical world before they shipped in the digital one, I think
          you&apos;ll find the fit makes sense. Either way, I&apos;d
          genuinely enjoy the conversation.
        </p>
      </div>
    </DialogContent>
  );
}

export { BioModal };
