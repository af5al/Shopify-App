// web/index.js
// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";
import { connectMongo } from "./mongo.js";
import routes from "./routes/index.js";
import storefrontTimerRoutes from "./routes/storefronttimer.routes.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

async function startServer() {
  // 1) Connect to MongoDB first
  await connectMongo();

  // 2) Create Express app
  const app = express();

  // 3) Set up Shopify authentication and webhook handling
  app.get(shopify.config.auth.path, shopify.auth.begin());
  app.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot()
  );
  app.post(
    shopify.config.webhooks.path,
    shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
  );

  console.log("Registering storefront timer routes at /apps/countdown-timer");
  app.use("/", storefrontTimerRoutes);

  // If you are adding routes outside of the /api path, remember to
  // also add a proxy rule for them in web/frontend/vite.config.js
  app.use("/api/*", shopify.validateAuthenticatedSession());

  app.use(express.json());

  app.use("/api/v1", routes);

  app.use(shopify.cspHeaders());
  app.use(serveStatic(STATIC_PATH, { index: false }));

  app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(
        readFileSync(join(STATIC_PATH, "index.html"))
          .toString()
          .replace(
            "%VITE_SHOPIFY_API_KEY%",
            process.env.SHOPIFY_API_KEY || ""
          )
      );
  });

  // 4) Start server after Mongo is ready
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

// Run the server
startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
});