import { useEffect, useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Select,
  Button,
  FormLayout,
  Frame,
  Banner,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function CountdownTimerForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  console.log('id', id);
  const isEdit = Boolean(id);
 
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("fixed");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#A3E635");
  const [timerSize, setTimerSize] = useState("medium");
  const [timerPosition, setTimerPosition] = useState("top");
  const [urgencyType, setUrgencyType] = useState("pulse");
  const [targetingType, setTargetingType] = useState("all");
  const [productIds, setProductIds] = useState("");
  const [collectionIds, setCollectionIds] = useState("");

  const [initialState, setInitialState] = useState(null);

  const captureInitialState = useCallback((data) => {
    setInitialState(data);
  }, []);

  const loadTimer = useCallback(async () => {
    if (!isEdit) {
      captureInitialState({
        name,
        type,
        startAt,
        endAt,
        durationSeconds,
        description,
        backgroundColor,
        timerSize,
        timerPosition,
        urgencyType,
        targetingType,
        productIds,
        collectionIds,
      });
      return;
    }

    console.log('isedit', isEdit);
    try {
      setLoading(true);
      const res = await fetch(
        `/api/v1/timers/${id}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        },
      );
      if (!res.ok) throw new Error("Failed to load timer");

      const timer = await res.json();

      const data = {
        name: timer.name || "",
        type: timer.type || "fixed",
        startAt: timer.startAt ? timer.startAt.slice(0, 16) : "",
        endAt: timer.endAt ? timer.endAt.slice(0, 16) : "",
        durationSeconds:
          timer.durationSeconds != null
            ? String(timer.durationSeconds)
            : "",
        description: timer.description || "",
        backgroundColor: timer.appearance?.backgroundColor || "#A3E635",
        timerSize: timer.appearance?.size || "medium",
        timerPosition: timer.appearance?.position || "top",
        urgencyType: timer.urgency?.type || "pulse",
        targetingType: timer.targeting?.type || "all",
        productIds: (timer.targeting?.productIds || []).join(", "),
        collectionIds: (timer.targeting?.collectionIds || []).join(", "),
      };

      setName(data.name);
      setType(data.type);
      setStartAt(data.startAt);
      setEndAt(data.endAt);
      setDurationSeconds(data.durationSeconds);
      setDescription(data.description);
      setBackgroundColor(data.backgroundColor);
      setTimerSize(data.timerSize);
      setTimerPosition(data.timerPosition);
      setUrgencyType(data.urgencyType);
      setTargetingType(data.targetingType);
      setProductIds(data.productIds);
      setCollectionIds(data.collectionIds);

      captureInitialState(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, isEdit, captureInitialState]);

  useEffect(() => {
    loadTimer();
  }, [loadTimer]);

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    const payload = {
      name,
      type,
      startAt: type === "fixed" ? startAt : null,
      endAt: type === "fixed" ? endAt : null,
      durationSeconds:
        type === "evergreen" ? Number(durationSeconds) : null,

      description,

      appearance: {
        backgroundColor,
        size: timerSize,
        position: timerPosition,
      },

      urgency: {
        type: urgencyType,
      },

      targeting: {
        type: targetingType,
        productIds:
          targetingType === "products"
            ? productIds.split(",").map((s) => s.trim())
            : [],
        collectionIds:
          targetingType === "collections"
            ? collectionIds.split(",").map((s) => s.trim())
            : [],
      },
    };

    try {
      const res = await fetch(
        isEdit ? `/api/v1/timers/${id}` : "/api/v1/timers",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save timer");

      navigate("/countdowntimer");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

const handleReset = () => {
    if (!initialState) return;
    Object.entries(initialState).forEach(([key, value]) => {
    const setters = {
        name: setName,
        type: setType,
        startAt: setStartAt,
        endAt: setEndAt,
        durationSeconds: setDurationSeconds,
        description: setDescription,
        backgroundColor: setBackgroundColor,
        timerSize: setTimerSize,
        timerPosition: setTimerPosition,
        urgencyType: setUrgencyType,
        targetingType: setTargetingType,
        productIds: setProductIds,
        collectionIds: setCollectionIds,
    };
    setters[key]?.(value);
    });
  };

  const title = isEdit ? "Edit countdown timer" : "Create countdown timer";

  return (
    <Frame>
      <Page
        title={t("CountdownTimerPage.heading")}
        backAction={{ onAction: () => navigate("/countdowntimer") }}
        primaryAction={{
          content: isEdit ? "Save timer" : "Create timer",
          onAction: handleSubmit,
          loading: saving,
        }}
        narrowWidth
      >
        <TitleBar title={title} />

        <Layout>
          {error && (
            <Layout.Section>
              <Banner status="critical" onDismiss={() => setError("")}>
                <p>{error}</p>
              </Banner>
            </Layout.Section>
          )}

          {/* BASIC INFO */}
          <Layout.Section>
            <Card title="Create New Timer" sectioned>
              <FormLayout>
                <TextField
                  label="Timer name"
                  value={name}
                  onChange={setName}
                  requiredIndicator
                />

                {type === "fixed" ? (
                  <FormLayout.Group>
                    <TextField
                      label="Start date & time"
                      type="datetime-local"
                      value={startAt}
                      onChange={setStartAt}
                    />
                    <TextField
                      label="End date & time"
                      type="datetime-local"
                      value={endAt}
                      onChange={setEndAt}
                    />
                  </FormLayout.Group>
                ) : (
                  <TextField
                    label="Duration (seconds)"
                    type="number"
                    value={durationSeconds}
                    onChange={setDurationSeconds}
                  />
                )}

                <TextField
                  label="Promotion description"
                  value={description}
                  onChange={setDescription}
                  multiline={4}
                />
              </FormLayout>
            </Card>
          </Layout.Section>

          {/* APPEARANCE */}
          <Layout.Section>
            <Card title="Appearance" sectioned>
              <FormLayout>
                <TextField
                  label="Background color"
                  type="color"
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                />

                <FormLayout.Group>
                  <Select
                    label="Timer size"
                    options={[
                      { label: "Small", value: "small" },
                      { label: "Medium", value: "medium" },
                      { label: "Large", value: "large" },
                    ]}
                    value={timerSize}
                    onChange={setTimerSize}
                  />

                  <Select
                    label="Timer position"
                    options={[
                      { label: "Top", value: "top" },
                      { label: "Below title", value: "below_title" },
                      { label: "Below price", value: "below_price" },
                    ]}
                    value={timerPosition}
                    onChange={setTimerPosition}
                  />
                </FormLayout.Group>
              </FormLayout>
            </Card>
          </Layout.Section>

          {/* URGENCY */}
          <Layout.Section>
            <Card title="Urgency notification" sectioned>
              <Select
                label="Urgency animation"
                options={[
                  { label: "None", value: "none" },
                  { label: "Color pulse", value: "pulse" },
                  { label: "Shake", value: "shake" },
                ]}
                value={urgencyType}
                onChange={setUrgencyType}
              />
            </Card>
          </Layout.Section>

          {/* TARGETING */}
          <Layout.Section>
            <Card title="Targeting" sectioned>
              <FormLayout>
                <Select
                  label="Targeting type"
                  options={[
                    { label: "All products", value: "all" },
                    { label: "Specific products", value: "products" },
                    { label: "Specific collections", value: "collections" },
                  ]}
                  value={targetingType}
                  onChange={setTargetingType}
                />

                {targetingType === "products" && (
                  <TextField
                    label="Product IDs"
                    value={productIds}
                    onChange={setProductIds}
                    helpText="Comma-separated Shopify product IDs"
                  />
                )}

                {targetingType === "collections" && (
                  <TextField
                    label="Collection IDs"
                    value={collectionIds}
                    onChange={setCollectionIds}
                    helpText="Comma-separated Shopify collection IDs"
                  />
                )}

                <Button onClick={handleReset} disabled={!initialState}>
                  Reset
                </Button>
              </FormLayout>
            </Card>
          </Layout.Section>

          {loading && (
            <Layout.Section>
              <Text as="p">Loading…</Text>
            </Layout.Section>
          )}
        </Layout>
      </Page>
    </Frame>
  );
}