import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, Check, ImageIcon } from 'lucide-react';
import { Heading, Dialog, resolveUiKitBaseUrl } from '@baby-toys/ui-kit';
import styles from './ImagePickerModal.module.scss';

export interface ImagePickerProps {
  images: (File | string)[];
  value?: string | null;
  onChange?: (url: string) => void;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  hint?: string;
  status?: 'default' | 'error' | 'success';
}

const resolveUrl = (img: File | string): string => {
  if (img instanceof File) return URL.createObjectURL(img);

  if (
    img.startsWith('http://') ||
    img.startsWith('https://') ||
    img.startsWith('data:') ||
    img.startsWith('blob:')
  ) {
    return img;
  }

  const base = resolveUiKitBaseUrl();
  return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
};

const getKey = (img: File | string, idx: number): string => {
  if (img instanceof File) return `file-${img.name}-${idx}`;
  return `url-${img}-${idx}`;
};

const ImagePicker: React.FC<ImagePickerProps> = ({
  images,
  value,
  onChange,
  placeholder = 'Select an image…',
  title = 'Select Image',
  disabled = false,
  className,
  label,
  hint,
  status = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // cache blob URLs so they stay stable across renders
  const blobMapRef = useRef<Map<File, string>>(new Map());

  const getStableUrl = useCallback((img: File | string) => {
    if (!(img instanceof File)) return resolveUrl(img);

    if (!blobMapRef.current.has(img)) {
      blobMapRef.current.set(img, URL.createObjectURL(img));
    }

    return blobMapRef.current.get(img)!;
  }, []);

  const open = useCallback(() => {
    if (!disabled) setIsOpen(true);
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => triggerRef.current?.focus(), 50);
  }, []);

  const handleSelect = useCallback(
    (img: File | string) => {
      const url = getStableUrl(img); // ✅ use stable URL
      onChange?.(url);
      close();
    },
    [onChange, close, getStableUrl]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.('');
    },
    [onChange]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  const rootClass = [
    styles.root,
    disabled ? styles.disabled : '',
    status !== 'default' ? styles[status] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      {label && (
        <label className={styles.label} onClick={open}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={open}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        {value ? (
          <>
            <span className={styles.previewWrap}>
              <img src={value} alt="Selected" className={styles.previewImg} />
            </span>

            <span className={styles.previewLabel}>Change image</span>

            <span
              role="button"
              tabIndex={0}
              className={styles.clearBtn}
              onClick={handleClear}
              onKeyDown={(e) => e.key === 'Enter' && handleClear(e as any)}
            >
              <X size={12} strokeWidth={2.5} />
            </span>
          </>
        ) : (
          <>
            <span className={styles.iconWrap}>
              <ImageIcon size={18} strokeWidth={1.5} />
            </span>

            <span className={styles.placeholderText}>{placeholder}</span>
          </>
        )}
      </button>

      {hint && <p className={styles.hint}>{hint}</p>}

      {isOpen && (
        <Dialog
          header={
            <Heading level="h4" style={{ margin: 0 }}>
              {title}
            </Heading>
          }
          visible={isOpen}
          onVisibleChange={(visible) => !visible && close()}
          width="min(680px, 90vw)"
        >
          {images.length === 0 ? (
            <div className={styles.dialogEmpty}>No images uploaded yet. Upload images first.</div>
          ) : (
            <div className={styles.dialogContent}>
              {images.map((img, idx) => {
                const url = getStableUrl(img); // ✅ stable URL
                const isSelected = value === url; // ✅ FIXED

                return (
                  <button
                    key={getKey(img, idx)}
                    type="button"
                    className={`${styles.dialogGridItem} ${
                      isSelected ? styles.dialogSelected : ''
                    }`}
                    onClick={() => handleSelect(img)}
                  >
                    <img src={url} alt={`option-${idx}`} className={styles.dialogThumb} />

                    {isSelected && (
                      <div className={styles.dialogCheckBadge}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default ImagePicker;
