import React, { useState } from 'react';
import { mockLoginApi } from '../../../mock-data/useMockProductsApi.ts';
import { StringInput } from '../../common/StringInput/StringInput.tsx';
import { Button } from '../../common/Button/Button.tsx';
import Dialog from '../../common/Dialog/Dialog.tsx';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: (user: { email: string }) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await mockLoginApi(email, password);
      onLogin(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={open}
      onHide={onClose}
      onVisibleChange={(val) => {
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
