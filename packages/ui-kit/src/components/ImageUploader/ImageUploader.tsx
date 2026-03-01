import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Trash2 } from 'lucide-react';
import { Button, Image, useToast } from '@baby-toys/ui-kit';
import { resolveImageBaseUrl } from '../Image';
import styles from './image-uploader.module.scss';

interface ImageUploaderProps {
  images?: (File | string)[];
  onImagesChange?: (files: (File | string)[]) => void;
  multiple?: boolean;
  onBackendDelete?: (imageUrl: string) => Promise<void>;
  isDisabled?: boolean;
  isLoading?: boolean;
  fullHeight?: boolean;
  maxImages?: number;
  maxImageSizeMB?: number;
}

export interface PreviewImage {
  file: File | null;
  url: string;
  isBackend: boolean;
  uploading?: boolean;
  progress?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onImagesChange,
  multiple = true,
  onBackendDelete,
  isDisabled = false,
  isLoading = false,
  fullHeight = false,
  maxImages = 10,
  maxImageSizeMB = 5,
}) => {
  const toast = useToast();
  const baseUrl = resolveImageBaseUrl();
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastValueRef = useRef<(File | string)[]>(['']);

  const resolveBackendUrl = React.useCallback(
    (url: string) => {
      if (!url) return '';
      if (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('data:') ||
        url.startsWith('blob:')
      ) {
        return url;
      }
      return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    },
    [baseUrl]
  );

  useEffect(() => {
    const arr = Array.isArray(images) ? images : [];
    const previews: PreviewImage[] = arr.map((item) => {
      if (item instanceof File) {
        return { file: item, url: URL.createObjectURL(item), isBackend: false };
      }
      if (typeof item === 'string') {
        return { file: null, url: item, isBackend: true };
      }
      return { file: null, url: '', isBackend: false };
    });

    setPreviewImages(previews);
    lastValueRef.current = arr;
  }, [images]);

  useEffect(() => {
    return () => {
      previewImages.forEach((p) => {
        if (p.file && p.url.startsWith('blob:')) {
          URL.revokeObjectURL(p.url);
        }
      });
    };
  }, [previewImages]);

  const addFiles = (files: File[]) => {
    if (isDisabled) return;

    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    validFiles.forEach((f) => {
      if (f.size / 1024 / 1024 > maxImageSizeMB) {
        toast.error(`${f.name} exceeds ${maxImageSizeMB}MB`);
      }
    });

    const remainingSlots = maxImages - previewImages.length;
    if (validFiles.length > remainingSlots) {
      toast.error(`You can only upload up to ${maxImages} images`);
    }

    const toAdd = validFiles
      .slice(0, remainingSlots)
      .filter((f) => f.size / 1024 / 1024 <= maxImageSizeMB);

    const newPreviews = toAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isBackend: false,
    }));

    const updatedPreviews = multiple ? [...previewImages, ...newPreviews] : newPreviews;

    setPreviewImages(updatedPreviews);
    onImagesChange?.(updatedPreviews.map((p) => p.file || p.url));
    lastValueRef.current = updatedPreviews.map((p) => p.file || p.url);
  };

  const handleRemove = async (index: number) => {
    const target = previewImages[index];
    if (!target || isDisabled) return;

    setIsDeleting(true);
    try {
      if (target.isBackend && onBackendDelete) {
        await onBackendDelete(target.url);
      }

      const newPreviews = previewImages.filter((_, i) => i !== index);
      setPreviewImages(newPreviews);
      onImagesChange?.(newPreviews.map((p) => p.file || p.url));
      lastValueRef.current = newPreviews.map((p) => p.file || p.url);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    addFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    addFiles(files);
  };

  const containerClass = clsx(styles.imageUploaderContent, isDragging && styles.isDragover);

  return (
    <div className={clsx(styles.imageUploaderContainer, fullHeight && styles.fullHeight)}>
      <div
        className={containerClass}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDisabled) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          if (!isDisabled) setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => !isDisabled && fileInputRef.current?.click()}
      >
        <Button
          type="button"
          color="secondary-light"
          className={styles.uploadButton}
          isDisabled={isDisabled}
          isLoading={isLoading}
        >
          Upload {multiple ? 'Images' : 'Image'}
        </Button>

        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
          disabled={isDisabled}
        />

        {previewImages.length === 0 ? (
          <div className={styles.imageUploaderEmpty}>
            Drag & drop images here or click to upload
          </div>
        ) : (
          <div className={styles.imageUploaderGrid}>
            {previewImages.map((p, index) => (
              <div key={p.url + index} className={styles.imageUploaderFile}>
                <Image
                  src={p.isBackend ? resolveBackendUrl(p.url) : p.url}
                  alt={`preview-${index}`}
                  className={styles.imageUploaderThumbnail}
                />
                <Button
                  type="button"
                  appearance="link"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  leftIconComp={Trash2}
                  className={styles.imageUploaderRemove}
                  withoutPadding
                  isLoading={isDeleting || isLoading}
                  isDisabled={isDeleting || isDisabled}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
