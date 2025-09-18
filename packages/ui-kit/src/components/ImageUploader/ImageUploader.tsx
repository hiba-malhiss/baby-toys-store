import React, { useState, useRef, useEffect } from 'react';
import classNames from 'clsx';
import styles from './image-uploader.module.scss';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Image } from '../index';

interface ImageUploaderProps {
  value?: (File | string)[];
  onChange?: (files: (File | string)[]) => void;
  multiple?: boolean;
}

interface PreviewImage {
  file: File | null;
  url: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = [],
  onChange,
  multiple = false,
}) => {
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Keep track of the last value we applied to state */
  const lastValueRef = useRef<(File | string)[]>([]);

  // ---- Sync with parent value only if it really changed ----
  useEffect(() => {
    const arr = Array.isArray(value) ? value : [];

    // shallow compare by reference + length + string names for Files
    const isSame =
      arr.length === lastValueRef.current.length &&
      arr.every((v, i) => {
        const prev = lastValueRef.current[i];
        if (v instanceof File && prev instanceof File) return v === prev;
        return v === prev;
      });

    if (!isSame) {
      const previews = arr.map((v) => ({
        file: v instanceof File ? v : null,
        url: v instanceof File ? URL.createObjectURL(v) : v,
      }));
      setPreviewImages(previews);
      lastValueRef.current = arr; // remember for next check
    }
  }, [value]);
  // ---------------------------------------------------------

  const addFiles = (files: File[]) => {
    const newPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    const updatedPreviews = multiple ? [...previewImages, ...newPreviews] : newPreviews;
    setPreviewImages(updatedPreviews);
    onChange?.(updatedPreviews.map((p) => p.file || p.url));
    lastValueRef.current = updatedPreviews.map((p) => p.file || p.url);
  };

  const handleRemove = (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
    onChange?.(newPreviews.map((p) => p.file || p.url));
    lastValueRef.current = newPreviews.map((p) => p.file || p.url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    addFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    addFiles(files);
  };

  return (
    <div className={styles.imageUploaderContainer}>
      <div className={styles.imageUploaderHeader}>
        <Button type="button" onClick={() => fileInputRef.current?.click()} color="secondary-light">
          Upload {multiple ? 'Images' : 'Image'}
        </Button>
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />
      </div>

      <div
        className={classNames(styles.imageUploaderContent, { [styles.isDragover]: isDragging })}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {previewImages.length === 0 ? (
          <div className={styles.imageUploaderEmpty}>
            Drag & drop images here or click to upload
          </div>
        ) : (
          previewImages.map(({ url }, index) => (
            <div className={styles.imageUploaderFile} key={url + index}>
              <Image src={url} alt={`preview-${index}`} className={styles.imageUploaderThumbnail} />
              <Button
                type="button"
                appearance="link"
                onClick={() => handleRemove(index)}
                leftIcon={faTrashAlt}
                className={styles.imageUploaderRemove}
                withoutPadding
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
