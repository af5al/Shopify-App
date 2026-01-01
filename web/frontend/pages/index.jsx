import {
  Card,
  Page,
  Layout,
  TextContainer,
  Stack,
  Text,
  Button,
} from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Page narrowWidth>
      <TitleBar title={t('HomePage.title')} />

      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack vertical spacing="loose">
              <Text variant="headingXl" as="h1">
                👋 Hi, Welcome to Your Countdown Timer App
              </Text>

              <Text variant="bodyLg" as="p" color="subdued">
                Create powerful countdown timers for your product promotions
                and boost urgency to increase conversions.
              </Text>

              <Stack spacing="tight">
                <a href="/countdowntimer">
                  <Button primary>
                    Manage Countdown Timers
                  </Button>
                </a>
              </Stack>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}