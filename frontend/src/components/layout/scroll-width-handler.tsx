"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * ScrollWidthHandler - Dynamically adjusts container max-width based on scroll position
 *
 * Features:
 * - Starts at 80% max-width
 * - Animates to 70% on scroll
 * - Only applies to desktop viewports (>= 1024px)
 * - Uses CSS custom properties for smooth transitions
 * - Debounced scroll handling for performance
 * - Respects user preferences (reduced motion)
 */
export function ScrollWidthHandler() {
  const tickingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const isDesktopRef = useRef(false);

  // Check if we're on desktop viewport (no state update needed)
  const checkDesktop = useCallback(() => {
    const desktop = window.innerWidth >= 1024;
    isDesktopRef.current = desktop;

    // Reset width if switching to mobile
    if (!desktop) {
      document.documentElement.style.setProperty("--container-max-width", "");
    }

    return desktop;
  }, []);

  // Update max-width based on scroll position
  const updateMaxWidth = useCallback(() => {
    const isDesktop = isDesktopRef.current;

    if (!isDesktop) {
      document.documentElement.style.setProperty("--container-max-width", "");
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // If reduced motion, set to 70% immediately without animation
      document.documentElement.style.setProperty(
        "--container-max-width",
        "70%"
      );
      return;
    }

    // Calculate scroll threshold (100px or 5% of viewport height, whichever is smaller)
    const scrollThreshold = Math.min(100, window.innerHeight * 0.05);
    const scrollY = window.scrollY || window.pageYOffset;

    // Calculate progress (0 to 1) based on scroll position
    const progress = Math.min(scrollY / scrollThreshold, 1);

    // Interpolate between 80% (start) and 70% (scrolled)
    // Using ease-out easing for smooth animation
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const maxWidth = 80 - easeOut * 10; // 80% to 70%

    document.documentElement.style.setProperty(
      "--container-max-width",
      `${maxWidth}%`
    );
  }, []);

  // Optimized scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!tickingRef.current) {
      rafRef.current = window.requestAnimationFrame(() => {
        updateMaxWidth();
        tickingRef.current = false;
      });
      tickingRef.current = true;
    }
  }, [updateMaxWidth]);

  // Handle resize
  const handleResize = useCallback(() => {
    checkDesktop();
    // Update width after resize
    updateMaxWidth();
  }, [checkDesktop, updateMaxWidth]);

  useEffect(() => {
    // Initial setup - check desktop status and update width
    const initialIsDesktop = checkDesktop();
    updateMaxWidth();

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Only add scroll listener if not reduced motion and on desktop
    if (!prefersReducedMotion && initialIsDesktop) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [checkDesktop, handleScroll, handleResize, updateMaxWidth]);

  return null;
}
