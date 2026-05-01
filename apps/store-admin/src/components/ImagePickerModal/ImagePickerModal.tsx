import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { Button, Heading } from '@baby-toys/ui-kit';
import { resolveImageBaseUrl } from '@baby-toys/ui-kit';
import styles from './image-picker-modal.module.scss';

interface ImagePickerModalProps {
  images: (File | string)[];
  selectedImage?: string | null;
  onSelect: (url: string) => void;
  onClose: () => void;
  title?: string;
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
  const base = resolveImageBaseUrl();
  return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
};

const getKey = (img: File | string, idx: number): string => {
  if (img instanceof File) return `file-${img.name}-${idx}`;
  return `url-${img}-${idx}`;
};

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  images,
  selectedImage,
  onSelect,
  onClose,
  title = 'Select Main Image',
}) => {
  const handleSelect = (img: File | string) => {
    const url = img instanceof File ? URL.createObjectURL(img) : img;
    onSelect(url);
    onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <Heading level="h4" className={styles.title}>
            {title}
          </Heading>
          <Button
            appearance="link"
            leftIconComp={X}
            onClick={onClose}
            withoutPadding
            size="small"
            aria-label="Close"
          />
        </div>

        {images.length === 0 ? (
          <div className={styles.empty}>No images uploaded yet. Upload images first.</div>
        ) : (
          <div className={styles.grid}>
            {images.map((img, idx) => {
              const url = resolveUrl(img);
              const isSelected = selectedImage === url || selectedImage === img;

              return (
                <button
                  key={getKey(img, idx)}
                  type="button"
                  className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleSelect(img)}
                >
                  <img src={url} alt={`option-${idx}`} className={styles.thumb} />
                  {isSelected && (
                    <div className={styles.checkBadge}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImagePickerModal;
