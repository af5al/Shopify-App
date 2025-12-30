import {useEffect, useState, useCallback} from "react";
import {
  Page,
  Layout,
  Card,
  TextContainer,
  Text,
  DataTable,
  Spinner,
  Stack,
  Badge,
} from "@shopify/polaris";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

export default function CountdownTimerIndex() {
  const {t} = useTranslation();
  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const loadTimers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/timers");
      if (!res.ok) {
        throw new Error("Failed to load timers");
      }
      const result = await res.json();
      setTimers(result?.data || []);
    } catch (error) {
      console.error("Error loading timers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimers();
  }, [loadTimers]);

  const rows = timers.map((timer) => {
    const typeLabel = timer.type === "fixed" ? "Fixed" : "Evergreen";

    const targetingType = timer.targeting?.type || "all";
    let targetingLabel = "All products";
    if (targetingType === "products") {
      targetingLabel = `Products (${timer.targeting?.productIds?.length || 0})`;
    } else if (targetingType === "collections") {
      targetingLabel = `Collections(${timer.targeting?.collectionIds?.length || 0})`;
    }

    const schedule =
      timer.type === "fixed"
        ? `${timer.startAt ? new Date(timer.startAt).toLocaleString() : "-"} → ${
            timer.endAt ? new Date(timer.endAt).toLocaleString() : "-"
          }`
        : timer.durationSeconds
        ? `${timer.durationSeconds}s`
        : "-";

    return [
      timer.name || "-",
      <Badge key={`${timer._id}-type`} tone="info">
        {typeLabel}
      </Badge>,
      targetingLabel,
      schedule,
      timer.impressions ?? 0,
    ];
  });

  return (
    <Page
      title={t("CountdownTimerPage.CountDownTimersListTitle")}
      primaryAction={{
        content: t("CountdownTimerPage.createAction", "Create timer"),
        onAction: () => {
          navigate("/countdowntimer/create");
        },
      }}
      narrowWidth
    >
      <TitleBar title={t("CountdownTimerPage.title", "Countdown timers")} />

      <Layout>
        <Layout.Section>
          {/* filters */}
        </Layout.Section>

        <Layout.Section>
          <Card>
            {loading ? (
              <div style={{padding: "1rem"}}>
                <Stack align="center" blockAlign="center">
                  <Spinner
                    accessibilityLabel="Loading countdown timers"
                    size="small"
                  />
                </Stack>
              </div>
            ) : timers.length === 0 ? (
              <div style={{padding: "1rem"}}>
                <Text as="p" variant="bodyMd">
                  {t(
                    "CountdownTimerPage.emptyState",
                    "No Timers found"
                  )}
                </Text>
                {/* <Button
                  primary
                  onClick={() => {
                    alert("Create timer form not implemented yet");
                  }}
                >
                  {t(
                    "CountdownTimerPage.createFirst",
                    "Create your first timer"
                  )}
                </Button> */}
              </div>
            ) : (
              <DataTable
                columnContentTypes={[
                  "text",   // Name
                  "text",   // Type
                  "text",   // Targeting
                  "text",   // Schedule
                  "numeric" // Impressions
                ]}
                headings={[
                  t("CountdownTimerPage.columns.name", "Name"),
                  t("CountdownTimerPage.columns.type", "Type"),
                  t("CountdownTimerPage.columns.targeting", "Targeting"),
                  t("CountdownTimerPage.columns.schedule", "Schedule"),
                  t("CountdownTimerPage.columns.impressions", "Impressions"),
                ]}
                rows={rows}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}