import mongoose from "mongoose";

const TimerSchema = new mongoose.Schema(
  {
    /* ===============================
       MULTI-TENANT (SHOPIFY STORE)
    =============================== */
    shop: {
      type: String, // example: example-store.myshopify.com
      required: true,
      index: true,
    },

    /* ===============================
       BASIC INFO
    =============================== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["fixed", "evergreen"],
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "active", "expired"],
      default: "scheduled",
      index: true,
    },

    /* ===============================
       TIME CONFIG
    =============================== */
    // Fixed timer
    startAt: {
      type: Date,
    },

    endAt: {
      type: Date,
    },

    // Evergreen timer (seconds)
    durationSeconds: {
      type: Number,
      min: 1,
    },

    /* ===============================
       TARGETING
    =============================== */
    targeting: {
      type: {
        type: String,
        enum: ["all", "products", "collections"],
        default: "all",
      },

      productIds: {
        type: [String], // Shopify product IDs
        default: [],
      },

      collectionIds: {
        type: [String], // Shopify collection IDs
        default: [],
      },
    },

    /* ===============================
       APPEARANCE
    =============================== */
    appearance: {
      backgroundColor: {
        type: String,
        default: "#A3E635",
      },

      size: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium",
      },

      position: {
        type: String,
        enum: ["top", "below_title", "below_price"],
        default: "top",
      },
    },

    /* ===============================
       URGENCY
    =============================== */
    urgency: {
      type: {
        type: String,
        enum: ["none", "pulse", "shake"],
        default: "pulse",
      },

      showWarningAtSeconds: {
        type: Number,
        default: 600, // last 10 minutes
      },
    },

    /* ===============================
       ANALYTICS
    =============================== */
    impressions: {
      type: Number,
      default: 0,
    },

    /* ===============================
       SOFT DELETE
    =============================== */
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ===============================
   INDEXES (PERFORMANCE)
=============================== */
TimerSchema.index({ shop: 1, status: 1 });
TimerSchema.index({ shop: 1, "targeting.type": 1 });
TimerSchema.index({ shop: 1, isDeleted: 1 });

/* ===============================
   EXPORT (HOT-RELOAD SAFE)
=============================== */
const Timer =
  mongoose.models.Timer || mongoose.model("Timer", TimerSchema);

export default Timer;