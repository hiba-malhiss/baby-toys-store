import React from 'react';
import Button from '../Button/Button';
import { useToast } from '../Toast/ToastContext';
import { Copy } from 'lucide-react';
import { copyTextToClipboard } from '../../utils';
import { IconColor } from '../Icon/icon.constant.ts';

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
      leftIconComp={Copy}
      aria-label={ariaLabel}
      withoutPadding={withoutPadding}
      iconColor={IconColor.grayDark}
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
