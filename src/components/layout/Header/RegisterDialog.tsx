import React, { useState } from 'react';
import Dialog from '../../common/Dialog/Dialog.tsx';
import { StringInput } from '../../common/StringInput/StringInput.tsx';
import { Button } from '../../common/Button/Button.tsx';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onRegister: (user: { email: string }) => void;
}

const mockRegisterApi = async (email: string, password: string) => {
  await new Promise((res) => setTimeout(res, 500));
  if (email && password) return { email, token: 'mock-token' };
  throw new Error('Registration failed');
};

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onClose, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await mockRegisterApi(email, password);
      onRegister(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
      header="Register"
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
          {loading ? 'Registering…' : 'Register'}
        </Button>
      </form>
    </Dialog>
  );
};

export default RegisterDialog;
