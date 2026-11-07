/**
 * Canonical origin used for every link we hand out to other people.
 *
 * `window.location.origin` is only correct while the app is being served from
 * the domain the recipient will open. Running the builder on `localhost` (or a
 * LAN IP such as 192.168.x.x) produced share links pointing at a host no other
 * device can reach, which the recipient sees as a 404 / "page not found".
 *
 * Set `NEXT_PUBLIC_SITE_URL` (e.g. https://dev-canvas-ia.vercel.app) in every
 * deployment so published links never depend on where the builder was opened.
 */

const FALLBACK_SITE_URL = 'https://dev-canvas-ia.vercel.app';

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function isLocalOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);

    if (hostname === 'localhost' || hostname === '0.0.0.0' || hostname === '::1' || hostname === '[::1]') {
      return true;
    }

    if (hostname.endsWith('.local')) {
      return true;
    }

    // Loopback, private and link-local IPv4 ranges.
    return /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
  } catch {
    return false;
  }
}

/**
 * Origin that public portfolio links should point at.
 *
 * Priority: explicit `NEXT_PUBLIC_SITE_URL` -> real browser origin ->
 * known production deployment.
 */
export function getPublicBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return stripTrailingSlash(configured);
  }

  if (typeof window !== 'undefined') {
    const { origin } = window.location;

    if (origin && !isLocalOrigin(origin)) {
      return stripTrailingSlash(origin);
    }
  }

  return FALLBACK_SITE_URL;
}

/** Path for a published portfolio: `/my-unique-name`. */
export function getPortfolioPath(slug: string): string {
  return `/${slug.trim().replace(/^\/+/, '')}`;
}

/** Full public URL for a published portfolio. */
export function getPortfolioUrl(slug: string): string {
  return `${getPublicBaseUrl()}${getPortfolioPath(slug)}`;
}
