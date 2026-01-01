import { useEffect, useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Text,
  DataTable,
  Spinner,
  Stack,
  Badge,
  Button,
} from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TitleBar } from "@shopify/app-bridge-react";

export default function CountdownTimerIndex() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTimers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/timers");
      if (!res.ok) throw new Error("Failed to load timers");
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this timer?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/v1/timers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      loadTimers();
    } catch (error) {
      console.error("Error deleting timer:", error);
    }
  };

  const rows = timers.map((timer) => {
    const typeLabel = timer.type === "fixed" ? "Fixed" : "Evergreen";

    const targetingType = timer.targeting?.type || "all";
    let targetingLabel = "All products";
    if (targetingType === "products") {
      targetingLabel = `Products (${timer.targeting?.productIds?.length || 0})`;
    } else if (targetingType === "collections") {
      targetingLabel = `Collections (${timer.targeting?.collectionIds?.length || 0})`;
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

      <Stack gap="200" key={`${timer._id}-actions`}>
        <Button
          size="slim"
          onClick={() => navigate(`/countdowntimer/form`, { state: { id: timer._id } })}
        >
          Edit
        </Button>
        <Button
          size="slim"
          tone="critical"
          onClick={() => handleDelete(timer._id)}
        >
          Delete
        </Button>
      </Stack>,
    ];
  });

  return (
    <Page
      title={t("CountdownTimerPage.title", "Countdown timers")}
      primaryAction={{
        content: t("CountdownTimerPage.createAction", "Create timer"),
        onAction: () => navigate("/countdowntimer/form"),
      }}
    >
      <TitleBar title={t("CountdownTimerPage.title", "Countdown timers")} />

      <Layout>
        <Layout.Section>
          <Card>
            {loading ? (
              <div style={{ padding: "1rem" }}>
                <Stack align="center" blockAlign="center">
                  <Spinner
                    accessibilityLabel="Loading countdown timers"
                    size="small"
                  />
                </Stack>
              </div>
            ) : timers.length === 0 ? (
              <div style={{ padding: "1rem" }}>
                <Text as="p" variant="bodyMd">
                  {t("CountdownTimerPage.emptyState", "No timers found")}
                </Text>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <DataTable
                  columnContentTypes={[
                    "text",    // Name
                    "text",    // Type
                    "text",    // Targeting
                    "text",    // Schedule
                    "numeric", // Impressions
                    "text",    // Actions
                  ]}
                  headings={[
                    t("CountdownTimerPage.columns.name", "Name"),
                    t("CountdownTimerPage.columns.type", "Type"),
                    t("CountdownTimerPage.columns.targeting", "Targeting"),
                    t("CountdownTimerPage.columns.schedule", "Schedule"),
                    t("CountdownTimerPage.columns.impressions", "Impressions"),
                    "Actions",
                  ]}
                  rows={rows}
                />
              </div>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}