import React from 'react';
import Button from '../Button/Button';
import { useToast } from '../Toast/ToastContext';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { copyTextToClipboard } from '../../utils';

export interface CopyToClipboardButtonProps {
  value: string | number | undefined | null;
  successMessage?: string;
  errorMessage?: string;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  appearance?: 'ghost' | 'link' | 'outline' | 'primary' | 'secondary' | 'icon';
  stopPropagation?: boolean;
  withoutPadding?: boolean;
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
  withoutPadding,
}) => {
  const toast = useToast();

  return (
    <Button
      size={size as any}
      appearance={appearance as any}
      leftIcon={faCopy}
      aria-label={ariaLabel}
      withoutPadding={withoutPadding}
      iconColor="gray-dark"
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
