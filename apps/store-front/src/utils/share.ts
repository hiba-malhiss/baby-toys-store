export type SharePlatform = 'whatsapp' | 'facebook';

export function shareTo(platform: SharePlatform, url: string) {
  const encoded = encodeURIComponent(url);
  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    return;
  }
  if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank');
    return;
  }
}

export function shareCurrentPage(platform: SharePlatform) {
  shareTo(platform, window.location.href);
}

export function shareProduct(platform: SharePlatform, productId: string | number) {
  const url = `${window.location.origin}/product-details/${productId}`;
  shareTo(platform, url);
}

export function handleFooterSocialClick(platform: SharePlatform) {
  shareCurrentPage(platform);
}
