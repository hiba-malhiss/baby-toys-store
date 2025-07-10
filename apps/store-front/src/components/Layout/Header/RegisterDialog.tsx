import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Dialog,
  StringInput,
  Button,
  useToast,
  Flex,
  FieldWrapper,
} from '@baby-toys/ui-kit/components';
import { isValidPassword, isValidEmail } from '@baby-toys/ui-kit/utils';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onClose }) => {
  const { register } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setEmailError('');
    setPasswordError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    try {
      await register(email, password);
      handleClose();
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={open}
      onHide={handleClose}
      onVisibleChange={(val: boolean) => {
        if (!val) handleClose();
      }}
      header="Register"
      closable
      modal
      focusOnShow
      dismissableMask
    >
      <Flex direction="vertical" spacing="m" fullWidth>
        <FieldWrapper label="Email" error={emailError} fullWidth required>
          <StringInput
            value={email}
            onChange={(val) => {
              setEmail(val);
              setEmailError('');
            }}
            placeholder="Email"
            fullWidth
            type="text"
          />
        </FieldWrapper>

        <FieldWrapper label="Password" error={passwordError} fullWidth required>
          <StringInput
            value={password}
            onChange={(val) => {
              setPassword(val);
              setPasswordError('');
            }}
            placeholder="Password"
            fullWidth
            type="password"
          />
        </FieldWrapper>

        {error && <div className="bts-errorMessage">{error}</div>}

        <Button fullWidth isDisabled={loading} onClick={handleSubmit}>
          {loading ? 'Registering…' : 'Register'}
        </Button>
      </Flex>
    </Dialog>
  );
};

export default RegisterDialog;
