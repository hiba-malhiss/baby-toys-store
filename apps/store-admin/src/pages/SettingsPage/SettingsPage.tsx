import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout/AdminLayout';
import { Heading, Card, StringInput, Button, Flex } from '@baby-toys/ui-kit/components';
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
      <Flex justify="between" className="bts-marginBxxl">
        <Heading>Settings</Heading>
        <Button onClick={handleSave}>Save Changes</Button>
      </Flex>
      <Flex direction="vertical" spacing="xxl">
        <Card header="Homepage Content">
          <StringInput
            label="Banner 1"
            value={homepageContent.banners[0]}
            onChange={(val) =>
              handleHomepageContentChange('banners', [
                val,
                homepageContent.banners[1],
                homepageContent.banners[2],
              ])
            }
          />
          <StringInput
            label="Banner 2"
            value={homepageContent.banners[1]}
            onChange={(val) =>
              handleHomepageContentChange('banners', [
                homepageContent.banners[0],
                val,
                homepageContent.banners[2],
              ])
            }
          />
          <StringInput
            label="Banner 3"
            value={homepageContent.banners[2]}
            onChange={(val) =>
              handleHomepageContentChange('banners', [
                homepageContent.banners[0],
                homepageContent.banners[1],
                val,
              ])
            }
          />
        </Card>
        <Card header="Currency Settings">
          <StringInput
            label="Currency"
            value={currencySettings.currency}
            onChange={(val) => handleCurrencySettingsChange('currency', val)}
          />
          <StringInput
            label="Symbol"
            value={currencySettings.symbol}
            onChange={(val) => handleCurrencySettingsChange('symbol', val)}
          />
        </Card>
        <Card header="Shipping Settings">
          <StringInput
            label="Cost"
            type="number"
            value={shippingSettings.cost}
            onChange={(val) => handleShippingSettingsChange('cost', Number(val))}
          />
          <StringInput
            label="Free Shipping Threshold"
            type="number"
            value={shippingSettings.freeThreshold}
            onChange={(val) => handleShippingSettingsChange('freeThreshold', Number(val))}
          />
          <StringInput
            label="Header Message"
            value={shippingSettings.headerMessage}
            onChange={(val) => handleShippingSettingsChange('headerMessage', val)}
          />
        </Card>
      </Flex>
    </AdminLayout>
  );
};

export default SettingsPage;
