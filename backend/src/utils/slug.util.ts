export class SlugUtil {
  /**
   * Generate a URL-friendly slug from a string.
   * Examples:
   *  - "Men's T-Shirts" -> "mens-t-shirts"
   *  - "  New  Arrivals!! " -> "new-arrivals"
   */
  static generate(value: string): string {
    if (!value) {
      return "";
    }

    return (
      value
        .toString()
        .normalize("NFKD") // normalize accented chars
        .toLowerCase()
        .trim()
        // remove invalid chars
        .replace(/[^a-z0-9\s-]/g, "")
        // collapse whitespace and dashes
        .replace(/[\s_-]+/g, "-")
        // trim starting/ending dashes
        .replace(/^-+|-+$/g, "")
    );
  }
}
