import React, { useState, useRef, useEffect } from 'react';
import classNames from 'clsx';
import styles from './image-uploader.module.scss';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../index';

interface ExistingImageObject {
  url: string;
  name?: string;
  size?: number;
}

interface ImageUploaderProps {
  existingImages?: (string | ExistingImageObject)[];
  onImagesChange?: (files: File[]) => void;
  multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  existingImages = [],
  onImagesChange,
  multiple = false,
}) => {
  const [previewImages, setPreviewImages] = useState<
    { file: File | null; url: string; name: string; size: number }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existingPreviews = existingImages.map((img) => {
      let url = '';
      let name = 'image';
      let size = 0;
      if (typeof img === 'string') {
        url = img;
        name = url.split('/').pop() || 'image';
      } else if (typeof img === 'object' && img.url) {
        url = img.url;
        name = img.name || url.split('/').pop() || 'image';
        size = img.size || 0;
      }
      return { file: null, url, name, size };
    });
    setPreviewImages(existingPreviews);
  }, [existingImages]);

  const addFiles = (files: File[]) => {
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setPreviewImages((prev) => (multiple ? [...prev, ...newPreviews] : newPreviews));
    onImagesChange?.(
      multiple ? [...previewImages.map((p) => p.file!).filter(Boolean), ...files] : files
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    addFiles(files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = (index: number) => {
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      const files = newPreviews.map((p) => p.file).filter(Boolean) as File[];
      onImagesChange?.(files);
      return newPreviews;
    });
  };

  return (
    <div className={styles.imageUploaderContainer}>
      <div>
        <Button onClick={() => fileInputRef.current?.click()}>
          Upload {multiple ? 'Images' : 'Image'}
        </Button>
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          hidden
        />
      </div>

      <div
        className={classNames(styles.imageUploaderContent, {
          [styles.isDragover]: isDragging,
        })}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewImages.length === 0 ? (
          <div className={styles.imageUploaderEmpty}>
            Drag & drop images here or click to upload
          </div>
        ) : (
          <div>
            {previewImages.map(({ url, name, size }, index) => (
              <div className={styles.imageUploaderFile} key={url + index}>
                <img
                  src={url}
                  alt={name}
                  className={styles.imageUploaderThumbnail}
                  loading="lazy"
                />
                <div className={styles.imageUploaderName} title={name}>
                  {name.length > 20 ? name.slice(0, 17) + '...' : name}
                </div>
                <div className={styles.imageUploaderSize}>{(size / 1024).toFixed(1)} KB</div>
                <Button
                  appearance="link"
                  onClick={() => handleRemove(index)}
                  leftIcon={faTrashAlt}
                  withoutPadding
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
