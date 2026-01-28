export type SharePlatform = 'whatsapp' | 'facebook';
// Attempt to open a URL in a new tab/window. If blocked by a popup blocker,
// fall back to navigating the current tab.
function safeOpen(url: string) {
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    // Popup blocked; fall back to same-tab navigation
    window.location.href = url;
  }
}

export function shareTo(platform: SharePlatform, url: string, isMobile: boolean) {
  const encoded = encodeURIComponent(url);

  if (platform === 'whatsapp') {
    safeOpen(`https://wa.me/?text=${encoded}`);
    return;
  }

  if (platform === 'facebook') {
    // On mobile, try to open the Facebook app if available, otherwise fall back to web sharer
    if (isMobile) {
      // Known deep link pattern to open Facebook app share modal
      const appUrl = `fb://facewebmodal/f?href=${encodeURIComponent(
        `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
      )}`;

      // Try opening the app link first; if it fails (no app), quickly fall back to web
      const appWin = window.open(appUrl, '_blank', 'noopener,noreferrer');
      // If popup blocked or app not installed, fall back after a short delay
      setTimeout(() => {
        if (!appWin || appWin.closed) {
          safeOpen(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`);
        }
      }, 500);
      return;
    }

    // Desktop: use the web sharer directly
    safeOpen(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`);
    return;
  }
}

export function shareCurrentPage(platform: SharePlatform, isMobile: boolean) {
  shareTo(platform, window.location.href, isMobile);
}

export function shareProduct(platform: SharePlatform, productId: string | number, isMobile: boolean) {
  const url = `${window.location.origin}/product-details/${productId}`;
  shareTo(platform, url, isMobile);
}

export function handleFooterSocialClick(platform: SharePlatform, isMobile: boolean) {
  shareCurrentPage(platform, isMobile);
}
