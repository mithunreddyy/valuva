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
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
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
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to relative luminance (WCAG formula)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 * Returns a value between 1 and 21
 * @param color1 - First color (hex format, e.g., "#000000" or "000000")
 * @param color2 - Second color (hex format, e.g., "#ffffff" or "ffffff")
 * @returns Contrast ratio (1-21), or null if colors are invalid
 */
export function getContrastRatio(
  color1: string,
  color2: string
): number | null {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return null;
  }

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param color1 - First color (hex format)
 * @param color2 - Second color (hex format)
 * @param level - WCAG level ("AA" or "AAA")
 * @param size - Text size ("normal" or "large")
 * @returns true if contrast meets standards
 */
export function meetsContrastRatio(
  color1: string,
  color2: string,
  level: "AA" | "AAA" = "AA",
  size: "normal" | "large" = "normal"
): boolean {
  const ratio = getContrastRatio(color1, color2);
  if (!ratio) return false;

  if (level === "AAA") {
    return size === "large" ? ratio >= 4.5 : ratio >= 7;
  }

  // AA level
  return size === "large" ? ratio >= 3 : ratio >= 4.5;
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
      const prevIndex =
        currentIndex === 0 ? items.length - 1 : currentIndex - 1;
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
