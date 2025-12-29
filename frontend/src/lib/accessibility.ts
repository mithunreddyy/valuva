/**
 * Accessibility utilities
 */

/**
 * Get ARIA label for interactive elements
 */
export function getAriaLabel(
  action: string,
  item?: string,
  context?: string
): string {
  if (item && context) {
    return `${action} ${item} ${context}`;
  }
  if (item) {
    return `${action} ${item}`;
  }
  return action;
}

/**
 * Generate unique ID for ARIA relationships
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(", ");

  return element.matches(focusableSelectors);
}

/**
 * Trap focus within a container (for modals)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener("keydown", handleTabKey);

  return () => {
    container.removeEventListener("keydown", handleTabKey);
  };
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  if (typeof document === "undefined") return;

  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // For production, use a proper color contrast library
  return 4.5; // Placeholder - implement proper calculation
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardKeys = {
  Enter: "Enter",
  Escape: "Escape",
  Space: " ",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  Tab: "Tab",
} as const;

/**
 * Handle keyboard navigation for lists
 */
export function handleListKeyboardNavigation(
  e: React.KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelect: (index: number) => void
) {
  switch (e.key) {
    case KeyboardKeys.ArrowDown:
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % items.length;
      items[nextIndex]?.focus();
      onSelect(nextIndex);
      break;
    case KeyboardKeys.ArrowUp:
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      items[prevIndex]?.focus();
      onSelect(prevIndex);
      break;
    case KeyboardKeys.Home:
      e.preventDefault();
      items[0]?.focus();
      onSelect(0);
      break;
    case KeyboardKeys.End:
      e.preventDefault();
      items[items.length - 1]?.focus();
      onSelect(items.length - 1);
      break;
  }
}

