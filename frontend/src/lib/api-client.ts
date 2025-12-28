/**
 * API Client Export
 * 
 * This file provides a centralized export for the API client.
 * Services can import from either:
 * - @/lib/axios (direct import - recommended)
 * - @/lib/api-client (re-export - for consistency)
 */
export { default as apiClient } from "./axios";
export { default } from "./axios";
