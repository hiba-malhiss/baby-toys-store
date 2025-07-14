import React, { ChangeEvent, KeyboardEvent, useRef } from 'react';
import styles from './file-upload.module.scss';
import { DEFAULT_LABELS, validateFile } from './fileUploadHelpers';
import { Button } from '../index';

interface BasicFileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
  messages: any[];
  setMessages: (msgs: any[]) => void;
  auto?: boolean;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  onSelect?: (event: {
    originalEvent: React.SyntheticEvent;
    files: File[];
    currentFiles: File[];
  }) => void;
}

const BasicFileUpload: React.FC<BasicFileUploadProps> = ({
  files,
  setFiles,
  messages,
  setMessages,
  auto = false,
  multiple = false,
  accept,
  disabled = false,
  onSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFiles = files.length > 0;

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
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

    onSelect?.({
      originalEvent: event,
      files: newFiles,
      currentFiles: updatedFiles,
    });

    event.target.value = '';
  };

  const labelText = (): string => {
    if (auto) return DEFAULT_LABELS.choose;
    if (hasFiles) {
      return files.length === 1
        ? files[0].name
        : DEFAULT_LABELS.fileChosen.replace('{0}', files.length.toString());
    }
    return DEFAULT_LABELS.noFileChosen;
  };

  return (
    <div className={styles.fileUploadBasicContainer}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`${styles.fileUploadMessage} ${msg.severity === 'error' ? 'bts-errorMessage' : ''}`}
        >
          {msg.text}
        </div>
      ))}

      <div className={styles.fileUploadBasicContent}>
        <Button
          onClick={() => fileInputRef.current?.click()}
          isDisabled={disabled}
          className={disabled ? styles.fileUploadButtonDisabled : ''}
        >
          {auto || !hasFiles ? DEFAULT_LABELS.choose : DEFAULT_LABELS.upload}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleSelect}
          aria-label={DEFAULT_LABELS.browseFiles}
          style={{ display: 'none' }}
        />

        {!auto && <span className={styles.fileUploadFileLabel}>{labelText()}</span>}
      </div>
    </div>
  );
};

export default BasicFileUpload;
