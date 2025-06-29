import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { StringInput } from '../../common/StringInput/StringInput.tsx';
import { Button } from '../../common/Button/Button.tsx';
import Dialog from '../../common/Dialog/Dialog.tsx';
import { useToast } from '../../common/Toast/ToastContext.tsx';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={open}
      onHide={onClose}
      onVisibleChange={(val: boolean) => {
        if (!val) onClose();
      }}
      header="Login"
      closable
      modal
      focusOnShow
      dismissableMask
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <StringInput
          value={email}
          onChange={setEmail}
          placeholder="Email"
          fullWidth
          type="text"
          required
        />
        <StringInput
          value={password}
          onChange={setPassword}
          placeholder="Password"
          fullWidth
          type="password"
          required
        />
        {error && <div style={{ color: 'red', fontSize: 14, marginTop: 4 }}>{error}</div>}
        <Button fullWidth isDisabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </Button>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
