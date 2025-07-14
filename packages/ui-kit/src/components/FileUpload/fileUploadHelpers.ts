export const DEFAULT_LABELS = {
  choose: 'Choose',
  upload: 'Upload',
  cancel: 'Cancel',
  browseFiles: 'Browse Files',
  pending: 'Pending',
  completed: 'Completed',
  noFileChosen: 'No file chosen',
  fileChosen: '{0} files chosen',
  fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB'],
};

export const DEFAULT_MESSAGES = {
  invalidFileSizeSummary: '{0}: Invalid file size, ',
  invalidFileSizeDetail: 'maximum upload size is {0}.',
  invalidFileTypeSummary: '{0}: Invalid file type, ',
  invalidFileTypeDetail: 'allowed file types: {0}.',
  invalidFileLimitDetail: 'limit is {0} at most.',
  invalidFileLimitSummary: 'Maximum number of files exceeded, ',
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return `0 ${DEFAULT_LABELS.fileSizeTypes[0]}`;
  const k = 1024;
  const dm = 3;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${formattedSize} ${DEFAULT_LABELS.fileSizeTypes[i]}`;
};

export const isImageFile = (file: File): boolean => {
  return /^image\//.test(file.type);
};

export const isAcceptableFileType = (file: File, accept: string): boolean => {
  if (!accept) return true;
  const types = accept.split(',').map((t) => t.trim().toLowerCase());

  return types.some((type) => {
    const isWildcard = type.includes('*');
    if (isWildcard) {
      return file.type.startsWith(type.replace('*', ''));
    }
    return file.type === type || file.name.toLowerCase().endsWith(type);
  });
};

export const validateFile = ({
  file,
  accept,
  maxFileSize,
}: {
  file: File;
  accept?: string;
  maxFileSize?: number;
}): { isValid: boolean; messages: { severity: 'error'; text: string }[] } => {
  const messages = [];
  let isValid = true;

  if (accept && !isAcceptableFileType(file, accept)) {
    const text = `${DEFAULT_MESSAGES.invalidFileTypeSummary.replace(
      '{0}',
      file.name
    )} ${DEFAULT_MESSAGES.invalidFileTypeDetail.replace('{0}', accept)}`;
    messages.push({ severity: 'error', text });
    isValid = false;
  }

  if (maxFileSize && file.size > maxFileSize) {
    const text = `${DEFAULT_MESSAGES.invalidFileSizeSummary.replace(
      '{0}',
      file.name
    )} ${DEFAULT_MESSAGES.invalidFileSizeDetail.replace('{0}', formatFileSize(maxFileSize))}`;
    messages.push({ severity: 'error', text });
    isValid = false;
  }

  return { isValid, messages };
};
