import React, { useState, useRef, useEffect } from 'react';
import classNames from 'clsx';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Image, useToast } from '@baby-toys/ui-kit/components';
import styles from './image-uploader.module.scss';

interface ImageUploaderProps {
  images?: (File | string)[];
  onImagesChange?: (files: (File | string)[]) => void;
  multiple?: boolean;
  onBackendDelete?: (imageUrl: string) => Promise<void>;
  maxFileSizeMB?: number;
  maxImages?: number;
  accept?: string;
}

export interface PreviewImage {
  file: File | null;
  url: string;
  isBackend: boolean;
  uploading?: boolean;
  progress?: number;
}

const DEFAULT_MAX_IMAGES = 10;
const DEFAULT_MAX_FILE_SIZE_MB = 5;
const DEFAULT_ACCEPT = 'image/*';
const BASE_URL = 'http://localhost:8080'; // adjust as needed

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onImagesChange,
  multiple = true,
  onBackendDelete,
  maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
  maxImages = DEFAULT_MAX_IMAGES,
  accept = DEFAULT_ACCEPT,
}) => {
  const toast = useToast();
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastValueRef = useRef<(File | string)[]>(['']);

  // Convert input images to preview objects
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

  // Cleanup blob URLs
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
    const validFiles = files.filter((f) => {
      if (accept !== '*/*' && !f.type.match(accept.replace('*', '.*'))) {
        toast.error(`Invalid file type: ${f.name}. Only ${accept} are allowed.`);
        return false;
      }
      return true;
    });

    // Check file size
    const oversizedFiles = validFiles.filter((f) => f.size / 1024 / 1024 > maxFileSizeMB);
    if (oversizedFiles.length > 0) {
      toast.error(
        `The following files exceed the maximum size of ${maxFileSizeMB}MB: ${oversizedFiles
          .map((f) => f.name)
          .join(', ')}`
      );
    }

    const remainingSlots = maxImages - previewImages.length;
    if (validFiles.length > remainingSlots) {
      toast.error(`You can only upload up to ${maxImages} images`);
    }

    const toAdd = validFiles
      .slice(0, remainingSlots)
      .filter((f) => f.size / 1024 / 1024 <= maxFileSizeMB);

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
    if (!target) return;
    setIsDeleting(true);

    try {
      if (target.isBackend && onBackendDelete) {
        await onBackendDelete(target.url);
      }

      const newPreviews = previewImages.filter((_, i) => i !== index);
      setPreviewImages(newPreviews);
      onImagesChange?.(newPreviews.map((p) => p.file || p.url));
      lastValueRef.current = newPreviews.map((p) => p.file || p.url);
    } catch (err) {
      console.error('Error deleting image:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className={styles.imageUploaderContainer}>
      <div
        className={classNames(styles.imageUploaderContent, {
          [styles.isDragover]: isDragging,
        })}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // only reset if actually left the container
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Button type="button" color="secondary-light" className={styles.uploadButton}>
          Upload {multiple ? 'Images' : 'Image'}
        </Button>

        <input
          type="file"
          multiple={multiple}
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
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
                  src={p.isBackend ? `${BASE_URL}${p.url}` : p.url}
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
                  leftIcon={faTrashAlt}
                  className={styles.imageUploaderRemove}
                  withoutPadding
                  loading={isDeleting}
                  disabled={isDeleting}
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
