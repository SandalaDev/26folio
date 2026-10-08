// Builds the inquiry email. Visitor input is flattened to one line and capped
// before it reaches the subject, so it cannot add or alter a header. The body
// is plain text; no HTML is built from raw input.

type InquiryInput = {
  name: string;
  email: string;
  message: string;
  projectType?: string;
};

// Built from a string so the source holds no raw line separator characters.
const CONTROL_CHARS = new RegExp("[\u0000-\u001f\u007f\u2028\u2029]+", "g");

/** Collapses CR, LF and other control characters to single spaces. */
export function singleLine(value: string, max: number): string {
  const flat = value.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

export function buildInquiryEmail(inquiry: InquiryInput): {
  subject: string;
  text: string;
} {
  const subject = `New inquiry from ${singleLine(inquiry.name, 80)}`;
  const lines = [
    `Name: ${singleLine(inquiry.name, 100)}`,
    `Email: ${singleLine(inquiry.email, 254)}`,
    ...(inquiry.projectType ? [`Project type: ${singleLine(inquiry.projectType, 60)}`] : []),
    "",
    inquiry.message,
    "",
    "Sent from the contact form on sandala.dev. Reply to answer the sender.",
  ];
  return { subject, text: lines.join("\n") };
}

/**
 * Confirmation sent to the visitor. It never repeats their message, and the
 * greeting uses the flattened name. The wording mirrors the success state in
 * `contact-form.tsx`; change them together.
 */
export function buildAutoReply(inquiry: Pick<InquiryInput, "name">): {
  subject: string;
  text: string;
} {
  const lines = [
    `Hi ${singleLine(inquiry.name, 60)},`,
    "",
    "Thanks for writing. Your message reached me.",
    "",
    "I read every inquiry and reply to the ones that fit. If you do not hear back within a few days, the project may not be a match this time.",
    "",
    "Abe Sandala",
    "sandala.dev",
    "",
    "You are getting this because someone used the contact form on sandala.dev with this address. If that was not you, you can ignore this email.",
  ];
  return { subject: "Your message reached me", text: lines.join("\n") };
}
