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
 * Client validation is a convenience; `/api/contact` re-validates everything.
 * The form POSTs JSON with a hidden honeypot (`website`) and a Cloudflare
 * Turnstile token. Success is claimed only when the route answers 200 with
 * `{ ok: true }`. Other outcomes map to: server field errors, a failed check,
 * rate limited, or "not sent" with a pointer to the direct links. The
 * Turnstile widget is rendered explicitly from a script tag (TASK-122 record:
 * planning/dependencies/DEC-20261008-contact-delivery.md). The submit button
 * uses `MagneticButton` so the CTA matches the hero and the conversion band
 * (owner note 4).
 */
type Status = "idle" | "submitting" | "success";

type Notice = "turnstile" | "rate-limited" | "not-sent" | null;

type FieldName = "name" | "email" | "message" | "projectType";
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["name", "email", "projectType", "message"];

const PROJECT_TYPES = [
  "Web development",
  "Custom software",
  "AI integration",
  "Something else",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public build-time value, so it is read here rather than through the
// server-side accessor in src/lib/env.ts (which would also pull server names
// into the client bundle).
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __onTurnstileLoad?: () => void;
  }
}

let turnstileLoader: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  turnstileLoader ??= new Promise<TurnstileApi>((resolve, reject) => {
    window.__onTurnstileLoad = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile-missing"));
    };
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__onTurnstileLoad";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      turnstileLoader = null;
      reject(new Error("turnstile-blocked"));
    };
    document.head.appendChild(script);
  });
  return turnstileLoader;
}

const NOTICE_COPY: Record<Exclude<Notice, null>, string> = {
  turnstile: "The check did not pass. Please try the check again.",
  "rate-limited":
    "That is a lot of messages in a short time. Please try again in a little while.",
  "not-sent":
    "Your message was not sent. Please try again, or reach me through the links on this page.",
};

function ContactForm() {
  const shouldReduceMotion = useReducedMotion();
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<Errors>({});
  const [notice, setNotice] = React.useState<Notice>(null);
  const [token, setToken] = React.useState("");
  const [widgetProblem, setWidgetProblem] = React.useState(
    SITE_KEY ? "" : "The spam check is not configured, so the form cannot send yet.",
  );
  const widgetBox = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<string | undefined>(undefined);
  const successRef = React.useRef<HTMLDivElement>(null);

  const mountWidget = React.useCallback(() => {
    const box = widgetBox.current;
    if (!SITE_KEY || !box) return;
    setWidgetProblem("");
    loadTurnstile()
      .then((api) => {
        if (!widgetBox.current || widgetId.current) return;
        widgetId.current = api.render(box, {
          sitekey: SITE_KEY,
          action: "contact",
          theme: "dark",
          size: "flexible",
          callback: (value: string) => {
            setToken(value);
            setWidgetProblem("");
          },
          "expired-callback": () => setToken(""),
          "error-callback": () => {
            setToken("");
            setWidgetProblem(
              "The spam check could not run. Reload the page, or reach me through the links on this page.",
            );
          },
        });
      })
      .catch(() => {
        setWidgetProblem(
          "The spam check could not load. A content blocker may be stopping it. Allow challenges.cloudflare.com and reload, or reach me through the links on this page.",
        );
      });
  }, []);

  React.useEffect(() => {
    mountWidget();
    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = undefined;
    };
  }, [mountWidget]);

  React.useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function resetCheck() {
    setToken("");
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }

  function focusFirstInvalid(next: Errors) {
    const first = FIELD_ORDER.find((field) => next[field]);
    if (first) document.getElementById(first)?.focus();
  }

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
    if (status === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
    setNotice(null);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstInvalid(nextErrors);
      return;
    }
    if (!token) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectType: String(data.get("projectType") ?? "") || undefined,
          website: String(data.get("website") ?? ""),
          turnstileToken: token,
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        code?: string;
        errors?: Errors;
      } | null;

      if (res.status === 200 && body?.ok === true) {
        setStatus("success");
        return;
      }

      setStatus("idle");
      resetCheck();
      if (res.status === 400 && body?.errors) {
        setErrors(body.errors);
        focusFirstInvalid(body.errors);
      } else if (res.status === 400 && body?.code === "turnstile") {
        setNotice("turnstile");
      } else if (res.status === 429) {
        setNotice("rate-limited");
      } else {
        setNotice("not-sent");
      }
    } catch {
      setStatus("idle");
      resetCheck();
      setNotice("not-sent");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        ref={successRef}
        tabIndex={-1}
        initial={shouldReduceMotion ? undefined : "hidden"}
        animate={shouldReduceMotion ? undefined : "show"}
        variants={shouldReduceMotion ? undefined : fadeUp}
        role="status"
        /* success = quiet functional sage (§2, TASK-053): the affirmative
           accent is the border + heading tint, kept quiet — no green shouting. */
        className="border border-success/50 bg-surface p-8 outline-none"
      >
        <h2 className="font-display text-2xl font-semibold text-success">
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
      aria-busy={status === "submitting"}
      initial={shouldReduceMotion ? undefined : "hidden"}
      animate={shouldReduceMotion ? undefined : "show"}
      variants={shouldReduceMotion ? undefined : staggerContainer}
      className="flex max-w-[52ch] flex-col gap-6"
    >
      {/* Honeypot: real visitors never see or reach it; bots fill it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

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
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? "projectType-error" : undefined}
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
        {errors.projectType && (
          <p id="projectType-error" className="text-sm text-danger">
            {errors.projectType}
          </p>
        )}
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

      {/* Spam check. The box reserves the widget's height so nothing shifts. */}
      <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="flex flex-col gap-2">
        <div ref={widgetBox} className="min-h-[65px]" />
        {widgetProblem && (
          <p role="alert" className="text-sm text-amber">
            {widgetProblem}
          </p>
        )}
      </motion.div>

      <motion.div variants={shouldReduceMotion ? undefined : fadeUp} className="flex flex-col gap-3">
        <MagneticButton
          type="submit"
          size="lg"
          disabled={status === "submitting" || !token}
        >
          {status === "submitting" ? "Sending" : "Send message"}
        </MagneticButton>
        <div aria-live="polite" className="min-h-0">
          {notice && (
            <p role="alert" className="text-sm text-amber">
              {NOTICE_COPY[notice]}
            </p>
          )}
        </div>
      </motion.div>
    </motion.form>
  );
}

export { ContactForm };
