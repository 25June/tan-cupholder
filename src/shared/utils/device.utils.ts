/**
 * Detects if the current device is a laptop or desktop (not a mobile phone or tablet).
 *
 * Returns true if device is likely a laptop/PC, false if phone or tablet.
 * Compatible with Chrome, Firefox, Safari browsers.
 */
export function isDesktopDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined')
    return false;

  const ua =
    navigator.userAgent || navigator.vendor || (window as any).opera || '';

  // iPad detection (Safari on iPadOS >= 13 identifies as Mac)
  const isIPad = (() => {
    // navigator.platform is deprecated in some browsers. As a workaround,
    // for iPadOS, check for "Mac" in user agent and presence of touch support,
    // which is a common heuristic for iPads since iPadOS 13.
    const isIPadOS13Up =
      /Macintosh/.test(ua) &&
      typeof navigator.maxTouchPoints === 'number' &&
      navigator.maxTouchPoints > 1;

    // Older iPads will still advertise themselves directly
    const isOldIPad = /iPad/.test(ua);

    if (isIPadOS13Up || isOldIPad) return true;
    return false;
  })();

  // Tablet detection (Android)
  const isAndroidTablet = /Android/.test(ua) && !/Mobile/.test(ua);
  // Phone detection (iPhone, Android mobile, etc.)
  const isPhone =
    /iPhone|Android.*Mobile|Mobile.*Safari|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(
      ua
    );
  // Explicit mobile/tablet detection
  if (isIPad || isAndroidTablet || isPhone) {
    return false;
  }
  // Touch device heuristic (not always perfect, but guards against most tablets)
  if (typeof window.matchMedia === 'function') {
    // A very wide screen plus hover support -> likely a laptop/desktop
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isWideEnough = window.innerWidth > 1024;
    if (isCoarsePointer && !isWideEnough) {
      return false;
    }
  }

  // Default: laptop/PC
  return true;
}
