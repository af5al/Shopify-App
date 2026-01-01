// web/shopify.js
import "dotenv/config"; // Load .env file
import { BillingInterval, LATEST_API_VERSION } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
// Remove SQLite import
// import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-10";

// We no longer use a local SQLite file:
// const DB_PATH = `${process.cwd()}/database.sqlite`;

// Example billing config (unchanged)
const billingConfig = {
  "My Shopify One-Time Charge": {
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};

// Create MongoDB-based session storage
// Using MONGO_URI from .env and a database name "shopify_app"
const sessionStorage = new MongoDBSessionStorage(
  process.env.MONGO_URI,
  "shopify_app",                    // database name
  {
    // optional: override default collection name
    // collectionName: "shopify_sessions",
  }
);

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    future: {
      customerAddressDefaultFix: true,
      lineItemBilling: true,
      unstable_managedPricingSupport: true,
    },
    billing: undefined, // or billingConfig if you want billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  // Use MongoDB session storage instead of SQLite
  sessionStorage,
});

export default shopify;