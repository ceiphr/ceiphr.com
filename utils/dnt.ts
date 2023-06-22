// @ts-nocheck - DNT is deprecated, but still useful to check if the user has enabled it

/**
 * Check if the user has enabled Do Not Track
 * @returns true if the user has enabled Do Not Track
 *
 * @example
 * const dnt = dntActive();
 * if (dnt) {
 *  // do something
 * }
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack
 */
export const dntActive = (): boolean =>
    'doNotTrack' in navigator && navigator.doNotTrack === '1';
