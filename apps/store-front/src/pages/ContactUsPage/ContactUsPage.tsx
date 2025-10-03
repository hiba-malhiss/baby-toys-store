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
import { useTranslation } from 'react-i18next';

const ContactUsPage: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  });
  const { data: settings } = useStoreSettings();
  const sendMutation = useSendContactMessage();

  const toast = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const contactInfo = useMemo(() => {
    const contact = settings?.contact || {};
    const raw = [
      {
        id: 'phone',
        title: t('contact.phone'),
        content: contact.phone,
        icon: faPhone,
        appearance: 'primary',
      },
      {
        id: 'email',
        title: t('contact.email'),
        content: contact.email,
        icon: faEnvelope,
        appearance: 'primary',
      },
      {
        id: 'address',
        title: t('contact.address'),
        content: contact.address,
        icon: faMapMarkerAlt,
        appearance: 'primary',
      },
    ];
    return raw.filter((i) => i.content);
  }, [settings?.contact, t]);

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
          toast.success(t('contact.thankYou'));
          reset();
          navigate('/home');
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || t('contact.sendFailed')
          );
        },
      }
    );
  });

  return (
    <PageContainer header={t('contact.header')}>
      <div className={styles.contactUsPageCards}>
        {contactInfo.map((item) => (
          <InfoCard key={item.id} card={item} size="medium" fullWidth />
        ))}
      </div>
      <form className={styles.contactUsPage} onSubmit={onSubmit}>
        <Heading level="h2">{t('contact.title')}</Heading>
        <FormFieldWrapper control={control} name="name" label={t('contact.name')} required fullWidth>
          <StringInput fullWidth placeholder={t('contact.placeholder.name')} />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="subject" label={t('contact.subject')} required fullWidth>
          <StringInput fullWidth placeholder={t('contact.placeholder.subject')} />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="email" label={t('contact.email')} fullWidth>
          <StringInput fullWidth placeholder={t('contact.placeholder.email')} />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="phone" label={t('contact.phoneNumber')} fullWidth>
          <StringInput fullWidth placeholder={t('contact.placeholder.phone')} />
        </FormFieldWrapper>
        <FormFieldWrapper control={control} name="message" label={t('contact.message')} required fullWidth>
          <TextArea fullWidth placeholder={t('contact.placeholder.message')} />
        </FormFieldWrapper>
        <Button type="submit" isLoading={sendMutation.isPending} aria-label={t('contact.send')}>
          {t('contact.send')}
        </Button>
      </form>
    </PageContainer>
  );
};

export default ContactUsPage;
