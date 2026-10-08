// Server-side validation for the contact form. Pure and self-contained so it
// can be imported by `node --test` without the `@/` alias (TASK-127).

export const PROJECT_TYPES = [
  "Web development",
  "Custom software",
  "AI integration",
  "Something else",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
} as const;

/** Upper bound for the raw JSON body, in bytes. */
export const MAX_BODY_BYTES = 32 * 1024;

export type Inquiry = {
  name: string;
  email: string;
  message: string;
  projectType?: ProjectType;
};

export type FieldName = "name" | "email" | "message" | "projectType";
export type FieldErrors = Partial<Record<FieldName, string>>;

export type ValidationResult =
  | { ok: true; value: Inquiry }
  | { ok: false; errors: FieldErrors };

export type Submission = {
  /** True when the hidden `website` field carries any text. */
  honeypotFilled: boolean;
  turnstileToken: string;
  result: ValidationResult;
};

// Stricter than the client check: no whitespace, quotes, angle brackets,
// commas or semicolons, so the value is safe as a bare reply-to address.
const EMAIL_RE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

export function validateInquiry(raw: Record<string, unknown>): ValidationResult {
  const errors: FieldErrors = {};

  const name = text(raw.name);
  if (!name) errors.name = "Your name is required.";
  else if (name.length > LIMITS.name) {
    errors.name = `Keep your name under ${LIMITS.name} characters.`;
  }

  const email = text(raw.email);
  if (!email) errors.email = "Your email is required.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email.";
  }

  const message = text(raw.message);
  if (!message) errors.message = "A short message is required.";
  else if (message.length > LIMITS.message) {
    errors.message = `Keep your message under ${LIMITS.message} characters.`;
  }

  let projectType: ProjectType | undefined;
  const rawType = raw.projectType;
  if (rawType !== undefined && rawType !== null && rawType !== "") {
    const match = PROJECT_TYPES.find((type) => type === rawType);
    if (match) projectType = match;
    else errors.projectType = "Choose one of the listed project types.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name: name as string,
      email: email as string,
      message: message as string,
      ...(projectType ? { projectType } : {}),
    },
  };
}

/** Returns null when the body is not a JSON object. */
export function parseSubmission(raw: unknown): Submission | null {
  if (!isRecord(raw)) return null;
  const honeypot = raw.website;
  return {
    honeypotFilled: typeof honeypot === "string" && honeypot.trim() !== "",
    turnstileToken:
      typeof raw.turnstileToken === "string" ? raw.turnstileToken : "",
    result: validateInquiry(raw),
  };
}
