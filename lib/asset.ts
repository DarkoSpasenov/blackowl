/**
 * Base path of the site when hosted in a sub-folder
 * (e.g. GitHub Pages: https://user.github.io/blackowl → "/blackowl").
 * Empty when the site is served from the root of its own domain.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

/** Prefix a file from /public with the base path. */
export const asset = (path: string | null | undefined) => (path ? `${basePath}${path}` : path ?? null)
