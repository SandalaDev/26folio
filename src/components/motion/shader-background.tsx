"use client";

import { MeshGradient } from "@paper-design/shaders-react";

/**
 * ShaderBackground — warm WebGL mesh-gradient for the hero (EPIC-009, 21st.dev
 * `hero-section-with-smooth-bg-shader`). The upstream demo ships teal/green colours
 * that violate the palette guardrails; here they are remapped to the skin palette
 * (10-design-system.md §2), and `distortion/swirl/speed` are tuned low for §6's
 * "subtle and smooth" — a long, low-contrast wash, never a harsh two-stop ramp (§3).
 *
 * This layer is ADDITIVE. `Hero` mounts it only when motion is allowed and the
 * pointer is fine, above the always-present static radial-gradient that stays the
 * `prefers-reduced-motion` / touch / SSR fallback (EPIC-009 decision #1).
 *
 * `MeshGradient` sizes itself to its container via CSS (its `width`/`height` are
 * inline CSS, not a pixel buffer), so it fills the absolutely-positioned wrapper.
 */

// Warm skin palette — mirrors the tailwind tokens (§2): rose → peach → caramel →
// soft, grounded on surface/background so the field reads as one family.
const WARM_COLORS = [
  "#ec8ca0", // rose — primary accent
  "#f0a98a", // peach — bridge highlight
  "#c99368", // caramel — secondary accent
  "#e9c8d3", // soft — tertiary pink
  "#241c18", // surface — warm panel
  "#1a1411", // background — warm espresso
];

interface ShaderBackgroundProps {
  className?: string;
}

export function ShaderBackground({ className = "" }: ShaderBackgroundProps) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 ${className}`}>
      <MeshGradient
        style={{ width: "100%", height: "100%" }}
        colors={WARM_COLORS}
        distortion={0.6}
        swirl={0.4}
        grainMixer={0}
        grainOverlay={0}
        speed={0.3}
        offsetX={0.05}
      />
      {/* Soft warm veil so light-rose type keeps AA contrast over the moving field (§10). */}
      <div className="pointer-events-none absolute inset-0 bg-background/50" />
    </div>
  );
}
