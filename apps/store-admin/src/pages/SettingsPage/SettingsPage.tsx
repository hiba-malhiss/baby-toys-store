import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import {
  Heading,
  Card,
  StringInput,
  Button,
  Flex,
  FieldWrapper,
  ImageUploader,
  TextArea,
  Icon,
} from '@baby-toys/ui-kit';
import { useMockAdminApi } from '@mock-data/useMockApi';

const SettingsPage: React.FC = () => {
  const {
    getHomepageContent,
    updateHomepageContent,
    getCurrencySettings,
    updateCurrencySettings,
    getShippingSettings,
    updateShippingSettings,
  } = useMockAdminApi();

  const [homepageContent, setHomepageContent] = useState<any>({});
  const [currencySettings, setCurrencySettings] = useState<any>({});
  const [shippingSettings, setShippingSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getHomepageContent(), getCurrencySettings(), getShippingSettings()]).then(
      ([homepage, currency, shipping]) => {
        setHomepageContent(homepage);
        setCurrencySettings(currency);
        setShippingSettings(shipping);
        setLoading(false);
      }
    );
  }, [getHomepageContent, getCurrencySettings, getShippingSettings]);

  const handleHomepageContentChange = (field: string, value: any) => {
    setHomepageContent({ ...homepageContent, [field]: value });
  };

  const handleCurrencySettingsChange = (field: string, value: any) => {
    setCurrencySettings({ ...currencySettings, [field]: value });
  };

  const handleShippingSettingsChange = (field: string, value: any) => {
    setShippingSettings({ ...shippingSettings, [field]: value });
  };

  const handleSave = () => {
    updateHomepageContent(homepageContent);
    updateCurrencySettings(currencySettings);
    updateShippingSettings(shippingSettings);
  };

  if (loading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  return (
    <AdminLayout>
      <Flex justify="between" className="bts-marginBm">
        <Heading>Settings</Heading>
        <Button onClick={handleSave}>Save Changes</Button>
      </Flex>
      <Flex direction="vertical" spacing="xxl">
        <Card header="Homepage Content" fullWidth>
          <Flex spacing="xxl" fullWidth>
            <Flex direction="column" spacing="m" className="bts-marginBxxl">
              <Heading level="h3" className="bts-marginBm">
                Info Cards
              </Heading>
              {homepageContent.infoCards?.map((card: any, index: number) => (
                <React.Fragment key={index}>
                  <FieldWrapper
                    label={
                      <>
                        Title <Icon icon={card.icon} />
                      </>
                    }
                    className="bts-marginBm"
                  >
                    <StringInput
                      value={card.title}
                      onChange={(val) => {
                        const newCards = [...homepageContent.infoCards];
                        newCards[index] = { ...card, title: val };
                        handleHomepageContentChange('infoCards', newCards);
                      }}
                    />
                  </FieldWrapper>
                  <FieldWrapper label="Content">
                    <TextArea
                      value={card.content}
                      onChange={(val) => {
                        const newCards = [...homepageContent.infoCards];
                        newCards[index] = { ...card, content: val };
                        handleHomepageContentChange('infoCards', newCards);
                      }}
                    />
                  </FieldWrapper>
                </React.Fragment>
              ))}
            </Flex>
            <Flex direction="vertical" spacing="m" className="bts-marginBxxl">
              <Heading level="h3" className="bts-marginBm">
                Banners
              </Heading>
              {homepageContent.banners?.map((banner: string, index: number) => (
                <FieldWrapper key={index} label={`Banner ${index + 1}`}>
                  <TextArea
                    value={banner}
                    onChange={(val) => {
                      const newBanners = [...homepageContent.banners];
                      newBanners[index] = val;
                      handleHomepageContentChange('banners', newBanners);
                    }}
                  />
                </FieldWrapper>
              ))}
            </Flex>

            <Flex direction="column" spacing="m">
              <Heading level="h3" className="bts-marginBm">
                Photo Shoots
              </Heading>
              <ImageUploader
                existingImages={homepageContent.photoShoots || []}
                onImagesChange={(files) => handleHomepageContentChange('photoShoots', files)}
                multiple={true}
              />
            </Flex>
          </Flex>
        </Card>
        <Flex spacing="xxl" fullWidth align="stretch">
          <Card header="Shipping Settings" fullWidth>
            <FieldWrapper label="Cost" className="bts-marginBxxl">
              <StringInput
                type="number"
                value={shippingSettings.cost}
                onChange={(val) => handleShippingSettingsChange('cost', Number(val))}
              />
            </FieldWrapper>
            <FieldWrapper label="Free Shipping Threshold" className="bts-marginBxxl">
              <StringInput
                type="number"
                value={shippingSettings.freeThreshold}
                onChange={(val) => handleShippingSettingsChange('freeThreshold', Number(val))}
              />
            </FieldWrapper>
            <FieldWrapper label="Header Message">
              <StringInput
                value={shippingSettings.headerMessage}
                onChange={(val) => handleShippingSettingsChange('headerMessage', val)}
              />
            </FieldWrapper>
          </Card>
          <Card header="Currency Settings" fullWidth>
            <FieldWrapper label="Currency" className="bts-marginBxxl">
              <StringInput
                value={currencySettings.currency}
                onChange={(val) => handleCurrencySettingsChange('currency', val)}
              />
            </FieldWrapper>
            <FieldWrapper label="Symbol">
              <StringInput
                value={currencySettings.symbol}
                onChange={(val) => handleCurrencySettingsChange('symbol', val)}
              />
            </FieldWrapper>
          </Card>
        </Flex>
      </Flex>
    </AdminLayout>
  );
};

export default SettingsPage;
