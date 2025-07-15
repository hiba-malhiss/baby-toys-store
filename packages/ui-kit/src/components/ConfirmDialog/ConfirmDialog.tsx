import React from 'react';
import { Button, Dialog } from '../index';
import styles from './confirm-dialog.module.scss';

type ConfirmDialogProps = {
  visible: boolean;
  message?: string;
  header?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  visible,
  header = 'Confirmation',
  message = 'Are you sure?',
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      visible={visible}
      header={header}
      closable={false}
      dismissibleMask={true}
      onVisibleChange={() => onCancel()}
      modal
    >
      <div>{message}</div>
      <div className={styles.confirmDialogActions}>
        <Button onClick={onCancel} color="secondary-light">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} color="secondary-light">
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
