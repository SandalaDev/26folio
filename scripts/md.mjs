#!/usr/bin/env node
// md.mjs — minimal, safe markdown -> HTML renderer for the standalone guide.
//
// WHY THIS EXISTS
// Guide content lives in docs/guide/*.md and renders to a separate guide.html.
//
// SCOPE: deliberately tiny. Supports only what the guide chapters use:
//   ## / ### headings, paragraphs, <ul>/<ol> lists, <pre> code blocks, inline
//   `code`, **bold**, *italic*, and raw-HTML pass-through (for the <table> bits).
// It is NOT a general markdown engine — do not use it for untrusted input. It
// runs at render time on repo-owned markdown, so input is trusted.
//
// Usage: import { renderMarkdown } from "./md.mjs"; renderMarkdown(src)

import fs from "node:fs";

export function renderMarkdown(src) {
  if (!src) return "";
  const lines = String(src).replace(/\r$/, "").split("\n");
  const out = [];
  let i = 0;

  // Inline formatting: `code`, **bold**, *italic*. Order matters.
  const inline = (s) => s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');

  while (i < lines.length) {
    const line = lines[i];

    // Blank line -> paragraph separator (we emit <p> per run, below).
    if (line.trim() === "") { i++; continue; }

    // Role callout:
    // :::human Title
    // Markdown content
    // :::
    const callout = line.trim().match(/^:::(human|agent|system|check)\s*(.*)$/i);
    if (callout) {
      const kind = callout[1].toLowerCase();
      const title = callout[2] || kind;
      const block = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") { block.push(lines[i]); i++; }
      if (i < lines.length) i++;
      out.push(`<aside class="callout ${kind}"><div class="callout-title">${inline(title)}</div>${renderMarkdown(block.join("\n"))}</aside>`);
      continue;
    }

    // Raw HTML pass-through: a line starting with < is emitted as-is (tables, etc.).
    // Only single-line blocks; multi-line raw HTML is rare in the guide chapters.
    if (/^\s*</.test(line) && !line.trim().startsWith("<code>")) {
      // Collect consecutive raw-HTML lines.
      const block = [];
      while (i < lines.length && /^\s*</.test(lines[i])) { block.push(lines[i]); i++; }
      out.push(block.join("\n"));
      continue;
    }

    // Fenced code block ``` ... ```
    if (/^```/.test(line.trim())) {
      const block = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) { block.push(lines[i]); i++; }
      i++; // skip closing fence
      out.push(`<pre>${block.map(inline).join("\n")}</pre>`);
      continue;
    }

    // Headings: ## / ### (h1 is reserved for the page title).
    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // Unordered list.
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`  <li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>\n${items.join("\n")}\n</ul>`);
      continue;
    }

    // Ordered list.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`  <li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>\n${items.join("\n")}\n</ol>`);
      continue;
    }

    // Paragraph: consecutive non-blank, non-special lines.
    const para = [];
    while (i < lines.length && lines[i].trim() !== ""
           && !/^(#{2,3})\s/.test(lines[i])
           && !/^\s*[-*]\s+/.test(lines[i])
           && !/^\s*\d+\.\s+/.test(lines[i])
           && !/^\s*</.test(lines[i])
           && !/^```/.test(lines[i].trim())
           && !/^:::(human|agent|system|check)\b/i.test(lines[i].trim())) {
      para.push(lines[i]); i++;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

// Render every markdown file in a directory (ordered by filename), concatenated.
// Missing dir -> empty string (caller decides what to show).
export function renderDir(dir) {
  if (!fs.existsSync(dir)) return "";
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort();
  return files.map(f => renderMarkdown(fs.readFileSync(`${dir}/${f}`, "utf8"))).join("\n\n");
}
