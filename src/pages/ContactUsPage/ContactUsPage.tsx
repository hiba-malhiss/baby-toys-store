import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import Card from '../../components/common/Card/Card';
import FieldWrapper from '../../components/common/FieldWrapper/FieldWrapper';
import { StringInput } from '../../components/common/StringInput/StringInput';
import { Button } from '../../components/common/Button/Button';
import { useToast } from '../../components/common/Toast/ToastContext';
import styles from './contact-us-page.module.scss';
import { mockSendContactMessage } from '../../mock-data/useMockProductsApi.ts';

const ContactUsPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.message) newErrors.message = 'Message is required';
    if (!form.phone) newErrors.message = 'Phone Number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    try {
      await mockSendContactMessage(form);
      toast.success('Thank you for reaching out!');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <PageContainer>
      <Card className={styles.contactUsPage} fullWidth header="Contact Us">
        <FieldWrapper label="Name" error={errors.name} fullWidth>
          <StringInput fullWidth value={form.name} onChange={(val) => handleInput('name', val)} />
        </FieldWrapper>
        <FieldWrapper label="Email" error={errors.email} fullWidth>
          <StringInput
            value={form.email}
            fullWidth
            onChange={(val) => handleInput('email', val)}
            type="email"
          />
        </FieldWrapper>
        <FieldWrapper label="Phone Number" error={errors.message} fullWidth>
          <StringInput
            value={form.phone}
            fullWidth
            onChange={(val) => handleInput('phone', val)}
            type="text"
          />
        </FieldWrapper>
        <FieldWrapper label="Message" error={errors.message} fullWidth>
          <StringInput
            value={form.message}
            fullWidth
            onChange={(val) => handleInput('message', val)}
            type="text"
          />
        </FieldWrapper>
        <Button onClick={handleSubmit} fullWidth isLoading={sending} aria-label="Send Message">
          Send Message
        </Button>
      </Card>
    </PageContainer>
  );
};

export default ContactUsPage;
