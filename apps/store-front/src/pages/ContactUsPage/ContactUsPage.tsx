import React, { useState, useEffect } from 'react';
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import styles from './contact-us-page.module.scss';
import { useNavigate } from 'react-router-dom';
import {
  mockFetchContactInfo,
  mockSendContactMessage,
} from '../../mock-data/useMockProductsApi.ts';
import {
  Flex,
  TextArea,
  InfoCard,
  Heading,
  Button,
  StringInput,
  FieldWrapper,
  useToast,
} from '@baby-toys/ui-kit/components';
import { PageContainer } from '../../components/PageContainer/PageContainer.tsx';

// Mapping config by ID
const contactInfoConfig: Record<string, { icon: any; appearance: string }> = {
  'work-days': {
    icon: faCalendarAlt,
    appearance: 'secondary',
  },
  'work-times': {
    icon: faClock,
    appearance: 'secondary',
  },
  phone: {
    icon: faPhone,
    appearance: 'primary',
  },
  email: {
    icon: faEnvelope,
    appearance: 'primary',
  },
  address: {
    icon: faMapMarkerAlt,
    appearance: 'primary',
  },
};

const ContactUsPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState<any[]>([]);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    mockFetchContactInfo().then((data) => {
      const enriched = data.map((item) => {
        const config = contactInfoConfig[item.id] || {};
        return {
          ...item,
          icon: config.icon,
          appearance: config.appearance,
        };
      });
      setContactInfo(enriched);
    });
  }, []);

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
      <Flex spacing="xxl" fullWidth>
        {contactInfo.map((item) => (
          <InfoCard key={item.id} card={item} size="medium" fullWidth />
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
          <TextArea
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
