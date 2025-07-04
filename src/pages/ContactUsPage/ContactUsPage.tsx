import React, { useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import FieldWrapper from '../../components/common/FieldWrapper/FieldWrapper';
import { StringInput } from '../../components/common/StringInput/StringInput';
import { Button } from '../../components/common/Button/Button';
import Flex from '../../components/common/Flex/Flex';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './contact-us-page.module.scss';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/common/Toast/ToastContext.tsx';
import { mockSendContactMessage } from '../../mock-data/useMockProductsApi.ts';
import Heading from '../../components/common/Heading/Heading.tsx';
import InfoCard from '../../components/common/InfoCard/InfoCard.tsx';

const CONTACT_INFO = [
  {
    icon: faPhone,
    title: 'Phone',
    content: '+1 234 567 8900',
    appearance: 'primary',
  },
  {
    icon: faEnvelope,
    title: 'Email',
    content: 'support@toystore.com',
    appearance: 'primary',
  },
  {
    icon: faMapMarkerAlt,
    title: 'Address',
    content: '123 Toy Lane, Playtown, USA',
    appearance: 'primary',
  },
];

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
    if (!form.phone) newErrors.phone = 'Phone Number is required';
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
    <PageContainer header="Contact">
      <Flex spacing="xxl">
        {CONTACT_INFO.map((item) => (
          <InfoCard key={item.title} card={item} size="medium" />
        ))}
      </Flex>
      <div className={styles.contactUsPage}>
        <Heading level="h2">Contact us</Heading>
        <FieldWrapper label="Name" error={errors.name} fullWidth>
          <StringInput
            fullWidth
            value={form.name}
            onChange={(val) => handleInput('name', val)}
            placeholder="Enter your name"
          />
        </FieldWrapper>
        <FieldWrapper label="Email" error={errors.email} fullWidth>
          <StringInput
            fullWidth
            value={form.email}
            onChange={(val) => handleInput('email', val)}
            placeholder="Enter your email"
          />
        </FieldWrapper>
        <FieldWrapper label="Phone Number" error={errors.phone} fullWidth>
          <StringInput
            fullWidth
            value={form.phone}
            onChange={(val) => handleInput('phone', val)}
            placeholder="Enter your phone number"
          />
        </FieldWrapper>
        <FieldWrapper label="Message" error={errors.message} fullWidth>
          <StringInput
            fullWidth
            value={form.message}
            onChange={(val) => handleInput('message', val)}
            placeholder="Enter your message"
          />
        </FieldWrapper>
        <Button onClick={handleSubmit} isLoading={sending} aria-label="Send Message">
          Send Message
        </Button>
      </div>
    </PageContainer>
  );
};

export default ContactUsPage;
