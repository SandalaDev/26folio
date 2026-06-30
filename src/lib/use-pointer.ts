"use client";

import * as React from "react";

export interface PointerPosition {
  x: number;
  y: number;
}

/**
 * usePointer — single `mousemove` source (12-ui-element-map.md §1). Generic on
 * purpose: `FlashlightCursor` is the only consumer today, but a later `Cursor`
 * component subscribes to the same hook rather than adding a second listener.
 */
export function usePointer(): PointerPosition | null {
  const [position, setPosition] = React.useState<PointerPosition | null>(null);

  React.useEffect(() => {
    function handleMove(event: MouseEvent) {
      setPosition({ x: event.clientX, y: event.clientY });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
