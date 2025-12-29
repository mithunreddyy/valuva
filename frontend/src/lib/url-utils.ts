/**
 * URL utility functions
 * Provides helpers for URL manipulation and query parameters
 */

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Parse query parameters from URL
 */
export function parseQueryParams(
  searchParams: URLSearchParams | string
): Record<string, string> {
  const params: Record<string, string> = {};
  
  const search = typeof searchParams === "string" 
    ? new URLSearchParams(searchParams)
    : searchParams;

  search.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Get query parameter value
 */
export function getQueryParam(
  searchParams: URLSearchParams | string,
  key: string
): string | null {
  const search = typeof searchParams === "string"
    ? new URLSearchParams(searchParams)
    : searchParams;
  
  return search.get(key);
}

/**
 * Update query parameters in URL
 */
export function updateQueryParams(
  currentParams: URLSearchParams,
  updates: Record<string, string | number | boolean | null | undefined>
): URLSearchParams {
  const newParams = new URLSearchParams(currentParams);
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
  });

  return newParams;
}

/**
 * Remove query parameters from URL
 */
export function removeQueryParams(
  currentParams: URLSearchParams,
  keys: string[]
): URLSearchParams {
  const newParams = new URLSearchParams(currentParams);
  
  keys.forEach((key) => {
    newParams.delete(key);
  });

  return newParams;
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    // If URL is invalid, return empty string or handle error
    return "";
  }
}

