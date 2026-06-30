"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { Project } from "@/lib/projects";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * WorkCard — zoom + diagonal-reveal hover (12-ui-element-map.md §3 Home #2,
 * baunfire.com reference). Framer only (architecture principle #4).
 */
function WorkCard({ project }: { project: Project }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      href={project.href}
      className="group relative block overflow-hidden border border-border bg-surface p-8"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-rose/15 via-transparent to-caramel/15"
        initial={{ opacity: 0 }}
        whileHover={shouldReduceMotion ? undefined : { opacity: 1, scale: 1.05 }}
        transition={{ duration: DURATION.component, ease: EASE_OUT }}
      />
      <h3 className="font-display text-2xl font-semibold text-ink transition-transform group-hover:translate-x-1">
        {project.title}
      </h3>
      <p className="mt-3 text-muted">{project.description}</p>
    </Link>
  );
}

export { WorkCard };
