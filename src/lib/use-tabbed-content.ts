"use client";

import * as React from "react";

export interface UseTabbedContentOptions {
  orientation?: "horizontal" | "vertical";
  initialId?: string;
}

/**
 * useTabbedContent — headless ARIA tabs primitive (12-ui-element-map.md §6
 * decision #4). `ServiceTabs` and `ProcessSteps` are skins over this; no
 * visual opinion lives here. Implements the WAI-ARIA tabs pattern: roving
 * tabindex, arrow-key navigation, Home/End.
 */
export function useTabbedContent(ids: string[], options: UseTabbedContentOptions = {}) {
  const { orientation = "horizontal", initialId } = options;
  const [activeId, setActiveId] = React.useState(
    initialId && ids.includes(initialId) ? initialId : ids[0],
  );

  // `initialId` often arrives a render or two after mount (e.g. a caller
  // reading `window.location.hash` in its own effect) — useState's initial
  // argument only applies on the very first render, so re-apply it once it
  // resolves to a valid id, but only before the user has interacted.
  const appliedInitialId = React.useRef(false);
  React.useEffect(() => {
    if (appliedInitialId.current) return;
    if (initialId && ids.includes(initialId)) {
      setActiveId(initialId);
      appliedInitialId.current = true;
    }
  }, [initialId, ids]);

  const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
  const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

  function getTabListProps() {
    return { role: "tablist" as const, "aria-orientation": orientation };
  }

  // Programmatic .focus() works regardless of tabIndex (roving tabindex only
  // affects sequential Tab-key navigation) — so it's safe to call immediately
  // on the already-rendered target button, without waiting for re-render.
  function focusTab(targetId: string) {
    document.getElementById(`tab-${targetId}`)?.focus();
  }

  function getTabProps(id: string) {
    const isActive = id === activeId;
    return {
      role: "tab" as const,
      id: `tab-${id}`,
      "aria-selected": isActive,
      "aria-controls": `tabpanel-${id}`,
      tabIndex: isActive ? 0 : -1,
      onClick: () => setActiveId(id),
      onKeyDown: (event: React.KeyboardEvent) => {
        const index = ids.indexOf(id);
        if (event.key === nextKey) {
          event.preventDefault();
          const next = ids[(index + 1) % ids.length];
          setActiveId(next);
          focusTab(next);
        } else if (event.key === prevKey) {
          event.preventDefault();
          const prev = ids[(index - 1 + ids.length) % ids.length];
          setActiveId(prev);
          focusTab(prev);
        } else if (event.key === "Home") {
          event.preventDefault();
          setActiveId(ids[0]);
          focusTab(ids[0]);
        } else if (event.key === "End") {
          event.preventDefault();
          setActiveId(ids[ids.length - 1]);
          focusTab(ids[ids.length - 1]);
        }
      },
    };
  }

  function getTabPanelProps(id: string) {
    return {
      role: "tabpanel" as const,
      id: `tabpanel-${id}`,
      "aria-labelledby": `tab-${id}`,
      hidden: id !== activeId,
      tabIndex: 0,
    };
  }

  return { activeId, setActiveId, getTabListProps, getTabProps, getTabPanelProps };
}
