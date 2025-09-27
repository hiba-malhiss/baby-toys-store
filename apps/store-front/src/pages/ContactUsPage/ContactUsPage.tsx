import React, { useMemo } from 'react';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './contact-us-page.module.scss';
import { useNavigate } from 'react-router-dom';
import { TextArea, InfoCard, Heading, Button, StringInput, useToast } from '@baby-toys/ui-kit';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer.tsx';
import { useStoreSettings } from '../../api/settingsApi';
import { useSendContactMessage } from '../../api/contactApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldWrapper from '../../components/FormFieldWrapper/FormFieldWrapper';
import { contactSchema, type ContactFormValues } from './contact-us.helper';

const ContactUsPage: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });
  const { data: settings } = useStoreSettings();
  const sendMutation = useSendContactMessage();

  const toast = useToast();
  const navigate = useNavigate();
  const contactInfo = useMemo(() => {
    const contact = settings?.contact || {};
    const raw = [
      {
        id: 'phone',
        title: 'Phone',
        content: contact.phone,
        icon: faPhone,
        appearance: 'primary',
      },
      {
        id: 'email',
        title: 'Email',
        content: contact.email,
        icon: faEnvelope,
        appearance: 'primary',
      },
      {
        id: 'address',
        title: 'Address',
        content: contact.address,
        icon: faMapMarkerAlt,
        appearance: 'primary',
      },
    ];
    return raw.filter((i) => i.content);
  }, [settings?.contact]);

  const onSubmit = handleSubmit(async (values) => {
    sendMutation.mutate(
      {
        name: values.name,
        email: values.email || undefined,
        phoneNumber: values.phone || undefined,
        subject: values.subject,
        message: values.message,
      },
      {
        onSuccess: () => {
          toast.success('Thank you for reaching out!');
          reset();
          navigate('/home');
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || 'Failed to send message. Please try again later.'
          );
        },
      }
    );
  });

  return (
    <PageContainer header="Contact">
      <div className={styles.contactUsPageCards}>
        {contactInfo.map((item) => (
          <InfoCard key={item.id} card={item} size="medium" fullWidth />
        ))}
      </div>
      <form className={styles.contactUsPage} onSubmit={onSubmit}>
        <Heading level="h2">Contact us</Heading>
        <FormFieldWrapper control={control} name="name" label="Name" required fullWidth>
          <StringInput fullWidth placeholder="Enter your name" />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="subject" label="Subject" required fullWidth>
          <StringInput fullWidth placeholder="Enter subject" />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="email" label="Email" fullWidth>
          <StringInput fullWidth placeholder="Enter your email" />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="phone" label="Phone Number" fullWidth>
          <StringInput fullWidth placeholder="Enter your phone number" />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="message" label="Message" required fullWidth>
          <TextArea fullWidth placeholder="Enter your message" />
        </FormFieldWrapper>
        <Button type="submit" isLoading={sendMutation.isPending} aria-label="Send Message">
          Send Message
        </Button>
      </form>
    </PageContainer>
  );
};

export default ContactUsPage;
