# To start shopify admin/merchant app - Setup Instructions

### Prerequisites
- Node.js 18+
- Shopify CLI
- Shopify Partners account

### Steps
1. Clone the repository
2. Run `npm install`
3. Create a Shopify app using Shopify CLI
4. Copy API key & secret into `.env`
5. Create a development store
6. Run `shopify app dev`
7. Install the app on the dev store
8. Enable the Countdown Timer app block on product page

# store access to view product page with timer

-you can check my shopify shop on link 'products-store-9717.myshopify.com'
-password: 'shopifystore@afsal'
-there you can see the timer widget i have given on every single product view

# Project Structure
.
├── web/
│   ├── index.js                # Express server entry
│   ├── routes/                 # Admin & storefront routes
│   ├── models/                 # MongoDB models
|   |__ .env.sample/            # .env.sample
│   └── frontend/               # React admin UI
│
├── extensions/
│   └── countdown-timer-widget/
│       ├── blocks/
│       │   └── countdown-timer.liquid
│       └── assets/
│           └── countdown-timer-widget.js
│
├── shopify.app.toml
└── README.md



