import React from 'react';
import styles from './whatsapp-widget.module.scss';

export type WhatsAppWidgetProps = {
  phoneNumber: string;
  defaultMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
  ariaLabel?: string;
};

function safeOpen(url: string) {
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) window.location.href = url;
}

function normalizePhone(phoneRaw: string): string {
  const digits = (phoneRaw.match(/\d+/g) || []).join('');
  return digits.replace(/^00/, '').replace(/^0+(?=\d{9,}$)/, '');
}

function openWhatsAppChat(phoneRaw: string, text?: string, isMobile: boolean) {
  const normalized = normalizePhone(phoneRaw);
  if (!normalized) return;

  const webBase = `https://wa.me/${normalized}`;
  const webUrl = text ? `${webBase}?text=${encodeURIComponent(text)}` : webBase;

  if (isMobile) {
    // Try to open native app via deep link first; if app missing, fall back to web
    const appUrl = `whatsapp://send?phone=${normalized}${text ? `&text=${encodeURIComponent(text)}` : ''}`;
    const openStart = Date.now();
    // Use location.href for better deep-link reliability on mobile
    window.location.href = appUrl;
    // Fallback after a short delay in case app isn't installed
    setTimeout(() => {
      const elapsed = Date.now() - openStart;
      // If still on page after delay, open web share in a new tab
      if (elapsed < 1600) {
        safeOpen(webUrl);
      }
    }, 1200);
    return;
  }

  // Desktop: open in a new tab
  safeOpen(webUrl);
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber,
  defaultMessage,
  position = 'bottom-right',
  ariaLabel = 'Open WhatsApp chat',
}) => {
  if (!phoneNumber) return null;

  const handleClick = () => {
    openWhatsAppChat(phoneNumber, defaultMessage);
  };

  return (
    <button
      type="button"
      className={`${styles.Btn} ${styles[position]}`}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <div className={styles.sign}>
        <svg
          className={`${styles.socialSvg} ${styles.whatsappSvg}`}
          viewBox="0 0 16 16"
          aria-hidden
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
      </div>
      <div className={styles.text}>Whatsapp</div>
    </button>
  );
};

export default WhatsAppWidget;
