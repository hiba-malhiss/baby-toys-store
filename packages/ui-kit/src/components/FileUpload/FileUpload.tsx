import React, { useState, useCallback } from 'react';
import styles from './file-upload.module.scss';
import AdvancedFileUpload from './AdvancedFileUpload';
import BasicFileUpload from './BasicFileUpload';

interface FileUploadProps {
  name?: string;
  url?: string;
  method?: 'post' | 'put';
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  auto?: boolean;
  withCredentials?: boolean;
  maxFileSize?: number;
  className?: string;
  previewWidth?: number;
  mode?: 'advanced' | 'basic';
  headers?: Record<string, string>;
  customUpload?: boolean;
  fileLimit?: number;
  onBeforeUpload?: (event: { formData: FormData }) => void;
  onSend?: (event: { originalEvent: any; formData: FormData }) => void;
  onUpload?: (event: { originalEvent: any; files: File[] }) => void;
  onError?: (event: { files: File[]; error: Error }) => void;
  onClear?: (event: React.SyntheticEvent) => void;
  onRemove?: (event: { originalEvent: React.SyntheticEvent; file: File }) => void;
  onSelect?: (event: {
    originalEvent: React.SyntheticEvent;
    files: File[];
    currentFiles: File[];
  }) => void;
  onProgress?: (event: { originalEvent: any; progress: number }) => void;
  uploadHandler?: (event: { files: File[] }) => void;
  onImageError?: (event: React.SyntheticEvent) => void;
  onRemoveUploadedFile?: (event: { file: File; files: File[] }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name = 'file',
  method = 'post',
  mode = 'advanced',
  previewWidth = 50,
  ...props
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(() => {
    if (!files.length || !props.url) return;

    if (props.customUpload && props.uploadHandler) {
      props.uploadHandler({ files });
      if (props.fileLimit) setUploadedFileCount((prev) => prev + files.length);
      return;
    }

    setUploading(true);
    setMessages([]);
    const formData = new FormData();
    props.onBeforeUpload?.({ formData });
    files.forEach((file) => formData.append(name, file, file.name));

    const xhr = new XMLHttpRequest();
    xhr.open(method, props.url, true);
    if (props.headers) {
      Object.entries(props.headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    }
    xhr.withCredentials = !!props.withCredentials;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);
        props.onProgress?.({ originalEvent: e, progress: percent });
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        if (props.fileLimit) setUploadedFileCount((prev) => prev + files.length);
        props.onUpload?.({ originalEvent: xhr, files });
        setUploadedFiles((prev) => [...prev, ...files]);
        clearFiles();
      } else {
        props.onError?.({ files, error: new Error(xhr.statusText) });
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      props.onError?.({ files, error: new Error('Upload failed') });
    };

    xhr.send(formData);
    props.onSend?.({ originalEvent: xhr, formData });
  }, [files, props]);

  const clearFiles = () => {
    setFiles([]);
    setMessages([]);
    props.onClear?.(new Event('clear'));
  };

  return (
    <div className={`${styles.fileUpload} ${props.className || ''}`}>
      {mode === 'advanced' ? (
        <AdvancedFileUpload
          files={files}
          setFiles={setFiles}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          progress={progress}
          setProgress={setProgress}
          messages={messages}
          setMessages={setMessages}
          uploadedFileCount={uploadedFileCount}
          setUploadedFileCount={setUploadedFileCount}
          uploading={uploading}
          setUploading={setUploading}
          previewWidth={previewWidth}
          handleUpload={handleUpload}
          clearFiles={clearFiles}
          {...props}
        />
      ) : (
        <BasicFileUpload
          files={files}
          setFiles={setFiles}
          messages={messages}
          setMessages={setMessages}
          handleUpload={handleUpload}
          {...props}
        />
      )}
    </div>
  );
};

export default FileUpload;
