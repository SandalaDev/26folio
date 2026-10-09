"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

import type { VideoClip } from "@/lib/projects";

/**
 * PreviewVideo — the muted loop on work cards and project heroes (EPIC-029
 * TASK-136, replacing EPIC-026's planned HoverVideo).
 *
 * It always sits over a still that is already on the page (the card image or the
 * hero cover) and fills that still's box, so it can never shift layout. It stays
 * transparent until the browser reports real playback, then fades in; when it
 * stops it fades out to the still again. No blank frame is ever shown.
 *
 * - `trigger="hover"`: plays while `active` (card hover or keyboard focus). On
 *   devices with no hover it plays while crossing the middle of the screen.
 * - `trigger="autoplay"`: plays while in view, pauses off screen.
 * - Reduced motion renders no video at all; the still stands in.
 *
 * Nothing downloads before the first play: `preload="none"`, and `play()` is
 * only called from the triggers above.
 */
export interface PreviewVideoProps {
  clip: VideoClip;
  trigger: "hover" | "autoplay";
  /** Hover trigger only: whether the parent card is hovered or focused. */
  active?: boolean;
  className?: string;
}

function PreviewVideo({ clip, trigger, active = false, className }: PreviewVideoProps) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLVideoElement>(null);
  const [inView, setInView] = React.useState(false);
  const [noHover, setNoHover] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  /* The server cannot know the visitor's motion preference, so rendering the
     <video> there and dropping it on a reduced-motion client is a hydration
     mismatch. Nothing renders until mount; the still underneath covers it. */
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setNoHover(window.matchMedia("(hover: none)").matches);
  }, []);

  const watchView = trigger === "autoplay" || noHover;

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !watchView) return;
    /* Heroes play while a quarter is visible. Cards on no-hover devices play only
       while crossing the middle tenth of the screen: on a phone three stacked
       cards fit in view, and three loops at once is wasted data. */
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      trigger === "autoplay"
        ? { threshold: 0.25 }
        : { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [watchView, trigger, mounted]);

  const shouldPlay = trigger === "autoplay" || noHover ? inView : active;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shouldPlay) {
      // Autoplay policy needs the property set, not only the attribute.
      el.muted = true;
      el.play().catch(() => setVisible(false));
    } else {
      el.pause();
      setVisible(false);
    }
  }, [shouldPlay, mounted]);

  if (!mounted || reduceMotion) return null;

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload="none"
      poster={clip.poster}
      disablePictureInPicture
      disableRemotePlayback
      onPlaying={() => setVisible(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className ?? ""}`}
    >
      {clip.webm ? <source src={clip.webm} type="video/webm" /> : null}
      <source src={clip.mp4} type="video/mp4" />
    </video>
  );
}

export { PreviewVideo };
