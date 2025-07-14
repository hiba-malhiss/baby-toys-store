import React, { useRef, DragEvent, ChangeEvent, useState } from 'react';
import styles from './file-upload.module.scss';
import { DEFAULT_LABELS, validateFile, formatFileSize, isImageFile } from './fileUploadHelpers';
import { Button, Chip, ProgressBar } from '../index';
import clsx from 'clsx';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface AdvancedFileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  progress: number;
  setProgress: (p: number) => void;
  messages: any[];
  setMessages: (m: any[]) => void;
  uploadedFileCount: number;
  setUploadedFileCount: (n: number) => void;
  uploading: boolean;
  setUploading: (b: boolean) => void;
  handleUpload: () => void;
  clearFiles: () => void;
  previewWidth: number;
  auto?: boolean;
  multiple?: boolean;
  accept?: string;
  fileLimit?: number;
  disabled?: boolean;
  onSelect?: (event: {
    originalEvent: React.SyntheticEvent;
    files: File[];
    currentFiles: File[];
  }) => void;
  onRemove?: (event: { originalEvent: React.SyntheticEvent; file: File }) => void;
  onRemoveUploadedFile?: (event: { file: File; files: File[] }) => void;
  onImageError?: (event: React.SyntheticEvent) => void;
}

const AdvancedFileUpload: React.FC<AdvancedFileUploadProps> = ({
  files,
  setFiles,
  uploadedFiles,
  setUploadedFiles,
  progress,
  messages,
  setMessages,
  uploadedFileCount,
  handleUpload,
  clearFiles,
  previewWidth,
  auto = false,
  multiple = false,
  accept,
  fileLimit,
  disabled,
  onSelect,
  onRemove,
  onRemoveUploadedFile,
  onImageError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasFiles = files.length > 0;
  const hasUploadedFiles = uploadedFiles.length > 0;
  const [isDragging, setIsDragging] = useState(false);
  const isChooseDisabled = fileLimit
    ? auto
      ? fileLimit <= files.length
      : fileLimit <= files.length + uploadedFileCount
    : false;

  const isFileLimitExceeded = fileLimit
    ? auto
      ? fileLimit < files.length
      : fileLimit < files.length + uploadedFileCount
    : false;

  const handleSelect = (event: ChangeEvent<HTMLInputElement> | DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const fileList =
      event.type === 'drop'
        ? (event as DragEvent).dataTransfer?.files
        : (event as ChangeEvent<HTMLInputElement>).target.files;

    if (!fileList) return;

    const newMessages = [];
    const newFiles = Array.from(fileList).filter((file) => {
      if (!multiple && files.length > 0) return false;
      const { isValid, messages } = validateFile({ file, accept });
      if (!isValid) newMessages.push(...messages);
      return isValid;
    });

    const updatedFiles = multiple ? [...files, ...newFiles] : [...newFiles];
    setFiles(updatedFiles);
    setMessages([...messages, ...newMessages]);

    onSelect?.({ originalEvent: event as any, files: newFiles, currentFiles: updatedFiles });

    if (auto && updatedFiles.length && !isFileLimitExceeded) {
      handleUpload();
    }

    if (event.type !== 'drop') {
      (event as ChangeEvent<HTMLInputElement>).target.value = '';
    }
  };

  const handleRemove = (e: React.SyntheticEvent, index: number) => {
    const removed = files[index];
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onRemove?.({ originalEvent: e, file: removed });
  };

  const handleRemoveUploaded = (index: number) => {
    const removed = uploadedFiles[index];
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    onRemoveUploadedFile?.({ file: removed, files: updated });
  };

  const renderFile = (file: File, index: number, uploaded = false) => {
    const objectUrl = isImageFile(file) ? URL.createObjectURL(file) : undefined;

    return (
      <div key={`${file.name}-${index}`} className={styles.fileUploadFile}>
        {objectUrl && (
          <img
            role="presentation"
            className={styles.fileUploadFileThumbnail}
            alt={file.name}
            src={objectUrl}
            width={previewWidth}
            onLoad={() => URL.revokeObjectURL(objectUrl)}
            onError={onImageError}
          />
        )}
        <div className={styles.fileUploadFileInfo}>
          <div className={styles.fileUploadFileName}>{file.name}</div>
          <span className={styles.fileUploadFileSize}>{formatFileSize(file.size)}</span>
        </div>
        <Chip
          size="small"
          appearance={uploaded ? 'success' : 'primary'}
          label={uploaded ? DEFAULT_LABELS.completed : DEFAULT_LABELS.pending}
        ></Chip>
        <div className={styles.fileUploadFileActions}>
          <Button
            onClick={(e) => (uploaded ? handleRemoveUploaded(index) : handleRemove(e, index))}
            isDisabled={disabled}
            leftIcon={faClose}
            appearance="link"
            withoutPadding
          ></Button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.fileUploadAdvancedContainer}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleSelect}
        multiple={multiple}
        accept={accept}
        disabled={disabled || isChooseDisabled}
        style={{ display: 'none' }}
      />

      <div className={styles.fileUploadHeader}>
        <Button
          size="small"
          color="secondary"
          onClick={() => fileInputRef.current?.click()}
          isDisabled={disabled || isChooseDisabled}
          className={disabled || isChooseDisabled ? styles.fileUploadButtonDisabled : ''}
        >
          {DEFAULT_LABELS.choose}
        </Button>

        {!auto && (
          <>
            <Button
              size="small"
              color="secondary-light"
              onClick={handleUpload}
              isDisabled={!hasFiles || isFileLimitExceeded || disabled}
              className={
                !hasFiles || isFileLimitExceeded || disabled ? styles.fileUploadButtonDisabled : ''
              }
            >
              {DEFAULT_LABELS.upload}
            </Button>
            <Button
              size="small"
              color="secondary-light"
              onClick={clearFiles}
              isDisabled={!hasFiles || disabled}
              className={!hasFiles || disabled ? styles.fileUploadButtonDisabled : ''}
            >
              {DEFAULT_LABELS.cancel}
            </Button>
          </>
        )}
      </div>
      {hasFiles && <ProgressBar progress={progress} className="bts-marginTxl bts-marginBxs" />}

      <div
        className={clsx(styles.fileUploadContent, {
          [styles.isDragover]: isDragging,
        })}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          handleSelect(e);
          setIsDragging(false);
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.fileUploadMessage} ${msg.severity === 'error' ? 'bts-errorMessage' : ''}`}
          >
            {msg.text}
          </div>
        ))}

        {hasFiles && (
          <div className={styles.fileUploadFileList}>{files.map((f, i) => renderFile(f, i))}</div>
        )}
        {hasUploadedFiles && (
          <div className={styles.fileUploadFileList}>
            {uploadedFiles.map((f, i) => renderFile(f, i, true))}
          </div>
        )}

        {!hasFiles && !hasUploadedFiles && (
          <div className={styles.fileUploadEmpty}>Drag and drop files to here to upload.</div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFileUpload;
