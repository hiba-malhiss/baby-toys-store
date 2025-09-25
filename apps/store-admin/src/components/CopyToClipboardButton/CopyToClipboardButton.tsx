import React from 'react';
import { Button, useToast } from '@baby-toys/ui-kit';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { copyTextToClipboard } from '@baby-toys/ui-kit/utils';

export interface CopyToClipboardButtonProps {
  value: string | number | undefined | null;
  successMessage?: string;
  errorMessage?: string;
  size?: 'small' | 'medium' | 'large';
  appearance?: 'ghost' | 'link' | 'outline' | 'primary' | 'secondary' | 'icon';
  stopPropagation?: boolean;
  ariaLabel?: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  value,
  successMessage = 'Copied',
  errorMessage = 'Failed to copy',
  size = 'xsmall',
  appearance = 'ghost',
  stopPropagation = true,
  ariaLabel = 'Copy to clipboard',
}) => {
  const toast = useToast();

  return (
    <Button
      size={size}
      appearance={appearance as any}
      leftIcon={faCopy}
      aria-label={ariaLabel}
      onClick={async (e) => {
        if (stopPropagation) e.stopPropagation();
        if (value == null) return;
        try {
          await copyTextToClipboard(String(value));
          toast.success(successMessage);
        } catch {
          toast.error(errorMessage);
        }
      }}
    />
  );
};

export default CopyToClipboardButton;
