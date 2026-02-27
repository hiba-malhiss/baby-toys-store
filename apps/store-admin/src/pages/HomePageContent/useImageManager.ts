import { useState } from 'react';
import { useToast } from '@baby-toys/ui-kit';
import { useUploadGalleryImage, useDeleteGalleryImage } from '../../api/homePageApi';

export function useImageManager(initialUrls?: string[], opts?: { multiple?: boolean }) {
  const toast = useToast();
  const upload = useUploadGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  const [existingUrls, setExistingUrls] = useState<string[]>(initialUrls || []); // always array
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const [latest, setLatest] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const multiple = opts?.multiple !== undefined ? opts.multiple : true;

  const handleChange = (files: (File | string)[]) => {
    const incomingFiles = files.filter((f): f is File => f instanceof File);
    const incomingUrls = files.filter((f): f is string => typeof f === 'string');

    // Any URL previously present but not in the new set should be queued for deletion
    const toRemove = existingUrls.filter((u) => !incomingUrls.includes(u));
    if (toRemove.length) setRemovedUrls((prev) => [...prev, ...toRemove]);

    if (!multiple) {
      // Single-image mode: keep only one item (prefer a newly selected file)
      if (incomingFiles.length) {
        setNewFiles([incomingFiles[incomingFiles.length - 1]]);
        setExistingUrls([]);
      } else if (incomingUrls.length) {
        setNewFiles([]);
        setExistingUrls([incomingUrls[incomingUrls.length - 1]]);
      } else {
        setNewFiles([]);
        setExistingUrls([]);
      }
      return;
    }

    // Multiple mode (gallery)
    setNewFiles(incomingFiles);
    setExistingUrls(incomingUrls);
  };

  const handleRemove = (urlOrFile: string | File) => {
    if (typeof urlOrFile === 'string') {
      setRemovedUrls((prev) => [...prev, urlOrFile]);
      setExistingUrls((prev) => prev.filter((u) => u !== urlOrFile));
    } else {
      setNewFiles((prev) => prev.filter((f) => f !== urlOrFile));
    }
  };

  const commit = async () => {
    if (!newFiles.length && !removedUrls.length) return existingUrls;

    setIsProcessing(true);
    try {
      // 1) Delete removed URLs first
      if (removedUrls.length) {
        await Promise.all(removedUrls.map((url) => deleteMutation.mutateAsync(url)));
      }

      // 2) Then upload newly staged files
      const uploadedUrls = newFiles.length
        ? await Promise.all(newFiles.map((file) => upload.mutateAsync(file)))
        : [];

      const finalUrls = [...existingUrls, ...uploadedUrls];

      setExistingUrls(finalUrls);
      setRemovedUrls([]);
      setNewFiles([]);
      setLatest(uploadedUrls[uploadedUrls.length - 1]);

      return finalUrls;
    } catch {
      toast.error('Failed to commit image changes');
      return existingUrls;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteIfReplaced = async (oldUrl: string | undefined, newUrl: string | undefined) => {
    if (!oldUrl || !newUrl) return;
    if (oldUrl !== newUrl) {
      try {
        await deleteMutation.mutateAsync(oldUrl);
      } catch {
        toast.error('Failed to delete old image');
      }
    }
  };

  const seed = (urls?: string[]) => {
    const arr = urls || [];
    setExistingUrls(multiple ? arr : arr.length ? [arr[arr.length - 1]] : []);
    setNewFiles([]);
    setRemovedUrls([]);
    setLatest(urls?.[urls.length - 1]);
  };

  const uploaderProps = {
    images: multiple
      ? [...(existingUrls || []), ...newFiles]
      : newFiles.length
        ? [newFiles[newFiles.length - 1]]
        : existingUrls && existingUrls.length
          ? [existingUrls[existingUrls.length - 1]]
          : [],
    multiple,
    onImagesChange: handleChange,
    onBackendDelete: handleRemove,
  };

  return {
    existingUrls,
    newFiles,
    removedUrls,
    latest,
    isProcessing,
    handleChange,
    handleRemove,
    commit,
    deleteIfReplaced,
    seed,
    uploaderProps,
  };
}
