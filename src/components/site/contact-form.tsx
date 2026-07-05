"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * ContactForm - inquiry form (11-content-strategy.md §4 `/contact`,
 * 12-ui-element-map.md §3 `/contact` #1). Fields: name, email, message, and an
 * optional project-type selector. Plain `<form>` + the existing shadcn-derived
 * primitives (the design system deliberately stays lean: no shadcn Form/Select
 * deps). The project-type selector is a native `<select>` styled to match
 * (hard corners, `surface` field, hairline border, rose focus ring).
 *
 * Validation is client-side; on submit it POSTs to `/api/contact`. That route is
 * a 501 stub today (real Resend delivery is its own epic, per the charter's
 * no-stored-submissions constraint), so a 501 maps to a clean "unavailable"
 * state instead of an invented success. States: idle / submitting / success /
 * unavailable. The submit button uses `MagneticButton` so the CTA matches the
 * hero and the conversion band (owner note 4).
 */
type Status = "idle" | "submitting" | "success" | "unavailable";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const PROJECT_TYPES = [
  "Web development",
  "Custom software",
  "AI integration",
  "Something else",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  const shouldReduceMotion = useReducedMotion();
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Errors>({});

  function validate(values: {
    name: string;
    email: string;
    message: string;
  }): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Your name is required.";
    if (!values.email.trim()) next.email = "Your email is required.";
    else if (!EMAIL_RE.test(values.email)) next.email = "Enter a valid email.";
    if (!values.message.trim()) next.message = "A short message is required.";
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectType: String(data.get("projectType") ?? "") || undefined,
        }),
      });
      if (res.ok) setStatus("success");
      else setStatus("unavailable");
    } catch {
      setStatus("unavailable");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : fadeUp}
        role="status"
        className="border border-border bg-surface p-8"
      >
        <h2 className="font-display text-2xl font-semibold text-ink">
          Thanks for the message.
        </h2>
        <p className="mt-3 max-w-[52ch] text-muted">
          Your details came through. I read every inquiry and reply to the ones
          that fit. If you do not hear back within a few days, the project may
          not be a match this time.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={shouldReduceMotion ? undefined : "hidden"}
      animate={shouldReduceMotion ? undefined : "show"}
      variants={shouldReduceMotion ? undefined : staggerContainer}
      className="flex max-w-[52ch] flex-col gap-6"
    >
      {/* Name */}
      <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-danger">
            {errors.name}
          </p>
        )}
      </motion.div>

      {/* Email */}
      <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-danger">
            {errors.email}
          </p>
        )}
      </motion.div>

      {/* Optional project type */}
      <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="flex flex-col gap-2">
        <Label htmlFor="projectType">
          Type of project <span className="text-soft">(optional)</span>
        </Label>
        <select
          id="projectType"
          name="projectType"
          defaultValue=""
          className={cn(
            "flex h-11 w-full rounded-none border border-border bg-surface px-3 py-2 text-sm text-ink transition-colors",
            "hover:border-border-2",
          )}
        >
          <option value="" disabled>
            Select one
          </option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Message */}
      <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-danger">
            {errors.message}
          </p>
        )}
      </motion.div>

      <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="flex flex-col gap-3">
        <MagneticButton type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending" : "Send message"}
        </MagneticButton>
        {status === "unavailable" && (
          <p role="alert" className="text-sm text-amber">
            The form could not be delivered. Email delivery is not wired up yet,
            so reach me through the links on this page instead.
          </p>
        )}
      </motion.div>
    </motion.form>
  );
}

export { ContactForm };
